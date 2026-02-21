import { Navbar } from "@/components/Navbar";
import { HeroCarousel } from "@/components/HeroCarousel";
import { PromotionGrid } from "@/components/PromotionGrid";
import { CategorySection } from "@/components/CategorySection";
import { Footer } from "@/components/Footer";
import { Text } from "@/components/retroui/Text";
import { Card } from "@/components/retroui/Card";
import { Button } from "@/components/retroui/Button";

export default function Home() {
  return (
    <div className="min-h-[200vh] bg-[#f0f0f0] pt-16 md:pt-20">
      <Navbar />
      
      <main className="space-y-8 md:space-y-12 pb-24">
        {/* ... (Hero and Promo sections) */}
        <section className="w-full">
          <HeroCarousel />
        </section>

        <PromotionGrid />

        {/* Categories Section */}
        <CategorySection />
      </main>

      <Footer />
    </div>
  );
}