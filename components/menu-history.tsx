'use client';

import React, { useState } from 'react';
import { Star, Calendar, ChevronDown, Flame, BicepsFlexed, Wheat, Droplet } from 'lucide-react';

interface MenuComponent {
  category: string;
  items: string[];
  icon?: string;
  isMissing?: boolean;
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
  'Lauk': '\u{1F356}',
  'Pauk': '\u{1F37D}\u{FE0F}',
  'Sayuran': '\u{1F96C}',
  'Buah-Buahan': '\u{1F34E}',
  'Susu': '\u{1F95B}',
  'Carbohydrates': '\u{1F35A}',
  'Main Dish': '\u{1F356}',
  'Side Dish': '\u{1F37D}\u{FE0F}',
  'Fruit': '\u{1F34E}',
  'Vegetables': '\u{1F96C}',
  'Milk': '\u{1F95B}',
};

const FAT_ITEM_KEYWORDS = [
  'kacang',
  'peanut',
  'almond',
  'walnut',
  'cashew',
  'avocado',
  'alpukat',
  'santan',
  'coconut',
  'kelapa',
  'keju',
  'cheese',
  'butter',
  'mentega',
  'oil',
  'minyak',
];

const PROTEIN_ITEM_KEYWORDS = [
  'telur',
  'egg',
  'ayam',
  'chicken',
  'ikan',
  'fish',
  'daging',
  'meat',
  'beef',
  'tofu',
  'tahu',
  'tempe',
  'tempeh',
  'kacang',
  'beans',
];

const VEGETABLE_ITEM_KEYWORDS = [
  'sayur',
  'vegetable',
  'bayam',
  'spinach',
  'wortel',
  'carrot',
  'brokoli',
  'broccoli',
  'kangkung',
  'cabbage',
  'kol',
  'buncis',
  'long beans',
  'kacang panjang',
];

const FRUIT_ITEM_KEYWORDS = [
  'buah',
  'fruit',
  'apple',
  'apel',
  'banana',
  'pisang',
  'orange',
  'jeruk',
  'papaya',
  'mango',
  'mangga',
  'watermelon',
  'semangka',
];

const MILK_ITEM_KEYWORDS = [
  'susu',
  'milk',
  'yogurt',
  'yoghurt',
  'uht',
  'kedelai',
  'soy',
  'dairy',
];

const isCarbCategory = (category: string) => {
  const normalized = category.toLowerCase();
  return (
    normalized.includes('karbo') ||
    normalized.includes('carb') ||
    normalized.includes('staple') ||
    normalized.includes('makanan pokok')
  );
};

const isFatCategory = (category: string) => {
  const normalized = category.toLowerCase();
  return normalized.includes('lemak') || normalized.includes('fat');
};

const isProteinCategory = (category: string) => {
  const normalized = category.toLowerCase();
  return normalized.includes('protein') || normalized.includes('lauk') || normalized.includes('main dish');
};

const isVegetableCategory = (category: string) => {
  const normalized = category.toLowerCase();
  return normalized.includes('sayur') || normalized.includes('vegetable') || normalized.includes('veg');
};

const isFruitCategory = (category: string) => {
  const normalized = category.toLowerCase();
  return normalized.includes('buah') || normalized.includes('fruit');
};

const isMilkCategory = (category: string) => {
  const normalized = category.toLowerCase();
  return normalized.includes('susu') || normalized.includes('milk') || normalized.includes('dairy');
};

type FlatMenuEntry = {
  category: string;
  item: string;
  itemIndex: number;
};

