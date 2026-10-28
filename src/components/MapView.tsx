import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Filter,
  MapPin,
  Layers,
  Crosshair,
  Maximize2,
  AlertCircle,
  Eye,
  PlusCircle,
  Leaf,
} from 'lucide-react';
import { HazardCategory, HazardReport, HazardStatus } from '../types/hazard';
import { CATEGORIES } from '../data/sampleHazards';
import { useTheme } from '../context/ThemeContext';

interface MapViewProps {
  reports: HazardReport[];
  onSelectReport: (report: HazardReport) => void;
  onReportAtLocation: (coords: { lat: number; lng: number; address: string }) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  reports,
  onSelectReport,
  onReportAtLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const clickMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const { themeConfig } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState<HazardCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<HazardStatus | 'all'>('all');
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);

  // Filter reports
  const filteredReports = reports.filter((rep) => {
    if (selectedCategory !== 'all' && rep.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && rep.status !== selectedStatus) return false;
    return true;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [37.778, -122.42],
      zoom: 13,
      zoomControl: false,
    });

    const tiles = L.tileLayer(themeConfig.leafletTiles, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tiles;

    L.control
      .zoom({
        position: 'bottomright',
      })
      .addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Map click handler to set coordinates for new report
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setClickedCoords({ lat, lng });

      if (clickMarkerRef.current) {
        clickMarkerRef.current.remove();
      }

      const clickIcon = L.divIcon({
        className: 'custom-click-pin',
        html: `
          <div style="background-color: #059669; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px rgba(5,150,105,0.8); display: flex; align-items: center; justify-content: center; color: white;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const newClickMarker = L.marker([lat, lng], { icon: clickIcon }).addTo(map);
      clickMarkerRef.current = newClickMarker;
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update tile layer when theme changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }
    const newTiles = L.tileLayer(themeConfig.leafletTiles, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTiles;
  }, [themeConfig.leafletTiles]);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    filteredReports.forEach((report) => {
      const catMeta = CATEGORIES.find((c) => c.key === report.category);
      const pinColor = catMeta?.pinColor || '#10b981';
      const isCritical = report.severity === 'critical';

      const customIcon = L.divIcon({
        className: 'hazard-pin',
        html: `
          <div style="
            background: ${themeConfig.isDark ? '#090e17' : '#ffffff'};
            border: 2px solid ${pinColor};
            color: ${pinColor};
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            transform: ${isCritical ? 'scale(1.15)' : 'scale(1)'};
            transition: transform 0.2s;
          ">
            <span style="font-weight: 800; font-size: 11px;">!</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([report.location.lat, report.location.lng], {
        icon: customIcon,
      });

      // Marker click popup
      const popupHtml = document.createElement('div');
      popupHtml.className = 'p-1 text-slate-800 text-xs w-60';
      popupHtml.innerHTML = `
        <div class="rounded-lg overflow-hidden mb-2 relative h-28 bg-slate-950">
          <img src="${report.photoUrl}" alt="${report.title}" class="w-full h-full object-cover" />
          <span class="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-black/80 font-mono text-emerald-400 font-bold uppercase">
            ${report.severity}
          </span>
        </div>
        <div class="font-bold text-slate-900 text-xs mb-1">${report.title}</div>
        <div class="text-[11px] text-slate-500 mb-2 truncate">${report.location.address}</div>
        <div class="flex items-center justify-between text-[11px] pb-2 border-b border-slate-200 mb-2 font-mono">
          <span class="text-slate-500">Status: <strong class="text-slate-900">${report.status.toUpperCase()}</strong></span>
          <span class="text-emerald-600 font-bold">Saved: ${report.aiAnalysis?.materialWaste?.materialDivertedKg || 0}kg</span>
        </div>
        <button id="view-report-btn-${report.id}" class="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs transition-colors cursor-pointer text-center">
          View Repair Triage Details
        </button>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        setActiveReportId(report.id);
        const btn = document.getElementById(`view-report-btn-${report.id}`);
        if (btn) {
          btn.onclick = () => onSelectReport(report);
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [filteredReports, onSelectReport, themeConfig.isDark]);

  const handlePanToReport = (report: HazardReport) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([report.location.lat, report.location.lng], 16, {
        duration: 1.2,
      });
      setActiveReportId(report.id);
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([37.778, -122.42], 13, { duration: 1 });
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header & Filter Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1 tracking-wider uppercase">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Interactive Geospatial Grid</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Live Road Defect & Hazard Map
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
            Geospatial markers with severity triage and material diversion values. Click any pin to inspect, or click on the map to set report coordinates.
          </p>
        </div>

        {/* Status Filter Segmented Control */}
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          {(['all', 'pending', 'in_progress', 'resolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors cursor-pointer whitespace-nowrap ${
                selectedStatus === st
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st === 'all' ? 'All Status' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg border font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            selectedCategory === 'all'
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:border-slate-300'
          }`}
        >
          All Defect Types ({reports.length})
        </button>

        {CATEGORIES.map((cat) => {
          const count = reports.filter((r) => r.category === cat.key).length;
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.pinColor }} />
              <span>{cat.label}</span>
              <span className="font-mono text-slate-400">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Map Canvas and Side Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Map Box */}
        <div className="lg:col-span-8 bg-slate-100 dark:bg-[#090e17] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden relative shadow-md h-[560px]">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Quick Map Controls Overlay */}
          <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
            <button
              onClick={handleResetView}
              className="p-2.5 bg-white/90 dark:bg-slate-900/90 hover:bg-white text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl shadow-md transition-colors cursor-pointer"
              title="Reset map view"
            >
              <Crosshair className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </button>
          </div>

          {/* Floating Click-to-Report Notification Banner */}
          {clickedCoords && (
            <div className="absolute bottom-4 inset-x-4 sm:inset-x-auto sm:left-4 z-[1000] bg-white/95 dark:bg-slate-900/95 border border-emerald-500/80 rounded-xl p-3 shadow-xl flex items-center justify-between gap-4 backdrop-blur-md">
              <div className="text-xs">
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold block">Map Point Selected</span>
                <span className="text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                  {clickedCoords.lat.toFixed(4)}, {clickedCoords.lng.toFixed(4)}
                </span>
              </div>
              <button
                onClick={() =>
                  onReportAtLocation({
                    lat: clickedCoords.lat,
                    lng: clickedCoords.lng,
                    address: `Near GPS (${clickedCoords.lat.toFixed(4)}, ${clickedCoords.lng.toFixed(4)})`,
                  })
                }
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Report Here</span>
              </button>
            </div>
          )}

          {/* Map Legend */}
          <div className="absolute top-3 left-3 z-[1000] bg-white/90 dark:bg-slate-950/85 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-[11px] space-y-1.5 hidden sm:block shadow-sm">
            <div className="font-semibold text-slate-800 dark:text-slate-300 text-xs">Hazard Severity</div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded bg-rose-500" />
              <span>Critical (Under 6h SLA)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded bg-orange-500" />
              <span>High (Within 24h)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded bg-amber-500" />
              <span>Moderate / Monitored</span>
            </div>
          </div>
        </div>

        {/* Side Hazard Feed & Quick Focus Drawer */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0b101c] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col h-[560px] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
            <div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">Visible Hazards</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-mono">
                {filteredReports.length} locations displayed
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filteredReports.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs">
                <AlertCircle className="w-8 h-8 text-slate-400 mb-2" />
                <span>No hazards matching active filters.</span>
              </div>
            ) : (
              filteredReports.map((rep) => {
                const isSelected = activeReportId === rep.id;
                return (
                  <div
                    key={rep.id}
                    onClick={() => handlePanToReport(rep)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-500/10'
                        : 'border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-200 line-clamp-1">{rep.title}</span>
                      <span
                        className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-bold ${
                          rep.severity === 'critical'
                            ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400'
                            : rep.severity === 'high'
                            ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-800 dark:text-orange-400'
                            : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400'
                        }`}
                      >
                        {rep.severity}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mb-2">{rep.location.address}</div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                      <span className="capitalize font-medium text-slate-700 dark:text-slate-300">
                        {rep.status.replace('_', ' ')}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectReport(rep);
                        }}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
