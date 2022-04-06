export default interface Order {
    id: number;
    sum: number;
    date: Date|null|string;
    menu: string[];
    status: string;
    customerID: number[];//change

}