import React, {useState} from 'react';
import useStyles from "../../config/styles";
import Customer from "../../models/Customer";
import {Button} from "@material-ui/core";
import MyTableBasket, {HeaderDefinition} from "./MyTableBasket";
import {AddBox, IndeterminateCheckBox} from "@material-ui/icons";
import Dish from "../../models/Dish";
import {useSelector} from "react-redux";
import {ReducersType} from "../../redux/store";
import {getOrderSum} from "../pages/HomePage";
import Typography from "@material-ui/core/Typography";
import {CURRENCY} from "../../config/constants";

type Props = {
    onSubmit?: () => void;
    onCancel?: () => void;
    customer: Customer;
    addFn: (obj: Object) => void;
    subFn: (obj: Object) => void;
}

export function getDish(id: number, dishes: Dish[]): Dish {
    const res = dishes.filter(m => (m.id === +id));
    return res[0];
}

export function getNumberOfDishesInOrder(dish: Dish, basket: number[]): number {
    const res = basket.filter(id => (id === dish.id));
    return res.length;
}

const BasketForm: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const customer = props.customer;
    const dishes: Dish[] = useSelector((state: ReducersType) => state.dishes);
    const [basket, setBasket] = useState<number[]>(customer.basket ? customer.basket : [])
    const orderSum = getOrderSum(customer, dishes)

    function getBasketDishImage(string: string[]) {
        const url = string.toString()
        return <img width='70' height='50' src={url}/>
    }

    function getHeaders(): Map<string, HeaderDefinition> {
        return new Map<string, HeaderDefinition>([
            ['name',{displayName: ''}],
            ['image',{displayName: ''}],
            ['composition',{displayName: ''}],
            ['price',{displayName: ''}],
            ['number',{displayName: '', align: 'center'}],
        ])
    }

    function getOrderDetails(): Object[] {
        const res = new Array();
        const idData: number[] = [];
        basket.forEach(id => {
            if(!idData.find(idD => (idD===id))){
                idData.push(id)
                const meal = getDish(id, dishes);
                let resObject = new Object()
                resObject['name'] = meal.name;
                resObject['composition'] = meal.composition;
                resObject['image'] = meal.image;
                resObject['price'] = meal.price;
                resObject['number'] = getNumberOfDishesInOrder(meal, basket);
                res.push(resObject);
            }
        });
        return res;
    }

    // async function addMeal(obj: Object) {
    //     //obj - not Dish. This object created in 68
    //     const dish = obj as Dish;
    //     const id = getDishId(dish)
    //     customer.basket.push(id);
    //     setCustomer({...customer});
    //     await customersService.updateCustomer(customer.id, customer);
    // }
    // async function subtractMeal(obj: Object) {
    //     //obj - not Dish. This object created in 68
    //     const dish = obj as Dish;
    //     const id = getDishId(dish)
    //     customer.basket = removeDishFromBasket(id, customer)
    //     setCustomer({...customer});
    //     await customersService.updateCustomer(customer.id, customer);
    // }

    return <React.Fragment>
        <div  style={{marginTop:'7vw'}} >
            <Typography variant="h5"  noWrap aria-valuetext={'3em'} className={classes.centerPosition} color="textPrimary" >
                {orderSum > 0 ? orderSum + " " + CURRENCY : "Bag is empty"}
            </Typography >
                <div className={classes.centerPosition}>
                    <MyTableBasket width='70vw' headers={getHeaders()} objectName="image" objectFn={getBasketDishImage}
                                   data={getOrderDetails()} actions={[{icon: <AddBox/>, actionFn: props.addFn},
                        {icon: <IndeterminateCheckBox/>, actionFn: props.subFn}]}/>
                </div>
            <br/>
                <div style={{position:'relative'}}>
                    {orderSum > 0 ? <Button variant="contained" color="primary" onClick={props.onSubmit}
                                            style={{
                                                margin: '0',
                                                position: 'absolute',
                                                left: '50%',
                                                // -ms-transform: 'translate(-50%, -50%)',
                                                transform: 'translate(-39%, -3%)'
                                            }
                                            }>Order</Button>
                        : <div/>}
                </div>
        </div>
    </React.Fragment>
}
export default BasketForm;

