import React, { useState } from 'react';
import { Eye, Download, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';
import ImagePreview from './ImagePreview';

interface ReceiptPreviewProps {
  receiptUrl: string;
  filename?: string;
  className?: string;
  showDownload?: boolean;
}

export default function ReceiptPreview({ 
  receiptUrl, 
  filename, 
  className = "", 
  showDownload = true 
}: ReceiptPreviewProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isImage = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const isPDF = (url: string) => {
    return url.toLowerCase().includes('.pdf');
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(receiptUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'receipt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to direct link
      const link = document.createElement('a');
      link.href = receiptUrl;
      link.download = filename || 'receipt';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getFileIcon = () => {
    if (imageError) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    if (isImage(receiptUrl)) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />;
    } else if (isPDF(receiptUrl)) {
      return <FileText className="h-4 w-4 text-red-500" />;
    }
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  const getFileType = () => {
    if (imageError) return 'Error';
    if (isImage(receiptUrl)) return 'Image';
    if (isPDF(receiptUrl)) return 'PDF';
    return 'File';
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <>
      <div className={`flex items-center space-x-2 ${className}`}>
        {getFileIcon()}
        <span className="text-sm text-gray-600">{getFileType()}</span>
        
        <div className="flex items-center space-x-1">
          {isImage(receiptUrl) && !imageError ? (
            <button
              onClick={() => setShowPreview(true)}
              className="text-primary-600 hover:text-primary-700 text-sm flex items-center space-x-1 px-2 py-1 rounded hover:bg-primary-50 transition-colors"
              title="Preview Image"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
          ) : (
            <a
              href={receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 text-sm flex items-center space-x-1 px-2 py-1 rounded hover:bg-primary-50 transition-colors"
              title="View File"
            >
              <Eye className="h-4 w-4" />
              <span>View</span>
            </a>
          )}
          
          {showDownload && (
            <button
              onClick={handleDownload}
              className="text-gray-600 hover:text-gray-800 text-sm flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
              title="Download"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          )}
        </div>
      </div>

      {/* Thumbnail Preview for Images */}
      {isImage(receiptUrl) && (
        <div className="mt-2">
          <div 
            className="relative inline-block cursor-pointer group"
            onClick={() => setShowPreview(true)}
          >
            <img
              src={receiptUrl}
              alt="Receipt thumbnail"
              className="w-24 h-24 object-cover rounded-lg border border-gray-200 group-hover:border-primary-300 transition-colors"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ display: imageError ? 'none' : 'block' }}
            />
            {imageError && (
              <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
              <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Click to preview</p>
        </div>
      )}

      {/* Image Preview Modal */}
      {showPreview && isImage(receiptUrl) && !imageError && (
        <ImagePreview
          src={receiptUrl}
          alt="Receipt"
          onClose={() => setShowPreview(false)}
          onDownload={handleDownload}
          filename={filename}
        />
      )}
    </>
  );
}