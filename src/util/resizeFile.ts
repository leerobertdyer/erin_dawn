import Resizer from "react-image-file-resizer";

interface ResizeOptions {
  maxWidth: number;
  maxHeight: number;
  quality?: number;
  maintainAspectRatio?: boolean;
}

export const resizeFile = (file: File, options: ResizeOptions) =>
  new Promise<File>((resolve) => {
    // First, get the original image dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      
      let targetWidth = options.maxWidth;
      let targetHeight = options.maxHeight;
      
      if (options.maintainAspectRatio !== false) {
        const aspectRatio = img.width / img.height;
        
        // Calculate dimensions that fit within maxWidth/maxHeight while maintaining aspect ratio
        if (img.width > img.height) {
          targetWidth = options.maxWidth;
          targetHeight = Math.round(options.maxWidth / aspectRatio);
          
          if (targetHeight > options.maxHeight) {
            targetHeight = options.maxHeight;
            targetWidth = Math.round(options.maxHeight * aspectRatio);
          }
        } else {
          targetHeight = options.maxHeight;
          targetWidth = Math.round(options.maxHeight * aspectRatio);
          
          if (targetWidth > options.maxWidth) {
            targetWidth = options.maxWidth;
            targetHeight = Math.round(options.maxWidth / aspectRatio);
          }
        }
      }

      Resizer.imageFileResizer(
        file,
        targetWidth,
        targetHeight,
        "JPEG",
        options.quality || 85, // Better default quality
        0,
        (uri: string) => {
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
        "base64",
      );
    };
    
    img.src = objectUrl;
  });