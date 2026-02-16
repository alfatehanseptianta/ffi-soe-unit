'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Store, Truck, Utensils, AlertTriangle, TrendingUp, ClipboardCheck, MapPin, DollarSign, CheckCircle2, Video, Navigation, MessageSquare, Globe, Info, ChevronDown, ChevronLeft, ChevronRight, UserPlus, Wheat, Baby, Flame, Zap, Heart, BookOpen, LineChart, Coins, GlobeIcon, Beef, BicepsFlexed, Droplet, Salad, Apple, Milk, Soup, School, Facebook, Instagram, Twitter, Music2, Clock, X, CalendarDays, BadgeCheck, Hospital } from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';
import { getGoogleMapsUrl } from '@/lib/utils';
import { Gallery } from '@/components/gallery';
import { MenuHistory } from '@/components/menu-history';
import { SchoolsDetail } from '@/components/schools-detail';
import { SupplierManagement } from '@/components/supplier-management';
import { TeamProfiles } from '@/components/team-profiles';
import { BeneficiaryCategories } from '@/components/beneficiary-categories';
import { SROIImpact } from '@/components/sroi-impact';
import { EconomicImpact } from '@/components/economic-impact';
import { FFIOrganizationProfile } from '@/components/ffi-organization-profile';
import { WFPOrganizationProfile } from '@/components/wfp-organization-profile';
import { FFILogo } from '@/components/ffi-logo';
import { operationalTeamProfiles } from '@/lib/operational-team-profiles';

type Language = 'en' | 'id';
type Localized<T> = { en: T; id: T };
type SchoolStatus = 'active' | 'delivered';
type FleetStatus = 'delivered' | 'onRoute';
type SchoolType = 'elementary' | 'juniorHigh' | 'seniorHigh';
type SupplierCategory = 'protein' | 'vegetables' | 'carbohydrates' | 'fruits' | 'legumes' | 'spices' | 'milk';
type TestimonialCategory =
  | 'all'
  | 'siswa'
  | 'orangtua'
  | 'supplier'
  | 'guru'
  | 'pekerja-sppg'
  | 'pemerintah-daerah'
  | 'lembaga-internasional';
type IconType = React.ComponentType<{ size?: number; className?: string }>;
type TheoryOfChangeItem = { text: string; icon: IconType };
type TheoryOfChangeAccent = { card: string; chip: string; icon: string };
type TheoryOfChangeLevel = {
  id: 'activities' | 'output' | 'outcome' | 'impact';
  label: string;
  accent: TheoryOfChangeAccent;
  items: TheoryOfChangeItem[];
};
type TheoryOfChangeCopy = {
  title: string;
  description: string[];
  levels: TheoryOfChangeLevel[];
  caption: string;
};

const partnerLogoPalette = [
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
];

const testimonialCategoryIcons: Record<TestimonialCategory, IconType> = {
  all: Info,
  siswa: School,
  orangtua: Heart,
  supplier: Store,
  guru: BookOpen,
  'pekerja-sppg': Utensils,
  'pemerintah-daerah': BadgeCheck,
  'lembaga-internasional': Globe,
};

const THEORY_OF_CHANGE_STYLES: Record<TheoryOfChangeLevel['id'], TheoryOfChangeAccent> = {
  activities: {
    card: 'from-amber-50 via-white to-amber-100 border-amber-100',
    chip: 'bg-amber-500/15 text-amber-700',
    icon: 'from-amber-500/35 via-amber-400/30 to-amber-200/40 text-amber-900',
  },
  output: {
    card: 'from-sky-50 via-white to-sky-100 border-sky-100',
    chip: 'bg-sky-500/15 text-sky-700',
    icon: 'from-sky-500/35 via-sky-400/30 to-sky-200/40 text-sky-900',
  },
  outcome: {
    card: 'from-emerald-50 via-white to-emerald-100 border-emerald-100',
    chip: 'bg-emerald-500/15 text-emerald-700',
    icon: 'from-emerald-500/35 via-emerald-400/30 to-emerald-200/40 text-emerald-900',
  },
  impact: {
    card: 'from-purple-50 via-white to-purple-100 border-purple-100',
    chip: 'bg-purple-500/15 text-purple-700',
    icon: 'from-purple-500/35 via-purple-400/30 to-purple-200/40 text-purple-900',
  },
};

const getPartnerInitials = (name: string) => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0][0] ?? '';
  const second = parts.length > 1 ? parts[1][0] : parts[0][1] ?? '';
  return `${first}${second}`.toUpperCase();
};

