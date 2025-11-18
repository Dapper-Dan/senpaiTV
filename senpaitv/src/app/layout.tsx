import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import AuthSessionProvider from "@/components/providers/SessionProvider";
import AniListBanner from "@/components/aniList/AniListBanner";
import AuthToasts from "@/components/auth/AuthToasts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SenpaiTV",
  description: "SenpaiTV is a website that allows you to watch anime and manga.",
  icons: {
    icon: "/images/senpai_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>
      </head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <QueryProvider>
          <AuthSessionProvider>
            <div className="mx-auto min-h-screen flex flex-col">
              <AniListBanner />
              <AuthToasts />
              {children}
            </div>
          </AuthSessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
