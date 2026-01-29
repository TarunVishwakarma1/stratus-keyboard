"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md border-b border-foreground/5" />

            <div className="container mx-auto px-6 h-20 flex items-center justify-between relative z-10">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold tracking-tighter uppercase">
                    Stratus
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLink href="/">Home</NavLink>
                    <NavLink href="/#features">Features</NavLink>
                    <NavLink href="/about">About</NavLink>
                    <button className="bg-foreground text-background px-6 py-2 rounded-full text-sm font-medium hover:bg-accent hover:text-white transition-colors">
                        Pre-order
                    </button>

                    {mounted && (
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-foreground/5 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex md:hidden items-center gap-4">
                    {mounted && (
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-foreground/5 transition-colors"
                        >
                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    )}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-b border-foreground/5 overflow-hidden backdrop-blur-xl"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            <MobileLink href="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileLink>
                            <MobileLink href="/#features" onClick={() => setMobileMenuOpen(false)}>Features</MobileLink>
                            <MobileLink href="/about" onClick={() => setMobileMenuOpen(false)}>About</MobileLink>
                            <button className="bg-foreground text-background w-full py-3 rounded-full font-medium mt-4">
                                Pre-order
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors">
            {children}
        </Link>
    )
}

function MobileLink({ href, onClick, children }: { href: string, onClick: () => void, children: React.ReactNode }) {
    return (
        <Link href={href} onClick={onClick} className="text-lg font-medium text-foreground/80 hover:text-foreground py-2 border-b border-foreground/5">
            {children}
        </Link>
    )
}
