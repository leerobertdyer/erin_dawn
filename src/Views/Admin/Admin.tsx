import { useState } from "react";
import { auth } from "../../firebase";
import { setPersistence, signInWithEmailAndPassword, User, browserSessionPersistence } from "@firebase/auth";
import AdminPanel from "../../Components/AdminPanel/AdminPanel";

export default function Admin({ u, setUser }: { u: User | null, setUser: (user: User | null) => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function login(email: string, password: string) {
        await setPersistence(auth, browserSessionPersistence)
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setUser(user)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert("Error signing in. Please contact the bob for assistance.")
                console.log("Error signing in: ", errorCode, errorMessage)
            });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || !password) return
        login(email, password);
    };

    return (
            u
            ?
            <AdminPanel />
            :
            <div className="bg-white flex justify-center items-center w-screen h-screen">
                <div className="border-2 border-black rounded-xl p-4 bg-blue-300 w-[35vw] h-[25vw] flex justify-center items-center mb-20">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <h1 className="text-3xl">Backdoor Login</h1>
                        <input type="email" required placeholder="Email" className="p-2" onChange={(e) => setEmail(e.target.value)}/>
                        <input type="password" required placeholder="Password" className="p-2" onChange={(e) => setPassword(e.target.value)}/>
                        <button type="submit" className="p-2 bg-blue-500 text-white">Login</button>
                    </form>
                </div>
            </div>
    )
}