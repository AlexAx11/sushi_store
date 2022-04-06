import React from "react";
import LoginForm, {LoginData} from "../library/LoginForm";
import {authService} from "../../config/services-config";
type Props = {
    onCancel?: () => void;
}
const Login:React.FC<Props> = (props) =>  {

    async function onSubmit(loginD: LoginData): Promise<boolean> {
       return await authService.login({username: loginD.username, password: loginD.password});
    }
    function errorMessage(password: string): string {
        return password.length < 6 ? 'password can\'t be less than 6 symbols' : ''
    }
     return <LoginForm  onSubmit={onSubmit} onCancel={() => props.onCancel ? props.onCancel() : null}
                        passwordErrorMessage={errorMessage}>
    </LoginForm>

}
export default Login;
