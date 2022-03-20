import React from 'react';
import PropTypes from 'prop-types';
// material-ui
import { Typography, Slide, Dialog, AppBar, Toolbar, IconButton, DialogContent, DialogActions, Paper, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';

const FileUploadConfig = {
  accept: 'text/csv, application/vnd.ms-excel,',
  maxFiles: 1,
  maxSize: 1000000,
  multiple: false
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const FileUploadDialog = ({ onClose, open }) => {
  const theme = useTheme();
  const [errorMsg, setErrorMsg] = React.useState('');
  const [file, setFile] = React.useState();

  const onDrop = React.useCallback((acceptedFiles, rejections) => {
    acceptedFiles.forEach((file) => {
      if (file.name.endsWith('.csv')) {
        setFile(file);
        setErrorMsg('');
      } else {
        setErrorMsg('Please select a valid .csv file');
      }
    });
    rejections.forEach((rejected) => {
      const errorCode = rejected.errors[0].code;
      if (errorCode === 'file-invalid-type') {
        setErrorMsg('Please select a valid .csv file');
      } else if (errorCode === 'file-too-large') {
        setErrorMsg(`Maximum allowable size: ${FileUploadConfig.maxSize / 1000000} MB`);
      }
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'text/csv, application/vnd.ms-excel,',
    maxFiles: 1,
    maxSize: 2000000,
    multiple: false,
    onDrop
  });

  const handleFileUpload = () => {
    if (errorMsg) return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography color="inherit" sx={{ ml: 2, flex: 1 }} variant="h2" component="div">
            Upload CSV
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent dividers>
        <Paper {...getRootProps()} sx={{ height: 200, width: 480 }}>
          <div
            style={{
              display: 'flex',
              border: `2px dashed ${theme.palette.grey[500]}`,
              height: 170,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <input {...getInputProps()} />
            <p>Drag 'n' drop a product csv file, or click to select it</p>
          </div>
          <p style={{ color: errorMsg ? theme.palette.error.main : 'inherit' }}>{errorMsg ? errorMsg : file ? file.name : ''}</p>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" value="cancel">
          Cancel
        </Button>
        <Button onClick={handleFileUpload} value="confirm">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

FileUploadDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};
