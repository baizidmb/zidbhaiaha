import React from 'react';
export default function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  color = 'blue',
  highlight = false
}) {
  const colorMap = {
    blue: {
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      glow: 'shadow-glow-blue'
    },
    purple: {
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      glow: 'shadow-glow-purple'
    },
    cyan: {
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      glow: 'shadow-glow-cyan'
    },
    emerald: {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      glow: 'shadow-glow-emerald'
    },
    amber: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      glow: 'shadow-glow-amber'
    }
  };
  const theme = colorMap[color] || colorMap.blue;
  return /*#__PURE__*/React.createElement("div", {
    className: `glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-300 ${highlight ? `${theme.border} ${theme.glow}` : 'border-slate-800'}`
  }, highlight && /*#__PURE__*/React.createElement("div", {
    className: `absolute top-0 right-0 w-24 h-24 ${theme.bg} rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none`
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-semibold text-slate-400 uppercase tracking-wider"
  }, label), /*#__PURE__*/React.createElement("h3", {
    className: `text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight ${theme.text}`
  }, value), subtext && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400 mt-1 font-medium"
  }, subtext)), Icon && /*#__PURE__*/React.createElement("div", {
    className: `p-2.5 rounded-xl ${theme.bg} ${theme.text} border ${theme.border}`
  }, /*#__PURE__*/React.createElement(Icon, {
    className: "w-5 h-5"
  }))));
}