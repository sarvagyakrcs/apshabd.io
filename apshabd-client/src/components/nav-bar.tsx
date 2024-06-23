import React from 'react';
import { Button } from './ui/button';
import { ModeToggle } from './mode-toggle';

type Props = {};

const navItems = [
    {
        title: "Docs",
        href: "/docs",
    },
    {
        title: "API",
        href: "/docs/api/",
    },
    {
        title: "Feedback",
        href: "/feedback/",
    },
];

const NavBar = (props: Props) => {
    return (
        <div className="navbar-container hidden md:block sticky top-0 z-50 bg-white dark:bg-gray-900">
            <nav className="w-auto flex items-center justify-between bg-zinc-100 shadow-2xl dark:bg-slate-900">
                <a href="/" className="text-xl p-3 cursor-pointer font-semibold dark:text-white">
                    <span className='text-emerald-500 dark:text-emerald-400'>Apshabd.io</span>🤬
                </a>
                <ul className="md:flex hidden p-3 items-center justify-center gap-6">
                    {navItems.map((navItem) => (
                        <li key={navItem.title}>
                            <a className="text-zinc-700 font-mono text-lg hover:underline cursor-pointer transition ease-in-out duration-800 dark:text-gray-300 dark:hover:text-white" href={navItem.href}>
                                {navItem.title}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="flex items-center justify-center px-4">
                    <Button variant={"outline"} className="hidden md:block mx-2">
                        <a href="https://github.com/sarvagyakrcs/apshabd.io" target='_blank' className="dark:text-gray-300 dark:hover:text-white">Star on Github ⭐️</a>
                    </Button>
                    <ModeToggle />
                </div>
            </nav>
        </div>
    );
};

export default NavBar;
