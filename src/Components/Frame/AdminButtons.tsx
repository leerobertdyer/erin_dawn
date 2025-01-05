
export default function AdminButtons({ handleEdit }: { handleEdit: () => void }) {
    return (
        <div className="flex justify-center items-center w-full p-2 gap-4">
            <button
                className="
                            transition:all duration-[10ms]
                            hover:bg-yellow-500 hover:text-black
                            bg-green-500 text-white px-2 rounded-md w-[100%]" onClick={handleEdit}>Edit</button>
        </div>
    )
}