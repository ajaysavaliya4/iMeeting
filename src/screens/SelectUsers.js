import { View, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { Divider } from 'react-native-paper';
import { useQuery } from '@apollo/client';

import Header from '../component/header/Header';
import { Icon, IconName } from '../component';
import { SIZES } from '../themes/Sizes';
import { Colors } from '../themes/Colors';
import { Fonts } from '../themes';
import { Button } from '../component/button/Button';
import UsersCard from '../component/Cards/UsersCard';
import { GET_All_USERS } from '../graphql/query';
import { UserContext } from '../context';

const SelectUsers = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { committee } = route?.params;
  const [activeTab, setActiveTab] = useState('0');
  const [selectUser, setSelectUser] = useState([]);
  const [selectExternal, setSelectExternal] = useState(false);
  const [externalUser, setExternalUser] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [user, setUser] = useState([]);
  const [allUserButton, setAllUserButton] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [filterData, setFilterData] = useState(user);
  const [searchText, setSearchText] = useState('');
  const { selectedUsers, setSelectedUsers } = useContext(UserContext);
  console.log('selected user from select user', selectUser);

  // get user
  const { loading: UsersLoading, error: UsersError } = useQuery(GET_All_USERS, {
    variables: {
      isDeleted: true,
      externalUser: false,
      searchValue: searchText,
      organizationId: committee
    },
    onCompleted: (data) => {
      console.log('userdata', data.committeeMembersList);
      if (data) {
        setUser(data?.committeeMembersList.items);
        setFilterData(data?.committeeMembersList.items);
      }
    }
  });

  // get external user
  const { loading: externalUsersLoading, error: externalUsersError } = useQuery(
    GET_All_USERS,
    {
      variables: {
        isDeleted: true,
        externalUser: true,
        searchValue: searchText
      },
      onCompleted: (data) => {
        console.log('externaluserdata', data.committeeMembersList.items);
        if (data) {
          setExternalUser(data?.committeeMembersList.items);
        }
      }
    }
  );

  if (externalUsersError) {
    console.log('externalUsersError error', externalUsersError);
  }

  useEffect(() => {
    if (selectAll) {
      console.log('user', user);
      console.log('external user', externalUser);
      if (activeTab == '0') {
        setSelectedUser(user);
        setSelectedUsers(user);
        // const userId = user?.map((item) => {
        //   return item.id;
        // });
        // selectedUsers.push(userId);
      }
      if (activeTab == '1') {
        setSelectedUser(externalUser);
        setSelectedUsers(externalUser);
        // const userId = externalUser?.map((item) => {
        //   return item.id;
        // });
        // selectedUsers.push(userId);
      }
    } else {
      setSelectedUsers(selectUser);
    }
  }, [selectAll, user, externalUser, selectUser]);

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <Header
        name={'Select user'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <View style={styles.searchContainer}>
          <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
          <TextInput
            style={styles.textInput}
            placeholder={'Search'}
            placeholderTextColor={Colors.secondary}
            onChangeText={
              (text) =>
                activeTab == '0'
                  ? setSearchText(text)
                  : activeTab == '1'
                  ? setSearchText(text)
                  : null
              // searchFilterUsers(text, user, setSearchText, setFilterData)
            }
          />
          <Icon name={IconName.Speaker} height={SIZES[15]} width={SIZES[10]} />
        </View>
        <View style={styles.btnContainer}>
          <Button
            title={'Users'}
            layoutStyle={[
              styles.btnUsers,
              {
                backgroundColor:
                  activeTab === '0' ? Colors.white : 'transparent'
              }
            ]}
            textStyle={styles.txtBtnServices}
            onPress={() => setActiveTab('0')}
          />

          {/* add external user button */}
          <Button
            title={'External users '}
            layoutStyle={[
              styles.btnUsers,
              {
                backgroundColor:
                  activeTab === '1' ? Colors.white : 'transparent'
              }
            ]}
            textStyle={styles.txtBtnServices}
            onPress={() => setActiveTab('1')}
          />
        </View>

        {/* users */}
        {activeTab === '0' && (
          <View style={{ flex: 1 }}>
            <Divider style={styles.divider} />
            <FlatList
              data={filterData}
              keyExtractor={(item, index) => `${item.userId}`}
              renderItem={({ item, index }) => (
                <UsersCard
                  item={item}
                  index={index}
                  setSelectAll={setSelectAll}
                  selectAll={selectAll}
                  allUserButton={allUserButton}
                  searchText={searchText}
                  activeTab={activeTab}
                  selectUser={selectUser}
                  setSelectUser={setSelectUser}
                />
              )}
              showsVerticalScrollIndicator={false}
            />
            <View
              style={{
                backgroundColor: Colors.white,
                justifyContent: 'flex-end'
              }}
            >
              {/* Divider */}
              <Divider style={styles.divider} />
              <View style={styles.buttonContainer}>
                <Button
                  title={'Select all users'}
                  onPress={() => {
                    if (activeTab == '0') {
                      setSelectAll(!selectAll);
                      setAllUserButton(!allUserButton);
                    }
                  }}
                  layoutStyle={styles.cancelBtnLayout}
                  textStyle={styles.txtCancelButton}
                />
                <Button
                  title={'Add user'}
                  onPress={() => navigation.goBack()}
                  layoutStyle={[
                    // {
                    //     opacity: title === "" || discription === "" ? 0.5 : null,
                    // },
                    styles.nextBtnLayout
                  ]}
                  textStyle={styles.txtNextBtn}
                />
              </View>
            </View>
          </View>
        )}

        {/* extternal users */}
        {activeTab === '1' && (
          <View style={{ flex: 1 }}>
            <Button
              title={'Add external user'}
              layoutStyle={styles.btnExternalUser}
              textStyle={styles.txtBtnExternal}
              onPress={() => navigation.navigate('AddExternalUser')}
            />
            <Divider style={styles.divider} />
            <FlatList
              data={externalUser}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item, index }) => (
                <UsersCard
                  item={item}
                  index={index}
                  external={true}
                  selectAllExternal={selectExternal}
                  allUserButton={allUserButton}
                  searchText={searchText}
                  setSelectAll={setSelectAll}
                  selectAll={selectAll}
                  activeTab={activeTab}
                  setSelectUser={setSelectUser}
                />
              )}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<View style={{ height: 20 }} />}
            />
            <View
              style={{
                backgroundColor: Colors.white,
                justifyContent: 'flex-end'
              }}
            >
              {/* Divider */}
              <Divider style={styles.divider} />
              <View style={styles.buttonContainer}>
                <Button
                  title={'Select all users'}
                  onPress={() => {
                    if (activeTab == '1') {
                      setSelectAll(!selectAll);
                      setSelectExternal(!selectExternal);
                      setAllUserButton(!allUserButton);
                    }
                  }}
                  layoutStyle={styles.cancelBtnLayout}
                  textStyle={styles.txtCancelButton}
                />
                <Button
                  title={'Add user'}
                  onPress={() => navigation.goBack()}
                  layoutStyle={[
                    // {
                    //     opacity: title === "" || discription === "" ? 0.5 : null,
                    // },
                    styles.nextBtnLayout
                  ]}
                  textStyle={styles.txtNextBtn}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SelectUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  subContainer: {
    paddingHorizontal: SIZES[16],
    backgroundColor: Colors.white,
    flex: 1
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES[10],
    backgroundColor: Colors.gray,
    borderRadius: SIZES[10],
    marginVertical: SIZES[22],
    justifyContent: 'center'
    // height: SIZES[36]
  },
  textInput: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    backgroundColor: 'transparent',
    flex: 1,
    marginHorizontal: SIZES[6],
    // height: SIZES[36],
    paddingVertical: 8
  },
  btnUsers: {
    paddingVertical: SIZES[8],
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES[8]
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: SIZES[10],
    marginBottom: SIZES[16],
    padding: SIZES[2],
    justifyContent: 'space-between'
  },
  txtBtnServices: { ...Fonts.PoppinsSemiBold[12], color: Colors.bold },
  btnExternalUser: {
    backgroundColor: Colors.Blue_Light,
    marginBottom: SIZES[16]
  },
  txtBtnExternal: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  buttonContainer: {
    paddingHorizontal: SIZES[16],
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelBtnLayout: {
    backgroundColor: '#F3F6F9',
    marginVertical: SIZES[12],
    width: '48%'
  },
  txtCancelButton: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  nextBtnLayout: {
    marginVertical: SIZES[12],
    width: '48%'
  },
  txtNextBtn: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.white
  }
});
