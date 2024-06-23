"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { Check } from "lucide-react";

const benefits = [
    "Much faster and Cheaper to run thatn AI.",
    "Pretty Accurate",
    "Suports both Hindi and English",
    "100% free and open source."
]

export function LeftHero() {
    return (
        <HeroHighlight>
            <motion.h1
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: [20, -5, 0],
                }}
                transition={{
                    duration: 0.5,
                    ease: [0.4, 0.0, 0.2, 1],
                }}
                className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
            >
                Apshabd.io <br /> {" "}
                <Highlight className="text-black dark:text-white">
                    Detect and flag profane language
                </Highlight>
            </motion.h1>
            <div className="flex  item-center justify-center w-full mt-10">
                <span className="p-6 text-justify text-lg">Detecting toxic content has always been <span className="font-mono font-semibold text-red-700 dark:text-red-400">SLOW</span> and <br /> <span className="font-mono font-semibold text-red-700 dark:text-red-400">EXPENSIVE</span>. Not anymore. Introducing a fast, free <br /> and open-source profanity filter for your web apps. <br /> </span>
            </div>
            <div className="flex items-center justify-center w-full">
                <div className="flex items-start flex-col p-6 text-lg">
                    {benefits.map((benefit, index) => {
                        return (
                            <span key={index} className=""><Check className="inline gap-2 size-4 text-red-700 dark:text-red-500" /> {benefit}</span>
                        )
                    })}
                </div>
            </div>
        </HeroHighlight>
    );
}
