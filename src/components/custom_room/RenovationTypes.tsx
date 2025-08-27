// components/RenovationTypes.tsx
export type RenovationType = 
  | 'floor-tiling' 
  | 'complete-tiling' 
  | 'wall-tiling' 
  | 'wall-coloring' 
  | 'floor-tiling-wall-coloring';

interface RenovationOption {
  id: RenovationType;
  title: string;
  description: string;
  icon: React.ReactNode;
  requiredInputs: string[];
}

interface RenovationTypeSelectorProps {
  selectedType: RenovationType;
  onTypeChange: (type: RenovationType) => void;
}

const renovationOptions: RenovationOption[] = [
  {
    id: 'floor-tiling',
    title: 'Floor Tiling Only',
    description: 'Apply tile patterns to floor areas only',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1v6m6-6v6" />
      </svg>
    ),
    requiredInputs: ['Room Image', 'Floor Tile']
  }
];

export default function RenovationTypeSelector({
  selectedType,
  onTypeChange
}: RenovationTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Choose Renovation Type</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renovationOptions.map((option) => (
          <div
            key={option.id}
            className={`
              relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${selectedType === option.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
            onClick={() => onTypeChange(option.id)}
          >
            {/* Selection indicator */}
            {selectedType === option.id && (
              <div className="absolute top-2 right-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
            
            {/* Icon */}
            <div className={`
              inline-flex p-3 rounded-lg mb-3
              ${selectedType === option.id
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600'
              }
            `}>
              {option.icon}
            </div>
            
            {/* Content */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">{option.title}</h4>
              <p className="text-sm text-gray-600">{option.description}</p>
              
              {/* Required inputs */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Required:</p>
                <div className="flex flex-wrap gap-1">
                  {option.requiredInputs.map((input) => (
                    <span
                      key={input}
                      className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                    >
                      {input}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}