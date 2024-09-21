export interface Order {
    orderId:number
    orderNum: number;
    status: string;
    totalAmount: number;
    orderDate: string;
    paymentWay: string;
    phoneNumber:string,
    governorate:string
    city:string
    street:string
    addressDetails:string
}