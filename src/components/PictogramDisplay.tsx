import React from 'react';
import { PictogramItem } from '../types';

interface PictogramDisplayProps {
  item: PictogramItem;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCaption?: boolean;
  languageCode?: string;
  isHighContrast?: boolean;
  className?: string;
}

export const PictogramDisplay: React.FC<PictogramDisplayProps> = ({
  item,
  size = 'md',
  showCaption = true,
  languageCode = 'en',
  isHighContrast = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { box: 'w-24 h-24', icon: 64, text: 'text-xs' },
    md: { box: 'w-36 h-36', icon: 96, text: 'text-sm' },
    lg: { box: 'w-48 h-48', icon: 130, text: 'text-base font-semibold' },
    xl: { box: 'w-64 h-64', icon: 180, text: 'text-lg font-bold' },
  };

  const currentSize = sizeMap[size];
  const langKey = (languageCode in item.title ? languageCode : 'en') as keyof typeof item.title;
  const title = item.title[langKey] || item.title.en;
  const caption = item.caption[langKey] || item.caption.en;

  const isProhibition = item.actionType === 'prohibit';
  const isSimplified = (item.simplifiedLevel || 1) > 1;

  const renderSvgSymbol = () => {
    switch (item.symbolKey) {
      case 'flood_no_enter':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none" stroke="currentColor">
            {/* Background water waves */}
            <path
              d="M10 70 Q 25 65 40 70 T 70 70 T 100 70 L 100 90 L 10 90 Z"
              fill="#3b82f6"
              stroke="#1d4ed8"
              strokeWidth="2"
            />
            <path
              d="M10 78 Q 25 74 40 78 T 70 78 T 100 78 L 100 90 L 10 90 Z"
              fill="#1d4ed8"
              opacity="0.6"
            />
            {/* Human figure */}
            <circle cx="50" cy="30" r="7" fill="#0f172a" stroke="none" />
            <path d="M50 38 L50 62 M40 45 L60 45 M50 62 L42 75 M50 62 L58 75" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />

            {/* Prohibition Ring & Slash */}
            <circle cx="50" cy="50" r="42" stroke="#dc2626" strokeWidth={isSimplified ? '9' : '7'} />
            <line x1="20" y1="20" x2="80" y2="80" stroke="#dc2626" strokeWidth={isSimplified ? '9' : '7'} />
          </svg>
        );

      case 'move_high_ground':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none" stroke="currentColor">
            {/* Stairs to high ground */}
            <path d="M20 85 L 45 85 L 45 65 L 70 65 L 70 45 L 90 45" stroke="#334155" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Water rising below */}
            <path d="M10 88 Q 25 84 40 88 T 60 88 L 60 96 L 10 96 Z" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
            {/* Human climbing */}
            <circle cx="65" cy="28" r="6" fill="#16a34a" />
            <path d="M65 35 L62 48 M55 42 L72 38 M62 48 L56 60 M62 48 L70 58" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
            {/* Big Green Arrow Up */}
            <path d="M30 40 L30 20 M22 28 L30 20 L38 28" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            {/* Safe zone flag / roof */}
            <polygon points="78,18 92,23 78,28" fill="#16a34a" />
            <line x1="78" y1="18" x2="78" y2="45" stroke="#16a34a" strokeWidth="3" />
          </svg>
        );

      case 'no_drive_water':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none" stroke="currentColor">
            {/* Car profile */}
            <path
              d="M20 56 L 28 42 L 68 42 L 78 56 L 82 56 Q 84 62 78 66 L 22 66 Q 16 62 20 56 Z"
              fill="#0f172a"
              stroke="#0f172a"
              strokeWidth="2"
            />
            {/* Car wheels */}
            <circle cx="34" cy="66" r="8" fill="#475569" stroke="#0f172a" strokeWidth="2" />
            <circle cx="66" cy="66" r="8" fill="#475569" stroke="#0f172a" strokeWidth="2" />
            {/* Water waves submerging wheels */}
            <path
              d="M10 65 Q 25 58 40 65 T 70 65 T 90 65 L 90 85 L 10 85 Z"
              fill="#2563eb"
              opacity="0.85"
            />
            {/* Prohibition Ring & Slash */}
            <circle cx="50" cy="50" r="42" stroke="#dc2626" strokeWidth={isSimplified ? '9' : '7'} />
            <line x1="20" y1="20" x2="80" y2="80" stroke="#dc2626" strokeWidth={isSimplified ? '9' : '7'} />
          </svg>
        );

      case 'fallen_wire_danger':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none" stroke="currentColor">
            {/* Warning Triangle */}
            <polygon points="50,12 90,82 10,82" fill="#fef08a" stroke="#ca8a04" strokeWidth="4" strokeLinejoin="round" />
            {/* High Voltage Lightning Bolt */}
            <path
              d="M52 28 L38 48 L50 48 L46 72 L64 45 L52 45 Z"
              fill="#dc2626"
              stroke="#991b1b"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Fallen wire arc */}
            <path d="M15 76 Q 35 60 55 76 T 85 76" stroke="#475569" strokeWidth="3" strokeDasharray="4 2" />
          </svg>
        );

      case 'crawl_under_smoke':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none" stroke="currentColor">
            {/* Smoke layer on top */}
            <path
              d="M10 30 Q 25 15 40 25 T 70 20 T 90 30 L 90 10 L 10 10 Z"
              fill="#475569"
              opacity="0.8"
            />
            {/* Exit door on right */}
            <rect x="74" y="38" width="18" height="52" fill="#16a34a" rx="2" />
            <circle cx="78" cy="65" r="2" fill="#ffffff" />
            {/* Person crawling */}
            <circle cx="32" cy="62" r="6" fill="#0f172a" />
            <path d="M36 67 L 54 67 L 62 78 M42 67 L 40 82 M50 67 L 54 82" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            {/* Direction Arrow low */}
            <path d="M20 85 L 65 85 M58 79 L 66 85 L 58 91" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case 'drop_cover_hold':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none" stroke="currentColor">
            {/* Table */}
            <path d="M20 50 L 80 50 M25 50 L 25 85 M75 50 L 75 85" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
            {/* Falling bricks / ceiling */}
            <rect x="25" y="16" width="10" height="6" fill="#dc2626" transform="rotate(15 30 19)" />
            <rect x="62" y="14" width="12" height="7" fill="#ea580c" transform="rotate(-20 68 17)" />
            {/* Human crouched under table holding leg */}
            <circle cx="48" cy="62" r="6" fill="#16a34a" />
            <path d="M48 68 Q 42 76 38 82 M46 72 L 30 75" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
            <circle cx="30" cy="75" r="3" fill="#16a34a" />
          </svg>
        );

      case 'building_collapse_danger':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none" stroke="currentColor">
            {/* Cracked building */}
            <rect x="25" y="20" width="50" height="65" fill="#f1f5f9" stroke="#334155" strokeWidth="3" />
            {/* Cracks */}
            <path d="M50 20 L 45 40 L 55 55 L 48 85" stroke="#dc2626" strokeWidth="3" />
            <rect x="32" y="30" width="8" height="10" fill="#64748b" />
            <rect x="60" y="30" width="8" height="10" fill="#64748b" />
            <rect x="32" y="52" width="8" height="10" fill="#64748b" />
            <rect x="60" y="52" width="8" height="10" fill="#64748b" />
            {/* Prohibition Ring & Slash */}
            <circle cx="50" cy="50" r="42" stroke="#dc2626" strokeWidth={isSimplified ? '9' : '7'} />
            <line x1="20" y1="20" x2="80" y2="80" stroke="#dc2626" strokeWidth={isSimplified ? '9' : '7'} />
          </svg>
        );

      case 'sos_signal':
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full p-2" fill="none" stroke="currentColor">
            {/* Red Beacon */}
            <circle cx="50" cy="50" r="28" fill="#dc2626" />
            <text x="50" y="57" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="bold" fontFamily="sans-serif">
              SOS
            </text>
            {/* Radial waves */}
            <path d="M 22 28 A 38 38 0 0 0 22 72" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
            <path d="M 14 18 A 50 50 0 0 0 14 82" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
            <path d="M 78 28 A 38 38 0 0 1 78 72" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
            <path d="M 86 18 A 50 50 0 0 1 86 82" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`flex flex-col items-center p-3 rounded-2xl bg-white border-2 ${
        isProhibition ? 'border-red-300 shadow-sm' : 'border-slate-200 shadow-sm'
      } ${className}`}
    >
      <div
        className={`${currentSize.box} rounded-xl flex items-center justify-center ${
          isHighContrast
            ? 'bg-black text-white'
            : isProhibition
            ? 'bg-red-50 text-red-700'
            : 'bg-emerald-50 text-emerald-800'
        }`}
      >
        {renderSvgSymbol()}
      </div>

      {showCaption && (
        <div className="mt-2 text-center max-w-[220px]">
          <div className={`${currentSize.text} text-slate-900 leading-tight`}>{title}</div>
          {size !== 'sm' && <p className="text-xs text-slate-600 mt-1 line-clamp-2">{caption}</p>}
        </div>
      )}

      {item.validation && size !== 'sm' && (
        <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <span>✓</span>
          <span>{item.validation.status === 'SIMPLIFIED' ? 'Simplified ISO' : 'Validated (ISO 7010)'}</span>
        </div>
      )}
    </div>
  );
};
