'use client';

import React from 'react';
import { School, MapPin, Clock, User, Heart } from 'lucide-react';
import { getGoogleMapsUrl } from '@/lib/utils';

interface SchoolDetail {
  id: string;
  name: string;
  type: 'elementary' | 'juniorHigh' | 'seniorHigh';
  status: 'active' | 'delivered';
  teachers: number;
  students: number;
  beneficiaries: number;
  target: number;
  cooked: number;
  inDelivery: number;
  received: number;
  distance: string;
  travelTimeMinutes: number;
  contact: string | { en: string; id: string };
  rating: number | null;
}

interface HealthCenterDetail {
  id: string;
  name: string;
  type: 'puskesmas' | 'posyandu';
  status: 'active' | 'delivered';
  pregnantNursing: number;
  toddlers: number;
  target: number;
  cooked: number;
  inDelivery: number;
  received: number;
  distance: string;
  travelTimeMinutes: number;
  contact: string | { en: string; id: string };
}

interface SchoolsDetailProps {
  schools: SchoolDetail[];
  healthCenters?: HealthCenterDetail[];
  language: 'en' | 'id';
  summaryOverride?: {
    totalSchools?: number;
    totalStudents?: number;
    totalTeachers?: number;
    totalBeneficiaries?: number;
    totalFacilities?: number;
    totalPuskesmas?: number;
    totalPosyandu?: number;
    totalPregnantNursing?: number;
    totalToddlers?: number;
    totalHealthBeneficiaries?: number;
  };
}

