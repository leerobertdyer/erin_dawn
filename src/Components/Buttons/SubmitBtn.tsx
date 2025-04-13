
export default function SubmitBtn({progress}: {progress: number}) {
    return (
        <button type="submit" className="m-auto bg-edcYellow-80 text-edcPurple-80 px-4 py-2 w-[10rem] md:w-[15rem] hover:bg-edcYellow-40 hover:border-2 hover:border-edcPurple-80 rounded-md disabled:bg-gray-400"
        disabled={progress > 0} >
            Submit
        </button>
    )
}