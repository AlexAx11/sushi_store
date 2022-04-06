import React, {useState} from "react";
import Customer from "../../models/Customer";
import BasketForm from "../library/BasketForm";
import {ReducersType} from "../../redux/store";
import {useSelector} from "react-redux";
import {getCustomerOnUserData} from "../MenuForm";
import {UserData} from "../../services/AuthService";
import Dish from "../../models/Dish";
import {customersService, service} from "../../config/services-config";
import {Dialog, DialogContent, Paper} from "@material-ui/core";
import OrderPage from "./OrderPage";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Order from "../../models/Order";


export function removeDishFromBasket(id: number, customer: Customer): number[] {
    let number = 0
    for(let i=customer.basket.length-1; i>=0; i--){
        if(customer.basket[i] === id && number === 0){
            customer.basket.splice(i, 1);
            number++
        }
    }
    return customer.basket
}

export function getBasketIcon(customer: Customer){
    return <IconButton color="inherit">
        <Badge badgeContent={customer.basket.length} color="secondary">
            <ShoppingBasketIcon />
        </Badge>
    </IconButton>
}
type Props = {
    onCancel?: () => void;
    onSubmit?: () => void;
}

const Basket:React.FC<Props> = (props: Props) => {
    const userData: UserData = useSelector((state: ReducersType) => state.userData)
    const customers: Customer[] = useSelector((state: ReducersType) => state.customers);
    const dishes: Dish[] = useSelector((state: ReducersType) => state.dishes);
    const [customer, setCustomer] = useState<Customer>(getCustomerOnUserData(userData, customers));
    const [openOrderConfirm, setOpenOrderConfirm] = useState<boolean>(false);

    function checkCustomerBasket() {
        let number = 0;
        customer.basket.forEach(async id => {
            if(!dishes.find(dish => (dish.id === id))) {
                customer.basket = removeDishFromBasket(id, customer);
                setCustomer({...customer});
                customersService.updateCustomer(customer.id, customer);
                number++;
            }
        })
    }
    function getDishId(dish: Dish) {
        const res = dishes.filter(d => (d.name === dish.name))
        return res[0].id;
    }
    async function updateOrder(order: Order) {
        customer.basket.length = 0;
        await service.addOrder(order);
        await updateCustomer();
        getBasketForm();
        return '';
    }
    async function addMeal(obj: Object) {
        const dish = obj as Dish;
        const id = getDishId(dish)
        customer.basket.push(id);
        await updateCustomer();
    }
    async function subtractMeal(obj: Object) {
        const dish = obj as Dish;
        const id = getDishId(dish)
        customer.basket = removeDishFromBasket(id, customer)
        await updateCustomer();
    }
    async function updateCustomer(){
        setCustomer({...customer});
        await customersService.updateCustomer(customer.id, customer);
    }
    checkCustomerBasket();

    function getBasketForm() {
        return <BasketForm onCancel={props.onCancel} onSubmit={() => setOpenOrderConfirm(true)}
                            addFn={addMeal} subFn={subtractMeal} customer={customer}/>
    }

    return <React.Fragment>
        {getBasketForm()}
        <Dialog open={openOrderConfirm} scroll='paper' style={{minHeight: '48.5vw'}}>
            <DialogContent >
                <OrderPage customer={customer} onUpdate={updateOrder} onCancel={() => setOpenOrderConfirm(false)}/>
            </DialogContent>
        </Dialog>
    </React.Fragment>
}
export default Basket;