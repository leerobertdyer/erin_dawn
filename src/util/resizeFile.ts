import Resizer from "react-image-file-resizer";

export const resizeFile = (file: File, maxW: number, maxH: number) =>
  new Promise<File>((resolve) => {
    Resizer.imageFileResizer(
      file, // Is the file of the image which will resized.
      maxW, // Is the maxWidth of the resized new image.
      maxH, // Is the maxHeight of the resized new image.
      "JPEG", 
      100, // Is the quality of the resized new image.
      0, // Is the degree of clockwise rotation to apply to uploaded image.
      (uri: string) => {  // Is the callBack function of the resized new image URI.
        // Convert base64 URI to File object
        const byteString = atob(uri.split(',')[1]);
        const mimeString = uri.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const resizedFile = new File([blob], file.name, { type: mimeString });
        resolve(resizedFile);
      },
      "base64",  // Is the output type of the resized new image.
    );
  });


  