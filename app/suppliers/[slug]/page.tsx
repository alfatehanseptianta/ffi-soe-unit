import Link from 'next/link';

const SUPPLIER_PROFILES: Record<
  string,
  {
    name: string;
    location: string;
    focus: string;
    delivery: string;
    contact: string;
    partnerSince: string;
  }
> = {
  'kasihan-poultry-farm': {
    name: 'Kasihan Poultry Farm',
    location: 'Sleman, DI Yogyakarta',
    focus: 'Ayam fillet, ayam iling',
    delivery: '1-2x/minggu',
    contact: '0812-4567-8901',
    partnerSince: '2019',
  },
  'yogyakarta-beef-house': {
    name: 'Yogyakarta Beef House',
    location: 'Kota Yogyakarta',
    focus: 'Daging sapi premium',
    delivery: '1x/minggu',
    contact: '0813-9876-5412',
    partnerSince: '2018',
  },
  'giwangan-fresh-produce': {
    name: 'Giwangan Fresh Produce',
    location: 'Bantul, DI Yogyakarta',
    focus: 'Sayuran segar & kacang-kacangan',
    delivery: '2-3x/minggu',
    contact: '0812-2222-3333',
    partnerSince: '2020',
  },
  'gamping-spice-co': {
    name: 'Gamping Spice Co.',
    location: 'Sleman, DI Yogyakarta',
    focus: 'Rempah-rempah & bumbu dapur',
    delivery: '1x/minggu',
    contact: '0812-7777-8888',
    partnerSince: '2017',
  },
};

const formatSlug = (slug: string) =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export default function SupplierPage({ params }: { params: { slug: string } }) {
  const profile = SUPPLIER_PROFILES[params.slug];
  const title = profile?.name ?? formatSlug(params.slug);

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition">
          &larr; Kembali ke dashboard
        </Link>

        <header className="bg-card border border-border rounded-2xl p-6 shadow-lg space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Profil Pemasok</p>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">Halaman dummy untuk kebutuhan navigasi pemasok.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-5 space-y-2 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Lokasi</p>
            <p className="text-base font-semibold text-foreground">{profile?.location ?? 'DI Yogyakarta'}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 space-y-2 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Fokus Komoditas</p>
            <p className="text-base font-semibold text-foreground">{profile?.focus ?? 'Komoditas lokal'}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 space-y-2 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Pengiriman</p>
            <p className="text-base font-semibold text-foreground">{profile?.delivery ?? '1x/minggu'}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5 space-y-2 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Kontak</p>
            <p className="text-base font-semibold text-foreground">{profile?.contact ?? '0812-0000-0000'}</p>
          </div>
        </section>

        <div className="bg-secondary/60 border border-border rounded-xl p-4 text-xs text-muted-foreground">
          Mitra sejak {profile?.partnerSince ?? '2021'} - Data contoh untuk kebutuhan tampilan.
        </div>
      </div>
    </div>
  );
}

