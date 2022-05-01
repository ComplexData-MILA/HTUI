import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Recommendations from './Recommendations';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs(props) {
  const { openDialog, handleClickClose, handleClickOpen,
    callback, apiHost, classes, theme, seedNodes
  } = props;

  const [selectedRows, setSelected] = useState([])
  const handleSave = () => {
    console.log(selectedRows)
    callback(selectedRows)
    handleClickClose()
  }

  return (
    <div>
      <BootstrapDialog
        onClose={handleClickClose}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
        // sx={{width: 300}}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClickClose} sx={{width: 400}}>
          Modal title
        </BootstrapDialogTitle>
        <DialogContent dividers>
        <Recommendations 
          callback={callback}
          apiHost={apiHost}
          classes={classes}
          theme={theme}
          seedNodes={seedNodes}
          setSelected={setSelected}
        />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSave}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
