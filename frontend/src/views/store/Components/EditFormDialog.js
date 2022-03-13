import React from 'react';
import PropTypes from 'prop-types';
// material-ui
import { Typography, Slide, Dialog, AppBar, Toolbar, IconButton, DialogContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export const FormEditDialog = ({ title, onClose, children, open }) => {
  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography color="inherit" sx={{ ml: 2, flex: 1 }} variant="h2" component="div">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ marginHorizontal: 2 }}>{children}</DialogContent>
    </Dialog>
  );
};

FormEditDialog.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  children: PropTypes.node
};
