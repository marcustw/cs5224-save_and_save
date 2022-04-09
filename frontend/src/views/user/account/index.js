import React from 'react';
import { Auth } from 'aws-amplify';

// material-ui
import { CircularProgress } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AccountForm from './Components/AccountForm';
import { createUser, getUser, updateUserInfo } from 'axios/accountApi';

const AccountPage = () => {
  const [user, setUser] = React.useState();
  const [account, setAccount] = React.useState();
  const handleOnSubmit = async (values) => {
    const { address, contact, ...customs } = values;
    const promises = [];
    if (customs.username) {
      promises.push(
        updateUserInfo({
          username: user.username,
          id: user.username,
          address,
          contact_no: Number(contact),
          first_name: customs.first_name,
          last_name: customs.last_name,
          authorized_to_sell: Boolean(customs.authorized_to_sell)
        })
      );
    } else {
      promises.push(
        createUser({
          ...customs,
          username: user.username,
          id: user.username,
          password: 'NIL',
          address,
          contact_no: Number(contact),
          authorized_to_sell: Boolean(customs.authorized_to_sell)
        })
      );
    }
    promises.push(Auth.updateUserAttributes(user, { address, phone_number: `+65${contact}` }));
    await Promise.all(promises);
  };

  React.useEffect(() => {
    const syncUser = async () => {
      const user = await Auth.currentAuthenticatedUser();
      const customDetailRes = await getUser(user.username);
      if (user.attributes) {
        // call api to get address info & contact
        const { status, data } = customDetailRes;
        const customDetail = status === 200 && data.payload ? data.payload : {};
        setUser(user);
        setAccount({
          ...customDetail,
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
