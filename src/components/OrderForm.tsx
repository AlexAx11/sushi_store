import React, {useEffect, useRef, useState} from "react";
import {
    Button,
    Paper,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from "@material-ui/core";
import useStyles from "../config/styles";
import Order from "../models/Order";
import {ORDER_STATUSES, ORDER_STATUSES_COOK, ORDER_STATUSES_DELIVERY} from "../config/constants";
import Customer from "../models/Customer";


type Props = {
    onSubmit: (ord: Order) => Promise<string>;
    order?: Order;
    onCancel?: () => void;
    customer?: Customer
}

/**
 * Gets empty order record
 */
export function getEmptyOrder(): Order {
    return {
        id:0,
        sum:0,
        date:'',
        status: '',
        menu: [''],
        customerID: []  //change
    };
}

const OrderForm: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const [order, setOrder] = useState<Order>(
        props.order ? {...props.order} : getEmptyOrder());
    const [isValid, setValid] = useState<boolean>(false);
    const [open, setOpen] = useState(false)
    const timeId = useRef<any>();

    async function onSubmit(event: any) {
        event.preventDefault();
        const errorMessage: string = await props.onSubmit(order);
        if (errorMessage) {
            alert(errorMessage);
        } else {
            onReset();
            setOpen(true);
            timeId.current = setTimeout(() => setOpen(false), 3000)
        }
    }
    function onReset() {
        setOrder(getEmptyOrder());
    }

    /**
     * converts field value to corresponding strict type
     * @param field
     */
    function getFieldValue(field: any): any {
        return field.type === 'number' ? +field.value : field.value;
    }

    /**
     * Field input handler. Gets field value and puts to corresponding order field
     * @param event
     */
    const handleInput = (event: any) => {
        const name: string = event.target.name;
        order[name] = getFieldValue(event.target);
        setOrder({...order});
    }


    /**
     *  Validates fields for enabling/disabling Submit button
     */
    useEffect(() => {
        const validate = (): boolean => {
            return order.status !== '';
        }

        setValid(validate());
        return ()=>clearTimeout(timeId.current);
    }, [order]);

    function getMenuItem() {
        if(props.customer){
            return  props.customer?.role === 'delivery' ?
                ORDER_STATUSES_DELIVERY.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>) :
                ORDER_STATUSES_COOK.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)
        }else{
            return ORDER_STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)
        }
    }

    return <React.Fragment>
        <br/>
        <Paper>
            <form onSubmit={onSubmit} onReset={onReset} className={classes.FormStyle}>
                <Typography component="h1" variant="h4" align="center" color="textPrimary">
                    Order № {order.id}
                </Typography>
            <br/>
                <FormControl>
                    <InputLabel required error={!order.status}>Status</InputLabel>
                    <Select name={"status"}
                            value={order.status}
                            onChange={handleInput}
                    >
                        {getMenuItem()}
                    </Select>
                </FormControl>
                <div>
                    <Button disabled={!isValid} variant="contained" color="primary"
                            type={'submit'}>Submit</Button>

                    {props.onCancel ? <Button variant="contained" color="primary"
                                              onClick={props.onCancel}>Cancel</Button> :
                        <Button variant="contained" color="primary"
                                type={'reset'}>Reset</Button>}
                </div>
            </form>
        </Paper>


    </React.Fragment>
}
export default OrderForm;

