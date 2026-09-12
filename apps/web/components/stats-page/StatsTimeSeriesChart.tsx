'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import type { Metrics } from '@ecomerece/shared';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fmtCurrency, fmtNumber, fmtSeriesKey } from './format';

export type StatsChartMetric = keyof Pick<
  Metrics,
  'views' | 'clicks' | 'purchases' | 'revenue' | 'quantity'
>;

interface StatsTimeSeriesChartProps {
  title: string;
  subtitle?: string;
  points: { key: string; metrics: Metrics }[];
  metric: StatsChartMetric;
  accent?: string;
  prefix?: string;
  delay?: number;
}

export const StatsTimeSeriesChart = ({
  title,
  subtitle,
  points,
  metric,
  accent = '#737373',
  prefix = '',
  delay = 0.15,
}: StatsTimeSeriesChartProps) => {
  const { darkMode } = useThemeStore();
  const axisColor = darkMode ? '#737373' : '#a3a3a3';

  const data = points
    .map((p) => ({ key: p.key, label: fmtSeriesKey(p.key), value: p.metrics[metric] ?? 0 }))
    .filter((d) => d.key);

  const isEmpty = data.every((d) => d.value === 0);
  const fmtValue = (v: number) => (prefix === '$' ? fmtCurrency(v) : fmtNumber(v));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={`rounded-[28px] p-6 transition-colors duration-500 ${
        darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'
      }`}
    >
      <div className="mb-4">
        <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
          {title}
        </h3>
        {subtitle ? (
          <p className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
            {subtitle}
          </p>
        ) : null}
      </div>

      {isEmpty ? (
        <div
          className={`h-64 flex items-center justify-center rounded-2xl text-sm ${
            darkMode ? 'text-neutral-500' : 'text-neutral-400'
          }`}
        >
          No {title.toLowerCase()} data yet
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id={`statsFade-${metric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={accent} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? '#262626' : '#f0f0f0'}
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: axisColor }}
                tickLine={false}
                axisLine={false}
                minTickGap={16}
              />
              <YAxis
                tick={{ fontSize: 11, fill: axisColor }}
                tickLine={false}
                axisLine={false}
                width={44}
                tickFormatter={(v: number) => (prefix === '$' ? fmtCurrency(v) : fmtNumber(v))}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#171717' : '#ffffff',
                  border: `1px solid ${darkMode ? '#262626' : '#f0f0f0'}`,
                  borderRadius: 12,
                  padding: 10,
                  fontSize: 12,
                }}
                labelStyle={{
                  color: darkMode ? '#d4d4d4' : '#171717',
                  marginBottom: 4,
                  fontWeight: 600,
                }}
                formatter={(value) => [fmtValue(Number(value)), title]}
              />
              <Area
                type="monotone"
                dataKey="value"
                name={title}
                stroke={accent}
                strokeWidth={2}
                fill={`url(#statsFade-${metric})`}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};
