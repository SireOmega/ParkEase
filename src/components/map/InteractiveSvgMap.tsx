import React, { useState } from 'react';
import type { ParkingSpace, Coordinates } from '../../types/parkease';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface InteractiveSvgMapProps {
  readonly spaces: readonly ParkingSpace[];
  readonly selectedSpaceId: string | null;
  readonly onSelectSpace: (spaceId: string) => void;
  readonly userCoordinates: Coordinates;
}

export const InteractiveSvgMap: React.FC<InteractiveSvgMapProps> = ({
  spaces,
  selectedSpaceId,
  onSelectSpace,
  userCoordinates,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ readonly x: number; readonly y: number }>({
    x: 0,
    y: 0,
  });

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.0));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.75));
  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Map projection constants mapping Bengaluru coordinate window to SVG viewBox
  // Center is Vidhana Soudha / Cubbon Park: lat 12.9716, lng 77.5946 -> SVG center (200, 260)
  const mapCenterLat = 12.9716;
  const mapCenterLng = 77.5946;
  const scaleX = 14000;
  const scaleY = 14500;

  const projectToSvg = (coords: Coordinates) => {
    const x = 200 + (coords.lng - mapCenterLng) * scaleX;
    const y = 260 - (coords.lat - mapCenterLat) * scaleY;
    return { x, y };
  };

  const userSvgPos = projectToSvg(userCoordinates);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#F1F5F9] select-none">
      {/* Zoom / Pan Controls Overlay */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 rounded-xl bg-white/95 p-1 shadow-md border border-slate-200/80 backdrop-blur-sm">
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="Zoom in"
          className="rounded-lg p-1.5 text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Zoom out"
          className="rounded-lg p-1.5 text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          aria-label="Reset map view"
          className="rounded-lg p-1.5 text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition border-t border-slate-100"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox="0 0 400 520"
        className="w-full h-full transition-transform duration-200 ease-out"
        style={{
          transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          transformOrigin: 'center center',
        }}
      >
        <defs>
          {/* User Pulsing Ring Gradient */}
          <radialGradient id="pulseRing">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background Land */}
        <rect width="400" height="520" fill="#F1F5F9" />

        {/* Green Parks (Cubbon Park & surrounding gardens) */}
        <path
          d="M 120 180 Q 150 140 210 160 Q 250 190 230 250 Q 180 270 140 240 Z"
          fill="#DCFCE7"
          stroke="#86EFAC"
          strokeWidth="1.5"
        />
        <text x="175" y="215" fontSize="10" fontWeight="600" fill="#15803D" textAnchor="middle" opacity="0.7">
          Cubbon Park
        </text>

        <path
          d="M 280 320 Q 320 300 360 330 Q 370 380 330 400 Q 270 370 280 320 Z"
          fill="#DCFCE7"
          stroke="#86EFAC"
          strokeWidth="1"
          opacity="0.8"
        />
        <text x="325" y="355" fontSize="9" fontWeight="500" fill="#15803D" textAnchor="middle" opacity="0.6">
          Kanteerava
        </text>

        {/* Secondary Neighborhood Grids */}
        <g stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
          <line x1="30" y1="80" x2="370" y2="80" />
          <line x1="20" y1="130" x2="380" y2="130" />
          <line x1="30" y1="360" x2="370" y2="360" />
          <line x1="20" y1="440" x2="380" y2="440" />

          <line x1="70" y1="40" x2="70" y2="480" />
          <line x1="330" y1="40" x2="330" y2="480" />
        </g>

        {/* Primary Arterial Streets (Lavelle Rd, MG Rd, Kasturba Rd, Residency Rd) */}
        <g stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
          {/* MG Road (East - West) */}
          <line x1="0" y1="210" x2="400" y2="210" />
          {/* Kasturba Road (North - South) */}
          <line x1="140" y1="60" x2="140" y2="460" />
          {/* Lavelle Road (Diagonal) */}
          <line x1="200" y1="150" x2="260" y2="360" />
          {/* Residency Road */}
          <line x1="40" y1="280" x2="380" y2="280" />
          {/* Richmond Road */}
          <line x1="50" y1="390" x2="380" y2="390" />
        </g>

        {/* Street Inner Pavements */}
        <g stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
          <line x1="0" y1="210" x2="400" y2="210" />
          <line x1="140" y1="60" x2="140" y2="460" />
          <line x1="200" y1="150" x2="260" y2="360" />
          <line x1="40" y1="280" x2="380" y2="280" />
          <line x1="50" y1="390" x2="380" y2="390" />
        </g>

        {/* Street Names */}
        <text x="50" y="204" fontSize="8" fontWeight="600" fill="#64748B" letterSpacing="0.5">
          MG ROAD
        </text>
        <text x="265" y="274" fontSize="8" fontWeight="600" fill="#64748B" letterSpacing="0.5">
          RESIDENCY ROAD
        </text>
        <text
          x="245"
          y="235"
          fontSize="8"
          fontWeight="600"
          fill="#64748B"
          transform="rotate(68, 245, 235)"
        >
          LAVELLE ROAD
        </text>

        {/* User Pulsing Blue Dot */}
        <g transform={`translate(${userSvgPos.x}, ${userSvgPos.y})`}>
          <circle r="22" fill="url(#pulseRing)">
            <animate attributeName="r" values="14;26;14" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle r="7" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle r="3" fill="#FFFFFF" />
        </g>

        {/* Parking Space Markers */}
        {spaces.map((space) => {
          if (!space.isActive) return null;
          const pos = projectToSvg(space.coordinates);
          const isSelected = space.id === selectedSpaceId;

          return (
            <g
              key={space.id}
              transform={`translate(${pos.x}, ${pos.y})`}
              className="cursor-pointer transition-transform duration-150"
              onClick={() => onSelectSpace(space.id)}
            >
              {/* Highlight Halo for Selected Pin */}
              {isSelected && (
                <circle
                  r="24"
                  fill="#1E6B43"
                  opacity="0.2"
                  className="animate-pulse"
                />
              )}

              {/* Pin Base Shadow */}
              <ellipse cx="0" cy="18" rx="8" ry="3.5" fill="#0F172A" opacity="0.25" />

              {/* Pin Badge */}
              <g transform="translate(-16, -34)">
                {/* Pin Shape */}
                <path
                  d="M16 0C7.2 0 0 7.2 0 16C0 25.5 14 36.5 15.1 37.3C15.6 37.7 16.4 37.7 16.9 37.3C18 36.5 32 25.5 32 16C32 7.2 24.8 0 16 0Z"
                  fill={isSelected ? '#15803D' : '#1E6B43'}
                  stroke={isSelected ? '#FEF08A' : '#FFFFFF'}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                />
                {/* Pin 'P' icon */}
                <text
                  x="16"
                  y="20"
                  fontFamily="Inter, system-ui, sans-serif"
                  fontSize="15"
                  fontWeight="800"
                  fill="#FFFFFF"
                  textAnchor="middle"
                >
                  P
                </text>
              </g>

              {/* Price Pill Below Pin */}
              <g transform="translate(0, 8)">
                <rect
                  x="-22"
                  y="0"
                  width="44"
                  height="16"
                  rx="8"
                  fill={isSelected ? '#1E6B43' : '#FFFFFF'}
                  stroke={isSelected ? '#FFFFFF' : '#CBD5E1'}
                  strokeWidth="1"
                  className="shadow-sm"
                />
                <text
                  x="0"
                  y="11.5"
                  fontFamily="Inter, system-ui, sans-serif"
                  fontSize="9.5"
                  fontWeight="700"
                  fill={isSelected ? '#FFFFFF' : '#1E6B43'}
                  textAnchor="middle"
                  className="tabular-nums"
                >
                  ₹{space.hourlyRateInr}/hr
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
