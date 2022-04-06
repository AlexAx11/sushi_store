import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
type Props = {
  open: boolean;
  handleClose: (res: boolean)=>void;
  title: string;
  text: string

}
const ConfirmationDialog: React.FC<Props> = (props) => {
    const {open, handleClose, title, text} = props;

    return (
        <div>

            <Dialog
                open={open}

                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" color="textPrimary">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" color="textPrimary">
                        {text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleClose(true)} color="primary" autoFocus>
                       Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default ConfirmationDialog;