const MOCK_SPPG_DATA = [
  {
    id: 'FFI-SOE-01',
    name: {
      en: 'FFI Central Soe Unit',
      id: 'Unit Pusat FFI Soe',
    },
    region: {
      en: 'Soe City, South Central Timor',
      id: 'Kota Soe, Timor Tengah Selatan',
    },
    address: {
      en: 'SD 01 Nunumeu (Jln. Kakatua No. 57, Soe City District, South Central Timor Regency, East Nusa Tenggara Province)',
      id: 'SD 01 Nunumeu (Jln. Kakatua Nomor 57, Kec. Kota Soe, Kab. Timor Tengah Selatan, Prov. Nusa Tenggara Timur)',
    },
    managedBy: {
      en: 'Future Farmers of Indonesia, Badan Gizi Nasional, and World Food Programme',
      id: 'Future Farmers of Indonesia, Badan Gizi Nasional, dan World Food Programme',
    },
    supportedBy: { en: 'World Food Programme (WFP)', id: 'Program Pangan Dunia (WFP)' },
    costPerPortion: 15500,
    localSourcing: 88,
    healthScore: 97,
    staffCount: { present: 18, total: 20 },
    wasteRate: 1.2,
    feedbackScore: 4.9,
    deliveryProgress: {
      target: 2900,
      cooked: 0,
      inDelivery: 0,
      received: 0,
    },
    dailyMenu: {
      en: {
        name: "Timor Smoked Beef (Se'i) with Bose Corn & Moringa Soup",
        photo: '/gallery/menu-showcase.jpg',
        nutrition: {
          Calories: '740 kcal',
          Protein: '32g',
          Fat: '18g',
          Carbs: '85g',
          Vitamins: 'Vit A, C & Iron',
        },
        components: {
          Staple: 'xxx',
          'Main Dish': 'xx',
          'Side Dish': 'xxx',
          Vegetable: 'xxx',
          Fruit: 'xxx',
          Milk: 'xxx',
        },
      },
      id: {
        name: "Daging Se'i Timor dengan Jagung Bose & Sup Kelor",
        photo: '/gallery/menu-showcase.jpg',
        nutrition: {
          Kalori: '740 kkal',
          Protein: '32g',
          Lemak: '18g',
          Karbohidrat: '85g',
          Vitamin: 'Vit A, C & Zat Besi',
        },
        components: {
          'Makanan Pokok': 'xxx',
          Lauk: 'xx',
          Pauk: 'xxx',
          Sayur: 'xxx',
          Buah: 'xxx',
          Susu: 'xxx',
        },
      },
    },
    cba: {
      en: {
        sroi: '1 : 3.8',
        healthcareSavings: 'Rp 1.2B / Year',
        localEconomicBoost: 'Rp 850M / Month',
        productivityIndex: '+24% Concentration',
      },
      id: {
        sroi: '1 : 3,8',
        healthcareSavings: 'Rp 1,2 Miliar / Tahun',
        localEconomicBoost: 'Rp 850 Juta / Bulan',
        productivityIndex: '+24% Konsentrasi',
      },
    },
    sdgs: {
      en: [
        { id: 1, title: 'No Poverty', metric: '92 Workers, +45% Income', color: 'bg-[#E5243B]', desc: 'Economic opportunities for 92 workers, average income increase 45%.' },
        { id: 2, title: 'Zero Hunger', metric: '1,750 Children Secured', color: 'bg-[#E5243B]', desc: 'Direct reduction of food insecurity and malnutrition in TTS region.' },
        { id: 3, title: 'Good Health', metric: '-15% Stunting Probability', color: 'bg-[#4C9F38]', desc: 'Improved micro-nutrient intake through fortified local menus.' },
        { id: 4, title: 'Quality Education', metric: '98% School Attendance', color: 'bg-[#C5192D]', desc: 'Providing the cognitive fuel needed for effective classroom learning.' },
        { id: 5, title: 'Gender Equality', metric: '60% Women Workforce', color: 'bg-[#FF3A21]', desc: 'Equal beneficiary distribution, women comprise 60% of workforce.' },
        { id: 8, title: 'Decent Work', metric: '45 Local Farmers Engaged', color: 'bg-[#A21942]', desc: 'Supporting local economy by sourcing 88% of ingredients from Soe farmers.' },
        { id: 12, title: 'Responsible Prod.', metric: '1.2% Minimal Food Waste', color: 'bg-[#FB9D24]', desc: 'Optimized supply chain to ensure zero-waste circular production.' },
      ],
      id: [
        { id: 1, title: 'Tanpa Kemiskinan', metric: '92 Pekerja, +45% Pendapatan', color: 'bg-[#E5243B]', desc: 'Peluang ekonomi bagi 92 pekerja, kenaikan pendapatan rata-rata 45%.' },
        { id: 2, title: 'Tanpa Kelaparan', metric: '1.750 Anak Terpenuhi', color: 'bg-[#E5243B]', desc: 'Pengurangan langsung ketidakamanan pangan dan malnutrisi di wilayah TTS.' },
        { id: 3, title: 'Kesehatan yang Baik', metric: '-15% Risiko Stunting', color: 'bg-[#4C9F38]', desc: 'Peningkatan asupan mikronutrien melalui menu lokal yang diperkaya.' },
        { id: 4, title: 'Pendidikan Berkualitas', metric: '98% Kehadiran Sekolah', color: 'bg-[#C5192D]', desc: 'Memberikan asupan kognitif yang dibutuhkan untuk pembelajaran efektif di kelas.' },
        { id: 5, title: 'Kesetaraan Gender', metric: '60% Tenaga Kerja Perempuan', color: 'bg-[#FF3A21]', desc: 'Distribusi penerima manfaat setara, perempuan 60% tenaga kerja.' },
        { id: 8, title: 'Pekerjaan Layak', metric: '45 Petani Lokal Terlibat', color: 'bg-[#A21942]', desc: 'Mendukung ekonomi lokal dengan 88% bahan berasal dari petani Soe.' },
        { id: 12, title: 'Produksi Bertanggung Jawab', metric: '1,2% Minim Sisa Makanan', color: 'bg-[#FB9D24]', desc: 'Rantai pasok dioptimalkan untuk produksi sirkular minim limbah.' },
      ],
    },
    cctvFeeds: {
      en: ['Main Kitchen', 'Main Warehouse', 'Packing Line', 'Loading Bay'],
      id: ['Dapur Utama', 'Gudang Utama', 'Lini Pengemasan', 'Area Muat'],
    },
    fleet: [
      { id: 'T01', plate: 'DH 1234 AB', driver: 'Petrus Kase', route: ['Unit', 'SDN Inpres Soe', 'SMPN 1 Soe'], currentPos: 'SDN Inpres Soe', status: 'delivered' as FleetStatus },
      { id: 'T02', plate: 'DH 5678 CD', driver: 'Yohanis Nope', route: ['Unit', 'SD Katolik Soe'], currentPos: 'En Route', status: 'onRoute' as FleetStatus },
    ],
    schools: [
      { id: 'SCH-01', name: 'SD 01 Nunumeu', type: 'elementary' as SchoolType, students: 280, beneficiaries: 280, target: 280, cooked: 0, inDelivery: 0, received: 0, teachers: 12, scholarshipPercentage: 45, distance: '3.2 km', travelTimeMinutes: 12, status: 'active' as SchoolStatus, contact: { en: 'Mrs. Maria', id: 'Ibu Maria' }, rating: 5 },
      { id: 'SCH-02', name: 'SD Katolik Soe', type: 'elementary' as SchoolType, students: 310, beneficiaries: 290, target: 290, cooked: 0, inDelivery: 0, received: 0, teachers: 14, scholarshipPercentage: 38, distance: '4.7 km', travelTimeMinutes: 18, status: 'active' as SchoolStatus, contact: { en: 'Mr. Markus', id: 'Bapak Markus' }, rating: null },
      { id: 'SCH-03', name: 'SMPN 1 Soe', type: 'juniorHigh' as SchoolType, students: 540, beneficiaries: 520, target: 520, cooked: 0, inDelivery: 0, received: 0, teachers: 26, scholarshipPercentage: 52, distance: '2.8 km', travelTimeMinutes: 10, status: 'active' as SchoolStatus, contact: { en: 'Mrs. Linda', id: 'Ibu Linda' }, rating: 5 },
      { id: 'SCH-04', name: 'SMAN 1 Soe', type: 'seniorHigh' as SchoolType, students: 620, beneficiaries: 600, target: 600, cooked: 0, inDelivery: 0, received: 0, teachers: 30, scholarshipPercentage: 41, distance: '5.1 km', travelTimeMinutes: 15, status: 'active' as SchoolStatus, contact: { en: 'Mr. Anton', id: 'Bapak Anton' }, rating: 4 },
    ],
    menuHistory: {
      en: [
        {
          id: '1',
          date: 'Sunday, October 5, 2025',
          rating: 5,
          reviewCount: 1,
          photoCount: 2,
          photo: '/gallery/children-meals.jpg',
          nutrition: { calories: 720, protein: 28, carbs: 78, fat: 16, fiber: 6, percentages: { protein: 15, carbs: 43, fat: 20 } },
          components: [
            { category: 'Carbohydrates', items: ['Steamed Rice 150g', 'Whole Wheat Bread 50g'] },
            { category: 'Protein', items: ['Boiled Egg 55g', 'Smoked Fish 60g'] },
            { category: 'Vegetables', items: ['Fresh Spinach 40g', 'Boiled Carrot 50g'] },
            { category: 'Fruit', items: ['Banana 100g', 'Papaya 80g'] },
            { category: 'Milk', items: ['UHT Milk 200ml'] },
          ],
        },
        {
          id: '2',
          date: 'Saturday, October 4, 2025',
          rating: 5,
          reviewCount: 1,
          photoCount: 2,
          photo: '/gallery/kitchen-1.jpg',
          nutrition: { calories: 680, protein: 24, carbs: 82, fat: 14, fiber: 8, percentages: { protein: 14, carbs: 48, fat: 18 } },
          components: [
            { category: 'Carbohydrates', items: ['Corn Rice 150g', 'Baked Sweet Potato 80g'] },
            { category: 'Protein', items: ['Fried Tofu 100g', 'Boiled Tempeh 70g'] },
            { category: 'Vegetables', items: ['Broccoli 60g', 'Long Beans 50g'] },
            { category: 'Fruit', items: ['Mango 100g', 'Pineapple 80g'] },
            { category: 'Milk', items: ['Yogurt 150g'] },
          ],
        },
        {
          id: '3',
          date: 'Wednesday, September 24, 2025',
          rating: 4.2,
          reviewCount: 1,
          photoCount: 3,
          photo: '/gallery/farm-1.jpg',
          nutrition: { calories: 750, protein: 32, carbs: 85, fat: 18, fiber: 7, percentages: { protein: 17, carbs: 45, fat: 21 } },
          components: [
            { category: 'Carbohydrates', items: ['Bose Corn 120g', 'Boiled Potatoes 100g'] },
            { category: 'Protein', items: ["Se'i Beef 65g", 'Mung Beans 60g'] },
            { category: 'Vegetables', items: ['Moringa Soup 100ml', 'Chayote 70g'] },
            { category: 'Fruit', items: ['Dragon Fruit 90g', 'Orange 80g'] },
            { category: 'Milk', items: ['Sweetened Condensed Milk 50ml'] },
          ],
        },
        {
          id: '4',
          date: 'Thursday, September 18, 2025',
          rating: 4.6,
          reviewCount: 1,
          photoCount: 2,
          photo: '/gallery/farm-2.jpg',
          nutrition: { calories: 710, protein: 30, carbs: 80, fat: 17, fiber: 6, percentages: { protein: 16, carbs: 45, fat: 21 } },
          components: [
            { category: 'Carbohydrates', items: ['Corn Bread 100g', 'Brown Rice 120g'] },
            { category: 'Protein', items: ['Pomfret Fish 70g', 'Mixed Beans 50g'] },
            { category: 'Vegetables', items: ['Vegetable Soup 100ml', 'Stir-Fried Water Spinach 60g'] },
            { category: 'Fruit', items: ['Watermelon 100g', 'Avocado 50g'] },
            { category: 'Milk', items: ['Fresh Milk 200ml'] },
          ],
        },
        {
          id: '5',
          date: 'Wednesday, September 17, 2025',
          rating: 4.8,
          reviewCount: 1,
          photoCount: 2,
          photo: '/gallery/children-meals.jpg',
          nutrition: { calories: 700, protein: 29, carbs: 82, fat: 15, fiber: 7, percentages: { protein: 16, carbs: 46, fat: 19 } },
          components: [
            { category: 'Carbohydrates', items: ['Steamed Cassava 120g', 'Corn Bread 80g'] },
            { category: 'Protein', items: ['Grilled Chicken 70g', 'Red Beans 50g'] },
            { category: 'Vegetables', items: ['Sauteed Papaya Leaves 60g', 'Pumpkin Soup 100ml'] },
            { category: 'Fruit', items: ['Guava 90g', 'Pineapple 80g'] },
            { category: 'Milk', items: ['Fresh Milk 200ml'] },
          ],
        },
        {
          id: '6',
          date: 'Tuesday, September 16, 2025',
          rating: 4.7,
          reviewCount: 1,
          photoCount: 2,
          photo: '/gallery/kitchen-1.jpg',
          nutrition: { calories: 690, protein: 27, carbs: 84, fat: 14, fiber: 7, percentages: { protein: 15, carbs: 47, fat: 18 } },
          components: [
            { category: 'Carbohydrates', items: ['Rice Porridge 180g', 'Sweet Potato 70g'] },
            { category: 'Protein', items: ['Fried Tempeh 80g', 'Boiled Egg 50g'] },
            { category: 'Vegetables', items: ['Stir-fried Cabbage 60g', 'Carrot Soup 100ml'] },
            { category: 'Fruit', items: ['Apple 80g', 'Papaya 90g'] },
            { category: 'Milk', items: ['Soy Milk 200ml'] },
          ],
        },
        {
          id: '7',
          date: 'Monday, September 15, 2025',
          rating: 4.5,
          reviewCount: 1,
          photoCount: 2,
          photo: '/gallery/farm-1.jpg',
          nutrition: { calories: 705, protein: 28, carbs: 80, fat: 16, fiber: 6, percentages: { protein: 16, carbs: 45, fat: 20 } },
          components: [
            { category: 'Carbohydrates', items: ['Brown Rice 130g', 'Cassava 80g'] },
            { category: 'Protein', items: ['Grilled Fish 70g', 'Peanuts 40g'] },
            { category: 'Vegetables', items: ['Green Bean Stir Fry 60g', 'Spinach Soup 100ml'] },
            { category: 'Fruit', items: ['Watermelon 100g', 'Banana 90g'] },
            { category: 'Milk', items: ['UHT Milk 200ml'] },
          ],
        },
        {
          id: '8',
          date: 'Sunday, September 14, 2025',
          rating: 4.3,
          reviewCount: 1,
          photoCount: 2,
          photo: '/gallery/farm-2.jpg',
          nutrition: { calories: 680, protein: 26, carbs: 86, fat: 13, fiber: 6, percentages: { protein: 15, carbs: 48, fat: 17 } },
          components: [
            { category: 'Carbohydrates', items: ['Corn Rice 150g', 'Pumpkin 80g'] },
            { category: 'Protein', items: ['Chicken Satay 60g', 'Tofu 70g'] },
            { category: 'Vegetables', items: ['Moringa Leaves 60g', 'Chayote Soup 100ml'] },
            { category: 'Fruit', items: ['Orange 80g', 'Melon 100g'] },
            { category: 'Milk', items: ['Yogurt 150g'] },
          ],
        },
      ],
      id: [
        {
          id: '1',
          date: 'Minggu, 5 Oktober 2025',
          rating: 5,
          reviewCount: 1,
          photoCount: 2,
          photo: '/gallery/children-meals.jpg',
          nutrition: { calories: 720, protein: 28, carbs: 78, fat: 16, fiber: 6, percentages: { protein: 15, carbs: 43, fat: 20 } },
          components: [
            { category: 'Karbohidrat', items: ['Nasi Putih 150g', 'Roti Gandum 50g'] },
            { category: 'Protein', items: ['Telur Rebus 55g', 'Ikan Asap 60g'] },
            { category: 'Sayuran', items: ['Bayam Segar 40g', 'Wortel Rebus 50g'] },
            { category: 'Buah', items: ['Pisang 100g', 'Papaya 80g'] },
            { category: 'Susu', items: ['Susu UHT 200ml'] },
          ],
        },
        {
          id: '2',
          date: 'Sabtu, 4 Oktober 2025',
          rating: 5,
          reviewCount: 1,
          photoCount: 2,
          photo: '/gallery/kitchen-1.jpg',
          nutrition: { calories: 680, protein: 24, carbs: 82, fat: 14, fiber: 8, percentages: { protein: 14, carbs: 48, fat: 18 } },
          components: [
            { category: 'Karbohidrat', items: ['Nasi Jagung 150g', 'Ubi Panggang 80g'] },
            { category: 'Protein', items: ['Tahu Goreng 100g', 'Tempe Rebus 70g'] },
            { category: 'Sayuran', items: ['Brokoli 60g', 'Kacang Panjang 50g'] },
            { category: 'Buah', items: ['Mangga 100g', 'Nanas 80g'] },
            { category: 'Susu', items: ['Yogurt 150g'] },
          ],
        },
        {
          id: '3',
          date: 'Rabu, 24 September 2025',
          rating: 4.2,
          reviewCount: 1,
          photoCount: 3,
          photo: '/gallery/farm-1.jpg',
          nutrition: { calories: 750, protein: 32, carbs: 85, fat: 18, fiber: 7, percentages: { protein: 17, carbs: 45, fat: 21 } },
          components: [
            { category: 'Karbohidrat', items: ['Bose Corn 120g', 'Kentang Rebus 100g'] },
            { category: 'Protein', items: ["Daging Sapi Se'i 65g", 'Kacang Hijau 60g'] },
            { category: 'Sayuran', items: ['Moringa Soup 100ml', 'Labu Siam 70g'] },
            { category: 'Buah', items: ['Buah Naga 90g', 'Jeruk 80g'] },
            { category: 'Susu', items: ['Susu Kental 50ml'] },
          ],
        },
        {
          id: '4',
          date: 'Kamis, 18 September 2025',
          rating: 4.6,
          reviewCount: 1,
          photoCount: 2,
          photo: '/gallery/farm-2.jpg',
          nutrition: { calories: 710, protein: 30, carbs: 80, fat: 17, fiber: 6, percentages: { protein: 16, carbs: 45, fat: 21 } },
          components: [
            { category: 'Karbohidrat', items: ['Roti Jagung 100g', 'Beras Merah 120g'] },
            { category: 'Protein', items: ['Ikan Bawal 70g', 'Kacang-kacangan 50g'] },
            { category: 'Sayuran', items: ['Sop Sayuran 100ml', 'Tumis Kangkung 60g'] },
            { category: 'Buah', items: ['Semangka 100g', 'Alpukat 50g'] },
            { category: 'Susu', items: ['Susu Murni 200ml'] },
          ],
        },
        {
          id: '5',
          date: 'Rabu, 17 September 2025',
          rating: 4.8,
          reviewCount: 1,
          photoCount: 2,
          photo: '/gallery/children-meals.jpg',
          nutrition: { calories: 700, protein: 29, carbs: 82, fat: 15, fiber: 7, percentages: { protein: 16, carbs: 46, fat: 19 } },
          components: [
            { category: 'Karbohidrat', items: ['Singkong Kukus 120g', 'Roti Jagung 80g'] },
            { category: 'Protein', items: ['Ayam Panggang 70g', 'Kacang Merah 50g'] },
            { category: 'Sayuran', items: ['Tumis Daun Pepaya 60g', 'Sup Labu 100ml'] },
            { category: 'Buah', items: ['Jambu Biji 90g', 'Nanas 80g'] },
            { category: 'Susu', items: ['Susu Segar 200ml'] },
          ],
        },
        {
          id: '6',
          date: 'Selasa, 16 September 2025',
          rating: 4.7,
          reviewCount: 1,
          photoCount: 2,
          photo: '/gallery/kitchen-1.jpg',
          nutrition: { calories: 690, protein: 27, carbs: 84, fat: 14, fiber: 7, percentages: { protein: 15, carbs: 47, fat: 18 } },
          components: [
            { category: 'Karbohidrat', items: ['Bubur Nasi 180g', 'Ubi Manis 70g'] },
            { category: 'Protein', items: ['Tempe Goreng 80g', 'Telur Rebus 50g'] },
            { category: 'Sayuran', items: ['Tumis Kol 60g', 'Sup Wortel 100ml'] },
            { category: 'Buah', items: ['Apel 80g', 'Papaya 90g'] },
            { category: 'Susu', items: ['Susu Kedelai 200ml'] },
          ],
        },
        {
          id: '7',
          date: 'Senin, 15 September 2025',
          rating: 4.5,
          reviewCount: 1,
          photoCount: 2,
          photo: '/gallery/farm-1.jpg',
          nutrition: { calories: 705, protein: 28, carbs: 80, fat: 16, fiber: 6, percentages: { protein: 16, carbs: 45, fat: 20 } },
          components: [
            { category: 'Karbohidrat', items: ['Beras Merah 130g', 'Singkong 80g'] },
            { category: 'Protein', items: ['Ikan Bakar 70g', 'Kacang Tanah 40g'] },
            { category: 'Sayuran', items: ['Tumis Buncis 60g', 'Sup Bayam 100ml'] },
            { category: 'Buah', items: ['Semangka 100g', 'Pisang 90g'] },
            { category: 'Susu', items: ['Susu UHT 200ml'] },
          ],
        },
        {
          id: '8',
          date: 'Minggu, 14 September 2025',
          rating: 4.3,
          reviewCount: 1,
          photoCount: 2,
          photo: '/gallery/farm-2.jpg',
          nutrition: { calories: 680, protein: 26, carbs: 86, fat: 13, fiber: 6, percentages: { protein: 15, carbs: 48, fat: 17 } },
          components: [
            { category: 'Karbohidrat', items: ['Nasi Jagung 150g', 'Labu 80g'] },
            { category: 'Protein', items: ['Sate Ayam 60g', 'Tahu 70g'] },
            { category: 'Sayuran', items: ['Daun Kelor 60g', 'Sup Labu Siam 100ml'] },
            { category: 'Buah', items: ['Jeruk 80g', 'Melon 100g'] },
            { category: 'Susu', items: ['Yogurt 150g'] },
          ],
        },
      ],
    },
    suppliers: [
      { id: 'S01', name: { en: 'Chicken Fillet', id: 'Ayam Filet' }, image: '/gallery/children-meals.jpg', quantity: 110, unit: 'Kg', supplier: { name: 'Koperasi Unggas Soe', href: '/suppliers/koperasi-unggas-soe' }, region: 'Kota Soe', distributionFrequencyPerWeek: 1, price: 'Rp65.000', category: 'protein' as SupplierCategory },
      { id: 'S02', name: { en: 'Iling Chicken', id: 'Ayam Iling' }, image: '/gallery/kitchen-1.jpg', quantity: 110, unit: 'Kg', supplier: { name: 'Peternak Ayam Amanuban', href: '/suppliers/peternak-ayam-amanuban' }, region: 'Amanuban Barat', distributionFrequencyPerWeek: 1, price: 'Rp68.000', category: 'protein' as SupplierCategory },
      { id: 'S03', name: { en: 'Beef Slices', id: 'Daging Sapi Iris' }, image: '/gallery/menu-showcase.jpg', quantity: 100, unit: 'Kg', supplier: { name: 'Kelompok Ternak Sapi TTS', href: '/suppliers/kelompok-ternak-sapi-tts' }, region: 'Mollo Selatan', distributionFrequencyPerWeek: 1, price: 'Rp140.000', category: 'protein' as SupplierCategory },
      { id: 'S04', name: { en: 'Broccoli', id: 'Brokoli' }, image: '/gallery/farm-1.jpg', quantity: 25, unit: 'Kg', supplier: { name: 'Kebun Sayur Oinlasi', href: '/suppliers/kebun-sayur-oinlasi' }, region: 'Oinlasi', distributionFrequencyPerWeek: 2, price: 'Rp23.000', category: 'vegetables' as SupplierCategory },
      { id: 'S05', name: { en: 'Cauliflower', id: 'Kembang Kol' }, image: '/gallery/farm-2.jpg', quantity: 50, unit: 'Kg', supplier: { name: 'Kebun Sayur Kapan', href: '/suppliers/kebun-sayur-kapan' }, region: 'Kapan', distributionFrequencyPerWeek: 2, price: 'Rp13.000', category: 'vegetables' as SupplierCategory },
      { id: 'S06', name: { en: 'Carrots', id: 'Wortel' }, image: '/gallery/farm-1.jpg', quantity: 160, unit: 'Kg', supplier: { name: 'Kebun Hortikultura Niki Niki', href: '/suppliers/kebun-hortikultura-niki-niki' }, region: 'Niki Niki', distributionFrequencyPerWeek: 2, price: 'Rp4.500', category: 'vegetables' as SupplierCategory },
      { id: 'S07', name: { en: 'Jipang Greens', id: 'Jipang' }, image: '/gallery/farm-2.jpg', quantity: 100, unit: 'Kg', supplier: { name: 'Kebun Sayur Fatumnasi', href: '/suppliers/kebun-sayur-fatumnasi' }, region: 'Fatumnasi', distributionFrequencyPerWeek: 2, price: 'Rp4.000', category: 'vegetables' as SupplierCategory },
      { id: 'S08', name: { en: 'Tomatoes', id: 'Tomat' }, image: '/gallery/children-meals.jpg', quantity: 30, unit: 'Kg', supplier: { name: 'Pasar Tani Soe', href: '/suppliers/pasar-tani-soe' }, region: 'Kota Soe', distributionFrequencyPerWeek: 3, price: 'Rp14.000', category: 'vegetables' as SupplierCategory },
      { id: 'S09', name: { en: 'Chinese Cabbage / Mustard Greens', id: 'Sawi Putih / Sawi Hijau' }, image: '/gallery/kitchen-1.jpg', quantity: 100, unit: 'Kg', supplier: { name: 'Kebun Sayur Mollo Utara', href: '/suppliers/kebun-sayur-mollo-utara' }, region: 'Mollo Utara', distributionFrequencyPerWeek: 2, price: 'Rp5.000', category: 'vegetables' as SupplierCategory },
      { id: 'S10', name: { en: 'Green Beans', id: 'Buncis' }, image: '/gallery/menu-showcase.jpg', quantity: 55, unit: 'Kg', supplier: { name: 'Petani Kacang Kualin', href: '/suppliers/petani-kacang-kualin' }, region: 'Kualin', distributionFrequencyPerWeek: 2, price: 'Rp10.000', category: 'legumes' as SupplierCategory },
      { id: 'S11', name: { en: 'Bok Choy', id: 'Pakcoy' }, image: '/gallery/farm-1.jpg', quantity: 110, unit: 'Kg', supplier: { name: 'Kebun Sayur Oehala', href: '/suppliers/kebun-sayur-oehala' }, region: 'Oehala', distributionFrequencyPerWeek: 2, price: 'Rp3.500', category: 'vegetables' as SupplierCategory },
      { id: 'S12', name: { en: 'Shallots', id: 'Bawang Merah' }, image: '/gallery/farm-2.jpg', quantity: 15, unit: 'Kg', supplier: { name: 'Rempah Soe Bersatu', href: '/suppliers/rempah-soe-bersatu' }, region: 'Kota Soe', distributionFrequencyPerWeek: 1, price: 'Rp25.000', category: 'spices' as SupplierCategory },
      { id: 'S13', name: { en: 'Garlic', id: 'Bawang Putih' }, image: '/gallery/children-meals.jpg', quantity: 15, unit: 'Kg', supplier: { name: 'Rempah Amanuban Timur', href: '/suppliers/rempah-amanuban-timur' }, region: 'Amanuban Timur', distributionFrequencyPerWeek: 1, price: 'Rp40.000', category: 'spices' as SupplierCategory },
    ],
    beneficiaries: {
      en: [
        {
          id: 'students',
          label: 'School Children',
          value: '1,690 Students',
          description: [
            'Learners from pre-school through senior high (TK, SD, SMP, SMA/SMK).',
            'Primary recipients of daily nutritious meals.',
          ],
        },
        {
          id: 'pregnantNursing',
          label: 'Pregnant & Nursing Mothers',
          value: '320 Mothers',
          description: [
            'Served via posyandu and puskesmas nutrition services.',
            'Support focuses on maternal health during pregnancy and breastfeeding.',
          ],
        },
        {
          id: 'toddlers',
          label: 'Toddlers (0–59 months)',
          value: '280 Children',
          description: [
            'Early childhood cohort receiving complementary feeding support.',
            'Linked to posyandu growth monitoring and counseling.',
          ],
        },
      ],
      id: [
        {
          id: 'students',
          label: 'Siswa/i Sekolah',
          value: '1.690 Anak',
          description: [
            'Anak TK, SD, SMP, hingga SMA/SMK penerima makanan bergizi.',
            'Prioritas utama distribusi program harian.',
          ],
        },
        {
          id: 'pregnantNursing',
          label: 'Ibu Hamil & Menyusui',
          value: '320 Ibu',
          description: [
            'Dilayani melalui layanan gizi posyandu dan puskesmas.',
            'Fokus pada kesehatan ibu selama kehamilan dan menyusui.',
          ],
        },
        {
          id: 'toddlers',
          label: 'Balita (0–59 bulan)',
          value: '280 Balita',
          description: [
            'Dukungan makanan pendamping gizi untuk usia 0–59 bulan.',
            'Terhubung dengan pemantauan tumbuh kembang posyandu.',
          ],
        },
      ],
    },
    testimonials: {
      en: [
        {
          id: 'T-01',
          name: 'Ari Kefa',
          role: 'Student, SD 01 Nunumeu',
          category: 'siswa',
          quote: 'I feel more focused in class because meals are regular every week.',
          highlight: 'Attendance stays consistent',
          photo: '/gallery/children-meals.jpg',
        },
        {
          id: 'T-02',
          name: 'Maria Kase',
          role: 'Parent',
          category: 'orangtua',
          quote: 'We can save for books and transport because meals are provided.',
          highlight: 'Family savings for school needs',
          photo: '/gallery/kitchen-1.jpg',
        },
        {
          id: 'T-03',
          name: 'Markus Leno',
          role: 'Teacher, SD Katolik Soe',
          category: 'guru',
          quote: 'Students are calmer and more active after receiving balanced meals.',
          highlight: 'Class participation improves',
          photo: '/gallery/farm-1.jpg',
        },
        {
          id: 'T-04',
          name: 'Nita Lomi',
          role: 'Student, SMPN 1 Soe',
          category: 'siswa',
          quote: 'Lunch time makes me excited to go to school and focus longer.',
          highlight: 'Learning motivation grows',
          photo: '/gallery/menu-showcase.jpg',
        },
        {
          id: 'T-05',
          name: 'Anton Nabu',
          role: 'Principal, SMAN 1 Soe',
          category: 'guru',
          quote: 'Since the program started, classes feel more orderly and attentive.',
          highlight: 'Class discipline improves',
          photo: '/gallery/farm-2.jpg',
        },
        {
          id: 'T-06',
          name: 'Rina Tefu',
          role: 'Parent',
          category: 'orangtua',
          quote: 'We see our child eating more vegetables and falling sick less often.',
          highlight: 'Balanced nutrition at home',
          photo: '/gallery/children-meals.jpg',
        },
        {
          id: 'T-07',
          name: 'Yohan Benu',
          role: 'Local Supplier',
          category: 'supplier',
          quote: 'Regular orders from the kitchen give us price stability for harvests.',
          highlight: 'Local produce moves every week',
          photo: '/gallery/farm-2.jpg',
        },
        {
          id: 'T-08',
          name: 'Astri Neno',
          role: 'SPPG Kitchen Staff',
          category: 'pekerja-sppg',
          quote: 'Standardized menus make prep faster and cut food waste.',
          highlight: 'Prep time drops, quality stays high',
          photo: '/gallery/kitchen-1.jpg',
        },
        {
          id: 'T-09',
          name: 'Theresia Mella',
          role: 'District Education Office',
          category: 'pemerintah-daerah',
          quote: 'The program aligns with our target to boost attendance and nutrition.',
          highlight: 'Supports district education goals',
          photo: '/gallery/menu-showcase.jpg',
        },
        {
          id: 'T-10',
          name: 'Sarah Collins',
          role: 'Programme Officer, WFP',
          category: 'lembaga-internasional',
          quote: 'Consistent meal service shows strong community ownership in Soe.',
          highlight: 'Model fits global school meal standards',
          photo: '/gallery/farm-1.jpg',
        },
      ],
      id: [
        {
          id: 'T-01',
          name: 'Ari Kefa',
          role: 'Siswa, SD 01 Nunumeu',
          category: 'siswa',
          quote: 'Saya lebih fokus belajar karena makan siang teratur setiap minggu.',
          highlight: 'Kehadiran makin stabil',
          photo: '/gallery/children-meals.jpg',
        },
        {
          id: 'T-02',
          name: 'Ibu Maria Kase',
          role: 'Orang tua',
          category: 'orangtua',
          quote: 'Kami bisa menyisihkan biaya untuk buku dan transport karena makanan sudah disediakan.',
          highlight: 'Penghematan untuk kebutuhan sekolah',
          photo: '/gallery/kitchen-1.jpg',
        },
        {
          id: 'T-03',
          name: 'Bapak Markus Leno',
          role: 'Guru, SD Katolik Soe',
          category: 'guru',
          quote: 'Anak-anak lebih tenang dan aktif setelah mendapat menu bergizi.',
          highlight: 'Partisipasi kelas meningkat',
          photo: '/gallery/farm-1.jpg',
        },
        {
          id: 'T-04',
          name: 'Nita Lomi',
          role: 'Siswa, SMPN 1 Soe',
          category: 'siswa',
          quote: 'Jam makan membuat saya semangat ke sekolah dan bisa fokus lebih lama.',
          highlight: 'Motivasi belajar meningkat',
          photo: '/gallery/menu-showcase.jpg',
        },
        {
          id: 'T-05',
          name: 'Bapak Anton Nabu',
          role: 'Kepala sekolah, SMAN 1 Soe',
          category: 'guru',
          quote: 'Sejak program berjalan, kelas lebih tertib dan siswa lebih siap belajar.',
          highlight: 'Disiplin kelas membaik',
          photo: '/gallery/farm-2.jpg',
        },
        {
          id: 'T-06',
          name: 'Ibu Rina Tefu',
          role: 'Orang tua',
          category: 'orangtua',
          quote: 'Kami melihat anak lebih lahap makan sayur dan jarang sakit.',
          highlight: 'Gizi seimbang di rumah',
          photo: '/gallery/children-meals.jpg',
        },
        {
          id: 'T-07',
          name: 'Yohan Benu',
          role: 'Pemasok lokal',
          category: 'supplier',
          quote: 'Pesanan rutin dari dapur membuat harga panen kami lebih stabil.',
          highlight: 'Hasil tani terserap setiap minggu',
          photo: '/gallery/farm-2.jpg',
        },
        {
          id: 'T-08',
          name: 'Astri Neno',
          role: 'Pekerja Dapur SPPG',
          category: 'pekerja-sppg',
          quote: 'Menu yang distandardisasi membuat persiapan lebih cepat dan mengurangi limbah.',
          highlight: 'Waktu masak turun, kualitas terjaga',
          photo: '/gallery/kitchen-1.jpg',
        },
        {
          id: 'T-09',
          name: 'Ibu Theresia Mella',
          role: 'Dinas Pendidikan Kabupaten',
          category: 'pemerintah-daerah',
          quote: 'Program ini sejalan dengan target kami meningkatkan kehadiran dan gizi siswa.',
          highlight: 'Dukung capaian pendidikan daerah',
          photo: '/gallery/menu-showcase.jpg',
        },
        {
          id: 'T-10',
          name: 'Sarah Collins',
          role: 'Pejabat Program, WFP',
          category: 'lembaga-internasional',
          quote: 'Layanan makan yang konsisten menunjukkan kepemilikan komunitas yang kuat di Soe.',
          highlight: 'Model sesuai standar global makanan sekolah',
          photo: '/gallery/farm-1.jpg',
        },
      ],
    },
    healthCenters: [
      { id: 'HC-01', name: 'Puskesmas Soe 1', type: 'puskesmas', pregnantNursing: 120, toddlers: 90, target: 210, cooked: 0, inDelivery: 0, received: 0, distance: '2.4 km', travelTimeMinutes: 9, status: 'active' as SchoolStatus, contact: { en: 'Mrs. Rina', id: 'Ibu Rina' } },
      { id: 'HC-02', name: 'Puskesmas Soe 2', type: 'puskesmas', pregnantNursing: 110, toddlers: 95, target: 205, cooked: 0, inDelivery: 0, received: 0, distance: '3.6 km', travelTimeMinutes: 14, status: 'active' as SchoolStatus, contact: { en: 'Mr. Yohan', id: 'Bapak Yohan' } },
      { id: 'HC-03', name: 'Posyandu Melati', type: 'posyandu', pregnantNursing: 90, toddlers: 95, target: 185, cooked: 0, inDelivery: 0, received: 0, distance: '1.9 km', travelTimeMinutes: 8, status: 'active' as SchoolStatus, contact: { en: 'Mrs. Siska', id: 'Ibu Siska' } },
    ],
    geospatialClusters: [
      {
        clusterId: 1,
        radius: { en: 'Cluster I (Radius < 1 km)', id: 'Klaster I (Radius < 1 km)' },
        color: '#3b82f6',
        count: 6,
        schools: [
          { id: 'S1', name: 'TK Dharma Bakti IV', type: 'school', cluster: 1, radius: '<1km' },
          { id: 'S2', name: 'SD 01 Nunumeu', type: 'school', cluster: 1, radius: '<1km' },
          { id: 'S3', name: 'TK Tunas Islam', type: 'school', cluster: 1, radius: '<1km' },
          { id: 'S4', name: 'KB Tunas Islam', type: 'school', cluster: 1, radius: '<1km' },
          { id: 'S5', name: 'SD Negeri Noebel', type: 'school', cluster: 1, radius: '<1km' },
          { id: 'S6', name: 'SD Muhammadiyah Ambar Ketawang 2', type: 'school', cluster: 1, radius: '<1km' },
        ],
        healthCenters: [
          { id: 'H1', name: 'Puskesmas Soe 1', type: 'health', cluster: 1, radius: '<1km' },
        ],
      },
      {
        clusterId: 2,
        radius: { en: 'Cluster II (Radius 1 - 2 km)', id: 'Klaster II (Radius 1 - 2 km)' },
        color: '#10b981',
        count: 8,
        schools: [
          { id: 'S7', name: 'TK Islam Sunan Gunung Jati', type: 'school', cluster: 2, radius: '1-2km' },
          { id: 'S8', name: 'KB Islam Sunan Gunung Jati', type: 'school', cluster: 2, radius: '1-2km' },
          { id: 'S9', name: 'TK Aba Camping', type: 'school', cluster: 2, radius: '1-2km' },
          { id: 'S10', name: 'SD Negeri Mancasan', type: 'school', cluster: 2, radius: '1-2km' },
          { id: 'S11', name: 'SD Muhammadiyah Ambar Ketawang 3', type: 'school', cluster: 2, radius: '1-2km' },
          { id: 'S12', name: 'SD Negeri Gamping', type: 'school', cluster: 2, radius: '1-2km' },
          { id: 'S13', name: 'SD Muhammadiyah Ambar Ketawang 1', type: 'school', cluster: 2, radius: '1-2km' },
          { id: 'S14', name: 'TK Aba Bodeh', type: 'school', cluster: 2, radius: '1-2km' },
        ],
        healthCenters: [
          { id: 'H2', name: 'Puskesmas Soe 2', type: 'health', cluster: 2, radius: '1-2km' },
          { id: 'H3', name: 'Klinik Kesehatan Anak', type: 'health', cluster: 2, radius: '1-2km' },
        ],
      },
      {
        clusterId: 3,
        radius: { en: 'Cluster III (Radius 2 - 3 km)', id: 'Klaster III (Radius 2 - 3 km)' },
        color: '#f59e0b',
        count: 2,
        schools: [
          { id: 'S15', name: 'SD Negeri Nyamplung', type: 'school', cluster: 3, radius: '2-3km' },
          { id: 'S16', name: 'SD Negeri Tegalyoso', type: 'school', cluster: 3, radius: '2-3km' },
        ],
        healthCenters: [],
      },
    ],
    teamProfiles: operationalTeamProfiles,
  },
];

