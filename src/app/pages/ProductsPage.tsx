import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useSearchParams } from "react-router";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import { useProducts } from "../context/ProductContext";

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam);
  const { products } = useProducts();

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  const filteredProducts = activeCategory
    ? products.filter(p => p.category === activeCategory)
    : products;

  return (
    <div className="min-h-screen bg-[#F9F7F2] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Our Products
          </h1>
          <p className="text-xl text-gray-600">
            Discover our range of naturally preserved goodness
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <FilterBar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </motion.div>

        {/* Results Count */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredProducts.length}</span> products
            {activeCategory && (
              <span> in <span className="font-semibold capitalize">{activeCategory}</span></span>
            )}
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xl text-gray-500">No products found in this category.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}