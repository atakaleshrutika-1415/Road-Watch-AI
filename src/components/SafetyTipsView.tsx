import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Search,
  FileCheck,
  Leaf,
  Users,
} from 'lucide-react';
import { SAFETY_TIPS, EMERGENCY_CONTACTS, SUSTAINABILITY_INSIGHTS } from '../data/safetyTips';

export const SafetyTipsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTips = SAFETY_TIPS.filter((tip) => {
    if (selectedCategory !== 'all' && tip.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tip.title.toLowerCase().includes(q) ||
        tip.summary.toLowerCase().includes(q) ||
        tip.dos.some((d) => d.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1 tracking-wider uppercase">
          <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Vulnerable Road User & Commuter Defense</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Road Safety Protocols & Civic Resilience
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl">
          Practical vehicle preservation techniques, post-impact checklists, emergency contacts,
          and insights into how proactive civic maintenance protects vulnerable road users.
        </p>
      </div>

      {/* Sustainable Maintenance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SUSTAINABILITY_INSIGHTS.map((item) => (
          <div
            key={item.title}
            className="bg-white dark:bg-gradient-to-br dark:from-[#0c1324] dark:to-[#0e172e] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs dark:shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-orange-400 font-mono mb-2">
                {item.stat}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Roadside Hotlines Strip */}
      <div className="bg-white dark:bg-[#0b101c] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs dark:shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-orange-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Emergency Roadside & Municipal Hotlines</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">Direct Dial Assistance</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EMERGENCY_CONTACTS.map((contact) => (
            <div
              key={contact.label}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{contact.label}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">{contact.hours}</span>
              </div>
              <div className="text-lg font-mono font-bold text-emerald-700 dark:text-orange-400">{contact.number}</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">{contact.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Tips Filter and Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All Hazards' },
              { id: 'potholes', label: 'Potholes' },
              { id: 'waterlogging', label: 'Waterlogging' },
              { id: 'damaged_roads', label: 'Road Damage' },
              { id: 'broken_streetlights', label: 'Streetlights' },
              { id: 'blocked_roads', label: 'Road Blockages' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search safety advice..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Tips List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTips.map((tip) => (
            <div
              key={tip.id}
              className="bg-white dark:bg-[#0b101c] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs dark:shadow-lg space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 dark:bg-orange-500/10 text-emerald-700 dark:text-orange-400 border border-emerald-200 dark:border-orange-500/20">
                    {tip.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-slate-500">
                    Priority: {tip.urgency}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{tip.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{tip.summary}</p>

                {/* Dos */}
                <div className="space-y-1.5 mb-3">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Recommended Actions (Do):</span>
                  </span>
                  <ul className="space-y-1">
                    {tip.dos.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-emerald-500">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Don'ts */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Dangerous Pitfalls (Avoid):</span>
                  </span>
                  <ul className="space-y-1">
                    {tip.donts.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-rose-500">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post-Hazard Impact Checklist */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-[#0c1324] dark:to-[#121c36] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs dark:shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-600 dark:text-orange-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Post-Impact Vehicle Checklist (If You Hit a Severe Pothole)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-mono text-emerald-700 dark:text-orange-400 font-bold block">Step 01. Safely Stop</span>
            <p className="text-slate-600 dark:text-slate-300">
              Never inspect your vehicle on an active traffic lane. Pull over into a well-lit parking bay or wide shoulder.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-mono text-emerald-700 dark:text-orange-400 font-bold block">Step 02. Sidewall & Rim Inspection</span>
            <p className="text-slate-600 dark:text-slate-300">
              Check for tire sidewall bulges (internal cord tear), wheel rim flat-spots, or sudden steering alignment pull.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-mono text-emerald-700 dark:text-orange-400 font-bold block">Step 03. Photo Documentation</span>
            <p className="text-slate-600 dark:text-slate-300">
              Take wide and close-up photos of the hazard and vehicle damage for city reimbursement claims.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-mono text-emerald-700 dark:text-orange-400 font-bold block">Step 04. Log on RoadWatch AI</span>
            <p className="text-slate-600 dark:text-slate-300">
              Submit your report instantly so the AI logs GPS coordinates and alerts nearby motorists and city crews.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
