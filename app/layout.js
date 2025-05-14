import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Link from "next/link";
import Header from "@/components/header";
import {AuthProvider} from "@/app/utilis/auth";

export const metadata = {
  title: "Waves | Fly Without Borders",
  description: "Your one-stop travel solution ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col bg-zinc-950">
        <AuthProvider>
        {/* Fixed Header */}
        <Header className="fixed w-full z-0 bg-gray-950" />

        <div className="relative flex flex-col flex-grow z-10">
          <Link href="/">
            <img
              src="/logo.png"
              alt="SadaFly Logo"
              height={150}
              width={150}
              className="absolute -top-18 left-5 z-20 hidden sm:block"
            />
          </Link>

          {/* Main Content - Grows to push footer down */}
          <main className="flex-grow">{children}</main>
        </div>

        {/* Footer Stays at Bottom */}

        <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
