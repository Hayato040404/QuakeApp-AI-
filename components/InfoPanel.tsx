import React, { useState } from 'react';
import { EnrichedP2pEarthquake } from '../types';
import { INTENSITY_MAP, TSUNAMI_STATUS_MAP, TSUNAMI_STATUS_STYLES } from '../constants';
import IntensityIcon from './IntensityIcon';

interface InfoPanelProps {
  data: EnrichedP2pEarthquake | null;
}

const InfoItem: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
    <span className={`text-lg lg:text-xl font-medium text-gray-800 dark:text-gray-100 ${className}`}>{value}</span>
  </div>
);

const TsunamiInfoItem: React.FC<{ label: string; status: string }> = ({ label, status }) => {
    const statusText = TSUNAMI_STATUS_MAP[status] || status;
    const styles = TSUNAMI_STATUS_STYLES[status] || TSUNAMI_STATUS_STYLES.Unknown;
    
    return (
        <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
            <span className={`mt-1 text-sm font-semibold px-3 py-1 rounded-full text-center ${styles.bg} ${styles.text}`}>
                {statusText}
            </span>
        </div>
    );
};

const InfoPanel: React.FC<InfoPanelProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!data) return;
    const { earthquake } = data;
    const maxScaleText = INTENSITY_MAP[earthquake.maxScale] || '不明';
    
    const textToShare = `地震情報\n` +
      `発生時刻: ${new Date(earthquake.time).toLocaleString('ja-JP')}\n` +
      `震源地: ${earthquake.hypocenter.name}\n` +
      `マグニチュード: M${earthquake.hypocenter.magnitude}\n` +
      `最大震度: ${maxScaleText}`;
      
    const shareUrl = window.location.href;

    if (navigator.share) {
      const shareData: ShareData = {
        title: '地震情報',
        text: textToShare,
      };

      // The URL is optional. Only include it if it's a valid http/https URL.
      // Invalid URLs can cause a TypeError in navigator.share().
      if (shareUrl && shareUrl.startsWith('http')) {
        shareData.url = shareUrl;
      }
      
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof Error) {
            // AbortError is thrown when the user cancels the share dialog.
            // We don't want to log this as a failure.
            if (error.name !== 'AbortError') {
                console.error(`Share failed: ${error.name}: ${error.message}`, error);
            }
        } else {
            console.error('An unexpected error occurred during share:', error);
        }
      }
    } else {
      // Fallback to clipboard
      const fullTextForClipboard = `${textToShare}\n\n詳細はこちら:\n${shareUrl}`;
      try {
        await navigator.clipboard.writeText(fullTextForClipboard);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
        alert('クリップボードへのコピーに失敗しました。');
      }
    }
  };

  if (!data) {
    return (
        <div className="w-full h-full p-6 bg-white/50 dark:bg-gray-800/20 rounded-lg border border-gray-200 dark:border-gray-700/50 flex flex-col justify-center items-center backdrop-blur-sm">
            <p className="text-gray-600 dark:text-gray-400">地震をリストから選択してください。</p>
        </div>
    );
  }

  const { earthquake } = data;

  return (
    <div className="w-full p-6 bg-white/50 dark:bg-gray-800/20 rounded-lg border border-gray-200 dark:border-gray-700/50 flex flex-col space-y-4 backdrop-blur-sm">
      <div className="flex flex-col items-center text-center">
        <span className="text-sm text-cyan-600 dark:text-cyan-400">最大震度</span>
        <IntensityIcon intensity={earthquake.maxScale} large />
        <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            (震度 {INTENSITY_MAP[earthquake.maxScale] || 'N/A'})
        </span>
      </div>
      
      <div className="border-t border-gray-300 dark:border-gray-700/50"></div>

      <div className="grid grid-cols-2 gap-4">
        <InfoItem label="震源地" value={earthquake.hypocenter.name} className="col-span-2" />
        <InfoItem label="マグニチュード" value={earthquake.hypocenter.magnitude} />
        <InfoItem label="深さ" value={`${earthquake.hypocenter.depth} km`} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TsunamiInfoItem label="国内の津波" status={earthquake.domesticTsunami} />
        <TsunamiInfoItem label="海外の津波" status={earthquake.foreignTsunami} />
      </div>

      {data.points && data.points.length > 0 && (
        <div className="hidden lg:flex flex-col space-y-2 flex-1 min-h-0 pt-2">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider px-1">
            各地の震度 ({data.points.length})
          </h3>
          <div className="overflow-y-auto space-y-1 pr-2 -mr-2 custom-scrollbar">
            {data.points
              .sort((a, b) => b.scale - a.scale)
              .map((point, index) => (
                <div key={`${point.code}-${index}`} className="flex items-center justify-between p-2 rounded-md bg-gray-500/5 hover:bg-gray-500/10 transition-colors">
                  <div className="flex-1 overflow-hidden mr-2">
                    <p className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">{point.addr}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{point.pref}</p>
                  </div>
                  <IntensityIcon intensity={point.scale} />
                </div>
              ))}
          </div>
        </div>
      )}
      
      <div className="border-t border-gray-300 dark:border-gray-700/50"></div>
      
      <button 
        onClick={handleShare}
        className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 dark:bg-cyan-400/20 dark:hover:bg-cyan-400/30 text-cyan-800 dark:text-cyan-200 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.367a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
        <span>{copied ? 'コピーしました！' : 'この地震を共有'}</span>
      </button>

      <div className="flex flex-col space-y-2 text-sm pt-2">
        <div className="flex justify-between text-gray-500 dark:text-gray-400">
          <span>発生時刻:</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">{new Date(earthquake.time).toLocaleString('ja-JP')}</span>
        </div>
        <div className="flex justify-between text-gray-500 dark:text-gray-400">
          <span>発表時刻:</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">{new Date(data.time).toLocaleString('ja-JP')}</span>
        </div>
      </div>
      
      <p className="text-xs text-center text-gray-500 dark:text-gray-500 pt-2">
        データソース: P2PQuake API
      </p>
    </div>
  );
};

export default InfoPanel;