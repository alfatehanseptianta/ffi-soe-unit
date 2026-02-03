'use client';

import {
  Baby,
  Building2,
  Coins,
  HeartPulse,
  Info,
  LineChart,
  School,
  TrendingUp,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type BeneficiaryId =
  | 'students'
  | 'pregnantNursing'
  | 'toddlers'
  | 'families'
  | 'valueTransfer'
  | 'assetRoi'
  | 'spillover'
  | 'health'
  | 'income'
  | string;

type BeneficiaryMetric = {
  id: BeneficiaryId;
  label: string;
  value: string;
  description?: string | string[];
};

type IconStyle = {
  icon: LucideIcon;
  accent: string;
  badge: string;
  border: string;
  glow: string;
  dot: string;
};

const iconMap: Record<BeneficiaryId, IconStyle> = {
  students: {
    icon: School,
    accent: 'text-sky-700',
    badge: 'bg-sky-100',
    border: 'border-sky-200/70',
    glow: 'bg-sky-200/50',
    dot: 'bg-sky-500',
  },
  pregnantNursing: {
    icon: HeartPulse,
    accent: 'text-rose-700',
    badge: 'bg-rose-100',
    border: 'border-rose-200/70',
    glow: 'bg-rose-200/50',
    dot: 'bg-rose-500',
  },
  toddlers: {
    icon: Baby,
    accent: 'text-amber-700',
    badge: 'bg-amber-100',
    border: 'border-amber-200/70',
    glow: 'bg-amber-200/50',
    dot: 'bg-amber-500',
  },
  families: {
    icon: Users,
    accent: 'text-emerald-700',
    badge: 'bg-emerald-100',
    border: 'border-emerald-200/70',
    glow: 'bg-emerald-200/50',
    dot: 'bg-emerald-500',
  },
  valueTransfer: {
    icon: Coins,
    accent: 'text-amber-700',
    badge: 'bg-amber-100',
    border: 'border-amber-200/70',
    glow: 'bg-amber-200/50',
    dot: 'bg-amber-500',
  },
  assetRoi: {
    icon: LineChart,
    accent: 'text-indigo-700',
    badge: 'bg-indigo-100',
    border: 'border-indigo-200/70',
    glow: 'bg-indigo-200/50',
    dot: 'bg-indigo-500',
  },
  spillover: {
    icon: Building2,
    accent: 'text-teal-700',
    badge: 'bg-teal-100',
    border: 'border-teal-200/70',
    glow: 'bg-teal-200/50',
    dot: 'bg-teal-500',
  },
  health: {
    icon: HeartPulse,
    accent: 'text-rose-700',
    badge: 'bg-rose-100',
    border: 'border-rose-200/70',
    glow: 'bg-rose-200/50',
    dot: 'bg-rose-500',
  },
  income: {
    icon: TrendingUp,
    accent: 'text-emerald-700',
    badge: 'bg-emerald-100',
    border: 'border-emerald-200/70',
    glow: 'bg-emerald-200/50',
    dot: 'bg-emerald-500',
  },
};

export function BeneficiaryCategories({ data }: { data: BeneficiaryMetric[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {data.map((metric) => {
        const mapping = iconMap[metric.id] ?? {
          icon: Info,
          accent: 'text-slate-700',
          badge: 'bg-slate-100',
          border: 'border-border',
          glow: 'bg-slate-200/50',
          dot: 'bg-slate-400',
        };
        const Icon = mapping.icon;
        const descriptionLines = Array.isArray(metric.description)
          ? metric.description
          : metric.description
            ? [metric.description]
            : [];

        return (
          <div
            key={metric.id}
            className={`group relative overflow-hidden rounded-2xl border bg-card/95 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${mapping.border}`}
          >
            <span
              className={`pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full opacity-60 blur-2xl ${mapping.glow}`}
            />
            <div className="relative flex items-start gap-4">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${mapping.badge} ${mapping.accent} ring-1 ring-white/80 shadow-inner`}
              >
                <Icon size={22} />
              </span>
              <div className="flex-1 min-w-0 space-y-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground leading-tight">{metric.value}</p>
                </div>
                {descriptionLines.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {descriptionLines.map((line, idx) => (
                      <li key={`${metric.id}-${idx}`} className="flex items-start gap-2">
                        <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${mapping.dot}`} />
                        <span className="leading-relaxed">{line}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
