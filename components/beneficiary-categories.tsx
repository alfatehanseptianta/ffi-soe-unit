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

type Tone = {
  icon: LucideIcon;
  headerBg: string;
  dot: string;
};

const toneMap: Record<BeneficiaryId, Tone> = {
  students: {
    icon: School,
    headerBg: 'bg-gradient-to-r from-sky-700 to-sky-600',
    dot: 'bg-sky-500',
  },
  pregnantNursing: {
    icon: HeartPulse,
    headerBg: 'bg-gradient-to-r from-rose-700 to-rose-500',
    dot: 'bg-rose-500',
  },
  toddlers: {
    icon: Baby,
    headerBg: 'bg-gradient-to-r from-amber-700 to-amber-500',
    dot: 'bg-amber-500',
  },
  families: {
    icon: Users,
    headerBg: 'bg-gradient-to-r from-emerald-700 to-emerald-600',
    dot: 'bg-emerald-500',
  },
  valueTransfer: {
    icon: Coins,
    headerBg: 'bg-gradient-to-r from-amber-700 to-amber-500',
    dot: 'bg-amber-500',
  },
  assetRoi: {
    icon: LineChart,
    headerBg: 'bg-gradient-to-r from-indigo-700 to-indigo-500',
    dot: 'bg-indigo-500',
  },
  spillover: {
    icon: Building2,
    headerBg: 'bg-gradient-to-r from-teal-700 to-teal-600',
    dot: 'bg-teal-500',
  },
  health: {
    icon: HeartPulse,
    headerBg: 'bg-gradient-to-r from-rose-700 to-rose-500',
    dot: 'bg-rose-500',
  },
  income: {
    icon: TrendingUp,
    headerBg: 'bg-gradient-to-r from-emerald-700 to-emerald-600',
    dot: 'bg-emerald-500',
  },
};

const fallbackTone: Tone = {
  icon: Info,
  headerBg: 'bg-gradient-to-r from-slate-700 to-slate-500',
  dot: 'bg-slate-500',
};

const getLines = (d?: string | string[]) =>
  Array.isArray(d) ? d : d ? [d] : [];

type BeneficiaryCategoriesProps = {
  data: BeneficiaryMetric[];
  summary?: BeneficiaryMetric | null;
  detailHeading?: string;
};

export function BeneficiaryCategories({
  data,
  summary,
  detailHeading,
}: BeneficiaryCategoriesProps) {
  const sTone = summary ? toneMap[summary.id] ?? fallbackTone : null;
  const SIcon = sTone?.icon ?? Info;
  const sLines = getLines(summary?.description);

  return (
    <div className="space-y-6">
      {/* ── Summary ── */}
      {summary && sTone && (
        <div className="relative overflow-hidden rounded-2xl bg-card p-5 sm:p-7 shadow-lg ring-1 ring-black/[0.04]">
          <div className={`absolute inset-x-0 top-0 h-1 ${sTone.headerBg}`} />

          <div className="flex items-center justify-center gap-4 sm:gap-5">
            <div className={`flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl ${sTone.headerBg} text-white shadow-md`}>
              <SIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-0.5">
                {summary.label}
              </p>
              <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                {summary.value}
              </p>
            </div>
          </div>

          {sLines.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {sLines.map((line, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs sm:text-[13px] text-muted-foreground ring-1 ring-black/[0.04]"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${sTone.dot}`} />
                  {line}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Detail heading ── */}
      {detailHeading && (
        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 px-0.5">
          {detailHeading}
        </p>
      )}

      {/* ── Category cards ── */}
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data.map((m) => {
          const t = toneMap[m.id] ?? fallbackTone;
          const Icon = t.icon;
          const lines = getLines(m.description);

          return (
            <div
              key={m.id}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-md ring-1 ring-black/[0.04] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              {/* Colored header badge */}
              <div className={`${t.headerBg} px-4 py-3 flex items-center gap-3`}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                  <Icon className="h-[18px] w-[18px] text-white" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/90">
                  {m.label}
                </p>
              </div>

              {/* Content */}
              <div className="px-4 py-4 sm:px-5 sm:py-5">
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-none">
                  {m.value}
                </p>

                {lines.length > 0 && (
                  <ul className="mt-3 space-y-1.5 border-t border-border/50 pt-3">
                    {lines.map((line, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[11px] sm:text-xs text-muted-foreground leading-relaxed"
                      >
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${t.dot}`} />
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
