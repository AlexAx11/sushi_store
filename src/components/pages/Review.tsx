import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Customer from "../../models/Customer";
import Order from "../../models/Order";
import Dish from "../../models/Dish";
import {CURRENCY, PCS} from "../../config/constants";
import {useSelector} from "react-redux";
import {ReducersType} from "../../redux/store";
import {getCustomerOnUserData} from "../MenuForm";
import {getNumberOfDishesInOrder} from "../library/BasketForm";

const useStyles = makeStyles((theme) => ({
    listItem: {
        padding: theme.spacing(1, 0),
    },
    total: {
        fontWeight: 700,
    },
    title: {
        marginTop: theme.spacing(2),
    },
}));

const Review: React.FC<{ order: Order , customer: Customer}> = (props) => {
    const dishes: Dish[] = useSelector((state: ReducersType) => state.dishes);
    const addresses = getAddress();
    const products = getProducts();
    const classes = useStyles();
    function getProducts(): number[] {
        let res: number[] = [NaN];
        props.customer.basket.forEach(n => {
            if(!res.find(num => (num===n))){
                res.push(n)
            }
        })
        res.shift();
        return res;
    }
    function getAddress(): string[] {
        return [props.customer.city, props.customer.address];
    }
    function getPrice(dishId: number) :number {
        const dish = dishes.find(d => (d.id === dishId));
        return dish ? dish.price : NaN;
    }
    function getComposition(dishId: number):string {
        const dish = dishes.find(d => (d.id === dishId));
        return dish ? dish.composition : '';
    }
    function getDishName(dishId: number) : string {
        const dish = dishes.find(d => (d.id === dishId));
        return dish ? dish.name : '';
    }
    function getNumberOfDishes(dishId: number):number {
        const dish = dishes.find(d => (d.id === dishId));
        return dish ? getNumberOfDishesInOrder(dish, props.customer.basket) : NaN;
    }
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom color="textPrimary">
                Order summary
            </Typography>
            <List disablePadding>
                {products.map((dishId) => (
                    <ListItem className={getDishName(dishId)} key={dishId}>
                        <ListItemText primary={getDishName(dishId)} secondary={getComposition(dishId)} color="textPrimary"/>
                        <Typography variant="body2" color="textPrimary">{getPrice(dishId) + CURRENCY}</Typography>
                        <Typography variant="body2" color="textPrimary">&nbsp;&nbsp;
                            {getNumberOfDishes(dishId) + PCS}</Typography>
                    </ListItem>
                ))}
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Total"  color="textPrimary"/>
                    <Typography variant="subtitle1" className={classes.total} color="textPrimary">
                        {props.order.sum + CURRENCY}
                    </Typography>
                </ListItem>
            </List>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom className={classes.title} color="textPrimary">
                        Shipping
                    </Typography>
                    <Typography gutterBottom color="textPrimary">{props.customer.name}</Typography>
                    <Typography gutterBottom color="textPrimary">{addresses.join(', ')}</Typography>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
export default Review