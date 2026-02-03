'use client';

import { MapPin } from 'lucide-react';
import { useState } from 'react';
import { getGoogleMapsUrl } from '@/lib/utils';

interface Location {
  id: string;
  name: string;
  type: 'school' | 'health' | string;
  cluster: number;
  radius: string;
}

interface ClusterData {
  clusterId: number;
  radius: string;
  color: string;
  count: number;
  schools: Location[];
  healthCenters: Location[];
}

interface GeospatialMapProps {
  clusters: ClusterData[];
  language: 'en' | 'id';
}

export function GeospatialMap({ clusters, language }: GeospatialMapProps) {
  const [selectedCluster, setSelectedCluster] = useState<number>(1);

  const activeCluster = clusters.find(c => c.clusterId === selectedCluster);
  const labels = language === 'id'
    ? {
        title: 'Distribusi Geospasial',
        schools: 'Sekolah',
        healthCenters: 'Fasilitas Kesehatan',
        locations: 'Lokasi',
        health: 'Kesehatan',
      }
    : {
        title: 'Geospatial Distribution',
        schools: 'Schools',
        healthCenters: 'Health Centers',
        locations: 'Locations',
        health: 'Health',
      };
  const mapLabel = language === 'id' ? 'Buka di Google Maps' : 'Open in Google Maps';

  return (
    <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
      <div className="p-6 border-b border-border bg-secondary/50">
        <h3 className="font-bold text-foreground text-base flex items-center gap-3 uppercase tracking-tight">
          <MapPin size={20} className="text-primary" /> {labels.title}
        </h3>
      </div>

      <div className="p-8 space-y-6">
        {/* Map Visualization */}
        <div className="relative w-full h-[28rem] bg-secondary rounded-xl border border-border flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Background map shape */}
            <rect width="400" height="300" fill="#f0f9ff" />
            
            {/* Cluster circles */}
            {clusters.map((cluster) => (
              <g key={cluster.clusterId}>
                {/* Outer circle for radius visualization */}
                <circle
                  cx="200"
                  cy="150"
                  r={cluster.clusterId === 1 ? 60 : cluster.clusterId === 2 ? 100 : 140}
                  fill="none"
                  stroke={cluster.color}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.5"
                />
                
                {/* Cluster label */}
                <text
                  x={cluster.clusterId === 1 ? 200 : cluster.clusterId === 2 ? 220 : 250}
                  y={cluster.clusterId === 1 ? 100 : cluster.clusterId === 2 ? 60 : 30}
                  fontSize="12"
                  fontWeight="bold"
                  fill={cluster.color}
                >
                  {cluster.radius}
                </text>
              </g>
            ))}

            {/* School pins */}
            {activeCluster?.schools.map((school, idx) => (
              <g key={`school-${idx}`}>
                <circle
                  cx={100 + idx * 60}
                  cy={100 + (idx % 2) * 80}
                  r="6"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                />
                <text x={100 + idx * 60} y={135 + (idx % 2) * 80} fontSize="10" textAnchor="middle" fill="#1f2937">
                  S{idx + 1}
                </text>
              </g>
            ))}

            {/* Health center pins */}
            {activeCluster?.healthCenters.map((health, idx) => (
              <g key={`health-${idx}`}>
                <circle
                  cx={150 + idx * 70}
                  cy={150 + (idx % 2) * 60}
                  r="6"
                  fill="#ef4444"
                  stroke="white"
                  strokeWidth="2"
                />
                <text x={150 + idx * 70} y={190 + (idx % 2) * 60} fontSize="10" textAnchor="middle" fill="#1f2937">
                  H{idx + 1}
                </text>
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md border border-border text-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>{labels.schools}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>{labels.healthCenters}</span>
            </div>
          </div>
        </div>

        {/* Cluster Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {clusters.map((cluster) => {
            const combinedLocations = [...cluster.schools, ...cluster.healthCenters];
            const totalLocations = combinedLocations.length;

            return (
              <div
                key={cluster.clusterId}
                role="button"
                tabIndex={0}
                aria-pressed={selectedCluster === cluster.clusterId}
                onClick={() => setSelectedCluster(cluster.clusterId)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedCluster(cluster.clusterId);
                  }
                }}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left cursor-pointer ${
                  selectedCluster === cluster.clusterId
                    ? `border-primary bg-primary/10`
                    : `border-border bg-secondary hover:border-primary/50`
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cluster.color }}></div>
                  <h4 className="font-bold text-foreground">{cluster.radius}</h4>
                  <span className="text-xs font-semibold text-muted-foreground ml-auto">{totalLocations} {labels.locations}</span>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-muted-foreground"><span className="font-semibold">{labels.schools}:</span> {cluster.schools.length}</p>
                  <p className="text-muted-foreground"><span className="font-semibold">{labels.health}:</span> {cluster.healthCenters.length}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-border text-xs space-y-1">
                  {combinedLocations.map((location, idx) => {
                    const mapUrl = getGoogleMapsUrl(location.name);
                    return (
                      <div key={`school-list-${location.id}`} className="text-foreground flex items-center gap-1">
                        <span className="text-primary font-bold">{idx + 1}.</span>
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                          aria-label={`${mapLabel}: ${location.name}`}
                          onClick={(event) => event.stopPropagation()}
                        >
                          {location.name}
                          <MapPin size={12} className="text-primary" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
