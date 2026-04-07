import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './WorldMap.css';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// ISO numeric (3-digit) -> ISO alpha-2 mapping (no duplicates)
const NUM_TO_CODE = {
  '004': 'AF', '008': 'AL', '012': 'DZ', '024': 'AO', '031': 'AZ',
  '032': 'AR', '036': 'AU', '040': 'AT', '050': 'BD', '051': 'AM',
  '056': 'BE', '064': 'BT', '068': 'BO', '070': 'BA', '072': 'BW',
  '076': 'BR', '096': 'BN', '100': 'BG', '104': 'MM', '112': 'BY',
  '116': 'KH', '120': 'CM', '124': 'CA', '140': 'CF', '144': 'LK',
  '152': 'CL', '156': 'CN', '170': 'CO', '178': 'CG', '180': 'CD',
  '188': 'CR', '191': 'HR', '192': 'CU', '196': 'CY', '203': 'CZ',
  '204': 'BJ', '208': 'DK', '214': 'DO', '218': 'EC', '222': 'SV',
  '231': 'ET', '232': 'ER', '233': 'EE', '246': 'FI', '250': 'FR',
  '266': 'GA', '268': 'GE', '275': 'PS', '276': 'DE', '288': 'GH',
  '300': 'GR', '320': 'GT', '324': 'GN', '328': 'GY', '332': 'HT',
  '340': 'HN', '348': 'HU', '352': 'IS', '356': 'IN', '360': 'ID',
  '364': 'IR', '368': 'IQ', '372': 'IE', '376': 'IL', '380': 'IT',
  '384': 'CI', '388': 'JM', '392': 'JP', '398': 'KZ', '400': 'JO',
  '404': 'KE', '408': 'KP', '410': 'KR', '414': 'KW', '417': 'KG',
  '418': 'LA', '422': 'LB', '426': 'LS', '428': 'LV', '430': 'LR',
  '434': 'LY', '440': 'LT', '442': 'LU', '450': 'MG', '454': 'MW',
  '458': 'MY', '466': 'ML', '478': 'MR', '484': 'MX', '496': 'MN',
  '498': 'MD', '499': 'ME', '504': 'MA', '508': 'MZ', '516': 'NA',
  '524': 'NP', '528': 'NL', '554': 'NZ', '558': 'NI', '562': 'NE',
  '566': 'NG', '578': 'NO', '586': 'PK', '591': 'PA', '598': 'PG',
  '600': 'PY', '604': 'PE', '608': 'PH', '616': 'PL', '620': 'PT',
  '630': 'PR', '634': 'QA', '642': 'RO', '643': 'RU', '646': 'RW',
  '682': 'SA', '686': 'SN', '688': 'RS', '694': 'SL', '703': 'SK',
  '704': 'VN', '705': 'SI', '706': 'SO', '710': 'ZA', '716': 'ZW',
  '724': 'ES', '729': 'SD', '740': 'SR', '748': 'SZ', '752': 'SE',
  '756': 'CH', '760': 'SY', '762': 'TJ', '764': 'TH', '768': 'TG',
  '780': 'TT', '784': 'AE', '788': 'TN', '792': 'TR', '795': 'TM',
  '800': 'UG', '804': 'UA', '807': 'MK', '818': 'EG', '826': 'GB',
  '834': 'TZ', '840': 'US', '858': 'UY', '860': 'UZ', '862': 'VE',
  '887': 'YE', '894': 'ZM',
};

