'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageIcon, Play, X } from 'lucide-react';

interface GalleryItem {
  id: string;
  type: 'photo' | 'video';
  title: string;
  src: string;
  thumbnail?: string;
}

interface GalleryProps {
  title: string;
  items: readonly GalleryItem[];
  language: 'en' | 'id';
}

export function Gallery({ title, items, language }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'photo' | 'video'>('photo');

  const filteredItems = items.filter((item) => item.type === activeTab);
  const selectedItem = activeIndex === null ? null : filteredItems[activeIndex];
  const labels = language === 'id'
    ? { photos: 'Foto', videos: 'Video', empty: 'Belum ada item' }
    : { photos: 'Photos', videos: 'Videos', empty: 'No items yet' };

  const openItem = (index: number) => {
    setActiveIndex(index);
  };

  const closeModal = () => setActiveIndex(null);

  const showPrevious = () => {
    if (!filteredItems.length || activeIndex === null) return;
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + filteredItems.length) % filteredItems.length;
    });
  };

  const showNext = () => {
    if (!filteredItems.length || activeIndex === null) return;
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % filteredItems.length;
    });
  };

  // Reset modal when switching tabs so indexes stay in sync
  useEffect(() => {
    setActiveIndex(null);
  }, [activeTab]);

  // Keyboard shortcuts for modal navigation
  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') showPrevious();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, filteredItems.length]);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-secondary/50">
        <h3 className="font-bold text-foreground text-base flex items-center gap-3 uppercase tracking-tight">
          <div className="p-2.5 bg-primary/15 rounded-lg text-primary">
            <ImageIcon size={20} />
          </div>
          {title}
        </h3>
      </div>

      {/* Tabs */}
      <div className="p-4 bg-secondary/30 border-b border-border flex gap-2">
        <button
          onClick={() => setActiveTab('photo')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'photo'
              ? 'bg-primary text-primary-foreground'
              : 'bg-white text-foreground border border-border hover:bg-secondary'
          }`}
        >
          {labels.photos}
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'video'
              ? 'bg-primary text-primary-foreground'
              : 'bg-white text-foreground border border-border hover:bg-secondary'
          }`}
        >
          {labels.videos}
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="p-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon size={48} className="mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">{labels.empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openItem(index)}
                className="group cursor-pointer overflow-hidden rounded-xl bg-white border border-border shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <img
                    src={item.thumbnail || item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/45 transition-all flex items-center justify-center">
                      <div className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg">
                        <Play size={22} fill="currentColor" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <p className="text-white font-semibold p-3 text-sm">{item.title}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-2 bg-secondary/50 border-t border-border">
                  <span className="text-sm font-semibold text-foreground line-clamp-1">{item.title}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.type === 'video' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {item.type === 'video' ? labels.videos : labels.photos}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 bg-white/15 hover:bg-white/30 text-white rounded-full p-2 transition-all"
            >
              <X size={24} />
            </button>

            {/* Navigation */}
            {filteredItems.length > 1 && (
              <>
                <button
                  aria-label="Previous"
                  onClick={showPrevious}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/30 text-white rounded-full p-3 border border-white/20 shadow-lg transition"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  aria-label="Next"
                  onClick={showNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/30 text-white rounded-full p-3 border border-white/20 shadow-lg transition"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Content */}
            {selectedItem.type === 'photo' ? (
              <img
                src={selectedItem.src || "/placeholder.svg"}
                alt={selectedItem.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full aspect-video bg-black">
                <iframe
                  src={selectedItem.src}
                  title={selectedItem.title}
                  className="w-full h-full border-0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                />
              </div>
            )}

            {/* Title */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-white font-semibold text-lg leading-tight">{selectedItem.title}</p>
                {filteredItems.length > 1 && (
                  <p className="text-white/80 text-xs">{activeIndex! + 1} / {filteredItems.length}</p>
                )}
              </div>
              {selectedItem.type === 'video' && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-700">YouTube / Fullscreen</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
