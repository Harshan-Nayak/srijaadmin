'use client'
import { Plus, FolderTree, ChevronRight, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import ImageUpload from '../../components/admin/ImageUpload';
import AddCategoryModal from '../../components/admin/AddCategoryModal';
import EditCategoryModal from '../../components/admin/EditCategoryModal';
import {
  getCustomCategories,
  addCustomCategory,
  addVariation,
  deleteVariation,
  deleteCustomCategory,
  updateCustomCategory,
  updateVariation,
  subscribeToCategories
} from '../../firebase/services';
import { toast } from 'react-hot-toast';

export default function CategoriesPage() {
  const [selectedRoot, setSelectedRoot] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedCustom, setSelectedCustom] = useState(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddVariationModalOpen, setIsAddVariationModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isEditVariationModalOpen, setIsEditVariationModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [customCategories, setCustomCategories] = useState({});
  const [loading, setLoading] = useState(false);

  const rootCategories = [
    'Traditional',
    'Modern',
    'Industrial',
    'Transitional',
    'Mid-Century Modern'
  ];

  const subCategories = [
    'Living Room',
    'Bedroom',
    'Dining Room',
    'Kitchen',
    'Courtyard',
    'Study/Home Office',
    'Entryway/Foyer',
    'Bathroom',
    'Pooja Room'
  ];

  useEffect(() => {
    let unsubscribe;

    if (selectedRoot && selectedSub) {
      setLoading(true);
      // Set up real-time listener
      unsubscribe = subscribeToCategories(selectedRoot, selectedSub, (categories) => {
        setCustomCategories(prev => ({
          ...prev,
          [`${selectedRoot}-${selectedSub}`]: categories
        }));
        setLoading(false);
      });
    }

    // Cleanup subscription on unmount or when selection changes
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedRoot, selectedSub]);

  const handleAddCategory = async ({ name, image }) => {
    try {
      setLoading(true);
      await addCustomCategory(selectedRoot, selectedSub, { name, image });
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVariation = async ({ name, image }) => {
    if (!selectedCustom) return;

    try {
      setLoading(true);
      await addVariation(
        selectedCustom.id,
        selectedRoot,
        selectedSub,
        { name, image }
      );
      toast.success('Variation added successfully');
    } catch (error) {
      console.error('Error adding variation:', error);
      toast.error('Failed to add variation');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVariation = async (variation) => {
    if (!selectedCustom) return;

    try {
      setLoading(true);
      await deleteVariation(selectedCustom.id, variation);

      // Update the local state immediately
      setCustomCategories(prev => {
        const key = `${selectedRoot}-${selectedSub}`;
        const categories = [...(prev[key] || [])];
        const categoryIndex = categories.findIndex(cat => cat.id === selectedCustom.id);
        
        if (categoryIndex !== -1) {
          const category = {...categories[categoryIndex]};
          category.variations = category.variations.filter(v => v.id !== variation.id);
          categories[categoryIndex] = category;
          
          // Update selectedCustom to reflect changes
          setSelectedCustom(category);
        }
        
        return {
          ...prev,
          [key]: categories
        };
      });

      toast.success('Variation deleted successfully');
    } catch (error) {
      console.error('Error deleting variation:', error);
      toast.error('Failed to delete variation');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      setLoading(true);
      await deleteCustomCategory(categoryId);
      
      // If the deleted category was selected, clear the selection
      if (selectedCustom?.id === categoryId) {
        setSelectedCustom(null);
      }
      
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async ({ name, image }) => {
    if (!editingItem) return;

    try {
      setLoading(true);
      await updateCustomCategory(
        editingItem.id,
        selectedRoot,
        selectedSub,
        { name, image }
      );
      toast.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    } finally {
      setLoading(false);
      setEditingItem(null);
      setIsEditCategoryModalOpen(false);
    }
  };

  const handleEditVariation = async ({ name, image }) => {
    if (!editingItem || !selectedCustom) return;

    try {
      setLoading(true);
      await updateVariation(
        selectedCustom.id,
        editingItem.id,
        selectedRoot,
        selectedSub,
        { name, image }
      );

      // Update the local state immediately
      setCustomCategories(prev => {
        const key = `${selectedRoot}-${selectedSub}`;
        const categories = [...(prev[key] || [])];
        const categoryIndex = categories.findIndex(cat => cat.id === selectedCustom.id);
        
        if (categoryIndex !== -1) {
          const category = {...categories[categoryIndex]};
          const variationIndex = category.variations.findIndex(v => v.id === editingItem.id);
          
          if (variationIndex !== -1) {
            category.variations = [...category.variations];
            category.variations[variationIndex] = {
              ...category.variations[variationIndex],
              name,
              image: image || category.variations[variationIndex].image
            };
            categories[categoryIndex] = category;
            
            // Update selectedCustom to reflect changes
            setSelectedCustom(category);
          }
        }
        
        return {
          ...prev,
          [key]: categories
        };
      });

      toast.success('Variation updated successfully');
    } catch (error) {
      console.error('Error updating variation:', error);
      toast.error('Failed to update variation');
    } finally {
      setLoading(false);
      setEditingItem(null);
      setIsEditVariationModalOpen(false);
    }
  };

  const getCurrentCategories = () => {
    return customCategories[`${selectedRoot}-${selectedSub}`] || [];
  };

  const getSubCategoryCount = (subCategory) => {
    if (!selectedRoot) return 0;
    return (customCategories[`${selectedRoot}-${subCategory}`] || []).length;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[1600px]">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categories</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">Manage your interior design categories</p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Root Categories Column */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
              <FolderTree className="w-5 h-5 mr-2 text-purple-600 flex-shrink-0" />
              <span className="truncate">Root Categories</span>
            </h2>
            <div className="mt-4 space-y-2">
              {rootCategories.map((category) => (
                <div
                  key={category}
                  onClick={() => {
                    setSelectedRoot(category);
                    setSelectedCustom(null);
                  }}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all
                    ${selectedRoot === category 
                      ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-200' 
                      : 'bg-gray-50 text-gray-700 hover:bg-purple-50/50'}`}
                >
                  <span className="truncate font-medium">{category}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sub Categories Column */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
              <FolderTree className="w-5 h-5 mr-2 text-purple-600 flex-shrink-0" />
              <span className="truncate">Sub Categories</span>
            </h2>
            <div className="mt-4 space-y-2">
              {subCategories.map((category) => (
                <div
                  key={category}
                  onClick={() => {
                    setSelectedSub(category);
                    setSelectedCustom(null);
                  }}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all
                    ${selectedSub === category 
                      ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-200' 
                      : 'bg-gray-50 text-gray-700 hover:bg-purple-50/50'}`}
                >
                  <span className="truncate font-medium">{category}</span>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className="text-sm text-gray-500">
                      {getSubCategoryCount(category)} {getSubCategoryCount(category) === 1 ? 'item' : 'items'}
                    </span>
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Categories Column */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              {selectedRoot && selectedSub && !loading && (
                <button
                  onClick={() => setIsAddCategoryModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 active:bg-purple-800 transition-all text-sm font-medium shadow-sm hover:shadow-md whitespace-nowrap w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              )}
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center min-w-0">
                <FolderTree className="w-5 h-5 mr-2 text-purple-600 flex-shrink-0" />
                <span className="truncate">Custom Categories</span>
              </h2>
            </div>
            
            {loading ? (
              <div className="h-40 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
              </div>
            ) : selectedRoot && selectedSub ? (
              <div className="space-y-4">
                {getCurrentCategories().map((category) => (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCustom(category)}
                    className={`relative group rounded-lg border transition-all overflow-hidden
                      ${selectedCustom?.id === category.id 
                        ? 'border-purple-400 ring-2 ring-purple-100' 
                        : 'border-gray-200 hover:border-purple-300'}`}
                  >
                    <div className="aspect-video w-full relative">
                      <img
                        src={category.featuredImage}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <h3 className="absolute bottom-2 left-3 text-white font-medium truncate right-12">
                        {category.name}
                      </h3>
                      <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingItem(category);
                            setIsEditCategoryModalOpen(true);
                          }}
                          className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.id);
                          }}
                          className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 active:bg-red-700 transition-colors shadow-sm"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-500 text-sm sm:text-base text-center px-4">
                Select a root and sub-category to view custom categories
              </div>
            )}
          </div>
        </div>

        {/* Variations Column */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              {selectedCustom && !loading && (
                <button
                  onClick={() => setIsAddVariationModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 active:bg-purple-800 transition-all text-sm font-medium shadow-sm hover:shadow-md whitespace-nowrap w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Variation</span>
                </button>
              )}
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center min-w-0">
                <ImageIcon className="w-5 h-5 mr-2 text-purple-600 flex-shrink-0" />
                <span className="truncate">Variations</span>
              </h2>
            </div>

            {loading ? (
              <div className="h-40 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
              </div>
            ) : selectedCustom ? (
              <div className="space-y-4">
                {selectedCustom.variations.map((variation) => (
                  <div key={variation.id} className="relative group rounded-lg border border-gray-200 hover:border-purple-300 transition-all overflow-hidden">
                    <div className="aspect-video w-full relative">
                      <img
                        src={variation.image}
                        alt={variation.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingItem(variation);
                            setIsEditVariationModalOpen(true);
                          }}
                          className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteVariation(variation);
                          }}
                          className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 active:bg-red-700 transition-colors shadow-sm"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 truncate">{variation.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-500 text-sm sm:text-base text-center px-4">
                Select a custom category to view variations
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onSubmit={handleAddCategory}
        type="category"
        title={`Add New Category to ${selectedRoot} - ${selectedSub}`}
      />

      <AddCategoryModal
        isOpen={isAddVariationModalOpen}
        onClose={() => setIsAddVariationModalOpen(false)}
        onSubmit={handleAddVariation}
        type="variation"
        title={`Add New Variation to ${selectedCustom?.name}`}
      />

      <EditCategoryModal
        isOpen={isEditCategoryModalOpen}
        onClose={() => {
          setIsEditCategoryModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleEditCategory}
        type="category"
        title={`Edit Category: ${editingItem?.name}`}
        initialData={editingItem}
      />

      <EditCategoryModal
        isOpen={isEditVariationModalOpen}
        onClose={() => {
          setIsEditVariationModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleEditVariation}
        type="variation"
        title={`Edit Variation: ${editingItem?.name}`}
        initialData={editingItem}
      />
    </div>
  );
} 