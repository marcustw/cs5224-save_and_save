import PropTypes from 'prop-types';

// material-ui
import {
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  TextField,
  MenuItem,
  Select,
  Radio
} from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

export const FormikTextInput = ({
  errors,
  handleBlur,
  handleChange,
  touched,
  values,
  label,
  field,
  theme,
  fullWidth,
  formControlStyle = {},
  transform,
  setFieldValue,
  ...inputProps
}) => {
  return (
    <FormControl
      fullWidth={fullWidth}
      error={Boolean(touched[field] && errors[field])}
      sx={{ ...theme.typography.customInput, ...formControlStyle }}
    >
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        id={`outlined-adornment-${field}`}
        value={values[field]}
        name={field}
        onBlur={handleBlur}
        onChange={(event) => {
          if (transform) {
            const value = transform(event.target.value);
            setFieldValue(field, value);
            return;
          } else {
            handleChange(event);
          }
        }}
        {...inputProps}
      />
      {touched[field] && errors[field] && (
        <FormHelperText error id={`standard-weight-helper-text--${field}`}>
          {errors[field]}
        </FormHelperText>
      )}
    </FormControl>
  );
};

FormikTextInput.propTypes = {
  // formik
  errors: PropTypes.object,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  touched: PropTypes.object,
  values: PropTypes.object,
  setFieldValue: PropTypes.func,
  // form value
  label: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  // consit fo theme.typography.customInput to style the input
  theme: PropTypes.any,
  fullWidth: PropTypes.bool,
  formControlStyle: PropTypes.object,
  // use to transform value from input before pass to Formik value
  transform: PropTypes.func
};

export const FormikSelectInput = ({
  errors,
  handleBlur,
  touched,
  values,
  label,
  field,
  theme,
  fullWidth,
  formControlStyle = {},
  selectSx,
  menuItems
}) => {
  const labelId = `${field}-select-label`;
  return (
    <FormControl
      fullWidth={fullWidth}
      error={Boolean(touched[field] && errors[field])}
      sx={{ ...theme.typography.customInput, ...formControlStyle }}
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        name={field}
        onBlur={handleBlur}
        sx={selectSx}
        autoWidth={false}
        labelId={labelId}
        label={label}
        id={field}
        value={values[field]}
      >
        {menuItems.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {touched[field] && errors[field] && (
        <FormHelperText error id={`standard-weight-helper-text--${field}`}>
          {errors[field]}
        </FormHelperText>
      )}
    </FormControl>
  );
};

FormikSelectInput.propTypes = {
  // formik
  errors: PropTypes.object,
  handleBlur: PropTypes.func,
  touched: PropTypes.object,
  values: PropTypes.object,
  setFieldValue: PropTypes.func,
  // form value
  label: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  // consit fo theme.typography.customInput to style the input
  theme: PropTypes.any,
  fullWidth: PropTypes.bool,
  formControlStyle: PropTypes.object,
  // for Mui Select Sx styling customization
  selectSx: PropTypes.object,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string
    })
  )
};

export const FormikDatePicker = ({
  errors,
  handleBlur,
  touched,
  values,
  setFieldValue,
  label,
  field,
  theme,
  fullWidth,
  formControlStyle = {}
}) => {
  return (
    <FormControl
      fullWidth={fullWidth}
      error={Boolean(touched[field] && errors[field])}
      sx={{ ...theme.typography.customInput, ...formControlStyle }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          sx={{ ...theme.typography.customInput }}
          label={label}
          value={values[field]}
          onBlur={handleBlur}
          onChange={(val) => {
            if (!val) {
              setFieldValue(field, '');
              return;
            }
            // const date = `${val.getFullYear()}-${val.getMonth() + 1}-${val.getDate()}`;
            setFieldValue(field, val);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </FormControl>
  );
};

FormikDatePicker.propTypes = {
  // formik
  errors: PropTypes.object,
  handleBlur: PropTypes.func,
  touched: PropTypes.object,
  values: PropTypes.object,
  setFieldValue: PropTypes.func,
  // form value
  label: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  // consit fo theme.typography.customInput to style the input
  theme: PropTypes.any,
  fullWidth: PropTypes.bool,
  formControlStyle: PropTypes.object
};

export const FormikRadioGroup = ({
  errors,
  handleChange,
  touched,
  values,
  label,
  field,
  theme,
  fullWidth,
  formControlStyle = {},
  options,
  defaultValue,
  optionInRow
}) => {
  const labelId = `radio-buttons-${label}`;
  return (
    <FormControl
      fullWidth={fullWidth}
      error={Boolean(touched[field] && errors[field])}
      sx={{ ...theme.typography.customInput, ...formControlStyle }}
    >
      <FormLabel id={labelId} sx={{ mb: 3 }}>
        {label}
      </FormLabel>
      <RadioGroup
        name={field}
        aria-labelledby={labelId}
        value={values[field]}
        defaultValue={defaultValue}
        onChange={handleChange}
        row={optionInRow}
      >
        {options.map((option) => (
          <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

FormikRadioGroup.propTypes = {
  // formik
  errors: PropTypes.object,
  handleChange: PropTypes.func,
  touched: PropTypes.object,
  values: PropTypes.object,
  // form value
  label: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  // consit fo theme.typography.customInput to style the input
  theme: PropTypes.any,
  fullWidth: PropTypes.bool,
  formControlStyle: PropTypes.object,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string
    })
  ),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  optionInRow: PropTypes.bool
};
