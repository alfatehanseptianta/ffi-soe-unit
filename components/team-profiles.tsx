'use client';

import React from 'react';
import {
  Users,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Apple,
  Wallet,
  ChefHat,
  Drumstick,
  Leaf,
  Wheat,
  HandHeart,
  ClipboardList,
  Boxes,
  Sparkles,
  Cog,
  Crown,
  ClipboardCheck,
  Droplets,
  Tractor,
  Truck,
  Route
} from 'lucide-react';
import { KitchenOperations } from './kitchen-operations';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  specialties: string[];
  experience: string;
  avatar?: string;
  origin?: string;
  lastEducation?: string;
  kitchenProfile?: any;
}

interface TeamProfile {
  id: string;
  category: string;
  icon: string;
  description: string;
  members: TeamMember[];
  group?: 'management' | 'operational';
}

interface TeamProfilesProps {
  profiles: TeamProfile[];
  language: 'en' | 'id';
}

type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

const categoryIconMap: Record<string, IconComponent> = {
  SPPG: ShieldCheck,
  GIZI: Apple,
  FIN: Wallet,
  COOK: ChefHat,
  PROT: Drumstick,
  VEG: Leaf,
  RICE: Wheat,
  HELP: HandHeart,
  PREP: ClipboardList,
  WARE: Boxes,
  CLEAN: Sparkles,
  TECH: Cog,
  TEAM: Users,
  LEAD: Crown,
  PORT: ClipboardCheck,
  WASH: Droplets,
  FIELD: Tractor,
  DRIVE: Truck,
  ROUTE: Route
};

const categoryToneMap: Record<string, string> = {
  SPPG: 'bg-sky-50 text-sky-600',
  GIZI: 'bg-emerald-50 text-emerald-600',
  FIN: 'bg-amber-50 text-amber-700',
  COOK: 'bg-orange-50 text-orange-600',
  PROT: 'bg-rose-50 text-rose-600',
  VEG: 'bg-lime-50 text-lime-700',
  RICE: 'bg-yellow-50 text-yellow-700',
  HELP: 'bg-pink-50 text-pink-600',
  PREP: 'bg-indigo-50 text-indigo-600',
  WARE: 'bg-teal-50 text-teal-700',
  CLEAN: 'bg-cyan-50 text-cyan-700',
  TECH: 'bg-slate-50 text-slate-700',
  TEAM: 'bg-violet-50 text-violet-700',
  LEAD: 'bg-purple-50 text-purple-700',
  PORT: 'bg-blue-50 text-blue-700',
  WASH: 'bg-sky-50 text-sky-700',
  FIELD: 'bg-green-50 text-green-700',
  DRIVE: 'bg-amber-50 text-amber-700',
  ROUTE: 'bg-emerald-50 text-emerald-700'
};

