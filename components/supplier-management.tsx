'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Apple, Beef, Flame, Milk, Salad, Tag, Truck, Wheat } from 'lucide-react';

interface SupplierLink {
  name: string;
  href: string;
}

interface SupplierItem {
  id: string;
  name: string | { en: string; id: string };
  image?: string;
  quantity: number;
  unit: string;
  supplier: string | SupplierLink;
  region: string;
  distributionFrequencyPerWeek: number;
  price: string;
  category?: string;
}

interface SupplierManagementProps {
  items: SupplierItem[];
  title?: string;
  language: 'en' | 'id';
}

type IconType = React.ComponentType<{ size?: number; className?: string }>;

export function SupplierManagement({ items, title = 'Supplier Management', language }: SupplierManagementProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const labels = language === 'id'
    ? {
        categories: 'Kategori',
        all: 'Semua',
        items: 'Item',
        suppliers: 'Pemasok',
        item: 'Item',
        quantity: 'Jumlah',
        supplier: 'Pemasok',
        region: 'Wilayah',
        categoryLabels: {
          protein: 'Protein',
          vegetables: 'Sayuran',
          carbohydrates: 'Karbohidrat',
          fruits: 'Buah-buahan',
          legumes: 'Kacang-kacangan',
          spices: 'Rempah',
          milk: 'Susu',
          other: 'Lainnya',
        },
        frequencySuffix: 'x/minggu',
      }
    : {
        categories: 'Categories',
        all: 'All',
        items: 'Items',
        suppliers: 'Suppliers',
        item: 'Item',
        quantity: 'Quantity',
        supplier: 'Supplier',
        region: 'Region',
        categoryLabels: {
          protein: 'Protein',
          vegetables: 'Vegetables',
          carbohydrates: 'Carbohydrates',
          fruits: 'Fruits',
          legumes: 'Legumes',
          spices: 'Spices',
          milk: 'Milk',
          other: 'Other',
        },
        frequencySuffix: 'x/week',
      };

  const resolveCategory = (category?: string) => category || 'other';
  const baseCategories = ['protein', 'vegetables', 'carbohydrates', 'fruits', 'legumes', 'spices', 'milk', 'other'];
  const categories = Array.from(new Set([...baseCategories, ...items.map(item => resolveCategory(item.category))]));
  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => resolveCategory(item.category) === selectedCategory);
  const categoryIconMap: Record<string, IconType> = {
    all: Tag,
    protein: Beef,
    vegetables: Salad,
    carbohydrates: Wheat,
    fruits: Apple,
    legumes: Wheat,
    spices: Flame,
    milk: Milk,
    other: Tag,
  };
  const orderedCategories = ['all', ...categories.filter((cat) => cat !== 'all')];
  const categoryButtons = orderedCategories.map((cat) => {
    const CategoryIcon = categoryIconMap[cat] ?? Tag;
    const categoryLabel = cat === 'all'
      ? labels.all
      : labels.categoryLabels[cat as keyof typeof labels.categoryLabels] || cat;
    return (
      <button
        key={cat}
        onClick={() => setSelectedCategory(cat)}
        className={`inline-flex min-h-[42px] min-w-[104px] flex-none items-center justify-center gap-1.5 whitespace-nowrap rounded-2xl border px-2.5 py-1.5 text-[11px] font-semibold transition-colors sm:min-w-[112px] sm:text-xs ${
          selectedCategory === cat
            ? 'border-primary bg-primary text-primary-foreground shadow-sm'
            : 'border-border bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground'
        }`}
      >
        <CategoryIcon size={12} className="shrink-0" />
        {categoryLabel}
      </button>
    );
  });

  return (
    <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
      <div className="p-6 border-b border-border bg-secondary/50">
        <h3 className="font-bold text-foreground text-base flex items-center gap-3 uppercase tracking-tight">
          <div className="p-2.5 bg-primary/15 rounded-lg text-primary"><Truck size={20} /></div> 
          {title}
        </h3>
      </div>

      {/* Category Filter */}
      <div className="p-6 border-b border-border bg-secondary/30 text-center">
        <p className="inline-flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Tag size={16} />
          </span>
          {labels.categories}
        </p>
        <div className="mx-auto flex w-full flex-nowrap items-center justify-center gap-1.5 overflow-x-auto pb-1">
          {categoryButtons}
        </div>
      </div>

      {/* Summary */}
      <div className="p-6 border-b border-border grid grid-cols-2 gap-4">
        <div className="bg-secondary p-4 rounded-lg border border-border text-center">
          <p className="text-2xl font-bold text-primary">{filteredItems.length}</p>
          <p className="text-xs font-semibold text-muted-foreground mt-1">{labels.items}</p>
        </div>
        <div className="bg-secondary p-4 rounded-lg border border-border text-center">
          <p className="text-2xl font-bold text-primary">{Array.from(new Set(filteredItems.map(i => (typeof i.supplier === 'string' ? i.supplier : i.supplier.name)))).length}</p>
          <p className="text-xs font-semibold text-muted-foreground mt-1">{labels.suppliers}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest bg-secondary border-b border-border">
              <th className="px-6 py-4">{labels.item}</th>
              <th className="px-6 py-4 text-center">{labels.quantity}</th>
              <th className="px-6 py-4">{labels.supplier}</th>
              <th className="px-6 py-4">{labels.region}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredItems.map((item) => {
              const itemName = typeof item.name === 'string' ? item.name : item.name[language];
              const categoryKey = resolveCategory(item.category);
              const categoryLabel = labels.categoryLabels[categoryKey as keyof typeof labels.categoryLabels] || categoryKey;
              const supplierName = typeof item.supplier === 'string' ? item.supplier : item.supplier.name;
              const supplierHref = typeof item.supplier === 'string' ? undefined : item.supplier.href;
              return (
                <tr key={item.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="h-11 w-11 rounded-full border border-border bg-secondary/60 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={itemName}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-muted-foreground">{itemName.slice(0, 2)}</span>
                        )}
                      </span>
                      <div>
                        <p className="font-bold text-foreground">{itemName}</p>
                        <p className="text-xs text-muted-foreground">{categoryLabel}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-foreground">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="px-6 py-4">
                    {supplierHref ? (
                      <Link
                        href={supplierHref}
                        className="inline-flex items-center px-2.5 py-1 bg-primary/15 text-primary rounded-full text-xs font-semibold transition hover:bg-primary/25"
                      >
                        {supplierName}
                      </Link>
                    ) : (
                      <span className="inline-block px-2.5 py-1 bg-primary/15 text-primary rounded-full text-xs font-semibold">
                        {supplierName}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-foreground">{item.region}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
