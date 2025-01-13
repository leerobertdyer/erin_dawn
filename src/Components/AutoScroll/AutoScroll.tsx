import { useEffect, useRef } from "react";

interface AutoScrollProps {
    children: React.ReactNode;
    speed?: number; // Speed of the scroll in pixels per second
}

export default function AutoScroll({ children, speed = 20 }: AutoScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    //TODO: Adjust and implement the autoscroller on small screens for hero section

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scrollStep = speed / 60; // Convert speed to pixels per frame (assuming 60 FPS)

        const scroll = () => {
            if (container.scrollWidth - container.scrollLeft <= container.clientWidth) {
                container.scrollLeft = 0; // Reset scroll position to the start
            } else {
                container.scrollLeft += scrollStep;
            }
            requestAnimationFrame(scroll);
        };

        const animationFrame = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(animationFrame);
    }, [speed]);

    return (
        <div ref={containerRef} className="overflow-x-auto whitespace-nowrap flex">
            {children}
        </div>
    );
}