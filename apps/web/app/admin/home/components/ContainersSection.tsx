import React, { useState } from 'react';
import { useThemeStore } from '@ecomerece/frontend';
import { Box, Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import MutationButton from '@/components/Mutationbutton';
import { GenericConfirmModal } from '@/components/GenericConfirmModal';
import {
  useAddProductContainer,
  useUpdateProductContainer,
  useRemoveProductContainer,
} from '@ecomerece/frontend';
import type {
  HomeContainerResponse,
  CreateProductContainerDtoType,
  UpdateProductContainerDtoType,
  DeleteProductContainerDtoType,
} from '@ecomerece/shared';

interface ContainersSectionProps {
  containers: HomeContainerResponse[];
  darkMode: boolean;
}

export const ContainersSection = ({ containers, darkMode }: ContainersSectionProps) => {
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [selected, setSelected] = useState<HomeContainerResponse | null>(null);
  const [formData, setFormData] = useState({
    heading: '',
    subTitle: '',
    limit: 8,
  });

  const addContainer = useAddProductContainer();
  const updateContainer = useUpdateProductContainer();
  const removeContainer = useRemoveProductContainer();

  const openCreate = () => {
    setFormData({ heading: '', subTitle: '', limit: 8 });
    setModalMode('create');
  };

  const openEdit = (container: HomeContainerResponse) => {
    setSelected(container);
    setFormData({
      heading: container.heading,
      subTitle: container.subTitle,
      limit: container.query?.limit ?? 8,
    });
    setModalMode('edit');
  };

  const openDelete = (container: HomeContainerResponse) => {
    setSelected(container);
    setModalMode('delete');
  };

  const handleCreate = () => {
    addContainer.mutate(
      {
        heading: formData.heading,
        subTitle: formData.subTitle,
        query: { limit: formData.limit },
        displayOrder: containers.length,
      } as CreateProductContainerDtoType,
      { onSuccess: () => setModalMode(null) }
    );
  };

  const handleUpdate = () => {
    if (!selected) return;
    updateContainer.mutate(
      {
        id: selected.id,
        heading: formData.heading,
        subTitle: formData.subTitle,
        query: { limit: formData.limit },
      } as UpdateProductContainerDtoType,
      { onSuccess: () => setModalMode(null) }
    );
  };

  const handleDelete = () => {
    if (!selected) return;
    removeContainer.mutate(
      { id: selected.id } as DeleteProductContainerDtoType,
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
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-rose-900/30' : 'bg-rose-100'}`}
          >
            <Box className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3
              className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-neutral-900'}`}
            >
              Product Containers
            </h3>
            <p
              className={`text-xs ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
            >
              {containers.length} container{containers.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <MutationButton variant="primary" size="sm" onClick={openCreate} icon={Plus}>
          Add Container
        </MutationButton>
      </div>

      {containers.length === 0 ? (
        <div
          className={`text-center py-10 rounded-2xl border ${darkMode ? 'bg-neutral-800/50 border-neutral-800' : 'bg-neutral-50 border-neutral-200/60'}`}
        >
          <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
            No product containers configured yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {containers
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((container) => (
              <div
                key={container.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${
                  darkMode
                    ? 'bg-neutral-800 border-neutral-700'
                    : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <GripVertical
                  className={`w-4 h-4 shrink-0 cursor-grab ${darkMode ? 'text-neutral-600' : 'text-neutral-300'}`}
                />
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${darkMode ? 'bg-rose-900/30' : 'bg-rose-100'}`}
                >
                  <Box className="w-5 h-5 text-rose-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-neutral-900'}`}
                  >
                    {container.heading}
                  </p>
                  <p
                    className={`text-xs truncate ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
                  >
                    {container.subTitle} &middot; Limit: {container.query?.limit ?? 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(container)}
                    className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-neutral-700 text-neutral-400 hover:text-white' : 'hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900'}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDelete(container)}
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
          title={
            modalMode === 'create'
              ? 'Add New Container'
              : 'Edit Container'
          }
          message="Configure the product container below."
          variant="info"
          confirmText={
            modalMode === 'create' ? 'Add Container' : 'Save Changes'
          }
          isLoading={addContainer.isPending || updateContainer.isPending}
          error={addContainer.error || updateContainer.error}
          onConfirm={modalMode === 'create' ? handleCreate : handleUpdate}
          renderFields={() => (
            <div className="space-y-3">
              <input
                placeholder="Heading"
                value={formData.heading}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, heading: e.target.value }))
                }
                className={inputCls}
              />
              <input
                placeholder="Subtitle"
                value={formData.subTitle}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, subTitle: e.target.value }))
                }
                className={inputCls}
              />
              <input
                type="number"
                placeholder="Product limit"
                value={formData.limit}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    limit: parseInt(e.target.value) || 8,
                  }))
                }
                className={inputCls}
              />
            </div>
          )}
        />
      )}

      <GenericConfirmModal
        isOpen={modalMode === 'delete'}
        onClose={() => setModalMode(null)}
        title="Delete Container?"
        message={`Are you sure you want to delete "${selected?.heading}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={removeContainer.isPending}
        error={removeContainer.error}
        onConfirm={handleDelete}
      />
    </div>
  );
};
