import React, { useState, useEffect } from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCw, Maximize2, Minimize2 } from 'lucide-react';

interface ImagePreviewProps {
  src: string;
  alt: string;
  onClose: () => void;
  onDownload?: () => void;
  filename?: string;
}

export default function ImagePreview({ src, alt, onClose, onDownload, filename }: ImagePreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case 'r':
        case 'R':
          handleRotate();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const resetView = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Default download behavior
      const link = document.createElement('a');
      link.href = src;
      link.download = filename || 'image';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`relative ${isFullscreen ? 'w-full h-full' : 'max-w-full max-h-full'}`}>
        {/* Controls */}
        <div className="absolute top-4 right-4 flex items-center space-x-2 z-10 bg-black bg-opacity-50 rounded-lg p-2">
          <button
            onClick={handleZoomOut}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors"
            title="Zoom Out (-)"
            disabled={zoom <= 0.25}
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleZoomIn}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors"
            title="Zoom In (+)"
            disabled={zoom >= 5}
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleRotate}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors"
            title="Rotate (R)"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          
          <button
            onClick={handleDownload}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          
          <button
            onClick={onClose}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors"
            title="Close (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Zoom and Position Info */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm z-10">
          {Math.round(zoom * 100)}%
        </div>

        {/* Reset Button */}
        {(zoom !== 1 || rotation !== 0 || position.x !== 0 || position.y !== 0) && (
          <div className="absolute bottom-4 left-4 z-10">
            <button
              onClick={resetView}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Reset View
            </button>
          </div>
        )}

        {/* Loading State */}
        {!imageLoaded && !imageError && (
          <div className="flex items-center justify-center w-full h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* Error State */}
        {imageError && (
          <div className="flex items-center justify-center w-full h-full text-white">
            <div className="text-center">
              <X className="h-16 w-16 mx-auto mb-4 text-red-400" />
              <p className="text-lg">Failed to load image</p>
              <p className="text-sm text-gray-300 mt-2">The image could not be displayed</p>
            </div>
          </div>
        )}

        {/* Image Container */}
        <div 
          className={`flex items-center justify-center ${isFullscreen ? 'w-full h-full' : 'max-w-full max-h-[90vh]'} overflow-hidden`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              display: imageError ? 'none' : 'block'
            }}
            onLoad={() => {
              setImageLoaded(true);
              setImageError(false);
            }}
            onError={() => {
              setImageError(true);
              setImageLoaded(false);
            }}
            draggable={false}
          />
        </div>

        {/* Instructions */}
        {imageLoaded && !imageError && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-xs z-10">
            <div className="space-y-1">
              <div>ESC: Close</div>
              <div>+/-: Zoom</div>
              <div>R: Rotate</div>
              {zoom > 1 && <div>Drag: Pan</div>}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
}