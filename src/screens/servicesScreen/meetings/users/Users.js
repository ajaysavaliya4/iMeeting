import { View, SafeAreaView, TextInput, FlatList } from 'react-native';
import React, { useContext, useState } from 'react';
import { styles } from './styles';
import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SIZES } from '../../../../themes/Sizes';
import { usersData } from '../../../../Constans/data';
import UserCard from '../../../../component/Cards/userCard/UserCard';
import { Divider } from 'react-native-paper';
import { UserContext } from '../../../../context';

const Users = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userDetails } = route?.params;
  console.log('userdetails from users', userDetails);
  const [searchText, setSearchText] = useState('');
  const { required, setRequired } = useContext(UserContext);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Users'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <View style={styles.searchContainer}>
          <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
          <TextInput
            style={styles.textInput}
            placeholder={'Search'}
            onChangeText={(text) => setSearchText(text)}
          />
          <Icon name={IconName.Speaker} height={SIZES[15]} width={SIZES[10]} />
        </View>
        <Divider style={styles.divider} />

        <FlatList
          data={userDetails}
          keyExtractor={({ item, index }) => `user-${index}`}
          renderItem={({ item, index }) => (
            <UserCard
              item={item}
              index={index}
              isSwitchOnRow={true}
              text={searchText}
              required={required}
              setRequired={setRequired}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Users;
