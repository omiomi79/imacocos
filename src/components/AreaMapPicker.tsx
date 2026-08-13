import { useId } from 'react';
import { mapCells, type Area } from '../areas';
import { assetPath } from '../assetPath';
import { useI18n, type MessageKey } from '../i18n';

type Props = {
  area: Area;
  value: string;
  onChange: (cell: string) => void;
};

export function AreaMapPicker({ area, value, onChange }: Props) {
  const labelId = useId();
  const { t } = useI18n();
  const map = area.map;
  if (!map) return null;

  const cells = mapCells(map);
  const areaName = t(`area.${area.id}` as MessageKey);

  if (cells.length === 0) {
    return (
      <div className="map-picker map-guide">
        <p className="field-label">{t('map.guideTitle')}</p>
        <div className="map-stage">
          <img src={assetPath(map.image)} alt={t('map.guideAlt', { area: areaName })} />
        </div>
        {/* 案内文は画像に描かれた日本語の説明なので、原文のまま出す */}
        <p className="map-selection">{'guide' in map && map.guide ? map.guide : t('map.guideFallback')}</p>
      </div>
    );
  }

  return (
    <div className="map-picker">
      <p className="field-label" id={labelId}>
        {t('map.question')}
      </p>
      <p className="map-help">{t('map.help')}</p>
      <div className="map-stage">
        <img src={assetPath(map.image)} alt={t('map.mapAlt', { area: areaName })} />
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
                aria-label={t('map.cellLabel', { cell: id })}
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
        {value ? t('map.selected', { cell: value }) : t('map.notSelected')}
      </p>
    </div>
  );
}
