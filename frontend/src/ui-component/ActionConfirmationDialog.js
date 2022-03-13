import PropTypes from 'prop-types';
import { DialogTitle, DialogActions, Dialog, DialogContent, DialogContentText, Button, Typography } from '@mui/material';

export const ActionConfirmationDialog = ({ data, handleClose, open, title, description, cancelText, confirmText }) => {
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      onClose={() => handleClose('cancel')}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Typography variant="h3">{title}</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText id="alert-dialog-description" style={{ whiteSpace: 'pre-line' }}>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {cancelText && (
          <Button onClick={() => handleClose('cancel')} color="inherit" value="cancel">
            {cancelText}
          </Button>
        )}
        <Button onClick={() => handleClose('confirm', data)} value="confirm">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ActionConfirmationDialog.propTypes = {
  data: PropTypes.any,
  // (type, data) => void, where type = 'cancel' | 'confirm'
  handleClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  confirmText: PropTypes.string.isRequired
};
