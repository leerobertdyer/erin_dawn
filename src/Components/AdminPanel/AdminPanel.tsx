import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import uploadFile from "../../firebase/uploadFile";

export default function AdminPanel() {
    const [name, setName] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [nextTag, setNextTag] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [disabled, setDisabled] = useState<boolean>(true);


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setName(user.displayName || "there")
                console.log("User signed in: ", user.displayName)
            }
        })
    }, [])

    useEffect(() => {
        if (title && description && tags.length >= 0 && price > 0 && file) {
            console.log('all set')
            setDisabled(false);
        } else {
            console.log('not all set: ', title, description, tags, price, file)
            setDisabled(true);
        }
    }, [title, description, tags, price, file])

    function handleKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddTag();
        }
    };

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!file || !title || !description || !tags || !price) return

        const fileToUpload = {
            reference: `photos/${title}`,
            title: title,
            description: description,
            tags: tags,
            file: file,
            price: price
        }

        uploadFile(fileToUpload)
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

    function handleAddTag() {
        if (nextTag === "" || tags.includes(nextTag)) return
        setTags([...tags, nextTag])
        setNextTag("")
    }

    function handleRemoveTag(tag: string) {
        return () => {
            setTags(tags.filter((t) => t !== tag))
        }
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
            <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}
                className="bg-white flex flex-col justify-center items-center w-[85vw] border-2 border-black rounded-xl p-4 mt-4 gap-4">
                <h2 className="text-2xl">Add Product</h2>
                <input type="text" placeholder="Product Name"
                    className=" border-2 border-black rounded-sm p-2 w-[80%]" onChange={(e) => setTitle(e.target.value)} />
                <input type="text" placeholder="Product Description"
                    className=" border-2 border-black rounded-sm p-2 w-[80%]" onChange={(e) => setDescription(e.target.value)} />

                <div className="flex flex-col items-between w-[80%]">
                    <input type="text" placeholder="Product Tags" value={nextTag}
                        className=" border-2 border-black rounded-sm p-2 w-[100%]" onChange={(e) => setNextTag(e.target.value.trim())} />

                    <div className="w-full flex flex-wrap justify-start items-start">
                        {tags.map((tag, index) => (
                            <div
                                onClick={handleRemoveTag(tag)}
                                className="
                            hover:bg-red-500 hover:cursor-pointer hover:text-white
                            text-gray-400
                            border-[1px] border-gray-400 
                            rounded-md p-[2px] m-[2px] 
                            flex items-center"
                                key={index}>
                                <p className="text-xs inline" >{tag}</p>
                                <button type="button" className="text-xs mx-1 " >x</button>
                            </div>))}
                    </div>
                    <button type="button" className="p-2 bg-green-500 text-white rounded-md mt-2"
                        onClick={handleAddTag} >Add Tag+</button>
                </div>

                <input type="number" min={0} placeholder="Product Price"
                    className=" border-2 border-black rounded-sm p-2 w-[80%]" onChange={(e) => setPrice(Number(e.target.value))} />
                <label htmlFor="file"
                    className="p-2 bg-green-500 text-white cursor-pointer">Upload Image+
                </label>
                <input type="file" id="file" placeholder="Product Image"
                    className="hidden" onChange={(e) => handleFileChange(e)} />
                {file ? <p className="text-xs text-gray-400">{file.name}</p> : <p className="text-xs text-gray-400">No file selected</p>}
                <button type="submit" disabled={disabled} className={`p-2 ${disabled ? 'bg-gray-400' : 'bg-blue-500'} text-white`}>Add Product</button>
            </form>
        </div>
    )
}