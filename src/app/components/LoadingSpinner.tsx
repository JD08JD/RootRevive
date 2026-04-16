import { motion } from "motion/react";
import { Leaf } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Leaf className="size-12 text-[#4CAF50]" />
      </motion.div>
    </div>
  );
}
