export const P2PQUAKE_API_URL = "https://api.p2pquake.net/v2/history?codes=551&limit=10";
export const OBSERVATION_POINTS_URL = "https://files.nakn.jp/earthquake/code/PointSeismicIntensityLocation.json";
export const JAPAN_TOPOJSON_URL = "https://raw.githubusercontent.com/dataofjapan/land/master/japan.topojson";

export const INTENSITY_MAP: { [key: number]: string } = {
  10: "1",
  20: "2",
  30: "3",
  40: "4",
  45: "5-",
  50: "5+",
  55: "6-",
  60: "6+",
  70: "7",
  46: "5-", // 震度５弱以上未入電
};

export const INTENSITY_COLORS: { [key: string]: string } = {
  "1": "#999999",
  "2": "#0074d9",
  "3": "#008a3e",
  "4": "#f0e600",
  "5-": "#ffcd00",
  "5+": "#ff9a00",
  "6-": "#ff5700",
  "6+": "#e50a16",
  "7": "#580b83",
  "-1": "#cccccc", // No data
};

export const TSUNAMI_STATUS_MAP: { [key: string]: string } = {
  None: "なし",
  Unknown: "不明",
  Checking: "調査中",
  NonEffective: "若干の海面変動",
  Watch: "津波注意報",
  Warning: "津波警報",
  NonEffectiveNearby: "近傍で小津波",
  WarningNearby: "近傍で津波の可能性",
  WarningPacific: "太平洋で津波の可能性",
  WarningPacificWide: "太平洋広域で津波の可能性",
  WarningIndian: "インド洋で津波の可能性",
  WarningIndianWide: "インド洋広域で津波の可能性",
  Potential: "津波の可能性あり",
};

export const TSUNAMI_STATUS_STYLES: { [key: string]: { bg: string, text: string } } = {
  None: { bg: 'bg-green-100 dark:bg-green-800/30', text: 'text-green-800 dark:text-green-200' },
  Unknown: { bg: 'bg-gray-200 dark:bg-gray-700/50', text: 'text-gray-800 dark:text-gray-200' },
  Checking: { bg: 'bg-blue-100 dark:bg-blue-800/30', text: 'text-blue-800 dark:text-blue-200' },
  NonEffective: { bg: 'bg-blue-100 dark:bg-blue-800/30', text: 'text-blue-800 dark:text-blue-200' },
  NonEffectiveNearby: { bg: 'bg-blue-100 dark:bg-blue-800/30', text: 'text-blue-800 dark:text-blue-200' },
  Watch: { bg: 'bg-yellow-100 dark:bg-yellow-800/30', text: 'text-yellow-800 dark:text-yellow-200' },
  Potential: { bg: 'bg-yellow-100 dark:bg-yellow-800/30', text: 'text-yellow-800 dark:text-yellow-200' },
  Warning: { bg: 'bg-red-100 dark:bg-red-800/30', text: 'text-red-800 dark:text-red-200' },
  WarningNearby: { bg: 'bg-red-100 dark:bg-red-800/30', text: 'text-red-800 dark:text-red-200' },
  WarningPacific: { bg: 'bg-red-100 dark:bg-red-800/30', text: 'text-red-800 dark:text-red-200' },
  WarningPacificWide: { bg: 'bg-red-100 dark:bg-red-800/30', text: 'text-red-800 dark:text-red-200' },
  WarningIndian: { bg: 'bg-red-100 dark:bg-red-800/30', text: 'text-red-800 dark:text-red-200' },
  WarningIndianWide: { bg: 'bg-red-100 dark:bg-red-800/30', text: 'text-red-800 dark:text-red-200' },
};