const copy = {
  en: {
    navTitle: 'SPPG Soe, East Nusa Tenggara',
    bgnLogoAlt: 'Badan Gizi Nasional logo',
    wfpLogoAlt: 'World Food Programme logo',
    operationalHub: 'Operational Hub',
    activeStatus: 'ACTIVE',
    languageMenu: {
      ariaLabel: 'Change language',
      english: 'English (US)',
      indonesian: 'Bahasa Indonesia',
      usFlagAlt: 'United States flag',
      idFlagAlt: 'Indonesia flag',
    },
    mapAriaLabel: 'Open location in Google Maps',
    kitchenLocationLabel: 'Kitchen Location',
    managedByLabel: 'Managed by:',
    supportedByLabel: 'Supported by:',
    headerStats: {
      title: 'Operational Highlights',
      operatingSince: 'Operational Since',
      monthsServing: 'months of service',
      dailyMeals: 'Total Beneficiaries',
      dailyMealsUnit: 'people',
      operatingHours: 'Operating Hours',
      schoolsServed: 'Schools Served',
      schoolsUnit: 'schools',
      healthFacilitiesServed: 'Posyandu & Puskesmas Served',
      staffCount: 'SPPG Staff',
      supplierCount: 'Supplier Count',
      totalServings: 'Total Portions Served',
      totalServingsUnit: 'servings',
      certifications: 'Certified',
      certificationLabels: ['SLHS', 'Halal', 'HACCP'],
    },
    headerHighlights: {
      title: 'Key Highlights',
      subtitle: 'Today',
      partnersTitle: 'Core partners',
      costPerPortion: 'Cost / Portion',
      localSourcing: 'Local Sourcing',
      healthScore: 'Health Score',
      wasteRate: 'Food Waste',
      feedbackScore: 'Community Rating',
      equipmentLabel: 'Equipment Count',
      storageLabel: 'Storage Capacity',
      wasteLabel: 'Waste Reduction',
      localSourceLabel: 'Local Sourcing',
    },
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'profil', label: 'Profile' },
      { id: 'menu', label: 'Menu' },
      { id: 'research', label: 'SDG Impact' },
    ],
    gallery: {
      title: 'Gallery',
      items: [
        { id: '1', type: 'photo', title: 'Farm & Garden', src: '/gallery/farm-1.jpg', thumbnail: '/gallery/farm-1.jpg' },
        { id: '2', type: 'photo', title: 'Harvest Day', src: '/gallery/farm-2.jpg', thumbnail: '/gallery/farm-2.jpg' },
        { id: '3', type: 'photo', title: 'Kitchen Preparation', src: '/gallery/kitchen-1.jpg', thumbnail: '/gallery/kitchen-1.jpg' },
        { id: '4', type: 'photo', title: 'Children Enjoying Meals', src: '/gallery/children-meals.jpg', thumbnail: '/gallery/children-meals.jpg' },
        { id: '5', type: 'video', title: 'Cooking Process', src: 'https://www.youtube.com/embed/M7lc1BCxL00', thumbnail: '/gallery/kitchen-1.jpg' },
        { id: '6', type: 'video', title: 'Farm Tour', src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: '/gallery/farm-1.jpg' },
      ],
    },
    dailyMenu: {
      title: "Today's Menu",
      imageAlt: "Today's menu",
      premiumQuality: 'Premium Quality',
      certified: 'Certified',
      nutrition: 'Nutrition',
      menuComponents: 'Menu Components',
    },
    surveillance: {
      liveFeeds: 'Live Feeds',
      realtime: 'Real-time',
      fleet: 'Fleet',
      placeholder: 'Placeholder',
    },
    stats: {
      title: "Today's Delivery",
      target: 'Target',
      cooked: 'Cooked',
      inDelivery: 'In Delivery',
      received: 'Received',
    },
    partners: {
      eyebrow: 'Open Collaboration',
      title: 'Partnering with',
      subtitle: 'Working with research institutes, community networks, and private partners to strengthen sustainable nutrition services.',
      cta: 'View details',
      modalLabel: 'Organization profile',
      items: [
        {
          name: 'Nusantara Food Research Lab',
          description: 'Food systems research and nutrient modeling.',
          details:
            'Runs field studies with schools, maps local food supply gaps, and publishes evidence used to refine menus and procurement targets.',
        },
        {
          name: 'AgriTech Innovation Center',
          description: 'Program co-development and pilot testing.',
          details:
            'Builds digital tools for farmers and kitchens, supports post-harvest training, and pilots traceability for locally sourced ingredients.',
        },
        {
          name: 'Future Nutrition Foundation',
          description: 'Community nutrition empowerment.',
          details:
            'Coordinates volunteer educators, delivers behavior-change sessions, and funds micro-grants for local health initiatives.',
        },
        {
          name: 'Youth Farmers Collective',
          description: 'Capacity building for young farmers.',
          details:
            'Runs mentorship and market access programs, connects youth co-ops with kitchens, and supports climate-smart farming practices.',
        },
        {
          name: 'Food Resilience Institute',
          description: 'Impact measurement and evaluation.',
          details:
            'Tracks outcome indicators, designs surveys with schools, and reports on nutrition, attendance, and waste-reduction metrics.',
        },
        {
          name: 'Sustainable Supply Forum',
          description: 'Logistics and procurement alignment.',
          details:
            'Aligns supplier standards, improves cold-chain planning, and coordinates shared procurement to stabilize prices.',
        },
      ],
    },
    beneficiaries: {
      en: [
        {
          id: 'students',
          label: 'School Children',
          value: '1,690 Students',
          description: [
            'Learners from pre-school through senior high (TK, SD, SMP, SMA/SMK).',
            'Primary recipients of daily nutritious meals.',
          ],
        },
        {
          id: 'pregnantNursing',
          label: 'Pregnant & Nursing Mothers',
          value: '320 Mothers',
          description: [
            'Served via posyandu and puskesmas nutrition services.',
            'Support focuses on maternal health during pregnancy and breastfeeding.',
          ],
        },
        {
          id: 'toddlers',
          label: 'Toddlers (0–59 months)',
          value: '280 Children',
          description: [
            'Early childhood cohort receiving complementary feeding support.',
            'Linked to posyandu growth monitoring and counseling.',
          ],
        },
      ],
      id: [
        {
          id: 'students',
          label: 'Siswa/i Sekolah',
          value: '1.690 Anak',
          description: [
            'Anak TK, SD, SMP, hingga SMA/SMK penerima makanan bergizi.',
            'Prioritas utama distribusi program harian.',
          ],
        },
        {
          id: 'pregnantNursing',
          label: 'Ibu Hamil & Menyusui',
          value: '320 Ibu',
          description: [
            'Dilayani melalui layanan gizi posyandu dan puskesmas.',
            'Fokus pada kesehatan ibu selama kehamilan dan menyusui.',
          ],
        },
        {
          id: 'toddlers',
          label: 'Balita (0–59 bulan)',
          value: '280 Balita',
          description: [
            'Dukungan makanan pendamping gizi untuk usia 0–59 bulan.',
            'Terhubung dengan pemantauan tumbuh kembang posyandu.',
          ],
        },
      ],
    },
    supplier: {
      title: 'Supplier & Commodities Management',
    },
    schools: {
      receivingBenefits: 'Schools Receiving Benefits',
      schools: 'Schools',
      totalBeneficiaries: 'Total Beneficiaries',
      mealsDelivered: 'Meals Delivered',
      coverageRate: 'Coverage Rate',
      students: 'Students',
      healthFacilities: 'Health Facilities',
      totalFacilities: 'Total Facilities',
      puskesmas: 'Puskesmas',
      posyandu: 'Posyandu',
      pregnantNursing: 'Pregnant & Nursing',
      toddlers: 'Toddlers',
      healthBeneficiaries: 'Health Beneficiaries',
    },
    impact: {
      reportTitle: 'Sustainable Impact Report',
      reportSubtitle: 'Social Value & Development Metrics',
      socialImpactTitle: 'Social Impact Analysis',
      sroiRatio: 'SROI Ratio',
      healthSavings: 'Health Savings',
      localEconomy: 'Local Economy',
      learningGain: 'Learning Gain',
      socialValuePerInvestment: 'Social Value per Investment',
      healthcareCostReduction: 'Healthcare Cost Reduction',
      farmEcosystemImpact: 'Farm Ecosystem Impact',
      cognitiveDevelopment: 'Cognitive Development',
      economicModelTitle: 'School Feeding Economic Model',
      economicModelIntro: 'The economic model is grounded in the impacts of providing nutritious meals at school:',
      economicModelPoints: [
        {
          title: 'Value Transfer to Households',
          description: [
            'Nutritious school meals shift value to households, reducing food expenses.',
            'Equivalent support increases disposable income for other needs.',
          ],
          stat: {
            label: 'Annual value transfer',
            value: 'Rp. 1B',
            note: '/ year',
          },
          icon: Coins,
        },
        {
          title: 'Return on Household Assets',
          description: [
            'Household savings can be invested in productive assets.',
            'These assets generate additional income streams over time.',
          ],
          stat: {
            label: 'Asset return ratio',
            value: '1 : 3.8',
            note: 'SROI',
          },
          icon: LineChart,
        },
        {
          title: 'Spillover Economy',
          description: [
            'Procurement, logistics, and distribution stimulate local markets.',
            'Program demand creates activity for community goods and services.',
          ],
          stat: {
            label: 'Local economic boost',
            value: 'Rp. 850M',
            note: '/ month',
          },
          icon: GlobeIcon,
        },
        {
          title: 'Health Improvement',
          description: [
            'Improved nutrient intake reduces micronutrient gaps and health risks.',
            'Healthier children lower nutrition-related costs for households and government.',
          ],
          stat: {
            label: 'Healthcare savings',
            value: 'Rp. 1.2B',
            note: '/ year',
          },
          icon: Heart,
        },
        {
          title: 'Income Uplift',
          description: [
            'Free meals improve attendance and reduce dropout risk.',
            'Higher learning attainment raises future productivity and earnings.',
          ],
          stat: {
            label: 'Productivity index',
            value: '+24%',
            note: 'concentration',
          },
          icon: TrendingUp,
        },
      ],
      sustainableDevelopment: 'Sustainable Development',
      sustainableDevelopmentDesc: 'Aligned with UN Sustainable Development Goals to create measurable human development impact in the region.',
      officialPartner: 'Official Partner',
      goalLabel: 'Goal',
      cba: {
        intro:
          'This section presents a study on the Cost-Benefit Analysis (CBA) of the Free Nutritious Meal Program. The CBA evaluates how the program\'s benefits compare to its costs to assess quantitative impact and whether the value created matches the investment required to reach the stated targets.',
        tableTitle: 'Table 81: Definition and Benefits of CBA',
        definitionTitle: 'CBA Definition',
        benefitsTitle: 'CBA Benefits',
        definitionPoints: [
          'CBA is a method developed to illustrate to donors and government the long-term costs and benefits of a particular social program.',
          'CBA is built within an economic model that uses data from academic literature as well as field data.',
        ],
        benefitsPoints: [
          'CBA is used to advocate the benefits of a particular social program.',
          'CBA is used to highlight the benefits of a particular social program.',
          'CBA is used to generate support from stakeholders.',
        ],
        source: 'Source: School Meals Programme in Indonesia Cost-Benefit Analysis, WFP, 2018',
        disclaimer:
          'CBA study results should not be used as references to define program design, implementation, or evaluation, nor as a comparison tool to assess the relative efficacy or effectiveness of different program types.',
        context: [
          'In the context of the Free Nutritious Meal Program, the CBA analysis measures—in financial terms—the benefits gained from providing nutritious meals at school. This is done by assessing and comparing the economic costs and benefits of providing additional meals at school, and by estimating the value created for beneficiaries.',
          'CBA measures costs and benefits in rupiah value for each beneficiary where the value of benefits exceeds the costs of providing nutritious meals for children. The CBA analysis will show that providing nutritious meals in school is a valuable investment in the short and long term for children, communities, and the country\'s growth and development, and provides evidence that school feeding is a beneficial investment in human capital development.',
        ],
      },
    },
    nonQuantifiable: {
      title: 'Non-Quantifiable Benefits',
      intro:
        'Benefits from the Free Nutritious Meal Program go beyond measurable outcomes such as weight gain or reduced malnutrition. These qualitative impacts significantly improve the wellbeing of students, communities, and society at large.',
      points: [
        {
          title: 'Emotional and Psychological Wellbeing',
          description:
            'Daily access to nutritious meals creates a sense of safety and calm, supporting emotional stability. Children with reliable nutrition tend to experience lower stress and fewer anxiety or depression issues.',
        },
        {
          title: 'Social and Economic Inclusion',
          description:
            'Shared meals encourage positive interaction, strengthen belonging, and reduce stigma for students from low-income families. The cohesion created by school meals helps build stronger peer groups inside and outside the classroom.',
        },
        {
          title: 'Social Skills Development',
          description:
            'Lunch-time interactions foster cooperation, communication, and empathy. These skills support academic success and shape future outcomes in careers and social relationships.',
        },
        {
          title: 'Community Empowerment',
          description:
            'The program empowers local communities through involvement in meal management and provisioning, especially in self-managed models. Participation increases ownership and shared responsibility while reinforcing solidarity so every child receives proper nutrition.',
        },
        {
          title: 'Nutrition Education for Students',
          description:
            'Students learn the importance of balanced nutrition and how it supports health and development. This knowledge often reaches families and positively influences household eating patterns.',
        },
      ],
    },
    sections: {
      sroi: 'Social Return on Investment Analysis',
      cba: 'Cost-Benefit Analysis',
      economic: 'Economic Impact of the Program',
      nonQuantifiable: 'Non-Quantifiable Benefits',
      menuHistory: 'Menu History & Nutrition Tracking',
      menuHistoryTitle: 'Menu History',
      recipeCollection: 'SPPG Recipes',
      recipeCollectionTitle: 'Featured SPPG Recipes',
      aboutFfi: 'About Future Farmers of Indonesia',
      aboutWfp: 'About World Food Programme',
    },
    footer: {
      title: 'Innovative Farmers',
      description: 'Empowering young generations to shape the future of agriculture.',
      infoTitle: 'Information',
      infoEmail: 'info@futurefarmers.id',
      communityTitle: 'Community',
      emailPlaceholder: 'your-email@example.com',
      cta: 'Join Future Farmers',
      copyright: '© 2024. All rights reserved.',
      ffiLogoAlt: 'Future Farmers Indonesia logo',
    },
  },
  id: {
    navTitle: 'SPPG Soe, Nusa Tenggara Timur',
    bgnLogoAlt: 'Logo Badan Gizi Nasional',
    wfpLogoAlt: 'Logo World Food Programme',
    operationalHub: 'Pusat Operasional',
    activeStatus: 'AKTIF',
    languageMenu: {
      ariaLabel: 'Ganti bahasa',
      english: 'English (US)',
      indonesian: 'Bahasa Indonesia',
      usFlagAlt: 'Bendera Amerika Serikat',
      idFlagAlt: 'Bendera Indonesia',
    },
    mapAriaLabel: 'Buka lokasi di Google Maps',
    kitchenLocationLabel: 'Letak Dapur',
    managedByLabel: 'Dikelola oleh:',
    supportedByLabel: 'Didukung oleh:',
    headerStats: {
      title: 'Sorotan Operasional',
      operatingSince: 'Beroperasi sejak',
      monthsServing: 'bulan melayani',
      dailyMeals: 'Jumlah Penerima manfaat',
      dailyMealsUnit: 'orang',
      operatingHours: 'Jam Operasional',
      schoolsServed: 'Melayani Sekolah',
      schoolsUnit: 'sekolah',
      healthFacilitiesServed: 'Melayani Posyandu & Puskesmas',
      staffCount: 'Jumlah Pekerja SPPG',
      supplierCount: 'Jumlah Supplier',
      totalServings: 'Total Porsi Layanan',
      totalServingsUnit: 'porsi',
      certifications: 'Tersertifikasi',
      certificationLabels: ['SLHS', 'Halal', 'HACCP'],
    },
    headerHighlights: {
      title: 'Sorotan Utama',
      subtitle: 'Hari ini',
      partnersTitle: 'Mitra utama',
      costPerPortion: 'Biaya / Porsi',
      localSourcing: 'Sumber Lokal',
      healthScore: 'Skor Kesehatan',
      wasteRate: 'Sisa Makanan',
      feedbackScore: 'Rating Komunitas',
      equipmentLabel: 'Jumlah Peralatan',
      storageLabel: 'Kapasitas Penyimpanan',
      wasteLabel: 'Pengurangan Sampah',
      localSourceLabel: 'Sumber Lokal',
    },
    tabs: [
      { id: 'overview', label: 'Ringkasan' },
      { id: 'profil', label: 'Profil' },
      { id: 'menu', label: 'Menu' },
      { id: 'research', label: 'SDG Impact' },
    ],
    gallery: {
      title: 'Galeri',
      items: [
        { id: '1', type: 'photo', title: 'Kebun & Pertanian', src: '/gallery/farm-1.jpg', thumbnail: '/gallery/farm-1.jpg' },
        { id: '2', type: 'photo', title: 'Hari Panen', src: '/gallery/farm-2.jpg', thumbnail: '/gallery/farm-2.jpg' },
        { id: '3', type: 'photo', title: 'Persiapan Dapur', src: '/gallery/kitchen-1.jpg', thumbnail: '/gallery/kitchen-1.jpg' },
        { id: '4', type: 'photo', title: 'Anak-anak Menikmati Makanan', src: '/gallery/children-meals.jpg', thumbnail: '/gallery/children-meals.jpg' },
        { id: '5', type: 'video', title: 'Proses Memasak', src: 'https://www.youtube.com/embed/M7lc1BCxL00', thumbnail: '/gallery/kitchen-1.jpg' },
        { id: '6', type: 'video', title: 'Tur Pertanian', src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: '/gallery/farm-1.jpg' },
      ],
    },
    dailyMenu: {
      title: 'Menu Hari Ini',
      imageAlt: 'Menu hari ini',
      premiumQuality: 'Kualitas Premium',
      certified: 'Tersertifikasi',
      nutrition: 'Nutrisi',
      menuComponents: 'Komponen Menu',
    },
    surveillance: {
      liveFeeds: 'Kondisi Dapur',
      realtime: 'Waktu Nyata',
      fleet: 'Armada',
      placeholder: 'Placeholder',
    },
    stats: {
      title: 'Pengantaran Hari Ini',
      target: 'Target',
      cooked: 'Selesai Dimasak',
      inDelivery: 'Dalam Pengiriman',
      received: 'Telah Diterima',
    },
    partners: {
      eyebrow: 'Kolaborasi Terbuka',
      title: 'Berpartner dengan',
      subtitle: 'Bersama lembaga riset, komunitas, dan mitra swasta untuk memperkuat layanan gizi berkelanjutan.',
      cta: 'Lihat detail',
      modalLabel: 'Profil organisasi',
      items: [
        {
          name: 'Lembaga Riset Pangan Nusantara',
          description: 'Riset sistem pangan dan pemodelan gizi.',
          details:
            'Melakukan studi lapangan di sekolah, memetakan kesenjangan pasokan lokal, serta menyusun bukti untuk penyempurnaan menu dan target pengadaan.',
        },
        {
          name: 'Pusat Inovasi AgriTech',
          description: 'Pengembangan program dan uji coba.',
          details:
            'Membangun alat digital untuk petani dan dapur, mendampingi pelatihan pascapanen, serta menguji keterlacakan sumber bahan lokal.',
        },
        {
          name: 'Yayasan Gizi Masa Depan',
          description: 'Pemberdayaan gizi komunitas.',
          details:
            'Menggerakkan relawan edukasi, menjalankan sesi perubahan perilaku, dan mendanai hibah mikro untuk inisiatif kesehatan lokal.',
        },
        {
          name: 'Komunitas Petani Muda',
          description: 'Penguatan kapasitas petani muda.',
          details:
            'Menjalankan program mentoring dan akses pasar, menghubungkan koperasi muda ke dapur, serta mendukung praktik pertanian cerdas iklim.',
        },
        {
          name: 'Institut Ketahanan Pangan',
          description: 'Pengukuran dampak dan evaluasi.',
          details:
            'Melacak indikator hasil, merancang survei bersama sekolah, serta melaporkan metrik gizi, kehadiran, dan pengurangan limbah.',
        },
        {
          name: 'Forum Rantai Pasok Berkelanjutan',
          description: 'Sinkronisasi logistik dan pengadaan.',
          details:
            'Menyelaraskan standar pemasok, memperbaiki perencanaan rantai dingin, dan mengoordinasikan pengadaan bersama untuk menstabilkan harga.',
        },
      ],
    },
    beneficiaries: {
      en: [
        {
          id: 'students',
          label: 'School Children',
          value: '1,690 Students',
          description: [
            'Learners from pre-school through senior high (TK, SD, SMP, SMA/SMK).',
            'Primary recipients of daily nutritious meals.',
          ],
        },
        {
          id: 'pregnantNursing',
          label: 'Pregnant & Nursing Mothers',
          value: '320 Mothers',
          description: [
            'Served via posyandu and puskesmas nutrition services.',
            'Support focuses on maternal health during pregnancy and breastfeeding.',
          ],
        },
        {
          id: 'toddlers',
          label: 'Toddlers (0–59 months)',
          value: '280 Children',
          description: [
            'Early childhood cohort receiving complementary feeding support.',
            'Linked to posyandu growth monitoring and counseling.',
          ],
        },
      ],
      id: [
        {
          id: 'students',
          label: 'Siswa/i Sekolah',
          value: '1.690 Anak',
          description: [
            'Anak TK, SD, SMP, hingga SMA/SMK penerima makanan bergizi.',
            'Prioritas utama distribusi program harian.',
          ],
        },
        {
          id: 'pregnantNursing',
          label: 'Ibu Hamil & Menyusui',
          value: '320 Ibu',
          description: [
            'Dilayani melalui layanan gizi posyandu dan puskesmas.',
            'Fokus pada kesehatan ibu selama kehamilan dan menyusui.',
          ],
        },
        {
          id: 'toddlers',
          label: 'Balita (0–59 bulan)',
          value: '280 Balita',
          description: [
            'Dukungan makanan pendamping gizi untuk usia 0–59 bulan.',
            'Terhubung dengan pemantauan tumbuh kembang posyandu.',
          ],
        },
      ],
    },
    supplier: {
      title: 'Manajemen Pemasok & Komoditas',
    },
    schools: {
      receivingBenefits: 'Sekolah Penerima Program',
      schools: 'Sekolah',
      totalBeneficiaries: 'Total Penerima Program',
      mealsDelivered: 'Makanan Terkirim',
      coverageRate: 'Cakupan',
      students: 'Siswa',
      healthFacilities: 'Puskesmas & Posyandu',
      totalFacilities: 'Total Faskes',
      puskesmas: 'Puskesmas',
      posyandu: 'Posyandu',
      pregnantNursing: 'Ibu Hamil & Menyusui',
      toddlers: 'Balita',
      healthBeneficiaries: 'Penerima Manfaat Faskes',
    },
    impact: {
      reportTitle: 'Laporan Dampak Berkelanjutan',
      reportSubtitle: 'Metrik Nilai Sosial & Pembangunan',
      socialImpactTitle: 'Analisis Dampak Sosial',
      sroiRatio: 'Rasio SROI',
      healthSavings: 'Penghematan Kesehatan',
      localEconomy: 'Ekonomi Lokal',
      learningGain: 'Peningkatan Pembelajaran',
      socialValuePerInvestment: 'Nilai Sosial per Investasi',
      healthcareCostReduction: 'Penurunan Biaya Kesehatan',
      farmEcosystemImpact: 'Dampak Ekosistem Pertanian',
      cognitiveDevelopment: 'Perkembangan Kognitif',
      economicModelTitle: 'Model Ekonomi Makan Bergizi Gratis di Sekolah',
      economicModelIntro:
        'Kategori manfaat yang terkait dengan Program Makan Bergizi Gratis diuraikan berdasarkan kerangka kerja konseptual yang menunjukkan bagaimana makanan sekolah berkontribusi terhadap Tujuan Pembangunan Berkelanjutan (SDGs), dimana dapat memberikan manfaat bagi anak-anak, keluarga, masyarakat, dan ekonomi nasional.',
      economicModelPoints: [
        {
          title: 'Transfer Nilai ke Rumah Tangga',
          description: [
            'Transfer nilai ke rumah tangga mengacu pada pemberian dukungan pendapatan atau tambahan pendapatan kepada rumah tangga.',
            'Nilainya setara dengan makanan bergizi yang diperoleh melalui distribusi makanan di sekolah.',
          ],
          stat: {
            label: 'Pencapaian transfer nilai',
            value: 'Rp. 1 Miliar',
            note: '/ tahun',
          },
          icon: Coins,
        },
        {
          title: 'Return on Investment pada Aset Rumah Tangga',
          description: [
            'Return on investment pada aset rumah tangga adalah peningkatan kapasitas ekonomi dari nilai transfer makanan yang memungkinkan sumber daya digunakan untuk menciptakan aset produktif.',
            'Rumah tangga menyimpan serta menginvestasikan sebagian pendapatan tambahan pada aset produktif yang menghasilkan aliran pendapatan selama jangka waktu tertentu.',
          ],
          stat: {
            label: 'Rasio pengembalian aset',
            value: '1 : 3,8',
            note: 'SROI',
          },
          icon: LineChart,
        },
        {
          title: 'Dampak Spillover Ekonomi',
          description: [
            'Dampak spillover economy adalah peningkatan kegiatan ekonomi karena program memicu aktivitas ekonomi di masyarakat lokal.',
            'Aktivitas ini muncul melalui pemenuhan kebutuhan barang dan jasa yang diperlukan dalam pelaksanaan program.',
          ],
          stat: {
            label: 'Dampak ekonomi lokal',
            value: 'Rp. 850 Juta',
            note: '/ bulan',
          },
          icon: GlobeIcon,
        },
        {
          title: 'Peningkatan Kesehatan',
          description: [
            'Program makan bergizi di sekolah memenuhi 30% dari asupan harian yang direkomendasikan dan membantu mengatasi kekurangan mikronutrien.',
            'Pemberian makan bergizi dan teratur mengurangi tantangan gizi dan kesehatan buruk, menurunkan biaya perawatan kesehatan, serta menghasilkan kehidupan yang lebih sehat bagi penerima manfaat.',
          ],
          stat: {
            label: 'Penghematan kesehatan',
            value: 'Rp. 1,2 Miliar',
            note: '/ tahun',
          },
          icon: Heart,
        },
        {
          title: 'Peningkatan Pendapatan',
          description: [
            'Pemberian makanan bergizi di sekolah meningkatkan kehadiran dan menurunkan tingkat putus sekolah.',
            'Pendidikan yang lebih lama menghasilkan peluang kerja lebih baik dan peningkatan produktivitas saat dewasa.',
          ],
          stat: {
            label: 'Indeks produktivitas',
            value: '+24%',
            note: 'konsentrasi',
          },
          icon: TrendingUp,
        },
      ],
      sustainableDevelopment: 'Pembangunan Berkelanjutan',
      sustainableDevelopmentDesc: 'Selaras dengan Tujuan Pembangunan Berkelanjutan PBB untuk menciptakan dampak pembangunan manusia yang terukur di wilayah ini.',
      officialPartner: 'Mitra Resmi',
      goalLabel: 'Tujuan',
      cba: {
        intro:
          'Bagian ini menyajikan studi tentang Cost-Benefit Analysis (CBA) Program Makan Bergizi Gratis. Cost-Benefit Analysis (CBA) bertujuan untuk mengevaluasi perbandingan antara manfaat dan biaya dari Program Makan Bergizi Gratis dalam konteks menilai dampak kuantitatif program dalam memberikan nilai yang sepadan dengan biaya yang dikeluarkan untuk mencapai target yang ditentukan.',
        tableTitle: 'Tabel 81: Penjelasan Pengertian dan Manfaat CBA',
        definitionTitle: 'Pengertian CBA',
        benefitsTitle: 'Manfaat CBA',
        definitionPoints: [
          'CBA adalah metode yang dikembangkan untuk menggambarkan kepada pihak pendonor dan pemerintah mengenai biaya dan manfaat jangka panjang dari suatu program sosial tertentu.',
          'CBA dibuat dalam sebuah model ekonomi yang memanfaatkan sumber data baik dari literatur akademik maupun dari data yang dikumpulkan di lapangan.',
        ],
        benefitsPoints: [
          'CBA digunakan untuk mengadvokasi manfaat dari suatu program sosial tertentu.',
          'CBA digunakan untuk menyoroti manfaat dari program sosial tertentu.',
          'CBA digunakan untuk menghasilkan dukungan dari para pemangku kepentingan.',
        ],
        source: 'Sumber: School Meals Programme in Indonesia Cost-Benefit Analysis, WFP, 2018',
        disclaimer:
          'Hasil studi CBA tidak boleh digunakan sebagai referensi yang bertujuan untuk mendefinisikan desain program, implementasi, atau evaluasi, ataupun sebagai alat perbandingan untuk menilai efikasi atau efektivitas relatif dari berbagai jenis program.',
        context: [
          'Dalam konteks Program Makan Bergizi Gratis, analisis CBA bertujuan untuk mengukur, dalam hal keuangan, manfaat yang diperoleh dari pemberian makanan bergizi di sekolah. Hal ini dilakukan dengan menilai dan membandingkan biaya dan manfaat ekonomi dari penyediaan makanan tambahan di sekolah, serta dengan memperkirakan nilai yang diciptakan bagi penerima manfaat.',
          'CBA mengukur biaya dan manfaat dalam nilai rupiah untuk setiap penerima manfaat dimana nilai manfaat akan lebih besar daripada biaya dalam penyediaan makanan bergizi untuk anak. Analisis CBA akan menunjukkan bahwa pemberian makanan bergizi di sekolah merupakan investasi yang berharga untuk jangka pendek dan jangka panjang bagi anak-anak, masyarakat, serta pertumbuhan dan perkembangan negara dan memberikan bukti bahwa pemberian makanan di sekolah merupakan investasi yang bermanfaat dalam pengembangan sumber daya manusia.',
        ],
      },
    },
    nonQuantifiable: {
      title: 'Manfaat Non-Kuantitatif',
      intro:
        'Manfaat dari Program Makan Bergizi Gratis tidak terbatas pada hasil yang dapat diukur secara kuantitatif, seperti peningkatan berat dan tinggi badan atau pengurangan prevalensi gizi buruk. Banyak manfaat penting lainnya yang tidak dapat diukur langsung, namun memiliki dampak signifikan terhadap kesejahteraan siswa, komunitas, dan masyarakat luas.',
      points: [
        {
          title: 'Kesejahteraan Emosional dan Psikologis',
          description:
            'Program ini memberikan kontribusi signifikan terhadap kesejahteraan psikososial siswa. Dengan adanya jaminan makanan bergizi setiap hari, siswa merasa lebih aman dan tenang, yang berkontribusi pada stabilitas emosional. Anak-anak yang memiliki akses ke makanan bergizi cenderung memiliki tingkat stres yang lebih rendah dan lebih sedikit mengalami masalah kecemasan dan depresi.',
        },
        {
          title: 'Peningkatan Inklusi Sosial dan Ekonomi',
          description:
            'Penyediaan makan bergizi bersama juga mendorong interaksi sosial yang positif di antara siswa. Makan bersama-sama di sekolah menciptakan kesempatan bagi siswa untuk berinteraksi lebih dekat dengan teman-teman mereka, yang memperkuat ikatan sosial dan rasa kebersamaan. Selain itu, program ini juga mengurangi stigma sosial yang mungkin dihadapi oleh siswa dari keluarga kurang mampu yang mungkin tidak dapat membawa bekal dari rumah. Meningkatnya kekompakan yang ditimbulkan oleh makanan sekolah didukung oleh penyediaan makanan bergizi memungkinkan terbentuknya struktur kelompok baik di dalam maupun di luar kelas.',
        },
        {
          title: 'Pengembangan Keterampilan Sosial',
          description:
            'Melalui interaksi sosial yang lebih baik di lingkungan sekolah ketika makan siang, siswa mengembangkan keterampilan sosial yang penting seperti kerja sama, komunikasi, dan empati. Keterampilan ini tidak hanya penting untuk keberhasilan akademik tetapi juga untuk perkembangan pribadi dan sosial mereka di masa depan dimana akan berpengaruh terhadap keberhasilan di masa depan, termasuk dalam karir dan hubungan sosial.',
        },
        {
          title: 'Pemberdayaan Komunitas',
          description:
            'Program Makan Bergizi Gratis memberdayakan komunitas lokal dengan melibatkan mereka dalam pengelolaan dan penyediaan makanan, terutama dalam model Swakelola. Partisipasi aktif komunitas dalam program ini meningkatkan rasa kepemilikan dan tanggung jawab sosial, yang penting untuk keberlanjutan program. Selain itu, program ini juga membantu memperkuat solidaritas komunitas dengan menciptakan rasa tujuan bersama dalam memastikan bahwa semua anak menerima makanan yang layak dan bergizi.',
        },
        {
          title: 'Edukasi Gizi untuk Siswa',
          description:
            'Salah satu manfaat penting yang tidak dapat diukur langsung adalah peningkatan kesadaran siswa tentang pentingnya gizi seimbang. Program ini memberikan kesempatan bagi siswa untuk belajar tentang makanan yang sehat dan bagaimana makanan tersebut berkontribusi terhadap kesehatan dan perkembangan mereka. Kesadaran gizi yang meningkat di kalangan siswa juga berdampak positif pada keluarga mereka. Siswa yang belajar tentang pentingnya gizi sering kali membawa pengetahuan ini ke rumah dan mempengaruhi pola makan keluarga mereka.',
        },
      ],
    },
    sections: {
      sroi: 'Analisis Pengembalian Sosial atas Investasi',
      cba: 'Analisis Biaya-Manfaat',
      economic: 'Dampak Ekonomi Program',
      nonQuantifiable: 'Manfaat Non-Kuantitatif',
      menuHistory: 'Riwayat Menu & Pelacakan Nutrisi',
      menuHistoryTitle: 'Riwayat Menu',
      recipeCollection: 'Resep SPPG',
      recipeCollectionTitle: 'Resep Unggulan SPPG',
      aboutFfi: 'Tentang Future Farmers of Indonesia',
      aboutWfp: 'Tentang World Food Programme',
    },
    footer: {
      title: 'Petani Inovatif',
      description: 'Memberdayakan generasi muda untuk membentuk masa depan pertanian.',
      infoTitle: 'Informasi',
      infoEmail: 'info@futurefarmers.id',
      communityTitle: 'Komunitas',
      emailPlaceholder: 'email-kamu@contoh.com',
      cta: 'Mari bergabung menjadi FFI',
      copyright: '© 2024. Hak cipta dilindungi.',
      ffiLogoAlt: 'Logo Future Farmers Indonesia',
    },
  },
} as const;

