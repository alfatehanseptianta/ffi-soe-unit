'use client';

import React from 'react';
import { ExternalLink, Globe, ShieldCheck, Heart, Truck, School, ClipboardCheck, Target, Users } from 'lucide-react';

type WFPOrganizationProfileProps = {
  language: 'en' | 'id';
};

export function WFPOrganizationProfile({ language }: WFPOrganizationProfileProps) {
  const copy = language === 'id'
    ? {
        orgName: 'World Food Programme',
        orgLabel: 'Badan PBB',
        tagline: '"Saving Lives, Changing Lives"',
        website: 'wfp.org',
        visitWebsite: 'Kunjungi Situs',
        missionVision: 'Mandat & Fokus',
        missionLabel: 'Mandat',
        missionText: 'World Food Programme (WFP) adalah badan PBB yang berfokus pada bantuan pangan kemanusiaan. WFP membantu menyelamatkan nyawa di masa krisis dan mendukung komunitas untuk membangun ketahanan pangan jangka panjang.',
        visionLabel: 'Fokus',
        visionText: 'Memperkuat ketahanan pangan dan gizi melalui respons darurat, program gizi, serta penguatan sistem pangan lokal bersama mitra.',
        programs: [
          { title: 'Bantuan Pangan Darurat', description: 'Distribusi bantuan pangan cepat saat krisis dan bencana', icon: 'Truck', color: 'text-sky-600' },
          { title: 'Program Makanan Sekolah', description: 'Dukungan gizi bagi pelajar untuk tumbuh sehat dan belajar optimal', icon: 'School', color: 'text-blue-600' },
          { title: 'Dukungan Gizi', description: 'Intervensi gizi untuk kelompok rentan dan keluarga terdampak', icon: 'Heart', color: 'text-rose-600' },
          { title: 'Pemantauan & Akuntabilitas', description: 'Pemantauan program untuk memastikan bantuan tepat sasaran', icon: 'ClipboardCheck', color: 'text-emerald-600' },
        ],
        focusTitle: 'Fokus Kerja',
        focusAreas: [
          { title: 'Respons Darurat', description: 'Bantuan pangan cepat untuk menyelamatkan nyawa di masa krisis' },
          { title: 'Gizi & Kesehatan', description: 'Dukungan gizi bagi anak-anak, ibu, dan komunitas rentan' },
          { title: 'Ketahanan & Livelihood', description: 'Penguatan kemampuan komunitas menghadapi guncangan dan perubahan iklim' },
        ],
        approachTitle: 'Pendekatan Kami',
        approachText: 'WFP bekerja bersama pemerintah, komunitas lokal, dan organisasi mitra untuk menyalurkan bantuan pangan, memperkuat sistem pangan, serta mendorong solusi berbasis sumber lokal yang berkelanjutan.',
        stats: [
          { value: 'UN', label: 'Mandat Kemanusiaan', color: 'text-sky-700' },
          { value: 'Global', label: 'Jangkauan', color: 'text-blue-600' },
          { value: 'Gizi', label: 'Dukungan', color: 'text-rose-600' },
          { value: 'Resiliensi', label: 'Fokus', color: 'text-emerald-600' },
        ],
        partnerLabel: 'Aksi Kemanusiaan',
      }
    : {
        orgName: 'World Food Programme',
        orgLabel: 'United Nations Agency',
        tagline: '"Saving Lives, Changing Lives"',
        website: 'wfp.org',
        visitWebsite: 'Visit Website',
        missionVision: 'Mandate & Focus',
        missionLabel: 'Mandate',
        missionText: 'The World Food Programme (WFP) is the UN agency focused on humanitarian food assistance. WFP saves lives in emergencies and supports communities to build long-term food security.',
        visionLabel: 'Focus',
        visionText: 'Strengthening food security and nutrition through emergency response, nutrition programs, and stronger local food systems with partners.',
        programs: [
          { title: 'Emergency Food Assistance', description: 'Rapid food assistance during crises and disasters', icon: 'Truck', color: 'text-sky-600' },
          { title: 'School Meals', description: 'Nutrition support for learners to grow healthy and learn well', icon: 'School', color: 'text-blue-600' },
          { title: 'Nutrition Support', description: 'Nutrition interventions for vulnerable families and communities', icon: 'Heart', color: 'text-rose-600' },
          { title: 'Monitoring & Accountability', description: 'Program monitoring to keep assistance targeted and effective', icon: 'ClipboardCheck', color: 'text-emerald-600' },
        ],
        focusTitle: 'Focus Areas',
        focusAreas: [
          { title: 'Emergency Response', description: 'Rapid food assistance to save lives during crises' },
          { title: 'Nutrition & Health', description: 'Nutrition support for children, mothers, and vulnerable communities' },
          { title: 'Resilience & Livelihoods', description: 'Strengthening community resilience to shocks and climate stress' },
        ],
        approachTitle: 'Our Approach',
        approachText: 'WFP partners with governments, local communities, and NGOs to deliver food assistance, strengthen food systems, and advance sustainable local sourcing.',
        stats: [
          { value: 'UN', label: 'Humanitarian Mandate', color: 'text-sky-700' },
          { value: 'Global', label: 'Reach', color: 'text-blue-600' },
          { value: 'Nutrition', label: 'Support', color: 'text-rose-600' },
          { value: 'Resilience', label: 'Focus', color: 'text-emerald-600' },
        ],
        partnerLabel: 'Humanitarian Action',
      };

  const programIcons = {
    Truck,
    School,
    Heart,
    ClipboardCheck,
  } as const;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg flex flex-col flex-1">
            <div className="space-y-4 mb-6 pb-6 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-sky-600 text-white font-black flex items-center justify-center tracking-tight">
                  WFP
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{copy.orgName}</p>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {copy.orgLabel}
                  </p>
                </div>
              </div>
              <p className="text-sm font-semibold italic text-foreground leading-relaxed">
                {copy.tagline}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-sky-600" />
                <a
                  href="https://www.wfp.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 hover:underline font-semibold flex items-center gap-1"
                >
                  {copy.website}
                  <ExternalLink size={14} />
                </a>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-sky-600" />
                <span className="text-sm text-foreground">{copy.partnerLabel}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users size={18} className="text-sky-600" />
                <span className="text-sm text-foreground">{copy.orgLabel}</span>
              </div>
            </div>

            <a
              href="https://www.wfp.org"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 lg:mt-auto w-full block py-3 px-4 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 transition-colors text-center"
            >
              {copy.visitWebsite}
            </a>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-3">
              <Target size={20} className="text-sky-600" />
              {copy.missionVision}
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">{copy.missionLabel}</p>
                <p className="text-foreground leading-relaxed">
                  {copy.missionText}
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">{copy.visionLabel}</p>
                <p className="text-foreground leading-relaxed">
                  {copy.visionText}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {copy.programs.map((program) => {
              const Icon = programIcons[program.icon as keyof typeof programIcons];
              return (
                <div key={program.title} className="bg-secondary p-6 rounded-lg border border-border">
                  <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                    <Icon size={18} className={program.color} />
                    {program.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {program.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-8">
        <h3 className="font-bold text-lg text-foreground mb-6 flex items-center gap-3">
          <Target size={20} className="text-sky-600" />
          {copy.focusTitle}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {copy.focusAreas.map((area) => (
            <div key={area.title} className="space-y-2">
              <p className="font-bold text-foreground">{area.title}</p>
              <p className="text-sm text-muted-foreground">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
        <h3 className="font-bold text-lg text-foreground mb-6 flex items-center gap-3">
          <Users size={20} className="text-sky-600" />
          {copy.approachTitle}
        </h3>
        <p className="text-foreground leading-relaxed mb-6">
          {copy.approachText}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {copy.stats.map((stat) => (
            <div key={stat.label} className="bg-secondary p-4 rounded-lg border border-border text-center">
              <p className={`font-bold text-2xl ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
