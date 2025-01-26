interface ICustomInput {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    min?: number;
    step?: string;
}
export default function CustomInput(props: ICustomInput) {
    const { label, value, onChange, type, placeholder, required, disabled, error, onBlur, min } = props;
    return (
        <div className="flex flex-col items-center justify-start gap-1 w-full m-auto ">
            <label className="bg-white text-center px-2 rounded-sm w-fit min-w-[15rem]" htmlFor={label}>{label}</label>
            <input className={`w-full p-2 border-[1px] border-black rounded-md 
                ${error && "border-rose-600" } ${value && "bg-gray-300"}`}
                type={type} {...(type === "number" && { min })} id={label} value={value} onChange={onChange}
                placeholder={placeholder} required={required} disabled={disabled} onBlur={onBlur} />
            {error && <span className="text-xs text-rose-600">{error}</span>}
        </div>
    )
}