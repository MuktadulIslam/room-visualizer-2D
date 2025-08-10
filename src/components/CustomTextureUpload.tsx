import React, { useState, useRef } from 'react';

interface Texture {
  id: string;
  texture_img: string;
  show_img: string;
  name: string;
  size: [number, number];
  is_glossy: boolean;
  type: 'wall' | 'floor' | 'both';
  isCustom?: boolean;
}

interface CustomTextureUploadProps {
  onClose: () => void;
  onUpload: (texture: Texture) => void;
}

export default function CustomTextureUpload({ onClose, onUpload }: CustomTextureUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [textureName, setTextureName] = useState('');
  const [textureWidth, setTextureWidth] = useState<number | string>(30);
  const [textureHeight, setTextureHeight] = useState<number | string>(25);
  const [isGlossy, setIsGlossy] = useState(false);
  const [textureType, setTextureType] = useState<'wall' | 'floor' | 'both'>('both');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Set default name from filename
      if (!textureName) {
        const nameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
        setTextureName(nameWithoutExtension);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !textureName.trim()) {
      alert('Please select a file and enter a texture name');
      return;
    }

    if (textureWidth <= 0 || textureHeight <= 0 || textureWidth === '' || textureHeight === '') {
      alert('Please enter valid dimensions (greater than 0)');
      return;
    }

    setIsUploading(true);

    try {
      // Create a data URL from the file
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        
        // Create the custom texture object
        const customTexture = {
          id: `custom-${Date.now()}`,
          texture_img: dataUrl,
          show_img: dataUrl,
          name: textureName.trim(),
          size: [Number(textureWidth), Number(textureHeight)] as [number, number],
          is_glossy: isGlossy,
          type: textureType,
          isCustom: true
        };

        // Call the upload callback
        onUpload(customTexture);
        
        // Clean up
        URL.revokeObjectURL(previewUrl);
        setIsUploading(false);
        onClose();
      };

      reader.onerror = () => {
        alert('Error reading file');
        setIsUploading(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading texture');
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setTextureName('');
    setTextureWidth(30);
    setTextureHeight(25);
    setIsGlossy(false);
    setTextureType('both');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Upload Custom Texture</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Texture Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: JPG, PNG, WebP (max 10MB)
            </p>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                <img
                  src={previewUrl}
                  alt="Texture preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Texture Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texture Name
            </label>
            <input
              type="text"
              value={textureName}
              onChange={(e) => setTextureName(e.target.value)}
              placeholder="Enter texture name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Width (cm)
              </label>
                              <input
                type="number"
                value={textureWidth}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setTextureWidth('');
                  } else {
                    const numValue = parseInt(value);
                    if (!isNaN(numValue) && numValue >= 1 && numValue <= 200) {
                      setTextureWidth(numValue);
                    }
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === '' || parseInt(e.target.value) < 1) {
                    setTextureWidth(30);
                  }
                }}
                min="1"
                max="200"
                placeholder="30"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (cm)
              </label>
                              <input
                type="number"
                value={textureHeight}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setTextureHeight('');
                  } else {
                    const numValue = parseInt(value);
                    if (!isNaN(numValue) && numValue >= 1 && numValue <= 200) {
                      setTextureHeight(numValue);
                    }
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === '' || parseInt(e.target.value) < 1) {
                    setTextureHeight(25);
                  }
                }}
                min="1"
                max="200"
                placeholder="25"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Finish Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Finish Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="finish"
                  checked={!isGlossy}
                  onChange={() => setIsGlossy(false)}
                  className="mr-2"
                />
                <span className="text-sm">Matt</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="finish"
                  checked={isGlossy}
                  onChange={() => setIsGlossy(true)}
                  className="mr-2"
                />
                <span className="text-sm">Glossy</span>
              </label>
            </div>
          </div>

          {/* Application Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Can be used for
            </label>
            <select
              value={textureType}
              onChange={(e) => setTextureType(e.target.value as 'wall' | 'floor' | 'both')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="both">Wall & Floor</option>
              <option value="wall">Wall Only</option>
              <option value="floor">Floor Only</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={resetForm}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isUploading}
            >
              Reset
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || !textureName.trim() || isUploading}
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isUploading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isUploading ? 'Uploading...' : 'Upload Texture'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}