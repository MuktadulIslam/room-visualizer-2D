// components/ResultDisplay.tsx
import Image from 'next/image';
import { useState } from 'react';

interface ResultDisplayProps {
  originalImage: string;
  resultImage?: string;
  isProcessing: boolean;
}

export default function ResultDisplay({
  originalImage,
  resultImage,
  isProcessing
}: ResultDisplayProps) {
  const [showComparison, setShowComparison] = useState(false);

  const downloadImage = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = 'renovated-room.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Result</h3>
        
        {resultImage && (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              {showComparison ? 'Hide Comparison' : 'Show Comparison'}
            </button>
            
            <button
              onClick={downloadImage}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download</span>
            </button>
          </div>
        )}
      </div>

      {/* Processing State */}
      {isProcessing && (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-center">
            Processing your room renovation...
            <br />
            <span className="text-sm text-gray-500">This may take 30-60 seconds</span>
          </p>
        </div>
      )}

      {/* Single Result View */}
      {!isProcessing && !showComparison && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {resultImage ? (
            <div className="relative">
              <Image
                src={resultImage}
                alt="Renovated room"
                width={800}
                height={600}
                className="w-full h-auto object-contain"
              />
              <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                Renovated
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium mb-2">No result yet</p>
              <p className="text-sm text-center">Upload images and click process to see your renovated room</p>
            </div>
          )}
        </div>
      )}

      {/* Comparison View */}
      {!isProcessing && showComparison && resultImage && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="relative">
              <Image
                src={originalImage}
                alt="Original room"
                width={400}
                height={300}
                className="w-full h-auto object-contain"
              />
              <div className="absolute top-2 left-2 bg-gray-600 text-white px-2 py-1 rounded text-xs font-medium">
                Original
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="relative">
              <Image
                src={resultImage}
                alt="Renovated room"
                width={400}
                height={300}
                className="w-full h-auto object-contain"
              />
              <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                Renovated
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}