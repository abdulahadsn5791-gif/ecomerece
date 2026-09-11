import React, { useState } from 'react';
import { useThemeStore } from '@ecomerece/frontend';
import { Tag, Plus, Pencil, Trash2, GripVertical, Maximize2 } from 'lucide-react';
import MutationButton from '@/components/Mutationbutton';
import { GenericConfirmModal } from '@/components/GenericConfirmModal';
import { ImageInput } from './ImageInput';
import { ImageLightbox } from './ImageLightbox';
import {
  useAddCategory,
  useUpdateCategory,
  useRemoveCategory,
} from '@ecomerece/frontend';
import type {
  HomeCategoryResponse,
  CreateHomeCategoryDtoType,
  UpdateHomeCategoryDtoType,
  DeleteHomeCategoryDtoType,
} from '@ecomerece/shared';

interface CategoriesSectionProps {
  categories: HomeCategoryResponse[];
  darkMode: boolean;
}

export const CategoriesSection = ({ categories, darkMode }: CategoriesSectionProps) => {
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selected, setSelected] = useState<HomeCategoryResponse | null>(null);
  const [formData, setFormData] = useState({ name: '', image: '', accent: '#4A7FB5' });
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const addCategory = useAddCategory();
  const updateCategory = useUpdateCategory();
  const removeCategory = useRemoveCategory();

  const openCreate = () => {
    setFormData({ name: '', image: '', accent: '#4A7FB5' });
    setModalMode('create');
  };

  const openEdit = (cat: HomeCategoryResponse) => {
    setSelected(cat);
    setFormData({ name: cat.name, image: cat.image, accent: cat.accent });
    setModalMode('edit');
  };

  const openDelete = (cat: HomeCategoryResponse) => {
    setSelected(cat);
    setModalMode('delete');
  };

  const handleCreate = () => {
    addCategory.mutate(formData as CreateHomeCategoryDtoType, {
      onSuccess: () => setModalMode(null),
    });
  };

  const handleUpdate = () => {
    if (!selected) return;
    updateCategory.mutate(
      { id: selected.id, ...formData } as UpdateHomeCategoryDtoType,
      { onSuccess: () => setModalMode(null) }
    );
  };

  const handleDelete = () => {
    if (!selected) return;
    removeCategory.mutate(
      { id: selected.id } as DeleteHomeCategoryDtoType,
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
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-violet-900/30' : 'bg-violet-100'}`}
          >
            <Tag className="w-5 h-5 text-violet-500" />
          </div>
          <div>
            <h3
              className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-neutral-900'}`}
            >
              Categories
            </h3>
            <p
              className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
            >
              {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
            </p>
          </div>
        </div>
        <MutationButton variant="primary" size="sm" onClick={openCreate} icon={Plus}>
          Add Category
        </MutationButton>
      </div>

      {categories.length === 0 ? (
        <div
          className={`text-center py-10 rounded-2xl border ${darkMode ? 'bg-neutral-800/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200/60'}`}
        >
          <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
            No categories configured yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${
                darkMode
                  ? 'bg-neutral-800 border-neutral-700'
                  : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <GripVertical
                className={`w-4 h-4 shrink-0 cursor-grab ${darkMode ? 'text-neutral-600' : 'text-neutral-300'}`}
              />
              <button
                type="button"
                onClick={() => setPreviewSrc(cat.image)}
                title="Expand image preview"
                aria-label={`Preview image for ${cat.name}`}
                className="w-12 h-12 rounded-xl overflow-hidden shrink-0 group relative"
                style={{ backgroundColor: cat.accent }}
              >
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100">
                  <Maximize2 className="w-4 h-4 text-white" />
                </span>
              </button>
              <p
                className={`flex-1 font-semibold truncate ${darkMode ? 'text-white' : 'text-neutral-900'}`}
              >
                {cat.name}
              </p>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEdit(cat)}
                  className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-neutral-700 text-neutral-400 hover:text-white' : 'hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900'}`}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openDelete(cat)}
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
          title={modalMode === 'create' ? 'Add New Category' : 'Edit Category'}
          message="Configure the category details below."
          variant="confirm"
          wide
          confirmText={modalMode === 'create' ? 'Add Category' : 'Save Changes'}
          isLoading={addCategory.isPending || updateCategory.isPending}
          error={addCategory.error || updateCategory.error}
          onConfirm={modalMode === 'create' ? handleCreate : handleUpdate}
          renderFields={() => (
            <div className="space-y-3">
              <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
                <input
                  placeholder="Category name"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className={inputCls}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.accent}
                    onChange={(e) => setFormData((p) => ({ ...p, accent: e.target.value }))}
                    className="w-10 h-10 rounded-xl border-0 cursor-pointer"
                  />
                  <span
                    className={`text-sm whitespace-nowrap ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
                  >
                    Accent
                  </span>
                </div>
              </div>
              <ImageInput
                value={formData.image}
                onChange={(image) => setFormData((p) => ({ ...p, image }))}
                darkMode={darkMode}
              />
            </div>
          )}
        />
      )}

      <GenericConfirmModal
        isOpen={modalMode === 'delete'}
        onClose={() => setModalMode(null)}
        title="Delete Category?"
        message={`Are you sure you want to delete "${selected?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={removeCategory.isPending}
        error={removeCategory.error}
        onConfirm={handleDelete}
      />

      <ImageLightbox
        src={previewSrc}
        alt="Category image preview"
        onClose={() => setPreviewSrc(null)}
      />
    </div>
  );
};
