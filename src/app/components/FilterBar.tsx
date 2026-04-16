import { motion } from "motion/react";
import { Apple, Carrot, Leaf } from "lucide-react";

interface FilterBarProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function FilterBar({ activeCategory, onCategoryChange }: FilterBarProps) {
  const categories = [
    { id: null, name: "All Products", icon: Leaf },
    { id: "fruits", name: "Fruits", icon: Apple },
    { id: "vegetables", name: "Vegetables", icon: Carrot },
    { id: "herbs", name: "Herbs", icon: Leaf },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          const Icon = category.icon;

          return (
            <motion.button
              key={category.id || "all"}
              onClick={() => onCategoryChange(category.id)}
              className={`relative px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-[#4CAF50] text-white shadow-lg shadow-[#4CAF50]/30"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon className="size-5" />
                <span>{category.name}</span>
              </div>
              {isActive && (
                <motion.div
                  layoutId="category-indicator"
                  className="absolute inset-0 bg-[#4CAF50] rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
