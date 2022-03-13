// material-ui
import { Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AccountForm from './Components/AccountForm';

const MockAccount = {
  name: 'John',
  contact: '90000000',
  email: 'abc@mail.com'
};

const AccountPage = () => {
  const handleOnSubmit = (item) => {
    setEditItem(undefined);
  };

  return (
    <MainCard title="Account Setting">
      <AccountForm account={MockAccount} handleOnSubmit={handleOnSubmit} />
    </MainCard>
  );
};

export default AccountPage;
