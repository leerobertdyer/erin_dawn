import { ReactElement } from "react";

export default function BackgroundDiv({ children, image }: { children: ReactElement, image: string }) {
    return (
        <div className="bg-cover bg-no-repeat w-full h-fit flex flex-col items-center justify-start"
            style={{ backgroundImage: `url(${image})` }}
        >
            {children}
        </div>
    )

}