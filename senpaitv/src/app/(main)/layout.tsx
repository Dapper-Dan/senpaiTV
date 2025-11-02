import Header from "@/components/header/Header";
import Footer from "@/components/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="px-8">
        {children}
      </div>
      <Footer />
    </>
  );
}
