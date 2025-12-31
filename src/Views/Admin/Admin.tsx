import { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { setPersistence, signInWithEmailAndPassword, browserLocalPersistence } from "firebase/auth";
import AdminPanel from "../../Components/AdminPanel/AdminPanel";
import { useUserContext } from "../../Context/UserContext";

export default function Admin() {
    const { user, setUser } = useUserContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function loginWithEmailPass(email: string, password: string) {
        await setPersistence(auth, browserLocalPersistence)
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
        loginWithEmailPass(email, password);
        // TODO: add passwordless login (IE apple, google, etc)
    };

    return (
        user
            ?
            <AdminPanel />
            :
            <div className="bg-[url('/images/background.jpg')] bg-cover bg-center flex justify-center items-center w-screen h-screen">
                <div className="border-2 border-black rounded-md p-4 w-[90vw] h-[90vw] md:w-[45vw] md:h-[45vw] bg-black bg-opacity-60 flex justify-center items-center mb-20">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full text-center">
                        <h1 className="text-3xl text-white">Backdoor Login</h1>
                        <input type="email" required placeholder="Email" className="p-2 w-full" onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" required placeholder="Password" className="p-2 w-full" onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit" className="p-2 bg-edcBlue-60 text-white w-full">Login</button>
                    </form>
                </div>
            </div>
    )
}