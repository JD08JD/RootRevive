import { Link } from "react-router";
import { motion } from "motion/react";
import { Leaf, ArrowRight } from "lucide-react";
import { Product } from "../data/products";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`}>
      <motion.div
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group h-full"
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Image */}
        <div className="relative overflow-hidden aspect-square">
          <motion.div
            className="w-full h-full"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white backdrop-blur-sm ${
              product.category === 'fruits' ? 'bg-[#FFA726]/90' :
              product.category === 'vegetables' ? 'bg-[#4CAF50]/90' :
              'bg-[#8BC34A]/90'
            }`}>
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </span>
          </div>

          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-4 left-4">
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                <Leaf className="size-3 text-[#4CAF50]" />
                <span className="text-xs font-medium text-gray-900">Featured</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#4CAF50] transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-1 text-sm font-medium text-[#4CAF50]"
              whileHover={{ gap: 8 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              View Details
              <ArrowRight className="size-4" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
