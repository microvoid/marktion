export default async function ({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-screen flex-col items-center">{children}</main>;
}
