"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent, MotionValue } from "framer-motion";

const FRAME_COUNT = 220; // Using all 220 frames as requested
const FRAME_PATH = "/frames/frame_";

export default function KeyboardScroll() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT).fill(null));
    const [isFirstFrameLoaded, setIsFirstFrameLoaded] = useState(false);

    // Scroll progress for the entire container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Map scroll progress (0 to 1) to frame index (0 to FRAME_COUNT - 1)
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

    useEffect(() => {
        // Preload images intelligently
        const loadImages = async () => {
            // First load frame 0 to unblock the UI immediately
            const firstImg = new Image();
            firstImg.src = `${FRAME_PATH}001.webp`;

            await new Promise<void>((resolve) => {
                firstImg.onload = () => {
                    imagesRef.current[0] = firstImg;
                    setIsFirstFrameLoaded(true);
                    resolve();
                };
                firstImg.onerror = () => resolve();
            });

            // Then load the rest in batches so we don't choke the browser thread and network
            const BATCH_SIZE = 10;
            for (let i = 1; i < FRAME_COUNT; i += BATCH_SIZE) {
                const batchPromises = [];
                for (let j = 0; j < BATCH_SIZE && i + j < FRAME_COUNT; j++) {
                    const idx = i + j;
                    const img = new Image();
                    const paddedIndex = (idx + 1).toString().padStart(3, "0");
                    img.src = `${FRAME_PATH}${paddedIndex}.webp`;

                    const p = new Promise<void>((resolve) => {
                        img.onload = () => {
                            imagesRef.current[idx] = img;
                            resolve();
                        };
                        img.onerror = () => resolve();
                    });
                    batchPromises.push(p);
                }
                // Wait for the current batch to load before requesting the next
                await Promise.all(batchPromises);

                // Optional: trigger a re-render if the user is currently scrolling over a loading section
                // But requestAnimationFrame will automatically get the latest imagesRef when scrolling
            }
        };

        loadImages();
    }, []);

    // Render to canvas
    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clamp index
        const safeIndex = Math.min(
            Math.max(Math.round(index), 0),
            FRAME_COUNT - 1
        );

        // Find the closest loaded image if the exact frame isn't loaded yet
        let imgToDraw = imagesRef.current[safeIndex];

        if (!imgToDraw) {
            // Search backwards for the most recent loaded frame to prevent flickering
            for (let i = safeIndex - 1; i >= 0; i--) {
                if (imagesRef.current[i]) {
                    imgToDraw = imagesRef.current[i];
                    break;
                }
            }
        }

        if (!imgToDraw) return;

        // Set canvas dimensions to match window (or parent) to avoid stretching
        // "Contain" logic
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Clear
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Calculate draw dimensions for "contain"
        const imgAspect = imgToDraw.width / imgToDraw.height;
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

        ctx.drawImage(imgToDraw, offsetX, offsetY, drawWidth, drawHeight);
    };

    useMotionValueEvent(frameIndex, "change", (latest) => {
        if (isFirstFrameLoaded) {
            requestAnimationFrame(() => renderFrame(latest));
        }
    });

    // Initial render when loading is done
    useEffect(() => {
        if (isFirstFrameLoaded) {
            requestAnimationFrame(() => renderFrame(frameIndex.get()));
        }
    }, [isFirstFrameLoaded, frameIndex]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current && isFirstFrameLoaded) {
                canvasRef.current.width = window.innerWidth * window.devicePixelRatio;
                canvasRef.current.height = window.innerHeight * window.devicePixelRatio;
                // Force re-render
                renderFrame(frameIndex.get());
            }
        }

        // Initialize size
        if (canvasRef.current && isFirstFrameLoaded) {
            canvasRef.current.width = window.innerWidth * window.devicePixelRatio;
            canvasRef.current.height = window.innerHeight * window.devicePixelRatio;
            renderFrame(frameIndex.get());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isFirstFrameLoaded, frameIndex]);

    if (!isFirstFrameLoaded) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#ECECEC] text-black/60 font-medium">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-black/20 border-t-black/80 rounded-full animate-spin"></div>
                    <span>Initializing Engine...</span>
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

            {/* Text Overlays - Positioned Absolute/Sticky over the canvas */}
            <TextOverlay scrollYProgress={scrollYProgress} />
        </div>
    );
}

function TextOverlay({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
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
