import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormHelperText, InputAdornment } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { FormikRadioGroup, FormikTextInput } from 'ui-component/form/FormikInputs';
import { ACCOUNT_SELLER_OPTIONS } from 'constants/user';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const AccountForm = React.forwardRef(({ account = {}, onSubmit, ...others }, ref) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();

  const handleOnSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      if (scriptedRef.current) {
        await onSubmit(values);
        setStatus({ success: true });
        setSubmitting(false);
      }
    } catch (err) {
      if (scriptedRef.current) {
        setStatus({ success: false });
        setErrors({ submit: err.message });
        setSubmitting(false);
      }
    }
  };

  return (
    <div ref={ref}>
      <Formik
        initialValues={{
          ...account,
          name: account.name,
          address: account.address,
          contact: account.phone_number,
          mail_id: account.email,
          email: account.email,
          authorized_to_sell: account.authorized_to_sell ? 1 : 0,
          first_name: account.first_name,
          last_name: account.last_name
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().max(255).required('Name is required'),
          contact: Yup.string()
            .matches(/^[6-9]\d{7}$/, { message: 'Please enter valid number.', excludeEmptyString: false })
            .required('Phone Number is required'),
          email: Yup.string().email('Must be a valid email').required('Discount Price is required')
        })}
        onSubmit={handleOnSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormikTextInput
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
              values={values}
              touched={touched}
              theme={theme}
              field="name"
              label="Name"
              fullWidth={true}
              disabled={true}
            />
            <FormikTextInput
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
              values={values}
              touched={touched}
              theme={theme}
              field="first_name"
              label="First Name"
              sx={{ mr: 2 }}
            />
            <FormikTextInput
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
              values={values}
              touched={touched}
              theme={theme}
              field="last_name"
              label="Last Name"
            />
            <FormikTextInput
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
              values={values}
              touched={touched}
              theme={theme}
              field="email"
              label="Email"
              type="email"
              fullWidth
              disabled={true}
            />
            <FormikTextInput
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
              values={values}
              touched={touched}
              theme={theme}
              field="contact"
              label="Phone Contact"
              type="phone"
              startAdornment={<InputAdornment position="start">+65</InputAdornment>}
            />
            <FormikTextInput
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
              values={values}
              touched={touched}
              theme={theme}
              field="address"
              label="Address"
              fullWidth={true}
              multiline={true}
              rows={1}
            />
            <FormikRadioGroup
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
              values={values}
              touched={touched}
              theme={theme}
              field="authorized_to_sell"
              label="Selling Permission"
              defaultValue={0}
              options={ACCOUNT_SELLER_OPTIONS}
              optionInRow={true}
            />
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Save
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </div>
  );
});

export default AccountForm;

AccountForm.propTypes = {
  account: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    contact: PropTypes.string,
    email: PropTypes.string
  }),
  // (data) => void,
  onSubmit: PropTypes.func
};
