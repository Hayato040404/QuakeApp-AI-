import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { EnrichedP2pPoint, P2pHypocenter } from '../types';
import { JAPAN_TOPOJSON_URL, INTENSITY_COLORS, INTENSITY_MAP } from '../constants';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

// --- Memoized Sub-components for Rendering ---

const JapanPaths = React.memo<{ pathGenerator: any; geoData: any; theme: string }>(({ pathGenerator, geoData, theme }) => (
  <>
    {geoData.features.map((feature: any, i: number) => (
      <path
        key={i}
        d={pathGenerator(feature)}
        fill={theme === 'dark' ? '#2d3748' : '#edf2f7'}
        stroke={theme === 'dark' ? '#4a5568' : '#cbd5e0'}
        strokeWidth={0.5}
      />
    ))}
  </>
));

const EpicenterMarker = React.memo<{ epicenter: P2pHypocenter; projection: any; transform: any }>(({ epicenter, projection, transform }) => {
    const coords = projection([epicenter.longitude, epicenter.latitude]);
    if (!coords) return null;
    const k = transform.k || 1;
    return (
        <g transform={`translate(${coords[0]}, ${coords[1]}) scale(${1 / k})`}>
            <circle
                r={9}
                fill="#f56565"
                stroke="#fff"
                strokeWidth={2}
                style={{ filter: 'drop-shadow(0 0 5px rgba(245, 101, 101, 0.7))' }}
            />
        </g>
    );
});

const ObservationPointMarker = React.memo<{
  point: EnrichedP2pPoint;
  projection: any;
  transform: any;
  onMouseOver: (event: React.MouseEvent, point: EnrichedP2pPoint) => void;
  onMouseOut: () => void;
}>(({ point, projection, transform, onMouseOver, onMouseOut }) => {
  const coords = projection([point.lon!, point.lat!]);
  if (!coords) return null;
  const k = transform.k || 1;
  const intensityKey = INTENSITY_MAP[point.scale];
  const color = INTENSITY_COLORS[intensityKey] || '#cccccc';
  const textColor = [40, 45].includes(point.scale) ? '#000' : '#fff';

  return (
    <g
      transform={`translate(${coords[0]}, ${coords[1]}) scale(${1 / k})`}
      style={{ cursor: 'pointer' }}
      onMouseOver={(e) => onMouseOver(e, point)}
      onMouseOut={onMouseOut}
    >
      <circle
        r={6}
        fill={color}
        stroke="rgba(0,0,0,0.3)"
        strokeWidth={1}
      />
      <text
        textAnchor="middle"
        dy="0.35em"
        fontSize={`9px`}
        fill={textColor}
        fontWeight="bold"
        style={{ pointerEvents: 'none', textShadow: '0 0 2px rgba(0,0,0,0.5)' }}
      >
        {intensityKey}
      </text>
    </g>
  );
});

// --- Main Map Component ---

interface EarthquakeMapProps {
  quakeId: string | undefined;
  observationPoints: EnrichedP2pPoint[];
  epicenter: P2pHypocenter | null;
  bottomOffset?: number;
}

