import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebaseConfig";

interface IUploadFile {
  reference: string;
  file: File;
  onProgress?: (progress: number) => void;
}

export default async function uploadFile({ reference, file, onProgress }: IUploadFile): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const storageRef = ref(storage, `photos/${reference}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress && onProgress(Math.floor(progress));
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
          console.log("Error occurred while processing upload: ", error);
          reject(new Error("Error occurred while processing upload: " + error));
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);
          resolve(downloadURL);
        }
      );

    } catch (error) {
      reject(new Error("Error uploading file: " + error));
    }
  });
}