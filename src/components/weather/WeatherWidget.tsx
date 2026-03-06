"use client";

import { useEffect, useState } from "react";
import { getWeatherIconAndLabel, getDayName } from "@/lib/weather";

interface WeatherWidgetProps {
  coordinates: { lat: number; lng: number };
}

interface CurrentWeather {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
}

interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
}

export default function WeatherWidget({ coordinates }: WeatherWidgetProps) {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [daily, setDaily] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lng}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia/Ho_Chi_Minh&forecast_days=5`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.current) {
          setCurrent({
            temperature: Math.round(data.current.temperature_2m),
            weatherCode: data.current.weather_code,
            windSpeed: Math.round(data.current.wind_speed_10m),
            humidity: data.current.relative_humidity_2m,
          });
        }
        if (data.daily) {
          const forecasts: DailyForecast[] = data.daily.time.map(
            (date: string, i: number) => ({
              date,
              weatherCode: data.daily.weather_code[i],
              tempMax: Math.round(data.daily.temperature_2m_max[i]),
              tempMin: Math.round(data.daily.temperature_2m_min[i]),
            })
          );
          setDaily(forecasts);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [coordinates.lat, coordinates.lng]);

  if (error) return null;

  if (loading) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 space-y-3 animate-pulse">
        <div className="h-5 w-32 bg-blue-200 dark:bg-blue-800 rounded" />
        <div className="h-10 w-20 bg-blue-200 dark:bg-blue-800 rounded" />
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 w-full bg-blue-200 dark:bg-blue-800 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!current) return null;

  const { icon, label } = getWeatherIconAndLabel(current.weatherCode);

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 space-y-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        Thời tiết hiện tại
      </h3>

      <div className="flex items-center gap-3">
        <span className="text-4xl">{icon}</span>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {current.temperature}°C
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
        </div>
      </div>

      <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-300">
        <span>💧 {current.humidity}%</span>
        <span>💨 {current.windSpeed} km/h</span>
      </div>

      {daily.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Dự báo 5 ngày
          </p>
          <div className="grid grid-cols-5 gap-1.5">
            {daily.map((day) => {
              const dayWeather = getWeatherIconAndLabel(day.weatherCode);
              return (
                <div
                  key={day.date}
                  className="text-center bg-white/60 dark:bg-white/5 rounded-lg py-2 px-1"
                >
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {getDayName(day.date)}
                  </p>
                  <p className="text-lg my-0.5">{dayWeather.icon}</p>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    {day.tempMax}°
                  </p>
                  <p className="text-xs text-gray-400">{day.tempMin}°</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
