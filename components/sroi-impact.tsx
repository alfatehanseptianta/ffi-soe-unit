'use client';

import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeftRight,
  BookOpen,
  ClipboardCheck,
  Coins,
  HeartPulse,
  LineChart,
  Package,
  Target,
  TrendingUp,
  Truck,
  Users,
} from 'lucide-react';

type SroiProps = {
  language: 'en' | 'id';
};

type ComponentId =
  | 'commodities'
  | 'logistics'
  | 'management'
  | 'capital'
  | 'community'
  | 'totalBenefit'
  | 'valueTransfer'
  | 'healthGains'
  | 'productivity'
  | 'learning';

type ComponentItem = {
  id: ComponentId;
  name: string;
  amount: number;
  percent: number;
};

type ComponentIconStyle = {
  icon: LucideIcon;
  badge: string;
  accent: string;
};

const componentIconMap: Record<ComponentId, ComponentIconStyle> = {
  commodities: { icon: Package, badge: 'bg-amber-100', accent: 'text-amber-700' },
  logistics: { icon: Truck, badge: 'bg-sky-100', accent: 'text-sky-700' },
  management: { icon: ClipboardCheck, badge: 'bg-indigo-100', accent: 'text-indigo-700' },
  capital: { icon: Coins, badge: 'bg-emerald-100', accent: 'text-emerald-700' },
  community: { icon: Users, badge: 'bg-rose-100', accent: 'text-rose-700' },
  totalBenefit: { icon: TrendingUp, badge: 'bg-emerald-100', accent: 'text-emerald-700' },
  valueTransfer: { icon: ArrowLeftRight, badge: 'bg-amber-100', accent: 'text-amber-700' },
  healthGains: { icon: HeartPulse, badge: 'bg-rose-100', accent: 'text-rose-700' },
  productivity: { icon: LineChart, badge: 'bg-sky-100', accent: 'text-sky-700' },
  learning: { icon: BookOpen, badge: 'bg-indigo-100', accent: 'text-indigo-700' },
};

