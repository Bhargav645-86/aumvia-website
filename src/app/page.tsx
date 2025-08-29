// src/app/page.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        {/* Main content will go here */}
        <h1 className="text-4xl font-bold text-center mt-10">
          Your journey to streamlined business management starts here.
        </h1>
      </main>
      <Footer />
    </div>
  );
}