import React, { useState, useRef } from 'react';
import { 
  ZoomIn, ZoomOut, Maximize2, Download, RefreshCw, 
  Sun, Moon, ExternalLink, Printer, FileText, ChevronLeft, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export const PDFViewer = ({ fileUrl, title = 'Resource Document' }) => {
  const [zoom, setZoom] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 15, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 15, 60));
  const handleResetZoom = () => setZoom(100);

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {
        toast.error('Fullscreen mode not allowed by browser permissions.');
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleDownload = () => {
    if (!fileUrl) return;
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Downloading PDF resource...');
  };

  const handlePageJumpSubmit = (e) => {
    e.preventDefault();
    const p = parseInt(pageInput, 10);
    if (!isNaN(p) && p > 0) {
      setCurrentPage(p);
      toast.success(`Jumped to page ${p}`);
    }
  };

  const handlePrint = () => {
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow.print();
      } catch {
        window.open(fileUrl, '_blank')?.print();
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full flex flex-col rounded-2xl overflow-hidden border shadow-lg transition-all duration-300 ${
        isDarkMode 
          ? 'bg-slate-950 border-slate-800 text-slate-100 shadow-slate-950/50' 
          : 'bg-slate-50 border-slate-200 text-slate-800 shadow-slate-200/50'
      }`}
    >
      {/* ── Top Interactive Toolbar ────────────────────────────────────── */}
      <div className={`p-3.5 px-5 flex flex-wrap items-center justify-between gap-3 border-b backdrop-blur-md ${
        isDarkMode 
          ? 'bg-slate-900/90 border-slate-800' 
          : 'bg-white/90 border-slate-200'
      }`}>
        {/* Left: Document Title & File Info */}
        <div className="flex items-center gap-2.5 min-w-[200px]">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <FileText className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black truncate max-w-[220px] tracking-tight">{title}</span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">PDF Reader Engine</span>
          </div>
        </div>

        {/* Center: Controls (Zoom & Page Jump) */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 font-mono text-xs">
          {/* Zoom Controls */}
          <button
            onClick={handleZoomOut}
            title="Zoom Out (-15%)"
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={handleResetZoom}
            title="Reset Zoom to 100%"
            className="px-2 py-0.5 font-bold hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors cursor-pointer text-[11px]"
          >
            {zoom}%
          </button>

          <button
            onClick={handleZoomIn}
            title="Zoom In (+15%)"
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-700 mx-1" />

          {/* Page Jump */}
          <form onSubmit={handlePageJumpSubmit} className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400 font-sans">Page</span>
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="w-9 py-0.5 px-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
            />
          </form>
        </div>

        {/* Right: Actions (Theme, Download, Print, Fullscreen, Open New Window) */}
        <div className="flex items-center gap-1.5 font-mono">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
          </button>

          <button
            onClick={handlePrint}
            title="Print Document"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
          </button>

          <button
            onClick={handleToggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
          </button>

          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in New Tab"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center justify-center"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
          </a>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer ml-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* ── Document View Canvas ────────────────────────────────────────── */}
      <div className="relative w-full h-[620px] overflow-hidden flex items-center justify-center p-2 bg-slate-900/50">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-7 h-7 animate-spin text-purple-500" />
            <span className="text-xs font-mono text-slate-300 font-semibold">Loading PDF Document Engine...</span>
          </div>
        )}

        <div 
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          className="w-full h-full transition-transform duration-200 ease-out"
        >
          <iframe
            ref={iframeRef}
            src={`${fileUrl}#page=${currentPage}`}
            title="Interactive PDF Document Viewer"
            onLoad={() => setIsLoading(false)}
            className="w-full h-full border-0 rounded-xl bg-white shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