export function SROIImpact({ language }: SroiProps) {
  const copy = language === 'id'
    ? {
        headerTitle: 'Pengembalian Sosial atas Investasi',
        headerValue: '3.7x ROI',
        headerSubtitle: 'Untuk setiap 1 USD yang diinvestasikan, tercipta 3,7 USD nilai sosial',
        breakdownTitle: 'Rincian Investasi & Imbal Hasil',
        costComponentsTitle: 'Komponen Biaya',
        benefitComponentsTitle: 'Komponen Manfaat',
        totalCostLabel: 'Total Biaya: $642',
        totalBenefitLabel: 'Total Manfaat: $2,384',
        percentOfTotal: 'dari total',
        roiBreakdown: [
          { label: 'Total Biaya', amount: '642', sublabel: 'USD per penerima/tahun' },
          { label: 'Total Manfaat', amount: '2,384', sublabel: 'USD per penerima/tahun', highlight: true },
          { label: 'Pengembalian Investasi', amount: '3.7x', sublabel: 'Rasio Manfaat terhadap Biaya', highlight: true },
          { label: 'Nilai Sosial Bersih', amount: '1,742', sublabel: 'USD per penerima/tahun' },
        ],
        costComponents: [
          { id: 'commodities', name: 'Komoditas', amount: 501, percent: 78 },
          { id: 'logistics', name: 'Logistik', amount: 64, percent: 10 },
          { id: 'management', name: 'Manajemen', amount: 22, percent: 3 },
          { id: 'capital', name: 'Modal', amount: 23, percent: 4 },
          { id: 'community', name: 'Komunitas', amount: 32, percent: 5 },
        ],
        benefitComponents: [
          { id: 'totalBenefit', name: 'Total Manfaat', amount: 2384, percent: 100 },
          { id: 'valueTransfer', name: 'Transfer Nilai', amount: 1949, percent: 82 },
          { id: 'healthGains', name: 'Peningkatan Kesehatan', amount: 485, percent: 20 },
          { id: 'productivity', name: 'Produktivitas', amount: 456, percent: 19 },
          { id: 'learning', name: 'Peningkatan Pembelajaran', amount: 456, percent: 19 },
        ],
      }
    : {
        headerTitle: 'Social Return on Investment',
        headerValue: '3.7x ROI',
        headerSubtitle: 'For every 1 USD invested, 3.7 USD of social value is created',
        breakdownTitle: 'Investment & Return Breakdown',
        costComponentsTitle: 'Cost Components',
        benefitComponentsTitle: 'Benefit Components',
        totalCostLabel: 'Total Cost: $642',
        totalBenefitLabel: 'Total Benefit: $2,384',
        percentOfTotal: 'of total',
        roiBreakdown: [
          { label: 'Total Cost', amount: '642', sublabel: 'USD per beneficiary/year' },
          { label: 'Total Benefit', amount: '2,384', sublabel: 'USD per beneficiary/year', highlight: true },
          { label: 'Return on Investment', amount: '3.7x', sublabel: 'Benefit to Cost Ratio', highlight: true },
          { label: 'Net Social Value', amount: '1,742', sublabel: 'USD per beneficiary/year' },
        ],
        costComponents: [
          { id: 'commodities', name: 'Commodities', amount: 501, percent: 78 },
          { id: 'logistics', name: 'Logistics', amount: 64, percent: 10 },
          { id: 'management', name: 'Management', amount: 22, percent: 3 },
          { id: 'capital', name: 'Capital', amount: 23, percent: 4 },
          { id: 'community', name: 'Community', amount: 32, percent: 5 },
        ],
        benefitComponents: [
          { id: 'totalBenefit', name: 'Total Benefit', amount: 2384, percent: 100 },
          { id: 'valueTransfer', name: 'Value Transfer', amount: 1949, percent: 82 },
          { id: 'healthGains', name: 'Health Gains', amount: 485, percent: 20 },
          { id: 'productivity', name: 'Productivity', amount: 456, percent: 19 },
          { id: 'learning', name: 'Increased Learning', amount: 456, percent: 19 },
        ],
      };

  const { roiBreakdown } = copy;
  const costComponents: ComponentItem[] = copy.costComponents;
  const benefitComponents: ComponentItem[] = copy.benefitComponents;

  return (
    <div className="space-y-10">
      {/* SROI Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-10 text-white shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest opacity-90">{copy.headerTitle}</p>
            <h2 className="text-4xl font-bold mt-2">{copy.headerValue}</h2>
            <p className="text-sm opacity-80 mt-2">{copy.headerSubtitle}</p>
          </div>
          <TrendingUp size={60} className="opacity-20" />
        </div>
      </div>

      {/* ROI Breakdown */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Target size={24} className="text-primary" />
          {copy.breakdownTitle}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roiBreakdown.map((item, idx) => (
            <div key={idx} className={`p-6 rounded-lg border-2 ${item.highlight ? 'bg-primary/10 border-primary' : 'bg-secondary border-border'}`}>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{item.label}</p>
              <p className={`text-3xl font-bold ${item.highlight ? 'text-primary' : 'text-foreground'}`}>{item.amount}</p>
              <p className="text-xs text-muted-foreground mt-2">{item.sublabel}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cost vs Benefit Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-8 rounded-2xl border border-border shadow-md">
          <h4 className="font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <Coins size={16} />
            </span>
            {copy.costComponentsTitle}
          </h4>
          <div className="space-y-4">
            {costComponents.map((comp) => {
              const mapping = componentIconMap[comp.id];
              const Icon = mapping.icon;
              return (
                <div key={comp.id}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${mapping.badge} ${mapping.accent}`}>
                      <Icon size={14} />
                    </span>
                    <p className="font-semibold text-foreground flex-1">{comp.name}</p>
                    <p className="text-sm font-bold text-primary">${comp.amount}</p>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${comp.percent}%` }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{comp.percent}% {copy.percentOfTotal}</p>
                </div>
              );
            })}
            <div className="pt-4 border-t border-border mt-4">
              <p className="font-bold text-foreground">{copy.totalCostLabel}</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-8 rounded-2xl border border-border shadow-md">
          <h4 className="font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <TrendingUp size={16} />
            </span>
            {copy.benefitComponentsTitle}
          </h4>
          <div className="space-y-4">
            {benefitComponents.slice(1).map((comp) => {
              const mapping = componentIconMap[comp.id];
              const Icon = mapping.icon;
              return (
                <div key={comp.id}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${mapping.badge} ${mapping.accent}`}>
                      <Icon size={14} />
                    </span>
                    <p className="font-semibold text-foreground flex-1">{comp.name}</p>
                    <p className="text-sm font-bold text-primary">${comp.amount}</p>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${comp.percent}%` }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{comp.percent}% {copy.percentOfTotal}</p>
                </div>
              );
            })}
            <div className="pt-4 border-t border-border mt-4">
              <p className="font-bold text-foreground">{copy.totalBenefitLabel}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
