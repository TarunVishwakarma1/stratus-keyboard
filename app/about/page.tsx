import { ArrowRight } from "lucide-react";

export default function About() {
    return (
        <main className="min-h-screen pt-32 pb-20 container mx-auto px-6 md:px-12">
            <section className="max-w-4xl mx-auto">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-12">
                    Stratus.<br />
                    <span className="text-foreground/40">Beyond the fog.</span>
                </h1>

                <div className="space-y-12 text-xl md:text-2xl leading-relaxed text-foreground/80 font-light">
                    <p>
                        We started Stratus with a single obsession: clarity. In a world of noise, clutter, and distractions, the tool you use to communicate should be invisible.
                    </p>
                    <p>
                        Every curve, every keycap, and every circuit trace in the Stratus keyboard is designed to remove friction. We call it "atmospheric engineering"—hardware that feels like it belongs in the clouds, not grounded by mechanical limitations.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                        <div className="aspect-square bg-foreground/5 rounded-lg flex items-center justify-center p-8">
                            <span className="text-sm tracking-widest uppercase text-foreground/40">Design Lab, Kyoto</span>
                        </div>
                        <div className="aspect-square bg-foreground/5 rounded-lg flex items-center justify-center p-8">
                            <span className="text-sm tracking-widest uppercase text-foreground/40">Assembly, Shenzhen</span>
                        </div>
                    </div>
                    <p>
                        Limited batches. Precision milled. Hand-assembled. Stratus isn't just a peripheral; it's the bridge between your mind and the machine.
                    </p>
                </div>

                <div className="mt-20 border-t border-foreground/10 pt-12">
                    <h3 className="text-sm font-bold tracking-widest uppercase text-accent mb-4">Values</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <li>
                            <h4 className="font-bold text-lg mb-2">Silence</h4>
                            <p className="text-foreground/60 text-sm">Acoustics tuned to eliminate resonance, leaving only the pure sound of thought.</p>
                        </li>
                        <li>
                            <h4 className="font-bold text-lg mb-2">Tactility</h4>
                            <p className="text-foreground/60 text-sm">Feedback that confirms purpose without interrupting flow.</p>
                        </li>
                        <li>
                            <h4 className="font-bold text-lg mb-2">Permanence</h4>
                            <p className="text-foreground/60 text-sm">Aerospace-grade materials built to outlast the software it controls.</p>
                        </li>
                    </ul>
                </div>

                <div className="mt-20">
                    <a href="#join" className="inline-flex items-center gap-2 text-accent font-bold hover:gap-4 transition-all">
                        Join the journey <ArrowRight size={20} />
                    </a>
                </div>
            </section>
        </main>
    );
}
