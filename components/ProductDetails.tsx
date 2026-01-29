"use client";

import { motion } from "framer-motion";

export default function ProductDetails() {
    return (
        <section className="relative bg-background text-foreground pb-32 transition-colors duration-300">
            <div className="container mx-auto px-6 md:px-12">

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="w-full h-[1px] bg-foreground/10 mb-32 origin-left"
                />

                {/* Feature Highlight 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-40 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Tactile Perfection.</h3>
                        <p className="text-xl text-foreground/60 leading-relaxed max-w-md">
                            Every keystroke is a symphony of engineering. Custom-molded stabilizers and factory-lubed switches deliver a typing experience that feels as premium as it sounds.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-[400px] w-full bg-foreground/5 rounded-sm flex items-center justify-center"
                    >
                        {/* Placeholder for feature image/graphic */}
                        <span className="text-foreground/20 font-medium tracking-widest uppercase">Acoustic Chamber</span>
                    </motion.div>
                </div>

                {/* Specs Grid */}
                <div className="mb-20">
                    <motion.h3
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-12"
                    >
                        Technical Specifications
                    </motion.h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 border-t border-foreground/10 pt-16">
                        <SpecItem label="Case Material" value="Aerospace-grade Aluminum 6063" delay={0} />
                        <SpecItem label="Connectivity" value="USB-C, Bluetooth 5.1, 2.4GHz" delay={0.1} />
                        <SpecItem label="Battery Life" value="Up to 200 hours (Backlight off)" delay={0.2} />
                        <SpecItem label="Polling Rate" value="1000Hz (Wired / 2.4GHz)" delay={0.3} />
                        <SpecItem label="Weight" value="1.8 kg (Fully Assembled)" delay={0.4} />
                        <SpecItem label="Dimensions" value="320mm x 140mm x 34mm" delay={0.5} />
                    </div>
                </div>

            </div>
        </section>
    );
}

function SpecItem({ label, value, delay }: { label: string, value: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
        >
            <h4 className="text-foreground/40 font-medium mb-2">{label}</h4>
            <p className="text-xl md:text-2xl font-medium text-foreground/90">{value}</p>
        </motion.div>
    )
}
