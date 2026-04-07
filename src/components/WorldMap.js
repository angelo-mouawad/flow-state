import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './WorldMap.css';

// Country data: name -> approximate SVG center [x%, y%] on a 1000x500 equirectangular map
const COUNTRIES = [
  { code: 'US', name: 'United States', x: 18, y: 34 },
  { code: 'CA', name: 'Canada', x: 17, y: 22 },
  { code: 'MX', name: 'Mexico', x: 19, y: 42 },
  { code: 'BR', name: 'Brazil', x: 31, y: 62 },
  { code: 'AR', name: 'Argentina', x: 28, y: 75 },
  { code: 'CO', name: 'Colombia', x: 25, y: 52 },
  { code: 'PE', name: 'Peru', x: 24, y: 60 },
  { code: 'CL', name: 'Chile', x: 25, y: 72 },
  { code: 'GB', name: 'United Kingdom', x: 47, y: 24 },
  { code: 'FR', name: 'France', x: 48, y: 28 },
  { code: 'DE', name: 'Germany', x: 50, y: 25 },
  { code: 'ES', name: 'Spain', x: 46, y: 31 },
  { code: 'IT', name: 'Italy', x: 51, y: 30 },
  { code: 'PT', name: 'Portugal', x: 44, y: 31 },
  { code: 'NL', name: 'Netherlands', x: 49, y: 23 },
  { code: 'BE', name: 'Belgium', x: 49, y: 25 },
  { code: 'CH', name: 'Switzerland', x: 50, y: 28 },
  { code: 'AT', name: 'Austria', x: 52, y: 27 },
  { code: 'PL', name: 'Poland', x: 53, y: 24 },
  { code: 'SE', name: 'Sweden', x: 52, y: 18 },
  { code: 'NO', name: 'Norway', x: 50, y: 16 },
  { code: 'DK', name: 'Denmark', x: 50, y: 21 },
  { code: 'FI', name: 'Finland', x: 55, y: 17 },
  { code: 'GR', name: 'Greece', x: 54, y: 32 },
  { code: 'RU', name: 'Russia', x: 65, y: 20 },
  { code: 'UA', name: 'Ukraine', x: 56, y: 26 },
  { code: 'TR', name: 'Turkey', x: 58, y: 31 },
  { code: 'EG', name: 'Egypt', x: 56, y: 38 },
  { code: 'ZA', name: 'South Africa', x: 54, y: 74 },
  { code: 'NG', name: 'Nigeria', x: 50, y: 51 },
  { code: 'KE', name: 'Kenya', x: 59, y: 55 },
  { code: 'MA', name: 'Morocco', x: 46, y: 35 },
  { code: 'ET', name: 'Ethiopia', x: 58, y: 51 },
  { code: 'GH', name: 'Ghana', x: 47, y: 52 },
  { code: 'TZ', name: 'Tanzania', x: 58, y: 58 },
  { code: 'CN', name: 'China', x: 73, y: 32 },
  { code: 'JP', name: 'Japan', x: 82, y: 30 },
  { code: 'IN', name: 'India', x: 68, y: 40 },
  { code: 'KR', name: 'South Korea', x: 80, y: 30 },
  { code: 'TH', name: 'Thailand', x: 74, y: 44 },
  { code: 'VN', name: 'Vietnam', x: 76, y: 44 },
  { code: 'ID', name: 'Indonesia', x: 77, y: 56 },
  { code: 'MY', name: 'Malaysia', x: 76, y: 52 },
  { code: 'SG', name: 'Singapore', x: 76, y: 54 },
  { code: 'PH', name: 'Philippines', x: 79, y: 46 },
  { code: 'AU', name: 'Australia', x: 79, y: 68 },
  { code: 'NZ', name: 'New Zealand', x: 88, y: 74 },
  { code: 'SA', name: 'Saudi Arabia', x: 61, y: 39 },
  { code: 'AE', name: 'UAE', x: 63, y: 40 },
  { code: 'IL', name: 'Israel', x: 58, y: 35 },
  { code: 'PK', name: 'Pakistan', x: 66, y: 36 },
  { code: 'BD', name: 'Bangladesh', x: 71, y: 40 },
  { code: 'IR', name: 'Iran', x: 63, y: 34 },
  { code: 'IQ', name: 'Iraq', x: 60, y: 34 },
  { code: 'JO', name: 'Jordan', x: 59, y: 35 },
  { code: 'LB', name: 'Lebanon', x: 58, y: 33 },
  { code: 'KZ', name: 'Kazakhstan', x: 64, y: 26 },
  { code: 'UZ', name: 'Uzbekistan', x: 65, y: 30 },
  { code: 'CU', name: 'Cuba', x: 23, y: 42 },
  { code: 'DO', name: 'Dominican Rep.', x: 26, y: 43 },
  { code: 'PR', name: 'Puerto Rico', x: 27, y: 44 },
  { code: 'VE', name: 'Venezuela', x: 27, y: 50 },
  { code: 'EC', name: 'Ecuador', x: 23, y: 56 },
  { code: 'BO', name: 'Bolivia', x: 27, y: 63 },
  { code: 'PY', name: 'Paraguay', x: 28, y: 68 },
  { code: 'UY', name: 'Uruguay', x: 29, y: 72 },
  { code: 'HU', name: 'Hungary', x: 53, y: 27 },
  { code: 'CZ', name: 'Czech Republic', x: 52, y: 25 },
  { code: 'RO', name: 'Romania', x: 55, y: 27 },
  { code: 'HR', name: 'Croatia', x: 52, y: 29 },
  { code: 'RS', name: 'Serbia', x: 54, y: 28 },
  { code: 'NP', name: 'Nepal', x: 70, y: 37 },
  { code: 'LK', name: 'Sri Lanka', x: 69, y: 48 },
  { code: 'MM', name: 'Myanmar', x: 73, y: 41 },
  { code: 'KH', name: 'Cambodia', x: 75, y: 46 },
  { code: 'MN', name: 'Mongolia', x: 73, y: 24 },
];

