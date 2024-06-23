import { cn } from '@/lib/utils';
import { Charis_SIL, Lato, Monomaniac_One, Open_Sans, Orbitron } from 'next/font/google';
import React from 'react';
import { LeftHero } from './left-hero';
import { RightHero } from './right-hero';

type Props = {}
const font = Lato({ subsets: ["latin"], weight: ["400"] });

const Hero = (props: Props) => {
    return (
        <main className='flex flex-col md:flex-row items-center w-full min-w-full text-slate-800 dark:text-slate-50 h-[93vh]'>
            <div className={cn("left h-[93vh] w-1/2 flex flex-col items-center justify-center", font.className)}>
                <LeftHero />
            </div>
            <div className="right h-[93vh] w-1/2 relative">
                <div className="absolute inset-0 bg-dot-thick-neutral-300 dark:bg-dot-thick-neutral-800 pointer-events-none" />
                
                <div className="absolute inset-0 flex items-center justify-center text-white">
                    <RightHero />
                </div>
            </div>
        </main>
    );
}

export default Hero;
