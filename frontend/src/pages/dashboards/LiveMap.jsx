import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, LayersControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../../utils/api';
import axios from 'axios';
import { Activity, AlertTriangle, Shield, MapPin, RefreshCw, Clock, Flame, Waves, Wind, X, Layers, Zap, Eye, EyeOff, Info } from 'lucide-react';

const { BaseLayer } = LayersControl;

// ── Pulse CSS injected once ──────────────────────────────────────────────────
const PULSE_CSS = `
@keyframes dlPulse1{0%{transform:translate(-50%,-50%) scale(1);opacity:.7}100%{transform:translate(-50%,-50%) scale(2.5);opacity:0}}
@keyframes dlPulse2{0%{transform:translate(-50%,-50%) scale(1);opacity:.5}100%{transform:translate(-50%,-50%) scale(3.5);opacity:0}}
`;

// ── India Disaster Risk Prediction Zones ────────────────────────────────────
const RISK_ZONES = [
  { id:'eq1', name:'Himalayan Seismic Belt',      type:'earthquake', risk:'critical', lat:30.5,  lng:79.0,  radius:280000, info:'Zone V – highest seismic risk. Major Himalayan fault lines.' },
  { id:'eq2', name:'Kutch Seismic Zone',           type:'earthquake', risk:'high',     lat:23.7,  lng:69.0,  radius:180000, info:'Zone V – site of devastating 2001 earthquake.' },
  { id:'eq3', name:'Northeast Seismic Zone',       type:'earthquake', risk:'critical', lat:26.2,  lng:93.0,  radius:270000, info:'Zone V – most earthquake-prone region in India.' },
  { id:'eq4', name:'Delhi NCR Seismic Zone',       type:'earthquake', risk:'high',     lat:28.6,  lng:77.2,  radius:130000, info:'Zone IV – high-risk urban seismic zone.' },
  { id:'fl1', name:'Brahmaputra Valley Floods',    type:'flood',      risk:'critical', lat:26.5,  lng:92.8,  radius:220000, info:'Annual flooding. Monsoon season Jun–Sep.' },
  { id:'fl2', name:'Bihar Flood Plains',           type:'flood',      risk:'high',     lat:25.8,  lng:85.8,  radius:240000, info:'Ganges tributaries cause recurring floods.' },
  { id:'fl3', name:'Kerala Flood Zone',            type:'flood',      risk:'high',     lat:10.5,  lng:76.5,  radius:140000, info:'Heavy monsoon rains trigger severe flooding.' },
  { id:'cy1', name:'Bay of Bengal Cyclone Track',  type:'cyclone',    risk:'critical', lat:16.5,  lng:82.5,  radius:340000, info:'Most active cyclone region. Oct–Dec peak.' },
  { id:'cy2', name:'Gujarat Arabian Sea Cyclone',  type:'cyclone',    risk:'high',     lat:22.5,  lng:70.5,  radius:210000, info:'Pre/post-monsoon cyclone threat.' },
  { id:'ls1', name:'Western Ghats Landslides',     type:'landslide',  risk:'medium',   lat:14.0,  lng:75.2,  radius:170000, info:'Heavy rainfall triggers monsoon landslides.' },
  { id:'ls2', name:'Uttarakhand Landslide Zone',   type:'landslide',  risk:'high',     lat:30.1,  lng:79.5,  radius:140000, info:'Fragile Himalayan terrain; annual monsoon disasters.' },
];

const ZONE_COLOR = {
  earthquake:{ critical:'#ef4444', high:'#f97316', medium:'#eab308' },
  flood:     { critical:'#3b82f6', high:'#60a5fa', medium:'#93c5fd' },
  cyclone:   { critical:'#8b5cf6', high:'#a78bfa', medium:'#c4b5fd' },
  landslide: { critical:'#d97706', high:'#f59e0b', medium:'#fcd34d' },
};

