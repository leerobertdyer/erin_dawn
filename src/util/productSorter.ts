import { IProductInfo } from "../Interfaces/IProduct";

type SortType = 'oldest' | 'newest' | 'category' | 'title' | 'series';

/**
 * Converts a Firebase Timestamp or date string to milliseconds since epoch
 * @param dateValue - Firebase Timestamp object or date string
 * @returns number of milliseconds since epoch
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDateInMillis(dateValue: any): number {
  if (!dateValue) return 0;
  
  // Check if it's a Firebase Timestamp with toDate method
  if (typeof dateValue === 'object' && dateValue.toDate instanceof Function) {
    return dateValue.toDate().getTime();
  }
  
  // Check if it's a Firebase Timestamp with seconds property
  if (typeof dateValue === 'object' && 'seconds' in dateValue) {
    return dateValue.seconds * 1000;
  }
  
  // Handle regular date strings
  if (dateValue) {
    return Date.parse(dateValue.toString());
  }
  
  return 0;
}

export function sortProducts(products: IProductInfo[], sortBy: SortType = 'newest') {
    return [...products].sort((a, b) => {
        switch (sortBy) {
            case 'category': {
                // Handle undefined categories
                const catA = a.category?.toLowerCase() || '';
                const catB = b.category?.toLowerCase() || '';
                return catA.localeCompare(catB);
            }
            case 'title':
                return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
            case 'series':
                return a.series?.toLowerCase().localeCompare(b.series?.toLowerCase() || "") || 0;
            case 'oldest':
                return getDateInMillis(a.createdAt) - getDateInMillis(b.createdAt); // Oldest first
            case 'newest':
            default:
                return getDateInMillis(b.createdAt) - getDateInMillis(a.createdAt); // Newest first
        }
    });
}