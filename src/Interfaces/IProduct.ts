export interface IProductInfo {
    imageUrl: string;
    title: string;
    description: string;
    price: number;
    tags: string[];
    id: string;
    order?: number;
    series?: string;
    itemName: string;
    itemOrder?: number;
    stripePriceId: string;
    stripeProductId: string;
    category?: string;
    size: string;
    dimensions: string;
    createdAt?: string;
}
