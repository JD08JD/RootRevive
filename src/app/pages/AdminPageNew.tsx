import { useState } from "react";
import { motion } from "motion/react";
import { Edit, Trash2, Plus, Search, LogOut } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import ProductFormModal from "../components/ProductFormModal";
import Toast from "../components/Toast";
import { Product } from "../data/products";

export default function AdminPageNew() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info"; isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false
  });

  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const showToast = (message: string, type: "success" | "error" | "warning" | "info" = "success") => {
    setToast({ message, type, isVisible: true });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteProduct(product.id);
      showToast(`"${product.name}" has been deleted successfully`, "success");
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleSubmit = (productData: Omit<Product, "id">) => {
    if (modalMode === "add") {
      addProduct(productData);
      showToast(`"${productData.name}" has been added successfully`, "success");
    } else if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      showToast(`"${productData.name}" has been updated successfully`, "success");
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="bg-[#F9F7F2] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Product Management
              </h1>
              <p className="text-gray-600">
                Manage your product catalog
              </p>
            </div>
            
            <div className="flex gap-3">
              <motion.button
                onClick={handleAdd}
                className="bg-[#4CAF50] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-[#4CAF50]/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="size-5" />
                Add Product
              </motion.button>

              <motion.button
                onClick={handleLogout}
                className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="size-5" />
                Logout
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Total Products</div>
            <div className="text-3xl font-bold text-gray-900">{products.length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Fruits</div>
            <div className="text-3xl font-bold text-[#FFA726]">
              {products.filter(p => p.category === 'fruits').length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Vegetables</div>
            <div className="text-3xl font-bold text-[#4CAF50]">
              {products.filter(p => p.category === 'vegetables').length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Herbs</div>
            <div className="text-3xl font-bold text-[#8BC34A]">
              {products.filter(p => p.category === 'herbs').length}
            </div>
          </div>
        </motion.div>

        {/* Products Table */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="size-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        product.category === 'fruits' ? 'bg-orange-100 text-orange-800' :
                        product.category === 'vegetables' ? 'bg-green-100 text-green-800' :
                        'bg-lime-100 text-lime-800'
                      }`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      {product.featured ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-gray-600 hover:text-[#4CAF50] hover:bg-green-50 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Edit product"
                        >
                          <Edit className="size-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(product)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete product"
                        >
                          <Trash2 className="size-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No products found</p>
              <p className="text-sm">
                {searchTerm ? "Try adjusting your search" : "Click 'Add Product' to get started"}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        product={editingProduct}
        mode={modalMode}
      />

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}