import React, {useRef, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Collapse,
    Container, Dialog, DialogContent,
    Grid,
    makeStyles,
    Paper
} from "@material-ui/core";
import {useSelector} from "react-redux";
import {ReducersType} from "../redux/store";
import Dish from "../models/Dish";
import {CURRENCY, MENU_FORM} from "../config/constants";
import {UserData} from "../services/AuthService";
import Customer from "../models/Customer";
import {getEmptyDish} from "./DishForm";
import {getEmptyClient} from "./ClientForm";
import {customerToString} from "./pages/Customers";
import ConfirmationDialog from "./library/ConfirmationDialog";
import AddDishForm from "./library/AddDishForm";
import {dishesService} from "../config/services-config";
import {useMediaQuery} from "react-responsive";

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(0),
        paddingBottom: theme.spacing(4),
    },
    gridContainer: {
        justify: 'space-between',
        alignItems: 'flex-start',
    },
    card: {
        height: '90%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMobile: {
        height: '45%',
        width: '93%',
        display: 'flex',
        flexDirection: 'column',
    },
    menu: {
        flexDirection: 'column',
        justify: 'flex-start',
    },
    cards: {
        flexDirection: 'row',
        justify: 'space-between',
        alignItems: 'flex-start',
    },
    cardButton: {
        flexDirection: 'row',
        display: 'flex',
        justify: 'space-around',
        alignItems: 'center',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 0,
    }
}));
export function getCustomerOnUserData(userData: UserData, customers: Customer[]): Customer {
    let res: Customer = getEmptyClient();
    customers.forEach(c => {
        if(c.email === userData.email){
            res = c;
        }
    })
    return res;
}
type Props = {
    customer: Customer;
    userData: UserData;
    onSubmit: (customer: Customer) => Promise<string>;
    openUpdateDish: (obj: Object) => void;
    removeDish: (obj: Object) => void;
}
const MenuForm:React.FC<Props> = (props) => {
    const dishes: Dish[] = useSelector((state: ReducersType) => state.dishes);
    const {customer, userData} = props
    const [open, setOpen] = useState(false)
    const classes = useStyles();
    const menu = MENU_FORM;

    const isDesktopOrLaptop = useMediaQuery({query: '(min-width: 1224px)'})
    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    function addProductToBasket(d: Dish) {
        const dish = d as Dish;
        if(userData.email && dish){
            customer.basket.push(dish.id);
            props.onSubmit(customer);
        }
    }

    function getButton(d: Dish) {
        if(customer.role === 'manager'){
            return <div style={{flexDirection: 'row'}}>
                <Button size="medium" color="primary" onClick={() => props.openUpdateDish(d)}>
                    Edit
                </Button>
                <Button size="medium" color="primary" onClick={() => props.removeDish(d)}>
                    Delete
                </Button>
            </div>
        }else{
            return <Button size="medium" color="primary" onClick={() => userData.email ?
                addProductToBasket(d) : alert('please log in')}>
                Add
            </Button>
        }
    }
    function getClassName() {
        if(isDesktopOrLaptop) {
            return classes.card
        }
        if(isTabletOrMobile) {
            return classes.cardMobile
        }
        return classes.card
    }

    function getDish(nameDish: string): Dish {
        const res = dishes.find(d => (d.fieldMenu === nameDish));
        return res ? res : getEmptyDish();
    }
    function getCard(dishName: string): JSX.Element[] {
        return dishes.map(d => {
            if(d.fieldMenu === dishName){
                return <Grid item xs={6} md={3} spacing={2} className={classes.gridContainer}>
                    <Card className={getClassName()}>
                        <CardMedia
                            className={classes.cardMedia}
                            image={d.image}
                            title={d.name}
                        />
                        <CardContent className={classes.cardContent}>
                            <Typography gutterBottom variant="h5" component="h2">
                                {d.name}
                            </Typography>
                            <Typography>
                                {d.composition}
                            </Typography>
                        </CardContent>
                        <CardActions className={classes.cardButton}>
                            <Typography>
                                {d.price + CURRENCY}
                            </Typography>
                            {(customer.role === 'delivery') || (customer.role === 'cook') ?  <div/> : getButton(d)}
                        </CardActions>
                    </Card>
                </Grid>
            }
            return <div></div>
        })
    }
    return (
        <React.Fragment>
            {menu.map(m => {
                return getDish(m).id ? <Container style={{marginTop:0,padding:0}}>
                    <Grid container key={m} spacing={1} style={{ margin:0 , padding:0}}>
                        <Typography style={{fontSize:'1.5em' , marginLeft:'9px'}} variant="overline"
                                    id={m.toString()} color="textPrimary">{m.toString()}</Typography>
                        <Grid container spacing={2} key={m} item xs={12} className={classes.cards} style={{margin:0 , padding:0}}>
                            {getCard(m)}
                        </Grid>
                    </Grid>
                </Container> : <Typography variant="overline" color="textPrimary">{m.toString()}</Typography>})}
            <Collapse in={open}>
                <Typography component={Paper} align={"center"} style={{
                    backgroundColor: "lightgreen",
                    width: '40%', marginLeft: '30vw'
                }} color="textPrimary" >
                    dish is added
                </Typography>
            </Collapse>
        </React.Fragment>
    );
}
export default MenuForm