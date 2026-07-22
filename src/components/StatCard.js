import React from 'react';
export default function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  color = 'amber',
  highlight = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `liquid-glass-card glossy-shine rounded-3xl p-4 sm:p-5 relative overflow-hidden transition-all duration-300 ${highlight ? 'border-[#ff7a00]/40 bg-[#ff7a00]/10 shadow-glow-amber' : 'border-white/10'}`
  }, highlight && /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 right-0 w-28 h-28 bg-[#ff7a00]/15 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] font-extrabold text-white/50 uppercase tracking-wider"
  }, label), /*#__PURE__*/React.createElement("h3", {
    className: `text-2xl sm:text-3xl font-black mt-1 tracking-tight ${highlight ? 'text-[#ff7a00]' : 'text-white'}`
  }, value), subtext && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-white/60 mt-1 font-medium"
  }, subtext)), Icon && /*#__PURE__*/React.createElement("div", {
    className: "p-3 rounded-2xl bg-white/5 border border-white/10 text-[#ff7a00]"
  }, /*#__PURE__*/React.createElement(Icon, {
    className: "w-5 h-5"
  }))));
}