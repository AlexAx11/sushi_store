import React, {useState} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Review from './Review';
import useStyles from "../../config/styles";
import OrderAccepted from "../library/OrderAccepted";
import Order from "../../models/Order";
import {useSelector} from "react-redux";
import {ReducersType} from "../../redux/store";
import Customer from "../../models/Customer";
import {getDish} from "../library/BasketForm";
import Dish from "../../models/Dish";
import {getOrderSum} from "./HomePage";
function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
type Props = {
    onCancel?: () => void;
    customer: Customer;
    onUpdate: (order: Order) => void;
}
const OrderPage: React.FC<Props> = (props: Props) =>{
    const {customer} = props;
    const orders: Order[] = useSelector((state: ReducersType) => state.orders);
    const dishes: Dish[] = useSelector((state: ReducersType) => state.dishes);
    const steps = ['Review your order', 'Order is accepted'];
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0)
    const [order, setOrder] = useState<Order>(getOrder())

    function getOrder(): Order {
        return {id: getOrderId(), sum: getOrderSum(customer, dishes), menu: getMenu(),
            customerID: getCustomerId(), status: 'order', date: getDate() }//change

    }
    function getCustomerId(): number[]{  //change
        return [customer.id];
    }
    function getOrderId(): number{
        const number = orders.length > 0 ? orders[orders.length - 1].id + 1 : 1000;
        return number;
    }
    function getMenu(): string[] {
        const res: string[] = [''];
        customer.basket.forEach(n => {
            const dishName = getDish(n, dishes).name;
            res.push(dishName);
        })
        res.shift();
        return res;
    }

    function getDate() {
        return new Date();
    }

    const handleNext = async () => {
        setActiveStep(activeStep + 1);
        if (activeStep === steps.length - 1) {
            closeForm();
            setActiveStep(0);
            await props.onUpdate(order);
        }
    };

    const handleBack = () => {
        activeStep > 0 && setActiveStep(activeStep - 1);
        if(activeStep===0){
            closeForm()
        }
    };
    function closeForm() {
        if(props.onCancel){
            props.onCancel()
        }
    }

    function getStepContent(activeStep: number) {
        switch (activeStep) {
            case 0:
                return <Review order={order} customer={customer}/>;
            case 1:
                return <OrderAccepted order={order}/>;
            default:
                throw new Error('Unknown step');
        }
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <main className={classes.layout}>
                <Paper className={classes.paper_form}>
                    <Typography component="h1" variant="h5" align="center" color="textPrimary">
                        Your order №{order.id}
                    </Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <React.Fragment>
                        <React.Fragment>
                            {getStepContent(activeStep)}
                            <div className={classes.buttons}>
                                {activeStep === steps.length - 1 ? <div/> :
                                    <Button onClick={handleBack} className={classes.button} color="primary">
                                    Back
                                </Button>}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    className={classes.button}
                                >
                                    {activeStep === steps.length - 1 ? 'Exit' : 'Next'}
                                </Button>
                            </div>
                        </React.Fragment>
                    </React.Fragment>
                </Paper>
                {/*<Copyright />*/}
            </main>
        </React.Fragment>
    );
}
export default OrderPage