export function SchoolsDetail({ schools, healthCenters, language, summaryOverride }: SchoolsDetailProps) {
  const totalStudents = schools.reduce((acc, s) => acc + s.students, 0);
  const totalTeachers = schools.reduce((acc, s) => acc + s.teachers, 0);
  const totalBeneficiaries = schools.reduce((acc, s) => acc + s.beneficiaries, 0);
  const totalPregnantNursing = healthCenters?.reduce((acc, h) => acc + h.pregnantNursing, 0) ?? 0;
  const totalToddlers = healthCenters?.reduce((acc, h) => acc + h.toddlers, 0) ?? 0;
  const totalHealthBeneficiaries = totalPregnantNursing + totalToddlers;
  const totalPuskesmas = healthCenters?.filter((center) => center.type === 'puskesmas').length ?? 0;
  const totalPosyandu = healthCenters?.filter((center) => center.type === 'posyandu').length ?? 0;
  const displayedTotalSchools = summaryOverride?.totalSchools ?? schools.length;
  const displayedTotalStudents = summaryOverride?.totalStudents ?? totalStudents;
  const displayedTotalTeachers = summaryOverride?.totalTeachers ?? totalTeachers;
  const displayedTotalBeneficiaries = summaryOverride?.totalBeneficiaries ?? totalBeneficiaries;
  const displayedTotalFacilities = summaryOverride?.totalFacilities ?? healthCenters?.length ?? 0;
  const displayedTotalPuskesmas = summaryOverride?.totalPuskesmas ?? totalPuskesmas;
  const displayedTotalPosyandu = summaryOverride?.totalPosyandu ?? totalPosyandu;
  const displayedTotalPregnantNursing = summaryOverride?.totalPregnantNursing ?? totalPregnantNursing;
  const displayedTotalToddlers = summaryOverride?.totalToddlers ?? totalToddlers;
  const displayedTotalHealthBeneficiaries = summaryOverride?.totalHealthBeneficiaries ?? totalHealthBeneficiaries;
  const hasHealthCenters = Boolean((healthCenters?.length ?? 0) || displayedTotalFacilities > 0);
  const schoolTypeBadgeClasses: Record<SchoolDetail['type'], string> = {
    elementary: 'bg-red-500/15 text-red-600',
    juniorHigh: 'bg-blue-500/15 text-blue-600',
    seniorHigh: 'bg-emerald-500/15 text-emerald-600',
  };
  const deliveryStatusStyles = {
    target: {
      header: 'bg-red-500/10 text-red-700',
      value: 'text-red-600',
      pill: 'bg-red-500/10 text-red-700 border-red-500/30',
    },
    cooked: {
      header: 'bg-amber-500/10 text-amber-700',
      pill: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
    },
    inDelivery: {
      header: 'bg-sky-500/10 text-sky-700',
      pill: 'bg-sky-500/10 text-sky-700 border-sky-500/30',
    },
    received: {
      header: 'bg-emerald-500/10 text-emerald-700',
      pill: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
    },
  };
  const labels = language === 'id'
    ? {
        title: 'Rincian Distribusi Sekolah & Kesehatan',
        totalSchools: 'Total Sekolah',
        totalStudents: 'Total Siswa',
        totalTeachers: 'Total Guru',
        beneficiaries: 'Penerima Manfaat',
        schoolName: 'Nama Sekolah',
        facilityName: 'Nama Faskes',
        type: 'Tipe',
        teachers: 'Guru',
        students: 'Siswa',
        target: 'Target',
        cooked: 'Selesai Dimasak',
        inDelivery: 'Dalam Pengiriman',
        received: 'Telah Diterima',
        distance: 'Jarak',
        travelTime: 'Waktu Tempuh',
        totalFacilities: 'Total Faskes',
        totalPuskesmas: 'Total Puskesmas',
        totalPosyandu: 'Total Posyandu',
        pregnantNursing: 'Ibu Hamil & Menyusui',
        toddlers: 'Balita',
        healthSection: 'Puskesmas & Posyandu',
        pic: 'PIC',
        typeLabels: {
          elementary: 'SD',
          juniorHigh: 'SMP',
          seniorHigh: 'SMA',
          puskesmas: 'Puskesmas',
          posyandu: 'Posyandu',
        },
        travelTimeUnit: 'Menit',
      }
    : {
        title: 'School & Health Distribution Details',
        totalSchools: 'Total Schools',
        totalStudents: 'Total Students',
        totalTeachers: 'Total Teachers',
        beneficiaries: 'Beneficiaries',
        schoolName: 'School Name',
        facilityName: 'Facility Name',
        type: 'Type',
        teachers: 'Teachers',
        students: 'Students',
        target: 'Target',
        cooked: 'Cooked',
        inDelivery: 'In Delivery',
        received: 'Received',
        distance: 'Distance',
        travelTime: 'Travel Time',
        totalFacilities: 'Total Facilities',
        totalPuskesmas: 'Total Puskesmas',
        totalPosyandu: 'Total Posyandu',
        pregnantNursing: 'Pregnant & Nursing',
        toddlers: 'Toddlers',
        healthSection: 'Health Facilities',
        pic: 'PIC',
        typeLabels: {
          elementary: 'Elementary',
          juniorHigh: 'Junior High',
          seniorHigh: 'Senior High',
          puskesmas: 'Puskesmas',
          posyandu: 'Posyandu',
        },
        travelTimeUnit: 'min',
      };
  const mapLabel = language === 'id' ? 'Buka di Google Maps' : 'Open in Google Maps';

  return (
    <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
      <div className="p-6 border-b border-border bg-secondary/50">
        <h3 className="font-bold text-foreground text-base flex items-center gap-3 uppercase tracking-tight">
          <div className="p-2.5 bg-primary/15 rounded-lg text-primary"><School size={20} /></div> 
          {labels.title}
        </h3>
      </div>

      {/* Summary Stats */}
      <div className="p-6 border-b border-border grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-secondary p-4 rounded-lg border border-border text-center">
          <p className="text-2xl font-bold text-foreground">{displayedTotalSchools.toLocaleString()}</p>
          <p className="text-xs font-semibold text-muted-foreground mt-1">{labels.totalSchools}</p>
        </div>
        <div className="bg-secondary p-4 rounded-lg border border-border text-center">
          <p className="text-2xl font-bold text-foreground">{displayedTotalStudents.toLocaleString()}</p>
          <p className="text-xs font-semibold text-muted-foreground mt-1">{labels.totalStudents}</p>
        </div>
        <div className="bg-secondary p-4 rounded-lg border border-border text-center">
          <p className="text-2xl font-bold text-foreground">{displayedTotalTeachers.toLocaleString()}</p>
          <p className="text-xs font-semibold text-muted-foreground mt-1">{labels.totalTeachers}</p>
        </div>
        <div className="bg-secondary p-4 rounded-lg border border-border text-center">
          <p className="text-2xl font-bold text-foreground">{displayedTotalBeneficiaries.toLocaleString()}</p>
          <p className="text-xs font-semibold text-muted-foreground mt-1">{labels.beneficiaries}</p>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest bg-secondary border-b border-border">
              <th className="px-6 py-4">{labels.schoolName}</th>
              <th className="px-6 py-4 text-center">{labels.type}</th>
              <th className="px-6 py-4 text-center">{labels.teachers}</th>
              <th className="px-6 py-4 text-center">{labels.students}</th>
              <th className="px-6 py-4 text-center">{labels.beneficiaries}</th>
              <th className={`px-6 py-4 text-center ${deliveryStatusStyles.target.header}`}>{labels.target}</th>
              <th className={`px-6 py-4 text-center ${deliveryStatusStyles.cooked.header}`}>{labels.cooked}</th>
              <th className={`px-6 py-4 text-center ${deliveryStatusStyles.inDelivery.header}`}>{labels.inDelivery}</th>
              <th className={`px-6 py-4 text-center ${deliveryStatusStyles.received.header}`}>{labels.received}</th>
              <th className="px-6 py-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <span>{labels.distance}</span>
                  <span>{labels.travelTime}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {schools.map((school) => {
              const contactName = typeof school.contact === 'string' ? school.contact : school.contact[language];
              const mapUrl = getGoogleMapsUrl(school.name);
              return (
                <tr key={school.id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold">
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors"
                      aria-label={`${mapLabel}: ${school.name}`}
                      onClick={(event) => event.stopPropagation()}
                    >
                      {school.name}
                      <MapPin size={12} className="text-primary" />
                    </a>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <User size={12} className="text-muted-foreground" />
                    <span className="font-semibold text-muted-foreground">{labels.pic}:</span>
                    <span>{contactName}</span>
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${schoolTypeBadgeClasses[school.type]}`}>
                    {labels.typeLabels[school.type]}
                  </span>
                </td>
                <td className="px-6 py-4 text-center font-semibold text-foreground">{school.teachers}</td>
                <td className="px-6 py-4 text-center font-semibold text-foreground">{school.students}</td>
                <td className="px-6 py-4 text-center font-semibold text-foreground">{school.beneficiaries}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex min-w-[42px] justify-center rounded-full border px-2.5 py-1 text-xs font-bold tabular-nums ${deliveryStatusStyles.target.pill}`}>
                    {school.target}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex min-w-[42px] justify-center rounded-full border px-2.5 py-1 text-xs font-bold tabular-nums ${deliveryStatusStyles.cooked.pill}`}>
                    {school.cooked}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex min-w-[42px] justify-center rounded-full border px-2.5 py-1 text-xs font-bold tabular-nums ${deliveryStatusStyles.inDelivery.pill}`}>
                    {school.inDelivery}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex min-w-[42px] justify-center rounded-full border px-2.5 py-1 text-xs font-bold tabular-nums ${deliveryStatusStyles.received.pill}`}>
                    {school.received}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-muted-foreground" />
                      <span>{school.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-muted-foreground" />
                      <span>{school.travelTimeMinutes} {labels.travelTimeUnit}</span>
                    </div>
                  </div>
                </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {hasHealthCenters ? (
        <>
          <div className="border-t border-border" />
          <div className="p-6 border-b border-border bg-secondary/50">
            <h4 className="font-bold text-foreground text-sm flex items-center gap-3 uppercase tracking-tight">
              <div className="p-2.5 bg-rose-500/15 rounded-lg text-rose-500"><Heart size={18} /></div>
              {labels.healthSection}
            </h4>
          </div>
          <div className="p-6 border-b border-border grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-secondary p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-foreground">{displayedTotalFacilities.toLocaleString()}</p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">{labels.totalFacilities}</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-foreground">{displayedTotalPuskesmas.toLocaleString()}</p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">{labels.totalPuskesmas}</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-foreground">{displayedTotalPosyandu.toLocaleString()}</p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">{labels.totalPosyandu}</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-foreground">{displayedTotalPregnantNursing.toLocaleString()}</p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">{labels.pregnantNursing}</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-foreground">{displayedTotalToddlers.toLocaleString()}</p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">{labels.toddlers}</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-foreground">{displayedTotalHealthBeneficiaries.toLocaleString()}</p>
              <p className="text-xs font-semibold text-muted-foreground mt-1">{labels.beneficiaries}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest bg-secondary border-b border-border">
                  <th className="px-6 py-4">{labels.facilityName}</th>
                  <th className="px-6 py-4 text-center">{labels.type}</th>
                  <th className="px-6 py-4 text-center">{labels.pregnantNursing}</th>
                  <th className="px-6 py-4 text-center">{labels.toddlers}</th>
                  <th className="px-6 py-4 text-center">{labels.beneficiaries}</th>
                  <th className={`px-6 py-4 text-center ${deliveryStatusStyles.target.header}`}>{labels.target}</th>
                  <th className={`px-6 py-4 text-center ${deliveryStatusStyles.cooked.header}`}>{labels.cooked}</th>
                  <th className={`px-6 py-4 text-center ${deliveryStatusStyles.inDelivery.header}`}>{labels.inDelivery}</th>
                  <th className={`px-6 py-4 text-center ${deliveryStatusStyles.received.header}`}>{labels.received}</th>
                  <th className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span>{labels.distance}</span>
                      <span>{labels.travelTime}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {healthCenters?.map((center) => {
                  const contactName = typeof center.contact === 'string' ? center.contact : center.contact[language];
                  const totalCenterBeneficiaries = center.pregnantNursing + center.toddlers;
                  return (
                    <tr key={center.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-foreground">{center.name}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <User size={12} className="text-muted-foreground" />
                          <span className="font-semibold text-muted-foreground">{labels.pic}:</span>
                          <span>{contactName}</span>
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-2.5 py-1 bg-primary/15 text-primary rounded-full text-[10px] font-semibold">
                          {labels.typeLabels[center.type]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-foreground">{center.pregnantNursing}</td>
                      <td className="px-6 py-4 text-center font-semibold text-foreground">{center.toddlers}</td>
                      <td className="px-6 py-4 text-center font-semibold text-foreground">{totalCenterBeneficiaries}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex min-w-[42px] justify-center rounded-full border px-2.5 py-1 text-xs font-bold tabular-nums ${deliveryStatusStyles.target.pill}`}>
                          {center.target}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex min-w-[42px] justify-center rounded-full border px-2.5 py-1 text-xs font-bold tabular-nums ${deliveryStatusStyles.cooked.pill}`}>
                          {center.cooked}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex min-w-[42px] justify-center rounded-full border px-2.5 py-1 text-xs font-bold tabular-nums ${deliveryStatusStyles.inDelivery.pill}`}>
                          {center.inDelivery}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex min-w-[42px] justify-center rounded-full border px-2.5 py-1 text-xs font-bold tabular-nums ${deliveryStatusStyles.received.pill}`}>
                          {center.received}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} className="text-muted-foreground" />
                            <span>{center.distance}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} className="text-muted-foreground" />
                            <span>{center.travelTimeMinutes} {labels.travelTimeUnit}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}