const TYPE_META = {
  earthquake: { label:'Earthquake', color:'#f97316', Icon: Zap },
  fire:       { label:'Wildfire',   color:'#ef4444', Icon: Flame },
  storm:      { label:'Storm',      color:'#8b5cf6', Icon: Wind },
  flood:      { label:'Flood',      color:'#3b82f6', Icon: Waves },
  volcano:    { label:'Volcano',    color:'#dc2626', Icon: Flame },
  shelter:    { label:'Shelter',    color:'#22c55e', Icon: Shield },
  emergency:  { label:'Emergency',  color:'#f43f5e', Icon: AlertTriangle },
};

function createIcon(color, size = 18, critical = false) {
  const speed = critical ? '1.5s' : '2.5s';
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:${size}px;height:${size}px">
      <div style="position:absolute;top:50%;left:50%;width:${size*3}px;height:${size*3}px;background:${color}25;border-radius:50%;animation:dlPulse2 ${speed} ease-out infinite 0.4s"></div>
      <div style="position:absolute;top:50%;left:50%;width:${size*2}px;height:${size*2}px;background:${color}40;border-radius:50%;animation:dlPulse1 ${speed} ease-out infinite"></div>
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:${size}px;height:${size}px;background:${color};border-radius:50%;border:2px solid white;box-shadow:0 0 8px ${color}88"></div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size],
  });
}

