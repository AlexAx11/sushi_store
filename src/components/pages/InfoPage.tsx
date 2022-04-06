import React from "react";
import Typography from "@material-ui/core/Typography";
import useStyles from "../../config/styles";
import {PHONE_NUMBER, TELEPHONE} from "../../config/constants";

const InfoPage:React.FC = () =>{
    const classes = useStyles();

    return <React.Fragment>
        <div className={classes.root}>
            <Typography variant="h5" gutterBottom color="textPrimary">
                About us
            </Typography>
            <Typography className={classes.layout} variant="h6"  style={{fontWeight: "bold"}}>
                <a href={PHONE_NUMBER} itemProp={TELEPHONE} style={{color: 'white'}}>1-800-800-859</a>
            </Typography>
            <Typography className={classes.layout} variant="h6"  style={{fontWeight: "bold"}} color="textPrimary">
                <div className="time" itemProp="openingHours">
                    Mon-Sun 11:00 - 24:00
                </div>
            </Typography>
        </div>
        </React.Fragment>

}
export default InfoPage