import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    interestedProductName: "",
    interestedProducts: [] as string[],
    quantityRequired: "",
    orderUnit: "",
    suggestion: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          interestedProducts: formData.interestedProducts.join(", "),
          timestamp: new Date().toLocaleString()
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
        toast.success("Message sent successfully!");
        setFormData({ 
          name: "", 
          email: "", 
          contactNumber: "",
          interestedProductName: "",
          interestedProducts: [],
          quantityRequired: "",
          orderUnit: "",
          suggestion: "",
          message: "" 
        });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const errorMessage = result.rawResponse 
          ? `Server Error: ${result.rawResponse}...` 
          : (result.error || "Failed to send message");
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = (product: string) => {
    setFormData(prev => ({
      ...prev,
      interestedProducts: prev.interestedProducts.includes(product)
        ? prev.interestedProducts.filter(p => p !== product)
        : [...prev.interestedProducts, product]
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+91 9328539766",
      link: "tel:+91 9328539766"
    },
    {
      icon: Mail,
      title: "Email",
      details: "info@rootrevive.co.in",
      link: "mailto:info@rootrevive.co.in"
    },
    {
      icon: MapPin,
      title: "Address",
      details: "1029,Nirmaalpark,Vadodara,Gujarat,India. 390010",
      link: null
    }
  ];

  return (
    <div className="bg-[#F9F7F2] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600">
            We'd love to hear from you. Send us a message!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Contact Information
              </h2>
              <p className="text-gray-600 mb-8">
                Have questions about our products or want to place a bulk order? We're here to help!
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <info.icon className="size-6 text-[#4CAF50]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-gray-600 hover:text-[#4CAF50] transition-colors"
                      >
                        {info.details}
                      </a>
                    ) : (
                      <p className="text-gray-600">{info.details}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Business Hours */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="font-semibold text-gray-900 mb-4">Business Hours</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Monday - Saturday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">10:00 AM - 2:00 PM</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    required
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label htmlFor="interestedProductName" className="block text-sm font-medium text-gray-700 mb-2">
                    Interested Product Name
                  </label>
                  <input
                    type="text"
                    id="interestedProductName"
                    value={formData.interestedProductName}
                    onChange={(e) => setFormData({ ...formData, interestedProductName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all"
                    placeholder="e.g., Turmeric Powder"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interested Products
                  </label>
                  <div className="space-y-2">
                    {["Powder", "Slice", "Flakes"].map((product) => (
                      <label key={product} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.interestedProducts.includes(product)}
                          onChange={() => handleCheckboxChange(product)}
                          className="mr-2"
                        />
                        {product}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="quantityRequired" className="block text-sm font-medium text-gray-700 mb-2">
                    How Many Products Required?
                  </label>
                  <input
                    type="number"
                    id="quantityRequired"
                    min="1"
                    value={formData.quantityRequired}
                    onChange={(e) => setFormData({ ...formData, quantityRequired: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all"
                    placeholder="Enter quantity"
                  />
                </div>

                <div>
                  <label htmlFor="orderUnit" className="block text-sm font-medium text-gray-700 mb-2">
                    Order Unit
                  </label>
                  <select
                    id="orderUnit"
                    value={formData.orderUnit}
                    onChange={(e) => setFormData({ ...formData, orderUnit: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all"
                  >
                    <option value="">Select Unit</option>
                    <option value="Gram">Gram</option>
                    <option value="Kg">Kg</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="suggestion" className="block text-sm font-medium text-gray-700 mb-2">
                    Suggestion or Customize Requirement
                  </label>
                  <textarea
                    id="suggestion"
                    rows={3}
                    value={formData.suggestion}
                    onChange={(e) => setFormData({ ...formData, suggestion: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all resize-none"
                    placeholder="Any specific requirements or suggestions..."
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-[#4CAF50] text-white py-4 rounded-xl font-semibold shadow-lg shadow-[#4CAF50]/30 flex items-center justify-center gap-2 disabled:opacity-70"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting || submitted}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Sending...
                    </>
                  ) : submitted ? (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                      >
                        ✓
                      </motion.div>
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="size-5" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </div>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm"
                >
                  Thank you for your message! We'll get back to you within 24 hours.
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
