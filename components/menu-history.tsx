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
  title = 'Menu',
  onDateRangeChange,
  language,
}) => {
  const [selectedRange, setSelectedRange] = useState('30');
  const labels = language === 'id'
    ? { lastDays: 'hari terakhir', days: 'hari', photos: 'foto', menuComponents: 'Komponen Menu' }
    : { lastDays: 'last days', days: 'days', photos: 'photos', menuComponents: 'Menu Components' };
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
    onDateRangeChange?.(range);
  };

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="text-primary" size={20} />
          <h3 className="font-bold text-lg text-foreground">{title}</h3>
        </div>
        
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors text-foreground font-medium text-sm">
            {language === 'id' ? `${selectedRange} ${labels.lastDays}` : `Last ${selectedRange} ${labels.days}`}
            <ChevronDown size={16} />
          </button>
          <div className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-lg shadow-lg hidden hover:block z-10">
            {['7', '14', '30', '60'].map((range) => (
              <button
                key={range}
                onClick={() => handleRangeChange(range)}
                className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                  selectedRange === range
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                {language === 'id' ? `${range} ${labels.days}` : `${range} ${labels.days}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className="bg-card rounded-2xl border border-border overflow-hidden shadow-md hover:shadow-lg transition-all hover:border-primary/50 group"
          >
            {/* Photo Section */}
            <div className="relative overflow-hidden bg-secondary h-48">
              <img
                src={menu.photo || "/placeholder.svg"}
                alt={menu.date}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-foreground/80 text-primary-foreground px-3 py-1 rounded-lg text-xs font-bold">
                {language === 'id' ? `${menu.photoCount} ${labels.photos}` : `${menu.photoCount} ${labels.photos}`}
              </div>
              <div className="absolute top-3 right-3 bg-foreground/80 text-primary-foreground px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                {menu.rating}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-4">
              {/* Date */}
              <div>
                <h4 className="font-bold text-foreground text-base">{menu.date}</h4>
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
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    <span>{labels.menuComponents}</span>
                  </div>
                  <div className="space-y-3">
                    {menu.components.map((component, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {categoryIcons[component.category as keyof typeof categoryIcons] || '\u{1F37D}\u{FE0F}'}
                          </span>
                          <h5 className="font-bold text-sm text-foreground flex-1">
                            {component.category}
                          </h5>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {component.items.map((item, itemIdx) => (
                            <span
                              key={itemIdx}
                              className="text-xs bg-secondary px-2.5 py-1 rounded-full border border-border text-muted-foreground"
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
                  <div className="space-y-3 rounded-xl border border-primary/10 bg-primary/5 px-3 py-3 md:px-4 md:py-4">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      <Flame size={14} className="text-destructive" />
                      <span>{nutritionLabels.title}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/70 px-2.5 py-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                          <Flame size={16} />
                        </div>
                        <div className="leading-tight">
                          <p className="text-[11px] uppercase tracking-[0.12em] font-bold text-muted-foreground">
                            {nutritionLabels.calories}
                          </p>
                          <p className="text-lg font-extrabold text-foreground">
                            {menu.nutrition.calories} {nutritionLabels.kcalUnit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/70 px-2.5 py-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <BicepsFlexed size={16} />
                        </div>
                        <div className="leading-tight">
                          <p className="text-[11px] uppercase tracking-[0.12em] font-bold text-muted-foreground">
                            {nutritionLabels.protein}
                          </p>
                          <p className="text-lg font-extrabold text-foreground">
                            {menu.nutrition.protein}
                            {nutritionLabels.gramUnit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/70 px-2.5 py-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                          <Droplet size={16} />
                        </div>
                        <div className="leading-tight">
                          <p className="text-[11px] uppercase tracking-[0.12em] font-bold text-muted-foreground">
                            {nutritionLabels.fat}
                          </p>
                          <p className="text-lg font-extrabold text-foreground">
                            {menu.nutrition.fat}
                            {nutritionLabels.gramUnit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/70 px-2.5 py-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <Wheat size={16} />
                        </div>
                        <div className="leading-tight">
                          <p className="text-[11px] uppercase tracking-[0.12em] font-bold text-muted-foreground">
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
