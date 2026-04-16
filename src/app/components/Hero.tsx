import { motion } from "motion/react";
import { ArrowRight, Leaf, Star, Award } from "lucide-react";
import { Link } from "react-router";

export default function Hero() {
  const badges = [
    { icon: Leaf, text: "100% Natural" },
    { icon: Star, text: "No Preservatives" },
    { icon: Award, text: "Rich in Nutrients" },
  ];

  return (
    <div className="relative bg-gradient-to-br from-[#F9F7F2] via-white to-[#E8F5E9] overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 bg-[#4CAF50]/5 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#FFA726]/5 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6"
            >
              <Leaf className="size-4 text-[#4CAF50]" />
              <span className="text-sm font-medium text-gray-700">
                Sustainably Sourced & Naturally Preserved
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Naturally Preserved{" "}
              <span className="text-[#4CAF50]">Goodness</span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Premium dehydrated fruits, vegetables & herbs
            </motion.p>

            {/* Badges */}
            <motion.div
              className="flex flex-wrap gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.text}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm"
                  whileHover={{ scale: 1.05, y: -2 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <badge.icon className="size-5 text-[#4CAF50]" />
                  <span className="font-medium text-gray-700">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link to="/products">
                <motion.button
                  className="bg-[#4CAF50] text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 shadow-lg shadow-[#4CAF50]/30"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(76, 175, 80, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Products
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="size-5" />
                  </motion.div>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="https://images.unsplash.com/photo-1776188590471-db74f543cf52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGZydWl0cyUyMGFzc29ydG1lbnQlMjBuYXR1cmFsfGVufDF8fHx8MTc3NjI0NTE1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Dried fruits assortment"
                className="w-full h-auto"
              />
              
              {/* Floating Elements */}
              <motion.div
                className="absolute top-8 right-8 bg-white p-4 rounded-2xl shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Leaf className="size-8 text-[#4CAF50]" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
