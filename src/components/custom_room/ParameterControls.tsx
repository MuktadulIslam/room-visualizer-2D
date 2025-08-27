// components/ParameterControls.tsx
interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  description?: string;
}

export function SliderControl({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  description
}: SliderControlProps) {
  return (
    <div>
      <div className="flex gap-2 items-center justify-between">
        <label className="text-sm font-medium text-gray-500 mr-2">
          {label}
        </label>

        <div className="w-48 flex gap-2 items-center">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-sm text-gray-500">
            {value}
          </span>
        </div>
      </div>

      {description && (
        <p className="text-xs text-gray-500 text-right">{description}</p>
      )}
    </div>
  );
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  description?: string;
}

export function ColorPicker({
  label,
  value,
  onChange,
  description
}: ColorPickerProps) {
  return (
    <div>
      <div className="flex gap-2 items-center justify-between">
        <label className="text-sm font-medium text-gray-500">
          {label}
        </label>

        <div className="w-auto h-8 flex items-center gap-1">
          <div
            className="h-full aspect-square shrink-0 rounded-lg border-2 border-gray-600 cursor-pointer relative overflow-hidden"
            style={{ backgroundColor: value }}
          >
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#FF5733"
            className="w-40 h-full px-3 border border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {description && (
        <p className="text-xs text-right text-gray-500">{description}</p>
      )}
    </div>
  );
}

interface TileParametersProps {
  tilesX: number;
  tilesY: number;
  groutWidth: number;
  groutColor: string;
  onTilesXChange: (value: number) => void;
  onTilesYChange: (value: number) => void;
  onGroutColorChange: (color: string) => void;
  prefix?: string;
}

export function TileParameters({
  tilesX,
  tilesY,
  groutColor,
  onTilesXChange,
  onTilesYChange,
  onGroutColorChange,
  prefix = ""
}: TileParametersProps) {
  const prefixLabel = prefix ? `${prefix} ` : "";

  return (
    <div className="space-y-4 p-3 bg-gray-100 rounded-lg">
      <h4 className="font-medium text-gray-800">{prefixLabel}Tile Settings</h4>

      <div className="space-y-2">
        <SliderControl
          label={`Horizontal`}
          value={tilesX}
          onChange={onTilesXChange}
          min={5}
          max={50}
          description="Number of tiles across"
        />

        <SliderControl
          label={`Vertical`}
          value={tilesY}
          onChange={onTilesYChange}
          min={5}
          max={40}
          description="Number of tiles down"
        />
        <ColorPicker
          label="Grout Color"
          value={groutColor}
          onChange={onGroutColorChange}
          description="Color of the grout lines"
        />
      </div>
    </div>
  );
}