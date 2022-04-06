import React, {useRef, useState} from 'react';
import clsx from 'clsx';
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import MenuForm, {getCustomerOnUserData} from "../MenuForm";
import Customer from "../../models/Customer";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {getDish} from "../library/BasketForm";
import Dish from "../../models/Dish";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {UserData} from "../../services/AuthService";
import {useSelector} from "react-redux";
import {ReducersType} from "../../redux/store";
import {customersService, dishesService} from "../../config/services-config";
import ConfirmationDialog from "../library/ConfirmationDialog";
import {Button, Dialog, DialogContent} from "@material-ui/core";
import AddDishForm from "../library/AddDishForm";
import {getEmptyDish} from "../DishForm";
import {useMediaQuery} from "react-responsive";

function handleButtonClick(str: string) {
    const element = document.getElementById(str);
    if(element){
        element.scrollIntoView({block: "start", behavior: "smooth"});
    }
}

const THEME = createMuiTheme({
    typography: {
        "fontFamily": 'Cursive ,sans-serif',
        "fontSize": 15,
        "fontWeightLight": 300,
        "fontWeightRegular": 400,
        "fontWeightMedium": 500
    }
});
const listItems = (
    <div>
        <MuiThemeProvider theme={THEME}>
            <ListItem button onClick={() => handleButtonClick('first-dishes')}>
                <ListItemText primary="First dishes"/>
            </ListItem>
            <ListItem button onClick={() => handleButtonClick('rolls')}>
                <ListItemText primary="Rolls"/>
            </ListItem>
            <ListItem button onClick={() => handleButtonClick('baked rolls')}>
                <ListItemText primary="Baked rolls"/>
            </ListItem>
            <ListItem button onClick={() => handleButtonClick('sushi')}>
                <ListItemText primary="Sushi"/>
            </ListItem>
            <ListItem button onClick={() => handleButtonClick('drinks')}>
                <ListItemText primary="Drinks"/>
            </ListItem>
        </MuiThemeProvider>
    </div>
);
const drawerWidth = 165;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    divs_next: {
        //margin: '2px',
    },
    toolbar: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "center"
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 8px',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        marginTop: "72px",
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowY:'hidden',
        height: 'auto',
        //backgroundColor: 'white'
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarHeader: {
        position: 'relative'
    },
    centerPosition: {
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
        "text-align":"justify"
    },
    layout: {
        width: 'auto',
        justifyContent: "center",
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        marginTop: "2vw",
        flexGrow: 1,
        height: 'auto',
        overflow: 'auto',
        overflowX:'hidden'
    },
    contentMobile: {
        marginTop: "2vw",
        flexGrow: 1,
        height: 'auto',
        overflow: 'auto',
        overflowX:'hidden',
        zoom: 0,
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
}));
export function getOrderSum(cust: Customer, dishes: Dish[]): number {
    let res: number = 0;
    cust.basket.forEach(n => {
        const price = getDish(n, dishes).price;
        res += +price;
    })
    return res;
}

const HomePage: React.FC = () => {
    const userData: UserData = useSelector((state: ReducersType) => state.userData);
    const customers: Customer[] = useSelector((state: ReducersType) => state.customers);
    //const withScreen: number | any = useSelector((state: ReducersType) => state.width);
    const customer = getCustomerOnUserData(userData, customers);
    const classes = useStyles();
    const dish_ = useRef<Dish>();
    const [dish, setDish] = useState<Dish|null>(null);
    const [title, setTitle] = useState<string>('');
    const [text, setText] = useState<string>('');
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [openForm, setOpenForm] = useState<boolean>(false);

    const isDesktopOrLaptop = useMediaQuery({query: '(min-width: 1224px)'})
    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    async function updateCustomer(customer: Customer):Promise<string> {
        await customersService.updateCustomer(customer.id, customer);
        return '';
    }
    function removeDish(obj: object) {
        dish_.current = obj as Dish;
        setTitle("You are going to delete !");
        setText("Dish with id " + dish_.current?.id);
        setOpenConfirm(true);
    }
    function openUpdateDish(obj: object) {
        setDish(obj as Dish);
        setTitle("You are going to update !");
        setText("Dish with id " + (obj as Dish).id);
        setOpenConfirm(true);
    }

    async function imageUpload(img: any): Promise<string> {
        return await dishesService.addImage(img);
    }

    async function handleCloseConfirm(res: boolean) {
        if (res) {
            if (dish) {
                setOpenForm(true);
            } else if (dish_.current) {
                await dishesService.removeDish(dish_.current.id);
            }
        }
        setOpenConfirm(false);
    }
    async function addDish(dish: Dish): Promise<string> {
        await dishesService.addDish(dish);
        onCancel();
        return '';
    }
    async function updateDish(dish: Dish):Promise<string> {
        await dishesService.updateDish(dish.id, dish);
        onCancel();
        return '';
    }

    function onCancel() {
        setDish(null);
        setOpenForm(false);
    }

    function getMenu() {
        if(isDesktopOrLaptop) {
            return <main className={classes.content} style={{marginTop: '76px'}}>
                <MenuForm customer={customer} onSubmit={updateCustomer} openUpdateDish={openUpdateDish}
                          removeDish={removeDish} userData={userData ? userData :
                    {email: '', isAdmin: false, username: ""}}/>
            </main>
        }
        if(isTabletOrMobile) {
            return <main className={classes.contentMobile} style={{marginTop: '60px'}}>
                <MenuForm customer={customer} onSubmit={updateCustomer} openUpdateDish={openUpdateDish}
                          removeDish={removeDish} userData={userData ? userData :
                    {email: '', isAdmin: false, username: ""}}/>
            </main>
        }
        if(isBigScreen) {
            return <main className={classes.content} style={{marginTop: '76px'}}>
                <MenuForm customer={customer} onSubmit={updateCustomer} openUpdateDish={openUpdateDish}
                          removeDish={removeDish} userData={userData ? userData :
                    {email: '', isAdmin: false, username: ""}}/>
            </main>
        }
    }
    return (
        <React.Fragment>
            <div className={classes.root}>
                <CssBaseline />
                {isDesktopOrLaptop ? <div>
                    <Drawer
                        variant="permanent"
                        classes={{paper: clsx(classes.drawerPaper),}}>
                        <Divider/>
                        <List style={{margin: 0, padding: 0}}>{listItems}</List>
                    </Drawer>
                    {customer.role === 'manager' ? <Button variant="contained" color="primary" size={"small"}
                                                           style={{marginLeft: '2.5vw', marginTop: '1vw'}}
                                                           onClick={() => setOpenForm(true)}>Add dish</Button> : <div/>}
                </div> : <div/>}
                {getMenu()}
            </div>
            <ConfirmationDialog open={openConfirm} handleClose={handleCloseConfirm}
                                title={title} text={text}/>
            <Dialog open={openForm} maxWidth='xs'>
                <DialogContent >
                    <AddDishForm imageUpload={imageUpload}
                                 onSubmit={dish ? updateDish : addDish} onCancel={onCancel}
                                 dish={dish ? dish : getEmptyDish()}/>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
export default HomePage