const normalizeMenuComponents = (components: MenuComponent[], language: 'en' | 'id'): MenuComponent[] => {
  const carbLabel = language === 'id' ? 'Karbohidrat' : 'Carbohydrates';
  const mainDishLabel = language === 'id' ? 'Lauk' : 'Main Dish';
  const sideDishLabel = language === 'id' ? 'Pauk' : 'Side Dish';
  const vegetablesLabel = language === 'id' ? 'Sayuran' : 'Vegetables';
  const fruitLabel = language === 'id' ? 'Buah-Buahan' : 'Fruit';
  const milkLabel = language === 'id' ? 'Susu' : 'Milk';
  const emptyLabel = language === 'id' ? 'Belum ada data' : 'No data';

  const allEntries = components.flatMap((component) =>
    component.items.map((item, itemIndex) => ({
      category: component.category,
      item,
      itemIndex,
    })),
  );

  const usedItems = new Set<string>();
  const pickEntry = (matcher: (entry: FlatMenuEntry) => boolean) => {
    const found = allEntries.find((entry) => matcher(entry) && !usedItems.has(`${entry.category}-${entry.item}-${entry.itemIndex}`));
    if (found) {
      usedItems.add(`${found.category}-${found.item}-${found.itemIndex}`);
    }
    return found;
  };

  const carbEntry =
    pickEntry((entry) => isCarbCategory(entry.category)) ??
    pickEntry(() => true);

  const mainDishEntry =
    pickEntry((entry) => isProteinCategory(entry.category) && entry.itemIndex === 0) ??
    pickEntry((entry) => isProteinCategory(entry.category)) ??
    pickEntry((entry) => isFatCategory(entry.category)) ??
    pickEntry((entry) => {
      const normalizedItem = entry.item.toLowerCase();
      return PROTEIN_ITEM_KEYWORDS.some((keyword) => normalizedItem.includes(keyword));
    });

  const sideDishEntry =
    pickEntry((entry) => isProteinCategory(entry.category) && entry.itemIndex > 0) ??
    pickEntry((entry) => isFatCategory(entry.category)) ??
    pickEntry((entry) => {
      const normalizedItem = entry.item.toLowerCase();
      return FAT_ITEM_KEYWORDS.some((keyword) => normalizedItem.includes(keyword));
    });

  const vegetablesEntry =
    pickEntry((entry) => isVegetableCategory(entry.category)) ??
    pickEntry((entry) => {
      const normalizedItem = entry.item.toLowerCase();
      return VEGETABLE_ITEM_KEYWORDS.some((keyword) => normalizedItem.includes(keyword));
    });

  const fruitEntry =
    pickEntry((entry) => isFruitCategory(entry.category)) ??
    pickEntry((entry) => {
      const normalizedItem = entry.item.toLowerCase();
      return FRUIT_ITEM_KEYWORDS.some((keyword) => normalizedItem.includes(keyword));
    });

  const milkEntry =
    pickEntry((entry) => isMilkCategory(entry.category)) ??
    pickEntry((entry) => {
      const normalizedItem = entry.item.toLowerCase();
      return MILK_ITEM_KEYWORDS.some((keyword) => normalizedItem.includes(keyword));
    });

  return [
    { category: carbLabel, items: [carbEntry?.item ?? emptyLabel], isMissing: !carbEntry },
    { category: mainDishLabel, items: [mainDishEntry?.item ?? emptyLabel], isMissing: !mainDishEntry },
    { category: sideDishLabel, items: [sideDishEntry?.item ?? emptyLabel], isMissing: !sideDishEntry },
    { category: vegetablesLabel, items: [vegetablesEntry?.item ?? emptyLabel], isMissing: !vegetablesEntry },
    { category: fruitLabel, items: [fruitEntry?.item ?? emptyLabel], isMissing: !fruitEntry },
    { category: milkLabel, items: [milkEntry?.item ?? emptyLabel], isMissing: !milkEntry },
  ];
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
            className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card shadow-[0_2px_20px_-8px_rgba(15,23,42,0.12)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.2)] dark:shadow-[0_2px_20px_-8px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"
          >
            {/* Photo Section */}
            <div className="relative h-48 overflow-hidden sm:h-56">
              <img
                src={menu.photo || "/placeholder.svg"}
                alt={menu.date}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Photo count badge */}
              <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
                  {menu.photoCount}
                </span>
                {labels.photos}
              </div>

              {/* Rating badge */}
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/40 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                {menu.rating}
              </div>

              {/* Date overlay at bottom of image */}
              <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8 bg-gradient-to-t from-black/60 to-transparent">
                <h4 className="text-base font-bold text-white sm:text-lg drop-shadow-sm">{menu.date}</h4>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4 sm:p-5">
              <div className={`grid gap-4 ${menu.nutrition ? 'lg:grid-cols-2 lg:items-start' : ''}`}>
                {/* Menu Components */}
                <div className="space-y-3.5">
                  <span className="inline-block rounded-md border border-border/60 bg-secondary/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    {labels.menuComponents}
                  </span>

                  <div className="space-y-3">
                    {normalizeMenuComponents(menu.components, language).map((component, idx) => (
                      <div key={idx}>
                        <div className="mb-1.5 flex items-center gap-2">
                          <span className="text-base leading-none">
                            {categoryIcons[component.category as keyof typeof categoryIcons] || '\u{1F37D}\u{FE0F}'}
                          </span>
                          <h5 className="text-[13px] font-bold text-foreground">
                            {component.category}
                          </h5>
                        </div>
                        <div className="ml-7 flex flex-wrap gap-1.5">
                          {component.items.map((item, itemIdx) => (
                            <span
                              key={itemIdx}
                              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                                component.isMissing
                                  ? 'border-dashed border-border/50 bg-transparent text-muted-foreground/70'
                                  : 'border-border/50 bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary'
                              }`}
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
                  <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-slate-50 to-slate-100/50 p-3.5 dark:from-slate-900/60 dark:to-slate-800/30">
                    <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                      <Flame size={13} className="text-amber-500" />
                      <span>{nutritionLabels.title}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {/* Calories */}
                      <div className="flex items-center gap-3 rounded-xl border border-amber-200/50 bg-amber-50/60 px-3 py-2.5 dark:border-amber-900/30 dark:bg-amber-950/30">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
                          <Flame size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600/70 dark:text-amber-400/70">
                            {nutritionLabels.calories}
                          </p>
                          <p className="text-xl font-extrabold tabular-nums text-amber-700 dark:text-amber-400">
                            {menu.nutrition.calories}
                            <span className="ml-0.5 text-xs font-bold text-amber-600/60 dark:text-amber-400/60">{nutritionLabels.kcalUnit}</span>
                          </p>
                        </div>
                      </div>

                      {/* Protein */}
                      <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200/50 bg-emerald-50/60 px-3 py-2.5 dark:border-emerald-900/30 dark:bg-emerald-950/30">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600">
                          <BicepsFlexed size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/70">
                            {nutritionLabels.protein}
                          </p>
                          <p className="text-base font-extrabold tabular-nums text-emerald-700 dark:text-emerald-400">
                            {menu.nutrition.protein}
                            <span className="text-[10px] font-bold text-emerald-600/60 dark:text-emerald-400/60">{nutritionLabels.gramUnit}</span>
                          </p>
                        </div>
                      </div>

                      {/* Fat */}
                      <div className="flex items-center gap-2.5 rounded-xl border border-rose-200/50 bg-rose-50/60 px-3 py-2.5 dark:border-rose-900/30 dark:bg-rose-950/30">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600">
                          <Droplet size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-rose-600/70 dark:text-rose-400/70">
                            {nutritionLabels.fat}
                          </p>
                          <p className="text-base font-extrabold tabular-nums text-rose-700 dark:text-rose-400">
                            {menu.nutrition.fat}
                            <span className="text-[10px] font-bold text-rose-600/60 dark:text-rose-400/60">{nutritionLabels.gramUnit}</span>
                          </p>
                        </div>
                      </div>

                      {/* Carbs */}
                      <div className="flex items-center gap-2.5 rounded-xl border border-sky-200/50 bg-sky-50/60 px-3 py-2.5 dark:border-sky-900/30 dark:bg-sky-950/30">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600">
                          <Wheat size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-sky-600/70 dark:text-sky-400/70">
                            {nutritionLabels.carbs}
                          </p>
                          <p className="text-base font-extrabold tabular-nums text-sky-700 dark:text-sky-400">
                            {menu.nutrition.carbs}
                            <span className="text-[10px] font-bold text-sky-600/60 dark:text-sky-400/60">{nutritionLabels.gramUnit}</span>
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
