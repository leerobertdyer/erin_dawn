import { IProductInfo } from "../Interfaces/IProduct";

type SortType = 'oldest' | 'newest' | 'category' | 'title' | 'series';

export function sortProducts(products: IProductInfo[], sortBy: SortType = 'newest') {
    return [...products].sort((a, b) => {
        switch (sortBy) {
            case 'category':
                // Handle undefined categories
                const catA = a.category?.toLowerCase() || '';
                const catB = b.category?.toLowerCase() || '';
                return catA.localeCompare(catB);
            case 'title':
                return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
            case 'series':
                return a.series?.toLowerCase().localeCompare(b.series?.toLowerCase() || "") || 0;
            case 'oldest':
                const dateA = a.createdAt?.toDate?.() || new Date(0);
                const dateB = b.createdAt?.toDate?.() || new Date(0);
                return dateA.getTime() - dateB.getTime(); // Oldest first
            case 'newest':
            default:
                const dateA2 = a.createdAt?.toDate?.() || new Date(0);
                const dateB2 = b.createdAt?.toDate?.() || new Date(0);
                return dateB2.getTime() - dateA2.getTime(); // Newest first
        }
    });
}