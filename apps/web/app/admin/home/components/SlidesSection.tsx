import React, { useState } from 'react';
import { useThemeStore } from '@ecomerece/frontend';
import { ImageIcon, Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import MutationButton from '@/components/Mutationbutton';
import { GenericConfirmModal } from '@/components/GenericConfirmModal';
import { useAddSlide, useUpdateSlide, useRemoveSlide } from '@ecomerece/frontend';
import type {
  HomeSlideResponse,
  CreateSlideDtoType,
  UpdateSlideDtoType,
  DeleteSlideDtoType,
} from '@ecomerece/shared';

interface SlidesSectionProps {
  slides: HomeSlideResponse[];
  darkMode: boolean;
}

export const SlidesSection = ({ slides, darkMode }: SlidesSectionProps) => {
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selectedSlide, setSelectedSlide] = useState<HomeSlideResponse | null>(null);
  const [formData, setFormData] = useState({
    tag: '',
    title: '',
    subhead: '',
    subtitle: '',
    cta: '',
    image: '',
    accent: '#4A7FB5',
  });

  const addSlide = useAddSlide();
  const updateSlide = useUpdateSlide();
  const removeSlide = useRemoveSlide();

  const openCreate = () => {
    setFormData({ tag: '', title: '', subhead: '', subtitle: '', cta: '', image: '', accent: '#4A7FB5' });
    setModalMode('create');
  };

  const openEdit = (slide: HomeSlideResponse) => {
    setSelectedSlide(slide);
    setFormData({
      tag: slide.tag,
      title: slide.title,
      subhead: slide.subhead,
      subtitle: slide.subtitle,
      cta: slide.cta,
      image: slide.image,
      accent: slide.accent,
    });
    setModalMode('edit');
  };

  const openDelete = (slide: HomeSlideResponse) => {
    setSelectedSlide(slide);
    setModalMode('delete');
  };

  const handleCreate = () => {
    addSlide.mutate(formData as CreateSlideDtoType, {
      onSuccess: () => setModalMode(null),
    });
  };

  const handleUpdate = () => {
    if (!selectedSlide) return;
    updateSlide.mutate(
      { id: selectedSlide.id, ...formData } as UpdateSlideDtoType,
      { onSuccess: () => setModalMode(null) }
    );
  };

  const handleDelete = () => {
    if (!selectedSlide) return;
    removeSlide.mutate(
      { id: selectedSlide.id } as DeleteSlideDtoType,
      { onSuccess: () => setModalMode(null) }
    );
  };

  const inputCls = `w-full p-3 text-sm rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
    darkMode
      ? 'bg-neutral-800 text-white placeholder-neutral-500'
      : 'bg-neutral-100 text-neutral-900 placeholder-neutral-400'
  }`;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}
          >
            <ImageIcon className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3
              className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-neutral-900'}`}
            >
              Slides
            </h3>
            <p
              className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
            >
              {slides.length} slide{slides.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <MutationButton variant="primary" size="sm" onClick={openCreate} icon={Plus}>
          Add Slide
        </MutationButton>
      </div>

      {slides.length === 0 ? (
        <div
          className={`text-center py-10 rounded-2xl border ${darkMode ? 'bg-neutral-800/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200/60'}`}
        >
          <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
            No slides configured yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {slides
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((slide) => (
              <div
                key={slide.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${
                  darkMode
                    ? 'bg-neutral-800 border-neutral-700'
                    : 'bg-neutral-50 border-neutral-200'
                }`}
                style={
                  { '--accent': slide.accent } as React.CSSProperties
                }
              >
                <GripVertical
                  className={`w-4 h-4 shrink-0 cursor-grab ${darkMode ? 'text-neutral-600' : 'text-neutral-300'}`}
                />
                <div
                  className="w-16 h-10 rounded-lg overflow-hidden shrink-0"
                  style={{ backgroundColor: slide.accent }}
                >
                  {slide.image && (
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mb-1 ${darkMode ? 'bg-neutral-700 text-neutral-300' : 'bg-neutral-200 text-neutral-600'}`}
                  >
                    {slide.tag}
                  </p>
                  <p
                    className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-neutral-900'}`}
                  >
                    {slide.title}
                  </p>
                  <p
                    className={`text-xs truncate ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
                  >
                    {slide.subhead}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(slide)}
                    className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-neutral-700 text-neutral-400 hover:text-white' : 'hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900'}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDelete(slide)}
                    className="p-2 rounded-xl transition-colors hover:bg-rose-500/10 text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {(modalMode === 'create' || modalMode === 'edit') && (
        <GenericConfirmModal
          isOpen={true}
          onClose={() => setModalMode(null)}
          title={modalMode === 'create' ? 'Add New Slide' : 'Edit Slide'}
          message="Configure the slide details below."
          variant="info"
          confirmText={modalMode === 'create' ? 'Add Slide' : 'Save Changes'}
          isLoading={addSlide.isPending || updateSlide.isPending}
          error={addSlide.error || updateSlide.error}
          onConfirm={modalMode === 'create' ? handleCreate : handleUpdate}
          renderFields={() => (
            <div className="space-y-3">
              <input
                placeholder="Tag (e.g. New Season)"
                value={formData.tag}
                onChange={(e) => setFormData((p) => ({ ...p, tag: e.target.value }))}
                className={inputCls}
              />
              <input
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                className={inputCls}
              />
              <input
                placeholder="Subhead"
                value={formData.subhead}
                onChange={(e) => setFormData((p) => ({ ...p, subhead: e.target.value }))}
                className={inputCls}
              />
              <input
                placeholder="Subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData((p) => ({ ...p, subtitle: e.target.value }))}
                className={inputCls}
              />
              <input
                placeholder="CTA text"
                value={formData.cta}
                onChange={(e) => setFormData((p) => ({ ...p, cta: e.target.value }))}
                className={inputCls}
              />
              <input
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
                className={inputCls}
              />
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.accent}
                  onChange={(e) => setFormData((p) => ({ ...p, accent: e.target.value }))}
                  className="w-10 h-10 rounded-xl border-0 cursor-pointer"
                />
                <span
                  className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
                >
                  Accent color
                </span>
              </div>
            </div>
          )}
        />
      )}

      <GenericConfirmModal
        isOpen={modalMode === 'delete'}
        onClose={() => setModalMode(null)}
        title="Delete Slide?"
        message={`Are you sure you want to delete "${selectedSlide?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={removeSlide.isPending}
        error={removeSlide.error}
        onConfirm={handleDelete}
      />
    </div>
  );
};
