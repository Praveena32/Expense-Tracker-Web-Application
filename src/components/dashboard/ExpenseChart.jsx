import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import EmptyState from '../common/EmptyState';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-lg text-xs animate-fadeIn">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="font-bold text-slate-900">{data.name}</span>
        </div>
        <p className="font-extrabold text-slate-800 text-sm">{data.formatted || `Rs. ${data.amount.toLocaleString()}`}</p>
        {data.percentage && (
          <p className="text-slate-500 text-[11px] mt-0.5">{data.percentage}% of total expenses</p>
        )}
      </div>
    );
  }
  return null;
};

export default function ExpenseChart({ data = [], onAddExpense }) {
  const hasData = data && data.length > 0;
  const totalExpense = hasData ? data.reduce((acc, curr) => acc + curr.amount, 0) : 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
            Expense Overview
          </h3>
          <p className="text-xs text-slate-500">Breakdown by category</p>
        </div>
        {hasData && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            Total: Rs. {totalExpense.toLocaleString()}
          </span>
        )}
      </div>

      {/* Chart Canvas or Empty State */}
      {!hasData ? (
        <EmptyState
          icon={PieIcon}
          title="No expense data yet"
          description="Log your daily expenses to see category distribution and spending patterns."
          actionLabel="+ Add First Expense"
          onAction={onAddExpense}
          className="my-auto py-8"
        />
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6 my-auto pt-2">
          {/* Donut Chart */}
          <div className="w-full sm:w-1/2 h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="amount"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Donut Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Total
              </span>
              <span className="font-display font-bold text-sm sm:text-base text-slate-800">
                Rs. {(totalExpense / 1000).toFixed(1)}k
              </span>
            </div>
          </div>

          {/* Category Legend */}
          <div className="w-full sm:w-1/2 space-y-2 overflow-y-auto max-h-56 pr-1">
            {data.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-medium text-slate-700">{cat.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 block">
                    {cat.formatted || `Rs. ${cat.amount.toLocaleString()}`}
                  </span>
                  {cat.percentage && (
                    <span className="text-[10px] text-slate-400">
                      {cat.percentage}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
