import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import EmptyState from '../common/EmptyState';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg text-xs animate-fadeIn">
        <p className="font-bold text-slate-900 mb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-600 capitalize">{entry.name}:</span>
              </div>
              <span className="font-bold text-slate-900">
                Rs. {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function IncomeExpenseChart({ data = [], onAddIncome }) {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
            Income vs Expenses
          </h3>
          <p className="text-xs text-slate-500">6-month cashflow comparison</p>
        </div>

        {/* Legend */}
        {hasData && (
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span className="text-slate-600 font-medium">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
              <span className="text-slate-600 font-medium">Expenses</span>
            </div>
          </div>
        )}
      </div>

      {/* Chart Canvas or Empty State */}
      {!hasData ? (
        <EmptyState
          icon={BarChart3}
          title="No historical comparison data"
          description="Log income and expense records over time to see trends and monthly cashflow trajectory."
          actionLabel="+ Add Transaction"
          onAction={onAddIncome}
          className="my-auto py-8"
        />
      ) : (
        <div className="w-full h-64 sm:h-72 mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 10 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="income"
                name="Income"
                fill="#10B981"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="#F43F5E"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
