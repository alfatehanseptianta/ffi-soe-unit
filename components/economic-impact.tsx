'use client';

import { TrendingUp, Wheat, Drumstick, Sprout, Apple, Milk } from 'lucide-react';

type EconomicImpactProps = {
  language: 'en' | 'id';
};

export function EconomicImpact({ language }: EconomicImpactProps) {
  const copy = language === 'id'
    ? {
        headerTitle: 'Arus Ekonomi Bulanan',
        headerValue: '1.072 Miliar IDR Beredar Setiap Bulan',
        headerSubtitle: 'Stimulus ekonomi nyata bagi komunitas lokal',
        commoditiesTitle: 'Pengadaan Komoditas Bulanan',
        tableHeaders: {
          commodity: 'Kategori',
          tonnage: 'Jumlah Tonase/Bulan',
          transaction: 'Nilai Transaksi (Juta IDR)',
          percentage: 'Persentase dari Total'
        },
        
        commoditiesData: [
          { name: 'Karbohidrat', value: 4.2, items: 'Beras, Jagung, Kentang', icon: Wheat, accent: 'bg-amber-50 text-amber-600', transaction: 260 },
          { name: 'Sumber Protein', value: 1.7, items: 'Telur, Ikan, Daging', icon: Drumstick, accent: 'bg-rose-50 text-rose-600', transaction: 210 },
          { name: 'Sayuran', value: 11.3, items: 'Brokoli, Wortel, Sayuran Hijau', icon: Sprout, accent: 'bg-emerald-50 text-emerald-600', transaction: 290 },
          { name: 'Buah-buahan', value: 2.6, items: 'Pisang, Mangga, Pepaya', icon: Apple, accent: 'bg-orange-50 text-orange-600', transaction: 110 },
          { name: 'Susu & Kacang', value: 2.7, items: 'Susu, Yogurt, Kacang', icon: Milk, accent: 'bg-blue-50 text-blue-600', transaction: 86 },
        ],
        
      }
    : {
        headerTitle: 'Monthly Economic Flows',
        headerValue: '1,072 Million IDR Circulating Monthly',
        headerSubtitle: 'Tangible economic stimulus to local communities',
        commoditiesTitle: 'Monthly Commodities Procurement',
        
        tableHeaders: {
          commodity: 'Category',
          tonnage: 'Monthly Tonnage',
          transaction: 'Transaction Value (Million IDR)',
          percentage: 'Share of Total'
        },
        
        commoditiesData: [
          { name: 'Carbohydrates', value: 4.2, items: 'Rice, Corn, Potatoes', icon: Wheat, accent: 'bg-amber-50 text-amber-600', transaction: 260 },
          { name: 'Protein Sources', value: 1.7, items: 'Eggs, Fish, Meat', icon: Drumstick, accent: 'bg-rose-50 text-rose-600', transaction: 210 },
          { name: 'Vegetables', value: 11.3, items: 'Broccoli, Carrots, Leafy Greens', icon: Sprout, accent: 'bg-emerald-50 text-emerald-600', transaction: 290 },
          { name: 'Fruits', value: 2.6, items: 'Bananas, Mangoes, Papayas', icon: Apple, accent: 'bg-orange-50 text-orange-600', transaction: 110 },
          { name: 'Dairy & Nuts', value: 2.7, items: 'Milk, Yogurt, Nuts', icon: Milk, accent: 'bg-blue-50 text-blue-600', transaction: 86 },
        ],
        
      };

  const totalTonnage = copy.commoditiesData.reduce((sum, item) => sum + item.value, 0);
  const totalTransaction = copy.commoditiesData.reduce((sum, item) => sum + item.transaction, 0);
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', {
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(value);

  return (
    <div className="space-y-10">
      {/* Economic Impact Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-10 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest opacity-90">{copy.headerTitle}</p>
            <h2 className="text-3xl font-bold mt-2">{copy.headerValue}</h2>
            <p className="text-sm opacity-80 mt-2">{copy.headerSubtitle}</p>
          </div>
          <TrendingUp size={60} className="opacity-20" />
        </div>
      </div>

      {/* Commodities Overview */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-card p-8 rounded-2xl border border-border shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">{copy.commoditiesTitle}</h3>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.18em]">
              {language === 'id' ? 'Tabel Ringkas' : 'Compact Table'}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr className="bg-muted/60 text-xs uppercase text-muted-foreground">
                  <th className="text-left font-semibold px-4 py-3 rounded-tl-xl">{copy.tableHeaders.commodity}</th>
                  <th className="text-right font-semibold px-4 py-3">{copy.tableHeaders.tonnage}</th>
                  <th className="text-right font-semibold px-4 py-3">{copy.tableHeaders.transaction}</th>
                  <th className="text-right font-semibold px-4 py-3 rounded-tr-xl">{copy.tableHeaders.percentage}</th>
                </tr>
              </thead>
              <tbody>
                {copy.commoditiesData.map((item, idx) => {
                  const Icon = item.icon;
                  const percentage = (item.value / totalTonnage) * 100;
                  return (
                    <tr
                      key={item.name}
                      className={`border-b border-border last:border-b-0 ${idx % 2 === 0 ? 'bg-card' : 'bg-muted/20'}`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`h-10 w-10 rounded-full flex items-center justify-center ${item.accent}`}>
                            <Icon size={20} />
                          </span>
                          <div>
                            <p className="font-semibold text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.items}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-foreground">{item.value.toFixed(1)} T</td>
                      <td className="px-4 py-4 text-right font-semibold text-foreground">
                        {formatCurrency(item.transaction)} {language === 'id' ? 'Juta' : 'M'}
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-primary">{percentage.toFixed(1)}%</td>
                    </tr>
                  );
                })}
                <tr className="bg-muted/50 font-bold text-foreground">
                  <td className="px-4 py-4 rounded-bl-xl">{language === 'id' ? 'Total' : 'Total'}</td>
                  <td className="px-4 py-4 text-right">{totalTonnage.toFixed(1)} T</td>
                  <td className="px-4 py-4 text-right">
                    {formatCurrency(totalTransaction)} {language === 'id' ? 'Juta' : 'M'}
                  </td>
                  <td className="px-4 py-4 text-right rounded-br-xl">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {language === 'id'
              ? 'Persentase dihitung dari total tonase komoditas bulanan.'
              : 'Percentages are calculated from the total monthly commodity tonnage.'}
          </p>
        </div>
      </div>

    </div>
  );
}

