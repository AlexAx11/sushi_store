import React from "react";
import Typography from "@material-ui/core/Typography";
import Order from "../../models/Order";

const OrderAccepted: React.FC<{ order: Order }> = (props) =>{

    return <React.Fragment>
            <Typography variant="h5" gutterBottom color="textPrimary">
                Thank you for your order.
            </Typography>
            <Typography variant="subtitle1" color="textPrimary">
                Your order number is {props.order.id}. You can track the order status in your personal account.
            </Typography>
        </React.Fragment>

}
export default OrderAccepted