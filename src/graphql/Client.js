import { ApolloClient, InMemoryCache } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
import { useContext, useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { UserContext } from '../context';

export const Client = () => {
  const [url, setUrl] = useState('');
  // const { companyUrl, setCompanyUrl } = useContext(UserContext);

  useEffect(() => {
    DeviceEventEmitter.addListener('urlChanged', getUrl);

    // return () => {
    //   DeviceEventEmitter.removeAllListeners('urlChanged');
    // };
  }, []);

  useEffect(() => {
    getUrl();
  }, []);

  const getUrl = () => {
    AsyncStorage.getItem('@url').then((data) => {
      console.log('url', data);
      setUrl(data);
    });
  };

  console.log('url from client', url);
  const BASE_URL = 'finance2.imeetingpro.com';
  const httpLink = createUploadLink({
    uri: `https://${url}//o/graphql`
  });

  const authLink = setContext(async (req, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = await AsyncStorage.getItem('@token');

    // return the headers to the context so httpLink can read them
    return {
      headers: {
        // ...headers,
        Authorization: `Bearer ${token}`
      }
    };
  });

  const client = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache()
  });
  return client;
};
// export const BASE_URL = 'finance2.imeetingpro.com';
// const httpLink = createUploadLink({
//   uri: `https://${BASE_URL}//o/graphql`
// });

// const authLink = setContext(async (req, { headers }) => {
//   // get the authentication token from local storage if it exists
//   const token = await AsyncStorage.getItem('@token');

//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       // ...headers,
//       Authorization: `Bearer ${token}`
//     }
//   };
// });

// export const client = new ApolloClient({
//   link: ApolloLink.from([authLink, httpLink]),
//   cache: new InMemoryCache()
// });
