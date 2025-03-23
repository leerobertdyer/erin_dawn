// LoadingBar component - displays progress for uploads
import { useEffect, useState } from "react";

interface LoadingBarProps {
    progress: number;
}

export default function LoadingBar({ progress }: LoadingBarProps) {
    // Use a smoother progress value that catches up to the actual progress
    const [smoothProgress, setSmoothProgress] = useState(0);
    
    // Set up the smooth progress effect
    useEffect(() => {
        // Move at least 1% and at most 5% toward the target
        if (smoothProgress < progress) {
            const diff = progress - smoothProgress;
            const increment = Math.max(1, Math.min(5, diff / 2));
            
            const timer = setTimeout(() => {
                setSmoothProgress(prev => Math.min(100, prev + increment));
            }, 100);
            
            return () => clearTimeout(timer);
        }
    }, [smoothProgress, progress]);

    return (
        <div className="w-full p-2 text-center mb-4 rounded-md z-10 border border-gray-300 overflow-hidden relative h-10">
            {/* Background container */}
            <div className="absolute inset-0 bg-gray-200"></div>
            
            {/* Progress fill with image */}
            <div 
                className="absolute inset-y-0 left-0 transition-all duration-300 ease-out bg-cover bg-center h-full"
                style={{ 
                    width: `${smoothProgress}%`, 
                    backgroundImage: `url("/images/background.jpg")`,
                    backgroundPosition: 'left center'
                }}
            ></div>
            
            {/* Text overlay */}
            <p className="font-semibold relative z-10 text-white mix-blend-difference">
                Upload Progress: {Math.round(smoothProgress)}%
            </p>
        </div>
    );
}