const THEORY_OF_CHANGE: Record<Language, TheoryOfChangeCopy> = {
  en: {
    title: 'Theory of Change',
    description: [
      'The Theory of Change underlying the Free Nutritious Meal Program explains how and why the program is expected to reach its goals.',
      'It covers core assumptions, inputs, outputs, outcomes, and expected impacts, along with indicators used to measure program success.',
    ],
    levels: [
      {
        id: 'activities',
        label: 'Activities',
        accent: THEORY_OF_CHANGE_STYLES.activities,
        items: [
          { text: 'Menu selection', icon: ClipboardCheck },
          { text: 'Food/ingredient procurement', icon: Truck },
          { text: 'Cooking', icon: Flame },
          { text: 'Packaging', icon: CheckCircle2 },
          { text: 'Meal distribution to children', icon: Navigation },
        ],
      },
      {
        id: 'output',
        label: 'Output',
        accent: THEORY_OF_CHANGE_STYLES.output,
        items: [
          { text: 'Children consume the provided meals', icon: Utensils },
          { text: 'Children take meals home', icon: MapPin },
        ],
      },
      {
        id: 'outcome',
        label: 'Outcome',
        accent: THEORY_OF_CHANGE_STYLES.outcome,
        items: [
          { text: 'Nutrient intake increases', icon: Apple },
          { text: 'Learning concentration improves', icon: LineChart },
          { text: 'Child behavior improves', icon: Heart },
          { text: 'School attendance increases', icon: School },
        ],
      },
      {
        id: 'impact',
        label: 'Impact',
        accent: THEORY_OF_CHANGE_STYLES.impact,
        items: [
          { text: 'Toddlers: Reduced stunting & underweight', icon: Baby },
          { text: 'Toddlers: Children become healthier', icon: Heart },
          { text: 'School-age: Learning achievement improves', icon: BookOpen },
        ],
      },
    ],
    caption: 'Theory of Change diagram for the Free Nutritious Meal Program.',
  },
  id: {
    title: 'Teori Perubahan',
    description: [
      'Teori perubahan (Theory of Change) yang mendasari Program Makan Bergizi Gratis bertujuan untuk menjelaskan bagaimana dan mengapa program ini diharapkan dapat mencapai tujuannya.',
      'Teori perubahan ini mencakup asumsi-asumsi dasar, input, output, outcome, dan dampak yang diharapkan, serta indikator-indikator yang digunakan untuk mengukur keberhasilan program.',
    ],
    levels: [
      {
        id: 'activities',
        label: 'Activities',
        accent: THEORY_OF_CHANGE_STYLES.activities,
        items: [
          { text: 'Pemilihan menu', icon: ClipboardCheck },
          { text: 'Pengadaan bahan makan / makanan', icon: Truck },
          { text: 'Memasak bahan makanan', icon: Flame },
          { text: 'Pengemasan', icon: CheckCircle2 },
          { text: 'Pemberian makanan ke anak', icon: Navigation },
        ],
      },
      {
        id: 'output',
        label: 'Output',
        accent: THEORY_OF_CHANGE_STYLES.output,
        items: [
          { text: 'Anak memakan makanan yang telah disediakan', icon: Utensils },
          { text: 'Anak membawa makanan ke rumah', icon: MapPin },
        ],
      },
      {
        id: 'outcome',
        label: 'Outcome',
        accent: THEORY_OF_CHANGE_STYLES.outcome,
        items: [
          { text: 'Asupan gizi meningkat', icon: Apple },
          { text: 'Daya konsentrasi belajar meningkat', icon: LineChart },
          { text: 'Perilaku anak menjadi lebih baik', icon: Heart },
          { text: 'Kehadiran anak di sekolah meningkat', icon: School },
        ],
      },
      {
        id: 'impact',
        label: 'Impact',
        accent: THEORY_OF_CHANGE_STYLES.impact,
        items: [
          { text: 'Balita: Tingkat stunting & underweight berkurang', icon: Baby },
          { text: 'Balita: Anak menjadi lebih sehat', icon: Heart },
          { text: 'Anak Sekolah: Capaian belajar anak meningkat', icon: BookOpen },
        ],
      },
    ],
    caption: 'Diagram Teori Perubahan Program Makan Bergizi Gratis.',
  },
};

