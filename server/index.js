
/**
 * Minimal Smart Doc Checker backend (Express)
 *
 * Features:
 * - POST /api/upload (multer) -> extracts text from uploaded files (.txt, .pdf, .docx)
 * - Calls OpenAI to analyze contradictions and returns structured JSON report
 * - Stores usage and reports in sqlite (data.db)
 * - Socket.IO used to emit progress/status for real-time UI
 * - POST /api/webhook -> accept external doc updates and trigger analysis
 * - POST /api/monitor -> start polling a public URL for updates (simple demonstration)
 *
 * Configure via environment variables (see .env.example).
 *
 * NOTE: Replace OpenAI client usage as needed depending on your OpenAI SDK version.
 */
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { OpenAI } = require('openai');
const http = require('http');
const { Server } = require('socket.io');
const fetch = require('node-fetch');

require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const FLEX_PRICE_PER_DOC = parseFloat(process.env.FLEX_PRICE_PER_DOC || '0.02');
const FLEX_PRICE_PER_REPORT = parseFloat(process.env.FLEX_PRICE_PER_REPORT || '0.05');
const PORT = parseInt(process.env.PORT || '4000');

if(!OPENAI_API_KEY){
  console.warn('⚠️  No OPENAI_API_KEY set — analysis will fail until you add it to .env');
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

const upload = multer({ dest: path.join(__dirname, 'uploads/') });

// init sqlite
const dbFile = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(dbFile);
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    docs_analyzed INTEGER,
    reports_generated INTEGER,
    cost REAL,
    ts INTEGER
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_json TEXT,
    ts INTEGER
  )`);
});

// OpenAI client
const client = new OpenAI({ apiKey: OPENAI_API_KEY });

// helpers to extract text
async function extractTextFromFile(file){
  const p = file.path;
  const mimetype = file.mimetype || '';
  try{
    if(mimetype === 'application/pdf' || p.endsWith('.pdf')){
      const data = fs.readFileSync(p);
      const out = await pdf(data);
      return out.text;
    } else if(mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || p.endsWith('.docx')){
      const buffer = fs.readFileSync(p);
      const result = await mammoth.extractRawText({buffer});
      return result.value;
    } else {
      // fallback to text read
      return fs.readFileSync(p, 'utf8');
    }
  }catch(err){
    console.error('extract error', err);
    return '';
  }
}

// analysis via OpenAI
async function analyzeDocuments(docs){
  // docs: [{name, text}]
  // Build a prompt: ask for contradictions between docs and a structured JSON result
  const prompt = [
    { role: 'system', content: 'You are a precise assistant that finds contradictions across multiple documents. Respond ONLY with valid JSON as specified.'},
    { role: 'user', content: `Analyze the following ${docs.length} documents and find contradictions or conflicts between them. Output JSON with structure:
{
  "contradictions": [
    {
      "id": 1,
      "docs": ["docA", "docB"],
      "summary": "short explanation",
      "excerpt_docA": "...",
      "excerpt_docB": "...",
      "confidence": 0.0
    }
  ],
  "metadata": {
    "numDocs": ${docs.length},
    "timeMs": 0
  }
}
Now documents (name and text):\n\n` + docs.map(d => `===DOCNAME:${d.name}===\n${d.text.substring(0,4000)}`).join('\n\n`) }
  ];

  // emit to client that analysis started
  io.emit('analysis-progress', { stage: 'llm_call' });

  try{
    const res = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: prompt,
      max_tokens: 1500,
      temperature: 0.0
    });

    // Flexible parsing for different SDK shapes:
    let raw = '';
    if(res?.choices && res.choices[0]?.message?.content){
      // some SDKs have message.content as array or string
      raw = Array.isArray(res.choices[0].message.content) ? res.choices[0].message.content.map(c => c.text || '').join('\n') : res.choices[0].message.content;
    } else if(res?.choices && res.choices[0]?.text){
      raw = res.choices[0].text;
    } else if(res?.output && res.output[0] && res.output[0].content && res.output[0].content[0]){
      raw = res.output[0].content[0].text || '';
    }

    // try to extract JSON snippet
    const jsonTextMatch = raw.match(/\{[\s\S]*\}/m);
    const jsonText = jsonTextMatch ? jsonTextMatch[0] : raw;

    let parsed = {};
    try{
      parsed = JSON.parse(jsonText);
    }catch(err){
      parsed = { error: 'Failed to parse LLM output as JSON', raw };
    }

    return parsed;
  }catch(err){
    console.error('OpenAI error', err?.message || err);
    return { error: 'LLM call failed', detail: String(err) };
  }
}

