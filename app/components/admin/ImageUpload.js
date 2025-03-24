'use client'
import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ImageUpload({ value, onChange, onRemove }) {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Handle initial value and cleanup
  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    if (typeof value === 'string') {
      setPreview(value);
      return;
    }

    if (value instanceof File) {
      try {
        const url = URL.createObjectURL(value);
        setPreview(url);
        return () => {
          try {
            URL.revokeObjectURL(url);
          } catch (err) {
            console.error('Error revoking URL:', err);
          }
        };
      } catch (err) {
        console.error('Error creating preview URL:', err);
        setError('Failed to create image preview');
      }
    }
  }, [value]);

  const handleDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null);
    setUploading(true);

    try {
      if (rejectedFiles?.length > 0) {
        const error = rejectedFiles[0].errors?.[0];
        if (error?.code === 'file-too-large') {
          throw new Error('File is too large. Max size is 5MB');
        }
        if (error?.code === 'file-invalid-type') {
          throw new Error('Invalid file type. Accepted types: JPG, PNG, WebP');
        }
        throw new Error(error?.message || 'Invalid file');
      }

      if (!acceptedFiles?.length) {
        throw new Error('No file selected');
      }

      const file = acceptedFiles[0];
      if (!file || !(file instanceof File)) {
        throw new Error('Invalid file object');
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File is too large. Max size is 5MB');
      }

      // Call onChange handler
      onChange?.(file);
    } catch (error) {
      console.error('Error handling file:', error);
      setError(error.message || 'Failed to process file');
      toast.error(error.message || 'Failed to process file');
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    multiple: false
  });

  const handleRemove = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (preview && typeof preview === 'string' && preview.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(preview);
      } catch (err) {
        console.error('Error revoking URL:', err);
      }
    }

    setPreview(null);
    setError(null);
    onRemove?.();
  }, [preview, onRemove]);

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${error ? 'border-red-400 bg-red-50' : 
              isDragActive ? 'border-purple-400 bg-purple-50' : 
              'border-gray-200 hover:border-purple-400'}`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
              <p className="mt-4 text-gray-600">Processing image...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center text-red-600">
              <p className="font-medium">{error}</p>
              <p className="mt-2 text-sm">Please try again with a different image</p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-4 text-gray-600">
                {isDragActive ? "Drop your image here" : "Drag 'n' drop an image here, or click to select"}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Max file size: 5MB • Supported formats: JPEG, PNG, WebP
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="relative group">
          <div className="aspect-video w-full relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 