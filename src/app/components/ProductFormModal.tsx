import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, Upload } from "lucide-react";
import { Product } from "../data/products";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, "id">) => void;
  product?: Product | null;
  mode: "add" | "edit";
}

export default function ProductFormModal({ isOpen, onClose, onSubmit, product, mode }: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "fruits" as "fruits" | "vegetables" | "herbs",
    price: "",
    description: "",
    image: "",
    featured: false,
    benefits: ["", "", "", ""]
  });

  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        description: product.description,
        image: product.image,
        featured: product.featured || false,
        benefits: [...product.benefits, "", "", "", ""].slice(0, 4)
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: "",
        category: "fruits",
        price: "",
        description: "",
        image: "",
        featured: false,
        benefits: ["", "", "", ""]
      });
    }
  }, [product, mode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: Omit<Product, "id"> = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      description: formData.description,
      image: formData.image || "https://images.unsplash.com/photo-1776188590471-db74f543cf52?w=400",
      featured: formData.featured,
      benefits: formData.benefits.filter(b => b.trim() !== "")
    };

    onSubmit(productData);
    onClose();
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({ ...formData, benefits: newBenefits });
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

                  {/* Category and Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                      >
                        <option value="fruits">Fruits</option>
                        <option value="vegetables">Vegetables</option>
                        <option value="herbs">Herbs</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
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

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        type="button"
                        className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        <Upload className="size-5" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Leave empty for default image</p>
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
