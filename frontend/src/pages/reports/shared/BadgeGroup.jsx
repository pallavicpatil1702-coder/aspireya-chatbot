import React from 'react';

/**
 * BadgeGroup renders a list of visual capsules or tags.
 * Displays "Information unavailable" if the list is empty.
 */
const BadgeGroup = ({ items = [], variant = 'indigo' }) => {
  if (!items || items.length === 0) {
    return <span className="text-xs text-slate-400 font-medium">Information unavailable</span>;
  }

  const getStyleClass = () => {
    switch (variant) {
      case 'gold':
        return 'bg-amber-50 border border-amber-200/50 text-amber-800';
      case 'emerald':
        return 'bg-emerald-50 border border-emerald-200/50 text-emerald-800';
      case 'slate':
        return 'bg-slate-50 border border-slate-200/50 text-slate-700';
      case 'indigo':
      default:
        return 'bg-indigo-50 border border-indigo-100/50 text-indigo-800';
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 w-full">
      {items.map((item, idx) => (
        <span 
          key={idx} 
          className={`px-3 py-1.5 rounded-xl text-[0.72rem] font-semibold transition-all duration-150 ${getStyleClass()}`}
          style={{ fontFamily: 'var(--report-font-body)' }}
        >
          {item}
        </span>
      ))}
    </div>
  );
};

export default BadgeGroup;
export { BadgeGroup };
