import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Check, Leaf, Mail, Phone, ChevronDown } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useCategories } from "../context/CategoryContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import * as Accordion from "@radix-ui/react-accordion";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products } = useProducts();
  const { categories } = useCategories();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to="/products">
            <button className="bg-[#4CAF50] text-white px-6 py-3 rounded-full font-semibold">
              Back to Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryData = categories.find(c => c.slug === product.category);
  const categoryColor = categoryData?.color || '#4CAF50';

  return (
    <div className="min-h-screen bg-[#F9F7F2] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link to="/products">
            <motion.button
              className="flex items-center gap-2 text-gray-600 hover:text-[#4CAF50] transition-colors"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="size-5" />
              <span>Back to Products</span>
            </motion.button>
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            className="bg-white rounded-3xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="aspect-square relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Category Badge */}
              <div className="absolute top-6 right-6">
                <span 
                  className="px-4 py-2 rounded-full text-sm font-medium text-white backdrop-blur-sm shadow-lg"
                  style={{ backgroundColor: `${categoryColor}E6` }} // E6 adds 90% opacity
                >
                  {categoryData?.name || (product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'Uncategorized')}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            {/* <div className="flex items-baseline gap-4 mb-6">
              <span className="text-5xl font-bold text-[#4CAF50]">
                ${product.price}
              </span>
              <span className="text-gray-500">per package</span>
            </div> */}

            <p className="text-lg text-gray-700 mb-8">
              {product.description}
            </p>

            {/* Benefits */}
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Leaf className="size-5 text-[#4CAF50]" />
                Key Benefits
              </h3>
              <ul className="space-y-3">
                {product.benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="bg-[#E8F5E9] rounded-full p-1 mt-0.5">
                      <Check className="size-4 text-[#4CAF50]" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Accordion for Additional Info */}
            <Accordion.Root type="single" collapsible className="space-y-3 mb-8">
              <Accordion.Item value="storage" className="bg-white rounded-xl overflow-hidden shadow-sm">
                <Accordion.Trigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                  <span className="font-semibold text-gray-900">Storage Instructions</span>
                  <ChevronDown className="size-5 text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
                <Accordion.Content className="px-6 pb-4 text-gray-600">
                  Store in a cool, dry place away from direct sunlight. Once opened, keep in an airtight container for maximum freshness. Shelf life: 12 months from production date.
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item value="nutrition" className="bg-white rounded-xl overflow-hidden shadow-sm">
                <Accordion.Trigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                  <span className="font-semibold text-gray-900">Nutritional Information</span>
                  <ChevronDown className="size-5 text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
                <Accordion.Content className="px-6 pb-4 text-gray-600">
                  Our dehydration process preserves up to 95% of the original nutrients. Rich in vitamins, minerals, and dietary fiber. No added sugars, preservatives, or artificial colors.
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item value="sourcing" className="bg-white rounded-xl overflow-hidden shadow-sm">
                <Accordion.Trigger className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                  <span className="font-semibold text-gray-900">Sourcing & Process</span>
                  <ChevronDown className="size-5 text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
                <Accordion.Content className="px-6 pb-4 text-gray-600">
                  Sourced from sustainable, organic farms. Low-temperature dehydration process preserves nutrients and natural flavors. Quality checked at every stage of production.
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>

            {/* CTA */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/contact">
                <motion.button
                  className="w-full bg-[#4CAF50] text-white py-4 rounded-full font-semibold shadow-lg shadow-[#4CAF50]/30 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Mail className="size-5" />
                  Contact to Order
                </motion.button>
              </Link>
              
              <div className="flex items-center justify-center gap-6 text-sm mt-8 text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="size-4" />
                  <span>+919328539766</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4" />
                  <span>info@rootrevive.co.in</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}