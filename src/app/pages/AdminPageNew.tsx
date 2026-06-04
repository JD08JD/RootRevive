import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Edit, Trash2, Plus, Search, LogOut, Settings, Package, Layout, Save, Zap, Heart, Loader2 } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useCategories, Category } from "../context/CategoryContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import ProductFormModal from "../components/ProductFormModal";
import CategoryFormModal from "../components/CategoryFormModal";
import Toast from "../components/Toast";
import LoadingSpinner from "../components/LoadingSpinner";
import { Product } from "../data/products";

import { useSite } from "../context/SiteContext";

export default function AdminPageNew() {
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "quick-names" | "site-editor">("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newQuickName, setNewQuickName] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { getPageContent, updatePageContent } = useSite();
  const [siteContent, setSiteContent] = useState<any>(null);
  const [isSavingSite, setIsSavingSite] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [productModalMode, setProductModalMode] = useState<"add" | "edit">("add");
  const [categoryModalMode, setCategoryModalMode] = useState<"add" | "edit">("add");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info"; isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false
  });

  const { products, addProduct, updateProduct, deleteProduct, customAutocompleteNames, addCustomAutocompleteName, deleteCustomAutocompleteName } = useProducts();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { logout, user, profile, refreshProfile, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "site-editor" && !siteContent) {
      const content = getPageContent("about");
      if (content) {
        setSiteContent(JSON.parse(JSON.stringify(content)));
      } else {
        // Use the default from AboutPage as a starting point
        setSiteContent({
          hero: { title: "Our Story", tagline: "Bringing the goodness of nature to your table through sustainable dehydration" },
          story: { heading: "From Farm to Table", image: "", paragraphs: ["", "", ""] },
          process: { heading: "Our Dehydration Process", tagline: "", image: "", steps: [
            { step: "01", title: "Harvest", description: "" },
            { step: "02", title: "Prepare", description: "" },
            { step: "03", title: "Dehydrate", description: "" },
            { step: "04", title: "Package", description: "" }
          ]},
          values: [
            { icon: "Leaf", title: "Sustainable Sourcing", description: "" },
            { icon: "Sun", title: "Natural Process", description: "" },
            { icon: "Droplet", title: "Quality First", description: "" },
            { icon: "Heart", title: "Healthy Living", description: "" }
          ]
        });
      }
    }
  }, [activeTab, getPageContent, siteContent]);
  console.log(`[ADMIN] AdminPageNew - user:`, user);
  console.log(`[ADMIN] AdminPageNew - profile:`, profile);
  console.log(`[ADMIN] AdminPageNew - products count:`, products.length);

  // Use useEffect for navigation to avoid render-time side effects
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("[ADMIN] Not authenticated, redirecting to login...");
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading && !user) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // TEMPORARY: Remove admin check for testing
  // if (!profile?.is_admin) {
  //   console.error("User is not admin - profile:", profile);
  //   return (
  //     <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
  //         <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
  //         <button
  //           onClick={() => navigate("/")}
  //           className="bg-[#4CAF50] text-white px-6 py-3 rounded-xl font-semibold"
  //         >
  //           Go to Home
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  const showToast = (message: string, type: "success" | "error" | "warning" | "info" = "success") => {
    setToast({ message, type, isVisible: true });
  };

  const filteredProducts = products.filter(product =>
    (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductModalMode("edit");
    setIsProductModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryModalMode("edit");
    setIsCategoryModalOpen(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      const success = await deleteProduct(product.id);
      if (success) {
        showToast(`"${product.name}" has been deleted successfully`, "success");
      } else {
        showToast(`Unable to delete "${product.name}".`, "error");
      }
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    const productsInCategory = products.filter(p => p.category === category.slug);
    if (productsInCategory.length > 0) {
      alert(`Cannot delete category "${category.name}" because it contains ${productsInCategory.length} products. Move or delete those products first.`);
      return;
    }
    
    if (confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      const success = await deleteCategory(category.id);
      if (success) {
        showToast(`Category "${category.name}" has been deleted`, "success");
      } else {
        showToast(`Unable to delete category "${category.name}".`, "error");
      }
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductModalMode("add");
    setIsProductModalOpen(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryModalMode("add");
    setIsCategoryModalOpen(true);
  };

  const handleProductSubmit = async (productData: Omit<Product, "id">) => {
    if (productModalMode === "add") {
      const success = await addProduct(productData);
      if (success) {
        showToast(`"${productData.name}" has been added successfully`, "success");
      } else {
        showToast(`Unable to add "${productData.name}".`, "error");
      }
    } else if (editingProduct) {
      const success = await updateProduct(editingProduct.id, productData);
      if (success) {
        showToast(`"${productData.name}" has been updated successfully`, "success");
      } else {
        showToast(`Unable to update "${productData.name}".`, "error");
      }
    }
  };

  const handleCategorySubmit = async (categoryData: Omit<Category, "id">) => {
    if (categoryModalMode === "add") {
      const success = await addCategory(categoryData);
      if (success) {
        showToast(`Category "${categoryData.name}" has been added`, "success");
      } else {
        showToast(`Unable to add category "${categoryData.name}".`, "error");
      }
    } else if (editingCategory) {
      const success = await updateCategory(editingCategory.id, categoryData);
      if (success) {
        showToast(`Category "${categoryData.name}" has been updated`, "success");
      } else {
        showToast(`Unable to update category "${categoryData.name}".`, "error");
      }
    }
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      try {
        setIsLoggingOut(true);
        await logout();
        // Redirect is handled by the useEffect watching isAuthenticated
      } catch (err) {
        console.error("Logout error:", err);
        showToast("Error during logout. Please try again.", "error");
        setIsLoggingOut(false);
      }
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
              <div className="mt-2 text-sm text-gray-500">
                <p>User: {user?.email}</p>
                <p>Admin: {profile ? (profile.is_admin ? 'Yes' : 'No') : 'Loading...'}</p>
                <p>Products: {products.length}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <motion.button
                onClick={async () => {
                  console.log(`[ADMIN] Refreshing profile...`);
                  await refreshProfile();
                }}
                className="bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Refresh Profile"
              >
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Profile
              </motion.button>

              <motion.button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!isLoggingOut ? { scale: 1.05 } : {}}
                whileTap={!isLoggingOut ? { scale: 0.95 } : {}}
              >
                {isLoggingOut ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="size-5" />
                    Logout
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex p-1 bg-white rounded-xl shadow-sm border border-gray-100 w-fit">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === "products" ? "bg-[#4CAF50] text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Package className="size-4" />
              Products
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === "categories" ? "bg-[#4CAF50] text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Settings className="size-4" />
              Categories
            </button>
            <button
              onClick={() => setActiveTab("quick-names")}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === "quick-names" ? "bg-[#4CAF50] text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Search className="size-4" />
              Quick Names
            </button>
            <button
              onClick={() => setActiveTab("site-editor")}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === "site-editor" ? "bg-[#4CAF50] text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Layout className="size-4" />
              Site Editor
            </button>
          </div>

          {activeTab !== "site-editor" && (
            <>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                />
              </div>

              {activeTab !== "quick-names" && (
                <motion.button
                  onClick={activeTab === "products" ? handleAddProduct : handleAddCategory}
                  className="bg-[#4CAF50] text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#4CAF50]/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="size-5" />
                  Add {activeTab === "products" ? "Product" : "Category"}
                </motion.button>
              )}
            </>
          )}
        </div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Total Products</div>
            <div className="text-3xl font-bold text-gray-900">{products.length}</div>
          </div>
          {categories.slice(0, 3).map((category, idx) => (
            <div key={category.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-sm text-gray-600 mb-1">{category.name}</div>
              <div className="text-3xl font-bold" style={{ color: category.color }}>
                {products.filter(p => p.category === category.slug).length}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Content Table */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {activeTab === "products" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* ... (products table header) ... */}
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
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
                          <img src={product.image} alt={product.name} className="size-12 rounded-lg object-cover" />
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {product.featured ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Featured</span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Standard</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEditProduct(product)} className="p-2 text-gray-600 hover:text-[#4CAF50] hover:bg-green-50 rounded-lg transition-colors">
                            <Edit className="size-4" />
                          </button>
                          <button onClick={() => handleDeleteProduct(product)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && <div className="p-12 text-center text-gray-500">No products found</div>}
            </div>
          ) : activeTab === "site-editor" ? (
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">About Page Editor</h3>
                  <button
                    onClick={async () => {
                      setIsSavingSite(true);
                      const result = await updatePageContent("about", siteContent);
                      setIsSavingSite(false);
                      if (result.success) {
                        showToast("About page updated successfully");
                      } else {
                        showToast(`Failed: ${result.error}`, "error");
                        console.error("Save failed:", result.error);
                      }
                    }}
                    disabled={isSavingSite}
                    className="bg-[#4CAF50] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#4CAF50]/30 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSavingSite ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
                    Save Changes
                  </button>
                </div>

                {!siteContent ? (
                  <div className="flex justify-center p-20"><Loader2 className="size-10 animate-spin text-gray-300" /></div>
                ) : (
                  <div className="space-y-12 pb-20">
                    {/* Hero Section */}
                    <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <h4 className="text-lg font-bold mb-4 flex items-center gap-2"><Layout className="size-5 text-[#4CAF50]" /> Hero Section</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2 border rounded-lg" 
                            value={siteContent.hero.title}
                            onChange={(e) => setSiteContent({...siteContent, hero: {...siteContent.hero, title: e.target.value}})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                          <textarea 
                            className="w-full px-4 py-2 border rounded-lg" 
                            value={siteContent.hero.tagline}
                            onChange={(e) => setSiteContent({...siteContent, hero: {...siteContent.hero, tagline: e.target.value}})}
                          />
                        </div>
                      </div>
                    </section>

                    {/* Story Section */}
                    <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <h4 className="text-lg font-bold mb-4 flex items-center gap-2"><Heart className="size-5 text-[#4CAF50]" /> Our Story</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2 border rounded-lg" 
                            value={siteContent.story.heading}
                            onChange={(e) => setSiteContent({...siteContent, story: {...siteContent.story, heading: e.target.value}})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2 border rounded-lg" 
                            value={siteContent.story.image}
                            onChange={(e) => setSiteContent({...siteContent, story: {...siteContent.story, image: e.target.value}})}
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">Paragraphs</label>
                          {siteContent.story.paragraphs.map((p: string, i: number) => (
                            <textarea 
                              key={i}
                              className="w-full px-4 py-2 border rounded-lg text-sm" 
                              rows={3}
                              value={p}
                              onChange={(e) => {
                                const newParas = [...siteContent.story.paragraphs];
                                newParas[i] = e.target.value;
                                setSiteContent({...siteContent, story: {...siteContent.story, paragraphs: newParas}});
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* Process Steps */}
                    <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <h4 className="text-lg font-bold mb-4 flex items-center gap-2"><Zap className="size-5 text-[#4CAF50]" /> Process Steps</h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        {siteContent.process.steps.map((step: any, i: number) => (
                          <div key={i} className="p-4 border rounded-xl bg-gray-50">
                            <div className="font-bold text-xs text-gray-400 mb-2 uppercase">Step {step.step}</div>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 border rounded-lg mb-2 text-sm font-bold" 
                              placeholder="Title"
                              value={step.title}
                              onChange={(e) => {
                                const newSteps = [...siteContent.process.steps];
                                newSteps[i] = {...step, title: e.target.value};
                                setSiteContent({...siteContent, process: {...siteContent.process, steps: newSteps}});
                              }}
                            />
                            <textarea 
                              className="w-full px-3 py-2 border rounded-lg text-sm" 
                              placeholder="Description"
                              rows={2}
                              value={step.description}
                              onChange={(e) => {
                                const newSteps = [...siteContent.process.steps];
                                newSteps[i] = {...step, description: e.target.value};
                                setSiteContent({...siteContent, process: {...siteContent.process, steps: newSteps}});
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Values Section */}
                    <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <h4 className="text-lg font-bold mb-4 flex items-center gap-2"><Heart className="size-5 text-[#4CAF50]" /> Our Values</h4>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {siteContent.values.map((val: any, i: number) => (
                          <div key={i} className="p-4 border rounded-xl bg-gray-50">
                            <div className="flex items-center gap-2 mb-2">
                              <select 
                                className="text-xs border rounded p-1"
                                value={val.icon}
                                onChange={(e) => {
                                  const newVals = [...siteContent.values];
                                  newVals[i] = {...val, icon: e.target.value};
                                  setSiteContent({...siteContent, values: newVals});
                                }}
                              >
                                <option value="Leaf">Leaf</option>
                                <option value="Sun">Sun</option>
                                <option value="Droplet">Droplet</option>
                                <option value="Heart">Heart</option>
                              </select>
                            </div>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 border rounded-lg mb-2 text-sm font-bold" 
                              value={val.title}
                              onChange={(e) => {
                                const newVals = [...siteContent.values];
                                newVals[i] = {...val, title: e.target.value};
                                setSiteContent({...siteContent, values: newVals});
                              }}
                            />
                            <textarea 
                              className="w-full px-3 py-2 border rounded-lg text-sm" 
                              rows={3}
                              value={val.description}
                              onChange={(e) => {
                                const newVals = [...siteContent.values];
                                newVals[i] = {...val, description: e.target.value};
                                setSiteContent({...siteContent, values: newVals});
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Custom Autocomplete Names</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Add names that will appear in the "Interested Product Name" dropdown on the Contact Page, even if they aren't in your main product catalog.
                </p>
                
                <div className="flex gap-3 mb-8">
                  <input
                    type="text"
                    value={newQuickName}
                    onChange={(e) => setNewQuickName(e.target.value)}
                    placeholder="Enter product name..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none"
                  />
                  <button
                    onClick={async () => {
                      console.log(`[ADMIN] Add Quick Name clicked: "${newQuickName}"`);
                      if (newQuickName.trim()) {
                        const success = await addCustomAutocompleteName(newQuickName.trim());
                        console.log(`[ADMIN] Add Quick Name result:`, success);
                        if (success) {
                          setNewQuickName("");
                          showToast("Name added to autocomplete");
                        } else {
                          showToast("Failed to add name. Check if table exists or if you are admin.", "error");
                        }
                      }
                    }}
                    className="bg-[#4CAF50] text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-[#4CAF50]/30"
                  >
                    Add Name
                  </button>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Current Custom Names</h4>
                  <div className="space-y-2">
                    {customAutocompleteNames.filter(name => name.toLowerCase().includes(searchTerm.toLowerCase())).map((name) => (
                      <div key={name} className="bg-white px-4 py-3 rounded-xl flex items-center justify-between border border-gray-100 shadow-sm">
                        <span className="font-medium text-gray-800">{name}</span>
                        <button
                          onClick={async () => {
                            if (confirm(`Remove "${name}" from autocomplete?`)) {
                              await deleteCustomAutocompleteName(name);
                              showToast("Name removed");
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                    {customAutocompleteNames.length === 0 && (
                      <div className="text-center py-8 text-gray-500 italic">No custom names added yet</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={handleProductSubmit}
        product={editingProduct}
        mode={productModalMode}
      />

      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleCategorySubmit}
        category={editingCategory}
        mode={categoryModalMode}
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