import React, { useState } from 'react';
import { useThemeStore } from '@ecomerece/frontend';
import { Layers, Plus, Pencil, Trash2 } from 'lucide-react';
import MutationButton from '@/components/Mutationbutton';
import { GenericConfirmModal } from '@/components/GenericConfirmModal';
import {
  useAddPromo,
  useUpdatePromo,
  useRemovePromo,
} from '@ecomerece/frontend';
import type {
  HomePromoResponse,
  CreatePromoDtoType,
  UpdatePromoDtoType,
  DeletePromoDtoType,
} from '@ecomerece/shared';

interface PromosSectionProps {
  promos: HomePromoResponse[];
  darkMode: boolean;
}

export const PromosSection = ({ promos, darkMode }: PromosSectionProps) => {
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selected, setSelected] = useState<HomePromoResponse | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    accent: '#4A7FB5',
    link: '',
  });

  const addPromo = useAddPromo();
  const updatePromo = useUpdatePromo();
  const removePromo = useRemovePromo();

  const openCreate = () => {
    setFormData({ title: '', subtitle: '', image: '', accent: '#4A7FB5', link: '' });
    setModalMode('create');
  };

  const openEdit = (promo: HomePromoResponse) => {
    setSelected(promo);
    setFormData({
      title: promo.title,
      subtitle: promo.subtitle,
      image: promo.image,
      accent: promo.accent,
      link: promo.link,
    });
    setModalMode('edit');
  };

  const openDelete = (promo: HomePromoResponse) => {
    setSelected(promo);
    setModalMode('delete');
  };

  const handleCreate = () => {
    addPromo.mutate(formData as CreatePromoDtoType, {
      onSuccess: () => setModalMode(null),
    });
  };

  const handleUpdate = () => {
    if (!selected) return;
    updatePromo.mutate(
      { id: selected.id, ...formData } as UpdatePromoDtoType,
      { onSuccess: () => setModalMode(null) }
    );
  };

  const handleDelete = () => {
    if (!selected) return;
    removePromo.mutate(
      { id: selected.id } as DeletePromoDtoType,
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
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-orange-900/30' : 'bg-orange-100'}`}
          >
            <Layers className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3
              className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-neutral-900'}`}
            >
              Promos
            </h3>
            <p
              className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
            >
              {promos.length} promo{promos.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <MutationButton variant="primary" size="sm" onClick={openCreate} icon={Plus}>
          Add Promo
        </MutationButton>
      </div>

      {promos.length === 0 ? (
        <div
          className={`text-center py-10 rounded-2xl border ${darkMode ? 'bg-neutral-800/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200/60'}`}
        >
          <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
            No promos configured yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${
                darkMode
                  ? 'bg-neutral-800 border-neutral-700'
                  : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <div
                className="w-14 h-14 rounded-xl overflow-hidden shrink-0"
                style={{ backgroundColor: promo.accent }}
              >
                {promo.image && (
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-neutral-900'}`}
                >
                  {promo.title}
                </p>
                <p
                  className={`text-xs truncate ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
                >
                  {promo.subtitle}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEdit(promo)}
                  className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-neutral-700 text-neutral-400 hover:text-white' : 'hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900'}`}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openDelete(promo)}
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
          title={modalMode === 'create' ? 'Add New Promo' : 'Edit Promo'}
          message="Configure the promo details below."
          variant="warning"
          confirmText={modalMode === 'create' ? 'Add Promo' : 'Save Changes'}
          isLoading={addPromo.isPending || updatePromo.isPending}
          error={addPromo.error || updatePromo.error}
          onConfirm={modalMode === 'create' ? handleCreate : handleUpdate}
          renderFields={() => (
            <div className="space-y-3">
              <input
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                className={inputCls}
              />
              <input
                placeholder="Subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData((p) => ({ ...p, subtitle: e.target.value }))}
                className={inputCls}
              />
              <input
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
                className={inputCls}
              />
              <input
                placeholder="Link URL"
                value={formData.link}
                onChange={(e) => setFormData((p) => ({ ...p, link: e.target.value }))}
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
        title="Delete Promo?"
        message={`Are you sure you want to delete "${selected?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={removePromo.isPending}
        error={removePromo.error}
        onConfirm={handleDelete}
      />
    </div>
  );
};
