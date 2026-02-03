'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { DollarSign, TrendingUp } from 'lucide-react';

type CostBenefitProps = {
  language: 'en' | 'id';
};

type WaterfallItem = {
  label: string;
  value: number;
  isTotal?: boolean;
  start?: number;
};

const buildWaterfallData = (items: WaterfallItem[], totalLabel: string) => {
  let runningTotal = 0;
  const steps = items.map((item) => {
    const start = runningTotal;
    runningTotal += item.value;
    return { ...item, start };
  });

  return [
    ...steps,
    {
      label: totalLabel,
      value: runningTotal,
      start: 0,
      isTotal: true,
    },
  ];
};

export function CostBenefitAnalysis({ language }: CostBenefitProps) {
  const copy = language === 'id'
    ? {
        headerTitle: 'Analisis Biaya-Manfaat',
        headerSubtitle: 'Perbandingan Model & Kinerja Keuangan',
        modelSectionTitle: 'Perbandingan Model Penyediaan Makanan',
        benefitToCost: 'Manfaat terhadap Biaya',
        waterfallTitle: 'Model Waterfall Biaya-Manfaat',
        waterfallCostTitle: 'Biaya (Input)',
        waterfallBenefitTitle: 'Manfaat (Output)',
        waterfallRatioLabel: 'Rasio Manfaat',
        waterfallTotalLabel: 'TOTAL',
        breakdownTitle: 'Rincian Biaya Tahunan (per Penerima)',
        totalAnnualCostLabel: 'Total Biaya Tahunan',
        perBeneficiary: 'per Penerima',
        keyMetricsTitle: 'Metrik Keuangan Utama',
        metrics: {
          totalInvestment: 'Total Investasi (Tahunan)',
          totalBenefit: 'Nilai Total Manfaat',
          netBenefit: 'Manfaat Bersih',
          roi: 'Pengembalian Investasi',
        },
        metricValues: {
          totalInvestment: 642,
          totalBenefit: 2384,
          netBenefit: 1742,
          roi: 3.7,
        },
        assumptionsTitle: 'Asumsi Kunci dalam CBA',
        assumptions: [
          { label: 'Durasi Program', value: 'Horizon 10 tahun untuk perhitungan biaya-manfaat' },
          { label: 'Nilai Penerima Program', value: 'Dihitung dari peningkatan kesehatan, pembelajaran, dan ketahanan pangan rumah tangga' },
          { label: 'Tingkat Diskonto', value: 'Diskonto 3% per tahun untuk nilai kini bersih' },
          { label: 'Efek Limpahan', value: 'Termasuk perbaikan pola makan rumah tangga dan stimulus ekonomi lokal' },
          { label: 'Sumber Lokal', value: '88% komoditas dibeli dari pemasok lokal' },
        ],
        modelComparison: [
          { model: 'Siap Saji', costPerBenefit: '$2.78', ratio: '1:2.78', description: 'Makanan siap saji, distribusi cepat' },
          { model: 'Siap Masak', costPerBenefit: '$3.53', ratio: '1:3.53', description: 'Bahan setengah siap, dimasak lokal' },
          { model: 'Swakelola', costPerBenefit: '$3.49', ratio: '1:3.49', description: 'Kontrol lokal penuh, fleksibilitas tertinggi' },
        ],
        benefitBreakdown: [
          { label: 'Penghematan Kesehatan', amount: 780 },
          { label: 'Peningkatan Pembelajaran', amount: 520 },
          { label: 'Dampak Ekonomi Lokal', amount: 450 },
          { label: 'Produktivitas & Konsentrasi', amount: 350 },
          { label: 'Dampak Spillover', amount: 284 },
        ],
        costBreakdown: [
          { category: 'Komoditas Pangan', amount: 501, percent: 78, description: 'Beras, sayur, sumber protein' },
          { category: 'Logistik & Distribusi', amount: 64, percent: 10, description: 'Transportasi, penyimpanan, pengemasan' },
          { category: 'Manajemen & Administrasi', amount: 22, percent: 3, description: 'Gaji staf, operasional' },
          { category: 'Investasi Modal', amount: 23, percent: 4, description: 'Peralatan, penyiapan dapur' },
          { category: 'Kontribusi Komunitas', amount: 32, percent: 5, description: 'Tenaga kerja lokal, bahan' },
        ],
      }
    : {
        headerTitle: 'Cost Benefit Analysis',
        headerSubtitle: 'Model Comparison & Financial Performance',
        modelSectionTitle: 'Feeding Model Comparison',
        benefitToCost: 'Benefit to Cost',
        waterfallTitle: 'Cost-Benefit Waterfall Model',
        waterfallCostTitle: 'Costs (Inputs)',
        waterfallBenefitTitle: 'Benefits (Outputs)',
        waterfallRatioLabel: 'Benefit Ratio',
        waterfallTotalLabel: 'TOTAL',
        breakdownTitle: 'Annual Cost Breakdown (per Beneficiary)',
        totalAnnualCostLabel: 'Total Annual Cost',
        perBeneficiary: 'per Beneficiary',
        keyMetricsTitle: 'Key Financial Metrics',
        metrics: {
          totalInvestment: 'Total Investment (Annual)',
          totalBenefit: 'Total Benefit Value',
          netBenefit: 'Net Benefit',
          roi: 'Return on Investment',
        },
        metricValues: {
          totalInvestment: 642,
          totalBenefit: 2384,
          netBenefit: 1742,
          roi: 3.7,
        },
        assumptionsTitle: 'Key Assumptions in CBA',
        assumptions: [
          { label: 'Program Duration', value: '10-year horizon for cost-benefit calculation' },
          { label: 'Beneficiary Value', value: 'Calculated from health improvements, learning gains, and household food security' },
          { label: 'Discount Rate', value: '3% annual discount applied for net present value' },
          { label: 'Spillover Effects', value: 'Include household dietary improvements and local economic stimulus' },
          { label: 'Local Sourcing', value: '88% of commodities purchased from local suppliers' },
        ],
        modelComparison: [
          { model: 'Ready-to-Eat', costPerBenefit: '$2.78', ratio: '1:2.78', description: 'Pre-packaged meals, quick distribution' },
          { model: 'Ready-to-Cook', costPerBenefit: '$3.53', ratio: '1:3.53', description: 'Semi-prepared ingredients, local cooking' },
          { model: 'Self-Managed', costPerBenefit: '$3.49', ratio: '1:3.49', description: 'Complete local control, highest flexibility' },
        ],
        benefitBreakdown: [
          { label: 'Health Savings', amount: 780 },
          { label: 'Learning Gains', amount: 520 },
          { label: 'Local Economic Boost', amount: 450 },
          { label: 'Productivity & Focus', amount: 350 },
          { label: 'Spillover Effects', amount: 284 },
        ],
        costBreakdown: [
          { category: 'Food Commodities', amount: 501, percent: 78, description: 'Rice, vegetables, protein sources' },
          { category: 'Logistics & Distribution', amount: 64, percent: 10, description: 'Transportation, storage, packaging' },
          { category: 'Management & Admin', amount: 22, percent: 3, description: 'Staff salaries, operations' },
          { category: 'Capital Investment', amount: 23, percent: 4, description: 'Equipment, kitchen setup' },
          { category: 'Community Contributions', amount: 32, percent: 5, description: 'Local labor, materials' },
        ],
      };

  const numberLocale = language === 'id' ? 'id-ID' : 'en-US';
  const formatCurrency = (value: number) => `$${Math.abs(value).toLocaleString(numberLocale)}`;
  const formatAxisCurrency = (value: number) => `${value < 0 ? '-' : ''}${formatCurrency(value)}`;
  const formatRatio = (value: number) =>
    value.toLocaleString(numberLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatMultiplier = (value: number) =>
    `${value.toLocaleString(numberLocale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}x`;

  const costWaterfallItems = copy.costBreakdown.map((cost) => ({
    label: cost.category,
    value: cost.amount,
  }));
  const benefitWaterfallItems = copy.benefitBreakdown.map((benefit) => ({
    label: benefit.label,
    value: benefit.amount,
  }));

  const costWaterfallData = buildWaterfallData(costWaterfallItems, copy.waterfallTotalLabel);
  const benefitWaterfallData = buildWaterfallData(benefitWaterfallItems, copy.waterfallTotalLabel);

  const benefitRatio = copy.metricValues.totalBenefit / copy.metricValues.totalInvestment;

  return (
    <div className="space-y-10">
      {/* CBA Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-10 text-white shadow-lg">
        <div className="flex items-center gap-6 mb-4">
          <div className="bg-white/20 p-4 rounded-lg backdrop-blur">
            <DollarSign size={32} />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest opacity-90">{copy.headerTitle}</p>
            <h2 className="text-3xl font-bold mt-2">{copy.headerSubtitle}</h2>
          </div>
        </div>
      </div>

      {/* Model Overview */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-6">{copy.modelSectionTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {copy.modelComparison.map((model, idx) => (
            <div key={idx} className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-all">
              <h4 className="font-bold text-foreground mb-2">{model.model}</h4>
              <p className="text-3xl font-bold text-primary mb-3">{model.costPerBenefit}</p>
              <p className="text-sm font-semibold text-muted-foreground mb-4">{copy.benefitToCost}: <span className="text-foreground font-bold">{model.ratio}</span></p>
              <p className="text-sm text-muted-foreground">{model.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Waterfall Model */}
      <div className="bg-card p-8 rounded-2xl border border-border shadow-md">
        <h3 className="text-lg font-bold text-foreground mb-6">{copy.waterfallTitle}</h3>
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto_1fr] gap-6 items-center">
          <div className="bg-secondary/40 border border-border rounded-xl p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">{copy.waterfallCostTitle}</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costWaterfallData} margin={{ top: 24, right: 12, left: 0, bottom: 8 }} barCategoryGap={16}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="label" interval={0} tick={{ fontSize: 10 }} angle={-12} textAnchor="end" height={48} />
                  <YAxis tickFormatter={formatAxisCurrency} width={80} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}
                    formatter={(value) => (typeof value === 'number' ? formatCurrency(Math.abs(value)) : value)}
                  />
                  <Bar dataKey="start" stackId="a" fill="transparent" />
                  <Bar dataKey="value" stackId="a" radius={[6, 6, 6, 6]}>
                    {costWaterfallData.map((entry, index) => (
                      <Cell
                        key={`cost-cell-${index}`}
                        fill={entry.isTotal ? '#7f1d1d' : '#ef4444'}
                      />
                    ))}
                    <LabelList
                      dataKey="value"
                      content={({ x, y, width, height, value }) => {
                        if (typeof value !== 'number') return null;
                        const isNegative = value < 0;
                        const yPos = isNegative ? y + height + 12 : y - 6;
                        return (
                          <text
                            x={(x ?? 0) + (width ?? 0) / 2}
                            y={yPos}
                            textAnchor="middle"
                            className="fill-current text-foreground text-[10px] font-semibold"
                          >
                            {formatCurrency(Math.abs(value))}
                          </text>
                        );
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="bg-orange-500 text-white rounded-2xl px-8 py-6 shadow-lg text-center min-w-[170px]">
              <p className="text-[11px] uppercase tracking-widest opacity-80 font-semibold">{copy.waterfallRatioLabel}</p>
              <p className="text-2xl font-bold mt-2">1$ : {formatRatio(benefitRatio)}$</p>
            </div>
          </div>

          <div className="bg-secondary/40 border border-border rounded-xl p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">{copy.waterfallBenefitTitle}</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benefitWaterfallData} margin={{ top: 24, right: 12, left: 0, bottom: 8 }} barCategoryGap={16}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="label" interval={0} tick={{ fontSize: 10 }} angle={-12} textAnchor="end" height={48} />
                  <YAxis tickFormatter={formatAxisCurrency} width={80} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}
                    formatter={(value) => (typeof value === 'number' ? formatCurrency(Math.abs(value)) : value)}
                  />
                  <Bar dataKey="start" stackId="a" fill="transparent" />
                  <Bar dataKey="value" stackId="a" radius={[6, 6, 6, 6]}>
                    {benefitWaterfallData.map((entry, index) => (
                      <Cell
                        key={`benefit-cell-${index}`}
                        fill={entry.isTotal ? '#0f766e' : '#38bdf8'}
                      />
                    ))}
                    <LabelList
                      dataKey="value"
                      content={({ x, y, width, height, value }) => {
                        if (typeof value !== 'number') return null;
                        const yPos = value < 0 ? y + height + 12 : y - 6;
                        return (
                          <text
                            x={(x ?? 0) + (width ?? 0) / 2}
                            y={yPos}
                            textAnchor="middle"
                            className="fill-current text-foreground text-[10px] font-semibold"
                          >
                            {formatCurrency(Math.abs(value))}
                          </text>
                        );
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-6">{copy.breakdownTitle}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {copy.costBreakdown.map((cost, idx) => (
              <div key={idx} className="bg-secondary p-5 rounded-lg border border-border">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-foreground">{cost.category}</p>
                    <p className="text-xs text-muted-foreground mt-1">{cost.description}</p>
                  </div>
                  <p className="text-lg font-bold text-primary">{formatCurrency(cost.amount)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-background rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${cost.percent}%` }}></div>
                  </div>
                  <p className="text-xs font-bold text-muted-foreground w-8 text-right">{cost.percent}%</p>
                </div>
              </div>
            ))}
            <div className="bg-primary text-white p-6 rounded-lg font-bold text-lg">
              {copy.totalAnnualCostLabel}: {formatCurrency(copy.metricValues.totalInvestment)} {copy.perBeneficiary}
            </div>
          </div>

          <div className="bg-card p-8 rounded-xl border border-border flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-foreground mb-4">{copy.keyMetricsTitle}</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-muted-foreground">{copy.metrics.totalInvestment}</span>
                  <span className="font-bold text-foreground">{formatCurrency(copy.metricValues.totalInvestment)}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-muted-foreground">{copy.metrics.totalBenefit}</span>
                  <span className="font-bold text-primary text-lg">{formatCurrency(copy.metricValues.totalBenefit)}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="text-muted-foreground">{copy.metrics.netBenefit}</span>
                  <span className="font-bold text-primary text-lg">{formatCurrency(copy.metricValues.netBenefit)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 bg-primary/10 p-4 rounded-lg">
                  <span className="font-bold text-foreground">{copy.metrics.roi}</span>
                  <span className="text-2xl font-bold text-primary">{formatMultiplier(copy.metricValues.roi)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Assumptions */}
      <div className="bg-orange-50 border border-orange-200 p-8 rounded-xl">
        <h4 className="font-bold text-orange-900 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-orange-600" />
          {copy.assumptionsTitle}
        </h4>
        <ul className="space-y-3 text-sm text-orange-900">
          {copy.assumptions.map((assumption, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="font-bold">-</span>
              <span><strong>{assumption.label}:</strong> {assumption.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}



