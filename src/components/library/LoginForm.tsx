import React, {useEffect, useState} from "react";
import {Box, Button, Link, TextField} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import useStyles from "../../config/styles";
import {FACEBOOK, GOOGLE, TWITTER} from "../../config/constants";
import {Dialog, DialogContent} from "@material-ui/core";
import AddressForm from "./AddressForm";
import Customer from "../../models/Customer";
import {authService, customersService, regService} from "../../config/services-config";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://www.linkedin.com/in/alexander-axyanov-8291a71b8/">
                LinkedIn Axyanov Alex
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


export type LoginData = {
    username: string;
    password: string
}
type Props = {
    onSubmit: (loginData: LoginData) => Promise<boolean>;
    passwordErrorMessage?: (password: string) => string;
    onCancel: () => void;
}
const LoginForm: React.FC<Props> = (props) => {
    const[openReg, setOpenReg] = useState<boolean>(false);
    const {onSubmit, passwordErrorMessage} = props;
    const [loginData, setLoginData] = useState<LoginData>({username: '', password: ''})
    const [isValid, setIsValid] = useState<boolean>(false)
    const classes = useStyles();
    async function onSubmitForm(event: any) {
        event.preventDefault();
        const res = await onSubmit(loginData);
        if (!res) {
            alert("Wrong credentials");
        }
        props.onCancel();
    }
    async function onSubmitRegistration(customer: Customer): Promise<string> {
        await regService.registration({email: customer.email, password: customer.password});
        await customersService.addCustomer(customer)
        await authService.login({username: customer.email, password: customer.password});
        props.onCancel();
        return '';
    }
    function onCancel() {
        setLoginData({username: '', password: ''});
        setOpenReg(false);
    }
    async function socialNetworkLogin(networkName: string) {
        const res = await onSubmit({username: networkName, password: ""});
        if(!res) {
            alert("Wrong " + networkName + " credentials");
        }
    }
    function googleLogin() {
        socialNetworkLogin(GOOGLE);
    }
    function facebookLogin() {
        socialNetworkLogin(FACEBOOK);
    }
    function twitterLogin() {
        socialNetworkLogin(TWITTER);
    }

    function handlerChange(event: any) {
        loginData[event.target.name] = event.target.value as string;
        setLoginData({...loginData});
    }

    useEffect(() => {
        function validate(): boolean {
            return !!loginData.username && (!passwordErrorMessage || !passwordErrorMessage(loginData.password));
        }

        setIsValid(validate());
    }, [loginData, passwordErrorMessage])
    function openRegistration(){
        setOpenReg(true);
    }
    return <Container component="main" maxWidth="xs" color="textPrimary">
        <CssBaseline />
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <form onSubmit={onSubmitForm} className={classes.form} color="textPrimary primary" >

        <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Username"
            name="username"
            autoFocus
            error={!loginData.username}
            helperText={!loginData.username && 'username should be defined'}
            onChange={handlerChange}
        />
        <TextField label={'Password'} name={'password'} variant="outlined"
                   margin="normal"
                   type={'password'}
                   required
                   fullWidth
                   error={!(!passwordErrorMessage || !passwordErrorMessage(loginData.password))}
                   onChange={handlerChange}
                   helperText={!!passwordErrorMessage && passwordErrorMessage(loginData.password)}
        />
        <div className={classes.centerPosition}>
        {/*<Button onClick={googleLogin}><img className={classes.imageSize} alt="" src={GOOGLE_IMG}/></Button>*/}
        {/*    <Button onClick={facebookLogin}><img className={classes.imageSize} alt="" src={FACEBOOK_IMG}/></Button>*/}
        {/*    <Button onClick={twitterLogin}><img className={classes.imageSize} alt="" src={TWITTER_IMG}/></Button>*/}
        </div>
        <Button
            color="secondary"
            size="small"
            type="button"
            onClick={openRegistration}
        >
            Registration
        </Button>
             <div>
                 <Button
                     type="submit"
                     fullWidth
                     variant="contained"
                     color="primary"
                     className={classes.submit}
                     disabled={!isValid}
                 >
                     Sign In
                 </Button>
                 <Button type={'reset'}  variant="contained"
                         color="primary">Reset Form</Button>&nbsp;
                 <Button type={'reset'}  variant="contained"
                         color="primary" onClick={props.onCancel}>Cancel</Button>

             </div>
    </form>
        </div>
        <Box mt={4}>
            <Copyright />
        </Box>
        <Dialog open={openReg}>
            <DialogContent>
                <AddressForm onSubmit={onSubmitRegistration} onCancel={onCancel}/>
            </DialogContent>
        </Dialog>
    </Container>
}
export default LoginForm;
