import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import * as Progress from 'react-native-progress';
import DeviceInfo from 'react-native-device-info';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Divider } from 'react-native-paper';

import { SIZES } from '../../../../themes/Sizes';
import { Colors } from '../../../../themes/Colors';
import { Icon, IconName } from '../../../../component';
import Header from '../../../../component/header/Header';
import { Button } from '../../../../component/button/Button';
import UserCard from '../../../../component/Cards/userCard/UserCard';
import { styles } from './styles';
import { UserContext } from '../../../../context';

const EditAppointmentUsers = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route?.params;
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [required, setRequired] = useState([]);
  const { attachFiles, committee, title, discription } = route?.params;
  console.log({ attachFiles, committee, title, discription });
  const { selectedUsers, setSelectedUsers } = useContext(UserContext);
  const [selected, setSelected] = useState(item.userDetails);

  useEffect(() => {
    if (selectedUsers.length > 0) {
      const userId = selectedUsers?.map((item) => {
        return item.userId;
      });
      setUsers(userId);
    }
  }, [selectedUsers]);

  const userId = required?.map((item) => item.user);
  console.log('userId', userId);
  const userRequired = required?.map((item) => item.isRequired);
  console.log('userRequired', userRequired);

  // console.log('required', required);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Edit appointment'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />

      <View style={styles.subContainer}>
        <View style={styles.progressContainer}>
          <Progress.Bar
            color={Colors.switch}
            progress={0.5}
            borderColor={Colors.white}
            unfilledColor={'#e6e7e9'}
            width={DeviceInfo.isTablet() ? 800 : 264}
          />
          <Text style={styles.txtProgress}>Step 2/4</Text>
        </View>
        <Text style={styles.txtAddSubjectTitle}>Users</Text>
        <View style={styles.searchContainer}>
          <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
          <TextInput
            style={styles.textInput}
            placeholder={'Search'}
            onChangeText={(text) => setSearchText(text)}
          />
          <Icon name={IconName.Speaker} height={SIZES[15]} width={SIZES[10]} />
        </View>
        <TouchableOpacity
          style={styles.committeeView}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('Timeline')}
        >
          <Text style={styles.txtCommittee}>Timeline</Text>
          <View style={styles.btnCommittees}>
            <Icon
              name={IconName.Arrow_Right}
              height={SIZES[12]}
              width={SIZES[6]}
            />
          </View>
        </TouchableOpacity>
        <Divider style={styles.divider} />
        <TouchableOpacity
          style={styles.committeeView}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('SelectUsers', { committee })}
        >
          <Text style={styles.txtCommittee}>Users</Text>
          <View style={styles.btnCommittees}>
            <Text style={styles.txtBtnCommittees}>
              Select{' '}
              {selectedUsers?.length > 0
                ? selectedUsers?.length
                : '' || item.userDetails?.length > 0
                ? item.userDetails?.length
                : ''}
            </Text>
            <Icon
              name={IconName.Arrow_Right}
              height={SIZES[12]}
              width={SIZES[6]}
            />
          </View>
        </TouchableOpacity>
        <Divider style={styles.divider} />

        {selectedUsers?.length > 0 ? (
          <FlatList
            data={selectedUsers || item.userDetails}
            keyExtractor={(item, index) => `${item.userId}`}
            renderItem={({ item, index }) => (
              <UserCard
                item={item}
                index={index}
                text={searchText}
                userSelect={true}
                required={required}
                setRequired={setRequired}
                isSwitchOnRow={true}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : item.userDetails.length > 0 ? (
          <FlatList
            data={item.userDetails}
            keyExtractor={(item, index) => `${item.userId}`}
            renderItem={({ item, index }) => (
              <UserCard
                item={item}
                index={index}
                text={searchText}
                userSelect={false}
                isSwitchOnRow={true}
                required={required}
                setRequired={setRequired}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
              No selected user
            </Text>
          </View>
        )}
      </View>

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
            title={'Back'}
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Next'}
            onPress={() =>
              navigation.navigate('EditAppointmentDateAndTime', {
                attachFiles,
                committee,
                title,
                discription,
                users: userId,
                userRequired,
                item
              })
            }
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
    </SafeAreaView>
  );
};

export default EditAppointmentUsers;
