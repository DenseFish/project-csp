import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full bg-black bg-cover bg-center bg-no-repeat bg-fixed font-['Netflix_Sans']">
      <div className="absolute inset-0 bg-black md:bg-black/50 z-0"></div>
      <header className="relative z-10 px-6 py-6 md:px-12 flex justify-between items-center">
        <Link href="/">
            <img src="/images/logo.svg" alt="Logo" className="h-6 md:h-8" />
        </Link>
      </header>
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}