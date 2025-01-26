interface IWarningDialogueProps {
    onYes: () => void;
    closeDialogue: () => void;
    message?: string;
}
const defaultMessage = "This will remove the item and all associated photos from store.";
export default function WarningDialogue({ onYes, closeDialogue, message=defaultMessage }: IWarningDialogueProps) {
    return (
        <>
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
                <div className="bg-rose-600 w-[30rem] h-[15rem] m-auto rounded-md flex flex-col justify-center items-center">
                    <h3 className="text-white text-2xl">Are you sure?</h3>
                    <p className="text-white p-2 w-[90%] text-center">{message}</p>
                    <div className="flex justify-center items-center gap-4">
                        <button onClick={onYes}
                        className="bg-white text-black p-2 rounded-md mt-4 w-[10rem]">Yes</button>
                        <button onClick={closeDialogue}
                        className="bg-white text-black p-2 rounded-md mt-4 w-[10rem]">No</button>
                    </div>
                </div>
            </div>
        </>
    )
}