import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ToastAndroid,
  Linking
} from 'react-native';
import React, { useState } from 'react';
import moment from 'moment';
import Clipboard from '@react-native-clipboard/clipboard';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useNavigation, useRoute } from '@react-navigation/native';
import momentDurationFormatSetup from 'moment-duration-format';
import { Divider } from 'react-native-paper';

import { Icon, IconName } from '../..';
import { styles } from './styles';
import { SIZES } from '../../../themes/Sizes';
import { Colors } from '../../../themes/Colors';
import { Fonts } from '../../../themes';
import {
  GET_ALL_LOCATION_BY_ID,
  GET_All_MEETING,
  GET_All_SUBJECTS,
  GET_ANSWER,
  GET_COMMITTEE_BY_ID,
  GET_FILE,
  GET_MEETING_BY_ID,
  GET_PLATFORMLINK,
  GET_USER_PAYLOAD
} from '../../../graphql/query';
import { DELETE_MEETING } from '../../../graphql/mutation';
import AttachFiles from '../../attachFiles/AttachFiles';
import { dateTimeFormate } from '../../../Constans/data';

const DetailsComponent = ({ item, isLiveMeetingDetails }) => {
  const navigation = useNavigation();
  momentDurationFormatSetup(moment);
  const route = useRoute();
  // const { item } = route?.params;

  const [fileResponse, setFileResponse] = useState([]);
  const [meeting, setMeeting] = useState(null);
  const [location, setLocation] = useState(null);
  const [committe, setCommittee] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [role, setRole] = useState(item?.yourRoleName);
  const [user, setUser] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [subjects, setSubjects] = useState(null);
  const [searchText, setSearchText] = useState('');
  let file = [];

  //Get meeting attachments
  item?.attachFileIds?.map((id) => {
    const getFile = useQuery(GET_FILE, {
      variables: {
        fileEntryId: id
      },
      onCompleted: (data) => {
        fileResponse.push(data.uploadedFile);
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
      if (data) {
        setMeeting(data.meeting);
        setRole(data.meeting.yourRoleName);
      }
    },
    onError: (data) => {
      console.log('error in get meeting by id', data);
    }
  });

  const [getAnswer, getAnswerType] = useLazyQuery(GET_ANSWER, {
    onCompleted: (data) => {
      setAnswer(data.answer);
    }
  });

  const getUserDetails = useQuery(GET_USER_PAYLOAD, {
    onCompleted: (data) => {
      setUser(data.userPayload.userId);
      getAnswer({
        variables: {
          id: +item?.meetingId,
          userId: +data.userPayload.userId,
          type: 1
        }
      });
    }
  });

  const DurationTime = moment(`${item?.endDate} ${item?.endTime}`, [
    dateTimeFormate
  ]).diff(
    moment(`${item?.setDate} ${item?.setTime}`, [dateTimeFormate]),
    'minutes'
  );
  const durationHourMin = moment
    .duration(DurationTime, 'minutes')
    .format('h [hrs], m [min]');

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

  // get ALL SUBJECTS
  const {
    loading: SubjectsLoading,
    error: SubjectsError,
    data: SubjectsData
  } = useQuery(GET_All_SUBJECTS, {
    variables: {
      committeeIds: '',
      searchValue: searchText,
      screen: 0,
      page: -1,
      pageSize: -1,
      meetingId: item?.meetingId,
      isDraft: false
    },

    onCompleted: (data) => {
      setSubjects(data?.subjects.items);
      console.log('subjects', data?.subjects.items);
    }
  });

  if (SubjectsError) {
    console.log('subjects error---', SubjectsError);
  }

  const details = (title, discription) => {
    return (
      <View style={{ marginTop: SIZES[24] }}>
        <Text style={styles.txtDetailTitle}>{title}</Text>
        <Text style={styles.txtDetailDiscription}>{discription}</Text>
      </View>
    );
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.subContainer}
    >
      <View style={styles.detailsContainer}>
        <Text style={styles.txtTitle}>General</Text>
        {details('Committee', committe?.committeeTitle)}
        {details('Your role', item?.yourRoleName)}
        {details('Title', item?.meetingTitle)}
        {details('Description', item?.description)}
        {details('Creator', item?.creatorName)}
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.txtTitle}>Date & Time</Text>
        <View>
          {details(
            'Start date',
            `${moment(item?.setDate).format('DD MMM, YYYY')}, ${item?.setTime}`
          )}
          <View>
            <Text style={styles.txtDuration}>
              {' '}
              (Duration {durationHourMin})
            </Text>
          </View>
        </View>
        {details('Timezone', item?.timeZone)}

        {details(
          'Repeat',
          item?.repeat == 0
            ? "Dosen't repeat"
            : item?.repeat == 1
            ? 'Repeat daily'
            : item?.repeat == 2
            ? 'Repeat weekly'
            : item?.repeat == 3
            ? 'Repeat monthly'
            : 'Repeat yearly'
        )}
        {role == 'Member' &&
          details('Required', item?.isRequired ? 'Yes' : 'No')}
        {role == 'Member' && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {item.answers == 'Suggest time' ? (
              <View>
                {details('Your answer', 'Your suggestion time')}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: SIZES[48],
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
                answer?.suggestionTime == ''
                  ? answer?.answer
                  : `Your suggestion time - ${answer?.suggestionTime}`
              )
            )}
            <TouchableOpacity
              style={{
                marginLeft: SIZES[16],
                borderBottomWidth: 1,
                borderBottomColor: Colors.primary
              }}
              onPress={() =>
                navigation.navigate('YourAnswer', { item, userID: user })
              }
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {details('Location Title', location?.title)}
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.primary,
              // backgroundColor: 'red',
              marginTop: SIZES[40]
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('LocationDetails', {
                  locationId: item.locationId,

                  locationType: 1,
                  role: item.yourRoleName
                })
              }
            >
              <Text style={styles.txtLink}>View details</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: fileResponse?.length > 0 ? 0 : SIZES[24]
          }}
        >
          {details('Vi-nce platform', 'Google Meet')}

          {item?.platformlink && (
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.primary,
                flexDirection: 'row',
                alignItems: 'center',
                width: '70%',

                justifyContent: 'center',
                position: 'absolute',
                right: 0,
                bottom: -8,
                paddingBottom: SIZES[8]
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(item?.platformlink);
                }}
                style={{ width: '80%' }}
              >
                <Text
                  style={[styles.txtLink, { width: '90%' }]}
                  numberOfLines={1}
                >
                  {item?.platformlink}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                // style={{ marginTop: 32, marginLeft: 14 }}
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
        {fileResponse?.length > 0 && (
          <AttachFiles
            fileResponse={fileResponse}
            setFileResponse={setFileResponse}
            showAttachButton={false}
            deleted={false}
            download={true}
            isShowAttchTitle={true}
          />
        )}
        {!!isLiveMeetingDetails && (
          <View>
            <Divider style={styles.divider} />
            <TouchableOpacity
              style={styles.committeeView}
              activeOpacity={0.5}
              onPress={() =>
                navigation.navigate('Users', {
                  userDetails: item?.userDetails
                })
              }
            >
              <Text style={styles.txtCommittee}>Users</Text>
              <View style={styles.btnCommittees}>
                <Text style={styles.txtBtnCommittees}>
                  {item?.userDetails?.length > 0
                    ? item?.userDetails?.length
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
            <TouchableOpacity
              style={styles.committeeView}
              activeOpacity={0.5}
              onPress={() =>
                navigation.navigate('subjects', {
                  subjects: subjects,
                  role,
                  deadlinedDate: meeting?.deadlineDate,
                  setSearchText: setSearchText,
                  searchText: searchText
                })
              }
            >
              <Text style={styles.txtCommittee}>Subjects</Text>
              <View style={styles.btnCommittees}>
                <Text style={styles.txtBtnCommittees}>
                  {subjects?.length > 0 ? subjects?.length : 0}
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
        )}
      </View>
    </ScrollView>
  );
};

export default DetailsComponent;