export default function WorldMap() {
  const [visited, setVisited] = useLocalStorage('fs-visited', []);
  const [search, setSearch] = useState('');
  const [tooltip, setTooltip] = useState(null);

  const toggle = (code) => {
    setVisited(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const pct = Math.round((visited.length / COUNTRIES.length) * 100);

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">World Map</h1>
        <div className="section-subtitle">{visited.length} of {COUNTRIES.length} countries visited ({pct}%)</div>
      </div>

      <div className="map-progress card" style={{ marginBottom: 20 }}>
        <div className="progress-bar-wrap" style={{ marginBottom: 0 }}>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-pct">{pct}%</span>
        </div>
      </div>

      <div className="map-visual card" style={{ marginBottom: 20 }}>
        <div className="map-hint">Click on a country to mark it as visited</div>
        <div className="map-svg-wrap">
          <svg viewBox="0 0 1000 500" className="map-svg" xmlns="http://www.w3.org/2000/svg">
            {/* Simplified world outline background */}
            <rect width="1000" height="500" fill="#1c1c1f" rx="8"/>

            {/* Ocean texture */}
            <rect width="1000" height="500" fill="url(#ocean)" rx="8" opacity="0.3"/>
            <defs>
              <pattern id="ocean" patternUnits="userSpaceOnUse" width="20" height="20">
                <circle cx="10" cy="10" r="0.5" fill="#c9a96e" opacity="0.15"/>
              </pattern>
            </defs>

            {/* Country bubbles */}
            {COUNTRIES.map(c => {
              const x = (c.x / 100) * 1000;
              const y = (c.y / 100) * 500;
              const isVisited = visited.includes(c.code);
              return (
                <g key={c.code} onClick={() => toggle(c.code)} style={{ cursor: 'pointer' }}>
                  <circle
                    cx={x} cy={y} r={isVisited ? 9 : 7}
                    fill={isVisited ? '#c9a96e' : '#2a2a2e'}
                    stroke={isVisited ? '#e8c98a' : '#3a3a3e'}
                    strokeWidth={isVisited ? 2 : 1}
                    opacity={isVisited ? 1 : 0.8}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  {isVisited && (
                    <text x={x} y={y + 0.5} textAnchor="middle" dominantBaseline="middle"
                      fontSize="7" fill="#0d0d0f" fontWeight="bold">✓</text>
                  )}
                  <title>{c.name}{isVisited ? ' ✓ Visited' : ''}</title>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="card">
        <input className="input-field" placeholder="Search countries..." value={search}
          onChange={e => setSearch(e.target.value)} style={{ marginBottom: 16 }} />
        <div className="country-grid">
          {filtered.map(c => {
            const isVisited = visited.includes(c.code);
            return (
              <button
                key={c.code}
                className={`country-chip ${isVisited ? 'visited' : ''}`}
                onClick={() => toggle(c.code)}
              >
                {isVisited ? '✓ ' : ''}{c.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