// Auto-pan map to clicked marker
function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 7, { duration: 1.2 });
  }, [target, map]);
  return null;
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function LiveMap() {
  const [events, setEvents]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selected, setSelected]       = useState(null);
  const [flyTarget, setFlyTarget]     = useState(null);
  const [showZones, setShowZones]     = useState(true);
  const [showPanel, setShowPanel]     = useState(true);
  const [filters, setFilters]         = useState({ earthquake:true, fire:true, storm:true, flood:true, volcano:true, shelter:true, emergency:true });
  const timerRef = useRef(null);

  // Inject pulse CSS once
  useEffect(() => {
    const tag = document.createElement('style');
    tag.textContent = PULSE_CSS;
    document.head.appendChild(tag);
    return () => {
      if (document.head.contains(tag)) document.head.removeChild(tag);
    };
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const collected = [];

      // 1. USGS Earthquakes
      try {
        const usgs = await axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
        usgs.data.features.forEach(f => {
          const [lng, lat] = f.geometry.coordinates;
          collected.push({
            id: f.id, type: 'earthquake',
            lat, lng,
            title: f.properties.title,
            mag: f.properties.mag,
            place: f.properties.place,
            time: new Date(f.properties.time).toLocaleString(),
            critical: f.properties.mag >= 5.5,
            source: 'USGS',
          });
        });
      } catch (_) {}

      // 2. NASA EONET
      try {
        const eonet = await axios.get('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=7&limit=80');
        eonet.data.events.forEach(ev => {
          const geo = ev.geometry?.[ev.geometry.length - 1];
          if (!geo || geo.type !== 'Point') return;
          const [lng, lat] = geo.coordinates;
          const cat = ev.categories?.[0]?.id;
          const catMap = { '8':'fire','10':'storm','12':'earthquake','15':'flood','14':'volcano','16':'storm','19':'flood' };
          const type = catMap[cat] || 'storm';
          collected.push({
            id: ev.id, type,
            lat, lng,
            title: ev.title,
            time: geo.date ? new Date(geo.date).toLocaleString() : 'N/A',
            critical: false,
            source: 'NASA EONET',
          });
        });
      } catch (_) {}

      // 3. Backend emergencies & shelters
      try {
        const [emRes, shRes] = await Promise.all([
          api.get('/api/emergencies'),
          api.get('/api/shelters'),
        ]);
        emRes.data.forEach(e => {
          const coords = e.location?.coordinates;
          if (!coords) return;
          collected.push({
            id: e._id, type: 'emergency',
            lat: coords[1], lng: coords[0],
            title: e.title, severity: e.severity,
            time: new Date(e.createdAt).toLocaleString(),
            critical: e.severity === 'Critical',
            source: 'DisasterResponseHub',
          });
        });
        shRes.data.forEach(s => {
          const coords = s.geoLocation?.coordinates;
          if (!coords) return;
          collected.push({
            id: s._id, type: 'shelter',
            lat: coords[1], lng: coords[0],
            title: s.shelterName,
            capacity: s.capacity, available: s.availability,
            time: 'Active', critical: false,
            source: 'DisasterResponseHub',
          });
        });
      } catch (_) {}

      setEvents(collected);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    timerRef.current = setInterval(fetchAll, 60000);
    return () => clearInterval(timerRef.current);
  }, []);

  const visible = events.filter(e => filters[e.type]);
  const stats = {
    total:    events.length,
    critical: events.filter(e => e.critical).length,
    shelters: events.filter(e => e.type === 'shelter').length,
    quakes:   events.filter(e => e.type === 'earthquake').length,
    criticalIncidents: events.filter(e => e.critical && e.type === 'emergency').length
  };

  const toggleFilter = (key) => setFilters(f => ({ ...f, [key]: !f[key] }));

  const selectEvent = (ev) => {
    setSelected(ev);
    setFlyTarget({ lat: ev.lat, lng: ev.lng });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-900 text-white overflow-hidden">

      {/* ── Stats Bar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 p-3 bg-slate-800 border-b border-slate-700 shrink-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 flex-1">
          {[
            { label:'Total Events',    value: stats.total,    color:'text-blue-400',   bg:'bg-blue-500/10'  },
            { label:'Critical',        value: stats.critical, color:'text-red-400',    bg:'bg-red-500/10'   },
            { label:'Shelters Active', value: stats.shelters, color:'text-green-400',  bg:'bg-green-500/10' },
            { label:'Earthquakes',     value: stats.quakes,   color:'text-orange-400', bg:'bg-orange-500/10'},
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl px-3 py-2 flex items-center gap-2`}>
              <div>
                <p className={`text-lg sm:text-xl font-bold ${s.color} leading-none mb-1`}>{s.value}</p>
                <p className="text-[9px] sm:text-xs text-slate-400 uppercase tracking-widest">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:ml-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-700">
          <div className="flex flex-col items-start sm:items-end sm:mr-4">
             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400 leading-none mb-1">Tactical Grid</p>
             {lastUpdated && (
               <span className="text-[10px] text-slate-500 flex items-center gap-1">
                 <Clock size={10}/> {lastUpdated.toLocaleTimeString()}
               </span>
             )}
          </div>
          <button onClick={fetchAll} disabled={loading}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg text-[10px] font-black transition-colors disabled:opacity-50 shadow-lg shadow-blue-600/20 uppercase tracking-widest">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''}/> Sync
          </button>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Panel */}
        {showPanel && (
          <div className="absolute inset-0 sm:relative sm:inset-auto z-[1050] sm:z-auto w-full sm:w-72 bg-slate-800 border-r border-slate-700 flex flex-col overflow-hidden shrink-0">
            {/* Mobile Header */}
            <div className="sm:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-700">
               <h3 className="font-black text-blue-400 uppercase tracking-widest text-xs">Tactical Intelligence</h3>
               <button onClick={() => setShowPanel(false)} className="p-2 bg-slate-800 rounded-lg"><X size={16} /></button>
            </div>

            {/* Layer Filters */}
            <div className="p-3 border-b border-slate-700">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Layers size={12}/> Event Layers
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(TYPE_META).map(([key, meta]) => {
                  const active = filters[key];
                  return (
                    <button key={key} onClick={() => toggleFilter(key)}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        active ? 'border-transparent text-white' : 'border-slate-600 text-slate-500 bg-transparent'
                      }`}
                      style={active ? { background: meta.color + '33', borderColor: meta.color + '66' } : {}}>
                      <span style={{ color: active ? meta.color : '#64748b' }}>●</span>
                      {meta.label}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setShowZones(v => !v)}
                className={`mt-2 w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${showZones ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500 shadow-lg shadow-yellow-500/5' : 'border-slate-700 text-slate-500'}`}>
                {showZones ? <Eye size={11}/> : <EyeOff size={11}/>}
                Risk Zones
              </button>
            </div>

            {/* Situation Report Sidebar */}
            <div className="p-4 border-b border-slate-700 bg-slate-900/50">
               <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Shield size={12} className="text-emerald-500" /> Situation Report
               </h4>
               <div className="space-y-3">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] text-slate-500 font-bold uppercase">Critical Tasks</span>
                     <span className="text-xs font-black text-red-500">{stats.criticalIncidents}</span>
                  </div>
                  <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                     <div style={{ width: '65%' }} className="h-full bg-red-500"></div>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                     <span className="text-[10px] text-slate-500 font-bold uppercase">Deployment</span>
                     <span className="text-xs font-black text-blue-400">88%</span>
                  </div>
               </div>
            </div>

            {/* Live Event Feed */}
            <div className="flex-1 overflow-y-auto p-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1">
                <Activity size={12}/> Live Feed ({visible.length})
              </p>
              {loading && events.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-slate-500">
                  <RefreshCw size={16} className="animate-spin mr-2"/> Loading...
                </div>
              ) : visible.length === 0 ? (
                <p className="text-center text-slate-500 text-xs py-8">No events match filters</p>
              ) : (
                visible.slice(0, 60).map(ev => {
                  const meta = TYPE_META[ev.type] || TYPE_META.emergency;
                  return (
                    <button key={ev.id} onClick={() => selectEvent(ev)}
                      className={`w-full text-left mb-1 p-2 rounded-lg border transition-all hover:scale-[1.01] ${
                        selected?.id === ev.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-700/40 hover:bg-slate-700/70'
                      }`}>
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 text-xs" style={{ color: meta.color }}>●</span>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-white truncate">{ev.title}</p>
                          <p className="text-xs text-slate-400">{meta.label} · {ev.source}</p>
                          {ev.mag && <p className="text-xs text-orange-400 font-bold">M{ev.mag.toFixed(1)}</p>}
                        </div>
                        {ev.critical && <span className="ml-auto shrink-0 text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold">!</span>}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Map Area */}
        <div className="flex-1 relative">
          <button onClick={() => setShowPanel(v => !v)}
            className="absolute top-3 left-3 z-[1000] bg-slate-800 border border-slate-600 text-white p-1.5 rounded-lg hover:bg-slate-700 transition-colors">
            <Layers size={14}/>
          </button>

          {/* Legend */}
          <div className="absolute bottom-6 right-3 z-[1000] bg-slate-800/90 backdrop-blur border border-slate-700 rounded-xl p-3 text-[10px] sm:text-xs max-w-[120px] sm:max-w-[160px] hidden sm:block">
            <p className="font-bold text-slate-300 mb-2">Legend</p>
            {Object.entries(TYPE_META).map(([k,m]) => (
              <div key={k} className="flex items-center gap-1.5 mb-1">
                <span style={{ color: m.color }} className="text-base leading-none">●</span>
                <span className="text-slate-400">{m.label}</span>
              </div>
            ))}
          </div>

          {/* Selected event detail card */}
          {selected && (
            <div className="absolute top-3 left-3 right-3 sm:left-auto sm:right-3 z-[1010] w-auto sm:w-64 bg-slate-800/95 backdrop-blur border border-slate-600 rounded-xl p-4 shadow-2xl">
              <button onClick={() => setSelected(null)} className="absolute top-2 right-2 text-slate-400 hover:text-white"><X size={14}/></button>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: (TYPE_META[selected.type]||TYPE_META.emergency).color }} className="text-lg">●</span>
                <span className="text-xs font-semibold text-slate-300">{(TYPE_META[selected.type]||TYPE_META.emergency).label}</span>
                {selected.critical && <span className="ml-auto text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold animate-pulse">CRITICAL</span>}
              </div>
              <p className="text-sm font-bold text-white mb-1">{selected.title}</p>
              {selected.mag    && <p className="text-xs text-orange-400 mb-1 font-bold">Magnitude: {selected.mag.toFixed(1)}</p>}
              {selected.place  && <p className="text-xs text-slate-400 mb-1">{selected.place}</p>}
              {selected.severity && <p className="text-xs text-slate-400 mb-1">Severity: {selected.severity}</p>}
              {selected.capacity && <p className="text-xs text-green-400 mb-1">Capacity: {selected.available}/{selected.capacity}</p>}
              <p className="text-[10px] text-slate-500 flex items-center gap-1"><Clock size={10}/> {selected.time}</p>
              <p className="text-[10px] text-blue-400 mt-1 flex items-center gap-1"><Info size={10}/> Source: {selected.source}</p>
            </div>
          )}

          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <FlyTo target={flyTarget} />

            <LayersControl position="topright">
              <BaseLayer checked name="🗺️ Street">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© OpenStreetMap' />
              </BaseLayer>
              <BaseLayer name="🌑 Dark">
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='© CartoDB' />
              </BaseLayer>
              <BaseLayer name="🛰️ Satellite">
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution='© ESRI' />
              </BaseLayer>
              <BaseLayer name="🏔️ Terrain">
                <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                  attribution='© OpenTopoMap' />
              </BaseLayer>
            </LayersControl>

            {/* Risk Prediction Zones */}
            {showZones && RISK_ZONES.map(zone => {
              const color = ZONE_COLOR[zone.type]?.[zone.risk] || '#ffffff';
              return (
                <Circle key={zone.id}
                  center={[zone.lat, zone.lng]}
                  radius={zone.radius}
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.08, weight: 1.5, dashArray: '6 4' }}>
                  <Popup>
                    <div className="font-sans">
                      <p className="font-bold text-sm" style={{ color }}>{zone.name}</p>
                      <p className="text-xs text-gray-500 uppercase font-semibold">{zone.type} · {zone.risk} risk</p>
                      <p className="text-xs mt-1">{zone.info}</p>
                    </div>
                  </Popup>
                </Circle>
              );
            })}

            {/* Event Markers */}
            {visible.map(ev => {
              const meta = TYPE_META[ev.type] || TYPE_META.emergency;
              return (
                <Marker
                  key={ev.id}
                  position={[ev.lat, ev.lng]}
                  icon={createIcon(meta.color, ev.critical ? 22 : 16, ev.critical)}
                  eventHandlers={{ click: () => selectEvent(ev) }}
                >
                  <Popup>
                    <div className="font-sans min-w-[160px]">
                      <div className="flex items-center gap-1 mb-1">
                        <span style={{ color: meta.color }} className="font-bold text-xs">{meta.label}</span>
                        {ev.critical && <span className="text-red-500 text-xs font-bold">⚠ Critical</span>}
                      </div>
                      <p className="font-bold text-sm">{ev.title}</p>
                      {ev.mag      && <p className="text-xs text-orange-600 font-bold">Magnitude {ev.mag.toFixed(1)}</p>}
                      {ev.place    && <p className="text-xs text-gray-500">{ev.place}</p>}
                      {ev.severity && <p className="text-xs">Severity: {ev.severity}</p>}
                      {ev.capacity && <p className="text-xs text-green-600">Capacity: {ev.available}/{ev.capacity}</p>}
                      <p className="text-xs text-gray-400 mt-1">{ev.time}</p>
                      <p className="text-xs text-blue-500">📡 {ev.source}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
