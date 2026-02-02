/**
 * Cloudinary Upload Utility
 * Upload images directly to Cloudinary cloud storage
 * Returns Cloudinary URL instead of Base64
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload single image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<string>} Cloudinary image URL
 */
export const uploadImage = async (file, onProgress) => {
  if (!file) {
    throw new Error('No file provided');
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('Image size must be less than 10MB');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('cloud_name', CLOUD_NAME);
  
  // Optional: Add folder organization
  formData.append('folder', 'flower-shop');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }

    const data = await response.json();
    
    // Return optimized URL with auto format and quality
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {File[]} files - Array of image files
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<string[]>} Array of Cloudinary URLs
 */
export const uploadMultipleImages = async (files, onProgress) => {
  if (!files || files.length === 0) {
    throw new Error('No files provided');
  }

  const uploadPromises = Array.from(files).map((file, index) =>
    uploadImage(file, (progress) => {
      if (onProgress) {
        const totalProgress = ((index + progress / 100) / files.length) * 100;
        onProgress(Math.round(totalProgress));
      }
    })
  );

  try {
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary (requires signed API)
 * Note: For unsigned uploads, deletion requires backend API
 * @param {string} publicId - Image public ID
 */
export const deleteImage = async (publicId) => {
  // This requires backend implementation with API secret
  console.warn('Delete requires backend API with Cloudinary secret');
  // For now, just log - images will auto-cleanup based on Cloudinary settings
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} Public ID
 */
export const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) {
    return null;
  }
  
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex === -1) return null;
  
  // Get everything after 'upload/v12345678/'
  const pathParts = parts.slice(uploadIndex + 2).join('/');
  // Remove file extension
  return pathParts.replace(/\.[^.]+$/, '');
};

/**
 * Generate optimized Cloudinary URL
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - Transformation options
 * @returns {string} Optimized URL
 */
export const optimizeImage = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  const { width, height, quality = 'auto', format = 'auto' } = options;
  
  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`f_${format}`);
  transformations.push(`q_${quality}`);
  
  const transformation = transformations.join(',');
  
  // Insert transformation into URL
  return url.replace('/upload/', `/upload/${transformation}/`);
};

export default {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  getPublicIdFromUrl,
  optimizeImage,
};
