'use client';

import React from 'react';
import { ExternalLink, Users, Lightbulb, Target, Mail, Globe } from 'lucide-react';
import { FFILogo } from '@/components/ffi-logo';

type FFIOrganizationProfileProps = {
  language: 'en' | 'id';
};

export function FFIOrganizationProfile({ language }: FFIOrganizationProfileProps) {
  const copy = language === 'id'
    ? {
        tagline: '"Menanam Inovasi, Memanen Pemimpin"',
        logoAlt: 'Logo Future Farmers Indonesia',
        studentLed: 'Organisasi dipimpin siswa',
        visitWebsite: 'Kunjungi Situs',
        missionVision: 'Misi & Visi',
        missionLabel: 'Misi',
        missionText: 'Future Farmers of Indonesia adalah organisasi siswa/i yang didedikasikan untuk membina calon petani muda yang inovatif. Kami berupaya mengembangkan keterampilan dan pengetahuan untuk pertanian berkelanjutan dan masa depan yang lebih cerah.',
        visionLabel: 'Visi',
        visionText: 'Memberdayakan generasi muda untuk menjadi inovator pertanian yang berkelanjutan, menggabungkan kearifan lokal dengan pemikiran inovatif untuk menciptakan ketahanan pangan di Indonesia.',
        programs: [
          { title: 'Mentorship Program', description: 'Terhubung dengan petani berpengalaman yang membimbing generasi petani inovatif', icon: 'Lightbulb', color: 'text-yellow-500' },
          { title: 'Sustainable Agriculture', description: 'Inisiatif pertanian berkelanjutan untuk masa depan yang lebih cerah', icon: 'Target', color: 'text-primary' },
          { title: 'Workshops & Training', description: 'Ikuti lokakarya interaktif dengan keterampilan pertanian modern', icon: 'Users', color: 'text-green-600' },
          { title: 'Innovation Showcase', description: 'Menampilkan inovasi pertanian dari calon petani muda Indonesia', icon: 'Lightbulb', color: 'text-orange-500' },
        ],
        focusTitle: 'Fokus Organisasi',
        focusAreas: [
          { title: 'Youth Empowerment', description: 'Memberdayakan siswa/i untuk menjadi pemimpin pertanian masa depan dengan inovasi berkelanjutan' },
          { title: 'Local Wisdom + Innovation', description: 'Menggabungkan kearifan lokal dengan teknologi modern untuk solusi pertanian relevan' },
          { title: 'Food Security', description: 'Mendorong ketahanan pangan nasional melalui praktik pertanian berkelanjutan dan inovatif' },
        ],
        approachTitle: 'Pendekatan Kami',
        approachText: 'Future Farmers of Indonesia berperan sebagai platform ekosistem ketahanan pangan di berbagai sekolah di seluruh Indonesia, berdedikasi mengembangkan pemimpin muda di sektor pertanian. Melalui pendampingan, lokakarya, dan inisiatif kolaboratif, FFI memadukan pemikiran inovatif dengan pengetahuan pertanian praktis untuk menjawab tantangan ketahanan pangan dan keberlanjutan.',
        stats: [
          { value: '16+', label: 'Sekolah Terjangkau', color: 'text-red-600' },
          { value: '1,750+', label: 'Siswa Penerima Program', color: 'text-yellow-500' },
          { value: '6.2x', label: 'ROI Dihasilkan', color: 'text-primary' },
          { value: '88%', label: 'Sumber Lokal', color: 'text-green-600' },
        ],
      }
    : {
        tagline: '"Planting Innovation, Harvesting Leaders"',
        logoAlt: 'Future Farmers Indonesia logo',
        studentLed: 'Student-Led Organization',
        visitWebsite: 'Visit Website',
        missionVision: 'Mission & Vision',
        missionLabel: 'Mission',
        missionText: 'Future Farmers of Indonesia is a student-led organization dedicated to nurturing innovative young farmers. We develop skills and knowledge for sustainable agriculture and a brighter future.',
        visionLabel: 'Vision',
        visionText: 'Empower the younger generation to become sustainable agricultural innovators, combining local wisdom with innovative thinking to strengthen food security in Indonesia.',
        programs: [
          { title: 'Mentorship Program', description: 'Connect with experienced farmers who mentor the next generation of innovative growers', icon: 'Lightbulb', color: 'text-yellow-500' },
          { title: 'Sustainable Agriculture', description: 'Sustainable agriculture initiatives for a brighter future', icon: 'Target', color: 'text-primary' },
          { title: 'Workshops & Training', description: 'Join interactive workshops on modern agricultural skills', icon: 'Users', color: 'text-green-600' },
          { title: 'Innovation Showcase', description: "Showcasing agricultural innovations from Indonesia's young farmers", icon: 'Lightbulb', color: 'text-orange-500' },
        ],
        focusTitle: 'Organization Focus Areas',
        focusAreas: [
          { title: 'Youth Empowerment', description: 'Empowering students to become future agricultural leaders through sustainable innovation' },
          { title: 'Local Wisdom + Innovation', description: 'Combining local wisdom with modern technology for relevant agricultural solutions' },
          { title: 'Food Security', description: 'Advancing national food security through sustainable and innovative farming practices' },
        ],
        approachTitle: 'Our Approach',
        approachText: 'Future Farmers of Indonesia serves as an ecosystem platform for food security across various schools throughout Indonesia, dedicated to developing young leaders in the agricultural sector. Through mentorship, workshops, and collaborative initiatives, FFI combines innovative thinking with practical agricultural knowledge to address contemporary challenges in food security and sustainability.',
        stats: [
          { value: '16+', label: 'Schools Reached', color: 'text-red-600' },
          { value: '1,750+', label: 'Students Benefited', color: 'text-yellow-500' },
          { value: '6.2x', label: 'ROI Generated', color: 'text-primary' },
          { value: '88%', label: 'Local Sourcing', color: 'text-green-600' },
        ],
      };

  const programIcons = {
    Lightbulb,
    Target,
    Users,
  } as const;

  return (
    <div className="space-y-8">
      {/* Main Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Organization Info */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg flex flex-col flex-1">
            {/* Logo and Branding */}
            <div className="space-y-4 mb-6 pb-6 border-b border-border">
              <FFILogo className="h-12 w-auto" alt={copy.logoAlt} />
              <p className="text-sm font-semibold italic text-foreground leading-relaxed">
                {copy.tagline}
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-primary" />
                <a 
                  href="https://futurefarmers.id" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  futurefarmers.id
                  <ExternalLink size={14} />
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-primary" />
                <span className="text-sm text-foreground">info@futurefarmers.id</span>
              </div>
              <div className="flex items-center gap-3">
                <Users size={18} className="text-primary" />
                <span className="text-sm text-foreground">{copy.studentLed}</span>
              </div>
            </div>

            {/* Call to Action */}
            <a
              href="https://futurefarmers.id"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 lg:mt-auto w-full block py-3 px-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors text-center"
            >
              {copy.visitWebsite}
            </a>
          </div>
        </div>

        {/* Right Column - Mission & Vision */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mission Statement */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-3">
              <Target size={20} className="text-red-600" />
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

          {/* Key Programs */}
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

      {/* Organization Values */}
      <div className="bg-gradient-to-r from-red-50 to-yellow-50 border border-red-200 rounded-2xl p-8">
        <h3 className="font-bold text-lg text-foreground mb-6 flex items-center gap-3">
          <Target size={20} className="text-red-600" />
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

      {/* Partnership & Collaboration */}
      <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
        <h3 className="font-bold text-lg text-foreground mb-6 flex items-center gap-3">
          <Users size={20} className="text-primary" />
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

