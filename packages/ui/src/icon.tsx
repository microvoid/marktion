import { icons } from 'lucide-react';

export type IconProps = {
  name: keyof typeof icons;
  size?: number;
  color?: string;
};

export const Icon = (props: IconProps) => {
  const LucideIcon = icons[props.name];

  return <LucideIcon size={16} {...props} />;
};