const SPPG_RECIPE_COLLECTION = {
  en: {
    title: 'Featured SPPG Recipes',
    subtitle: 'Curated favorites and plating references from partner SPPG kitchens.',
    countLabel: 'recipes',
    nutritionLabel: 'Nutrition per serving',
    cookTimeLabel: 'Cooking time',
    overviewLabel: 'Recipe overview',
    stepLabel: 'Step',
    ingredientsLabel: 'Ingredients',
    stepsLabel: 'Cooking steps',
    items: [
      {
        id: 'nasi-kuning-ayam-bom',
        title: 'Nasi Kuning Ayam Bom',
        location: 'SPPG Polresta Tanah Laut, South Kalimantan',
        head: 'Head of SPPG: Muhammad Alif Lazuardi',
        cookTime: '45 min',
        image: '/gallery/menu-showcase.jpg',
        nutrition: [
          { label: 'Energy', value: '633.3 kcal' },
          { label: 'Protein', value: '22.2 g' },
          { label: 'Fat', value: '20.9 g' },
          { label: 'Carbs', value: '88.5 g' },
        ],
        ingredients: [
          {
            title: 'Ingredients (1 serving)',
            items: [
              'Rice, 100 g, rinsed',
              'Coconut milk, 150 ml',
              'Turmeric, 1 tsp (or 1/2 tsp powder)',
              'Bay leaf, 1',
              'Lemongrass, 1/2 stalk, bruised',
              'Salt, 1/2 tsp',
            ],
          },
          {
            title: 'Ayam Bom',
            items: [
              'Chicken, 120 g, diced or shredded',
              'Red chili, 2 pcs, thinly sliced',
              'Birds eye chili, 3 to 5 pcs',
              'Garlic, 2 cloves, sliced',
              'Shallots, 3 cloves, sliced',
              'Sweet soy sauce, 1 tbsp',
              'Chili sauce, 1 tbsp',
              'Salt and sugar to taste',
              'Oil for sauteing',
            ],
          },
        ],
        steps: [
          {
            title: 'Cook the rice',
            items: [
              'Simmer rice with coconut milk, turmeric, bay leaf, lemongrass, and salt until fluffy.',
            ],
          },
          {
            title: 'Make the ayam bom',
            items: [
              'Saute shallots and garlic until fragrant; add chilies and chicken.',
              'Season with sweet soy and chili sauce; cook until the sauce reduces.',
            ],
          },
          {
            title: 'Serve',
            items: ['Plate the yellow rice with ayam bom and fresh vegetables.'],
          },
        ],
      },
      {
        id: 'semur-telur',
        title: 'Semur Telur',
        location: 'SPPG Polres Barito Selatan, Central Kalimantan',
        head: 'Head of SPPG: Hari Wijaya',
        cookTime: '35 min',
        image: '/gallery/kitchen-1.jpg',
        nutrition: [
          { label: 'Energy', value: '526.4 kcal' },
          { label: 'Protein', value: '15.4 g' },
          { label: 'Fat', value: '11.8 g' },
          { label: 'Carbs', value: '90 g' },
        ],
        ingredients: [
          {
            title: 'Ingredients (1 serving)',
            items: [
              'Egg, 1',
              'Cooking oil, 1 tbsp',
              'Onion, 1/2, thinly sliced',
              'Garlic, 1 clove, minced',
              'Chili sauce, 1/2 tbsp',
              'Tomato sauce, 1/2 tbsp',
              'Sweet soy sauce, 1 tsp',
              'Oyster sauce (optional), 1 tsp',
              'Water, 50 ml',
              'Salt and sugar to taste',
            ],
          },
        ],
        steps: [
          {
            title: 'Fry the egg',
            items: ['Heat oil and fry the egg sunny-side up or scramble to preference.'],
          },
          {
            title: 'Make the sauce',
            items: [
              'Saute onion and garlic; add chili sauce, tomato sauce, sweet soy, and oyster sauce.',
              'Pour in water and bring to a gentle simmer.',
            ],
          },
          {
            title: 'Combine',
            items: ['Return the egg to the pan and simmer until the sauce coats.'],
          },
        ],
      },
      {
        id: 'nasi-bekepor',
        title: 'Nasi Bekepor',
        location: 'SPPG Polda East Kalimantan',
        head: 'Head of SPPG: Ardya Sena Maulydina Azhari',
        cookTime: '50 min',
        image: '/gallery/children-meals.jpg',
        nutrition: [
          { label: 'Energy', value: '825 kcal' },
          { label: 'Protein', value: '32 g' },
          { label: 'Fat', value: '19 g' },
          { label: 'Carbs', value: '132 g' },
        ],
        ingredients: [
          {
            title: 'Ingredients (1 serving)',
            items: [
              'Rice, 100 g, rinsed',
              'Dried salted fish (jambal or peda), 30 g, fried',
              'Bay leaf, 1',
              'Lemongrass, 1/2 stalk, bruised',
              'Galangal, 2 thin slices',
              'Shallots, 2 cloves, sliced',
              'Garlic, 1 clove, sliced',
              'Sweet soy sauce, 1 tbsp',
              'Salt and sugar to taste',
              'Coconut oil, 1 tbsp',
              'Water, 150 ml',
            ],
          },
          {
            title: 'Serving',
            items: ['Sambal terasi or onion sambal', 'Cucumber and lettuce'],
          },
        ],
        steps: [
          {
            title: 'Build aroma',
            items: ['Saute shallots and garlic in coconut oil; add bay leaf, lemongrass, and galangal.'],
          },
          {
            title: 'Cook the rice',
            items: [
              'Add rice and sweet soy, stir until coated, then pour water and cook until fluffy.',
            ],
          },
          {
            title: 'Finish',
            items: ['Top with fried salted fish and serve with sambal and fresh vegetables.'],
          },
        ],
      },
      {
        id: 'ikan-patin-garing',
        title: 'Ikan Patin Garing Asam Manis',
        location: 'SPPG Polres Gunung Mas, Central Kalimantan',
        head: 'Head of SPPG: Haikal Fikri',
        cookTime: '40 min',
        image: '/gallery/farm-1.jpg',
        nutrition: [
          { label: 'Energy', value: '651.9 kcal' },
          { label: 'Protein', value: '27.7 g' },
          { label: 'Fat', value: '24.4 g' },
          { label: 'Carbs', value: '81 g' },
        ],
        ingredients: [
          {
            title: 'Catfish',
            items: [
              'Catfish fillet, 150 g, boneless',
              'Lime juice, 1/2 tbsp',
              'Salt, 1/4 tsp',
            ],
          },
          {
            title: 'Batter',
            items: ['All-purpose flour, 3 tbsp', 'Cornstarch, 1 tbsp', 'Pepper, 1/4 tsp', 'Water for batter'],
          },
          {
            title: 'Sweet-sour sauce',
            items: [
              'Garlic, 1 clove, minced',
              'Shallot, 1, sliced',
              'Red chili (optional), 1/2',
              'Tomato sauce, 2 tbsp',
              'Chili sauce, 1 tbsp',
              'Soy sauce, 1/2 tbsp',
              'Sugar, 1/2 tsp',
              'Salt, 1/4 tsp',
              'Water, 50 ml',
              'Cornstarch slurry',
              'Scallion, 1 stalk',
            ],
          },
        ],
        steps: [
          {
            title: 'Prepare the fish',
            items: ['Marinate catfish with lime and salt for 10 minutes.'],
          },
          {
            title: 'Fry until crisp',
            items: ['Coat fish in batter and fry until golden; drain well.'],
          },
          {
            title: 'Make the sauce',
            items: [
              'Saute garlic and shallot; add sauces, sugar, salt, and water; simmer.',
              'Thicken with cornstarch slurry and finish with scallion.',
            ],
          },
          {
            title: 'Serve',
            items: ['Pour sauce over crispy fish or serve on the side.'],
          },
        ],
      },
    ],
  },
  id: {
    title: 'Resep Unggulan SPPG',
    subtitle: 'Pilihan resep dan referensi plating dari dapur mitra SPPG.',
    countLabel: 'resep',
    nutritionLabel: 'Kandungan gizi per sajian',
    cookTimeLabel: 'Waktu memasak',
    overviewLabel: 'Ringkasan resep',
    stepLabel: 'Langkah',
    ingredientsLabel: 'Bahan bahan',
    stepsLabel: 'Cara memasak',
    items: [
      {
        id: 'nasi-kuning-ayam-bom',
        title: 'Nasi Kuning Ayam Bom',
        location: 'SPPG Polresta Tanah Laut, Kalimantan Selatan',
        head: 'Kepala SPPG: Muhammad Alif Lazuardi',
        cookTime: '45 menit',
        image: '/gallery/menu-showcase.jpg',
        nutrition: [
          { label: 'Energi', value: '633,3 kkal' },
          { label: 'Protein', value: '22,2 gram' },
          { label: 'Lemak', value: '20,9 gram' },
          { label: 'Karbohidrat', value: '88,5 gram' },
        ],
        ingredients: [
          {
            title: 'Bahan bahan (1 porsi)',
            items: [
              'Beras, 100 gram, cuci bersih',
              'Santan, 150 ml',
              'Kunyit, 1 sdt (atau 1/2 sdt bubuk)',
              'Daun salam, 1 lembar',
              'Serai, 1/2 batang, memarkan',
              'Garam, 1/2 sdt',
            ],
          },
          {
            title: 'Ayam Bom',
            items: [
              'Daging ayam, 120 gram, potong kecil atau suwir',
              'Cabai merah, 2 buah, iris',
              'Cabai rawit, 3 sampai 5 buah',
              'Bawang putih, 2 siung, iris',
              'Bawang merah, 3 siung, iris',
              'Kecap manis, 1 sdm',
              'Saus sambal, 1 sdm',
              'Garam dan gula secukupnya',
              'Minyak untuk menumis',
            ],
          },
        ],
        steps: [
          {
            title: 'Masak nasi kuning',
            items: [
              'Masak beras bersama santan, kunyit, daun salam, serai, dan garam sampai matang.',
            ],
          },
          {
            title: 'Buat ayam bom',
            items: [
              'Tumis bawang merah dan bawang putih hingga harum, masukkan cabai dan ayam.',
              'Tambahkan kecap manis dan saus sambal, masak hingga bumbu meresap.',
            ],
          },
          {
            title: 'Sajikan',
            items: ['Sajikan nasi kuning dengan ayam bom dan sayuran segar.'],
          },
        ],
      },
      {
        id: 'semur-telur',
        title: 'Semur Telur',
        location: 'SPPG Polres Barito Selatan, Kalimantan Tengah',
        head: 'Kepala SPPG: Hari Wijaya',
        cookTime: '35 menit',
        image: '/gallery/kitchen-1.jpg',
        nutrition: [
          { label: 'Energi', value: '526,4 kkal' },
          { label: 'Protein', value: '15,4 gram' },
          { label: 'Lemak', value: '11,8 gram' },
          { label: 'Karbohidrat', value: '90 gram' },
        ],
        ingredients: [
          {
            title: 'Bahan bahan (1 porsi)',
            items: [
              'Telur ayam, 1 butir',
              'Minyak goreng, 1 sdm',
              'Bawang bombai, 1/2 buah, iris tipis',
              'Bawang putih, 1 siung, cincang',
              'Saus sambal, 1/2 sdm',
              'Saus tomat, 1/2 sdm',
              'Kecap manis, 1 sdt',
              'Saus tiram (opsional), 1 sdt',
              'Air, 50 ml',
              'Garam dan gula secukupnya',
            ],
          },
        ],
        steps: [
          {
            title: 'Goreng telur',
            items: ['Panaskan minyak lalu goreng telur sesuai selera.'],
          },
          {
            title: 'Buat saus',
            items: [
              'Tumis bawang bombai dan bawang putih, tambahkan saus sambal, saus tomat, kecap manis, dan saus tiram.',
              'Tuang air lalu masak hingga mendidih ringan.',
            ],
          },
          {
            title: 'Satukan',
            items: ['Masukkan telur goreng dan masak hingga saus melapisi.'],
          },
        ],
      },
      {
        id: 'nasi-bekepor',
        title: 'Nasi Bekepor',
        location: 'SPPG Polda Kalimantan Timur',
        head: 'Kepala SPPG: Ardya Sena Maulydina Azhari',
        cookTime: '50 menit',
        image: '/gallery/children-meals.jpg',
        nutrition: [
          { label: 'Energi', value: '825 kkal' },
          { label: 'Protein', value: '32 gram' },
          { label: 'Lemak', value: '19 gram' },
          { label: 'Karbohidrat', value: '132 gram' },
        ],
        ingredients: [
          {
            title: 'Bahan bahan (1 porsi)',
            items: [
              'Beras, 100 gram, cuci bersih',
              'Ikan asin (jambal atau peda), 30 gram, goreng',
              'Daun salam, 1 lembar',
              'Serai, 1/2 batang, memarkan',
              'Lengkuas, 2 iris tipis',
              'Bawang merah, 2 siung, iris',
              'Bawang putih, 1 siung, iris',
              'Kecap manis, 1 sdm',
              'Garam dan gula secukupnya',
              'Minyak kelapa, 1 sdm',
              'Air, 150 ml',
            ],
          },
          {
            title: 'Pelengkap',
            items: ['Sambal terasi atau sambal bawang', 'Ketimun dan lalapan'],
          },
        ],
        steps: [
          {
            title: 'Tumis bumbu',
            items: ['Tumis bawang merah dan bawang putih dengan minyak kelapa hingga harum.'],
          },
          {
            title: 'Masak nasi',
            items: [
              'Masukkan daun salam, serai, lengkuas, beras, dan kecap manis; aduk rata lalu tuang air hingga matang.',
            ],
          },
          {
            title: 'Sajikan',
            items: ['Taburi ikan asin goreng dan sajikan bersama sambal dan lalapan.'],
          },
        ],
      },
      {
        id: 'ikan-patin-garing',
        title: 'Ikan Patin Garing Asam Manis',
        location: 'SPPG Polres Gunung Mas, Kalimantan Tengah',
        head: 'Kepala SPPG: Haikal Fikri',
        cookTime: '40 menit',
        image: '/gallery/farm-1.jpg',
        nutrition: [
          { label: 'Energi', value: '651,9 kkal' },
          { label: 'Protein', value: '27,7 gram' },
          { label: 'Lemak', value: '24,4 gram' },
          { label: 'Karbohidrat', value: '81 gram' },
        ],
        ingredients: [
          {
            title: 'Ikan patin',
            items: [
              'Fillet ikan patin, 150 gram',
              'Air jeruk nipis, 1/2 sdt',
              'Garam, 1/4 sdt',
            ],
          },
          {
            title: 'Pelapis garing',
            items: ['Tepung terigu, 3 sdm', 'Tepung maizena, 1 sdm', 'Merica, 1/4 sdt', 'Air untuk adonan'],
          },
          {
            title: 'Saus asam manis',
            items: [
              'Bawang putih, 1 siung, cincang',
              'Bawang merah, 1 siung, iris',
              'Cabai merah (opsional), 1/2 buah',
              'Saus tomat, 2 sdm',
              'Saus sambal, 1 sdm',
              'Kecap asin, 1/2 sdm',
              'Gula, 1/2 sdt',
              'Garam, 1/4 sdt',
              'Air, 50 ml',
              'Larutan maizena',
              'Daun bawang, 1 batang, iris',
            ],
          },
        ],
        steps: [
          {
            title: 'Siapkan ikan',
            items: ['Lumuri ikan patin dengan air jeruk nipis dan garam selama 10 menit.'],
          },
          {
            title: 'Goreng garing',
            items: ['Balur ikan dengan adonan lalu goreng sampai keemasan, tiriskan.'],
          },
          {
            title: 'Buat saus',
            items: [
              'Tumis bawang putih dan bawang merah, masukkan saus, gula, garam, dan air lalu didihkan.',
              'Tambahkan larutan maizena hingga mengental, taburi daun bawang.',
            ],
          },
          {
            title: 'Sajikan',
            items: ['Siram saus asam manis di atas ikan atau sajikan terpisah.'],
          },
        ],
      },
    ],
  },
} as const;

