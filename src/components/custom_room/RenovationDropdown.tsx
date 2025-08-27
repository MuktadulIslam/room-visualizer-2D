// components/RenovationDropdown.tsx
import { useState } from 'react';
import { RenovationType } from './RenovationTypes';

interface RenovationOption {
  id: RenovationType;
  title: string;
  description: string;
  icon: React.ReactNode;
  requiredInputs: string[];
}

interface RenovationDropdownProps {
  selectedType: RenovationType;
  onTypeChange: (type: RenovationType) => void;
}

const renovationOptions: RenovationOption[] = [
  {
    id: 'floor-tiling',
    title: 'Floor Tiling Only',
    description: 'Apply tile patterns to floor areas only',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
    requiredInputs: ['Room Image', 'Floor Tile']
  },
  {
    id: 'complete-tiling',
    title: 'Complete Tiling',
    description: 'Apply tiles to both floors and walls',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    requiredInputs: ['Room Image', 'Floor Tile', 'Wall Tile']
  },
  {
    id: 'wall-tiling',
    title: 'Wall Tiling Only',
    description: 'Apply tile patterns to wall areas only',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
      </svg>
    ),
    requiredInputs: ['Room Image', 'Wall Tile']
  },
  {
    id: 'wall-coloring',
    title: 'Wall Coloring',
    description: 'Apply solid colors to wall areas',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
      </svg>
    ),
    requiredInputs: ['Room Image']
  },
  {
    id: 'floor-tiling-wall-coloring',
    title: 'Floor + Wall Color',
    description: 'Apply floor tiles with colored walls',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1v6m6-6v6" />
      </svg>
    ),
    requiredInputs: ['Room Image', 'Floor Tile']
  }
];

export default function RenovationDropdown({
  selectedType,
  onTypeChange
}: RenovationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = renovationOptions.find(option => option.id === selectedType);

  return (
    <div className="relative">
      <label className="block text-lg font-semibold text-gray-700 mb-2">
        Renovation Type
      </label>
      
      <button
        type="button"
        className="relative w-full bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-3 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 text-gray-500">
            {selectedOption?.icon}
          </div>
          <div className="ml-3 flex-1">
            <span className="block font-medium text-gray-900">
              {selectedOption?.title}
            </span>
            <span className="block text-sm text-gray-500 truncate">
              {selectedOption?.description}
            </span>
          </div>
        </div>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Options */}
          <div className="absolute z-20 mt-1 w-full bg-white shadow-lg max-h-[600px] rounded-lg py-1 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
            {renovationOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`
                  relative w-full cursor-pointer select-none py-3 px-3 text-left hover:bg-gray-50
                  ${option.id === selectedType ? 'bg-blue-50' : ''}
                `}
                onClick={() => {
                  onTypeChange(option.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center">
                  <div className={`
                    flex-shrink-0 p-2 rounded-lg
                    ${option.id === selectedType 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-500'
                    }
                  `}>
                    {option.icon}
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="block font-medium text-gray-900">
                        {option.title}
                      </span>
                      {option.id === selectedType && (
                        <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    <span className="block text-sm text-gray-500 mt-1">
                      {option.description}
                    </span>
                    
                    {/* Required inputs */}
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {option.requiredInputs.map((input) => (
                          <span
                            key={input}
                            className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                          >
                            {input}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}