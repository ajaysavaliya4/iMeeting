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
import { Fonts } from '../../../../themes';
import { UserContext } from '../../../../context';
import { GET_USER_BY_ID } from '../../../../graphql/query';

const EditMeetingUser = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const { selectedUsers, setSelectedUsers } = useContext(UserContext);
  const { attachFiles, committee, title, discription, item } = route?.params;
  const [required, setRequired] = useState([]);
  const [selected, setSelected] = useState(item.userDetails);
  console.log('item from edit meeting', item);
  console.log('meeting data from user', {
    attachFiles,
    committee,
    title,
    discription
  });

  useEffect(() => {
    setSelectedUsers(item.userDetails);
  }, []);

  const userId = required?.map((item) => item.user);
  console.log('userId', userId);
  const userRequired = required?.map((item) => item.isRequired);
  console.log('userRequired', userRequired);

  // item?.userIds.map((id) => {
  //   const getUser = useQuery(GET_USER_BY_ID, {
  //     variables: {
  //       userId: id
  //     },
  //     onCompleted: (data) => {
  //       console.log('user from edit meeting users', data);
  //       // setFileResponse((prev) => {
  //       //   console.log('prev', prev);
  //       //   const id = file.map((item) => {
  //       //     return item.fileEnteryId;
  //       //   });
  //       //   console.log('id from inside', id);
  //       //   console.log(
  //       //     'fileEnteryId from inside',
  //       //     data.uploadedFile.fileEnteryId
  //       //   );
  //       //   if (id != data.uploadedFile.fileEnteryId) {
  //       //     file.push(data?.uploadedFile);
  //       //     setFileResponse(file);
  //       //   }
  //       // });
  //     }
  //   });
  //   if (getUser.error) {
  //     console.log('getUser error', getUser.error);
  //   }
  // });

  useEffect(() => {
    if (selectedUsers.length > 0) {
      const userId = selectedUsers?.map((item) => {
        return item.userId;
      });
      setUsers(userId);
    }
  }, [selectedUsers]);

  console.log('userId', users);
  console.log('user from editmeeting user', selectedUsers);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Edit meeting'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />

      <View style={styles.subContainer}>
        <View style={styles.progressContainer}>
          <Progress.Bar
            color={Colors.switch}
            progress={0.4}
            borderColor={Colors.white}
            unfilledColor={'#e6e7e9'}
            width={DeviceInfo.isTablet() ? 800 : 264}
          />
          <Text style={styles.txtProgress}>Step 2/5</Text>
        </View>
        <Text style={styles.txtAddSubjectTitle}>Users</Text>
        <View style={styles.searchContainer}>
          <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
          <TextInput
            style={styles.textInput}
            placeholder={'Search'}
            onChangeText={(text) => {
              searchFilterUsers(text);
            }}
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
            data={selectedUsers}
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
                deleted={false}
                editable={item.roles == 'Head' || item.roles == 'secretary'}
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
              navigation.navigate('EditMeetingDateAndTime', {
                attachFiles,
                committee,
                title,
                discription,
                users: users,
                userRequired: userRequired,
                item: item
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

export default EditMeetingUser;
