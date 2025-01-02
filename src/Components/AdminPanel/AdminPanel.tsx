import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { uploadPhoto } from "../../flickr";

export default function AdminPanel() {
    const [name, setName] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [tags, setTags] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setName(user.displayName || "there")
                console.log("User signed in: ", user.displayName)
            }
        })
    }, [])

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log("Product: ", title, description, price, tags, file)
        uploadPhoto(file as File, title, description, tags)
            .then((resp) => {
                console.log("Photo uploaded: ", resp)
            })
            .catch((error) => {
                console.log("Error uploading photo: ", error)
            })
    }

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
                    className="p-2 bg-red-500 text-white">Log Out</button>
            </div>
            <form onSubmit={handleSubmit}
                className="bg-white flex flex-col justify-center items-center w-[85vw] border-2 border-black rounded-xl p-4 mt-4 gap-4">
                <h2 className="text-2xl">Add Product</h2>
                <input type="text" placeholder="Product Name"
                    className=" border-2 border-black rounded-sm p-2 w-[80%]" onChange={(e) => setTitle(e.target.value)} />
                <input type="text" placeholder="Product Description"
                    className=" border-2 border-black rounded-sm p-2 w-[80%]" onChange={(e) => setDescription(e.target.value)} />
                <input type="text" placeholder="Product Tags"
                    className=" border-2 border-black rounded-sm p-2 w-[80%]" onChange={(e) => setTags(e.target.value)} />
                <input type="number" placeholder="Product Price"
                    className=" border-2 border-black rounded-sm p-2 w-[80%]" onChange={(e) => setPrice(Number(e.target.value))} />
                <label htmlFor="file"
                    className="p-2 bg-green-500 text-white cursor-pointer">Upload Image+
                </label>
                <input type="file" id="file" placeholder="Product Image"
                    className="hidden" onChange={(e) => handleFileChange(e)} />
                {file ? <p className="text-xs text-gray-400">{file.name}</p> : <p className="text-xs text-gray-400">No file selected</p>}
                <button type="submit" className="p-2 bg-blue-500 text-white">Add Product</button>
            </form>
        </div>
    )
}