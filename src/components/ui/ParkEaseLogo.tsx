import React from 'react';

interface ParkEaseLogoProps {
  readonly size?: 'sm' | 'md' | 'lg' | 'xl';
  readonly showWordmark?: boolean;
  readonly className?: string;
}

export const ParkEaseLogo: React.FC<ParkEaseLogoProps> = ({
  size = 'md',
  showWordmark = false,
  className = '',
}) => {
  const pinSizes = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold',
    lg: 'text-3xl font-extrabold',
    xl: 'text-4xl font-extrabold',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Green Map Pin with white bold "P" */}
      <div className={`relative flex items-center justify-center shrink-0 ${pinSizes[size]}`}>
        <svg
          viewBox="0 0 40 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform hover:scale-105"
        >
          {/* Map Pin Body */}
          <path
            d="M20 0C8.954 0 0 8.954 0 20C0 32.5 17.5 46.2 18.9 47.3C19.5 47.8 20.5 47.8 21.1 47.3C22.5 46.2 40 32.5 40 20C40 8.954 31.046 0 20 0Z"
            fill="#1E6B43"
          />
          {/* Subtle Pin Inner Shadow Highlight */}
          <ellipse cx="20" cy="18" rx="14" ry="14" fill="#2E8B57" opacity="0.35" />
          {/* White 'P' letter */}
          <text
            x="20"
            y="25"
            fontFamily="Inter, system-ui, sans-serif"
            fontSize="18"
            fontWeight="800"
            fill="#FFFFFF"
            textAnchor="middle"
          >
            P
          </text>
        </svg>
      </div>

      {showWordmark && (
        <span className={`tracking-tight text-[#0F172A] ${textSizes[size]}`}>
          Park<span className="text-[#1E6B43]">Ease</span>
        </span>
      )}
    </div>
  );
};
