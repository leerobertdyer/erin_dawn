export default interface IAddNewSale {
    customerName: string;
    shippingAddressString: string;
    sessionId: string;
    isShipped: boolean;
    totalSales: number;
    itemsSold: string[]; 
}