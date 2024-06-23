import Hero from "@/components/hero";
import NavBar from "@/components/nav-bar";
import Image from "next/image";

export default function Home() {
    return (
        <main className="h-h-full flex item-center flex-col justify-center">
            <NavBar />
            <Hero />
        </main>
  );
}
