'use client'
import { Plus, FolderTree, ChevronRight, Image as ImageIcon, X, Loader2, Pencil, Trash2 } from 'lucide-react';
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

const SUB_SUB_CATEGORIES = {
  'Traditional': {
    'Living Room': [
      'Furniture',
      'Decor & Accessories',
      'Lighting',
      'Entertainment & Electronics',
      'Storage & Utility'
    ],
    'Bedroom': [
      'Furniture',
      'Bedding Essentials',
      'Decor & Accessories',
      'Storage & Organization',
      'Lighting'
    ],
    'Dining Room': [
      'Furniture',
      'Tableware & Dining Essentials',
      'Decor & Accessories',
      'Lighting'
    ],
    'Kitchen': [
      'Major Appliances',
      'Small Appliances',
      'Cookware & Bakeware',
      'Storage & Organization',
      'Dining & Serving',
      'Miscellaneous'
    ],
    'Courtyard': [
      'Furniture',
      'Decor & Accessories',
      'Gardening & Landscaping'
    ],
    'Study/Home Office': [
      'Furniture',
      'Tech & Accessories',
      'Office Supplies',
      'Decor'
    ],
    'Entryway/Foyer': [
      'Furniture',
      'Decor & Accessories',
      'Lighting'
    ],
    'Bathroom': [
      'Sanitary Fixtures',
      'Storage & Organization',
      'Toiletries & Essentials',
      'Decor & Accessories'
    ],
    'Pooja Room': [
      'Furniture',
      'Religious Essentials',
      'Storage & Organization',
      'Decor'
    ]
  },
  'Modern': {
    'Living Room': [
      'Furniture',
      'Decor & Accessories',
      'Lighting',
      'Entertainment & Electronics',
      'Smart Gadgets',
      'Storage & Utility'
    ],
    'Bedroom': [
      'Furniture',
      'Bedding Essentials',
      'Decor & Accessories',
      'Storage & Organization',
      'Lighting',
      'Smart Gadgets & Automation'
    ],
    'Dining Room': [
      'Furniture',
      'Tableware & Dining Essentials',
      'Decor & Accessories',
      'Lighting',
      'Smart Appliances'
    ],
    'Kitchen': [
      'Major Appliances',
      'Small Appliances',
      'Cookware & Bakeware',
      'Storage & Organization',
      'Dining & Serving',
      'Miscellaneous'
    ],
    'Courtyard': [
      'Furniture',
      'Decor & Accessories',
      'Gardening & Landscaping',
      'Smart Gadgets'
    ],
    'Study/Home Office': [
      'Furniture',
      'Tech & Accessories',
      'Office Supplies',
      'Decor',
      'Smart Gadgets'
    ],
    'Entryway/Foyer': [
      'Furniture',
      'Decor & Accessories',
      'Lighting',
      'Smart Gadgets'
    ],
    'Bathroom': [
      'Sanitary Fixtures',
      'Storage & Organization',
      'Toiletries & Essentials',
      'Decor & Accessories',
      'Smart Gadgets',
      'Luxury Accessories'
    ],
    'Pooja Room': [
      'Furniture',
      'Religious Essentials',
      'Storage & Organization',
      'Decor',
      'Smart Gadgets'
    ]
  },
  'Industrial': {
    'Living Room': [
      'Furniture',
      'Decor & Accessories',
      'Lighting',
      'Entertainment & Electronics',
      'Storage & Utility'
    ],
    'Bedroom': [
      'Furniture',
      'Bedding Essentials',
      'Decor & Accessories',
      'Storage & Organization',
      'Lighting'
    ],
    'Dining Room': [
      'Furniture',
      'Tableware & Dining Essentials',
      'Decor & Accessories',
      'Lighting',
      'Smart Appliances'
    ],
    'Kitchen': [
      'Major Appliances',
      'Small Appliances',
      'Cookware & Bakeware',
      'Storage & Organization',
      'Dining & Serving',
      'Miscellaneous'
    ],
    'Courtyard': [
      'Furniture',
      'Decor & Accessories',
      'Gardening & Landscaping',
      'Smart Gadgets'
    ],
    'Study/Home Office': [
      'Furniture',
      'Tech & Accessories',
      'Office Supplies',
      'Decor',
      'Smart Gadgets'
    ],
    'Entryway/Foyer': [
      'Furniture',
      'Decor & Accessories',
      'Lighting',
      'Smart Gadgets'
    ],
    'Bathroom': [
      'Sanitary Fixtures',
      'Storage & Organization',
      'Toiletries & Essentials',
      'Decor & Accessories',
      'Smart Gadgets',
      'Luxury Accessories'
    ],
    'Pooja Room': [
      'Furniture',
      'Religious Essentials',
      'Storage & Organization',
      'Decor',
      'Smart Gadgets'
    ]
  },
  'Transitional': {
    'Living Room': [
      'Furniture',
      'Decor & Accessories',
      'Lighting',
      'Entertainment & Electronics',
      'Storage & Utility'
    ],
    'Bedroom': [
      'Furniture',
      'Bedding Essentials',
      'Decor & Accessories',
      'Storage & Organization',
      'Lighting'
    ],
    'Dining Room': [
      'Furniture',
      'Tableware & Dining Essentials',
      'Decor & Accessories',
      'Lighting'
    ],
    'Kitchen': [
      'Major Appliances',
      'Small Appliances',
      'Cookware & Bakeware',
      'Storage & Organization',
      'Dining & Serving',
      'Miscellaneous'
    ],
    'Courtyard': [
      'Furniture',
      'Decor & Accessories',
      'Gardening & Landscaping'
    ],
    'Study/Home Office': [
      'Furniture',
      'Tech & Accessories',
      'Office Supplies',
      'Decor'
    ],
    'Entryway/Foyer': [
      'Furniture',
      'Decor & Accessories',
      'Lighting'
    ],
    'Bathroom': [
      'Sanitary Fixtures',
      'Storage & Organization',
      'Toiletries & Essentials',
      'Decor & Accessories'
    ],
    'Pooja Room': [
      'Furniture',
      'Religious Essentials',
      'Storage & Organization',
      'Decor'
    ]
  },
  'Mid-Century Modern': {
    'Living Room': [
      'Furniture',
      'Decor & Accessories',
      'Lighting',
      'Entertainment & Electronics',
      'Storage & Utility'
    ],
    'Bedroom': [
      'Furniture',
      'Bedding Essentials',
      'Decor & Accessories',
      'Storage & Organization',
      'Lighting'
    ],
    'Dining Room': [
      'Furniture',
      'Tableware & Dining Essentials',
      'Decor & Accessories',
      'Lighting'
    ],
    'Kitchen': [
      'Major Appliances',
      'Small Appliances',
      'Cookware & Bakeware',
      'Storage & Organization',
      'Dining & Serving',
      'Miscellaneous'
    ],
    'Courtyard': [
      'Furniture',
      'Decor & Accessories',
      'Gardening & Landscaping'
    ],
    'Study/Home Office': [
      'Furniture',
      'Tech & Accessories',
      'Office Supplies',
      'Decor'
    ],
    'Entryway/Foyer': [
      'Furniture',
      'Decor & Accessories',
      'Lighting'
    ],
    'Bathroom': [
      'Sanitary Fixtures',
      'Storage & Organization',
      'Toiletries & Essentials',
      'Decor & Accessories'
    ],
    'Pooja Room': [
      'Furniture',
      'Religious Essentials',
      'Storage & Organization',
      'Decor'
    ]
  }
};

