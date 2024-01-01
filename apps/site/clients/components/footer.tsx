import { DarkModeBtn } from './setting-dark-mode-btn';

export function Footer() {
  return (
    <div className="border-t border-gray-900/10 py-8 sm:mt-10 lg:mt-12">
      <p className="flex items-center gap-1 text-sm leading-5 text-gray-500">
        © {new Date().getFullYear()}
        <a href="https://github.com/microvoid/marktion" className="hover:underline">
          {process.env.NEXT_PUBLIC_APP_NAME}
        </a>
        <DarkModeBtn />
      </p>
    </div>
  );
}
