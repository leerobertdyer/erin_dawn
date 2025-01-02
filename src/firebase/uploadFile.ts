import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, getFirestore } from "firebase/firestore";

const storage = getStorage();
const db = getFirestore();

interface Iparams {
    reference: string;
    file: File;
    title: string;
    description: string;
    price: number;
    tags: string[];
}

export default async function uploadFile({ reference, file, title, description, price, tags }: Iparams): Promise<void>  {

const storageRef = ref(storage, reference);

const uploadTask = uploadBytesResumable(storageRef, file);

uploadTask.on('state_changed', 
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    }, 
    (error) => {
      console.log("Error occured while processing upload: ", error);
    }, 
    async () => {
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    console.log('File available at', downloadURL);

    // Store the URL and metadata in Firestore
    try {
        await addDoc(collection(db, "photos"), {
            imageUrl: downloadURL,
            title: title,
            description: description,
            price: price,
            tags: tags,
            createdAt: new Date()
        });
        console.log("Document successfully written!");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
  }
  );
}