'use client';

import { Users, Clock, AlertCircle, Crown, ShieldCheck, ChefHat, Truck } from 'lucide-react';

interface StaffBreakdown {
  executive?: { chef: number };
  supervisory?: { souChef: number; kitchenManager: number };
  production?: { 
    headCook: number;
    cooks: number;
    prepWorkers: number;
    dishwashers: number;
    cleaners: number;
  };
  support?: { drivers: number; storageManager: number };
}

interface KitchenProfile {
  operationalSince: string;
  operationalYears: number;
  totalDailyMeals: number;
  mealsPerSchool: { average: number; min: number; max: number };
  staffBreakdown: StaffBreakdown;
  totalStaff: number;
  operatingDays: number;
  operatingHours: string;
  equipmentCount: number;
  storageCapacity: string;
  wasteReduction: string;
  foodSafetyCertification: string;
  localSourcePercentage: number;
}

interface KitchenOperationsProps {
  profile: KitchenProfile;
  language: 'en' | 'id';
  variant?: 'full' | 'profile' | 'summary';
}

export function KitchenOperations({ profile, language, variant = 'full' }: KitchenOperationsProps) {
  const startDate = new Date(profile.operationalSince);
  const formattedDate = startDate.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const showHeader = variant !== 'profile';
  const showStaffBreakdown = variant !== 'summary';
  const showSummary = variant !== 'profile';

  const labels = language === 'id'
    ? {
        operationalSince: 'Beroperasi Sejak',
        yearsOfService: 'tahun layanan',
        dailyMealProduction: 'Produksi Makanan Harian',
        mealsServedPerDay: 'Porsi disajikan per hari',
        totalTeamMembers: 'Total Anggota Tim',
        professionalStaff: 'Staf profesional',
        operatingDays: 'Hari Operasional',
        daysPerYear: 'Hari per tahun',
        staffBreakdownTitle: 'Rincian Staf',
        totalLabel: 'Total',
        staffUnit: 'staf',
        averageLabel: 'Rata-rata',
        mealsPerSchoolUnit: 'porsi per sekolah',
        staffCategories: {
          executive: 'Pimpinan Eksekutif',
          supervisory: 'Supervisi',
          cooks: 'Koki & Persiapan',
          support: 'Staf Pendukung',
        },
        staffDetails: {
          executive: ['Kepala Koki'],
          supervisory: ['Sous Chef', 'Manajer Dapur'],
          cooks: ['Kepala Koki (2)', 'Koki (8)', 'Pekerja Persiapan (12)'],
          support: ['Pencuci Peralatan (4)', 'Petugas Kebersihan (3)', 'Pengemudi (4)', 'Manajer Gudang (1)'],
        },
        operationsSchedule: 'Jadwal Operasional',
        operatingHours: 'Jam Operasional',
        operatingDaysPerYear: 'Hari Operasional/Tahun',
        mealsPerSchool: 'Porsi per Sekolah',
        rangeLabel: 'Rentang',
        rangeNote: 'Tergantung jumlah siswa dan partisipasi program',
        facilitiesTitle: 'Fasilitas & Standar',
        equipmentUnits: 'Unit Peralatan',
        equipmentUnitSuffix: 'unit',
        storageCapacity: 'Kapasitas Penyimpanan',
        foodSafetyStandard: 'Standar Keamanan Pangan',
        certifications: 'Sertifikasi',
        certificationLabels: ['SLHS', 'Halal', 'HACCP'],
      }
    : {
        operationalSince: 'Operational Since',
        yearsOfService: 'years of service',
        dailyMealProduction: 'Daily Meal Production',
        mealsServedPerDay: 'Meals served per day',
        totalTeamMembers: 'Total Team Members',
        professionalStaff: 'Professional staff',
        operatingDays: 'Operating Days',
        daysPerYear: 'Days per year',
        staffBreakdownTitle: 'Detailed Staff Breakdown',
        totalLabel: 'Total',
        staffUnit: 'staff',
        averageLabel: 'Avg.',
        mealsPerSchoolUnit: 'meals per school',
        staffCategories: {
          executive: 'Executive Leadership',
          supervisory: 'Supervisory',
          cooks: 'Cooks & Food Prep',
          support: 'Support Staff',
        },
        staffDetails: {
          executive: ['Executive Chef'],
          supervisory: ['Sous Chef', 'Kitchen Manager'],
          cooks: ['Head Cooks (2)', 'Cooks (8)', 'Prep Workers (12)'],
          support: ['Dishwashers (4)', 'Cleaners (3)', 'Drivers (4)', 'Storage Manager (1)'],
        },
        operationsSchedule: 'Operations Schedule',
        operatingHours: 'Operating Hours',
        operatingDaysPerYear: 'Operating Days/Year',
        mealsPerSchool: 'Meals Per School',
        rangeLabel: 'Range',
        rangeNote: 'Depending on school enrollment and program participation',
        facilitiesTitle: 'Facilities & Standards',
        equipmentUnits: 'Equipment Units',
        equipmentUnitSuffix: 'items',
        storageCapacity: 'Storage Capacity',
        foodSafetyStandard: 'Food Safety Standard',
        certifications: 'Certifications',
        certificationLabels: ['SLHS', 'Halal', 'HACCP'],
      };

  const staffCategories = [
    { 
      label: labels.staffCategories.executive, 
      count: (profile.staffBreakdown.executive?.chef || 0),
      details: labels.staffDetails.executive,
      icon: Crown,
      accent: 'text-red-600',
      badge: 'bg-red-100',
      card: 'from-red-50/80 via-white to-red-100/70 border-red-100/80',
      marker: 'marker:text-red-500',
    },
    { 
      label: labels.staffCategories.supervisory, 
      count: ((profile.staffBreakdown.supervisory?.souChef || 0) + (profile.staffBreakdown.supervisory?.kitchenManager || 0)),
      details: labels.staffDetails.supervisory,
      icon: ShieldCheck,
      accent: 'text-orange-600',
      badge: 'bg-orange-100',
      card: 'from-orange-50/80 via-white to-orange-100/70 border-orange-100/80',
      marker: 'marker:text-orange-500',
    },
    { 
      label: labels.staffCategories.cooks, 
      count: ((profile.staffBreakdown.production?.headCook || 0) + (profile.staffBreakdown.production?.cooks || 0) + (profile.staffBreakdown.production?.prepWorkers || 0)),
      details: labels.staffDetails.cooks,
      icon: ChefHat,
      accent: 'text-amber-700',
      badge: 'bg-amber-100',
      card: 'from-amber-50/80 via-white to-amber-100/70 border-amber-100/80',
      marker: 'marker:text-amber-500',
    },
    { 
      label: labels.staffCategories.support, 
      count: ((profile.staffBreakdown.production?.dishwashers || 0) + (profile.staffBreakdown.production?.cleaners || 0) + (profile.staffBreakdown.support?.drivers || 0) + (profile.staffBreakdown.support?.storageManager || 0)),
      details: labels.staffDetails.support,
      icon: Truck,
      accent: 'text-blue-600',
      badge: 'bg-blue-100',
      card: 'from-blue-50/80 via-white to-blue-100/70 border-blue-100/80',
      marker: 'marker:text-blue-500',
    }
  ];

  return (
    <div className="space-y-8">
      {showHeader && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-6 rounded-xl shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest opacity-90 mb-2">{labels.operationalSince}</p>
            <p className="text-2xl font-bold">{formattedDate}</p>
            <p className="text-sm opacity-80 mt-2">{profile.operationalYears} {labels.yearsOfService}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest opacity-90 mb-2">{labels.dailyMealProduction}</p>
            <p className="text-2xl font-bold">{profile.totalDailyMeals.toLocaleString()}</p>
            <p className="text-sm opacity-80 mt-2">{labels.mealsServedPerDay}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest opacity-90 mb-2">{labels.totalTeamMembers}</p>
            <p className="text-2xl font-bold">{profile.totalStaff}</p>
            <p className="text-sm opacity-80 mt-2">{labels.professionalStaff}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest opacity-90 mb-2">{labels.operatingDays}</p>
            <p className="text-2xl font-bold">{profile.operatingDays}</p>
            <p className="text-sm opacity-80 mt-2">{labels.daysPerYear}</p>
          </div>
        </div>
      )}

      {showStaffBreakdown && (
        <div className="bg-card p-8 rounded-2xl border border-border shadow-md">
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-3">
            <Users size={24} className="text-primary" />
            {labels.staffBreakdownTitle} ({labels.totalLabel}: {profile.totalStaff} {labels.staffUnit})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {staffCategories.map((category, idx) => {
              const Icon = category.icon;

              return (
                <div
                  key={idx}
                  className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${category.card}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${category.badge} ${category.accent} ring-1 ring-white/70 shadow-sm`}
                    >
                      <Icon size={20} />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{category.label}</p>
                      <p className="text-3xl font-bold text-foreground">{category.count}</p>
                    </div>
                  </div>
                  <ul className={`mt-5 space-y-2 text-xs font-medium text-muted-foreground list-disc pl-5 ${category.marker}`}>
                    {category.details.map((detail, i) => (
                      <li key={i} className="leading-relaxed">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showSummary && (
        <>
          {/* Operations Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-2xl border border-border shadow-md">
              <h4 className="font-bold text-foreground mb-6 flex items-center gap-2">
                <Clock size={20} className="text-primary" />
                {labels.operationsSchedule}
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-secondary rounded-lg border border-border">
                  <span className="font-semibold text-foreground">{labels.operatingHours}</span>
                  <span className="text-primary font-bold">{profile.operatingHours}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-secondary rounded-lg border border-border">
                  <span className="font-semibold text-foreground">{labels.operatingDaysPerYear}</span>
                  <span className="text-primary font-bold">{profile.operatingDays} {labels.daysPerYear.toLowerCase()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-secondary rounded-lg border border-border">
                  <span className="font-semibold text-foreground">{labels.mealsPerSchool}</span>
                  <span className="text-primary font-bold">{labels.averageLabel}: {profile.mealsPerSchool.average}</span>
                </div>
                <div className="p-4 bg-secondary rounded-lg border border-border text-sm text-muted-foreground">
                  <p className="mb-2">{labels.rangeLabel}: {profile.mealsPerSchool.min} - {profile.mealsPerSchool.max} {labels.mealsPerSchoolUnit}</p>
                  <p className="text-xs">{labels.rangeNote}</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-md">
              <h4 className="font-bold text-foreground mb-6 flex items-center gap-2">
                <AlertCircle size={20} className="text-primary" />
                {labels.facilitiesTitle}
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-secondary rounded-lg border border-border">
                  <span className="font-semibold text-foreground">{labels.equipmentUnits}</span>
                  <span className="text-primary font-bold">{profile.equipmentCount} {labels.equipmentUnitSuffix}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-secondary rounded-lg border border-border">
                  <span className="font-semibold text-foreground">{labels.storageCapacity}</span>
                  <span className="text-primary font-bold">{profile.storageCapacity}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-secondary rounded-lg border border-border">
                  <span className="font-semibold text-foreground">{labels.foodSafetyStandard}</span>
                  <span className="text-primary font-bold text-sm">{profile.foodSafetyCertification}</span>
                </div>
                <div className="p-4 bg-secondary rounded-lg border border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{labels.certifications}</p>
                  <div className="flex gap-2 flex-wrap">
                    {labels.certificationLabels.map((label) => (
                      <span key={label} className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full">{label}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </>
      )}
    </div>
  );
}
