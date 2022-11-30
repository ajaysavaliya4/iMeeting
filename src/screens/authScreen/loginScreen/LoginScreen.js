import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  DeviceEventEmitter
} from 'react-native';
import React, { useContext, useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import { Divider, TextInput } from 'react-native-paper';
import { ApolloProvider, useLazyQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Icon, IconName } from '../../../component';
import { Button } from '../../../component/button/Button';
import Input from '../../../component/Input/Input';
import { GET_AUTH } from '../../../graphql/query';
import { SIZES } from '../../../themes/Sizes';
import { styles } from './styles';
import Loader from '../../../component/Loader/Loader';
import { UserContext } from '../../../context';

const LoginScreen = ({ navigation }) => {
  const [url, setUrl] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const [loadingLogin, setLoading] = useState(false);
  const { companyUrl, setCompanyUrl } = useContext(UserContext);

  const [getAuth, { loading, data }] = useLazyQuery(GET_AUTH, {
    onCompleted: (data) => {
      console.log(data);
      setClientId(data.oAuth2Application.clientId);
      setClientSecret(data.oAuth2Application.clientSecret);
      setError(data.error);
      if (
        data.oAuth2Application.clientId == '' &&
        data.oAuth2Application.clientId == ''
      ) {
        setError('Please enter valid company url');
      }
    },
    onError: (data) => {
      console.log('get aoth error', data);
      setError(data.message);
      setLoading(false);
    }
  });

  const storeToken = async (user) => {
    console.log('store data called-----');
    try {
      await AsyncStorage.setItem('@user', JSON.stringify(user));
    } catch (error) {
      console.log(error);
    }
  };
  const storeUrl = async (url) => {
    console.log('store data called-----', url);
    if (!url) return;
    try {
      const savedToken = await AsyncStorage.setItem('@url', url);
      DeviceEventEmitter.emit('urlChanged');
    } catch (error) {
      console.log(error);
    }
  };
  const storeUserToken = (token) => {
    console.log('store data called-----');
    try {
      AsyncStorage.setItem('@token', token);
    } catch (error) {
      console.log(error);
    }
  };

  const Login = async () => {
    setLoading(true);
    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('grant_type', 'password');
    formData.append('username', userName);
    formData.append('password', password);
    console.log('client_id', clientId.toString());
    console.log('client_secret', clientSecret.toString());
    console.log('grant_type', 'password');
    console.log('username', userName);
    console.log('password', password);
    const Companyurl = await AsyncStorage.getItem('@url');
    console.log('comapny url from login', companyUrl);

    if (clientId !== '' && clientSecret !== '') {
      fetch(`https://${Companyurl}//o/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      })
        .then((response) => response.json())
        .then((responseData) => {
          console.log('responseData-----', responseData);
          if (responseData.error) {
            setError(responseData.error);
            setLoading(false);
            console.log('login error', responseData.error);
          } else {
            const dataToken = responseData.access_token;
            let user = {
              userName: userName,
              url: url,
              clientId: clientId,
              clientSecret: clientSecret,
              dataToken: dataToken
            };
            console.log(user);
            storeToken(user);
            storeUserToken(dataToken);
            navigation.navigate('MainBottomTab');
            setUrl('');
            setUserName('');
            setPassword('');
            setLoading(false);

            const interval = setInterval(() => {
              refreshToken();
            }, responseData.expires_in);

            return () => clearInterval(interval);
          }
        });
    }
  };

  const refreshToken = async () => {
    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);
    formData.append('grant_type', 'password');
    formData.append('username', userName);
    formData.append('password', password);
    // console.log('client_id', clientId.toString());
    // console.log('client_secret', clientSecret.toString());
    // console.log('grant_type', 'password');
    // console.log('username', userName);
    // console.log('password', password);
    // console.log('url', url);
    const Companyurl = await AsyncStorage.getItem('@url');

    if (clientId !== '' && clientSecret !== '') {
      try {
        fetch(`https://${Companyurl}//o/oauth2/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData.toString()
        })
          .then((response) => response.json())
          .then((responseData) => {
            console.log('responseData-----', responseData);
            if (responseData.error) {
              setError(responseData.error);
              console.log(responseData.error);
            } else {
              const dataToken = responseData.access_token;
              console.log('dataToken', dataToken);
              let user = {
                userName: userName,
                url: url,
                clientId: clientId,
                clientSecret: clientSecret,
                dataToken: dataToken
              };
              console.log(user);
              storeToken(user);
              storeUserToken(dataToken);
            }
          });
      } catch (e) {
        console.log('login error', e);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.subContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* header */}
        <Text style={styles.txtHeader}>Log in</Text>
        {error && (
          <View style={styles.errorView}>
            <Text style={{ color: 'red' }}>{error}</Text>
          </View>
        )}

        {/* url-input */}
        <Input
          onChangeText={(text) => {
            setUrl(text);
          }}
          onChange={() => {
            console.log('i am called', url);
            setCompanyUrl(url);
            getAuth({ variables: { domainName: url } });
            storeUrl(url);
          }}
          value={url}
          label={'URL- address company'}
          right={
            url !== '' ? (
              <TextInput.Icon
                name={() => (
                  <TouchableOpacity onPress={() => setUrl('')}>
                    <Icon
                      name={IconName.Close}
                      height={SIZES[12]}
                      width={SIZES[12]}
                    />
                  </TouchableOpacity>
                )}
              />
            ) : null
          }
          style={styles.textInput}
        />

        {/* username input */}
        <Input
          onChangeText={(text) => setUserName(text)}
          value={userName}
          label={'Username'}
          right={
            userName !== '' ? (
              <TextInput.Icon
                name={() => (
                  <TouchableOpacity onPress={() => setUserName('')}>
                    <Icon
                      name={IconName.Close}
                      height={SIZES[12]}
                      width={SIZES[12]}
                    />
                  </TouchableOpacity>
                )}
              />
            ) : null
          }
          style={[styles.textInput, { marginVertical: SIZES[20] }]}
        />

        {/* password input */}
        <Input
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={secureTextEntry}
          label={'Password'}
          value={password}
          right={
            <TextInput.Icon
              name={() => (
                <TouchableOpacity
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                >
                  <Icon
                    name={IconName.Eye}
                    height={22}
                    width={DeviceInfo.isTablet() ? SIZES[12] : SIZES[22]}
                  />
                </TouchableOpacity>
              )}
            />
          }
          style={styles.textInput}
        />
      </ScrollView>

      {/* create account button */}
      {/* <TouchableOpacity
        onPress={() => navigation.push("CreateAccount")}
        activeOpacity={0.5}
        style={styles.createButtonContainer}
      >
        <Text style={styles.txtCreateAccount}>Create an account</Text>
      </TouchableOpacity> */}

      <View
        style={{
          justifyContent: 'flex-end'
        }}
      >
        {/* Divider */}
        <Divider style={styles.divider} />

        {/* login button */}
        <View style={styles.btnView}>
          {loadingLogin ? (
            <Loader layOutStyle={{ paddingVertical: SIZES[10] }} />
          ) : (
            <Button
              onPress={Login}
              title={'Log in'}
              disable={
                url === '' || userName === '' || password === '' ? true : false
              }
              layoutStyle={[
                {
                  opacity:
                    url === '' || userName === '' || password === ''
                      ? 0.5
                      : null
                },
                styles.loginButton
              ]}
              textStyle={styles.txtButton}
            />
          )}
          {/* <Button
            onPress={Login}
            title={'Log in'}
            disable={
              url === '' || userName === '' || password === '' ? true : false
            }
            layoutStyle={[
              {
                opacity:
                  url === '' || userName === '' || password === '' ? 0.5 : null
              },
              styles.loginButton
            ]}
            textStyle={styles.txtButton}
          /> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