const CODE_TO_NAME = {
  AF: 'Afghanistan', AL: 'Albania', DZ: 'Algeria', AO: 'Angola', AM: 'Armenia',
  AR: 'Argentina', AU: 'Australia', AT: 'Austria', AZ: 'Azerbaijan', BD: 'Bangladesh',
  BY: 'Belarus', BE: 'Belgium', BJ: 'Benin', BT: 'Bhutan', BO: 'Bolivia',
  BA: 'Bosnia & Herzegovina', BW: 'Botswana', BR: 'Brazil', BN: 'Brunei', BG: 'Bulgaria',
  CM: 'Cameroon', CA: 'Canada', CF: 'Cent. African Rep.', CL: 'Chile', CN: 'China',
  CO: 'Colombia', CG: 'Congo', CD: 'DR Congo', CR: 'Costa Rica', HR: 'Croatia',
  CU: 'Cuba', CY: 'Cyprus', CZ: 'Czech Republic', DK: 'Denmark', DO: 'Dominican Rep.',
  EC: 'Ecuador', EG: 'Egypt', SV: 'El Salvador', ER: 'Eritrea', EE: 'Estonia',
  ET: 'Ethiopia', FI: 'Finland', FR: 'France', GA: 'Gabon', GE: 'Georgia',
  DE: 'Germany', GH: 'Ghana', GR: 'Greece', GT: 'Guatemala', GN: 'Guinea',
  GY: 'Guyana', HT: 'Haiti', HN: 'Honduras', HU: 'Hungary', IS: 'Iceland',
  IN: 'India', ID: 'Indonesia', IR: 'Iran', IQ: 'Iraq', IE: 'Ireland',
  IL: 'Israel', IT: 'Italy', CI: "Côte d'Ivoire", JM: 'Jamaica', JP: 'Japan',
  JO: 'Jordan', KZ: 'Kazakhstan', KE: 'Kenya', KP: 'North Korea', KR: 'South Korea',
  KW: 'Kuwait', KG: 'Kyrgyzstan', LA: 'Laos', LV: 'Latvia', LB: 'Lebanon',
  LS: 'Lesotho', LR: 'Liberia', LY: 'Libya', LT: 'Lithuania', LU: 'Luxembourg',
  MG: 'Madagascar', MW: 'Malawi', MY: 'Malaysia', ML: 'Mali', MR: 'Mauritania',
  MX: 'Mexico', MD: 'Moldova', MK: 'North Macedonia', MN: 'Mongolia', ME: 'Montenegro',
  MA: 'Morocco', MZ: 'Mozambique', MM: 'Myanmar', NA: 'Namibia', NP: 'Nepal',
  NL: 'Netherlands', NZ: 'New Zealand', NI: 'Nicaragua', NE: 'Niger', NG: 'Nigeria',
  NO: 'Norway', PK: 'Pakistan', PA: 'Panama', PG: 'Papua New Guinea', PY: 'Paraguay',
  PE: 'Peru', PH: 'Philippines', PL: 'Poland', PT: 'Portugal', PS: 'Palestine',
  QA: 'Qatar', RO: 'Romania', RU: 'Russia', RW: 'Rwanda', SA: 'Saudi Arabia',
  SN: 'Senegal', RS: 'Serbia', SL: 'Sierra Leone', SK: 'Slovakia', SI: 'Slovenia',
  SO: 'Somalia', ZA: 'South Africa', SD: 'Sudan', SR: 'Suriname', SZ: 'Eswatini',
  SE: 'Sweden', CH: 'Switzerland', SY: 'Syria', TJ: 'Tajikistan', TZ: 'Tanzania',
  TH: 'Thailand', TG: 'Togo', TT: 'Trinidad & Tobago', TN: 'Tunisia', TR: 'Turkey',
  TM: 'Turkmenistan', UG: 'Uganda', UA: 'Ukraine', AE: 'UAE', GB: 'United Kingdom',
  US: 'United States', UY: 'Uruguay', UZ: 'Uzbekistan', VE: 'Venezuela', VN: 'Vietnam',
  YE: 'Yemen', ZM: 'Zambia', ZW: 'Zimbabwe', ES: 'Spain', LK: 'Sri Lanka',
  KH: 'Cambodia', PR: 'Puerto Rico',
};

export default function WorldMap() {
  const [visited, setVisited] = useLocalStorage('fs-visited', []);
  const [search, setSearch] = useState('');
  const [tooltip, setTooltip] = useState({ visible: false, name: '', x: 0, y: 0 });

  const toggle = (code) => {
    if (!code) return;
    setVisited(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const countryCodes = Object.keys(CODE_TO_NAME);
  const filtered = countryCodes
    .filter(code => CODE_TO_NAME[code].toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => CODE_TO_NAME[a].localeCompare(CODE_TO_NAME[b]));

  const pct = Math.round((visited.length / countryCodes.length) * 100);

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">World Map</h1>
        <div className="section-subtitle">
          {visited.length} of {countryCodes.length} countries visited ({pct}%)
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="progress-bar-wrap" style={{ marginBottom: 0 }}>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-pct">{pct}%</span>
        </div>
      </div>

      <div className="map-visual card" style={{ marginBottom: 20, position: 'relative' }}>
        <div className="map-hint">Click a country to mark it as visited</div>

        {tooltip.visible && (
          <div className="map-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
            {tooltip.name}
          </div>
        )}

        <ComposableMap
          projectionConfig={{ scale: 147, center: [10, 10] }}
          style={{ width: '100%', height: 'auto', background: '#141416', borderRadius: 8 }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                const numId = String(geo.id).padStart(3, '0');
                const code = NUM_TO_CODE[numId];
                const isVisited = code && visited.includes(code);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => toggle(code)}
                    onMouseEnter={(e) => {
                      const name = code ? CODE_TO_NAME[code] : geo.properties?.name;
                      if (name) {
                        const rect = e.target.closest('svg').getBoundingClientRect();
                        setTooltip({
                          visible: true,
                          name: `${name}${isVisited ? ' ✓' : ''}`,
                          x: e.clientX - rect.left + 12,
                          y: e.clientY - rect.top - 36,
                        });
                      }
                    }}
                    onMouseLeave={() => setTooltip({ visible: false, name: '', x: 0, y: 0 })}
                    style={{
                      default: {
                        fill: isVisited ? '#c9a96e' : '#2a2a2e',
                        stroke: '#141416',
                        strokeWidth: 0.5,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      hover: {
                        fill: isVisited ? '#e8c98a' : '#3d3d42',
                        stroke: '#141416',
                        strokeWidth: 0.5,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: isVisited ? '#b08050' : '#505055',
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      <div className="card">
        <input
          className="input-field"
          placeholder="Search countries..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <div className="country-grid">
          {filtered.map(code => {
            const isVisited = visited.includes(code);
            return (
              <button
                key={code}
                className={`country-chip ${isVisited ? 'visited' : ''}`}
                onClick={() => toggle(code)}
              >
                {isVisited ? '✓ ' : ''}{CODE_TO_NAME[code]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
