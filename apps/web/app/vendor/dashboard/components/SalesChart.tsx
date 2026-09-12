'use client';

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface SalesChartProps {
  data: { date: string; revenue: number; units: number }[];
  darkMode: boolean;
}

const fmtDate = (iso: string) => {
  const slice = iso.slice(5); // MM-DD
  return slice;
};

export const SalesChart = ({ data, darkMode }: SalesChartProps) => {
  const axisColor = darkMode ? '#737373' : '#a3a3a3';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.35 }}
      className={`rounded-[28px] p-6 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500`}>
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
            Sales (last 30 days)
          </h3>
          <p className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Revenue & units sold per day
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div
          className={`h-64 flex items-center justify-center rounded-2xl text-sm ${
            darkMode ? 'text-neutral-500' : 'text-neutral-400'
          }`}
        >
          No sales data yet
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? '#262626' : '#f0f0f0'}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={fmtDate}
                tick={{ fontSize: 11, fill: axisColor }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="revenue"
                tick={{ fontSize: 11, fill: axisColor }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`)}
                width={40}
              />
              <YAxis
                yAxisId="units"
                orientation="right"
                tick={{ fontSize: 11, fill: axisColor }}
                tickLine={false}
                axisLine={false}
                width={40}
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
                formatter={(value, name) =>
                  name === 'revenue' ? `$${Number(value).toLocaleString()}` : value
                }
              />
              <Legend
                iconSize={8}
                wrapperStyle={{ fontSize: 12, color: axisColor, paddingTop: 4 }}
              />
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                fill="#05966930"
                stroke="#059669"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Bar
                yAxisId="units"
                dataKey="units"
                name="Units"
                fill={darkMode ? '#60a5fa80' : '#3b82f640'}
                radius={[3, 3, 0, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};
