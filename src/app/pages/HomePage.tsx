import { motion } from "motion/react";
import { Link } from "react-router";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductContext";
import { Leaf, Truck, Award, Heart } from "lucide-react";

export default function HomePage() {
  const { products } = useProducts();
  const featuredProducts = products.filter(p => p.featured);

  const features = [
    {
      icon: Leaf,
      title: "100% Natural",
      description: "No artificial additives or preservatives"
    },
    {
      icon: Truck,
      title: "Fresh from Farm",
      description: "Directly sourced from sustainable farms"
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Carefully selected and processed"
    },
    {
      icon: Heart,
      title: "Nutrient Rich",
      description: "Retains maximum nutritional value"
    }
  ];

  return (
    <div>
      <Hero />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-[#E8F5E9] rounded-2xl mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="size-8 text-[#4CAF50]" />
                </motion.div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Our most popular dehydrated delights
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
          >
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/products">
              <motion.button
                className="bg-[#4CAF50] text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-[#4CAF50]/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Products
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl font-bold text-gray-900 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Shop by Category
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Dried Fruits",
                category: "fruits",
                image: "https://images.unsplash.com/photo-1776188590471-db74f543cf52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGZydWl0cyUyMGFzc29ydG1lbnQlMjBuYXR1cmFsfGVufDF8fHx8MTc3NjI0NTE1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                color: "#FFA726"
              },
              {
                name: "Dehydrated Vegetables",
                category: "vegetables",
                image: "https://images.unsplash.com/photo-1646827153974-acb5bc2393b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWh5ZHJhdGVkJTIwdmVnZXRhYmxlcyUyMGhlYWx0aHl8ZW58MXx8fHwxNzc2MjQ1MTUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                color: "#4CAF50"
              },
              {
                name: "Herbal Products",
                category: "herbs",
                image: "https://images.unsplash.com/photo-1757802412806-433e4e60eec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjB0ZWElMjBvcmdhbmljJTIwbGVhdmVzfGVufDF8fHx8MTc3NjI0NTE1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                color: "#8BC34A"
              }
            ].map((category, index) => (
              <Link key={category.category} to={`/products?category=${category.category}`}>
                <motion.div
                  className="relative rounded-2xl overflow-hidden group cursor-pointer h-80"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                    <motion.div
                      className="text-white flex items-center gap-2"
                      whileHover={{ gap: 12 }}
                    >
                      <span>Explore</span>
                      <span>→</span>
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}