const getCategoryIcon = (code: string) => {
  const Icon = categoryIconMap[code] || Users;
  const tone = categoryToneMap[code] || 'bg-primary/10 text-primary';
  return (
    <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${tone}`}>
      <Icon size={22} />
    </div>
  );
};

const getPositionIcon = (position: string) => {
  const value = position.toLowerCase();
  if (value.includes('sppg')) return ShieldCheck;
  if (value.includes('gizi') || value.includes('nutrition')) return Apple;
  return Users;
};

const fallbackAvatar = '/placeholder-user.jpg';

export function TeamProfiles({ profiles, language }: TeamProfilesProps) {
  const labels = language === 'id'
    ? {
        title: 'Tim & Organisasi',
        subtitle: 'Kenali orang-orang di balik operasi FFI',
        member: 'Anggota',
        managementGroup: 'Manajemen',
        operationsGroup: 'Tim Operasional',
        originLabel: 'Asal Daerah',
        lastEducationLabel: 'Pendidikan Terakhir'
      }
    : {
        title: 'Team & Organizations',
        subtitle: 'Meet the people behind FFI operations',
        member: 'Member',
        managementGroup: 'Management',
        operationsGroup: 'Operational Team',
        originLabel: 'Origin',
        lastEducationLabel: 'Latest Education'
      };

  const kitchenProfile = React.useMemo(() => {
    const memberWithKitchenProfile = profiles
      .flatMap((profile) => profile.members)
      .find((member) => member.kitchenProfile);
    return memberWithKitchenProfile?.kitchenProfile;
  }, [profiles]);

  const isOperationalProfile = (profile: TeamProfile) => {
    if (profile.group) {
      return profile.group === 'operational';
    }
    return profile.members.some((member) => Boolean(member.kitchenProfile));
  };

  const managementProfiles = profiles.filter((profile) => !isOperationalProfile(profile));
  const operationalProfiles = profiles.filter((profile) => isOperationalProfile(profile));

  const renderProfileCard = (profile: TeamProfile) => (
    <div
      key={profile.id}
      className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden transition-all hover:shadow-xl"
    >
      <div className="p-5 border-b border-border bg-secondary/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getCategoryIcon(profile.icon)}
            <div>
              <h4 className="font-bold text-foreground text-lg leading-tight">{profile.category}</h4>
            </div>
          </div>
          <div className="text-primary font-bold text-sm">
            {profile.members.length} {labels.member}
            {language === 'en' && profile.members.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-5">
        {profile.members.map((member) => {
          const PositionIcon = getPositionIcon(member.position);
          const avatarSrc = member.avatar || fallbackAvatar;
          return (
            <div
              key={member.id}
              className="rounded-xl border border-border bg-secondary/30 p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="h-16 w-16 rounded-xl overflow-hidden border border-border bg-secondary/40 shrink-0">
                    <img
                      src={avatarSrc}
                      alt={language === 'id' ? `Foto ${member.name}` : `${member.name} photo`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      <PositionIcon size={14} className="text-primary" />
                      <span>{member.position}</span>
                    </div>
                    <h5 className="font-bold text-foreground text-lg leading-tight">{member.name}</h5>
                    <p className="text-sm text-muted-foreground italic leading-snug">{member.role}</p>
                  </div>
                </div>

                {(member.origin || member.lastEducation) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {member.origin && (
                      <div className="rounded-lg border border-border bg-card/60 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {labels.originLabel}
                        </p>
                        <p className="text-sm font-semibold text-foreground mt-1">{member.origin}</p>
                      </div>
                    )}
                    {member.lastEducation && (
                      <div className="rounded-lg border border-border bg-card/60 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {labels.lastEducationLabel}
                        </p>
                        <p className="text-sm font-semibold text-foreground mt-1">{member.lastEducation}</p>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-sm text-foreground leading-relaxed">{member.bio}</p>

                <div className="space-y-2 py-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={16} className="text-primary" />
                    <a href={`mailto:${member.email}`} className="text-primary hover:underline">
                      {member.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <Phone size={16} className="text-muted-foreground" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <MapPin size={16} className="text-muted-foreground" />
                    <span>{member.location}</span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMemberCard = (profile: TeamProfile, member: TeamMember) => {
    const PositionIcon = getPositionIcon(member.position);
    const avatarSrc = member.avatar || fallbackAvatar;

    return (
      <div
        key={`${profile.id}-${member.id}`}
        className="bg-card rounded-2xl border border-border shadow-lg hover:shadow-xl transition-all overflow-hidden"
      >
        <div className="relative">
          <div className="h-28 w-full bg-gradient-to-r from-primary/15 via-secondary/40 to-background" />
          <div className="absolute -bottom-10 left-5">
            <div className="h-20 w-20 rounded-2xl overflow-hidden border-4 border-card shadow-md bg-secondary/40">
              <img
                src={avatarSrc}
                alt={language === 'id' ? `Foto ${member.name}` : `${member.name} photo`}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border">
            {getCategoryIcon(profile.icon)}
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {profile.category}
            </span>
          </div>
        </div>

        <div className="pt-14 px-5 pb-5 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <PositionIcon size={16} className="text-primary" />
              <span>{member.position}</span>
            </div>
            <h5 className="text-lg font-bold text-foreground leading-tight">{member.name}</h5>
            <p className="text-sm text-muted-foreground italic leading-relaxed">{member.role}</p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-primary">
              <Mail size={14} />
              <a href={`mailto:${member.email}`} className="hover:underline">
                {member.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Phone size={14} className="text-muted-foreground" />
              <span>{member.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin size={14} />
              <span>{member.location}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/15 rounded-lg text-primary">
          <Users size={24} />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-xl uppercase tracking-tight">{labels.title}</h3>
          <p className="text-sm text-muted-foreground">{labels.subtitle}</p>
        </div>
      </div>

      {kitchenProfile && <KitchenOperations profile={kitchenProfile} language={language} variant="profile" />}

      {managementProfiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{labels.managementGroup}</h4>
            <span className="h-px flex-1 bg-border ml-4"></span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {managementProfiles.map(renderProfileCard)}
          </div>
        </div>
      )}

      {operationalProfiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{labels.operationsGroup}</h4>
            <span className="h-px flex-1 bg-border ml-4"></span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {operationalProfiles.flatMap((profile) =>
              profile.members.map((member) => renderMemberCard(profile, member))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
