export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  benefits: string[];
  image: string;
  featured: boolean;
  storage_instructions?: string;
  nutritional_info?: string;
  sourcing_info?: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Dried Mango Slices",
    category: "fruits",
    price: 12.99,
    description: "Sweet and chewy naturally dried mango slices, perfect for snacking or adding to trail mix.",
    benefits: [
      "No added sugar or preservatives",
      "Rich in vitamins A and C",
      "Long shelf life up to 12 months",
      "Naturally sweet and delicious"
    ],
    image: "https://images.unsplash.com/photo-1770124129809-fe1fe6b7c23e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMG1hbmdvJTIwc2xpY2VzfGVufDF8fHx8MTc3NjI0NTE1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    featured: true
  },
  {
    id: "2",
    name: "Dried Strawberries",
    category: "fruits",
    price: 14.99,
    description: "Tangy and sweet freeze-dried strawberries that retain their vibrant color and nutrition.",
    benefits: [
      "100% natural with no additives",
      "High in antioxidants",
      "Lightweight and portable",
      "Great for smoothies and desserts"
    ],
    image: "https://images.unsplash.com/photo-1660338765002-58f397b8e4d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMHN0cmF3YmVycmllcyUyMGZydWl0fGVufDF8fHx8MTc3NjI0NTE1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    featured: true
  },
  {
    id: "3",
    name: "Apple Chips",
    category: "fruits",
    price: 9.99,
    description: "Crispy and lightly sweetened apple chips, a healthy alternative to traditional snacks.",
    benefits: [
      "Low calorie snack option",
      "Rich in dietary fiber",
      "No artificial flavors",
      "Crunchy and satisfying"
    ],
    image: "https://images.unsplash.com/photo-1598799170795-45f90ddfb662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGFwcGxlJTIwY2hpcHN8ZW58MXx8fHwxNzc2MjQ1MTUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "4",
    name: "Dried Banana Slices",
    category: "fruits",
    price: 10.99,
    description: "Naturally sweet banana chips, perfect for a quick energy boost.",
    benefits: [
      "High in potassium",
      "Natural energy source",
      "No preservatives added",
      "Kid-friendly snack"
    ],
    image: "https://images.unsplash.com/photo-1775377262379-9cd6a987514a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGJhbmFuYSUyMHNsaWNlc3xlbnwxfHx8fDE3NzYyNDUxNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "5",
    name: "Sun-Dried Tomatoes",
    category: "vegetables",
    price: 11.99,
    description: "Intensely flavored sun-dried tomatoes, perfect for pasta, salads, and Mediterranean dishes.",
    benefits: [
      "Concentrated flavor and nutrients",
      "Rich in lycopene",
      "Versatile cooking ingredient",
      "Long-lasting freshness"
    ],
    image: "https://images.unsplash.com/photo-1635843121635-78240cc7a509?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMHRvbWF0b2VzJTIwdmVnZXRhYmxlc3xlbnwxfHx8fDE3NzYyNDUxNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    featured: true
  },
  {
    id: "6",
    name: "Dried Mushroom Mix",
    category: "vegetables",
    price: 16.99,
    description: "Premium blend of dried mushrooms including shiitake, porcini, and oyster varieties.",
    benefits: [
      "Intense umami flavor",
      "High in protein and minerals",
      "Rehydrates easily",
      "Perfect for soups and risottos"
    ],
    image: "https://images.unsplash.com/photo-1770572271597-595e0041846b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMG11c2hyb29tcyUyMG9yZ2FuaWN8ZW58MXx8fHwxNzc2MjQ1MTU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "7",
    name: "Dehydrated Vegetable Mix",
    category: "vegetables",
    price: 13.99,
    description: "Colorful mix of dehydrated carrots, bell peppers, and zucchini for quick meal prep.",
    benefits: [
      "Time-saving convenience",
      "No waste, no spoilage",
      "Retains nutritional value",
      "Great for camping and travel"
    ],
    image: "https://images.unsplash.com/photo-1646827153974-acb5bc2393b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWh5ZHJhdGVkJTIwdmVnZXRhYmxlcyUyMGhlYWx0aHl8ZW58MXx8fHwxNzc2MjQ1MTUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "8",
    name: "Dried Basil",
    category: "herbs",
    price: 7.99,
    description: "Aromatic dried basil leaves, hand-picked and carefully dried to preserve flavor.",
    benefits: [
      "Stronger flavor than fresh",
      "Anti-inflammatory properties",
      "Essential for Italian cooking",
      "Long-lasting aroma"
    ],
    image: "https://images.unsplash.com/photo-1739922039476-39b394f93c59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGhlcmJzJTIwYmFzaWx8ZW58MXx8fHwxNzc2MjQ1MTU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "9",
    name: "Chamomile Flowers",
    category: "herbs",
    price: 8.99,
    description: "Premium dried chamomile flowers for soothing herbal tea and natural remedies.",
    benefits: [
      "Promotes relaxation and sleep",
      "Natural anti-anxiety properties",
      "Caffeine-free",
      "Gentle on digestion"
    ],
    image: "https://images.unsplash.com/photo-1601761707463-c9d47c48bb1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFtb21pbGUlMjB0ZWElMjBmbG93ZXJzfGVufDF8fHx8MTc3NjIwNjA5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    featured: true
  },
  {
    id: "10",
    name: "Dried Lavender",
    category: "herbs",
    price: 9.99,
    description: "Fragrant culinary lavender buds for baking, teas, and aromatherapy.",
    benefits: [
      "Calming aromatherapy benefits",
      "Unique flavor for desserts",
      "Natural stress relief",
      "Versatile for cooking and crafts"
    ],
    image: "https://images.unsplash.com/photo-1641243252631-88ac0e13804f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGxhdmVuZGVyJTIwaGVyYnN8ZW58MXx8fHwxNzc2MjQ1MTU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "11",
    name: "Herbal Tea Blend",
    category: "herbs",
    price: 12.99,
    description: "Carefully crafted blend of organic herbs for a soothing and healthy tea experience.",
    benefits: [
      "Supports immune health",
      "Organic and pesticide-free",
      "Naturally caffeine-free",
      "Handcrafted blend"
    ],
    image: "https://images.unsplash.com/photo-1757802412806-433e4e60eec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjB0ZWElMjBvcmdhbmljJTIwbGVhdmVzfGVufDF8fHx8MTc3NjI0NTE1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: "12",
    name: "Fruit Assortment Pack",
    category: "fruits",
    price: 24.99,
    description: "A delightful mix of our best-selling dried fruits in one convenient package.",
    benefits: [
      "Variety in every pack",
      "Perfect for gifting",
      "Cost-effective bundle",
      "Premium selection"
    ],
    image: "https://images.unsplash.com/photo-1776188590471-db74f543cf52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGZydWl0cyUyMGFzc29ydG1lbnQlMjBuYXR1cmFsfGVufDF8fHx8MTc3NjI0NTE1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];