// API: upload and analyze
app.post('/api/upload', upload.array('docs', 3), async (req, res) => {
  const files = req.files || [];
  if(files.length === 0) return res.status(400).json({ error: 'Upload up to 3 files as "docs"' });

  // extract texts
  io.emit('analysis-progress', { stage: 'extracting', total: files.length });
  const docs = [];
  for(let f of files){
    const text = await extractTextFromFile(f);
    docs.push({ name: f.originalname, text });
  }

  io.emit('analysis-progress', { stage: 'calling-llm' });
  const result = await analyzeDocuments(docs);

  // store report
  const now = Date.now();
  const reportJson = JSON.stringify(result);
  db.run('INSERT INTO reports (report_json, ts) VALUES (?, ?)', [reportJson, now], function(err){
    if(err) console.error(err);
  });

  // billing calculation
  const docsAnalyzed = docs.length;
  const reportsGenerated = 1;
  const cost = docsAnalyzed * FLEX_PRICE_PER_DOC + reportsGenerated * FLEX_PRICE_PER_REPORT;
  db.run('INSERT INTO usage (docs_analyzed, reports_generated, cost, ts) VALUES (?, ?, ?, ?)', [docsAnalyzed, reportsGenerated, cost, now]);

  io.emit('analysis-done', { result, cost });

  res.json({ ok: true, result, cost });
});

// get basic usage
app.get('/api/usage', (req, res) => {
  db.get('SELECT SUM(docs_analyzed) as docs, SUM(reports_generated) as reports, SUM(cost) as cost FROM usage', (err, row) => {
    if(err) return res.json({ error: String(err) });
    res.json({ docs: row.docs || 0, reports: row.reports || 0, cost: row.cost || 0 });
  });
});

// get last report
app.get('/api/reports/latest', (req, res) => {
  db.get('SELECT id, report_json, ts FROM reports ORDER BY id DESC LIMIT 1', (err, row) => {
    if(err) return res.json({ error: String(err) });
    if(!row) return res.json({ error: 'no reports' });
    res.json({ id: row.id, report: JSON.parse(row.report_json), ts: row.ts });
  });
});

// webhook endpoint (Pathway simulation) - accept external doc updates
app.post('/api/webhook', async (req, res) => {
  // expected body: { name, text }
  const { name, text } = req.body || {};
  if(!text) return res.status(400).json({ error: 'Provide {name, text} in JSON' });

  // simple analysis: create single-doc vs previous latest to detect contradictions
  // For demo, fetch latest report's docs if any, else just analyze new doc alone.
  io.emit('analysis-progress', { stage: 'webhook-received' });

  // Create "virtual" docs: latest report's content (if any) vs new update
  // For simplicity, analyze new doc alone with itself appended -- LLM will handle.
  const docs = [{ name, text }];

  const result = await analyzeDocuments(docs);

  const now = Date.now();
  const reportJson = JSON.stringify(result);
  db.run('INSERT INTO reports (report_json, ts) VALUES (?, ?)', [reportJson, now]);

  const docsAnalyzed = 1;
  const reportsGenerated = 1;
  const cost = docsAnalyzed * FLEX_PRICE_PER_DOC + reportsGenerated * FLEX_PRICE_PER_REPORT;
  db.run('INSERT INTO usage (docs_analyzed, reports_generated, cost, ts) VALUES (?, ?, ?, ?)', [docsAnalyzed, reportsGenerated, cost, now]);

  io.emit('analysis-done', { result, cost });

  res.json({ ok: true, result, cost });
});

// monitor a public URL for changes (simple polymorphic watcher)
const monitors = {};
app.post('/api/monitor', async (req, res) => {
  const { url, intervalSec = 30, name = 'external-doc' } = req.body || {};
  if(!url) return res.status(400).json({ error: 'Provide url in body' });

  if(monitors[url]) return res.json({ ok: true, message: 'Already monitoring' });

  let lastHash = '';
  const id = setInterval(async () => {
    try{
      const r = await fetch(url);
      const txt = await r.text();
      const hash = require('crypto').createHash('sha1').update(txt).digest('hex');
      if(hash !== lastHash){
        lastHash = hash;
        io.emit('monitor-trigger', { url, ts: Date.now() });
        // trigger analysis via webhook-style flow
        const docs = [{ name, text: txt }];
        const result = await analyzeDocuments(docs);
        const now = Date.now();
        db.run('INSERT INTO reports (report_json, ts) VALUES (?, ?)', [JSON.stringify(result), now]);
        db.run('INSERT INTO usage (docs_analyzed, reports_generated, cost, ts) VALUES (?, ?, ?, ?)', [1,1, FLEX_PRICE_PER_DOC + FLEX_PRICE_PER_REPORT, now]);
        io.emit('analysis-done', { result, cost: FLEX_PRICE_PER_DOC + FLEX_PRICE_PER_REPORT });
      }
    }catch(err){
      console.error('monitor error', err);
    }
  }, Math.max(5000, intervalSec*1000));
  monitors[url] = id;
  res.json({ ok: true, message: 'Monitoring started' });
});

// socket test
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
});

server.listen(PORT, () => {
  console.log('Smart Doc Checker server running on port', PORT);
});
