// Enhanced CameraWidget Component
// Changes:
// - Created a new component from scratch based on requirements, using only Tailwind CSS.
// - Implemented a camera view with capture controls and a gallery for captured images.
// - Added full dark mode support (`dark:*` classes).
// - Implemented accessibility best practices (semantic HTML, ARIA roles, focus rings, keyboard navigation).
// - Included logic for handling camera permissions and displaying appropriate UI states.
// - Added smooth transitions for hover and focus states.

import React, { useState, useEffect, useRef } from 'react';

function CameraWidget() {
  const [permission, setPermission] = useState('idle'); // 'idle', 'granted', 'denied'
  const [stream, setStream] = useState(null);
  const [captures, setCaptures] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [lastCapture, setLastCapture] = useState(null);
  const [recentUploads, setRecentUploads] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      setPermission('granted');
      setShowModal(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setPermission('denied');
    }
  };

  useEffect(() => {
    if (stream && videoRef.current && showModal) {
      videoRef.current.srcObject = stream;
    }
    // Cleanup stream on component unmount or modal close
    return () => {
      if (stream && !showModal) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    };
  }, [stream, showModal]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const imageDataUrl = canvas.toDataURL('image/png');
      
      const captureData = {
        image: imageDataUrl,
        timestamp: new Date().toLocaleString()
      };
      
      setCaptures(prev => [captureData, ...prev]);
      setLastCapture(captureData);
      
      // Simulate upload
      setTimeout(() => {
        setRecentUploads(prev => [{
          fileName: `Scan_${Date.now()}.png`,
          folderName: 'Documents',
          timestamp: new Date().toLocaleString()
        }, ...prev.slice(0, 2)]);
      }, 1000);
    }
  };

  const handleDeleteCapture = (index) => {
    setCaptures(prev => prev.filter((_, i) => i !== index));
  };

  const closeModal = () => {
    setShowModal(false);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 h-full flex flex-col transition-shadow duration-200 hover:shadow-lg border border-gray-200 dark:border-gray-700" aria-labelledby="camera-widget-title">
        <header className="flex items-center justify-between mb-4">
          <h2 id="camera-widget-title" className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Document Scanner
          </h2>
          <span className="text-2xl" role="img" aria-label="Camera icon">📸</span>
        </header>

        <div className="flex-grow flex flex-col">
          <button 
            onClick={enableCamera}
            className="w-full px-4 py-3 mb-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 flex items-center justify-center gap-2"
          >
            <span className="text-xl" aria-hidden="true">📷</span>
            Scan Document
          </button>

          {permission === 'denied' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 mb-4">
              <p className="text-sm text-red-600 dark:text-red-400">
                Camera access was denied. Please enable it in your browser settings.
              </p>
            </div>
          )}

          {lastCapture && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Capture:</h3>
              <img 
                src={lastCapture.image} 
                alt="Last captured document"
                className="w-full max-h-48 object-contain rounded-lg bg-gray-100 dark:bg-gray-700 mb-1"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">{lastCapture.timestamp}</p>
            </div>
          )}

          {recentUploads.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Uploads:</h3>
              <div className="space-y-2">
                {recentUploads.map((upload, index) => (
                  <div key={index} className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{upload.fileName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      📁 {upload.folderName} • {upload.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button 
                onClick={closeModal}
                className="absolute top-2 right-2 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Close camera"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Capture Document</h3>
                
                <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
                  <video 
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex justify-center">
                    <button 
                      onClick={handleCapture}
                      className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-white/50 hover:bg-gray-100 transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/50"
                      aria-label="Capture photo"
                    >
                      <span className="text-3xl" aria-hidden="true">📷</span>
                    </button>
                  </div>
                </div>

                {captures.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Captures ({captures.length})</h4>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-32 overflow-y-auto">
                      {captures.map((capture, idx) => (
                        <div key={idx} className="relative group aspect-square">
                          <img 
                            src={capture.image} 
                            alt={`Capture ${idx + 1}`}
                            className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                          />
                          <button 
                            onClick={() => handleDeleteCapture(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label={`Delete capture ${idx + 1}`}
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}

export default CameraWidget;