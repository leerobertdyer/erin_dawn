export interface IProductInfo {
    imageUrl: string;
    title: string;
    description: string;
    price: number;
    tags: string[];
    id: string;
}

export interface IProductToEdit {
    title: string;
    description: string;
    price: number;
    tags: string[];
    disabled: boolean;
    url: string;
    id: string;
    onProductUpdate: (product: {src: string, title: string}) => void;
    onPruductDelete: (url: string) => void;
}

