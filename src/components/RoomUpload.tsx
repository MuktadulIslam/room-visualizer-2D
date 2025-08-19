import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useTexture, ProcessingType } from '@/context/TextureContext';

export default function RoomUpload() {
    const { roomImage, uploadRoomImage, clearRoomImage } = useTexture();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [processingType, setProcessingType] = useState<ProcessingType>('remove-floor');

    const handleFileSelect = async (file: File) => {
        try {
            await uploadRoomImage(file, processingType);
        } catch (error) {
            console.error('Upload failed:', error);
            // Error is already set in the context
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const handleClear = () => {
        clearRoomImage();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getProcessingTypeLabel = () => {
        switch (processingType) {
            case 'remove-floor':
                return 'Remove Floor';
            case 'remove-wall':
                return 'Remove Wall';
            default:
                return 'Process';
        }
    };

    const getProcessingTypeDescription = () => {
        switch (processingType) {
            case 'remove-floor':
                return 'Floor will be removed and made transparent';
            case 'remove-wall':
                return 'Main wall will be removed and made transparent';
            default:
                return '';
        }
    };

    const getSuccessMessage = () => {
        if (!roomImage?.processedImage || roomImage.isProcessing) return '';
        
        switch (roomImage.processingType) {
            case 'remove-floor':
                return 'Floor removed successfully! Your furniture will now use this layout.';
            case 'remove-wall':
                return 'Wall removed successfully! Your furniture will now use this layout.';
            default:
                return 'Room processed successfully!';
        }
    };

    const getProcessedImageLabel = () => {
        if (!roomImage?.processedImage) return '';
        
        switch (roomImage.processingType) {
            case 'remove-floor':
                return 'Processed Room (No Floor)';
            case 'remove-wall':
                return 'Processed Room (No Wall)';
            default:
                return 'Processed Room';
        }
    };

    return (
        <div className="space-y-4 p-3 bg-white border border-gray-300 rounded-lg">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload Your Room Photo
                </h3>

                {roomImage && (
                    <button
                        onClick={handleClear}
                        className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Processing Type Selection */}
            {!roomImage && (
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Processing Type
                        </label>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setProcessingType('remove-floor')}
                                className={`flex-1 px-3 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                                    processingType === 'remove-floor'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                Remove Floor
                            </button>
                            <button
                                onClick={() => setProcessingType('remove-wall')}
                                className={`flex-1 px-3 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${
                                    processingType === 'remove-wall'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                Remove Wall
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {getProcessingTypeDescription()}
                        </p>
                    </div>
                </div>
            )}

            {!roomImage ? (
                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${dragActive
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={openFileDialog}
                >
                    <div className="space-y-2">
                        <svg
                            className="w-8 h-8 text-gray-400 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, WebP up to 10MB</p>
                        <p className="text-xs font-medium text-blue-600">
                            Will {getProcessingTypeLabel().toLowerCase()}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Processing Status */}
                    {roomImage.isProcessing && (
                        <div className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
                            <span className="text-sm text-blue-700">
                                {processingType === 'remove-floor' ? 'Removing floor from' : 'Removing wall from'} your room image...
                            </span>
                        </div>
                    )}

                    {/* Error Display */}
                    {roomImage.error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{roomImage.error}</p>
                        </div>
                    )}

                    {/* Success Display */}
                    {roomImage.processedImage && !roomImage.isProcessing && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center text-green-700 text-sm">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {getSuccessMessage()}
                            </div>
                        </div>
                    )}

                    {/* Current Processing Type Display */}
                    {roomImage && (
                        <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs text-blue-700 font-medium">
                                Processing Type: {roomImage.processingType === 'remove-floor' ? 'Remove Floor' : 'Remove Wall'}
                            </p>
                        </div>
                    )}

                    {/* Image Preview */}
                    <div className="grid grid-cols-1 gap-3">
                        <div className="relative">
                            <p className="text-xs font-medium text-gray-600 mb-2">Original Room</p>
                            <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border">
                                <Image
                                    src={roomImage.originalImage}
                                    alt="Original room"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {roomImage.processedImage && (
                            <div className="relative">
                                <p className="text-xs font-medium text-gray-600 mb-2">{getProcessedImageLabel()}</p>
                                <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border">
                                    <div
                                        className="w-full h-full"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='pattern' width='20' height='20' patternUnits='userSpaceOnUse'%3e%3crect width='10' height='10' fill='%23f0f0f0'/%3e%3crect x='10' y='10' width='10' height='10' fill='%23f0f0f0'/%3e%3crect x='10' y='0' width='10' height='10' fill='%23e0e0e0'/%3e%3crect x='0' y='10' width='10' height='10' fill='%23e0e0e0'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100' height='100' fill='url(%23pattern)'/%3e%3c/svg%3e")`,
                                        }}
                                    >
                                        <Image
                                            src={roomImage.processedImage}
                                            alt={roomImage.processingType === 'remove-floor' ? 'Room without floor' : 'Room without wall'}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
            />
        </div>
    );
}