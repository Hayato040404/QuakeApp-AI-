import React, { useState, useEffect, useMemo } from 'react';
import { useEarthquakeData } from './hooks/useEarthquakeData';
import InfoPanel from './components/InfoPanel';
import EarthquakeMap from './components/EarthquakeMap';
import ObservationPointsList from './components/ObservationPointsList';
import Loader from './components/Loader';
import { P2pEarthquake, EnrichedP2pEarthquake, EnrichedP2pPoint } from './types';
import IntensityIcon from './components/IntensityIcon';
import DraggableSheet from './components/DraggableSheet';
import { INTENSITY_MAP } from './constants';
import AboutPage from './components/AboutPage';


const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    setIsDark(root.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    root.classList.toggle('dark');
    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
    setIsDark(root.classList.contains('dark'));
  };

  return (
    <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900">
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
      )}
    </button>
  );
};

const AboutButton: React.FC = () => (
    <a href="#/about" className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900" aria-label="このアプリについて">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    </a>
);

const EarthquakeListItem: React.FC<{ quake: P2pEarthquake; isSelected: boolean; onSelect: () => void; }> = ({ quake, isSelected, onSelect }) => {
    const date = new Date(quake.earthquake.time);
    const timeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    
    return (
        <button onClick={onSelect} className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${isSelected ? 'bg-cyan-500/20 dark:bg-cyan-400/20' : 'hover:bg-gray-500/10'}`}>
            <div className="flex items-center space-x-3">
                <IntensityIcon intensity={quake.earthquake.maxScale} />
                <div className="flex-grow">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{quake.earthquake.hypocenter.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        M{quake.earthquake.hypocenter.magnitude}
                    </p>
                </div>
                <div className="text-right">
                    <p className="font-mono text-lg font-medium text-gray-700 dark:text-gray-300">{timeString}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{date.toLocaleDateString('ja-JP')}</p>
                </div>
            </div>
        </button>
    );
};

const IntensityFilter: React.FC<{ onChange: (value: number) => void }> = ({ onChange }) => {
  const intensityOptions = [
    { value: 0, label: 'すべて' },
    { value: 10, label: '震度1+' },
    { value: 20, label: '震度2+' },
    { value: 30, label: '震度3+' },
    { value: 40, label: '震度4+' },
    { value: 45, label: '震度5弱+' },
    { value: 50, label: '震度5強+' },
    { value: 55, label: '震度6弱+' },
    { value: 60, label: '震度6強+' },
    { value: 70, label: '震度7' },
  ];
  return (
    <div className="relative shrink-0">
      <select 
        onChange={(e) => onChange(Number(e.target.value))}
        className="text-xs appearance-none bg-white/0 dark:bg-gray-800/0 border border-gray-300 dark:border-gray-600 rounded-md pl-2 pr-7 py-1 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
      >
        {intensityOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 fill-current text-gray-500 dark:text-gray-400" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (route === '#/about') {
    return <AboutPage />;
  }
  
  const { earthquakes, locations, loading, error } = useEarthquakeData();
  const [selectedEarthquake, setSelectedEarthquake] = useState<P2pEarthquake | null>(null);
  const [minIntensity, setMinIntensity] = useState(0);

  const filteredEarthquakes = useMemo(() => {
    if (minIntensity === 0) return earthquakes;
    return earthquakes.filter(quake => quake.earthquake.maxScale >= minIntensity);
  }, [earthquakes, minIntensity]);

  useEffect(() => {
    if (filteredEarthquakes.length > 0) {
        // If the currently selected earthquake is not in the filtered list,
        // or if nothing is selected, select the first one from the filtered list.
        const isSelectedInList = filteredEarthquakes.some(q => q.id === selectedEarthquake?.id);
        if (!isSelectedInList) {
            setSelectedEarthquake(filteredEarthquakes[0]);
        }
    } else {
        setSelectedEarthquake(null);
    }
  }, [filteredEarthquakes, selectedEarthquake?.id]);


  const locationNameMap = useMemo(() => {
    if (!locations) return null;
    const map = new Map<string, { code: string; location: [number, number] }>();
    Object.keys(locations).forEach(code => {
        const locationData = locations[code];
        map.set(locationData.name, { code, location: locationData.location });
    });
    return map;
  }, [locations]);

  const enrichedSelectedEarthquake = useMemo((): EnrichedP2pEarthquake | null => {
    if (!selectedEarthquake) return null;
    
    if (!locationNameMap) {
        return {
            ...selectedEarthquake,
            points: selectedEarthquake.points,
        };
    }

    const enrichedPoints: EnrichedP2pPoint[] = selectedEarthquake.points.map(point => {
        const locationData = locationNameMap.get(point.addr);
        if (locationData) {
            return { 
                ...point, 
                code: locationData.code, 
                lat: locationData.location[0], 
                lon: locationData.location[1] 
            };
        }
        return point;
    });

    return { ...selectedEarthquake, points: enrichedPoints };
  }, [selectedEarthquake, locationNameMap]);
  
  const sheetHeader = enrichedSelectedEarthquake ? (
    <div className="text-center w-full">
        <p className="font-bold text-gray-800 dark:text-gray-100 truncate">{enrichedSelectedEarthquake.earthquake.hypocenter.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
            M{enrichedSelectedEarthquake.earthquake.hypocenter.magnitude}
            <span className="mx-2">|</span>
            最大震度 {INTENSITY_MAP[enrichedSelectedEarthquake.earthquake.maxScale]}
        </p>
    </div>
) : <div className="h-10"></div>;


  return (
    <main className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col p-2 sm:p-4 lg:p-6 font-sans overflow-hidden">
      
      <header className="w-full max-w-screen-2xl mx-auto mb-4 flex justify-between items-center shrink-0">
        <div className="text-left">
            <h1 className="text-2xl lg:text-4xl font-bold tracking-tighter text-gray-900 dark:text-gray-100">
            地震情報<span className="text-cyan-600 dark:text-cyan-400">ビューア</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs lg:text-sm">
            最新の地震活動
            </p>
        </div>
        <div className="flex items-center space-x-2">
          <AboutButton />
          <ThemeToggle />
        </div>
      </header>

      <div className="w-full max-w-screen-2xl mx-auto flex-grow min-h-0">
        {loading && <div className="flex-grow flex items-center justify-center h-full"><Loader /></div>}
        {error && (
            <div className="flex-grow flex items-center justify-center text-center p-8 bg-red-500/10 rounded-lg border border-red-500/30 h-full">
            <div>
                <h2 className="text-2xl font-semibold text-red-700 dark:text-red-300">データの読み込みに失敗しました</h2>
                <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
            </div>
            </div>
        )}
        {!loading && !error && earthquakes.length > 0 && (
            <>
            {/* Desktop Layout */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-grow h-full">
                <div className="lg:col-span-1 xl:col-span-1 h-full flex flex-col gap-4 min-h-0">
                    <div className="p-3 bg-white/50 dark:bg-gray-800/20 rounded-lg border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm flex flex-col min-h-0">
                        <div className="flex justify-between items-center mb-2 px-1">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">最近の地震</h2>
                            <IntensityFilter onChange={setMinIntensity} />
                        </div>
                        <div className="space-y-2 overflow-y-auto flex-1 custom-scrollbar">
                            {filteredEarthquakes.map(quake => (
                                <EarthquakeListItem 
                                    key={quake.id}
                                    quake={quake}
                                    isSelected={selectedEarthquake?.id === quake.id}
                                    onSelect={() => setSelectedEarthquake(quake)}
                                />
                            ))}
                            {filteredEarthquakes.length === 0 && (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">該当する地震はありません。</p>
                            )}
                        </div>
                    </div>
                    <div className="lg:flex-1 min-h-0">
                        <InfoPanel data={enrichedSelectedEarthquake} />
                    </div>
                </div>
                <div className="lg:col-span-2 xl:col-span-3 h-full min-h-0 flex flex-col">
                    <EarthquakeMap 
                        quakeId={enrichedSelectedEarthquake?.id}
                        observationPoints={enrichedSelectedEarthquake?.points || []} 
                        epicenter={enrichedSelectedEarthquake?.earthquake.hypocenter || null}
                    />
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden flex flex-col h-full gap-2">
                <div className="p-3 bg-white/50 dark:bg-gray-800/20 rounded-lg border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-2 px-1">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">最近の地震</h2>
                        <IntensityFilter onChange={setMinIntensity} />
                    </div>
                    <div className="space-y-2 overflow-y-auto max-h-[150px] custom-scrollbar">
                         {filteredEarthquakes.map(quake => (
                            <EarthquakeListItem 
                                key={quake.id}
                                quake={quake}
                                isSelected={selectedEarthquake?.id === quake.id}
                                onSelect={() => setSelectedEarthquake(quake)}
                            />
                        ))}
                        {filteredEarthquakes.length === 0 && (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-4">該当する地震はありません。</p>
                        )}
                    </div>
                </div>

                <div className="flex-1 relative min-h-0">
                    <EarthquakeMap 
                        quakeId={enrichedSelectedEarthquake?.id}
                        observationPoints={enrichedSelectedEarthquake?.points || []} 
                        epicenter={enrichedSelectedEarthquake?.earthquake.hypocenter || null}
                        bottomOffset={120}
                    />
                    <DraggableSheet headerContent={sheetHeader}>
                        <InfoPanel data={enrichedSelectedEarthquake} />
                        <div className="mt-4">
                             <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-1 mb-2">
                                各地の震度 ({enrichedSelectedEarthquake?.points.length || 0})
                            </h3>
                            <ObservationPointsList points={enrichedSelectedEarthquake?.points || []} />
                        </div>
                    </DraggableSheet>
                </div>
            </div>
            </>
        )}
      </div>
    </main>
  );
};

export default App;