import { motion } from "motion/react";
import { Leaf, Sun, Droplet, Heart, Loader2 } from "lucide-react";
import { useSite } from "../context/SiteContext";

const DEFAULT_ABOUT_CONTENT = {
  hero: {
    title: "Our Story",
    tagline: "Bringing the goodness of nature to your table through sustainable dehydration"
  },
  story: {
    heading: "From Farm to Table",
    image: "https://images.unsplash.com/photo-1756638425683-7143c8a39187?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwZmllbGQlMjBuYXR1cmFsJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc3NjI0NTE1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    paragraphs: [
      "Founded in 2020, RootRevive was born from a simple belief: nature provides the best nutrition, and it deserves to be preserved in its purest form.",
      "We work closely with organic farmers who share our commitment to sustainability and quality. Every fruit, vegetable, and herb is hand-selected at peak ripeness to ensure maximum flavor and nutritional value.",
      "Our state-of-the-art dehydration facility uses gentle, low-temperature methods that preserve up to 95% of the original nutrients. The result? Delicious, shelf-stable products that retain the essence of fresh produce."
    ]
  },
  process: {
    heading: "Our Dehydration Process",
    tagline: "A careful, sustainable approach that locks in nature's goodness",
    image: "https://images.unsplash.com/photo-1737943052317-4a89d1dcf1f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmFybWluZyUyMHN1c3RhaW5hYmxlfGVufDF8fHx8MTc3NjIxNDI4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    steps: [
      { step: "01", title: "Harvest", description: "We select only the finest produce at peak ripeness from certified organic farms." },
      { step: "02", title: "Prepare", description: "Each item is carefully washed, inspected, and prepared for the dehydration process." },
      { step: "03", title: "Dehydrate", description: "Low-temperature air circulation gently removes moisture while preserving nutrients and flavor." },
      { step: "04", title: "Package", description: "Products are packaged in eco-friendly materials to maintain freshness and quality." }
    ]
  },
  values: [
    { icon: "Leaf", title: "Sustainable Sourcing", description: "We partner with local organic farms that practice sustainable agriculture, ensuring the health of our planet for future generations." },
    { icon: "Sun", title: "Natural Process", description: "Our low-temperature dehydration method preserves nutrients, flavor, and color without any artificial additives or chemicals." },
    { icon: "Droplet", title: "Quality First", description: "Every product undergoes rigorous quality checks to ensure you receive only the finest dehydrated fruits, vegetables, and herbs." },
    { icon: "Heart", title: "Healthy Living", description: "We believe in making healthy eating convenient and accessible, helping you maintain a nutritious lifestyle with ease." }
  ]
};

const iconMap: Record<string, any> = { Leaf, Sun, Droplet, Heart };

export default function AboutPage() {
  const { getPageContent, loading } = useSite();
  const content = getPageContent("about") || DEFAULT_ABOUT_CONTENT;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
        <Loader2 className="size-12 text-[#4CAF50] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#F9F7F2]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-[#F9F7F2] to-[#E8F5E9] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {content.hero.title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {content.hero.tagline}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={content.story.image}
                alt="Story Image"
                className="rounded-3xl shadow-2xl w-full h-auto"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {content.story.heading}
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                {content.story.paragraphs.map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {content.process.heading}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {content.process.tagline}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <motion.div
              className="order-2 md:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                {content.process.steps.map((item: any, index: number) => (
                  <motion.div
                    key={item.step}
                    className="flex gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#4CAF50] text-white rounded-full flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="order-1 md:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src={content.process.image}
                alt="Process Image"
                className="rounded-3xl shadow-2xl w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              What drives us every day
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.values.map((value: any, index: number) => {
              const Icon = iconMap[value.icon] || Heart;
              return (
                <motion.div
                  key={value.title}
                  className="bg-[#F9F7F2] rounded-2xl p-6 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-sm"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="size-8 text-[#4CAF50]" />
                  </motion.div>
                  <h3 className="font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
