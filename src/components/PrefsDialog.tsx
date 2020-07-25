import React from 'react';
import { Dialog } from '@material-ui/core'

interface Props {
  open: boolean,
  onClose: () => void
}

const PrefsDialog = (props: Props) => {
  return (
    <Dialog open={props.open} onClose={ (e, r) => props.onClose() } maxWidth='lg' fullWidth={true} >
      <h1>Preferences</h1>
      Prefs will go here!
    </Dialog>
  );
};

export default PrefsDialog;
