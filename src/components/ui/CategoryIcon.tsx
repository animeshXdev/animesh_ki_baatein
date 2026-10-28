import React from "react";
import {
  Laptop,
  Briefcase,
  Sparkles,
  Palette,
  Clock,
  Target,
  Activity,
  Wallet,
  Folder,
  Code,
  BookOpen,
  Coffee,
  Heart,
  Lightbulb,
  Globe,
  Compass,
  type LucideProps,
} from "lucide-react";

interface CategoryIconProps extends Omit<LucideProps, "name"> {
  name?: string | null;
}

export function CategoryIcon({ name, ...props }: CategoryIconProps) {
  const iconMap: Record<string, React.ComponentType<LucideProps>> = {
    laptop: Laptop,
    technology: Laptop,
    briefcase: Briefcase,
    business: Briefcase,
    sparkles: Sparkles,
    lifestyle: Sparkles,
    palette: Palette,
    design: Palette,
    clock: Clock,
    productivity: Clock,
    target: Target,
    career: Target,
    activity: Activity,
    health: Activity,
    wallet: Wallet,
    finance: Wallet,
    code: Code,
    book: BookOpen,
    coffee: Coffee,
    heart: Heart,
    lightbulb: Lightbulb,
    globe: Globe,
    compass: Compass,
    folder: Folder,
  };

  const key = (name || "folder").toLowerCase();
  const IconComponent = iconMap[key] || Folder;

  return <IconComponent {...props} />;
}
