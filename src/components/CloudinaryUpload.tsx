import React, { useState, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Eye, Loader } from 'lucide-react';
import axios from 'axios';

interface CloudinaryUploadProps {
  onUploadSuccess: (fileData: any) => void;
  onUploadError?: (error: string) => void;
  acceptedTypes?: string;
  maxSize?: number;
  className?: string;
  multiple?: boolean;
}

interface UploadedFile {
  public_id: string;
  secure_url: string;
  original_filename: string;
  format: string;
  bytes: number;
  thumbnailUrl?: string;
  optimizedUrl?: string;
}

export default function CloudinaryUpload({
  onUploadSuccess,
  onUploadError,
  acceptedTypes = "image/*,application/pdf",
  maxSize = 10 * 1024 * 1024, // 10MB
  className = "",
  multiple = false
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`;
    }

    // Check file type
    const allowedTypes = acceptedTypes.split(',').map(type => type.trim());
    const fileType = file.type;
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    const isValidType = allowedTypes.some(type => {
      if (type === 'image/*') return fileType.startsWith('image/');
      if (type === 'application/pdf') return fileType === 'application/pdf';
      if (type.startsWith('.')) return fileExtension === type;
      return fileType === type;
    });

    if (!isValidType) {
      return 'File type not supported. Please upload images or PDF files only.';
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/cloudinary/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      return response.data.file;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Upload failed');
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const filesToUpload = Array.from(files);
      
      // Validate all files first
      for (const file of filesToUpload) {
        const error = validateFile(file);
        if (error) {
          throw new Error(error);
        }
      }

      const uploadPromises = filesToUpload.map(uploadFile);
      const uploadedFileData = await Promise.all(uploadPromises);

      const newFiles = uploadedFileData.map(fileData => ({
        public_id: fileData.public_id,
        secure_url: fileData.secure_url,
        original_filename: fileData.original_filename,
        format: fileData.format,
        bytes: fileData.bytes,
        thumbnailUrl: fileData.thumbnailUrl,
        optimizedUrl: fileData.optimizedUrl
      }));

      setUploadedFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
      
      // Call success callback with the uploaded file data
      if (multiple) {
        onUploadSuccess(newFiles);
      } else {
        onUploadSuccess(newFiles[0]);
      }

    } catch (error: any) {
      // console.error('Upload error:', error);
      const errorMessage = error.message || 'Failed to upload file';
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  const removeFile = async (publicId: string) => {
    try {
      await axios.delete(`/api/cloudinary/delete/${encodeURIComponent(publicId)}`);
      setUploadedFiles(prev => prev.filter(file => file.public_id !== publicId));
    } catch (error) {
      console.error('Error removing file:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = (format: string) => {
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(format.toLowerCase());
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : uploading
            ? 'border-blue-300 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={acceptedTypes}
          multiple={multiple}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        {uploading ? (
          <div className="space-y-4">
            <Loader className="w-12 h-12 mx-auto text-blue-500 animate-spin" />
            <div>
              <p className="font-medium text-blue-600">Uploading to cloud...</p>
              <div className="w-full h-2 mt-2 bg-blue-200 rounded-full">
                <div
                  className="h-2 transition-all duration-300 bg-blue-600 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="mt-1 text-sm text-blue-500">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-gray-400" />
            <div>
              <p className="font-medium text-gray-600">
                {dragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Images and PDF files up to {Math.round(maxSize / (1024 * 1024))}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          <h4 className="font-medium text-gray-900">Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.public_id}
                className="flex items-center p-3 space-x-3 border rounded-lg bg-gray-50"
              >
                {/* File Preview */}
                <div className="flex-shrink-0">
                  {isImage(file.format) ? (
                    <img
                      src={file.thumbnailUrl || file.secure_url}
                      alt={file.original_filename}
                      className="object-cover w-12 h-12 rounded"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded">
                      <span className="text-xs font-medium text-red-600">
                        {file.format.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.original_filename}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.bytes)} • {file.format.toUpperCase()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(file.secure_url, '_blank')}
                    className="p-1 text-gray-400 transition-colors hover:text-gray-600"
                    title="View file"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(file.public_id)}
                    className="p-1 text-red-400 transition-colors hover:text-red-600"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Success Indicator */}
                <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Tips */}
      <div className="mt-4 text-xs text-gray-500">
        <p>💡 <strong>Tips:</strong></p>
        <ul className="mt-1 ml-4 space-y-1">
          <li>• Files are automatically optimized for web viewing</li>
          <li>• Images are compressed while maintaining quality</li>
          <li>• All uploads are securely stored in the cloud</li>
          <li>• Supported formats: JPG, PNG, GIF, WebP, BMP, PDF</li>
        </ul>
      </div>
    </div>
  );
}