const EarthquakeMap: React.FC<EarthquakeMapProps> = ({ quakeId, observationPoints, epicenter, bottomOffset = 0 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const zoomBehaviorRef = useRef<any>(null);
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [tooltip, setTooltip] = useState<{ x: number, y: number, content: string } | null>(null);
  const [theme, setTheme] = useState(() => document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  const [japanGeo, setJapanGeo] = useState<any>(null);
  const [currentTransform, setCurrentTransform] = useState(() => d3.zoomIdentity);

  // Effect to observe theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Effect to fetch map geometry
  useEffect(() => {
    // d3 and topojson are now imported
    d3.json(JAPAN_TOPOJSON_URL).then((japan: any) => {
      // @ts-ignore - topojson types might be tricky with * imports
      setJapanGeo(topojson.feature(japan, japan.objects.japan));
    });
  }, []);

  // Effect to observe container size for projection calculations
  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;
    const resizeObserver = new ResizeObserver(() => {
        setDimensions({
          width: element.offsetWidth,
          height: element.offsetHeight,
        });
    });
    resizeObserver.observe(element);
    // Initial dimensions
    setDimensions({ width: element.offsetWidth, height: element.offsetHeight });
    return () => resizeObserver.disconnect();
  }, []);
  
  // Memoize projection and path generator
  const projection = useMemo(() => {
    if (!japanGeo || dimensions.width === 0 || dimensions.height === 0) return null;
    return d3.geoMercator().fitSize([dimensions.width, dimensions.height], japanGeo);
  }, [japanGeo, dimensions.width, dimensions.height]);

  const pathGenerator = useMemo(() => {
    if (!projection) return null;
    return d3.geoPath().projection(projection);
  }, [projection]);

  // Effect to setup D3 zoom behavior
  useEffect(() => {
    if (!svgRef.current) return;
    
    const zoom = d3.zoom()
      .scaleExtent([0.5, 30])
      .on('zoom', (event: any) => {
        setCurrentTransform(event.transform);
      });
    
    d3.select(svgRef.current).call(zoom);
    zoomBehaviorRef.current = zoom;

    return () => {
        if (svgRef.current) {
            d3.select(svgRef.current).on('.zoom', null);
        }
    };
  }, []);

  // Effect to auto-zoom to fit data points when quake changes
  useEffect(() => {
    if (!zoomBehaviorRef.current || !svgRef.current || !projection || !pathGenerator || dimensions.width === 0) return;

    const pointsWithCoords = observationPoints.filter(p => p.lat !== undefined && p.lon !== undefined);
    const hasEpicenter = epicenter && epicenter.latitude !== -200;
    const allGeoPoints = hasEpicenter ? [...pointsWithCoords, { lon: epicenter!.longitude, lat: epicenter!.latitude }] : pointsWithCoords;
    
    const svgSelection = d3.select(svgRef.current);

    if (allGeoPoints.length === 0) {
        svgSelection.transition().duration(750).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
        return;
    }

    const multiPoint = { type: 'MultiPoint', coordinates: allGeoPoints.map(p => [p.lon, p.lat]) };
    const [[x0, y0], [x1, y1]] = pathGenerator.bounds(multiPoint);
    const { width, height } = dimensions;
    const effectiveHeight = height - bottomOffset;

    const dx = x1 - x0, dy = y1 - y0;
    const x = (x0 + x1) / 2, y = (y0 + y1) / 2;

    const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / effectiveHeight)));
    const translateX = width / 2 - scale * x;
    const translateY = effectiveHeight / 2 - scale * y;
    
    const newTransform = d3.zoomIdentity.translate(translateX, translateY).scale(scale);

    svgSelection.interrupt() // Interrupt any ongoing transition
      .transition().duration(750)
      .call(zoomBehaviorRef.current.transform, newTransform);
      
  }, [quakeId, observationPoints, epicenter, projection, pathGenerator, dimensions, bottomOffset]);

  const handleMouseOver = useCallback((event: React.MouseEvent, point: EnrichedP2pPoint) => {
    const content = `${point.addr}<br/><strong>震度: ${INTENSITY_MAP[point.scale]}</strong>`;
    setTooltip({ x: event.clientX, y: event.clientY, content });
  }, []);

  const handleMouseOut = useCallback(() => setTooltip(null), []);

  const pointsWithCoords = useMemo(() => observationPoints.filter(p => p.lat !== undefined && p.lon !== undefined), [observationPoints]);
  const hasEpicenter = epicenter && epicenter.latitude !== -200;
  
  return (
    <div ref={wrapperRef} className="w-full h-full bg-white/50 dark:bg-gray-800/20 rounded-lg border border-gray-200 dark:border-gray-700/50 relative overflow-hidden backdrop-blur-sm select-none">
      <svg ref={svgRef} className="w-full h-full transition-opacity duration-500" style={{ opacity: japanGeo ? 1 : 0 }}>
        {projection && pathGenerator && japanGeo && (
            <g transform={currentTransform.toString()}>
                <JapanPaths pathGenerator={pathGenerator} geoData={japanGeo} theme={theme} />
                {hasEpicenter && <EpicenterMarker epicenter={epicenter} projection={projection} transform={currentTransform} />}
                {pointsWithCoords.map(point => (
                    <ObservationPointMarker
                        key={`${point.pref}-${point.addr}`}
                        point={point}
                        projection={projection}
                        transform={currentTransform}
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                    />
                ))}
            </g>
        )}
      </svg>
      {!japanGeo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">地図を読み込み中...</p>
        </div>
      )}
      <div 
        className="absolute right-2 bg-gray-900/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none"
        style={{ bottom: `${bottomOffset + 8}px` }}
      >
        スクロールでズーム
      </div>
      {tooltip && (
        <div
          className="fixed text-white text-sm bg-gray-900/80 px-3 py-2 rounded-md shadow-lg pointer-events-none z-50"
          style={{ top: tooltip.y, left: tooltip.x, transform: 'translate(10px, -100%)' }}
          dangerouslySetInnerHTML={{ __html: tooltip.content }}
        />
      )}
    </div>
  );
};

export default EarthquakeMap;