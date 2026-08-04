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
  workshop: '#10B981',          // Emerald Green
  webinar: '#8B5CF6',           // Purple
  default: '#04AA6D'
};

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

    return markers.map(m => {
      const color = m.categoryColor || MARKER_COLORS[m.eventType] || MARKER_COLORS.default;
      const displayLocation = (m.city && m.city !== 'Remote') 
        ? m.city 
        : (m.country && m.country !== 'Global' ? m.country : (m.title ? m.title.split(' ')[0] : 'EVENT'));

      return {
        ...m,
        id: m.id || m._id,
        lat: Number(m.lat || m.latitude || 0),
        lng: Number(m.lng || m.longitude || 0),
        size: m.isFeatured ? 0.6 : 0.45,
        color: color,
        displayLocation,
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

      // Initial POV centered smoothly
      globeEl.current.pointOfView({ lat: 20, lng: 10, altitude: 2.1 }, 1000);
    }
  }, []);

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
    el.style.transform = 'translate(-50%, -100%)';
    
    el.innerHTML = `
      <div class="relative group flex flex-col items-center">
        <!-- Popping Location Badge in CodeSphere Emerald -->
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/95 border border-[#04AA6D]/80 shadow-2xl shadow-emerald-950/90 backdrop-blur-md transition-all group-hover:scale-125">
          <span class="w-2.5 h-2.5 rounded-full animate-ping" style="background-color: ${d.color}"></span>
          <span class="text-[10px] font-black uppercase text-white tracking-widest font-mono">${d.displayLocation}</span>
        </div>
      </div>
    `;

    el.onclick = () => handlePointClick(d);
    el.onmouseenter = () => handlePointHover(d);
    el.onmouseleave = () => handlePointHover(null);

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
