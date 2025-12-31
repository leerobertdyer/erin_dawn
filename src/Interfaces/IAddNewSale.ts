export default interface IAddNewSale {
    customerName: string;
    shippingAddressString: string;
    sessionId: string;
    isShipped: boolean;
    grandTotal: number;
    itemsSold: string[]; 
}