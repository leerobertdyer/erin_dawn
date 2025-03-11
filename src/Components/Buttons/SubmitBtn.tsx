
export default function SubmitBtn({progress}: {progress: number}) {
    return (
        <button type="submit" className="bg-edcYellow-60 text-edcPurple-80 px-4 py-2 w-[15rem] hover:bg-edcYellow-20 hover:border-2 hover:border-edcPurple-80 rounded-md disabled:bg-gray-400"
        disabled={progress > 0} >
            Submit
        </button>
    )
}