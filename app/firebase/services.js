import { db, storage } from './config';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  arrayUnion,
  arrayRemove,
  and,
  serverTimestamp,
  addDoc,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Upload image to Firebase Storage
export const uploadImage = async (file, path) => {
  try {
    // Create a storage reference
    const storageRef = ref(storage, path);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    console.log('Uploaded file successfully');
    
    // Get the download URL
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

// Delete image from Firebase Storage
export const deleteImage = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    console.log('Deleted file successfully');
  } catch (error) {
    console.error('Error deleting image:', error);
    // If file doesn't exist, don't throw error
    if (error.code !== 'storage/object-not-found') {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }
};

// Real-time subscription to categories
export const subscribeToCategories = (rootCategory, subCategory, callback) => {
  if (!rootCategory || !subCategory) return null;

  const q = query(
    collection(db, 'categories'),
    and(
      where('rootCategory', '==', rootCategory),
      where('subCategory', '==', subCategory)
    )
  );

  // Return the unsubscribe function
  return onSnapshot(q, (snapshot) => {
    const categories = [];
    snapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    callback(categories);
  }, (error) => {
    console.error('Error in real-time listener:', error);
  });
};

// Get all custom categories for a root category and sub-category
export const getCustomCategories = async (rootCategory, subCategory) => {
  try {
    const q = query(
      collection(db, 'categories'),
      and(
        where('rootCategory', '==', rootCategory),
        where('subCategory', '==', subCategory)
      )
    );
    const querySnapshot = await getDocs(q);
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

// Add or update custom category
export const addCustomCategory = async (rootCategory, subCategory, { name, image }) => {
  try {
    // Create a unique filename using timestamp
    const timestamp = Date.now();
    const filename = `${timestamp}_${image.name}`;
    const imagePath = `categories/${rootCategory}/${subCategory}/${name}/${filename}`;
    
    // Upload image and get URL
    const imageUrl = await uploadImage(image, imagePath);

    // Add category to Firestore
    const docRef = await addDoc(collection(db, 'categories'), {
      name,
      rootCategory,
      subCategory,
      featuredImage: imageUrl,
      imagePath,
      variations: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return {
      id: docRef.id,
      name,
      rootCategory,
      subCategory,
      featuredImage: imageUrl,
      imagePath,
      variations: []
    };
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// Add variation to custom category
export const addVariation = async (categoryId, rootCategory, subCategory, { name, image }) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    const categoryDoc = await getDoc(categoryRef);

    if (!categoryDoc.exists()) {
      throw new Error('Category not found');
    }

    // Create a unique filename using timestamp
    const timestamp = Date.now();
    const filename = `${timestamp}_${image.name}`;
    const imagePath = `categories/${rootCategory}/${subCategory}/${categoryId}/variations/${name}/${filename}`;
    
    // Upload image and get URL
    const imageUrl = await uploadImage(image, imagePath);

    const newVariation = {
      id: `variation_${timestamp}`, // Create a unique ID
      name,
      image: imageUrl,
      imagePath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await updateDoc(categoryRef, {
      variations: [...(categoryDoc.data().variations || []), newVariation],
      updatedAt: serverTimestamp()
    });

    return newVariation;
  } catch (error) {
    console.error('Error adding variation:', error);
    throw error;
  }
};

// Delete variation from custom category
export const deleteVariation = async (categoryId, variation) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    const categoryDoc = await getDoc(categoryRef);

    if (!categoryDoc.exists()) {
      throw new Error('Category not found');
    }

    // Delete variation image if it exists
    if (variation.imagePath) {
      await deleteImage(variation.imagePath);
    }

    // Remove variation from the array
    const variations = categoryDoc.data().variations.filter(v => v.id !== variation.id);

    await updateDoc(categoryRef, {
      variations,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error deleting variation:', error);
    throw error;
  }
};

// Delete custom category and all its variations
export const deleteCustomCategory = async (categoryId) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    const categoryDoc = await getDoc(categoryRef);
    
    if (!categoryDoc.exists()) {
      throw new Error('Category not found');
    }

    // Delete all variation images
    const variations = categoryDoc.data().variations || [];
    for (const variation of variations) {
      if (variation.imagePath) {
        await deleteImage(variation.imagePath);
      }
    }

    // Delete category image
    if (categoryDoc.data().imagePath) {
      await deleteImage(categoryDoc.data().imagePath);
    }

    // Delete the document
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const updateCustomCategory = async (categoryId, rootCategory, subCategory, { name, image }) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    const categoryDoc = await getDoc(categoryRef);

    if (!categoryDoc.exists()) {
      throw new Error('Category not found');
    }

    const updateData = {
      name,
      rootCategory,
      subCategory,
      updatedAt: serverTimestamp()
    };

    // Check if image is a File object (new image) or a string (existing URL)
    if (image instanceof File) {
      // Create a unique filename using timestamp
      const timestamp = Date.now();
      const filename = `${timestamp}_${image.name}`;
      const imagePath = `categories/${rootCategory}/${subCategory}/${name}/${filename}`;
      
      // Delete old image if it exists
      if (categoryDoc.data().imagePath) {
        await deleteImage(categoryDoc.data().imagePath);
      }

      // Upload new image and get URL
      const imageUrl = await uploadImage(image, imagePath);
      updateData.featuredImage = imageUrl;
      updateData.imagePath = imagePath;
    }

    await updateDoc(categoryRef, updateData);

    return {
      id: categoryId,
      ...updateData,
      featuredImage: updateData.featuredImage || categoryDoc.data().featuredImage,
      imagePath: updateData.imagePath || categoryDoc.data().imagePath
    };
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const updateVariation = async (categoryId, variationId, rootCategory, subCategory, { name, image }) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    const categoryDoc = await getDoc(categoryRef);

    if (!categoryDoc.exists()) {
      throw new Error('Category not found');
    }

    const variations = categoryDoc.data().variations || [];
    const variationIndex = variations.findIndex(v => v.id === variationId);

    if (variationIndex === -1) {
      throw new Error('Variation not found');
    }

    const oldVariation = variations[variationIndex];
    const updateData = {
      id: variationId,
      name,
      updatedAt: new Date().toISOString(),
      createdAt: oldVariation.createdAt // Preserve creation date
    };

    // Check if image is a File object (new image) or a string (existing URL)
    if (image instanceof File) {
      // Create a unique filename using timestamp
      const timestamp = Date.now();
      const filename = `${timestamp}_${image.name}`;
      const imagePath = `categories/${rootCategory}/${subCategory}/${categoryId}/variations/${name}/${filename}`;
      
      // Delete old image if it exists
      if (oldVariation.imagePath) {
        await deleteImage(oldVariation.imagePath);
      }

      // Upload new image and get URL
      const imageUrl = await uploadImage(image, imagePath);
      updateData.image = imageUrl;
      updateData.imagePath = imagePath;
    } else {
      // Keep existing image and path
      updateData.image = oldVariation.image;
      updateData.imagePath = oldVariation.imagePath;
    }

    variations[variationIndex] = updateData;

    await updateDoc(categoryRef, {
      variations,
      updatedAt: serverTimestamp()
    });

    return updateData;
  } catch (error) {
    console.error('Error updating variation:', error);
    throw error;
  }
}; 