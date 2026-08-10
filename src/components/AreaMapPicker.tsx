import { useId } from 'react';
import { mapCells, type Area } from '../areas';

type Props = {
  area: Area;
  value: string;
  onChange: (cell: string) => void;
};

export function AreaMapPicker({ area, value, onChange }: Props) {
  const labelId = useId();
  const map = area.map;
  if (!map) return null;

  const cells = mapCells(map);

  if (cells.length === 0) {
    return (
      <div className="map-picker map-guide">
        <p className="field-label">エリアガイド</p>
        <div className="map-stage">
          <img src={map.image} alt={`${area.label}の案内図`} />
        </div>
        <p className="map-selection">{'guide' in map ? map.guide : 'エリアの案内図です。'}</p>
      </div>
    );
  }

  return (
    <div className="map-picker">
      <p className="field-label" id={labelId}>
        マップ上の場所は？
      </p>
      <p className="map-help">だいたいの位置をタップしてください。</p>
      <div className="map-stage">
        <img src={map.image} alt={`${area.label}の見取り図`} />
        <svg
          className="map-grid"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          role="radiogroup"
          aria-labelledby={labelId}
        >
          {cells.map(({ id, polygon, label }) => {
            const selected = value === id;
            const points = polygon.map((point) => `${point.x * 100},${point.y * 100}`).join(' ');

            return (
              <g
                key={id}
                className={`map-cell ${selected ? 'is-selected' : ''}`}
                role="radio"
                aria-checked={selected}
                aria-label={`場所 ${id}`}
                tabIndex={0}
                onClick={() => onChange(id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onChange(id);
                  }
                }}
              >
                <polygon points={points} />
                <text className="map-cell-label" x={label.x * 100} y={label.y * 100}>
                  {id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="map-selection" aria-live="polite">
        {value ? `選択中: ${value}` : '場所を選択してください'}
      </p>
    </div>
  );
}
