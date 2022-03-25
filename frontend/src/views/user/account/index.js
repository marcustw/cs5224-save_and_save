import React from 'react';
import { Auth } from 'aws-amplify';

// material-ui
import { CircularProgress } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AccountForm from './Components/AccountForm';

const AccountPage = () => {
  const [user, setUser] = React.useState();
  const [account, setAccount] = React.useState();
  const handleOnSubmit = async (values) => {
    await Auth.updateUserAttributes(user, { address: values.address, phone_number: `+65${values.contact}` });
  };

  React.useEffect(() => {
    const syncUser = async () => {
      const user = await Auth.currentAuthenticatedUser();
      if (user.attributes) {
        // call api to get address info & contact
        console.log(user.attributes.phone_number?.replace('+65', ''));
        setUser(user);
        setAccount({
          name: user.attributes.name,
          email: user.attributes.email,
          address: user.attributes.address,
          phone_number: user.attributes.phone_number?.replace('+65', '')
        });
      } else {
        setAccount(undefined);
      }
    };
    syncUser();
  }, []);

  return (
    <MainCard title="Account Setting">
      {account ? <AccountForm account={account} onSubmit={handleOnSubmit} /> : <CircularProgress />}
    </MainCard>
  );
};

export default AccountPage;
