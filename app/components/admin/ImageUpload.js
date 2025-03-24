import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp']
};

export default function ImageUpload({ value, onChange, onRemove }) {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handle initial value and cleanup
  useEffect(() => {
    if (typeof value === 'string' && value) {
      setPreview(value);
    } else if (value && value.length > 0 && value[0] instanceof File) {
      const url = URL.createObjectURL(value[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [value]);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    rejectedFiles.forEach(({ file, errors }) => {
      if (errors[0]?.code === 'file-too-large') {
        toast.error(`File ${file.name} is too large. Max size is 5MB`);
      } else if (errors[0]?.code === 'file-invalid-type') {
        toast.error(`File ${file.name} has an invalid type. Accepted types: JPG, PNG, WebP`);
      }
    });

    // Handle accepted files
    const validFiles = acceptedFiles.filter(file => file.size <= MAX_FILE_SIZE);
    
    if (validFiles.length > 0) {
      setUploading(true);
      try {
        onChange(validFiles);
        const url = URL.createObjectURL(validFiles[0]);
        setPreview(url);
      } catch (error) {
        console.error('Error handling files:', error);
        toast.error('Failed to process files');
      } finally {
        setUploading(false);
      }
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  const handleRemove = () => {
    if (preview && typeof value !== 'string') {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onRemove();
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-purple-400'}`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
              <p className="mt-4 text-gray-600">Uploading...</p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-4 text-gray-600">
                {isDragActive ? (
                  "Drop your image here"
                ) : (
                  "Drag 'n' drop an image here, or click to select"
                )}
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