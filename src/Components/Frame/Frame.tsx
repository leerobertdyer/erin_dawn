
interface IFrameProps {
    additionalClass?: string;
    hover?: boolean;
    spin?: boolean;
    children?: React.ReactNode;
}

export default function Frame({ additionalClass, hover, spin, children }: IFrameProps) {

    return (
        <div className={`
                ${hover && "cursor-pointer transition-all duration-1000"} 
                ${spin && "hover:[transform:rotateY(180deg)]"}
            ${additionalClass ? additionalClass : 'h-full w-full'} flex-col`}>
            <div className="
                        rounded-[5px] 
                        flex justify-center items-center 
                        bg-white p-2 
                        border-2 border-black h-full">
                <div className="flex flex-col justify-between items-center h-full">
                    {children}
                </div>
            </div>
        </div>
    )
}
