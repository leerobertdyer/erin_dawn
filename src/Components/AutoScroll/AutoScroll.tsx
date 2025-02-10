import React, { useEffect, useRef, useState } from "react";

interface AutoScrollProps {
    children: React.ReactNode;
    speed?: number; // Speed of the scroll in pixels per second
}

export default function AutoScroll({ children, speed = 10 }: AutoScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isScrollingRight, setIsScrollingRight] = useState(true);

    useEffect(() => {
        const container = containerRef.current; 
        if (!container) return;

        const scrollStep = .5; // Convert speed to pixels per frame (assuming 60 FPS)

        const scroll = () => {
            if (container.scrollWidth - container.scrollLeft >= container.scrollWidth) {
                setIsScrollingRight(false);
            } else 
            {
                if (isScrollingRight) {
                    container.scrollLeft += scrollStep;
                } else {
                    container.scrollLeft -= scrollStep;
                }
                if (container.scrollLeft <= 0) {
                    setIsScrollingRight(true);
                }

            } console.log(container.scrollLeft);
            requestAnimationFrame(scroll);
        };

        const animationFrame = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(animationFrame);
    }, [speed, isScrollingRight]);

    return (
        <div ref={containerRef} className="overflow-x-auto whitespace-nowrap flex">
            {children}
        </div>
    );
}