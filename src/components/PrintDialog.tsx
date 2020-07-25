import React from 'react';
import { Dialog } from '@material-ui/core'

interface Props {
  open: boolean,
  onClose: () => void
}

const PrintDialog = (props: Props) => {
  return (
    <Dialog open={props.open} onClose={ (e, r) => props.onClose() } maxWidth='lg' fullWidth={true} >
      <h1>Print Course</h1>
      Printing options will go here!
    </Dialog>
  );
};

export default PrintDialog;
