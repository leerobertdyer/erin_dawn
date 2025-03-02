function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null | undefined>>, setBackground: React.Dispatch<React.SetStateAction<string>>) {
    try {
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            const fileURL = URL.createObjectURL(selectedFile);
            setBackground(fileURL);
        }
    } catch (error) {
        console.log(error)
    }

}

const preventEnterFromSubmitting = (e: React.KeyboardEvent<HTMLFormElement>) => { 
    // Allow enter key in textareas
    if (e.key === "Enter" && e.target instanceof HTMLElement) {
        const tagName = e.target.tagName.toLowerCase();
        if (tagName !== 'textarea') {
            e.preventDefault();
        }
    }
}

export { handleFileChange, preventEnterFromSubmitting }