import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { IProductInfo } from '../../Interfaces/ProductImage';
import { db } from '../../firebase/firebaseConfig';

export default function PhotosByTag({ tag }: { tag: string }) {
    const [photos, setPhotos] = useState<IProductInfo[]>([]);

    useEffect(() => {
        async function fetchPhotos() {
            const q = query(collection(db, "photos"), where("tags", "array-contains", tag));
            const querySnapshot = await getDocs(q);
            const photosData = querySnapshot.docs.map(doc => doc.data());
            setPhotos(photosData as IProductInfo[]);
        }

        fetchPhotos();
    }, [tag]);

    return (
        <div className="photo-gallery">
            {photos.map((photo, index) => (
                <div key={index} className="photo-item">
                    <img src={photo.imageUrl} alt={photo.title} />
                    <h2>{photo.title}</h2>
                    <p>{photo.description}</p>
                    <p>Price: ${photo.price}</p>
                </div>
            ))}
        </div>
    );
}