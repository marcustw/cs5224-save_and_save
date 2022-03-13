import React from 'react';
// material-ui
import { CircularProgress } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AccountForm from './Components/AccountForm';
import { UserContext } from 'Contexts/UserContext';

const MockAccount = {
  name: 'John',
  contact: '90000000',
  email: 'abc@mail.com'
};

const AccountPage = () => {
  const handleOnSubmit = (item) => {
    setEditItem(undefined);
  };
  const [account, setAccount] = React.useState();
  const { user, signOut } = React.useContext(UserContext);

  React.useEffect(() => {
    if (user.attributes) {
      // call api to get address info & contact
      console.log(user);
      setAccount({
        name: user.attributes.name,
        email: user.attributes.email,
        address: 'Buono Vista 123455',
        contact: '90001234'
      });
    } else {
      setAccount(undefined);
    }
  }, [user]);

  console.log(account);

  return (
    <MainCard title="Account Setting">
      {account ? <AccountForm account={account} handleOnSubmit={handleOnSubmit} /> : <CircularProgress />}
    </MainCard>
  );
};

export default AccountPage;
