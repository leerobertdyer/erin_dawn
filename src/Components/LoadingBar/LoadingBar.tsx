// TODO: Update this progress bar 
export default function LoadingBar({ progress }: { progress: number }) {
   return (
       <>
           {progress > 0 && (
               <div className="fixed bottom-0 w-full p-2 text-center"
               style={{ background: `linear-gradient(to right, #4CAF50 ${progress}%, #f1f1f1 ${progress}%)` }}>
               <p>Upload Progress: {progress}%</p>
               </div>
           )}
       </>
    )
}