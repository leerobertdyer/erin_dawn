interface ICustomInput {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    min?: number;
    rows?: number;
}

export default function CustomInput(props: ICustomInput) {
    const { label, value, onChange, type, placeholder, required, disabled, error, onBlur, min, rows = 4 } = props;
    
    const baseClassName = `w-full p-2 border-[1px] border-black rounded-md 
        ${error && "border-rose-600"} ${value && "bg-gray-300"}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // For checkbox inputs, we need to handle the event differently
        if (type === 'checkbox' && 'checked' in e.target) {
            onChange(e as React.ChangeEvent<HTMLInputElement>);
        } else {
            onChange(e);
        }
    };

    return (
        <div className="flex flex-col items-center justify-start gap-1 w-full m-auto">
            <label className="bg-white text-center px-2 rounded-sm w-fit min-w-[15rem]" htmlFor={label}>{label}</label>
            {type === 'textarea' ? (
                <textarea 
                    className={`${baseClassName} min-h-[100px] resize-y`}
                    id={label}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    onBlur={onBlur}
                    rows={rows}
                />
            ) : (
                <input 
                    className={baseClassName}
                    type={type}
                    {...(type === "number" && { min, step: 0.01 })}
                    id={label}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    onBlur={onBlur}
                />
            )}
            {error && <span className="text-xs text-rose-600">{error}</span>}
        </div>
    )
}