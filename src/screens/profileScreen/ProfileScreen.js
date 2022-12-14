import { SafeAreaView } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button } from '../../component/button/Button';

const ProfileScreen = ({ navigation }) => {
  const Logout = async () => {
    try {
      await AsyncStorage.clear()
        .then(console.log('cleared'))
        .then(navigation.navigate('Login'));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView>
      <Button
        title={'Logout'}
        onPress={() => {
          Logout();
        }}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
