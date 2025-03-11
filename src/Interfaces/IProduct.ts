import { Timestamp } from "firebase/firestore";
import { IGeneralPhoto } from "./IPhotos";

// In IProduct.ts
export interface INewProduct {
    title: string;
    description: string;
    price: number;
    category?: string;
    size: string;
    series: string;
    dimensions: string;
    stripePriceId: string;
    stripeProductId: string;
    photos: IGeneralPhoto[];
    hidden: boolean;
    sold: boolean;
}

// Full product includes id
export interface IProductInfo extends INewProduct {
    id: string;
    createdAt?: Timestamp;
}