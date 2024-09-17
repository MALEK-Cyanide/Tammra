export interface GetAllProducts {
    productionPrice: any;
    productId:number;
    productName: string,
    price: number;
    quantity: number;
    profit: number;
    prodImagePath: string;
    dateAdded:Date;
    dateUpdated:Date,
    rate:number,
    isOnSale : boolean,
    salePrice : number,
    priceAfterSale : number
}