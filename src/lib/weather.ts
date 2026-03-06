// WMO Weather interpretation codes → emoji + Vietnamese label
// https://open-meteo.com/en/docs#weathervariables

const weatherMap: Record<number, { icon: string; label: string }> = {
  0: { icon: "☀️", label: "Trời nắng" },
  1: { icon: "🌤️", label: "Trời quang" },
  2: { icon: "⛅", label: "Có mây" },
  3: { icon: "☁️", label: "Nhiều mây" },
  45: { icon: "🌫️", label: "Sương mù" },
  48: { icon: "🌫️", label: "Sương mù đọng băng" },
  51: { icon: "🌦️", label: "Mưa phùn nhẹ" },
  53: { icon: "🌦️", label: "Mưa phùn" },
  55: { icon: "🌧️", label: "Mưa phùn dày" },
  56: { icon: "🌧️", label: "Mưa phùn lạnh" },
  57: { icon: "🌧️", label: "Mưa phùn lạnh dày" },
  61: { icon: "🌧️", label: "Mưa nhẹ" },
  63: { icon: "🌧️", label: "Mưa vừa" },
  65: { icon: "🌧️", label: "Mưa to" },
  66: { icon: "🌧️", label: "Mưa lạnh nhẹ" },
  67: { icon: "🌧️", label: "Mưa lạnh to" },
  71: { icon: "🌨️", label: "Tuyết nhẹ" },
  73: { icon: "🌨️", label: "Tuyết vừa" },
  75: { icon: "🌨️", label: "Tuyết dày" },
  77: { icon: "🌨️", label: "Hạt tuyết" },
  80: { icon: "🌦️", label: "Mưa rào nhẹ" },
  81: { icon: "🌧️", label: "Mưa rào vừa" },
  82: { icon: "⛈️", label: "Mưa rào to" },
  85: { icon: "🌨️", label: "Mưa tuyết nhẹ" },
  86: { icon: "🌨️", label: "Mưa tuyết to" },
  95: { icon: "⛈️", label: "Giông bão" },
  96: { icon: "⛈️", label: "Giông có mưa đá nhẹ" },
  99: { icon: "⛈️", label: "Giông có mưa đá to" },
};

export function getWeatherIconAndLabel(code: number): { icon: string; label: string } {
  return weatherMap[code] || { icon: "🌡️", label: "Không xác định" };
}

const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  return dayNames[date.getDay()];
}
