'use client';

import React, { useState } from 'react';
import { Star, Calendar, ChevronDown, Flame, BicepsFlexed, Wheat, Droplet } from 'lucide-react';

interface MenuComponent {
  category: string;
  items: string[];
  icon?: string;
}

interface MenuNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  percentages?: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface MenuDay {
  id: string;
  date: string;
  rating: number;
  photoCount: number;
  photo: string;
  nutrition?: MenuNutrition;
  components: MenuComponent[];
}

interface MenuHistoryProps {
  menus: MenuDay[];
  title?: string;
  subtitle?: string;
  onDateRangeChange?: (range: string) => void;
  language: 'en' | 'id';
}

const categoryIcons = {
  'Karbohidrat': '\u{1F35A}',
  'Protein': '\u{1F95A}',
  'Sayuran': '\u{1F96C}',
  'Buah': '\u{1F34E}',
  'Susu': '\u{1F95B}',
  'Carbohydrates': '\u{1F35A}',
  'Vegetables': '\u{1F96C}',
  'Fruit': '\u{1F34E}',
  'Milk': '\u{1F95B}',
};

export const MenuHistory: React.FC<MenuHistoryProps> = ({
  menus,
  title,
  subtitle,
  onDateRangeChange,
  language,
}) => {
  const [selectedRange, setSelectedRange] = useState('30');
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const labels = language === 'id'
    ? {
        title: 'Testimonial Penerima Manfaat',
        subtitle: 'Kisah nyata dari para penerima manfaat program',
        lastDays: 'hari terakhir',
        days: 'hari',
        photos: 'foto',
        menuComponents: 'Komponen Menu',
      }
    : {
        title: 'Beneficiary Testimonial',
        subtitle: 'First-hand stories from our program beneficiaries',
        lastDays: 'last days',
        days: 'days',
        photos: 'photos',
        menuComponents: 'Menu Components',
      };
  const nutritionLabels = language === 'id'
    ? {
        title: 'Nutrisi',
        calories: 'Kalori',
        protein: 'Protein',
        fat: 'Lemak',
        carbs: 'Karbohidrat',
        kcalUnit: 'kkal',
        gramUnit: 'g',
      }
    : {
        title: 'Nutrition',
        calories: 'Calories',
        protein: 'Protein',
        fat: 'Fat',
        carbs: 'Carbohydrates',
        kcalUnit: 'kcal',
        gramUnit: 'g',
      };

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    setIsRangeOpen(false);
    onDateRangeChange?.(range);
  };

  const headingTitle = title ?? labels.title;
  const headingSubtitle = subtitle ?? labels.subtitle;

  return (
    <div className="space-y-7 sm:space-y-9">
      {/* Header with Filter */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-4 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.45)] sm:p-5 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/40">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-700/20" />
        <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-amber-200/40 blur-2xl dark:bg-amber-600/20" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-primary-foreground shadow-[0_12px_30px_-18px_rgba(15,23,42,0.8)]">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground sm:text-lg">{headingTitle}</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">{headingSubtitle}</p>
            </div>
          </div>

          <div className="relative w-full sm:w-auto">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isRangeOpen}
              onClick={() => setIsRangeOpen((prev) => !prev)}
              className="flex w-full items-center justify-between gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-semibold text-foreground shadow-[0_12px_25px_-20px_rgba(15,23,42,0.7)] transition-all hover:-translate-y-0.5 hover:border-foreground/20 sm:w-auto"
            >
              {language === 'id' ? `${selectedRange} ${labels.lastDays}` : `Last ${selectedRange} ${labels.days}`}
              <ChevronDown size={16} />
            </button>
            <div
              className={`absolute left-0 mt-2 w-full rounded-2xl border border-border/60 bg-background/95 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.6)] backdrop-blur sm:left-auto sm:right-0 sm:w-36 ${
                isRangeOpen ? 'block' : 'hidden'
              }`}
              role="listbox"
            >
              {['7', '14', '30', '60'].map((range) => (
                <button
                  key={range}
                  onClick={() => handleRangeChange(range)}
                  className={`w-full px-4 py-2 text-left text-sm font-semibold transition-colors ${
                    selectedRange === range
                      ? 'bg-foreground text-primary-foreground'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  {language === 'id' ? `${range} ${labels.days}` : `${range} ${labels.days}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {menus.map((menu, index) => (
          <div
            key={menu.id}
            style={{ animationDelay: `${index * 80}ms` }}
            className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.6)] backdrop-blur transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 hover:-translate-y-1 hover:shadow-[0_35px_85px_-50px_rgba(15,23,42,0.75)]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {/* Photo Section */}
            <div className="relative h-44 overflow-hidden bg-secondary sm:h-52">
              <img
                src={menu.photo || "/placeholder.svg"}
                alt={menu.date}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
              <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-foreground shadow-lg backdrop-blur">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700">
                  {menu.photoCount}
                </span>
                {labels.photos}
              </div>
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/85 px-3 py-1 text-xs font-semibold text-foreground shadow-lg backdrop-blur">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                {menu.rating}
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-4 p-4 sm:space-y-5 sm:p-5">
              {/* Date */}
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground sm:text-base">{menu.date}</h4>
                <span className="rounded-full border border-border/70 bg-secondary/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {labels.menuComponents}
                </span>
              </div>

              <div
                className={
                  menu.nutrition
                    ? 'grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]'
                    : 'space-y-3'
                }
              >
                {/* Menu Components */}
                <div className="space-y-3">
                  <div className="space-y-3">
                    {menu.components.map((component, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {categoryIcons[component.category as keyof typeof categoryIcons] || '\u{1F37D}\u{FE0F}'}
                          </span>
                          <h5 className="flex-1 text-sm font-semibold text-foreground sm:text-[15px]">
                            {component.category}
                          </h5>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {component.items.map((item, itemIdx) => (
                            <span
                              key={itemIdx}
                              className="rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-[0_8px_18px_-15px_rgba(15,23,42,0.65)]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nutrition Summary */}
                {menu.nutrition && (
                  <div className="space-y-3 rounded-2xl border border-emerald-200/40 bg-gradient-to-br from-emerald-50/70 via-white to-sky-50/70 px-3 py-3 md:px-4 md:py-4 dark:border-emerald-900/40 dark:from-emerald-950/60 dark:via-slate-950 dark:to-sky-950/40">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      <Flame size={14} className="text-amber-500" />
                      <span>{nutritionLabels.title}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/80 px-2.5 py-2 shadow-sm">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
                          <Flame size={16} />
                        </div>
                        <div className="leading-tight">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            {nutritionLabels.calories}
                          </p>
                          <p className="text-lg font-extrabold text-foreground">
                            {menu.nutrition.calories} {nutritionLabels.kcalUnit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/80 px-2.5 py-2 shadow-sm">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                          <BicepsFlexed size={16} />
                        </div>
                        <div className="leading-tight">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            {nutritionLabels.protein}
                          </p>
                          <p className="text-lg font-extrabold text-foreground">
                            {menu.nutrition.protein}
                            {nutritionLabels.gramUnit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/80 px-2.5 py-2 shadow-sm">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/15 text-rose-600">
                          <Droplet size={16} />
                        </div>
                        <div className="leading-tight">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            {nutritionLabels.fat}
                          </p>
                          <p className="text-lg font-extrabold text-foreground">
                            {menu.nutrition.fat}
                            {nutritionLabels.gramUnit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/80 px-2.5 py-2 shadow-sm">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/15 text-sky-600">
                          <Wheat size={16} />
                        </div>
                        <div className="leading-tight">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            {nutritionLabels.carbs}
                          </p>
                          <p className="text-lg font-extrabold text-foreground">
                            {menu.nutrition.carbs}
                            {nutritionLabels.gramUnit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
