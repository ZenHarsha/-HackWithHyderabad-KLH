import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SVG Icon Components --- //
const UploadIcon = ({ className = "h-6 w-6 mr-2" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const DocumentIcon = ({className = "h-10 w-10 text-orange-500"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const CheckCircleIcon = ({className = "h-10 w-10 text-green-500"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const AlertTriangleIcon = ({className = "h-10 w-10 text-yellow-500"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const XIcon = ({className="h-5 w-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const RefreshIcon = ({ isSpinning }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${isSpinning ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 16" />
    </svg>
);

const ChatBubbleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10l6-3m0 0l-6-3m6 3V7" /></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a5 5 0 100-10 5 5 0 000 10z" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const CalendarIcon = ({className="h-5 w-5 mr-3 mt-0.5 text-orange-500 flex-shrink-0"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const ChevronDownIcon = ({className="h-4 w-4 ml-1"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
const ChevronUpIcon = ({className="h-4 w-4 ml-1"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>;
const InformationCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


// --- Main App Components --- //

const Navbar = ({ isNightMode, toggleNightMode, searchQuery, setSearchQuery, analysisResult }) => {
  return (
    <nav className="bg-[#E65100] dark:bg-gray-800 shadow-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center flex-grow min-w-0">
            <span className="font-bold text-2xl text-white tracking-wider flex-shrink-0">
              Smart Doc Checker
            </span>
            <AnimatePresence>
            {analysisResult && (
              <motion.div 
                initial={{ width: 0, opacity: 0, marginLeft: 0 }} 
                animate={{ width: '100%', opacity: 1, marginLeft: '2rem' }} 
                exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="relative flex-grow max-w-xl min-w-[200px]"
              >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input 
                      type="text" 
                      placeholder="Search documents..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-full text-sm text-gray-800 dark:text-white bg-white/30 dark:bg-gray-700/50 placeholder-white/70 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
              </motion.div>
            )}
            </AnimatePresence>
          </div>
          <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
            <motion.button onClick={toggleNightMode} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} className="p-2 rounded-full text-white hover:bg-white/20">
                {isNightMode ? <SunIcon /> : <MoonIcon />}
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const InfoCard = ({ icon, title, value, color }) => {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} whileHover={{ scale: 1.05, y: -5 }} className={`bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 border-l-4 ${color} cursor-pointer`}>
            <div className="flex items-center space-x-4">
                <div>{icon}</div>
                <div><p className="text-gray-500 dark:text-gray-300 text-sm font-medium">{title}</p><p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p></div>
            </div>
        </motion.div>
    );
};

const ConflictCard = ({ conflict }) => {
    const severityStyles = { 
        High: { border: "border-red-500", bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-300", tag: "bg-red-200 dark:bg-red-800" }, 
        Medium: { border: "border-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-300", tag: "bg-yellow-200 dark:bg-yellow-800" }, 
        Low: { border: "border-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-300", tag: "bg-blue-200 dark:bg-blue-800" }, 
    };
    const styles = severityStyles[conflict.severity] || {};
    return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className={`p-4 rounded-lg shadow-md mb-4 border-l-4 ${styles.border} ${styles.bg}`}>
        <div className="flex justify-between items-start"><p className="font-bold text-gray-800 dark:text-gray-100">Conflict: {conflict.category}</p><span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles.text} ${styles.tag}`}>{conflict.severity}</span></div>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">{conflict.description}</p>
        <div className="mt-4 pt-3 border-t border-orange-200/50 dark:border-gray-600"><div className="flex items-start"><LightbulbIcon /><div><p className="font-semibold text-sm text-yellow-800 dark:text-yellow-300">AI-Powered Suggestion:</p><p className="text-gray-700 dark:text-gray-200 mt-1 text-sm">{conflict.suggestion}</p></div></div></div>
    </motion.div>)
}

const ReportGenerationModal = ({ progress }) => (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
    <motion.div initial={{ scale: 0.9, y: -20 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md text-center">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Generating Report...</h3><p className="text-gray-600 dark:text-gray-300 mt-2 mb-6">Please wait while we compile the conflict analysis report.</p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden"><motion.div className="bg-gradient-to-r from-orange-400 to-[#FF7A00] h-4 rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "linear" }} /></div>
        <p className="text-lg font-semibold text-[#E65100] dark:text-orange-400 mt-4">{Math.round(progress)}%</p>
    </motion.div>
</motion.div>);

const FileUploadArea = ({ selectedFiles, onFilesChange, onAnalyze, isAnalyzing }) => {
    const fileInputRef = useRef(null); const [isDragging, setIsDragging] = useState(false);
    const handleFileSelect = (e) => { const newFiles = Array.from(e.target.files); onFilesChange([...selectedFiles, ...newFiles]); };
    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); }; const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); const newFiles = Array.from(e.dataTransfer.files); onFilesChange([...selectedFiles, ...newFiles]); };
    const removeFile = (index) => { const updatedFiles = [...selectedFiles]; updatedFiles.splice(index, 1); onFilesChange(updatedFiles); };
    const formatBytes = (bytes, decimals = 2) => { if (bytes === 0) return '0 Bytes'; const k = 1024; const dm = decimals < 0 ? 0 : decimals; const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]; }
    return (<div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Upload Documents</h2>
        <div className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 scale-105' : 'border-gray-300 dark:border-gray-500 hover:border-orange-400 dark:hover:border-orange-500'}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current.click()}>
            <UploadIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-400"/><p className="mt-2 text-gray-600 dark:text-gray-300"><span className="font-semibold text-[#E65100] dark:text-orange-400">Click to upload</span> or drag and drop files here.</p><input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
        </div>
        <AnimatePresence>{selectedFiles.length > 0 && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-6">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Selected Files:</h3><ul className="mt-2 space-y-2">{selectedFiles.map((file, index) => (<motion.li key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-md"><span className="text-sm text-gray-800 dark:text-gray-100 truncate">{file.name} ({formatBytes(file.size)})</span><button onClick={() => removeFile(index)} className="p-1 rounded-full text-gray-400 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-800 hover:text-red-500 dark:hover:text-red-300 transition-colors"><XIcon /></button></motion.li>))}</ul>
            <motion.button onClick={onAnalyze} disabled={isAnalyzing} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full mt-4 bg-gradient-to-r from-orange-500 to-[#FF7A00] text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:bg-gray-400 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed">{isAnalyzing ? 'Analyzing...' : `Analyze ${selectedFiles.length} File(s)`}</motion.button>
        </motion.div>)}</AnimatePresence>
    </div>);
}

const UsageStatsCard = ({ stats }) => ( <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg"> <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Usage Statistics</h3> <div className="space-y-3"> <div className="flex justify-between items-center"> <p className="text-gray-600 dark:text-gray-300">Documents Analyzed</p> <span className="bg-[#FF7A00] text-white text-sm font-bold px-3 py-1 rounded-full">{stats.documents_analyzed}</span> </div> <div className="flex justify-between items-center"> <p className="text-gray-600 dark:text-gray-300">Reports Generated</p> <span className="bg-[#E65100] text-white text-sm font-bold px-3 py-1 rounded-full">{stats.reports_generated}</span> </div> </div> </motion.div> );
const LiveUpdateCard = ({ lastChecked, onCheck, isChecking, newConflicts }) => ( <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg"> <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">External Monitoring</h3> <div className="space-y-4"> <div className="text-sm text-gray-600 dark:text-gray-300"> <p>Monitors external rule webpages for changes.</p> <p>Last checked: <span className="font-semibold">{lastChecked}</span></p> </div> <AnimatePresence mode="wait">{newConflicts !== null && ( <motion.div key={newConflicts} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 p-3 rounded-md border border-green-200 dark:border-green-700"> <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400"/> <p className="text-green-800 dark:text-green-300 font-semibold text-sm">Update check complete. Found {newConflicts} new conflicts.</p> </motion.div> )}</AnimatePresence> <motion.button onClick={onCheck} disabled={isChecking} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full flex items-center justify-center bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"> <RefreshIcon isSpinning={isChecking} />{isChecking ? 'Checking for updates...' : 'Check Now'}</motion.button> </div> </motion.div> );

// --- Ask the Doc Component --- //
const AskTheDoc = ({ analysisResult }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);
    
    useEffect(() => {
        if(analysisResult?.uploadedFiles.length > 0) {
            const fileNames = analysisResult.uploadedFiles.map(f => f.name).join(', ');
            setMessages([{ sender: 'ai', text: `I've analyzed ${fileNames}. Feel free to ask me any questions about their content.` }]);
        }
    }, [analysisResult]);

    const getAIResponse = (query, result) => {
        const lowerQuery = query.toLowerCase();
        
        // Search in conflicts first
        for (const conflict of result.conflicts) {
            if (lowerQuery.split(' ').some(word => conflict.description.toLowerCase().includes(word) && word.length > 3)) {
                return `There is a conflict related to your query: "${conflict.description}". The suggestion is to "${conflict.suggestion}".`;
            }
        }

        // Search in summaries
        for (const summaryItem of result.report.individualSummaries) {
             if (lowerQuery.split(' ').some(word => summaryItem.summary.toLowerCase().includes(word) && word.length > 3)) {
                return `Regarding your question, in ${summaryItem.fileName}, I found the following information: "${summaryItem.summary}". Does this help clarify?`;
            }
        }
        
         // Search in deadlines
        for (const deadline of result.report.deadlines) {
             if (lowerQuery.includes(deadline.date.toLowerCase()) || lowerQuery.split(' ').some(word => deadline.description.toLowerCase().includes(word) && word.length > 4)) {
                return `I found a relevant deadline: On ${deadline.date}, "${deadline.description}" as mentioned in ${deadline.source}.`;
            }
        }

        return "I've checked the documents but couldn't find a direct answer to your question. Could you try rephrasing it, perhaps using keywords from the document summaries?";
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !analysisResult) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        
        setTimeout(() => {
            const aiResponse = getAIResponse(input, analysisResult);
            setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center"><ChatBubbleIcon /> Ask the Doc</h3>
            <div className="bg-white dark:bg-gray-800/50 h-72 rounded-lg flex flex-col p-4">
                <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-2 ${msg.sender === 'user' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'}`}>
                                <p className="text-sm whitespace-pre-line">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                         <div className="flex justify-start">
                             <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-xl px-4 py-2">
                                <div className="flex items-center space-x-1">
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="mt-4 flex space-x-2">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about deadlines, conflicts, etc..." className="flex-grow p-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                    <button type="submit" className="bg-[#FF7A00] hover:bg-[#E65100] text-white font-bold p-2 rounded-lg px-4">Send</button>
                </form>
            </div>
        </motion.div>
    );
};


// --- New Analysis Result Components --- //
const AnalysisResultView = ({ result, onGenerateReport, onReset, isGeneratingReport, searchQuery }) => {
    const hasConflicts = result.conflicts.length > 0;

    const filteredDocs = React.useMemo(() => {
        if (!searchQuery) {
            return result.uploadedFiles;
        }
        const lowerQuery = searchQuery.toLowerCase();
        return result.uploadedFiles.filter(doc => {
            if (doc.name.toLowerCase().includes(lowerQuery)) {
                return true;
            }
            const summaryItem = result.report.individualSummaries.find(s => s.fileName === doc.name);
            if (summaryItem && summaryItem.summary.toLowerCase().includes(lowerQuery)) {
                return true;
            }
            return false;
        });
    }, [searchQuery, result.uploadedFiles, result.report.individualSummaries]);

    return (
        <motion.div key="analysis-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center mb-8">
                {hasConflicts ? (
                    <AlertTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto"/>
                ) : (
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto"/>
                )}
                <h3 className="mt-4 font-semibold text-2xl text-gray-800 dark:text-white">Analysis Complete</h3>
                 <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-3xl mx-auto">
                    {hasConflicts ? `Found ${result.conflicts.length} conflict(s) that require your attention. Review the details below.` : 'No direct conflicts were found. Review the AI summary and key deadlines.'}
                 </p>
            </div>
            
            <AskTheDoc analysisResult={result} />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
                {/* Left Column: Conflicts & AI Summary */}
                <div className="lg:col-span-3 space-y-8">
                    {/* AI Summary Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
                         <h4 className="font-bold text-lg text-orange-600 dark:text-orange-400 mb-3">Document Summaries</h4>
                         <div className="space-y-4">
                            {result.report.individualSummaries.map((item, index) => (
                                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                                    <p className="font-semibold text-gray-800 dark:text-gray-100">{item.fileName}</p>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-line">{item.summary}</p>
                                </div>
                            ))}
                         </div>
                    </motion.div>

                    {/* Conflicts Card */}
                    <div>
                        <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-3">{hasConflicts ? 'Detected Conflicts' : 'Conflict Check'}</h4>
                        {hasConflicts ? (
                            result.conflicts.map(c => <ConflictCard key={c.id} conflict={c} />)
                        ) : (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 dark:text-gray-400 py-12 flex flex-col items-center bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <CheckCircleIcon className="h-12 w-12 text-green-500"/>
                                <p className="mt-4 font-semibold text-lg">No conflicts detected.</p>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Right Column: Deadlines & Files */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Deadlines Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/60 dark:bg-gray-700/30 p-6 rounded-xl shadow-lg">
                        <h4 className="font-bold text-lg text-orange-600 dark:text-orange-400 mb-3">Key Deadlines Detected</h4>
                        {result.report.deadlines.length > 0 ? (
                            <ul className="space-y-3">
                                {result.report.deadlines.map((item, index) => (
                                    <li key={index} className="flex items-start text-sm">
                                        <CalendarIcon />
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-gray-100">{item.date}</p>
                                            <p className="text-gray-500 dark:text-gray-400">{item.description} (Source: <span className="italic">{item.source}</span>)</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No specific deadlines were extracted from these documents.</p>
                        )}
                    </motion.div>

                    {/* Analyzed Files Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/60 dark:bg-gray-700/30 p-6 rounded-xl shadow-lg">
                        <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-3">
                             {searchQuery ? `Search Results (${filteredDocs.length})` : 'Analyzed Documents'}
                        </h4>
                        {filteredDocs.length > 0 ? (
                            <ul className="space-y-2">
                                {filteredDocs.map((doc, index) => (
                                    <li key={index} className="flex items-center text-sm bg-gray-100 dark:bg-gray-700/50 p-2 rounded-md">
                                        <DocumentIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                                        <span className="text-gray-700 dark:text-gray-200">{doc.name}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">No documents match your search.</p>
                        )}
                    </motion.div>
                </div>
            </div>


            <div className="mt-12 flex justify-center space-x-4">
                 {hasConflicts && !isGeneratingReport && (
                    <motion.button 
                        onClick={onGenerateReport} 
                        whileHover={{ scale: 1.05, y: -2 }} 
                        whileTap={{ scale: 0.95 }} 
                        className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">
                        <DownloadIcon />Download Conflict Report
                    </motion.button>
                )}
                 <motion.button 
                    onClick={onReset} 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 font-bold py-2 px-6 rounded-lg">
                    Analyze New Files
                </motion.button>
            </div>
        </motion.div>
    );
};


// --- Tabbed View Components --- //
const DashboardView = ({ 
    isLoading, usageStats, lastCheckedTime, 
    handleCheckUpdates, isCheckingUpdates, newConflictsFound, 
    selectedFiles, setSelectedFiles, handleAnalyzeFiles, 
    handleGenerateReport, isGeneratingReport,
    analysisResult, handleResetAnalysis,
    searchQuery
}) => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <InfoCard icon={<DocumentIcon />} title="Total Documents Scanned" value="1,428" color="border-orange-500" />
            <InfoCard icon={<CheckCircleIcon />} title="Checks Passed" value="1,390" color="border-green-500" />
            <InfoCard icon={<AlertTriangleIcon />} title="Issues Found" value={analysisResult ? analysisResult.conflicts.length : '...'} color="border-yellow-500" />
        </div>

        {/* Conditional Uploader vs. Results */}
        {!analysisResult && !isLoading && (
            <FileUploadArea 
                selectedFiles={selectedFiles} 
                onFilesChange={setSelectedFiles} 
                onAnalyze={handleAnalyzeFiles} 
                isAnalyzing={isLoading}
            />
        )}

        {/* Analysis Result Display */}
        <AnimatePresence mode="wait">
        {(isLoading || analysisResult) && (
            <motion.div 
                key={isLoading ? 'loading' : 'results'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg min-h-[300px] mt-8">
                 {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full pt-10 text-gray-500 dark:text-gray-400">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4" style={{borderTopColor: '#FF7A00'}}></div>
                        <p className="font-semibold">Analyzing sample dataset...</p>
                        <p className="text-sm">Please wait a moment.</p>
                    </div>
                 ) : (
                    analysisResult && (
                        <AnalysisResultView
                            result={analysisResult}
                            onGenerateReport={handleGenerateReport}
                            onReset={handleResetAnalysis}
                            isGeneratingReport={isGeneratingReport}
                            searchQuery={searchQuery}
                        />
                    )
                 )}
            </motion.div>
        )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
            <UsageStatsCard stats={usageStats} />
            <LiveUpdateCard lastChecked={lastCheckedTime} onCheck={handleCheckUpdates} isChecking={isCheckingUpdates} newConflicts={newConflictsFound}/>
        </div>
    </>
);

const DocumentsView = ({ analysisResult, searchQuery, handleDeleteDocument }) => {
    const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

    const sortedDocuments = React.useMemo(() => {
        if (!analysisResult?.uploadedFiles) return [];

        const filteredDocs = analysisResult.uploadedFiles.filter(doc =>
            doc.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        let sortableItems = [...filteredDocs];
        const criticalityOrder = { High: 3, Medium: 2, Low: 1 };

        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                
                if (sortConfig.key === 'criticality') {
                    aValue = criticalityOrder[aValue];
                    bValue = criticalityOrder[bValue];
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [analysisResult, sortConfig, searchQuery]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortButton = ({ sortKey, children }) => {
        const isActive = sortConfig.key === sortKey;
        return (
             <button onClick={() => requestSort(sortKey)} className={`flex items-center px-3 py-1 text-xs font-semibold rounded-full transition-colors ${isActive ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                {children}
                {isActive && (sortConfig.direction === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />)}
            </button>
        );
    }
    
    if (!analysisResult) {
        return (
            <div className="text-center text-gray-500 dark:text-gray-400 py-20 bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <DocumentTextIcon className="h-16 w-16 mx-auto text-gray-400" />
                <p className="mt-4 font-semibold text-lg">
                    {searchQuery ? "No documents match your search." : "No documents to display."}
                </p>
                {!searchQuery && <p>Please run an analysis from the Dashboard first.</p>}
            </div>
        );
    }

    return (
        <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">
                    {searchQuery ? `Search Results (${sortedDocuments.length})` : `Analyzed Documents (${sortedDocuments.length})`}
                </h3>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Sort by:</span>
                    <SortButton sortKey="name">Name</SortButton>
                    <SortButton sortKey="timestamp">Date</SortButton>
                    <SortButton sortKey="category">Category</SortButton>
                    <SortButton sortKey="criticality">Criticality</SortButton>
                </div>
            </div>

            <div className="space-y-3">
                <AnimatePresence>
                {sortedDocuments.length > 0 ? sortedDocuments.map((doc, index) => {
                    const criticalityStyles = {
                        High: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
                        Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
                        Low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
                    };
                    return (
                    <motion.div 
                        key={doc.name}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="grid grid-cols-12 gap-4 items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:shadow-md transition-shadow"
                    >
                        <div className="col-span-12 sm:col-span-5 flex items-center min-w-0">
                             <DocumentIcon className="h-6 w-6 mr-3 text-gray-500 flex-shrink-0" />
                             <span className="font-semibold text-gray-800 dark:text-white truncate" title={doc.name}>{doc.name}</span>
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                             <span className="text-sm text-gray-600 dark:text-gray-300">{doc.category}</span>
                        </div>
                        <div className="col-span-6 sm:col-span-2">
                             <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(doc.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="col-span-12 sm:col-span-2 flex items-center sm:justify-end space-x-3">
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${criticalityStyles[doc.criticality]}`}>
                                {doc.criticality}
                            </span>
                             <button onClick={() => handleDeleteDocument(doc.name)} className="p-1 rounded-full text-gray-400 hover:bg-red-100 dark:hover:bg-red-800 hover:text-red-500 dark:hover:text-red-300 transition-colors">
                                <XIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                )}) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                        <p>No documents match your search criteria.</p>
                    </div>
                )}
                </AnimatePresence>
            </div>
        </div>
    );
};


const ConflictMapView = ({ analysisResult }) => {
    const [mapData, setMapData] = useState({ docs: [], conflicts: [] });
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        if (analysisResult) {
            const docs = analysisResult.uploadedFiles.map((doc, i) => ({
                id: doc.name,
                name: doc.name,
                x: 10 + Math.random() * 80, // Random positions
                y: 10 + Math.random() * 80,
            }));

            const conflicts = analysisResult.conflicts.map(c => ({
                from: c.fromDoc,
                to: c.toDoc,
                severity: c.severity,
                description: c.description
            }));
            
            setMapData({ docs, conflicts });
        } else {
             setMapData({ docs: [], conflicts: [] });
        }
    }, [analysisResult]);


    return (<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg min-h-[500px] relative overflow-hidden">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Conflict Visualization</h3>
            {mapData.docs.length > 0 ? (
                <>
                <svg className="absolute top-0 left-0 w-full h-full" style={{zIndex: 0}}>
                    {mapData.conflicts.map((conflict, i) => {
                        const fromNode = mapData.docs.find(d => d.id === conflict.from);
                        const toNode = mapData.docs.find(d => d.id === conflict.to);
                        if(!fromNode || !toNode) return null;
                        const isSelected = selected?.from === conflict.from && selected?.to === conflict.to;
                        return <motion.line key={i} x1={`${fromNode.x}%`} y1={`${fromNode.y}%`} x2={`${toNode.x}%`} y2={`${toNode.y}%`} stroke={conflict.severity === 'High' ? '#EF4444' : '#F59E0B'} strokeWidth={isSelected ? 4 : 2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: i * 0.2}} className="cursor-pointer" onClick={() => setSelected(conflict)} />
                    })}
                </svg>
                {mapData.docs.map(doc => { const isSelected = selected?.id === doc.id; return <motion.div key={doc.id} style={{ left: `${doc.x}%`, top: `${doc.y}%` }} className={`absolute -translate-x-1/2 -translate-y-1/2 z-10`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} whileHover={{ scale: 1.2, zIndex: 20 }} onClick={() => setSelected(doc)}> <div className={`p-2 rounded-full cursor-pointer transition-all shadow-md ${isSelected ? 'bg-orange-500' : 'bg-white dark:bg-gray-800'}`}><DocumentIcon className="h-8 w-8 text-orange-600"/></div> <span className="text-xs font-semibold text-gray-700 bg-white/70 dark:bg-gray-900/70 dark:text-gray-200 px-2 py-1 rounded-md absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap shadow">{doc.name}</span> </motion.div> })}
                </>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 pt-20">Run an analysis to visualize conflicts between documents.</p>
            )}
        </div>
        <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg"><h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Details</h3><AnimatePresence mode="wait">{selected ? <motion.div key={selected.id || selected.from} initial={{ opacity: 0}} animate={{ opacity: 1}} exit={{ opacity: 0}} className="space-y-2 text-sm"><p className="font-bold text-lg text-orange-600 dark:text-orange-400">{selected.name || `${selected.from} ↔ ${selected.to}`}</p>{selected.severity && <p className="text-gray-700 dark:text-gray-200"><span className="font-semibold">Severity:</span> <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${selected.severity === 'High' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>{selected.severity}</span></p>}{selected.description && <p className="text-gray-700 dark:text-gray-200"><span className="font-semibold">Description:</span> {selected.description}</p>}</motion.div> : <p className="text-gray-500 dark:text-gray-400 text-sm">Click a document or conflict line to see details.</p>}</AnimatePresence></div>
    </div>);
}

const AnalysisHistoryView = ({ history, onViewHistoryItem }) => {
    return (
        <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Analysis History</h3>
            {history.length > 0 ? (
                <ul className="space-y-4">
                    {history.map((item, i) => (
                        <motion.li 
                            key={item.id} 
                            initial={{ opacity: 0, x: -20 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            transition={{ delay: i * 0.1 }}
                            className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:shadow-md hover:bg-orange-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
                            onClick={() => onViewHistoryItem(item.id)}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-white">
                                        {item.result.uploadedFiles.length} file(s) analyzed
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {item.timestamp.toLocaleString()}
                                    </p>
                                </div>
                                <div className={`px-3 py-1 text-sm font-semibold rounded-full ${item.result.conflicts.length > 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'}`}>
                                    {item.result.conflicts.length} conflict(s)
                                </div>
                            </div>
                        </motion.li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">No analyses have been run yet.</p>
            )}
        </div>
    );
};

const CalendarView = ({ analysisResult }) => {
    const [currentDate, setCurrentDate] = useState(new Date('2025-10-15')); // Default to a month with mock data
    const [selectedDate, setSelectedDate] = useState(null);

    const deadlines = React.useMemo(() => analysisResult?.report?.deadlines.map(d => ({
        ...d,
        dateObj: new Date(d.date)
    })) || [], [analysisResult]);

    useEffect(() => {
        const today = new Date();
        const todayStr = today.toDateString();
        const todayDeadline = deadlines.find(d => d.dateObj.toDateString() === todayStr);
        if (todayDeadline) {
            setSelectedDate(today);
        } else if (deadlines.length > 0) {
            setSelectedDate(deadlines[0].dateObj);
        }
    }, [deadlines]);
    

    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const numDays = endDay.getDate();
    const startDayOfWeek = startDay.getDay();

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
        days.push(null);
    }
    for (let i = 1; i <= numDays; i++) {
        days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    const changeMonth = (offset) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };
    
    const selectedDateDeadlines = deadlines.filter(d => selectedDate && d.dateObj.toDateString() === selectedDate.toDateString());

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                 <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><ChevronLeftIcon/></button>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><ChevronRightIcon/></button>
                 </div>
                 <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 dark:text-gray-400 font-semibold">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-2">{day}</div>)}
                 </div>
                 <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => {
                        if (!day) return <div key={`empty-${index}`}></div>;
                        const isToday = day.toDateString() === new Date().toDateString();
                        const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
                        const dayDeadlines = deadlines.filter(d => d.dateObj.toDateString() === day.toDateString());
                        const hasDeadline = dayDeadlines.length > 0;

                        return (
                            <div key={index} onClick={() => setSelectedDate(day)}
                                className={`p-2 h-20 flex flex-col items-center justify-start rounded-lg cursor-pointer transition-colors duration-200 
                                ${isSelected ? 'bg-orange-500 text-white' : 'hover:bg-orange-100 dark:hover:bg-gray-600'}
                                ${isToday && !isSelected ? 'bg-orange-100/50 dark:bg-orange-900/30' : ''}
                                `}>
                                <span className={`font-bold ${isSelected ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>{day.getDate()}</span>
                                {hasDeadline && (
                                    <div className="mt-1 flex flex-col items-center space-y-1">
                                    {dayDeadlines.slice(0, 2).map((d, i) => (
                                        <div key={i} className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-red-500'}`}></div>
                                    ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                 </div>
            </div>
            <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                    Deadlines for {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : '...'}
                </h3>
                <AnimatePresence>
                {selectedDateDeadlines.length > 0 ? (
                     <ul className="space-y-4">
                        {selectedDateDeadlines.map((item, index) => (
                            <motion.li 
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: index * 0.1}}
                                className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                            >
                                <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{item.description}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Source: <span className="italic">{item.source}</span></p>
                            </motion.li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No deadlines for this date.</p>
                )}
                </AnimatePresence>
            </div>
        </div>
    )
}

const SettingsView = () => {
    const [slackNotifications, setSlackNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [collaboration, setCollaboration] = useState(true);

    const ToggleSwitch = ({ enabled, setEnabled }) => (<div onClick={() => setEnabled(!enabled)} className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${enabled ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'}`}><motion.div layout transition={{ type: 'spring', stiffness: 700, damping: 30 }} className="w-6 h-6 bg-white rounded-full shadow-md" /></div>);
    
    return (<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg space-y-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Multilingual Support</h3><p className="text-sm text-gray-600 dark:text-gray-300">Translate documents and check for conflicts across languages.</p>
            <div><label htmlFor="language-select" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Translate To:</label><select id="language-select" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"><option>English (Default)</option><option>Spanish</option><option>French</option><option>German</option></select></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg space-y-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Smart Notifications</h3><p className="text-sm text-gray-600 dark:text-gray-300">Get alerts when new conflicts are found by external monitoring.</p>
            <div className="flex items-center justify-between"><label className="text-gray-700 dark:text-gray-200">Slack Alerts</label><ToggleSwitch enabled={slackNotifications} setEnabled={setSlackNotifications} /></div>
            <div className="flex items-center justify-between"><label className="text-gray-700 dark:text-gray-200">Email Alerts</label><ToggleSwitch enabled={emailNotifications} setEnabled={setEmailNotifications} /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg space-y-4 md:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Collaborative Resolution</h3>
            <div className="flex items-center justify-between"><p className="text-sm text-gray-600 dark:text-gray-300">Allow team members to vote on and approve suggested resolutions.</p><ToggleSwitch enabled={collaboration} setEnabled={setCollaboration} /></div>
            <div className={`transition-opacity duration-300 ${collaboration ? 'opacity-100' : 'opacity-50'}`}>
                <h4 className="font-semibold mt-4 text-gray-800 dark:text-white">Team Members</h4>
                <div className="flex -space-x-2 overflow-hidden mt-2"><img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://placehold.co/100x100/f87171/ffffff?text=AV" alt=""/><img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://placehold.co/100x100/60a5fa/ffffff?text=BW" alt=""/><img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://placehold.co/100x100/34d399/ffffff?text=CJ" alt=""/></div>
            </div>
        </motion.div>
    </div>);
}

const AboutView = () => {
    const FeatureCard = ({ icon, title, description }) => (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="flex items-center mb-3">
                <span className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-full mr-4">{icon}</span>
                <h4 className="font-bold text-lg text-gray-800 dark:text-white">{title}</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
        </div>
    );

    return (
        <div className="bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-8 rounded-xl shadow-lg">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white">About Smart Doc Checker</h2>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    An intelligent platform designed to streamline your document management workflow by automatically detecting conflicts, summarizing content, and tracking key information.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<UploadIcon className="h-6 w-6 text-orange-600 dark:text-orange-400"/>}
                    title="Document Analysis"
                    description="Upload multiple documents at once. Our AI scans and processes them to understand the content, structure, and key data points."
                />
                <FeatureCard 
                    icon={<AlertTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400"/>}
                    title="Conflict Detection"
                    description="Automatically identifies contradictions between documents, such as conflicting dates, payment terms, or legal clauses, saving you hours of manual review."
                />
                 <FeatureCard 
                    icon={<LightbulbIcon />}
                    title="AI Suggestions"
                    description="For every conflict detected, our system provides an intelligent, actionable suggestion to help you resolve the issue quickly and efficiently."
                />
                <FeatureCard 
                    icon={<ChatBubbleIcon />}
                    title="Ask the Doc"
                    description="Engage in a conversation with your documents. Ask questions about deadlines, summaries, or specific clauses and get instant answers."
                />
                 <FeatureCard 
                    icon={<MapIcon className="h-6 w-6 mr-0 text-indigo-600 dark:text-indigo-400"/>}
                    title="Conflict Visualization"
                    description="Our interactive map provides a visual representation of how your documents are interconnected and where conflicts exist between them."
                />
                <FeatureCard 
                    icon={<CalendarIcon className="h-6 w-6 mr-0 text-red-600 dark:text-red-400"/>}
                    title="Deadline Tracking"
                    description="The system automatically extracts key dates and deadlines from your documents and organizes them in an easy-to-use calendar view."
                />
            </div>
        </div>
    );
};

const ProfileView = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        occupation: 'Project Manager',
        country: 'United States',
        id: 'usr_1a2b3c4d5e',
        phone: '+1 (555) 123-4567'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({...prev, [name]: value}));
    }

    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically make an API call to save the data
        console.log("Saved data:", userData);
    }
    
    const ProfileField = ({ label, value, name, isEditing }) => (
         <div className="flex justify-between items-center border-b pb-3 border-gray-200 dark:border-gray-600">
            <span className="font-semibold text-gray-700 dark:text-gray-200">{label}:</span> 
            {isEditing ? (
                 <input 
                    type="text" 
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    className="w-2/3 p-1 rounded-md border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 text-right"
                 />
            ) : (
                <span className="text-gray-600 dark:text-gray-300">{value}</span>
            )}
        </div>
    )

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="md:col-span-1 bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center flex flex-col items-center">
                <img className="h-32 w-32 rounded-full ring-4 ring-orange-500/50" src={`https://placehold.co/200x200/FF7A00/FFFFFF?text=${userData.name.charAt(0)}`} alt="User Profile"/>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-4">{userData.name}</h3>
                <p className="text-gray-500 dark:text-gray-400">{userData.email}</p>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">User ID: {userData.id}</p>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.1 }}
                className="md:col-span-2 bg-white/60 dark:bg-gray-700/30 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">User Information</h3>
                    {!isEditing && (
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsEditing(true)} className="text-orange-600 dark:text-orange-400 hover:underline font-semibold">Edit</motion.button>
                    )}
                 </div>
                 <div className="space-y-4">
                    <ProfileField label="Full Name" name="name" value={userData.name} isEditing={isEditing}/>
                    <ProfileField label="Email" name="email" value={userData.email} isEditing={isEditing} />
                    <ProfileField label="Occupation" name="occupation" value={userData.occupation} isEditing={isEditing} />
                    <ProfileField label="Country" name="country" value={userData.country} isEditing={isEditing} />
                    <ProfileField label="Phone Number" name="phone" value={userData.phone} isEditing={isEditing}/>
                 </div>
                 <div className="mt-8 flex items-center justify-between">
                    {isEditing ? (
                        <div className="w-full flex space-x-4">
                             <motion.button onClick={handleSave} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg">Save Changes</motion.button>
                             <motion.button onClick={() => setIsEditing(false)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 font-bold py-2 px-6 rounded-lg">Cancel</motion.button>
                        </div>
                    ) : (
                         <motion.button 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }} 
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg">
                            Sign Out
                        </motion.button>
                    )}
                 </div>
            </motion.div>
        </div>
    );
};

// --- Mock Data Generation ---
const mockUsageStats = { documents_analyzed: 342, reports_generated: 58 };

const getFileCategory = (fileName) => {
    const lower = fileName.toLowerCase();
    if (lower.includes('contract') || lower.includes('nda') || lower.includes('agreement') || lower.includes('academic') || lower.includes('rules')) return 'Legal & Compliance';
    if (lower.includes('invoice') || lower.includes('plan')) return 'Financial & Planning';
    if (lower.includes('sow') || lower.includes('scope')) return 'Operational';
    if (lower.includes('syllabus')) return 'Academic';
    return 'General';
};

const getFileCriticality = (fileName, conflicts) => {
    const highConflict = conflicts.find(c => (c.fromDoc === fileName || c.toDoc === fileName) && c.severity === 'High');
    if (highConflict) return 'High';
    const mediumConflict = conflicts.find(c => (c.fromDoc === fileName || c.toDoc === fileName) && c.severity === 'Medium');
    if (mediumConflict) return 'Medium';
    return 'Low';
};

const generateMockSummary = (fileName) => {
    const lowerCaseName = fileName.toLowerCase();
    if (lowerCaseName.includes('contract')) {
        return `This Services Agreement, effective September 1, 2025, is between "Innovate LLC" and "ClientCorp". Innovate LLC will provide software development services. Key clauses include a payment schedule of 50% upfront and 50% on completion (Net 30), a project timeline of 3 months, a confidentiality period of 5 years, and a 30-day notice for termination. Intellectual property for all created software is transferred to ClientCorp upon final payment.`;
    }
    if (lowerCaseName.includes('invoice')) {
        return `Invoice #INV-2025-098 for ClientCorp, dated October 15, 2025. This invoice covers "Phase 1 Development Services" with a total amount due of $15,400. Payment is due within 15 days (Net 15), by October 30, 2025. Late payments are subject to a 1.5% monthly interest charge.`;
    }
    if (lowerCaseName.includes('nda')) {
         return `This Mutual Non-Disclosure Agreement is between "Innovate LLC" and "AlphaTech". The term of confidentiality is defined as 3 years from the effective date of September 5, 2025. It strictly defines "Confidential Information" and outlines legal repercussions for any breach, including injunctive relief.`;
    }
     if (lowerCaseName.includes('sow')) {
        return `This Scope of Work (SOW) document defines the project "Phoenix". Key deliverables include a user authentication module, a dashboard component, and API integration. The project completion date is set for December 20th, 2025. Out-of-scope items include mobile application development and post-launch marketing.`;
    }
    if (lowerCaseName.includes('plan')) {
        return `The "Phoenix" project plan outlines four major milestones. Milestone 3, "API Integration," is scheduled for November 15th, 2025. The plan identifies a critical risk related to third-party API availability and assigns a mitigation strategy. The total allocated budget is $30,000.`;
    }
    if (lowerCaseName.includes('syllabus')) {
        return `This syllabus for course "CS-101" lists the final project deadline as December 12, 2025, at 10:00 PM. It states that late submissions will be penalized by 10% per day. The grading is weighted, with the final project accounting for 40% of the total grade.`;
    }
    if (lowerCaseName.includes('academicregulations')) {
        return `The University Academic Regulations state that all final coursework for the Fall 2025 semester must be submitted by 11:59 PM on the final day of exams, December 14, 2025. Any submission after this universal deadline will not be accepted without official documentation.`;
    }
    return `This document, "${fileName}", contains general information. Key sections include an introduction, procedural guidelines, and a contact list. No critical action items, specific dates, or financial figures were prominently identified during the automated summary scan.`;
};

const generateMockConflicts = (fileNames) => {
    const conflicts = [];
    const lowerCaseFileNames = fileNames.map(f => f.toLowerCase());
    
    const findFile = (keyword) => fileNames[lowerCaseFileNames.findIndex(name => name.includes(keyword))];

    if (lowerCaseFileNames.some(f => f.includes('contract')) && lowerCaseFileNames.some(f => f.includes('invoice'))) {
        const contractFile = findFile('contract');
        const invoiceFile = findFile('invoice');
        conflicts.push({ id: 1, fromDoc: contractFile, toDoc: invoiceFile, description: `Payment terms in '${contractFile}' (Net 30) contradict the due date in '${invoiceFile}' (Net 15).`, severity: "High", category: "Financial", suggestion: "Align payment terms across both documents. It is recommended to adhere to the 'Net 15' term from the invoice to ensure prompt payment." });
    }
     if (lowerCaseFileNames.some(f => f.includes('nda')) && lowerCaseFileNames.some(f => f.includes('contract'))) {
        const ndaFile = findFile('nda');
        const contractFile = findFile('contract');
        conflicts.push({ id: 2, fromDoc: ndaFile, toDoc: contractFile, description: `Confidentiality period in '${ndaFile}' (3 years) conflicts with the term in '${contractFile}' (5 years).`, severity: "High", category: "Legal", suggestion: "Consult legal counsel. It is critical to unify the confidentiality term. A 5-year term generally offers stronger protection." });
    }
    if (lowerCaseFileNames.some(f => f.includes('sow')) && lowerCaseFileNames.some(f => f.includes('plan'))) {
        const scopeFile = findFile('sow');
        const planFile = findFile('plan');
        conflicts.push({ id: 3, fromDoc: scopeFile, toDoc: planFile, description: `The completion date in '${scopeFile}' (December 20th) is different from the final milestone in the '${planFile}' (November 15th).`, severity: "Medium", category: "Operational", suggestion: "Re-evaluate the project timeline. Clarify if the 'plan' milestone is for a specific feature or the entire project, and align it with the SOW's final delivery date." });
    }
    if (lowerCaseFileNames.some(f => f.includes('syllabus')) && lowerCaseFileNames.some(f => f.includes('academicregulations'))) {
        const syllabusFile = findFile('syllabus');
        const rulesFile = findFile('academicregulations');
        conflicts.push({ id: 4, fromDoc: syllabusFile, toDoc: rulesFile, description: `Submission time in '${syllabusFile}' (10:00 PM) is earlier than the university-wide deadline in '${rulesFile}' (11:59 PM).`, severity: "Low", category: "Academic", suggestion: "While not a direct contradiction, it's recommended to adjust the syllabus time to 11:59 PM to align with university policy and provide maximum flexibility to students." });
    }
    return conflicts;
}

const MainApp = ({ isNightMode, toggleNightMode }) => {
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [reportProgress, setReportProgress] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [analysisHistory, setAnalysisHistory] = useState([]);
    const [usageStats, setUsageStats] = useState({ documents_analyzed: 0, reports_generated: 0 });
    const [lastCheckedTime, setLastCheckedTime] = useState('N/A');
    const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);
    const [newConflictsFound, setNewConflictsFound] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    
    const fetchUsageStats = () => { setTimeout(() => { setUsageStats(mockUsageStats); }, 800); };
    const handleCheckUpdates = () => { setIsCheckingUpdates(true); setNewConflictsFound(null); setTimeout(() => { const found = Math.floor(Math.random() * 3); setNewConflictsFound(found); setLastCheckedTime(new Date().toLocaleTimeString()); setIsCheckingUpdates(false); }, 2000); };

    const loadSampleData = () => {
        setIsLoading(true);
        const sampleFiles = [
            { name: 'ServicesContract_Innovate_ClientCorp.pdf', size: 302145 },
            { name: 'Invoice_INV-2025-098.pdf', size: 120456 },
            { name: 'Mutual_NDA_AlphaTech.pdf', size: 250333 },
            { name: 'SOW_ProjectPhoenix.docx', size: 540888 },
            { name: 'ProjectPlan_Phoenix_v2.pptx', size: 1250450 },
            { name: 'CS101_Syllabus_Fall25.pdf', size: 450678 },
            { name: 'University_AcademicRegulations_2025.pdf', size: 870990 },
        ];
        const fileNames = sampleFiles.map(f => f.name);

        setTimeout(() => {
            const newConflicts = generateMockConflicts(fileNames);
            const uploadedFilesWithMetadata = fileNames.map(name => ({
                name: name,
                timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30),
                category: getFileCategory(name),
                criticality: getFileCriticality(name, newConflicts),
            }));
            
            const individualSummaries = sampleFiles.map(file => ({
                fileName: file.name,
                summary: generateMockSummary(file.name)
            }));
            
            const newReport = {
                individualSummaries: individualSummaries,
                deadlines: [
                    { date: 'October 10, 2025', description: 'Project Phoenix Kick-off Meeting', source: 'ProjectPlan_Phoenix_v2.pptx' },
                    { date: 'October 15, 2025', description: 'Invoice #INV-2025-098 issued.', source: 'Invoice_INV-2025-098.pdf' },
                    { date: 'October 30, 2025', description: 'Invoice #INV-2025-098 payment due.', source: 'Invoice_INV-2025-098.pdf' },
                    { date: 'November 1, 2025', description: 'Milestone 2 Review Meeting', source: 'ProjectPlan_Phoenix_v2.pptx' },
                    { date: 'November 15, 2025', description: 'API Integration Milestone Due', source: 'ProjectPlan_Phoenix_v2.pptx' },
                    { date: 'December 1, 2025', description: 'Final Project Presentation Day', source: 'CS101_Syllabus_Fall25.pdf' },
                    { date: 'December 12, 2025', description: 'CS-101 Final Project Submission (10:00 PM)', source: 'CS101_Syllabus_Fall25.pdf' },
                    { date: 'December 14, 2025', description: 'University Coursework Final Deadline (11:59 PM)', source: 'University_AcademicRegulations_2025.pdf' },
                    { date: 'December 20, 2025', description: 'Project "Phoenix" completion date.', source: 'SOW_ProjectPhoenix.docx' },
                ],
            };
            
            const result = { 
                conflicts: newConflicts, 
                report: newReport,
                uploadedFiles: uploadedFilesWithMetadata
            };
            setAnalysisResult(result);
            const historyItem = { id: new Date().getTime(), timestamp: new Date(), result: result };
            setAnalysisHistory([historyItem]);
            setIsLoading(false);
        }, 2500);
    };
    
    useEffect(() => { 
        loadSampleData();
        fetchUsageStats(); 
        setLastCheckedTime(new Date(Date.now() - 3600 * 1000).toLocaleTimeString()) 
    }, []);

    const handleAnalyzeFiles = () => {
        if (selectedFiles.length === 0) return;
        setIsLoading(true);
        setAnalysisResult(null);
        
        setTimeout(() => {
            const fileNames = selectedFiles.map(f => f.name);
            const newConflicts = generateMockConflicts(fileNames);
             const uploadedFilesWithMetadata = fileNames.map(name => ({
                name: name,
                timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7),
                category: getFileCategory(name),
                criticality: getFileCriticality(name, newConflicts),
            }));
            
            const individualSummaries = selectedFiles.map(file => ({
                fileName: file.name,
                summary: generateMockSummary(file.name)
            }));
            
            const newReport = {
                individualSummaries: individualSummaries,
                deadlines: [], // Simplified for new uploads, can be expanded
            };
            
            const result = { 
                conflicts: newConflicts, 
                report: newReport,
                uploadedFiles: uploadedFilesWithMetadata
            };
            setAnalysisResult(result);
            const historyItem = { id: new Date().getTime(), timestamp: new Date(), result: result };
            setAnalysisHistory(prev => [historyItem, ...prev]);
            setIsLoading(false);
        }, 2000);
    };
    
    const handleViewHistoryItem = (id) => {
        const historyItem = analysisHistory.find(item => item.id === id);
        if (historyItem) {
            setAnalysisResult(historyItem.result);
            setActiveTab('dashboard');
        }
    };

    const handleResetAnalysis = () => {
        setSelectedFiles([]);
        setAnalysisResult(null);
        setSearchQuery('');
    };

    const handleDeleteDocument = (docNameToDelete) => {
        if (!analysisResult) return;
        const updatedResult = { ...analysisResult, uploadedFiles: analysisResult.uploadedFiles.filter(doc => doc.name !== docNameToDelete) };
        updatedResult.conflicts = updatedResult.conflicts.filter( conflict => conflict.fromDoc !== docNameToDelete && conflict.toDoc !== docNameToDelete );
        updatedResult.report.individualSummaries = updatedResult.report.individualSummaries.filter( summary => summary.fileName !== docNameToDelete );
        setAnalysisResult(updatedResult);
    };

    const handleGenerateReport = () => { setIsGeneratingReport(true); setReportProgress(0); const progressInterval = setInterval(() => { setReportProgress(prev => Math.min(prev + 5, 95)); }, 150); setTimeout(() => { const blob = new Blob([`Mock Conflict Report\n\nGenerated on: ${new Date().toISOString()}`], { type: 'text/plain' }); const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = "Mock_Conflict_Report.txt"; document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url); document.body.removeChild(a); clearInterval(progressInterval); setReportProgress(100); setTimeout(() => setIsGeneratingReport(false), 800); }, 3000); };

    const TabButton = ({ tabId, activeTab, setActiveTab, children }) => (
        <button onClick={() => setActiveTab(tabId)} className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors relative ${ activeTab === tabId ? 'text-orange-700 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-orange-100/50 dark:hover:bg-gray-700' }`}>
            {children}
            {activeTab === tabId && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF7A00]" />}
        </button>
    );

  return (
    <div className="min-h-screen bg-[#FFFFF0] dark:bg-gray-900 font-sans">
      <AnimatePresence>
          {isGeneratingReport && <ReportGenerationModal progress={reportProgress} />}
      </AnimatePresence>
      <Navbar 
        isNightMode={isNightMode} 
        toggleNightMode={toggleNightMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        analysisResult={analysisResult}
      />
      <main>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-2 sm:space-x-6 overflow-x-auto" aria-label="Tabs">
                        <TabButton tabId="dashboard" activeTab={activeTab} setActiveTab={setActiveTab}><DashboardIcon />Dashboard</TabButton>
                        <TabButton tabId="documents" activeTab={activeTab} setActiveTab={setActiveTab}><DocumentTextIcon />Documents</TabButton>
                        <TabButton tabId="map" activeTab={activeTab} setActiveTab={setActiveTab}><MapIcon />Conflict Map</TabButton>
                        <TabButton tabId="calendar" activeTab={activeTab} setActiveTab={setActiveTab}><CalendarIcon className="h-5 w-5 mr-2" />Calendar</TabButton>
                        <TabButton tabId="history" activeTab={activeTab} setActiveTab={setActiveTab}><HistoryIcon />Analysis History</TabButton>
                        <TabButton tabId="about" activeTab={activeTab} setActiveTab={setActiveTab}><InformationCircleIcon />About</TabButton>
                        <TabButton tabId="settings" activeTab={activeTab} setActiveTab={setActiveTab}><SettingsIcon />Settings</TabButton>
                        <TabButton tabId="profile" activeTab={activeTab} setActiveTab={setActiveTab}><ProfileIcon />Profile</TabButton>
                    </nav>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }}>
                        {activeTab === 'dashboard' && <DashboardView {...{ isLoading, usageStats, lastCheckedTime, handleCheckUpdates, isCheckingUpdates, newConflictsFound, selectedFiles, setSelectedFiles, handleAnalyzeFiles, handleGenerateReport, isGeneratingReport, analysisResult, handleResetAnalysis, searchQuery }} />}
                        {activeTab === 'documents' && <DocumentsView analysisResult={analysisResult} searchQuery={searchQuery} handleDeleteDocument={handleDeleteDocument} />}
                        {activeTab === 'map' && <ConflictMapView analysisResult={analysisResult} />}
                        {activeTab === 'calendar' && <CalendarView analysisResult={analysisResult} />}
                        {activeTab === 'history' && <AnalysisHistoryView history={analysisHistory} onViewHistoryItem={handleViewHistoryItem} />}
                        {activeTab === 'about' && <AboutView />}
                        {activeTab === 'settings' && <SettingsView />}
                        {activeTab === 'profile' && <ProfileView />}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
      </main>
    </div>
  );
}


export default function App() {
    const [isNightMode, setIsNightMode] = useState(false);
    
    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsNightMode(prefersDark);
    }, []);

    const toggleNightMode = () => setIsNightMode(!isNightMode);
    
    return (
        <div className={isNightMode ? 'dark' : ''}>
           <MainApp isNightMode={isNightMode} toggleNightMode={toggleNightMode} />
        </div>
    )
}