export default function CategoriesPage() {
  const [selectedRoot, setSelectedRoot] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedSubSub, setSelectedSubSub] = useState(null);
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
    if (!selectedRoot || !selectedSub || !selectedSubSub) {
      toast.error('Please select a root, sub category, and category type first');
      return;
    }

    try {
      console.log('Adding category with:', { 
        name, 
        imageType: image ? (image instanceof File ? 'File' : typeof image) : 'none',
        imageSize: image instanceof File ? `${(image.size / 1024).toFixed(2)}KB` : 'N/A'
      });
      
      if (!image || !(image instanceof File)) {
        throw new Error('Please select a valid image file');
      }
      
      setLoading(true);
      await addCustomCategory(selectedRoot, selectedSub, selectedSubSub, { 
        name: name.trim(), 
        image 
      });
      
      setIsAddCategoryModalOpen(false);
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error(error.message || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVariation = async ({ name, image }) => {
    if (!selectedCustom) {
      toast.error('Please select a category first');
      return;
    }

    try {
      console.log('Adding variation with:', { 
        name, 
        imageType: image ? (image instanceof File ? 'File' : typeof image) : 'none',
        imageSize: image instanceof File ? `${(image.size / 1024).toFixed(2)}KB` : 'N/A'
      });
      
      if (!image || !(image instanceof File)) {
        throw new Error('Please select a valid image file');
      }
      
      setLoading(true);
      await addVariation(
        selectedCustom.id,
        selectedRoot,
        selectedSub,
        selectedSubSub,
        { 
          name: name.trim(), 
          image 
        }
      );
      
      setIsAddVariationModalOpen(false);
      toast.success('Variation added successfully');
    } catch (error) {
      console.error('Error adding variation:', error);
      toast.error(error.message || 'Failed to add variation');
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
        const key = `${selectedRoot}-${selectedSub}-${selectedSubSub}`;
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
    if (!editingItem) {
      toast.error('No category selected for editing');
      return;
    }

    if (!selectedRoot || !selectedSub || !selectedSubSub) {
      toast.error('Root, sub category, and category type must be selected');
      return;
    }

    try {
      console.log('Editing category with:', { 
        name, 
        imageType: image ? (image instanceof File ? 'File' : typeof image) : 'none',
        imageSize: image instanceof File ? `${(image.size / 1024).toFixed(2)}KB` : 'N/A'
      });

      setLoading(true);
      await updateCustomCategory(
        editingItem.id,
        selectedRoot,
        selectedSub,
        selectedSubSub,
        { 
          name: name.trim(),
          image: image instanceof File ? image : undefined
        }
      );
      
      setIsEditCategoryModalOpen(false);
      toast.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error(error.message || 'Failed to update category');
    } finally {
      setLoading(false);
      setEditingItem(null);
    }
  };

  const handleEditVariation = async ({ name, image }) => {
    if (!editingItem || !selectedCustom) {
      toast.error('No variation selected for editing');
      return;
    }

    if (!selectedRoot || !selectedSub || !selectedSubSub) {
      toast.error('Root, sub category, and category type must be selected');
      return;
    }

    try {
      console.log('Editing variation with:', { 
        name, 
        imageType: image ? (image instanceof File ? 'File' : typeof image) : 'none',
        imageSize: image instanceof File ? `${(image.size / 1024).toFixed(2)}KB` : 'N/A'
      });

      setLoading(true);
      await updateVariation(
        selectedCustom.id,
        editingItem.id,
        selectedRoot,
        selectedSub,
        selectedSubSub,
        { 
          name: name.trim(),
          image: image instanceof File ? image : undefined
        }
      );

      setIsEditVariationModalOpen(false);
      toast.success('Variation updated successfully');
    } catch (error) {
      console.error('Error updating variation:', error);
      toast.error(error.message || 'Failed to update variation');
    } finally {
      setLoading(false);
      setEditingItem(null);
    }
  };

  const getCurrentCategories = () => {
    if (!selectedRoot || !selectedSub || !selectedSubSub) {
      return [];
    }
    const categories = customCategories[`${selectedRoot}-${selectedSub}`] || [];
    return categories.filter(category => category.type === selectedSubSub);
  };

  const getSubCategoryCount = (subCategory) => {
    if (!selectedRoot) return 0;
    return (customCategories[`${selectedRoot}-${subCategory}`] || []).length;
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Root Categories Column */}
        <div className="bg-white rounded-lg shadow-sm p-4 min-w-[160px]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Root Categories</h2>
          </div>
          <div className="space-y-1">
            {rootCategories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedRoot(category);
                  setSelectedSub(null);
                  setSelectedSubSub(null);
                  setSelectedCustom(null);
                }}
                className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                  selectedRoot === category
                    ? 'bg-purple-100 text-purple-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sub Categories Column */}
        <div className="bg-white rounded-lg shadow-sm p-4 min-w-[160px]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Sub Categories</h2>
          </div>
          <div className="space-y-1">
            {subCategories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedSub(category);
                  setSelectedSubSub(null);
                  setSelectedCustom(null);
                }}
                disabled={!selectedRoot}
                className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                  !selectedRoot
                    ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-500'
                    : selectedSub === category
                    ? 'bg-purple-100 text-purple-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-Sub Categories Column */}
        <div className="bg-white rounded-lg shadow-sm p-4 min-w-[160px]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Category Types</h2>
          </div>
          <div className="space-y-1">
            {selectedRoot && selectedSub && SUB_SUB_CATEGORIES[selectedRoot]?.[selectedSub]?.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedSubSub(category)}
                className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                  selectedSubSub === category
                    ? 'bg-purple-100 text-purple-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
            {(!selectedRoot || !selectedSub) && (
              <p className="text-xs text-gray-500">Select a root and sub category to view types</p>
            )}
          </div>
        </div>

        {/* Custom Categories Column */}
        <div className="bg-white rounded-lg shadow-sm p-4 col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Custom Categories</h2>
            <button
              onClick={() => setIsAddCategoryModalOpen(true)}
              disabled={!selectedRoot || !selectedSub || !selectedSubSub}
              className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={!selectedRoot || !selectedSub || !selectedSubSub ? "Select root category, sub category, and category type first" : "Add new category"}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : selectedRoot && selectedSub && selectedSubSub ? (
            <div className="space-y-3">
              {getCurrentCategories().map((category) => (
                <div
                  key={category.id}
                  className={`border rounded-lg p-3 space-y-3 ${
                    selectedCustom?.id === category.id ? 'border-purple-200 bg-purple-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                        {category.featuredImage && (
                          <img
                            src={category.featuredImage}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {category.variations?.length || 0} variations
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(category);
                          setIsEditCategoryModalOpen(true);
                        }}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {selectedCustom?.id === category.id && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">Variations</h4>
                        <button
                          onClick={() => setIsAddVariationModalOpen(true)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {category.variations?.map((variation) => (
                          <div
                            key={variation.id}
                            className="flex items-center justify-between gap-3 p-2 bg-white rounded border border-gray-200"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="w-8 h-8 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                                {variation.image && (
                                  <img
                                    src={variation.image}
                                    alt={variation.name}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <span className="text-sm text-gray-900 truncate">
                                {variation.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingItem(variation);
                                  setIsEditVariationModalOpen(true);
                                }}
                                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteVariation(variation)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                        {!category.variations?.length && (
                          <p className="text-sm text-gray-500 text-center py-2">
                            No variations added yet
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedCustom(selectedCustom?.id === category.id ? null : category)}
                    className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                  >
                    {selectedCustom?.id === category.id ? 'Hide variations' : 'Show variations'}
                  </button>
                </div>
              ))}
              {!getCurrentCategories().length && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No custom categories added yet for this category type
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Select a root category, sub category, and category type to view custom categories
            </p>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onSubmit={handleAddCategory}
        type="category"
        title={`Add New Category to ${selectedRoot} - ${selectedSub} - ${selectedSubSub}`}
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