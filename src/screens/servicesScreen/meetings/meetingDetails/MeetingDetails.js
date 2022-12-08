import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ToastAndroid
} from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Clipboard from '@react-native-clipboard/clipboard';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigation, useRoute } from '@react-navigation/native';
import momentDurationFormatSetup from 'moment-duration-format';

import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { styles } from './styles';
import { SIZES } from '../../../../themes/Sizes';
import { Colors } from '../../../../themes/Colors';
import FilesCard from '../../../../component/Cards/FilesCard';
import { Divider } from 'react-native-paper';
import { Button } from '../../../../component/button/Button';
import { Fonts } from '../../../../themes';

import {
  GET_ALL_LOCATION_BY_ID,
  GET_All_MEETING,
  GET_COMMITTEE_BY_ID,
  GET_FILE,
  GET_MEETING_BY_ID,
  GET_PLATFORMLINK,
  GET_USER_PAYLOAD
} from '../../../../graphql/query';

import { DELETE_MEETING } from '../../../../graphql/mutation';

const MeetingDetails = () => {
  const navigation = useNavigation();
  momentDurationFormatSetup(moment);
  const route = useRoute();
  const { item } = route?.params;

  const [fileResponse, setFileResponse] = useState(null);
  const [meeting, setMeeting] = useState(null);
  const [location, setLocation] = useState(null);
  const [committe, setCommittee] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [role, setRole] = useState('');
  const [user, setUser] = useState(null);
  let file = [];

  item?.attachFileIds.map((id) => {
    const getFile = useQuery(GET_FILE, {
      variables: {
        fileEntryId: id
      },
      onCompleted: (data) => {
        console.log('file from meeting details', data);
        setFileResponse((prev) => {
          console.log('prev', prev);
          const id = file.map((item) => {
            return item.fileEnteryId;
          });
          console.log('id from inside', id);
          console.log(
            'fileEnteryId from inside',
            data.uploadedFile.fileEnteryId
          );
          if (id != data.uploadedFile.fileEnteryId) {
            file.push(data?.uploadedFile);
            setFileResponse(file);
          }
        });
      }
    });
    if (getFile.error) {
      console.log('File error', getFile.error);
    }
  });

  // get meeting
  const { data, error, loading } = useQuery(GET_MEETING_BY_ID, {
    variables: {
      meetingId: item.meetingId
    },
    onCompleted: (data) => {
      console.log('meeting by id', data.meeting);
      if (data) {
        setMeeting(data.meeting);
        setRole(data.meeting.yourRoleName);
      }
    },
    onError: (data) => {
      console.log('error in get meeting by id', data);
    }
  });

  const getUserDetails = useQuery(GET_USER_PAYLOAD, {
    onCompleted: (data) => {
      console.log('user data', data.userPayload.userCommitteesDetail);
      const userId = item?.userDetails?.filter((user) => {
        if (user.userId == data.userPayload.userId) {
          return user;
        }
      });
      console.log('user Id', userId);
      setUser(userId[0]);
    }
  });

  const DurationTime = moment(`${meeting?.endDate} ${meeting?.endTime}`, [
    'YYYY-MM-DD hh:mm A'
  ]).diff(
    moment(`${meeting?.setDate} ${meeting?.setTime}`, ['YYYY-MM-DD hh:mm A']),
    'minutes'
  );
  const durationHourMin = moment
    .duration(DurationTime, 'minutes')
    .format('h [hrs], m [min]');

  // Calculate the duration
  // Keep in mind you can get the duration in seconds, days, etc.

  console.log('file id', meeting?.attachFileIds);

  // get location
  const Location = useQuery(GET_ALL_LOCATION_BY_ID, {
    variables: {
      locationId: item.locationId
    },
    onCompleted: (data) => {
      if (data) {
        setLocation(data.location);
      }
    },
    onError: (data) => {
      console.log('error in get meeting by id', data);
    }
  });

  // get link
  const Link = useQuery(GET_PLATFORMLINK, {
    variables: {
      platformId: meeting?.platformId
    },
    onCompleted: (data) => {
      if (data) {
        console.log('platform link', data.videoConferencePlatformLink);
        setPlatform(data.videoConferencePlatformLink);
      }
    },
    onError: (data) => {
      console.log('error in get meeting by id', data);
    }
  });

  // get committee
  const Committee = useQuery(GET_COMMITTEE_BY_ID, {
    variables: {
      organizationId: item.committeeId
    },
    onCompleted: (data) => {
      if (data) {
        setCommittee(data.committee);
      }
    },
    onError: (data) => {
      console.log('error in get committee by id', data);
    }
  });

  // delete meeting
  const [deleteMeeting] = useMutation(DELETE_MEETING, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [
      {
        query: GET_All_MEETING,
        variables: {
          onlyMyMeeting: false,
          committeeIds: '',
          screen: 0,
          searchValue: '',
          page: -1,
          pageSize: -1
        }
      }
    ],
    onCompleted: (data) => {
      if (data.deleteMeeting.status[0].statusCode == '200') {
        navigation.goBack();
      }
    },
    onError: (data) => {
      console.log('dele meeting error', data);
    }
  });

  const onDeleteHandler = () => {
    Alert.alert('Delete meeting', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () =>
          deleteMeeting({
            variables: {
              meetingId: item.meetingId
            }
          }),
        style: 'destructive'
      },
      {
        text: 'Cancel',
        // onPress: () => navigation.navigate("Login"),
        style: 'cancel'
      }
    ]);
  };

  const details = (title, discription) => {
    return (
      <View style={{ marginTop: SIZES[24] }}>
        <Text style={styles.txtDetailTitle}>{title}</Text>
        <Text style={styles.txtDetailDiscription}>{discription}</Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Meeting details'}
        rightIconName={IconName.Search}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.subContainer}
      >
        <View style={styles.detailsContainer}>
          <Text style={styles.txtTitle}>General</Text>
          {details('Committee', committe?.committeeTitle)}
          {details('Your role', meeting?.yourRoleName)}
          {details('Title', meeting?.meetingTitle)}
          {details('Description', meeting?.description)}
          {details('Creator', meeting?.creatorName)}
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.txtTitle}>Date & Time</Text>
          <View>
            {details(
              'Start date',
              `${moment(meeting?.setDate).format('DD MMM,YYYY')},${
                meeting?.setTime
              }`
            )}
            <View>
              <Text style={styles.txtDuration}> {durationHourMin}</Text>
            </View>
          </View>
          {details('Timezone', meeting?.timeZone)}

          {details(
            'Repeat',
            meeting?.repeat == 0
              ? "Dosen't repeat"
              : meeting?.repeat == 1
              ? 'Repeat daily'
              : meeting?.repeat == 2
              ? 'Repeat weekly'
              : meeting?.repeat == 3
              ? 'Repeat monthly'
              : 'Repeat yearly'
          )}
          {role == 'Member' && details('Required', 'Yes')}
          {role == 'Member' && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {item.answers == 'Suggest time' ? (
                <View>
                  {details('Your answer', 'Your suggestion time')}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 48,
                      marginLeft: SIZES[8]
                    }}
                  >
                    <Text
                      style={{
                        ...Fonts.PoppinsSemiBold[14],
                        color: Colors.bold
                      }}
                    >
                      {item.suggestedTime}
                    </Text>
                  </View>
                </View>
              ) : (
                details(
                  'Your answer',
                  user?.suggestedTime == ''
                    ? user?.answer
                    : `Your suggestion time - ${user?.suggestedTime}`
                )
              )}
              <TouchableOpacity
                style={{
                  marginLeft: SIZES[16],
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.primary
                }}
                onPress={() => navigation.navigate('YourAnswer', { item })}
              >
                <Text
                  style={{
                    ...Fonts.PoppinsSemiBold[14],
                    color: Colors.primary
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.txtTitle}>Location</Text>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            {details('Location Title', location?.title)}
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.primary
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('LocationDetails', {
                    locationId: item.locationId,
                    platform: platform,
                    locationType: 1
                  })
                }
              >
                <Text style={styles.txtLink}>View details</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            {details('Vi-nce platform', 'Google Meet')}

            {item?.platformlink && (
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.primary,
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '70%'
                }}
              >
                <Text
                  style={[styles.txtLink, { width: '80%' }]}
                  numberOfLines={1}
                >
                  {item?.platformlink}
                </Text>
                <TouchableOpacity
                  style={{ marginTop: 32, marginLeft: 14 }}
                  onPress={() => {
                    Clipboard.setString(item?.platformlink);
                    if (
                      location.googleMapURL !== '' ||
                      location.googleMapURL !== null
                    ) {
                      if (Platform.OS == 'android') {
                        ToastAndroid.show(
                          `Copied Text :-  ${item?.platformlink}`,
                          ToastAndroid.SHORT
                        );
                      } else {
                        Alert.alert(`Copied Text :-  ${item?.platformlink}`);
                      }
                    }
                  }}
                >
                  <Icon
                    name={IconName.CopyText}
                    height={SIZES[20]}
                    width={SIZES[20]}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={{ marginTop: SIZES[24], marginBottom: SIZES[24] }}>
            <Text style={styles.txtAttachFile}>ATTACH FILE</Text>
            {fileResponse?.length > 0 ? (
              fileResponse?.map((file, index) => {
                return (
                  <FilesCard
                    key={index}
                    download={true}
                    filePath={file.name}
                    fileSize={file.size}
                    fileUrl={file.downloadUrl}
                    fileType={file.type}
                    style={{
                      borderBottomWidth: SIZES[1],
                      borderBottomColor: Colors.Approved
                    }}
                  />
                );
              })
            ) : (
              <Text>There is no any file</Text>
            )}
          </View>
          <Divider style={styles.divider} />
          <TouchableOpacity
            style={styles.committeeView}
            activeOpacity={0.5}
            onPress={() =>
              navigation.navigate('Users', {
                userDetails: meeting?.userDetails
              })
            }
          >
            <Text style={styles.txtCommittee}>Users</Text>
            <View style={styles.btnCommittees}>
              <Text style={styles.txtBtnCommittees}>
                {meeting?.userIds?.length > 0 ? meeting?.userIds?.length : 0}
              </Text>
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
            onPress={() =>
              navigation.navigate('subjects', {
                subjectId: meeting?.subjectIds,
                role
              })
            }
          >
            <Text style={styles.txtCommittee}>Subjects</Text>
            <View style={styles.btnCommittees}>
              <Text style={styles.txtBtnCommittees}>
                {meeting?.subjectIds?.length > 0
                  ? meeting?.subjectIds?.length
                  : 0}
              </Text>
              <Icon
                name={IconName.Arrow_Right}
                height={SIZES[12]}
                width={SIZES[6]}
              />
            </View>
          </TouchableOpacity>
          <Divider style={styles.divider} />
        </View>
      </ScrollView>
      {role == 'Head' || role == 'Secretory' ? (
        <View style={styles.bottomContainer}>
          <Divider style={styles.divider} />
          {item.meetingStatusTitle !== 'Deleted' && (
            <View style={styles.btnContainer}>
              <Button
                title={'Edit'}
                layoutStyle={[styles.btnLayout, { backgroundColor: '#F3F6F9' }]}
                textStyle={{
                  ...Fonts.PoppinsSemiBold[14],
                  color: Colors.primary
                }}
                onPress={() =>
                  navigation.navigate('EditMeetingGeneral', { item: item })
                }
              />
              <Button
                title={'Delete'}
                layoutStyle={[styles.btnLayout, { backgroundColor: '#DD7878' }]}
                onPress={onDeleteHandler}
              />
              <Button
                title={'Start'}
                layoutStyle={[styles.btnLayout]}
                onPress={() => {
                  navigation.navigate('LiveMeetingMenu', { item });
                }}
              />
            </View>
          )}
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default MeetingDetails;
