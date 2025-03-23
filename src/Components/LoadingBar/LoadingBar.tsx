// LoadingBar component - displays progress for uploads
export default function LoadingBar({ progress }: { progress: number }) {
   return (
       <div className="w-full p-2 text-center mb-2 rounded-md z-10 border border-gray-300"
       style={{ background: `linear-gradient(to right, #4CAF50 ${progress}%, #f1f1f1 ${progress}%)` }}>
       <p className="font-semibold">Upload Progress: {progress}%</p>
       </div>
   )
}