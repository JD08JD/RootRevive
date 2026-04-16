import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface OrganicBadgeProps {
  icon: LucideIcon;
  text: string;
  variant?: "green" | "orange" | "lime";
}

export default function OrganicBadge({ icon: Icon, text, variant = "green" }: OrganicBadgeProps) {
  const colors = {
    green: "bg-[#E8F5E9] text-[#4CAF50]",
    orange: "bg-orange-50 text-[#FFA726]",
    lime: "bg-lime-50 text-[#8BC34A]"
  };

  return (
    <motion.div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors[variant]} font-medium`}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Icon className="size-5" />
      <span>{text}</span>
    </motion.div>
  );
}
