import HeroText from "./components/HeroText";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Static Background Image - Server Rendered */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        <Image
          src="/images/luxury-villa.jpg"
          alt="Luxury Villa in Kingston"
          fill
          className="object-cover opacity-60"
          priority
        />
      </div>

      {/* Animated Hero Text */}
      <HeroText />
    </main>
  );
}