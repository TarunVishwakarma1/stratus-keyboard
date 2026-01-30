"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";

const FRAME_COUNT = 220; // Using all 220 frames as requested
const FRAME_PATH = "/frames/frame_";

export default function KeyboardScroll() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loadedCount, setLoadedCount] = useState(0);
    const [loadError, setLoadError] = useState(false);

    // Scroll progress for the entire container
    // Scroll progress for the entire container
    const { scrollYProgress } = useScroll({
        offset: ["start start", "end end"],
    });

    // Map scroll progress (0 to 1) to frame index (0 to FRAME_COUNT - 1)
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

    useEffect(() => {
        // Preload images
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            let loaded = 0;

            for (let i = 0; i < FRAME_COUNT; i++) {
                const img = new Image();
                // Pad index to 3 digits (001, 002, etc.)
                // Although the files are frame_001.jpg, etc.
                // Wait, the `ls` output showed ezgif-frame-001.jpg.
                // And I renamed them to frame_001.jpg.
                // I need to be careful with 0-based vs 1-based.
                // ezgif usually starts at 001.
                // I should check if frame_000 exists or if it starts at 001.
                // The list showed 001.
                // So I'll map index 0 -> 001.
                const paddedIndex = (i + 1).toString().padStart(3, "0");
                img.src = `${FRAME_PATH}${paddedIndex}.webp`;

                await new Promise<void>((resolve) => {
                    img.onload = () => {
                        loaded++;
                        setLoadedCount(loaded);
                        resolve();
                    };
                    img.onerror = () => {
                        console.error(`Failed to load image ${i}`);
                        // Still resolve to continue loading others? Or fatal?
                        // If missing a few frames, might be glitchy.
                        resolve();
                    }
                });
                loadedImages.push(img);
            }
            setImages(loadedImages);
        };

        loadImages();
    }, []);

    // Render to canvas
    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clamp index
        const safeIndex = Math.min(
            Math.max(Math.round(index), 0),
            images.length - 1
        );

        const img = images[safeIndex];
        if (!img) return;

        // Set canvas dimensions to match window (or parent) to avoid stretching
        // "Contain" logic
        // We want to draw the image such that it fits within the canvas while preserving aspect ratio
        // And the canvas itself is h-screen w-full.

        // Actually, setting canvas width/height to window.innerWidth/Height gives best resolution
        // But we need to handle resize in a separate effect or just use the existing size if already set.
        // Ideally we set canvas.width = window.innerWidth * dpr, etc.

        // Let's rely on a resize handler for the canvas buffer size.

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Clear
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Calculate draw dimensions for "contain"
        const imgAspect = img.width / img.height;
        const canvasAspect = canvasWidth / canvasHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imgAspect) {
            // Canvas is wider than image -> Match width, crop height
            drawWidth = canvasWidth;
            drawHeight = canvasWidth / imgAspect;
            offsetX = 0;
            offsetY = (canvasHeight - drawHeight) / 2;
        } else {
            // Canvas is taller than image (or equal) -> Match height, crop width
            drawHeight = canvasHeight;
            drawWidth = canvasHeight * imgAspect;
            offsetX = (canvasWidth - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    useMotionValueEvent(frameIndex, "change", (latest) => {
        if (loadedCount === FRAME_COUNT) {
            requestAnimationFrame(() => renderFrame(latest));
        }
    });

    // Initial render when loading is done
    useEffect(() => {
        if (loadedCount === FRAME_COUNT) {
            requestAnimationFrame(() => renderFrame(frameIndex.get()));
        }
    }, [loadedCount, frameIndex]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth * window.devicePixelRatio;
                canvasRef.current.height = window.innerHeight * window.devicePixelRatio;
                // Force re-render
                renderFrame(frameIndex.get());
            }
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [loadedCount]); // Re-bind if loadedCount changes? No, just renderFrame needs current index.


    if (loadedCount < FRAME_COUNT) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#ECECEC] text-black/60 font-medium">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-black/20 border-t-black/80 rounded-full animate-spin"></div>
                    <span>Loading Stratus sequence... {Math.round((loadedCount / FRAME_COUNT) * 100)}%</span>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative h-[400vh] bg-[#ECECEC]">
            <canvas
                ref={canvasRef}
                className="sticky top-0 w-full h-screen block"
                style={{ width: "100%", height: "100vh" }}
            />

            {/* Text Overlays - Positioned Absolute/Sticky over the canvas? 
          Actually, we can use sticky elements interleaved or fixed overlays that fade in/out based on scrollYProgress.
      */}
            <TextOverlay scrollYProgress={scrollYProgress} />
        </div>
    );
}

function TextOverlay({ scrollYProgress }: { scrollYProgress: any }) {
    // Helper for beat visibility
    const useBeatOpacity = (start: number, peak: number, end: number) => {
        return useTransform(scrollYProgress,
            [start, peak - 0.05, peak, peak + 0.05, end],
            [0, 1, 1, 1, 0]
        );
    };

    const useBeatY = (start: number, peak: number, end: number) => {
        return useTransform(scrollYProgress,
            [start, peak, end],
            [20, 0, -20]
        );
    }

    // Beats:
    // 0% Scroll (Centered): “Stratus Keyboard.” subtext: “Engineered clarity.”
    // 25% Scroll (Left aligned): “Built for Precision.” subtext: “Every detail, measured.”
    // 60% Scroll (Right aligned): “Layered Engineering.” subtext: “See what’s inside.”
    // 90% Scroll (Centered CTA): “Assembled. Ready.” subtext: “Scroll back to replay.”

    // Using slightly wider ranges to keep text visible longer? Or just transient?
    // User requested "Timed Fade In/Out"

    const opacity1 = useBeatOpacity(0, 0.05, 0.15);
    const y1 = useBeatY(0, 0.05, 0.15);

    const opacity2 = useBeatOpacity(0.15, 0.25, 0.35);
    const y2 = useBeatY(0.15, 0.25, 0.35);

    const opacity3 = useBeatOpacity(0.50, 0.60, 0.70);
    const y3 = useBeatY(0.50, 0.60, 0.70);
    return (
        <div className="fixed inset-0 pointer-events-none flex flex-col justify-center w-full h-full">
            {/* Beat 1: Centered */}
            <motion.div style={{ opacity: opacity1, y: y1 }} className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-black/90 mb-2">Stratus Keyboard.</h1>
                    <p className="text-xl text-black/60 font-medium tracking-tight">Engineered clarity.</p>
                </div>
            </motion.div>

            {/* Beat 2: Left Aligned */}
            <motion.div style={{ opacity: opacity2, y: y2 }} className="absolute inset-0 flex items-center justify-start container mx-auto px-8 md:px-16">
                <div className="text-left max-w-lg">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-black/90 mb-2">Built for Precision.</h2>
                    <p className="text-xl text-black/60 font-medium tracking-tight">Every detail, measured.</p>
                </div>
            </motion.div>

            {/* Beat 3: Right Aligned */}
            <motion.div style={{ opacity: opacity3, y: y3 }} className="absolute inset-0 flex items-center justify-end container mx-auto px-8 md:px-16">
                <div className="text-right max-w-lg">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-black/90 mb-2">Layered Engineering.</h2>
                    <p className="text-xl text-black/60 font-medium tracking-tight">See what’s inside.</p>
                </div>
            </motion.div>
        </div>
    );
}
