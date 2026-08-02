import React, { useRef, useEffect, useState, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Building, ChevronRight } from 'lucide-react';

const MARKER_COLORS = {
  hackathon: '#04AA6D',         // CodeSphere Emerald
  ai_conference: '#10B981',     // Emerald Green
  coding_contest: '#06B6D4',    // Cyan
  cloud_summit: '#3B82F6',      // Blue
  conference: '#EAB308',        // Gold
  cybersecurity_conf: '#EF4444',// Red
  blockchain_event: '#8B5CF6',  // Purple
  workshop: '#04AA6D',          // CodeSphere Emerald
  default: '#04AA6D'
};

const CITY_COORDINATES = {
  'hyderabad': { lat: 17.3850, lng: 78.4867 },
  'bengaluru': { lat: 12.9716, lng: 77.5946 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'new delhi': { lat: 28.6139, lng: 77.2090 },
  'chennai': { lat: 13.0827, lng: 80.2707 },
  'pune': { lat: 18.5204, lng: 73.8567 },
  'kolkata': { lat: 22.5726, lng: 88.3639 },
  'san francisco': { lat: 37.7749, lng: -122.4194 },
  'mountain view': { lat: 37.4220, lng: -122.0840 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  'london': { lat: 51.5074, lng: -0.1278 },
  'tokyo': { lat: 35.6762, lng: 139.6503 },
  'berlin': { lat: 52.5200, lng: 13.4050 },
  'paris': { lat: 48.8566, lng: 2.3522 },
  'singapore': { lat: 1.3521, lng: 103.8198 },
  'sydney': { lat: -33.8688, lng: 151.2093 },
  'dubai': { lat: 25.2048, lng: 55.2708 },
  'toronto': { lat: 43.6532, lng: -79.3832 },
  'seattle': { lat: 47.6062, lng: -122.3321 },
  'austin': { lat: 30.2672, lng: -97.7431 },
  'chicago': { lat: 41.8781, lng: -87.6298 },
  'remote': { lat: 20.5937, lng: 78.9629 },
};

const GLOBAL_HUBS_FALLBACK = [
  { city: 'San Francisco', lat: 37.7749, lng: -122.4194 },
  { city: 'London', lat: 51.5074, lng: -0.1278 },
  { city: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { city: 'New York', lat: 40.7128, lng: -74.0060 },
  { city: 'Berlin', lat: 52.5200, lng: 13.4050 },
  { city: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { city: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { city: 'Toronto', lat: 43.6532, lng: -79.3832 },
];

export const Event3DGlobe = ({ markers = [], onSelectEvent }) => {
  const globeContainerRef = useRef();
  const globeEl = useRef();
  const [containerWidth, setContainerWidth] = useState(1000);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [countriesData, setCountriesData] = useState([]);

  // Load realistic GeoJSON country borders for hyper-realistic Earth continents
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => {
        if (data && data.features) {
          setCountriesData(data.features);
        }
      })
      .catch(() => {
        // Fallback gracefully if offline
      });
  }, []);

  // Measure container width dynamically so the Three.js space canvas fills 100% of container
  useEffect(() => {
    const updateWidth = () => {
      if (globeContainerRef.current) {
        setContainerWidth(globeContainerRef.current.clientWidth || 1000);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Format markers directly from MongoDB — ONLY render if admin/instructor events exist in DB
  const processedMarkers = useMemo(() => {
    if (!Array.isArray(markers) || markers.length === 0) return [];

    const regionMap = {};

    return markers.map((m, idx) => {
      const color = m.categoryColor || MARKER_COLORS[m.eventType] || MARKER_COLORS.default;
      
      let lat = Number(m.lat || m.latitude || 0);
      let lng = Number(m.lng || m.longitude || 0);

      const cityKey = (m.city || '').toLowerCase().trim();
      const countryKey = (m.country || '').toLowerCase().trim();

      // Priority 1: Physical city match
      if (CITY_COORDINATES[cityKey]) {
        lat = CITY_COORDINATES[cityKey].lat;
        lng = CITY_COORDINATES[cityKey].lng;
      } else if (CITY_COORDINATES[countryKey]) {
        lat = CITY_COORDINATES[countryKey].lat;
        lng = CITY_COORDINATES[countryKey].lng;
      }

      // Priority 2: If Remote/Global or unassigned, pick a distinct global hub
      if (cityKey === 'remote' || countryKey === 'global' || (!lat && !lng)) {
        const hub = GLOBAL_HUBS_FALLBACK[idx % GLOBAL_HUBS_FALLBACK.length];
        lat = hub.lat;
        lng = hub.lng;
      }

      // Clean Display Label
      let displayLocation = 'EVENT';
      if (m.city && m.city !== 'Remote') {
        displayLocation = m.city.toUpperCase();
      } else if (m.country && m.country !== 'Global') {
        displayLocation = m.country.toUpperCase();
      } else {
        const matchedHub = GLOBAL_HUBS_FALLBACK.find(h => Math.abs(h.lat - lat) < 2 && Math.abs(h.lng - lng) < 2);
        displayLocation = matchedHub ? `GLOBAL (${matchedHub.city.toUpperCase()})` : 'GLOBAL WEBINAR';
      }

      // Prevent clustering: Check region bucket (approx 5 degrees radius)
      const regionKey = `${Math.round(lat / 5)},${Math.round(lng / 5)}`;
      let staggerTransform = 'translate(-50%, -100%)';
      if (regionMap[regionKey]) {
        const count = regionMap[regionKey];
        regionMap[regionKey] += 1;
        
        // Offset coordinates into distinct nearby space
        const angle = count * 2.3;
        const dist = 7.0 * Math.sqrt(count);
        lat += dist * Math.cos(angle);
        lng += dist * Math.sin(angle);

        // Stagger pill orientation around marker pin
        const transforms = [
          'translate(-50%, -115%)',
          'translate(-50%, 20px)',
          'translate(15px, -50%)',
          'translate(-115%, -50%)'
        ];
        staggerTransform = transforms[count % transforms.length];
      } else {
        regionMap[regionKey] = 1;
      }

      return {
        ...m,
        id: m.id || m._id,
        lat: Number(lat.toFixed(4)),
        lng: Number(lng.toFixed(4)),
        size: m.isFeatured ? 0.65 : 0.5,
        color: color,
        displayLocation,
        staggerTransform,
        maxRadius: 10,
        propagationSpeed: 3.5,
        repeatPeriod: 800,
      };
    });
  }, [markers]);

  useEffect(() => {
    if (globeEl.current) {
      // Configure controls: auto-rotate smoothly on its axis without floating or roaming lines
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.8;
      controls.enableZoom = true;
      controls.minDistance = 150;
      controls.maxDistance = 480;

      // Auto-center POV around published markers if available
      if (processedMarkers.length > 0) {
        const avgLat = processedMarkers.reduce((acc, curr) => acc + curr.lat, 0) / processedMarkers.length;
        const avgLng = processedMarkers.reduce((acc, curr) => acc + curr.lng, 0) / processedMarkers.length;
        globeEl.current.pointOfView({ lat: avgLat || 20, lng: avgLng || 10, altitude: 2.1 }, 1200);
      } else {
        globeEl.current.pointOfView({ lat: 20, lng: 10, altitude: 2.1 }, 1000);
      }
    }
  }, [processedMarkers]);

  const handlePointHover = (point) => {
    setHoveredPoint(point);
  };

  const handlePointClick = (point) => {
    setSelectedPoint(point);
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: point.lat, lng: point.lng, altitude: 1.4 }, 1200);
    }
    if (onSelectEvent) {
      onSelectEvent(point);
    }
  };

  const handleMouseMove = (e) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  // Custom HTML Elements popping out strictly when admin/instructor events exist in MongoDB (NO 3D BARS)
  const createHtmlElement = (d) => {
    const el = document.createElement('div');
    el.style.pointerEvents = 'auto';
    el.style.cursor = 'pointer';
    el.style.transform = d.staggerTransform || 'translate(-50%, -100%)';
    el.style.zIndex = '20';
    
    el.innerHTML = `
      <div class="relative group flex flex-col items-center">
        <!-- Popping Location Badge in CodeSphere Emerald -->
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/95 border border-[#04AA6D] shadow-2xl shadow-emerald-950/90 backdrop-blur-md transition-all duration-200 group-hover:scale-125 group-hover:bg-slate-900 group-hover:border-emerald-400">
          <span class="w-2.5 h-2.5 rounded-full animate-ping shrink-0" style="background-color: ${d.color}"></span>
          <span class="text-[10px] font-black uppercase text-white tracking-widest font-mono whitespace-nowrap">${d.displayLocation}</span>
        </div>
      </div>
    `;

    el.onclick = () => handlePointClick(d);
    el.onmouseenter = () => {
      el.style.zIndex = '100';
      handlePointHover(d);
    };
    el.onmouseleave = () => {
      el.style.zIndex = '20';
      handlePointHover(null);
    };

    return el;
  };

  return (
    <div 
      ref={globeContainerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[660px] rounded-3xl bg-[#010208] bg-[url('//unpkg.com/three-globe/example/img/night-sky.png')] bg-cover bg-center border border-[#04AA6D]/30 shadow-2xl shadow-emerald-950/40 overflow-hidden flex items-center justify-center select-none"
    >
      {/* Dynamic Photorealistic Cosmic Space Fog & Star Nebula Clouds Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(4,170,109,0.22)_0%,transparent_55%),radial-gradient(circle_at_75%_75%,rgba(16,185,129,0.22)_0%,transparent_55%),radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.15)_0%,transparent_70%)] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(4,170,109,0.12)_0%,transparent_60%)] pointer-events-none z-0" />

      {/* Top Status Header */}
      <div className="absolute top-4 left-6 z-10 flex items-center gap-3 bg-slate-950/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#04AA6D]/40 shadow-xl">
        <div className="w-3 h-3 rounded-full bg-[#04AA6D] animate-ping" />
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase font-mono">CODESPHERE LIVE GLOBE</span>
          <span className="text-xs font-bold text-white">{markers.length} Published Admin Events Active</span>
        </div>
      </div>

      {/* Control Tips Overlay */}
      <div className="absolute bottom-4 left-6 z-10 hidden md:flex items-center gap-4 bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 text-[10px] text-slate-300 font-mono shadow-lg">
        <span>🖱 Drag: Rotate Axis</span>
        <span>•</span>
        <span>🔍 Scroll: Zoom</span>
        <span>•</span>
        <span>📍 Click Marker: Open Details</span>
      </div>

      {/* Photorealistic 3D Globe with Realistic Country Boundaries */}
      <div className="w-full h-full flex items-center justify-center relative z-0">
        <Globe
          ref={globeEl}
          width={containerWidth}
          height={660}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          showAtmosphere={true}
          atmosphereColor="#3b82f6"
          atmosphereAltitude={0.25}

          // Realistic Country Polygons & Borders Layer
          polygonsData={countriesData}
          polygonCapColor={() => 'rgba(4, 170, 109, 0.05)'}
          polygonSideColor={() => 'rgba(4, 170, 109, 0.03)'}
          polygonStrokeColor={() => 'rgba(4, 170, 109, 0.35)'}
          polygonAltitude={0.008}

          // NO 3D Bar Cylinders
          
          // Subtle Glowing Surface Points for Admin Events
          pointsData={processedMarkers}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointAltitude={0.03}
          pointRadius="size"
          pointsMerge={false}
          onPointHover={handlePointHover}
          onPointClick={handlePointClick}
          
          // Pulsating Radar Waves for Admin Events
          ringsData={processedMarkers}
          ringLat="lat"
          ringLng="lng"
          ringColor={(d) => (t) => `rgba(4,170,109,${1 - t})`}
          ringMaxRadius={10}
          ringPropagationSpeed={3.5}
          ringRepeatPeriod={800}

          // Custom Popping HTML Badges over event locations
          htmlElementsData={processedMarkers}
          htmlLat="lat"
          htmlLng="lng"
          htmlElement={createHtmlElement}
        />
      </div>

      {/* Hover Tooltip Overlay */}
      <AnimatePresence>
        {hoveredPoint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'fixed',
              left: Math.min(tooltipPos.x + 15, window.innerWidth - 320),
              top: Math.min(tooltipPos.y + 15, window.innerHeight - 250),
              pointerEvents: 'none',
              zIndex: 50,
            }}
            className="w-72 bg-slate-950/95 backdrop-blur-2xl border border-emerald-500/50 rounded-2xl p-4 shadow-2xl shadow-emerald-950/90 text-slate-100 flex flex-col gap-2.5 font-sans"
          >
            {hoveredPoint.bannerImage && (
              <img 
                src={hoveredPoint.bannerImage} 
                alt={hoveredPoint.title} 
                className="w-full h-24 object-cover rounded-xl border border-slate-800"
              />
            )}
            
            <div className="flex justify-between items-start gap-2">
              <span 
                className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded font-mono border bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              >
                {hoveredPoint.categoryName || hoveredPoint.eventType}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold font-mono">
                {hoveredPoint.prizePool ? `Prize: ${hoveredPoint.prizePool}` : 'Free Access'}
              </span>
            </div>

            <h4 className="font-extrabold text-xs text-white leading-tight line-clamp-2">{hoveredPoint.title}</h4>
            
            <div className="flex flex-col gap-1 text-[10px] text-slate-400 font-sans mt-0.5">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#04AA6D] shrink-0" />
                <span className="truncate">{hoveredPoint.city}, {hoveredPoint.country}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-blue-400 shrink-0" />
                <span>{new Date(hoveredPoint.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Hosted by {hoveredPoint.organizerName || hoveredPoint.companyName}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[9px] text-[#04AA6D] font-bold uppercase tracking-wider">
              <span>Click marker to view event</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Event3DGlobe;