const App = () => {
  const [selectedSppg] = useState(MOCK_SPPG_DATA[0]);
  const { language, updateLanguage, mounted } = useLanguage();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const pendingScrollTargetRef = useRef<string | null>(null);
  const testimonialTrackRef = useRef<HTMLDivElement | null>(null);
  const recipeTrackRef = useRef<HTMLDivElement | null>(null);
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);
  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const [recipeStep, setRecipeStep] = useState(0);
  const [activePartnerIndex, setActivePartnerIndex] = useState<number | null>(null);
  const [testimonialCategory, setTestimonialCategory] = useState<TestimonialCategory>('all');

  const ui = copy[language];
  const beneficiaryHeading = 'Overview Beneficiary';
  const theoryOfChange = THEORY_OF_CHANGE[language];
  const activePartner = activePartnerIndex !== null ? ui.partners.items[activePartnerIndex] : null;
  const activePartnerColor =
    activePartnerIndex !== null ? partnerLogoPalette[activePartnerIndex % partnerLogoPalette.length] : '';
  const isPartnerOpen = activePartnerIndex !== null;
  const isAnyModalOpen = isRecipeOpen || isPartnerOpen;
  const localizedName = selectedSppg.name[language];
  const localizedRegion = selectedSppg.region[language];
  const localizedAddress = selectedSppg.address[language];
  const dailyMenu = selectedSppg.dailyMenu[language];
  const cba = selectedSppg.cba[language];
  const sdgs = selectedSppg.sdgs[language];
  const sdgIconMap: Record<number, string> = {
    1: '/sdg/sdg-1-no-poverty.png',
    2: '/sdg/sdg-2-zero-hunger.png',
    3: '/sdg/sdg-3-good-health.png',
    4: '/sdg/sdg-4-quality-education.png',
    8: '/sdg/sdg-8-decent-work.png',
  };
  const sdgBackgroundMap: Record<number, string> = {
    1: '/gallery/farm-1.jpg',
    2: '/gallery/children-meals.jpg',
    3: '/gallery/kitchen-1.jpg',
    4: '/gallery/menu-showcase.jpg',
    5: '/gallery/farm-2.jpg',
    8: '/gallery/farm-1.jpg',
    12: '/gallery/menu-showcase.jpg',
  };
  const cctvFeeds = selectedSppg.cctvFeeds[language];
  const menuHistory = selectedSppg.menuHistory[language];
  const recipeCollection = SPPG_RECIPE_COLLECTION[language];
  const testimonials = selectedSppg.testimonials[language];
  const beneficiaryHighlights = selectedSppg.beneficiaries[language];
  const testimonialCategories = useMemo<{ id: TestimonialCategory; label: string }[]>(
    () => [
      { id: 'all', label: language === 'id' ? 'Semua' : 'All' },
      { id: 'siswa', label: language === 'id' ? 'Siswa' : 'Students' },
      { id: 'orangtua', label: language === 'id' ? 'Orang Tua' : 'Parents' },
      { id: 'supplier', label: 'Supplier' },
      { id: 'guru', label: language === 'id' ? 'Guru' : 'Teachers' },
      { id: 'pekerja-sppg', label: language === 'id' ? 'Pekerja SPPG' : 'SPPG Staff' },
      { id: 'pemerintah-daerah', label: language === 'id' ? 'Pemerintah Daerah' : 'Local Government' },
      { id: 'lembaga-internasional', label: language === 'id' ? 'Lembaga Internasional' : 'International Org.' },
    ],
    [language],
  );
  const filteredTestimonials = useMemo(
    () =>
      testimonialCategory === 'all'
        ? testimonials
        : testimonials.filter((item) => item.category === testimonialCategory),
    [testimonialCategory, testimonials],
  );
  const nonQuantifiable = ui.nonQuantifiable;
  const teamProfiles = selectedSppg.teamProfiles[language];
  const kitchenProfile = useMemo(() => {
    const kitchenMember = teamProfiles
      .flatMap((profile) => profile.members)
      .find((member) => member.kitchenProfile);

    return kitchenMember?.kitchenProfile ?? null;
  }, [teamProfiles]);
  const mapUrl = getGoogleMapsUrl(localizedAddress || localizedRegion);
  const schoolMapLabel = language === 'id' ? 'Buka di Google Maps' : 'Open in Google Maps';

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = language;
  }, [language, mounted]);

  useEffect(() => {
    if (recipeCollection.items.length === 0) {
      return;
    }
    if (!activeRecipeId || !recipeCollection.items.some((item) => item.id === activeRecipeId)) {
      setActiveRecipeId(recipeCollection.items[0].id);
    }
  }, [activeRecipeId, recipeCollection.items]);

  useEffect(() => {
    if (!isRecipeOpen) return;
    setRecipeStep(0);
  }, [isRecipeOpen, activeRecipeId]);

  useEffect(() => {
    if (!isAnyModalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isPartnerOpen) {
          setActivePartnerIndex(null);
          return;
        }
        if (isRecipeOpen) {
          setIsRecipeOpen(false);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAnyModalOpen, isPartnerOpen, isRecipeOpen]);

  useEffect(() => {
    if (!isAnyModalOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isAnyModalOpen]);

  useEffect(() => {
    if (!languageMenuOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!languageMenuRef.current) return;
      if (!languageMenuRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [languageMenuOpen]);

  const unitStats = useMemo(() => {
    const totalStudents = selectedSppg.schools.reduce((acc, s) => acc + s.students, 0);
    const delivered = selectedSppg.schools.filter((s) => s.status === 'delivered').reduce((acc, s) => acc + s.students, 0);
    return { totalStudents, delivered };
  }, [selectedSppg]);

  const healthCenterStats = useMemo(() => {
    const centers = selectedSppg.healthCenters ?? [];
    const totalFacilities = centers.length;
    const totalPuskesmas = centers.filter((center) => center.type === 'puskesmas').length;
    const totalPosyandu = centers.filter((center) => center.type === 'posyandu').length;
    const totalPregnantNursing = centers.reduce((acc, center) => acc + center.pregnantNursing, 0);
    const totalToddlers = centers.reduce((acc, center) => acc + center.toddlers, 0);
    const totalBeneficiaries = totalPregnantNursing + totalToddlers;
    return {
      totalFacilities,
      totalPuskesmas,
      totalPosyandu,
      totalPregnantNursing,
      totalToddlers,
      totalBeneficiaries,
    };
  }, [selectedSppg]);

  const hasHealthCenters = healthCenterStats.totalFacilities > 0;
  const activeRecipe = recipeCollection.items.find((item) => item.id === activeRecipeId) ?? recipeCollection.items[0] ?? null;
  const recipeDetailSteps = [recipeCollection.overviewLabel, recipeCollection.ingredientsLabel, recipeCollection.stepsLabel];
  const getRecipeNutritionIcon = (label: string) => {
    const key = label.toLowerCase();
    if (key.includes('ener') || key.includes('kalori') || key.includes('calorie')) return Flame;
    if (key.includes('protein')) return BicepsFlexed;
    if (key.includes('lemak') || key.includes('fat')) return Droplet;
    if (key.includes('karbo') || key.includes('carb')) return Wheat;
    return Info;
  };

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(language === 'en' ? 'en-US' : 'id-ID'),
    [language],
  );
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(language === 'en' ? 'en-US' : 'id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }),
    [language],
  );
  const headerStats = useMemo(() => {
    if (!kitchenProfile) return null;
    const startDate = new Date(kitchenProfile.operationalSince);
    const locale = language === 'id' ? 'id-ID' : 'en-US';
    const formatter = new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const formattedSince = formatter.format(startDate);
    const displaySince = language === 'id' ? formattedSince.replace(',', '') : formattedSince;
    const now = new Date();
    let serviceMonths = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
    if (now.getDate() < startDate.getDate()) {
      serviceMonths -= 1;
    }
    return {
      operationalSince: displaySince,
      serviceMonths: Math.max(serviceMonths, 0),
      dailyMeals: kitchenProfile.totalDailyMeals,
      totalStaff: kitchenProfile.totalStaff ?? 0,
      totalServings: kitchenProfile.totalDailyMeals * kitchenProfile.operatingDays,
      operatingHours: kitchenProfile.operatingHours,
      operatingDays: kitchenProfile.operatingDays,
    };
  }, [kitchenProfile, language]);
  const schoolsServedCount = selectedSppg.schools.length;
  const healthFacilitiesServedCount = healthCenterStats.totalFacilities;
  const supplierCount = useMemo(() => {
    const suppliers = selectedSppg.suppliers ?? [];
    if (suppliers.length === 0) return 0;
    const supplierNames = suppliers.map((item) =>
      typeof item.supplier === 'string' ? item.supplier : item.supplier.name,
    );
    return new Set(supplierNames).size;
  }, [selectedSppg.suppliers]);
  const menuDateLabel = useMemo(() => {
    const locale = language === 'en' ? 'en-US' : 'id-ID';
    const formatter = new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const formatted = formatter.format(new Date());
    return language === 'id' ? formatted.replace(',', '') : formatted;
  }, [language]);
  const deliveryProgress = selectedSppg.deliveryProgress ?? {
    target: 2900,
    cooked: 0,
    inDelivery: 0,
    received: 0,
  };
  const deliveryCardStyles = {
    target: {
      headerBg: 'bg-red-700',
      iconWrap: 'bg-white/15',
      icon: 'text-white',
      label: 'text-white',
      value: 'text-red-600',
      border: 'border-red-700/40',
    },
    cooked: {
      headerBg: 'bg-amber-600',
      iconWrap: 'bg-white/15',
      icon: 'text-white',
      label: 'text-white',
      value: 'text-amber-600',
      border: 'border-amber-600/40',
    },
    inDelivery: {
      headerBg: 'bg-sky-700',
      iconWrap: 'bg-white/15',
      icon: 'text-white',
      label: 'text-white',
      value: 'text-sky-600',
      border: 'border-sky-700/40',
    },
    received: {
      headerBg: 'bg-emerald-700',
      iconWrap: 'bg-white/15',
      icon: 'text-white',
      label: 'text-white',
      value: 'text-emerald-600',
      border: 'border-emerald-700/40',
    },
  };

  const languageLabel = language === 'en' ? ui.languageMenu.english : ui.languageMenu.indonesian;
  const languageFlag = language === 'en' ? '/flags/us.svg' : '/flags/id.svg';
  const languageFlagAlt = language === 'en' ? ui.languageMenu.usFlagAlt : ui.languageMenu.idFlagAlt;
  const navToggleLabel = language === 'id' ? 'Navigasi' : 'Navigation';
  const nutritionIconMap: Record<string, IconType> = {
    Calories: Flame,
    Protein: BicepsFlexed,
    Fat: Droplet,
    Carbs: Wheat,
    Kalori: Flame,
    Lemak: Droplet,
    Karbohidrat: Wheat,
  };
  const menuComponentIcons: Record<string, IconType> = {
    Staple: Wheat,
    'Main Dish': Beef,
    'Side Dish': Soup,
    Vegetable: Salad,
    Fruit: Apple,
    Milk: Milk,
    Karbohidrat: Wheat,
    'Makanan Pokok': Wheat,
    Lauk: Beef,
    Pauk: Soup,
    Sayur: Salad,
    Sayuran: Salad,
    'Buah-Buahan': Apple,
    Buah: Apple,
    Susu: Milk,
  };
  const menuComponentLabels: Record<string, string> = {
    'Makanan Pokok': 'Karbohidrat',
    Sayur: 'Sayuran',
    Buah: 'Buah-Buahan',
  };
  const dailyMenuCard = (
    <div id="menu-daily" className="bg-card rounded-2xl border border-border shadow-lg p-8 scroll-mt-28">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-1/3 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-primary/15 rounded-lg text-primary"><Utensils size={20} /></div>
            <div>
              <h3 className="font-bold text-lg text-foreground uppercase tracking-tight">{ui.dailyMenu.title}</h3>
              <p className="text-xs font-semibold text-muted-foreground tracking-wide">{menuDateLabel}</p>
            </div>
          </div>
          <div className="aspect-video bg-secondary rounded-xl border border-border overflow-hidden">
            <img
              src={dailyMenu.photo}
              alt={ui.dailyMenu.imageAlt}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <h4 className="text-2xl font-bold text-foreground leading-snug">{dailyMenu.name}</h4>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-secondary p-6 rounded-xl border border-border">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2"><Zap size={13} className="text-primary" /> {ui.dailyMenu.nutrition}</p>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(dailyMenu.nutrition).slice(0, 4).map(([k, v], i) => {
                  const NutrientIcon = nutritionIconMap[k] ?? Info;
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <NutrientIcon size={12} />
                        </span>
                        <span>{k}</span>
                      </div>
                      <p className="text-lg font-bold text-foreground">{v}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-secondary p-6 rounded-xl border border-border">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                <Soup size={13} className="text-primary" /> {ui.dailyMenu.menuComponents}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(dailyMenu.components).map(([k, v], i) => {
                  const ComponentIcon = menuComponentIcons[k] ?? Utensils;
                  const label = menuComponentLabels[k] ?? k;
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <ComponentIcon size={12} />
                        </span>
                        <span className="truncate">{label}</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground leading-snug">{v}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const nonQuantifiableIcons: IconType[] = [Heart, UserPlus, MessageSquare, Globe, Apple];

  const navSections = useMemo(() => {
    const labelFor = (id: string) => ui.tabs.find((tab) => tab.id === id)?.label ?? id;

    return [
        {
          id: 'overview',
          label: labelFor('overview'),
          items: [
            { id: 'overview-gallery', label: ui.gallery.title },
            { id: 'overview-surveillance', label: ui.surveillance.liveFeeds },
            { id: 'overview-delivery', label: ui.stats.title },
            { id: 'overview-operations', label: language === 'id' ? 'Operasional Dapur' : 'Kitchen Operations' },
            { id: 'overview-beneficiaries', label: beneficiaryHeading },
            { id: 'overview-testimonials', label: ui.beneficiaries.testimonialsTitle },
            { id: 'overview-schools', label: language === 'id' ? 'Rincian Distribusi Sekolah' : 'School Distribution Details' },
            { id: 'overview-suppliers', label: ui.supplier.title },
          ],
      },
      {
        id: 'profil',
        label: labelFor('profil'),
        items: [
          { id: 'profil-ffi', label: ui.sections.aboutFfi },
          { id: 'profil-wfp', label: ui.sections.aboutWfp },
          { id: 'profil-team', label: language === 'id' ? 'Profil Tim' : 'Team Profiles' },
        ],
      },
      {
        id: 'menu',
        label: labelFor('menu'),
        items: [
          { id: 'menu-history', label: ui.sections.menuHistoryTitle },
          { id: 'menu-recipes', label: ui.sections.recipeCollectionTitle },
        ],
      },
      {
        id: 'research',
        label: labelFor('research'),
        items: [
          { id: 'research-report', label: ui.impact.reportTitle },
          { id: 'research-nonquant', label: ui.sections.nonQuantifiable },
          { id: 'research-sroi', label: ui.sections.sroi },
          { id: 'research-economic', label: ui.sections.economic },
        ],
      },
    ];
  }, [language, ui, beneficiaryHeading]);

  const scrollToSection = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const scrollTestimonials = useCallback((direction: 'prev' | 'next') => {
    const track = testimonialTrackRef.current;
    if (!track) {
      return;
    }
    const scrollAmount = Math.max(track.clientWidth * 0.85, 280);
    track.scrollBy({ left: direction === 'next' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
  }, []);

  const scrollRecipes = useCallback((direction: 'prev' | 'next') => {
    const track = recipeTrackRef.current;
    if (!track) {
      return;
    }
    const scrollAmount = Math.max(track.clientWidth * 0.9, 320);
    track.scrollBy({ left: direction === 'next' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
  }, []);

  const handleSectionNavigation = (sectionId: string, targetId?: string) => {
    const scrollTarget = targetId ?? sectionId;
    if (activeSection === sectionId) {
      scrollToSection(scrollTarget);
      return;
    }
    pendingScrollTargetRef.current = scrollTarget;
    setActiveSection(sectionId);
  };

  useEffect(() => {
    if (!pendingScrollTargetRef.current) return;
    const targetId = pendingScrollTargetRef.current;
    pendingScrollTargetRef.current = null;
    requestAnimationFrame(() => {
      const section = document.getElementById(targetId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }, [activeSection]);

  useEffect(() => {
    const track = testimonialTrackRef.current;
    if (track) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [testimonialCategory]);

  const schoolTypeLabels = {
    en: {
      elementary: 'Elementary',
      juniorHigh: 'Junior High',
      seniorHigh: 'Senior High',
    },
    id: {
      elementary: 'SD',
      juniorHigh: 'SMP',
      seniorHigh: 'SMA',
    },
  } as const;

  const schoolStatusLabels = {
    en: {
      active: 'Active',
      delivered: 'Delivered Successfully',
    },
    id: {
      active: 'Aktif',
      delivered: 'Terkirim Berhasil',
    },
  } as const;

  const fleetStatusLabels = {
    en: {
      delivered: 'Delivered',
      onRoute: 'On Route',
    },
    id: {
      delivered: 'Terkirim',
      onRoute: 'Dalam Perjalanan',
    },
  } as const;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans antialiased text-foreground">
      {/* Header Navigation */}
      <nav className="bg-card border-b border-border px-6 py-4 sticky top-0 z-50 backdrop-blur-xl bg-opacity-95 relative grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <FFILogo className="h-7 w-auto sm:h-8" alt={ui.footer.ffiLogoAlt} />
            <div className="flex items-center gap-2 sm:gap-3 pl-1">
              <img
                src="/bgn-logo.png"
                alt={ui.bgnLogoAlt}
                className="h-8 w-auto sm:h-9"
                loading="eager"
                decoding="async"
              />
              <img
                src="/wfp-logo.png"
                alt={ui.wfpLogoAlt}
                className="h-8 w-auto sm:h-9"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
          <div className="hidden md:block h-10 w-px bg-border"></div>
          <div className="min-w-0 space-y-1">
            <h1 className="font-semibold text-base sm:text-lg text-foreground leading-tight truncate">{ui.navTitle}</h1>
            <p className="hidden md:block text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {ui.navSubtitle}
            </p>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-2 justify-self-center">
          {navSections.map((section) => (
            <div key={section.id} className="relative group">
              <button
                type="button"
                onClick={() => handleSectionNavigation(section.id)}
                aria-current={section.id === activeSection ? 'page' : undefined}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-bold uppercase tracking-wider transition ${
                  section.id === activeSection ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {section.label}
                <ChevronDown
                  size={12}
                  className={`transition ${section.id === activeSection ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}
                />
              </button>
              <div
                role="menu"
                className="absolute left-0 mt-2 min-w-[220px] rounded-xl border border-border bg-card p-1 shadow-xl opacity-0 pointer-events-none translate-y-2 transition group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0"
              >
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    onClick={() => handleSectionNavigation(section.id, item.id)}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-semibold text-muted-foreground transition hover:bg-secondary/70 hover:text-foreground"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 justify-self-end">
          <details className="relative lg:hidden group">
            <summary className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-bold uppercase tracking-wider text-foreground shadow-sm transition hover:border-primary/40 hover:bg-secondary/80 [&::-webkit-details-marker]:hidden">
              <span>{navToggleLabel}</span>
              <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-border bg-card p-2 shadow-xl">
              {navSections.map((section) => (
                <div key={section.id} className="p-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{section.label}</p>
                  <div className="mt-2 space-y-1">
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSectionNavigation(section.id, item.id)}
                        className="flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-semibold text-muted-foreground transition hover:bg-secondary/70 hover:text-foreground"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>

          <div className="relative" ref={languageMenuRef}>
            <button
              type="button"
              onClick={() => setLanguageMenuOpen((open) => !open)}
              className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-xs font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-secondary/80"
              aria-haspopup="menu"
              aria-expanded={languageMenuOpen}
              aria-label={ui.languageMenu.ariaLabel}
            >
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex h-4 w-6 items-center justify-center overflow-hidden rounded-[3px] border border-border/60 bg-white">
                  <img src={languageFlag} alt={languageFlagAlt} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                </span>
                <span className="hidden sm:inline text-[11px] font-semibold">{languageLabel}</span>
              </span>
              <ChevronDown size={14} className={`transition-transform ${languageMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {languageMenuOpen && (
              <div role="menu" className="absolute right-0 mt-2 min-w-[190px] rounded-lg border border-border bg-card p-1 shadow-xl">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    updateLanguage('en');
                    setLanguageMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition ${language === 'en' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'}`}
                >
                  <span className="inline-flex h-4 w-6 items-center justify-center overflow-hidden rounded-[3px] border border-border/60 bg-white">
                    <img src="/flags/us.svg" alt={ui.languageMenu.usFlagAlt} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                  </span>
                  {ui.languageMenu.english}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    updateLanguage('id');
                    setLanguageMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition ${language === 'id' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'}`}
                >
                  <span className="inline-flex h-4 w-6 items-center justify-center overflow-hidden rounded-[3px] border border-border/60 bg-white">
                    <img src="/flags/id.svg" alt={ui.languageMenu.idFlagAlt} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                  </span>
                  {ui.languageMenu.indonesian}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 p-8 w-full space-y-8 animate-in fade-in duration-500">
        {/* Unit Header */}
        <header className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 md:p-7 shadow-md">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] xl:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:items-start">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3.5 rounded-2xl text-primary shadow-sm ring-1 ring-primary/10">
                <Store size={26} />
              </div>
              <div className="flex-1 space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{localizedName}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-secondary/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                    {ui.operationalHub}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                    {ui.activeStatus}
                  </span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {ui.kitchenLocationLabel}
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-semibold transition hover:text-foreground"
                    aria-label={ui.mapAriaLabel}
                  >
                    <MapPin size={14} className="text-primary" />
                    <span>{localizedRegion}</span>
                  </a>
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-2 text-xs leading-relaxed transition hover:text-foreground"
                  >
                    <Navigation size={14} className="mt-0.5 text-primary" />
                    <span className="max-w-2xl">{localizedAddress}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:justify-self-end lg:w-full">
              <div className="space-y-4 rounded-2xl border border-border bg-secondary/40 p-4 shadow-sm">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.32em] text-muted-foreground">
                  {ui.headerHighlights.partnersTitle}
                </p>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <FFILogo
                    className="h-10 w-auto opacity-90 transition-opacity hover:opacity-100 sm:h-12 lg:h-14"
                    alt={ui.footer.ffiLogoAlt}
                  />
                  <img
                    src="/bgn-logo.png"
                    alt={ui.bgnLogoAlt}
                    className="h-10 w-auto opacity-90 transition-opacity hover:opacity-100 sm:h-12 lg:h-14"
                    loading="lazy"
                    decoding="async"
                  />
                  <img
                    src="/wfp-logo.png"
                    alt={ui.wfpLogoAlt}
                    className="h-10 w-auto opacity-90 transition-opacity hover:opacity-100 sm:h-12 lg:h-14"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>

          {headerStats && (
            <div className="w-full relative z-10">
              <div className="rounded-2xl border border-border bg-secondary/20 p-5 md:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
                    {ui.headerStats.title}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  <div className="flex h-full items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <CalendarDays size={16} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {ui.headerStats.operatingSince}
                      </p>
                      <p className="text-lg font-bold text-foreground whitespace-nowrap">{headerStats.operationalSince}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 whitespace-nowrap">
                        {numberFormatter.format(headerStats.serviceMonths)} {ui.headerStats.monthsServing}
                      </p>
                    </div>
                  </div>
                  <div className="flex h-full items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Utensils size={16} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {ui.headerStats.dailyMeals}
                      </p>
                      <p className="inline-flex items-baseline gap-1 text-lg font-bold text-foreground whitespace-nowrap">
                        {numberFormatter.format(headerStats.dailyMeals)}
                        <span className="text-[10px] font-semibold text-muted-foreground">{ui.headerStats.dailyMealsUnit}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex h-full items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Clock size={16} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {ui.headerStats.operatingHours}
                      </p>
                      <p className="text-lg font-bold text-foreground whitespace-nowrap">{headerStats.operatingHours}</p>
                    </div>
                  </div>
                  <div className="flex h-full items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <School size={16} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {ui.headerStats.schoolsServed}
                      </p>
                      <p className="inline-flex items-baseline gap-1 text-lg font-bold text-foreground whitespace-nowrap">
                        {numberFormatter.format(schoolsServedCount)}
                        <span className="text-[10px] font-semibold text-muted-foreground">{ui.headerStats.schoolsUnit}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex h-full items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Hospital size={16} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {ui.headerStats.healthFacilitiesServed}
                      </p>
                      <p className="text-lg font-bold text-foreground whitespace-nowrap">{numberFormatter.format(healthFacilitiesServedCount)}</p>
                    </div>
                  </div>
                  <div className="flex h-full items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <UserPlus size={16} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {ui.headerStats.staffCount}
                      </p>
                      <p className="text-lg font-bold text-foreground whitespace-nowrap">{numberFormatter.format(headerStats.totalStaff)}</p>
                    </div>
                  </div>
                  <div className="flex h-full items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Store size={16} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {ui.headerStats.supplierCount}
                      </p>
                      <p className="text-lg font-bold text-foreground whitespace-nowrap">{numberFormatter.format(supplierCount)}</p>
                    </div>
                  </div>
                  <div className="flex h-full items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Soup size={16} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {ui.headerStats.totalServings}
                      </p>
                      <p className="inline-flex items-baseline gap-1 text-lg font-bold text-foreground whitespace-nowrap">
                        {numberFormatter.format(headerStats.totalServings)}
                        <span className="text-[10px] font-semibold text-muted-foreground">{ui.headerStats.totalServingsUnit}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex h-full items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BadgeCheck size={16} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {ui.headerStats.certifications}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {ui.headerStats.certificationLabels.map((label) => (
                          <span key={label} className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm ring-1 ring-primary/15">
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>

        {activeSection === 'overview' && (
          <>
            <section
              id="overview-beneficiaries"
              className="scroll-mt-28 animate-in fade-in duration-500 mt-2"
            >
              <div className="bg-card rounded-2xl border border-border shadow-lg p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-primary/15 rounded-lg text-primary">
                    <Heart size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {beneficiaryHeading}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'id' ? 'Highlight dampak penerima manfaat' : 'Beneficiary impact at a glance'}
                    </p>
                  </div>
                </div>
                <BeneficiaryCategories data={beneficiaryHighlights} />
              </div>
            </section>

            <section className="space-y-8">
              {/* DAILY MENU HIGHLIGHT */}
              {dailyMenuCard}
            </section>
          </>
        )}

        {activeSection === 'overview' && (
          <section id="overview" className="space-y-8 scroll-mt-28 animate-in slide-in-from-bottom duration-500">
            {/* GALLERY SECTION */}
            <div id="overview-gallery" className="scroll-mt-28">
              <Gallery
                title={ui.gallery.title}
                items={ui.gallery.items}
                language={language}
              />
            </div>

            {/* BENEFICIARY TESTIMONIALS */}
            <div id="overview-testimonials" className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden scroll-mt-28">
              <div className="p-6 border-b border-border bg-secondary/50">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h3 className="font-bold text-foreground text-base flex items-center gap-3 uppercase tracking-tight">
                    <div className="p-2.5 bg-primary/15 rounded-lg text-primary"><MessageSquare size={20} /></div>
                    {ui.beneficiaries.testimonialsTitle}
                  </h3>
                  <div className="flex items-center gap-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      {filteredTestimonials.length} {ui.beneficiaries.testimonialsCountLabel}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => scrollTestimonials('prev')}
                        aria-label={language === 'id' ? 'Geser testimoni ke kiri' : 'Scroll testimonials left'}
                        className="h-9 w-9 rounded-full border border-border bg-background text-muted-foreground flex items-center justify-center transition hover:border-primary/40 hover:text-primary"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollTestimonials('next')}
                        aria-label={language === 'id' ? 'Geser testimoni ke kanan' : 'Scroll testimonials right'}
                        className="h-9 w-9 rounded-full border border-border bg-background text-muted-foreground flex items-center justify-center transition hover:border-primary/40 hover:text-primary"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 max-w-3xl">{ui.beneficiaries.testimonialsSubtitle}</p>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                  {testimonialCategories.map((cat) => {
                    const Icon = testimonialCategoryIcons[cat.id];
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setTestimonialCategory(cat.id)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border transition ${
                          testimonialCategory === cat.id
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                        }`}
                      >
                        <Icon size={12} className="text-current" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="p-6">
                <div ref={testimonialTrackRef} className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 no-scrollbar">
                  {filteredTestimonials.map((item, idx) => (
                    <div key={item.id} className="min-w-[260px] sm:min-w-[300px] md:min-w-[340px] lg:min-w-[360px] snap-start bg-secondary rounded-xl border border-border p-6 shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full overflow-hidden border border-border bg-muted">
                            <img
                              src={item.photo}
                              alt={language === 'id' ? `Foto ${item.name}` : `${item.name} photo`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{item.name}</p>
                            <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wide">{item.role}</p>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                          {(idx + 1).toString().padStart(2, '0')}
                        </div>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
                      {item.highlight ? (
                        <p className="text-xs text-primary font-semibold mt-3">{item.highlight}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
        
            {/* 1. SURVEILLANCE */}
            <div id="overview-surveillance" className="grid grid-cols-1 gap-8 scroll-mt-28">
              <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden flex flex-col transition-all hover:border-primary/40">
                <div className="p-5 border-b border-border flex justify-between items-center bg-secondary/50">
                  <h3 className="font-bold text-foreground text-sm uppercase tracking-wider flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div> {ui.surveillance.liveFeeds}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2 p-2 bg-secondary flex-1">
                  {cctvFeeds.map((feed, idx) => (
                    <div key={idx} className="relative aspect-video bg-input flex items-center justify-center group overflow-hidden rounded-lg border border-border hover:border-primary/50 transition-colors">
                      <div className="absolute top-2.5 left-2.5 z-20 bg-background/70 px-2.5 py-1 rounded text-[9px] text-foreground font-bold uppercase tracking-widest backdrop-blur-md">CAM {idx+1}</div>
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Video size={32} className="text-muted-foreground" />
                        <div className="text-center leading-tight">
                          <p className="text-[10px] font-semibold uppercase tracking-widest">{ui.surveillance.placeholder}</p>
                          <p className="text-[11px] font-semibold text-foreground/70">{feed}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        
            {/* 2. TODAY'S DELIVERY */}
            <div id="overview-delivery" className="space-y-4 scroll-mt-28">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/15 rounded-lg text-primary"><Truck size={20} /></div>
                <h3 className="font-bold text-foreground text-lg uppercase tracking-tight">{ui.stats.title}</h3>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: ui.stats.target, val: numberFormatter.format(deliveryProgress.target), icon: ClipboardCheck, tone: deliveryCardStyles.target },
          { label: ui.stats.cooked, val: numberFormatter.format(deliveryProgress.cooked), icon: Utensils, tone: deliveryCardStyles.cooked },
          { label: ui.stats.inDelivery, val: numberFormatter.format(deliveryProgress.inDelivery), icon: Truck, tone: deliveryCardStyles.inDelivery },
          { label: ui.stats.received, val: numberFormatter.format(deliveryProgress.received), icon: CheckCircle2, tone: deliveryCardStyles.received },
        ].map((stat, i) => (
          <div
            key={i}
            className={`rounded-lg border shadow-md overflow-hidden grid grid-rows-2 min-h-[120px] transition-all hover:shadow-lg ${stat.tone.border}`}
          >
            <div className={`${stat.tone.headerBg} px-4 py-3 flex items-center justify-center`}>
              <p className={`text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${stat.tone.label}`}>
                <span className={`flex h-6 w-6 items-center justify-center rounded-md ${stat.tone.iconWrap}`}>
                  <stat.icon size={13} className={stat.tone.icon} />
                </span>
                {stat.label}
              </p>
            </div>
            <div className="bg-white px-4 py-4 flex items-center justify-center">
              <p className={`text-3xl font-bold ${stat.tone.value}`}>{stat.val}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

            {/* 3. SCHOOL REGISTRY - DETAILED */}
            <div id="overview-schools" className="scroll-mt-28">
              <SchoolsDetail schools={selectedSppg.schools} healthCenters={selectedSppg.healthCenters} language={language} />
            </div>
        
            {/* 4. SUPPLIER MANAGEMENT */}
            <div id="overview-suppliers" className="scroll-mt-28">
              <SupplierManagement items={selectedSppg.suppliers} title={ui.supplier.title} language={language} />
            </div>

            {/* PARTNER INSTITUTIONS */}
            <div id="overview-partners" className="scroll-mt-28">
              <div className="bg-card rounded-2xl border border-border shadow-lg p-8">
                <div className="text-center mb-8">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{ui.partners.eyebrow}</p>
                  <h3 className="text-2xl font-bold text-foreground mt-2">{ui.partners.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto">{ui.partners.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ui.partners.items.map((partner, index) => {
                    const badgeColor = partnerLogoPalette[index % partnerLogoPalette.length];
                    return (
                      <button
                        key={partner.name}
                        type="button"
                        onClick={() => setActivePartnerIndex(index)}
                        className="bg-secondary rounded-xl border border-border p-4 text-left shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 group"
                        aria-haspopup="dialog"
                        aria-label={language === 'id' ? `Buka detail ${partner.name}` : `Open details for ${partner.name}`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`h-12 w-12 rounded-full border border-border flex items-center justify-center text-xs font-bold ${badgeColor}`}
                          >
                            {getPartnerInitials(partner.name)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{partner.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{partner.description}</p>
                          </div>
                        </div>
                        <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                          {ui.partners.cta}
                          <ChevronRight size={12} className="transition group-hover:translate-x-0.5" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}
        
        {activeSection === 'menu' && (
          <section id="menu" className="space-y-10 scroll-mt-28 animate-in slide-in-from-bottom duration-500">
            {/* DAILY MENU FEED (TOP SECTION) */}
            {dailyMenuCard}
        
            {/* MENU HISTORY SECTION */}
            <div id="menu-history" className="mt-16 pt-12 border-t border-border scroll-mt-28">
              <h2 className="text-3xl font-bold text-foreground mb-8">{ui.sections.menuHistory}</h2>
              <MenuHistory 
                menus={menuHistory}
                title={ui.sections.menuHistoryTitle}
                language={language}
                onDateRangeChange={(range) => console.log(language === 'id' ? `Rentang tanggal: ${range} hari` : `Date range: ${range} days`)}
              />
            </div>

            <div id="menu-recipes" className="mt-16 pt-12 border-t border-border scroll-mt-28">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">{recipeCollection.title}</h2>
                  <p className="text-sm text-muted-foreground mt-2 max-w-3xl">{recipeCollection.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-xs font-semibold text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    {recipeCollection.items.length} {recipeCollection.countLabel}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => scrollRecipes('prev')}
                      aria-label={language === 'id' ? 'Geser resep ke kiri' : 'Scroll recipes left'}
                      className="h-9 w-9 rounded-full border border-border bg-background text-muted-foreground flex items-center justify-center transition hover:border-primary/40 hover:text-primary"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollRecipes('next')}
                      aria-label={language === 'id' ? 'Geser resep ke kanan' : 'Scroll recipes right'}
                      className="h-9 w-9 rounded-full border border-border bg-background text-muted-foreground flex items-center justify-center transition hover:border-primary/40 hover:text-primary"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div ref={recipeTrackRef} className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pr-4 no-scrollbar">
                  {recipeCollection.items.map((recipe) => {
                    const isActive = recipe.id === activeRecipe?.id;
                    return (
                      <button
                        key={recipe.id}
                        type="button"
                        onClick={() => {
                          setActiveRecipeId(recipe.id);
                          setIsRecipeOpen(true);
                        }}
                        aria-pressed={isActive}
                        className={`group relative min-w-[240px] sm:min-w-[260px] lg:min-w-[280px] snap-start overflow-hidden rounded-2xl border bg-card/90 text-left backdrop-blur transition transform ${
                          isActive
                            ? 'border-primary/70 shadow-lg ring-2 ring-primary/15 scale-[1.01]'
                            : 'border-border shadow-sm hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg'
                        }`}
                      >
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={recipe.image}
                            alt={language === 'id' ? `Foto ${recipe.title}` : `${recipe.title} photo`}
                            className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent"></div>
                          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-primary shadow-sm">
                            <Clock size={12} className="text-primary" />
                            {recipe.cookTime}
                          </span>
                        </div>
                        <div className="p-4 space-y-3 bg-gradient-to-b from-card/70 via-card/60 to-card">
                          <div className="space-y-1">
                            <h3 className="text-lg font-bold text-foreground leading-tight">{recipe.title}</h3>
                            <p className="text-[12px] text-muted-foreground line-clamp-1">{recipe.head}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {recipe.nutrition.map((item) => {
                              const NutrientIcon = getRecipeNutritionIcon(item.label);
                              return (
                                <div
                                  key={item.label}
                                  className="rounded-xl border border-border/70 bg-white/70 p-2.5 shadow-sm backdrop-blur-sm transition group-hover:-translate-y-0.5"
                                >
                                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-1.5">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/10">
                                      <NutrientIcon size={12} />
                                    </span>
                                    {item.label}
                                  </p>
                                  <p className="text-sm font-bold text-foreground mt-1.5">{item.value}</p>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex items-center justify-end text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                              <Clock size={12} className="text-primary" />
                              {recipeCollection.cookTimeLabel}: <span className="font-semibold text-foreground">{recipe.cookTime}</span>
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}
        
        {activeSection === 'beneficiaries' && (
          <section id="beneficiaries" className="space-y-10 scroll-mt-28 animate-in slide-in-from-bottom duration-500">
            {/* BENEFICIARY CATEGORIES */}
            <div id="beneficiaries-summary" className="scroll-mt-28">
              <h3 className="font-bold text-foreground text-xl uppercase tracking-tight mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-primary rounded-full"></div>{beneficiaryHeading}
              </h3>
              <BeneficiaryCategories data={selectedSppg.beneficiaries[language]} />
            </div>
        
            {/* SCHOOLS BENEFITING & STATISTICS */}
            <div id="beneficiaries-schools" className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden scroll-mt-28">
              <div className="p-6 border-b border-border bg-secondary/50">
                <h3 className="font-bold text-foreground text-base flex items-center gap-3 uppercase tracking-tight">
                  <div className="p-2.5 bg-primary/15 rounded-lg text-primary"><School size={20} /></div> {ui.schools.receivingBenefits}
                </h3>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-secondary p-6 rounded-lg border border-border text-center">
                    <p className="text-3xl font-bold text-primary">{selectedSppg.schools.length}</p>
                    <p className="text-sm font-semibold text-muted-foreground mt-2">{ui.schools.schools}</p>
                  </div>
                  <div className="bg-secondary p-6 rounded-lg border border-border text-center">
                    <p className="text-3xl font-bold text-primary">{unitStats.totalStudents.toLocaleString()}</p>
                    <p className="text-sm font-semibold text-muted-foreground mt-2">{ui.schools.totalBeneficiaries}</p>
                  </div>
                  <div className="bg-secondary p-6 rounded-lg border border-border text-center">
                    <p className="text-3xl font-bold text-primary">{unitStats.delivered.toLocaleString()}</p>
                    <p className="text-sm font-semibold text-muted-foreground mt-2">{ui.schools.mealsDelivered}</p>
                  </div>
                  <div className="bg-secondary p-6 rounded-lg border border-border text-center">
                    <p className="text-3xl font-bold text-primary">100%</p>
                    <p className="text-sm font-semibold text-muted-foreground mt-2">{ui.schools.coverageRate}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {selectedSppg.schools.map((school, idx) => (
                    <div key={school.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">{idx + 1}</div>
                        <div className="flex-1">
                          <p className="font-bold">
                            <a
                              href={getGoogleMapsUrl(school.name)}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors"
                              aria-label={`${schoolMapLabel}: ${school.name}`}
                            >
                              {school.name}
                              <MapPin size={12} className="text-primary" />
                            </a>
                          </p>
                          <p className="text-[11px] text-muted-foreground">{schoolTypeLabels[language][school.type]}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{school.students} {ui.schools.students}</p>
                        <p className={`text-[11px] font-semibold ${school.status === 'delivered' ? 'text-primary' : 'text-muted-foreground'}`}>{schoolStatusLabels[language][school.status]}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {hasHealthCenters ? (
                  <div className="mt-10 border-t border-border pt-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-rose-500/15 rounded-lg text-rose-500"><Heart size={18} /></div>
                        <h4 className="font-bold text-foreground text-sm uppercase tracking-tight">{ui.schools.healthFacilities}</h4>
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        {ui.schools.healthBeneficiaries}: {numberFormatter.format(healthCenterStats.totalBeneficiaries)}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-secondary p-4 rounded-lg border border-border text-center">
                        <p className="text-2xl font-bold text-foreground">{numberFormatter.format(healthCenterStats.totalFacilities)}</p>
                        <p className="text-xs font-semibold text-muted-foreground mt-1">{ui.schools.totalFacilities}</p>
                      </div>
                      <div className="bg-secondary p-4 rounded-lg border border-border text-center">
                        <p className="text-2xl font-bold text-foreground">{numberFormatter.format(healthCenterStats.totalPuskesmas)}</p>
                        <p className="text-xs font-semibold text-muted-foreground mt-1">{ui.schools.puskesmas}</p>
                      </div>
                      <div className="bg-secondary p-4 rounded-lg border border-border text-center">
                        <p className="text-2xl font-bold text-foreground">{numberFormatter.format(healthCenterStats.totalPosyandu)}</p>
                        <p className="text-xs font-semibold text-muted-foreground mt-1">{ui.schools.posyandu}</p>
                      </div>
                      <div className="bg-secondary p-4 rounded-lg border border-border text-center">
                        <p className="text-2xl font-bold text-foreground">{numberFormatter.format(healthCenterStats.totalBeneficiaries)}</p>
                        <p className="text-xs font-semibold text-muted-foreground mt-1">{ui.schools.healthBeneficiaries}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {selectedSppg.healthCenters?.map((center, idx) => {
                        const centerBeneficiaries = center.pregnantNursing + center.toddlers;
                        return (
                          <div key={center.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border hover:border-rose-500/40 transition-colors">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-600 flex items-center justify-center font-bold text-sm">{idx + 1}</div>
                              <div className="flex-1">
                                <p className="font-bold text-foreground">{center.name}</p>
                                <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground mt-1">
                                  <span className="inline-flex items-center rounded-full bg-rose-500/10 text-rose-600 px-2 py-0.5 font-semibold uppercase tracking-wide">
                                    {center.type === 'puskesmas' ? ui.schools.puskesmas : ui.schools.posyandu}
                                  </span>
                                  <span>{center.distance}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-foreground">
                                {numberFormatter.format(centerBeneficiaries)} {ui.schools.healthBeneficiaries}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {numberFormatter.format(center.pregnantNursing)} {ui.schools.pregnantNursing} ? {numberFormatter.format(center.toddlers)} {ui.schools.toddlers}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
        
          </section>
        )}
        
        {activeSection === 'research' && (
          <section id="research" className="space-y-10 animate-in slide-in-from-bottom duration-500 scroll-mt-28">
            {/* ================= UPDATED IMPACT REPORT (CBA & SDGs) ================= */}
            <div id="research-report" className="text-center scroll-mt-28">
              <h3 className="text-3xl font-bold text-foreground tracking-tight">{ui.impact.reportTitle}</h3>
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-[11px] mt-2">{ui.impact.reportSubtitle}</p>
            </div>
        
            {/* 1. COST BENEFIT ANALYSIS (CBA) SECTION */}
            <div className="bg-gradient-to-br from-primary/5 via-card to-emerald-50/60 dark:from-primary/10 dark:via-card dark:to-primary/5 rounded-3xl border border-border/70 shadow-xl p-8 md:p-10 overflow-hidden relative">
              <div className="absolute top-2 right-3 opacity-10 rotate-6">
                <Coins size={140} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-primary text-primary-foreground rounded-2xl shadow-lg ring-4 ring-primary/20">
                    <DollarSign size={22} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Cost Benefit Insight</p>
                    <h4 className="text-2xl font-bold text-foreground tracking-tight">{ui.impact.socialImpactTitle}</h4>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{ui.impact.cba.intro}</p>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl bg-white/80 dark:bg-secondary/80 border border-border/70 p-5 shadow-sm backdrop-blur">
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} className="text-primary" />
                    <span className="text-sm font-bold text-foreground uppercase tracking-widest">{ui.impact.cba.definitionTitle}</span>
                  </div>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    {ui.impact.cba.definitionPoints.map((point, idx) => (
                      <li key={`cba-definition-${idx}`} className="flex gap-3 items-start">
                        <CheckCircle2 size={18} className="text-primary mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-white/80 dark:bg-secondary/80 border border-border/70 p-5 shadow-sm backdrop-blur">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-primary" />
                    <span className="text-sm font-bold text-foreground uppercase tracking-widest">{ui.impact.cba.benefitsTitle}</span>
                  </div>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    {ui.impact.cba.benefitsPoints.map((point, idx) => (
                      <li key={`cba-benefits-${idx}`} className="flex gap-3 items-start">
                        <Heart size={18} className="text-rose-500 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="inline-flex items-start gap-2 text-xs text-muted-foreground bg-white/70 dark:bg-secondary/70 border border-border/60 rounded-xl px-3 py-2 shadow-sm">
                  <Info size={14} className="text-primary mt-0.5" />
                  <span className="leading-relaxed">{ui.impact.cba.disclaimer}</span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {ui.impact.cba.context.map((paragraph, idx) => (
                  <div key={`cba-context-${idx}`} className="rounded-2xl border border-border/70 bg-white/70 dark:bg-secondary/70 p-5 shadow-sm flex gap-3">
                    <LineChart size={18} className="text-primary mt-1" />
                    <p className="text-sm text-muted-foreground leading-relaxed">{paragraph}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 -mx-8 md:-mx-10">
                <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/85 px-8 py-6 text-white shadow-lg md:px-10 md:py-7">
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-20">
                    <TrendingUp size={120} />
                  </div>
                  <div className="relative max-w-2xl">
                    <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-white/85">
                      {ui.impact.sroiRatio}
                    </p>
                    <p className="text-3xl font-bold tracking-tight mt-2 md:text-4xl">{cba.sroi}</p>
                    <p className="text-sm text-white/85 mt-2">{ui.impact.socialValuePerInvestment}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <h5 className="text-lg font-bold text-foreground">{ui.impact.economicModelTitle}</h5>
                <p className="text-sm text-muted-foreground mt-2">{ui.impact.economicModelIntro}</p>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {ui.impact.economicModelPoints.map((point, idx) => {
                    const Icon = point.icon;
                    const isHighlighted = Boolean(point.stat);
                    const descriptionItems = Array.isArray(point.description) ? point.description : [point.description];

                    return (
                      <div
                        key={`${point.title}-${idx}`}
                        className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                          isHighlighted
                            ? 'border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 via-white to-white shadow-[0_16px_36px_-24px_rgba(16,185,129,0.65)]'
                            : 'border-border/70 bg-card/90 shadow-sm'
                        }`}
                      >
                        <div
                          className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                            isHighlighted
                              ? 'bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_65%)]'
                              : 'bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_60%)]'
                          }`}
                        />
                        <span
                          className={`pointer-events-none absolute -left-2 -top-4 text-[72px] font-black leading-none ${
                            isHighlighted ? 'text-emerald-200/50' : 'text-primary/10'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div className="relative flex items-start gap-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${
                              isHighlighted ? 'bg-emerald-500/15 text-emerald-700' : 'bg-primary/15 text-primary'
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                  isHighlighted ? 'bg-emerald-500/10 text-emerald-700' : 'bg-primary/10 text-primary'
                                }`}
                              >
                                <Icon size={16} />
                              </span>
                              <p className="font-semibold text-foreground">{point.title}</p>
                            </div>
                            {point.stat && (
                              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-3 py-2.5">
                                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700/70">
                                  {point.stat.label}
                                </p>
                                <p className="text-4xl font-black leading-none tracking-tight text-emerald-800">
                                  {point.stat.value}
                                </p>
                                {point.stat.note && (
                                  <p className="text-xs font-semibold text-emerald-700/70">
                                    {point.stat.note}
                                  </p>
                                )}
                              </div>
                            )}
                            <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-5">
                              {descriptionItems.map((item, itemIdx) => (
                                <li key={`${point.title}-${itemIdx}`} className="leading-relaxed">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
        
              {/* SDGs IMPACT SECTION */}
              <div className="mt-10 border-t border-border pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 space-y-4">
                    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg h-full flex flex-col justify-center">
                      <img
                        src="/gallery/menu-showcase.jpg"
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white/70" />
                      <div className="relative z-10 p-8">
                        <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-lg bg-primary/15">
                          <Globe className="text-primary" size={32} />
                        </div>
                        <h4 className="text-2xl font-bold text-foreground leading-tight">{ui.impact.sustainableDevelopment}</h4>
                        <p className="text-muted-foreground mt-4 text-sm font-medium leading-relaxed">
                          {ui.impact.sustainableDevelopmentDesc}
                        </p>
                      </div>
                    </div>
                  </div>
        
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sdgs.map((sdg) => {
                      const backgroundImage = sdgBackgroundMap[sdg.id] ?? '/gallery/menu-showcase.jpg';

                      return (
                        <div
                          key={sdg.id}
                          className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all hover:shadow-lg hover:border-primary/50"
                        >
                          <img
                            src={backgroundImage}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 h-full w-full object-cover opacity-65 transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/65" />
                          <div className="relative z-10 flex h-full flex-col justify-between p-6">
                            <div className="flex justify-between items-start mb-4">
                              {sdgIconMap[sdg.id] ? (
                                <img
                                  src={sdgIconMap[sdg.id]}
                                  alt={`SDG ${sdg.id} ${sdg.title}`}
                                  className="w-12 h-12 rounded-lg object-contain shadow-lg bg-white/85 border border-border/70"
                                  loading="lazy"
                                />
                              ) : (
                                <div className={`${sdg.color} text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg`}>
                                  {sdg.id}
                                </div>
                              )}
                              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{ui.impact.goalLabel}</span>
                            </div>
                            <div>
                              <h5 className="font-bold text-foreground text-lg">{sdg.title}</h5>
                              <p className="text-xl font-bold text-primary mt-1">{sdg.metric}</p>
                              <p className="text-xs text-muted-foreground mt-2 font-medium leading-relaxed">{sdg.desc}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-10 rounded-3xl border border-border bg-muted/30 shadow-lg overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr]">
                    <div className="bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 text-amber-950 p-8 flex flex-col gap-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/70 text-amber-700 ring-1 ring-amber-200/70 shadow-sm flex items-center justify-center">
                          <LineChart size={22} />
                        </div>
                        <h5 className="text-2xl font-bold leading-tight text-amber-950">{theoryOfChange.title}</h5>
                      </div>
                      {theoryOfChange.description.map((paragraph, idx) => (
                        <p key={`${theoryOfChange.title}-desc-${idx}`} className="text-sm leading-relaxed text-amber-900/80">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    <div className="p-6 lg:p-8 bg-card/60">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        {theoryOfChange.levels.map((level, levelIndex) => {
                          const HeaderIcon = level.items[0]?.icon ?? LineChart;
                          return (
                            <div
                              key={`${level.label}-${levelIndex}`}
                              className={`relative h-full rounded-2xl border border-border/70 bg-gradient-to-br ${level.accent.card} shadow-sm hover:-translate-y-1 hover:shadow-lg transition-transform`}
                            >
                              <div className="flex items-center gap-3 px-4 pt-4">
                                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${level.accent.icon} flex items-center justify-center shadow-inner`}>
                                  <HeaderIcon size={20} />
                                </div>
                                <div>
                                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Step {levelIndex + 1}</p>
                                  <h6 className="text-lg font-semibold text-foreground leading-tight">{level.label}</h6>
                                </div>
                              </div>
                              <div className="mt-3 space-y-2.5 px-4 pb-4">
                                {level.items.map((item, itemIndex) => {
                                  const ItemIcon = item.icon;
                                  return (
                                    <div
                                      key={`${level.label}-item-${itemIndex}`}
                                      className="flex items-start gap-3 rounded-xl border border-border/60 bg-white/80 px-3.5 py-2.5 shadow-sm backdrop-blur"
                                    >
                                      <div className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg ${level.accent.chip}`}>
                                        <ItemIcon size={16} />
                                      </div>
                                      <p className="text-sm font-medium leading-snug text-foreground/90">{item.text}</p>
                                    </div>
                                  );
                                })}
                              </div>
                              {levelIndex < theoryOfChange.levels.length - 1 && (
                                <div className="hidden xl:flex items-center justify-center absolute -right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                                  <ChevronRight size={22} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-5">{theoryOfChange.caption}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        
            {/* 3. NON-QUANTIFIABLE BENEFITS SECTION */}
            <div id="research-nonquant" className="mt-16 pt-12 border-t border-border scroll-mt-28">
              <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center gap-4">
                <div className="w-1 h-10 bg-sky-500 rounded-full"></div>
                {ui.sections.nonQuantifiable}
              </h2>
              <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">{nonQuantifiable.intro}</p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {nonQuantifiable.points.map((point, idx) => {
                  const Icon = nonQuantifiableIcons[idx] ?? Info;
                  return (
                    <div key={`${point.title}-${idx}`} className="bg-card rounded-2xl border border-border p-6 shadow-md transition-shadow hover:shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                          <Icon size={22} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-foreground">{point.title}</h3>
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{point.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. SOCIAL RETURN ON INVESTMENT SECTION */}
            <div id="research-sroi" className="mt-16 pt-12 border-t border-border scroll-mt-28">
              <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-4">
                <div className="w-1 h-10 bg-primary rounded-full"></div>
                {ui.sections.sroi}
              </h2>
              <SROIImpact language={language} />
            </div>
        
            {/* 5. ECONOMIC IMPACT SECTION */}
            <div id="research-economic" className="mt-16 pt-12 border-t border-border scroll-mt-28">
              <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-4">
                <div className="w-1 h-10 bg-green-500 rounded-full"></div>
                {ui.sections.economic}
              </h2>
              <EconomicImpact language={language} />
            </div>
          </section>
        )}
        
        {activeSection === 'profil' && (
          <section id="profil" className="space-y-10 scroll-mt-28 animate-in slide-in-from-bottom duration-500">
            {/* FFI ORGANIZATION PROFILE */}
            <div id="profil-ffi" className="scroll-mt-28">
              <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-4">
                <div className="w-1 h-10 bg-red-600 rounded-full"></div>
                {ui.sections.aboutFfi}
              </h2>
              <FFIOrganizationProfile language={language} />
            </div>

            <div id="profil-wfp" className="mt-16 pt-12 border-t border-border scroll-mt-28">
              <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-4">
                <div className="w-1 h-10 bg-sky-600 rounded-full"></div>
                {ui.sections.aboutWfp}
              </h2>
              <WFPOrganizationProfile language={language} />
            </div>

            {/* TEAM PROFILES SECTION */}
            <div id="profil-team" className="mt-16 pt-12 border-t border-border scroll-mt-28">
              <TeamProfiles profiles={teamProfiles} language={language} />
            </div>
          </section>
        )}
</main>

      {isRecipeOpen && activeRecipe && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4"
          onClick={() => setIsRecipeOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card/80 px-6 py-4 backdrop-blur">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground">{activeRecipe.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{activeRecipe.head}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                  <Clock size={12} className="text-primary" />
                  {recipeCollection.cookTimeLabel}: <span className="text-foreground">{activeRecipe.cookTime}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRecipeOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                  aria-label={language === 'id' ? 'Tutup pop up' : 'Close popup'}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 lg:p-8 overflow-y-auto">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1">
                    {recipeCollection.stepLabel} {recipeStep + 1} / {recipeDetailSteps.length}
                  </span>
                  <span className="text-foreground">{recipeDetailSteps[recipeStep]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRecipeStep((step) => Math.max(0, step - 1))}
                    disabled={recipeStep === 0}
                    className="h-9 w-9 rounded-full border border-border bg-background text-muted-foreground flex items-center justify-center transition hover:border-primary/40 hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-muted-foreground"
                    aria-label={language === 'id' ? 'Langkah sebelumnya' : 'Previous step'}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecipeStep((step) => Math.min(recipeDetailSteps.length - 1, step + 1))}
                    disabled={recipeStep === recipeDetailSteps.length - 1}
                    className="h-9 w-9 rounded-full border border-border bg-background text-muted-foreground flex items-center justify-center transition hover:border-primary/40 hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-muted-foreground"
                    aria-label={language === 'id' ? 'Langkah berikutnya' : 'Next step'}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {recipeStep === 0 && (
                <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
                  <div>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
                      <img
                        src={activeRecipe.image}
                        alt={language === 'id' ? `Foto ${activeRecipe.title}` : `${activeRecipe.title} photo`}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"></div>
                    </div>
                    <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                      <p>{activeRecipe.head}</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Info size={12} />
                        </span>
                        {recipeCollection.nutritionLabel}
                      </p>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {activeRecipe.nutrition.map((item) => {
                          const NutrientIcon = getRecipeNutritionIcon(item.label);
                          return (
                            <div key={item.label} className="rounded-xl border border-border bg-secondary/60 p-3">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary">
                                  <NutrientIcon size={12} />
                                </span>
                                {item.label}
                              </p>
                              <p className="text-base font-bold text-foreground mt-2">{item.value}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/50 p-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{recipeCollection.cookTimeLabel}</p>
                        <p className="text-lg font-bold text-foreground mt-1">{activeRecipe.cookTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {recipeStep === 1 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {activeRecipe.ingredients.map((group) => (
                    <div
                      key={group.title}
                      className="rounded-2xl border border-border/70 bg-secondary/40 p-5 shadow-sm"
                    >
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/10">
                          <Wheat size={12} />
                        </span>
                        {group.title}
                      </p>
                      <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                        {group.items.map((item) => (
                          <li key={item} className="flex items-start gap-3 leading-relaxed">
                            <span className="mt-2 inline-flex h-2 w-2 rounded-full bg-primary/80 ring-4 ring-primary/10"></span>
                            <span className="flex-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {recipeStep === 2 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {activeRecipe.steps.map((group) => (
                    <div key={group.title} className="rounded-2xl border border-border bg-secondary/40 p-5">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <BookOpen size={12} />
                        </span>
                        {group.title}
                      </p>
                      <ol className="mt-4 space-y-2 text-xs text-muted-foreground">
                        {group.items.map((item, stepIndex) => (
                          <li key={`${group.title}-${stepIndex}`} className="flex items-start gap-2">
                            <span className="mt-1.5 h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                              {stepIndex + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activePartner && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4"
          onClick={() => setActivePartnerIndex(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card/80 px-6 py-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <div
                  className={`h-12 w-12 rounded-full border border-border flex items-center justify-center text-xs font-bold ${activePartnerColor}`}
                >
                  {getPartnerInitials(activePartner.name)}
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{ui.partners.modalLabel}</p>
                  <h3 className="text-lg font-bold text-foreground">{activePartner.name}</h3>
                  <p className="text-xs text-muted-foreground">{activePartner.description}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivePartnerIndex(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                aria-label={language === 'id' ? 'Tutup pop up' : 'Close popup'}
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground leading-relaxed">{activePartner.details}</p>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-12 bg-[#1f1c1b] text-white border-t-[10px] border-red-600">
        <div className="mx-auto w-full max-w-6xl px-6 py-12 md:px-8">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1.2fr]">
            <div className="space-y-5">
              <h3 className="text-3xl font-semibold tracking-tight">{ui.footer.title}</h3>
              <p className="text-sm text-white/80 leading-relaxed max-w-sm">
                {ui.footer.description}
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center transition hover:bg-white/10"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center transition hover:bg-white/10"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="#"
                  aria-label="TikTok"
                  className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center transition hover:bg-white/10"
                >
                  <Music2 size={18} />
                </a>
                <a
                  href="#"
                  aria-label="X (Twitter)"
                  className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center transition hover:bg-white/10"
                >
                  <Twitter size={18} />
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">{ui.footer.infoTitle}</p>
              <a href="mailto:info@futurefarmers.id" className="text-lg font-semibold text-white/90 hover:text-white transition">
                {ui.footer.infoEmail}
              </a>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">{ui.footer.communityTitle}</p>
              <form
                onSubmit={(event) => event.preventDefault()}
                className="flex flex-col gap-4"
              >
                <input
                  type="email"
                  placeholder={ui.footer.emailPlaceholder}
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-[#1f1c1b] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                >
                  {ui.footer.cta}
                </button>
              </form>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-xs font-medium text-white/70">
            {ui.footer.copyright}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;











