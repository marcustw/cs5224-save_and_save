import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormHelperText } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { FormikDatePicker, FormikSelectInput, FormikTextInput } from 'ui-component/form/FormikInputs';

// utils
import { isValidNumber, parseIntOrUndefined } from 'ui-component/form/utils';
import { ItemCondition } from 'constants/item';

const DiscountReasons = [
  {
    value: ItemCondition.EXPIRING,
    label: 'Expiring Soon'
  },
  {
    value: ItemCondition.SEASONAL,
    label: 'Season Offer'
  },
  {
    value: ItemCondition.DISCOUNT,
    label: 'Normal Discount'
  }
];

// ===========================|| FIREBASE - REGISTER ||=========================== //

const ProductForm = React.forwardRef(({ itemData = {}, onSubmit, ...others }, ref) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();

  const handleOnSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      if (scriptedRef.current) {
        await onSubmit({ original: itemData, updated: values });
        setStatus({ success: true });
        setSubmitting(false);
      }
    } catch (err) {
      console.error(err);
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
          ...itemData,
          itemName: itemData.itemName,
          originalPrice: itemData.originalPrice,
          discountPrice: itemData.discountPrice,
          discountReason: itemData.discountReason,
          stockCount: itemData.stockCount,
          expiredDate: itemData.expiredDate ?? null
          // description: itemData.description
        }}
        validationSchema={Yup.object().shape({
          itemName: Yup.string().max(255).required('Name is required'),
          originalPrice: Yup.number()
            .test('is-price', 'Must be less than 2 decimal place', (value) => {
              return isValidNumber(value, 2);
            })
            .required('Original Price is required'),
          discountPrice: Yup.number()
            .test('is-price', 'Must be less than 2 decimal place', (value) => {
              return isValidNumber(value, 2);
            })
            .required('Discount Price is required'),
          discountReason: Yup.string().required('Reason is required'),
          stockCount: Yup.number('Must be an integer')
            .test('is-integer', 'Must be positive whole number', (value) => {
              return isValidNumber(value, 0);
            })
            .required('Discount Price is required')
        })}
        onSubmit={handleOnSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormikTextInput
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
              values={values}
              touched={touched}
              theme={theme}
              field="itemName"
              label="Product Name"
              fullWidth={true}
            />
            {/* <FormikTextInput
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
              values={values}
              touched={touched}
              theme={theme}
              field="description"
              label="Product Description"
              fullWidth={true}
              multiline={true}
              rows={1}
            /> */}
            <Box mr={2} display="inline-block">
              <FormikSelectInput
                errors={errors}
                handleBlur={handleBlur}
                handleChange={handleChange}
                values={values}
                touched={touched}
                theme={theme}
                selectSx={{ minHeight: 51 }}
                formControlStyle={{ minWidth: 200 }}
                field="discountReason"
                label="Discount Reason"
                menuItems={DiscountReasons}
                setFieldValue={setFieldValue}
              />
            </Box>
            <Box mr={2} display="inline-block">
              <FormikDatePicker
                errors={errors}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                values={values}
                touched={touched}
                theme={theme}
                label="Best Before Date"
                field="expiredDate"
              />
            </Box>
            <Box display="block">
              <Box mr={2} display="inline-block">
                <FormikTextInput
                  errors={errors}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  values={values}
                  touched={touched}
                  theme={theme}
                  field="originalPrice"
                  label="Original Price"
                  type="number"
                  setFieldValue={setFieldValue}
                />
              </Box>
              <Box mr={2} display="inline-block">
                <FormikTextInput
                  errors={errors}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  values={values}
                  touched={touched}
                  theme={theme}
                  field="discountPrice"
                  label="Discounted Price"
                  type="number"
                  setFieldValue={setFieldValue}
                />
              </Box>
            </Box>
            <Box mr={2} display="block">
              <FormikTextInput
                errors={errors}
                handleBlur={handleBlur}
                handleChange={handleChange}
                values={values}
                touched={touched}
                theme={theme}
                field="stockCount"
                label="Stock"
                type="number"
                transform={parseIntOrUndefined}
                setFieldValue={setFieldValue}
              />
            </Box>
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

export default ProductForm;

ProductForm.propTypes = {
  itemData: PropTypes.shape({
    id: PropTypes.number,
    category: PropTypes.category,
    itemName: PropTypes.string,
    originalPrice: PropTypes.number,
    discountPrice: PropTypes.number,
    // refer to enum ItemCondition
    discountReason: PropTypes.string,
    stockCount: PropTypes.number,
    // yyyy-mm-dd
    expiredDate: PropTypes.string,
    description: PropTypes.string,
    stockCount: PropTypes.number,
    image: PropTypes.string
  }).isRequired,
  // (data) => void,
  onSubmit: PropTypes.func
};
