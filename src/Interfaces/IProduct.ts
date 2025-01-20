export interface IProductInfo {
    imageUrl: string;
    title: string;
    description: string;
    price: number;
    tags: string[];
    id: string;
    order?: number;
    series?: string;
    seriesOrder?: number;
    stripePriceId: string;
    stripeProductId: string;
}
