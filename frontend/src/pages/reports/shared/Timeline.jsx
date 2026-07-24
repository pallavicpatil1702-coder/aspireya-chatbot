import React from 'react';

/**
 * Timeline renders milestone cards on a vertical pathway for roadmaps.
 * Prevents paragraph text dump and enforces clear visual steps.
 */
const Timeline = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center text-xs text-slate-400">
        No roadmap items available.
      </div>
    );
  }

  return (
    <div className="report-timeline-track report-animate-fade-in">
      {items.map((item, idx) => {
        // Separate step index and step details if the string contains a colon
        const parts = item.split(/:\s*(.+)/);
        const title = parts.length > 1 ? parts[0] : `Milestone Phase ${idx + 1}`;
        const content = parts.length > 1 ? parts[1] : item;

        return (
          <div key={idx} className="report-timeline-card">
            <h4 
              className="font-bold text-slate-800 text-sm mb-1" 
              style={{ fontFamily: 'var(--report-font-heading)', color: 'var(--report-indigo-start)' }}
            >
              {title}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed" style={{ fontFamily: 'var(--report-font-body)' }}>
              {content}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
export { Timeline };
