// components/ImageUpload.tsx
import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  label: string;
  header?: boolean
  onImageSelect: (file: File) => void;
  acceptedTypes?: string;
  preview?: string;
  className?: string;
  required?: boolean;
}

export default function ImageUpload({
  label,
  header = false,
  onImageSelect,
  acceptedTypes = "image/*",
  preview,
  className = "",
  required = false
}: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className={`block ${header ? 'text-base' : 'text-sm'} font-medium text-gray-700 mb-2`}>
        {label} {required && <span className="text-red-500 text-base">*</span>}
      </label>
      
      <div
        className={`
          relative border-2 border-dashed rounded-lg px-2 p-1.5 text-center cursor-pointer
          transition-colors duration-200
          ${dragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${preview ? 'bg-gray-50' : 'bg-white'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {preview ? (
          <div className="relative flex flex-col">
            <div className="max-h-28 mx-auto">
              <Image
                src={preview}
                alt="Preview"
                width={200}
                height={112}
                className="max-h-28 w-auto object-contain rounded-lg"
              />
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Click to change image
            </div>
          </div>
        ) : (
          <div className="">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600 mt-2">
              <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
            </div>
            <div className="text-xs text-gray-500">
              PNG, JPG, JPEG up to 10MB
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={acceptedTypes}
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}