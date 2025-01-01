import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../../firebase";
import { useEffect, useState } from "react";

export default function AdminPanel() {
    const [name, setName] = useState<string>("");

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setName(user.displayName || "there")
                console.log("User signed in: ", user.displayName)
            }
        })
    }, [])

    async function logout() {
        await signOut(auth).then(() => {
            console.log("User signed out")
        }).catch((error) => {
            console.log("Error signing out: ", error)
        })
    }
    return (
        <div className="bg-blue-200 flex flex-col justify-start items-center w-screen h-screen">
           <h1 className="text-3xl border-b-2 border-black p-4">
            Admin Panel
            </h1>

            <div className="bg-white flex flex-col fustify-center items-center w-[85vw] rounded-xl p-4 mt-4 gap-4">
                <p>Hello {name},</p>
                <p>You are currently logged in and should be able to update products.</p>
                <button onClick={logout}
                    className="p-2 bg-blue-500 text-white">Log Out</button>
            </div>
        </div>
    )
}