export function Footer() {
  return (
    <div className="border-t border-gray-900/10 py-8 sm:mt-10 lg:mt-12">
      <p className="text-sm leading-5 text-gray-500">
        © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME}
      </p>
    </div>
  );
}
