import React from 'react';
import dynamic from 'next/dynamic';
import { LucideProps, GithubIcon, MoonIcon, SunIcon } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

const inlineBundledIcon: Record<string, React.ComponentType<LucideProps>> = {
  github: GithubIcon,
  moon: MoonIcon,
  sun: SunIcon
};

interface IconProps extends LucideProps {
  name: keyof typeof dynamicIconImports;
}

export const Icon = React.memo(({ name, ...props }: IconProps) => {
  const LucideIcon = inlineBundledIcon[name] || dynamic(dynamicIconImports[name]);

  return <LucideIcon {...props} />;
});
