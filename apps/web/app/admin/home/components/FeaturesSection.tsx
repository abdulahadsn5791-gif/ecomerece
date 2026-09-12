import React, { useState } from 'react';
import { useThemeStore } from '@ecomerece/frontend/theme';
import { Sparkles, Plus, Pencil, Trash2 } from 'lucide-react';
import MutationButton from '@/components/Mutationbutton';
import { GenericConfirmModal } from '@/components/GenericConfirmModal';
import { DynamicIcon } from '@/lib/icons';
import { IconPicker } from './IconPicker';
import {
  useAddFeature,
  useUpdateFeature,
  useRemoveFeature,
} from '@ecomerece/frontend/home';
import type {
  HomeFeatureResponse,
  CreateFeatureDtoType,
  UpdateFeatureDtoType,
  DeleteFeatureDtoType,
} from '@ecomerece/shared';

interface FeaturesSectionProps {
  features: HomeFeatureResponse[];
  darkMode: boolean;
}

export const FeaturesSection = ({ features, darkMode }: FeaturesSectionProps) => {
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selected, setSelected] = useState<HomeFeatureResponse | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    detail: '',
    accent: '#4A7FB5',
    icon: 'Sparkles',
  });

  const addFeature = useAddFeature();
  const updateFeature = useUpdateFeature();
  const removeFeature = useRemoveFeature();

  const openCreate = () => {
    setFormData({ title: '', detail: '', accent: '#4A7FB5', icon: 'Sparkles' });
    setModalMode('create');
  };

  const openEdit = (feat: HomeFeatureResponse) => {
    setSelected(feat);
    setFormData({ title: feat.title, detail: feat.detail, accent: feat.accent, icon: feat.icon });
    setModalMode('edit');
  };

  const openDelete = (feat: HomeFeatureResponse) => {
    setSelected(feat);
    setModalMode('delete');
  };

  const handleCreate = () => {
    addFeature.mutate(formData as CreateFeatureDtoType, {
      onSuccess: () => setModalMode(null),
    });
  };

  const handleUpdate = () => {
    if (!selected) return;
    updateFeature.mutate(
      { id: selected.id, ...formData } as UpdateFeatureDtoType,
      { onSuccess: () => setModalMode(null) }
    );
  };

  const handleDelete = () => {
    if (!selected) return;
    removeFeature.mutate(
      { id: selected.id } as DeleteFeatureDtoType,
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
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'}`}
          >
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h3
              className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-neutral-900'}`}
            >
              Features
            </h3>
            <p
              className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
            >
              {features.length} feature{features.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <MutationButton variant="primary" size="sm" onClick={openCreate} icon={Plus}>
          Add Feature
        </MutationButton>
      </div>

      {features.length === 0 ? (
        <div
          className={`text-center py-10 rounded-2xl border ${darkMode ? 'bg-neutral-800/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200/60'}`}
        >
          <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
            No features configured yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((feat) => (
            <div
              key={feat.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${
                darkMode
                  ? 'bg-neutral-800 border-neutral-700'
                  : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: feat.accent + '20' }}
              >
                <DynamicIcon name={feat.icon} className="w-5 h-5" style={{ color: feat.accent }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-neutral-900'}`}
                >
                  {feat.title}
                </p>
                <p
                  className={`text-xs truncate ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
                >
                  {feat.detail}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEdit(feat)}
                  className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-neutral-700 text-neutral-400 hover:text-white' : 'hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900'}`}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openDelete(feat)}
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
          title={modalMode === 'create' ? 'Add New Feature' : 'Edit Feature'}
          message="Configure the feature details below."
          variant="success"
          confirmText={modalMode === 'create' ? 'Add Feature' : 'Save Changes'}
          isLoading={addFeature.isPending || updateFeature.isPending}
          error={addFeature.error || updateFeature.error}
          onConfirm={modalMode === 'create' ? handleCreate : handleUpdate}
          renderFields={() => (
            <div className="space-y-3">
              <IconPicker
                value={formData.icon}
                onChange={(icon) => setFormData((p) => ({ ...p, icon }))}
                darkMode={darkMode}
              />
              <input
                placeholder="Feature title"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                className={inputCls}
              />
              <input
                placeholder="Feature detail"
                value={formData.detail}
                onChange={(e) => setFormData((p) => ({ ...p, detail: e.target.value }))}
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
        title="Delete Feature?"
        message={`Are you sure you want to delete "${selected?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={removeFeature.isPending}
        error={removeFeature.error}
        onConfirm={handleDelete}
      />
    </div>
  );
};
