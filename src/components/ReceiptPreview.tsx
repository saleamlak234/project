import React, { useState } from 'react';
import { Eye, Download, FileText, Image as ImageIcon } from 'lucide-react';
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

  const isImage = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const isPDF = (url: string) => {
    return url.toLowerCase().includes('.pdf');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = receiptUrl;
    link.download = filename || 'receipt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileIcon = () => {
    if (isImage(receiptUrl)) {
      return <ImageIcon className="h-4 w-4" />;
    } else if (isPDF(receiptUrl)) {
      return <FileText className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const getFileType = () => {
    if (isImage(receiptUrl)) return 'Image';
    if (isPDF(receiptUrl)) return 'PDF';
    return 'File';
  };

  return (
    <>
      <div className={`flex items-center space-x-2 ${className}`}>
        {getFileIcon()}
        <span className="text-sm text-gray-600">{getFileType()}</span>
        
        <div className="flex items-center space-x-1">
          {isImage(receiptUrl) ? (
            <button
              onClick={() => setShowPreview(true)}
              className="text-primary-600 hover:text-primary-700 text-sm flex items-center space-x-1"
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
              className="text-primary-600 hover:text-primary-700 text-sm flex items-center space-x-1"
              title="View File"
            >
              <Eye className="h-4 w-4" />
              <span>View</span>
            </a>
          )}
          
          {showDownload && (
            <button
              onClick={handleDownload}
              className="text-gray-600 hover:text-gray-800 text-sm flex items-center space-x-1"
              title="Download"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {showPreview && isImage(receiptUrl) && (
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