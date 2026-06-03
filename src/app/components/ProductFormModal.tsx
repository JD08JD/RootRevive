import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, Upload } from "lucide-react";
import { Product } from "../data/products";
import { supabase } from "../lib/supabaseClient";
import { useCategories } from "../context/CategoryContext";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, "id">) => void;
  product?: Product | null;
  mode: "add" | "edit";
}

// Updated to force HMR refresh
export default function ProductFormModal({ isOpen, onClose, onSubmit, product, mode }: ProductFormModalProps) {
  const { categories } = useCategories();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    image: "",
    featured: false,
    benefits: ["", "", "", ""],
    storage_instructions: "",
    nutritional_info: "",
    sourcing_info: ""
  });
  const [uploading, setUploading] = useState(false);

  console.log(`[MODAL] ProductFormModal render - isOpen: ${isOpen}, mode: ${mode}, product:`, product);

  useEffect(() => {
    console.log(`[MODAL] useEffect triggered - mode: ${mode}, product:`, product);
    if (product && mode === "edit") {
      const newFormData = {
        name: product.name,
        category: product.category,
        description: product.description,
        image: product.image,
        featured: product.featured || false,
        benefits: [...product.benefits, "", "", "", ""].slice(0, 4),
        storage_instructions: product.storage_instructions || "",
        nutritional_info: product.nutritional_info || "",
        sourcing_info: product.sourcing_info || ""
      };
      console.log(`[MODAL] Setting edit form data:`, newFormData);
      setFormData(newFormData);
    } else {
      const resetFormData = {
        name: "",
        category: categories.length > 0 ? categories[0].slug : "",
        description: "",
        image: "",
        featured: false,
        benefits: ["", "", "", ""],
        storage_instructions: "",
        nutritional_info: "",
        sourcing_info: ""
      };
      console.log(`[MODAL] Resetting form for add mode:`, resetFormData);
      setFormData(resetFormData);
    }
  }, [product, mode, isOpen, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`[MODAL] handleSubmit: Form submitted at ${new Date().toISOString()}`);
    console.log(`[MODAL] handleSubmit: Current form data:`, formData);

    const productData: Omit<Product, "id"> = {
      name: formData.name,
      category: formData.category,
      price: 0.0, // Default price to 0.0
      description: formData.description,
      image: formData.image || "https://images.unsplash.com/photo-1776188590471-db74f543cf52?w=400",
      featured: !!formData.featured,
      benefits: formData.benefits.filter(b => b.trim() !== ""),
      storage_instructions: formData.storage_instructions,
      nutritional_info: formData.nutritional_info,
      sourcing_info: formData.sourcing_info
    };

    console.log(`[MODAL] handleSubmit: Processed product data featured value:`, productData.featured);
    console.log(`[MODAL] handleSubmit: Calling onSubmit...`);
    onSubmit(productData);
    console.log(`[MODAL] handleSubmit: Closing modal...`);
    onClose();
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({ ...formData, benefits: newBenefits });
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    console.log(`[MODAL] handleFileUpload: Starting for file: ${file.name} (${file.size} bytes)`);

    // Check session before starting
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.error("[MODAL] No active session found");
      alert("Your session has expired. Please log in again.");
      return;
    }

    setUploading(true);
    
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      console.log(`[MODAL] handleFileUpload: Prepared path: ${filePath}`);

      // Upload file to Supabase storage with timeout
      const uploadPromise = supabase.storage
        .from('product-images')
        .upload(filePath, file);

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Upload timeout after 30 seconds')), 30000);
      });

      console.log(`[MODAL] handleFileUpload: Calling supabase.storage.upload...`);
      const { data, error } = await Promise.race([uploadPromise, timeoutPromise]) as any;
      console.log(`[MODAL] handleFileUpload: Upload promise resolved`);

      if (error) {
        console.error(`[MODAL] Upload error:`, error);
        alert(`Error uploading image: ${error.message} (Code: ${error.statusCode || 'N/A'}). Ensure 'product-images' bucket exists and is Public.`);
        return;
      }

      console.log(`[MODAL] handleFileUpload: Success data:`, data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.log(`[MODAL] handleFileUpload: Public URL generated: ${publicUrl}`);

      // Update form data with the new image URL
      setFormData({ ...formData, image: publicUrl });
      console.log(`[MODAL] handleFileUpload: Form state updated with new image URL`);
      
    } catch (err) {
      console.error(`[MODAL] handleFileUpload: Exception:`, err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert(`Upload failed: ${message}`);
    } finally {
      console.log(`[MODAL] handleFileUpload: Cleaning up (setting uploading to false)`);
      setUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {mode === "add" ? "Add New Product" : "Edit Product"}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                      placeholder="e.g., Dried Mango Slices"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent resize-none"
                      placeholder="Describe your product..."
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Image
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                        placeholder="https://example.com/image.jpg or upload below"
                      />
                      <label className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer flex items-center">
                        <Upload className="size-5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(file);
                            }
                          }}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {uploading ? 'Uploading...' : 'Upload an image or paste a URL. Leave empty for default image.'}
                    </p>
                  </div>

                  {/* Benefits */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Benefits (at least 1 required)
                    </label>
                    <div className="space-y-2">
                      {formData.benefits.map((benefit, index) => (
                        <input
                          key={index}
                          type="text"
                          value={benefit}
                          onChange={(e) => handleBenefitChange(index, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                          placeholder={`Benefit ${index + 1}`}
                          required={index === 0}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 text-[#4CAF50] border-gray-300 rounded focus:ring-[#4CAF50]"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                      Mark as Featured Product
                    </label>
                  </div>

                  {/* Additional Info Sections */}
                  <div className="space-y-4 border-t border-gray-100 pt-6">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Additional Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Storage Instructions
                      </label>
                      <textarea
                        rows={2}
                        value={formData.storage_instructions}
                        onChange={(e) => setFormData({ ...formData, storage_instructions: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent resize-none"
                        placeholder="e.g. Store in a cool, dry place..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nutritional Information
                      </label>
                      <textarea
                        rows={2}
                        value={formData.nutritional_info}
                        onChange={(e) => setFormData({ ...formData, nutritional_info: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent resize-none"
                        placeholder="e.g. Rich in vitamins and minerals..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sourcing & Process
                      </label>
                      <textarea
                        rows={2}
                        value={formData.sourcing_info}
                        onChange={(e) => setFormData({ ...formData, sourcing_info: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent resize-none"
                        placeholder="e.g. Sourced from sustainable organic farms..."
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-[#4CAF50] text-white rounded-xl font-semibold shadow-lg shadow-[#4CAF50]/30 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Save className="size-5" />
                      {mode === "add" ? "Add Product" : "Save Changes"}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
