import {makeStyles} from "@material-ui/core/styles";
import {transform} from "typescript";


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        minHeight: '100',
        maxHeight: '100',
        overflowX: "hidden",
        overflowY: "hidden"
    },
    appBar: {
        position: 'absolute'
    },
    appBarMobile: {
        position: 'absolute',
        overflowX: "hidden",
    },
    divs_next: {
        margin: '2px',
    }
    ,
    container: {
        display: 'flex',
        flexDirection: 'row'
    },
    border: {
        display:'center',
        //   textAlign:'center',
        position:'relative',
        fontSize: '1em',
        //   border: '1px solid black',
        //  height:'1.9em',
        borderBottom: '3px solid rgba(227,227,227,.54)',
        transition: 'all .15s ease',
        textDecoration: 'none',
        padding: '10px',
        //  margin:'0',
        background: '#ebf8db',
        color:'black',
        '&:hover': {
            transform: 'scale(1.1)'
        },
    },
    navbarDisplayFlex: {
        display: `flex`,
        justifyContent: `space-between`
    },
    navDisplayFlex: {
        display: `flex`,
        justifyContent: `space-between`
    },
    linkText: {
        textDecoration: `none`,
        textTransform: `uppercase`,
        color: `black`
    },
    layoutMobile: {
        flexGrow: 1,
        alignSelf: 'flex-end'
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        }
    },
    toolbar: {
        minHeight: 128,
        alignItems: 'flex-start',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(2),
    },
    layoutBasket: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper_form: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(3),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: theme.spacing(3, 0, 5),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    formBasket: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: "left",
        justifyContent: "center"
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    imageSize: {
        width:"5vw",

    },
    ProfilePageCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center"
    },
    centerPosition: {
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
        "text-align":"justify"
    },
    centerPositionOrders: {
        marginLeft: '8vw'
    },
    centerMarginLeftRight: {
        display: 'block',
        'margin-left': 'auto',
        'margin-right': 'auto'
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    fieldContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
},
    column: {
        display: 'flex',
        flexDirection: 'column',
    },
    FormStyle: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: "left",
        justifyContent: "center"
    },
    field: {
        marginRight: '3vw'
    },
    MenuForm: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '5vw'
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column'
    }
}));
export default useStyles;