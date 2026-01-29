"use client";

import Link from "next/link";
import { Twitter, Instagram, Github, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-foreground text-background pt-24 pb-12">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-2xl font-bold tracking-tighter uppercase mb-6">Stratus</h3>
                        <p className="text-background/60 mb-8 max-w-xs">
                            Engineered for clarity. Designed for those who build the future.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Twitter size={20} />} href="#" />
                            <SocialIcon icon={<Instagram size={20} />} href="#" />
                            <SocialIcon icon={<Github size={20} />} href="#" />
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-background/60">
                            <li><FooterLink href="#">Features</FooterLink></li>
                            <li><FooterLink href="#">Specifications</FooterLink></li>
                            <li><FooterLink href="#">Gallery</FooterLink></li>
                            <li><FooterLink href="#">Pre-order</FooterLink></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-background/60">
                            <li><FooterLink href="/about">About Us</FooterLink></li>
                            <li><FooterLink href="#">Careers</FooterLink></li>
                            <li><FooterLink href="#">Blog</FooterLink></li>
                            <li><FooterLink href="#">Press Kit</FooterLink></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold mb-6">Stay Updated</h4>
                        <p className="text-background/60 mb-4 text-sm">
                            Join the waiting list for batch 2 releases and updates.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 w-full text-sm focus:outline-none focus:border-accent transition-colors"
                                suppressHydrationWarning
                            />
                            <button className="bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors">
                                <Mail size={18} />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-background/40">
                    <p>&copy; {new Date().getFullYear()} Stratus Keyboards. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-background transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-background transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
    return (
        <Link href={href} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-300">
            {icon}
        </Link>
    )
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} className="hover:text-accent transition-colors block">
            {children}
        </Link>
    )
}
