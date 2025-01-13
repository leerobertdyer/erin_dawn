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
}

export interface IProductToEdit {
    title: string;
    description: string;
    price: number;
    tags: string[];
    url: string;
    id: string;
    series?: string;
    seriesOrder?: number;
}

