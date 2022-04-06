import React from 'react';
import {authService} from "../../config/services-config";
import useStyles from "../../config/styles";
import {Button} from "@material-ui/core";
type Props = {
    onBack?: () => void;
}
const Logout:React.FC<Props> = (props: Props) =>{
    const classes = useStyles();
    function logoutFn(){
        authService.logout();
        if(props.onBack){
            props.onBack();
        }
    }
    return <div className={classes.centerPosition}>
        <Button  variant="contained"
                 color="primary"
                 onClick={()=>logoutFn()}>
            Logout</Button>
        <Button  variant="contained"
                 color="primary"
                 onClick={props.onBack}>
            Back</Button>
    </div>
}
export default Logout;
