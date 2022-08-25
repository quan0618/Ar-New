import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

export default function ArToast(props) {

  return (
    <div> <Snackbar open={props.open} autoHideDuration={props.autoHideDuration === undefined ? 3000 : props.autoHideDuration} onClose={()=>props.handleClose()
    } >
    <Alert
       severity= {props.severity}>
     {props.message}
    </Alert>
  </Snackbar></div>
  )
}
