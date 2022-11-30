import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import moment from 'moment';
import { useMutation, useQuery } from '@apollo/client';
import { Divider } from 'react-native-paper';

import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { styles } from './styles';
import { SIZES } from '../../../../themes/Sizes';
import { Colors } from '../../../../themes/Colors';
import FilesCard from '../../../../component/Cards/FilesCard';
import { Button } from '../../../../component/button/Button';
import { Fonts } from '../../../../themes';

import {
  GET_All_APPOINTMENT,
  GET_APPOINTMENT_BY_ID
} from '../../../../graphql/query';

import { DELETE_APPOINTMENT } from '../../../../graphql/mutation';
import UserCard from '../../../../component/Cards/userCard/UserCard';
import Clipboard from '@react-native-clipboard/clipboard';

const AppointmentsDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route?.params;
  console.log(item);
  const [fileResponse, setFileResponse] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [location, setLocation] = useState(null);
  const [committe, setCommittee] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [role, setRole] = useState(item.yourRoleName);

  const checkPermission = async (file) => {
    console.log('check permission');
    if (Platform.OS === 'ios') {
      downloadFile(file);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'Application needs access to your storage to download File'
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile(file);
          console.log('Storage Permission Granted.');
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log('++++' + err);
      }
    }
  };

  const downloadFile = (file) => {
    console.log('downloadfile');
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = file;
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true
      }
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then((res) => {
        // Alert after successful downloading
        console.log('res -> ', res.respInfo.redirects[0]);
        alert('File Downloaded Successfully.');
        if (Platform.OS == 'ios') {
          RNFetchBlob.ios.openDocument(res.respInfo.redirects[0]);
        }
      });
  };

  const getFileExtention = (fileUrl) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  // get meeting
  const { data, error, loading } = useQuery(GET_APPOINTMENT_BY_ID, {
    variables: {
      id: item.appointmentId
    },
    onCompleted: (data) => {
      if (data) {
        console.log('get appointment by id', data);
        setAppointment(data.appointment);
        // setRole(data.meeting.yourRoleName);
      }
    },
    onError: (data) => {
      console.log('error in get appointment by id', data);
    }
  });

  const start = moment(
    `${appointment?.setDate},${appointment?.setTime}`,
    'YYYY-MM-DD,hh:mm A'
  );
  const end = moment(
    `${appointment?.endDate},${appointment?.endTime}`,
    'YYYY-MM-DD,hh:mm A'
  );

  // Calculate the duration
  // Keep in mind you can get the duration in seconds, days, etc.
  const duration = moment.duration(end.diff(start));

  const hours = parseInt(duration.asHours());

  // meeting?.attachFileIds.map((id) => {
  //   const getFile = useQuery(GET_FILE, {
  //     variables: {
  //       fileEntryId: id
  //     },
  //     onCompleted: (data) => {
  //       console.log(data);
  //       // setFileResponse((prev) => {
  //       //   console.log('prev', prev);
  //       //   if (prev.fileEnteryId !== id) {
  //       //     return [...prev, data.uploadedFile];
  //       //   }
  //       // });
  //     }
  //   });
  //   if (getFile.data) {
  //     console.log('File', getFile.data);
  //   }
  //   if (getFile.error) {
  //     console.log('File error', getFile.error);
  //   }
  // });

  // get location
  // const Location = useQuery(GET_ALL_LOCATION_BY_ID, {
  //   variables: {
  //     locationId: item.locationId
  //   },
  //   onCompleted: (data) => {
  //     if (data) {
  //       setLocation(data.location);
  //     }
  //   },
  //   onError: (data) => {
  //     console.log('error in get location by id', data);
  //   }
  // });

  // delete appointment
  const [deleteAppointment] = useMutation(DELETE_APPOINTMENT, {
    refetchQueries: [
      {
        query: GET_All_APPOINTMENT
      }
    ],
    onCompleted: (data) => {
      if (data.deleteAppointment.status[0].statusCode == '200') {
        navigation.goBack();
      }
    },
    onError: (data) => {
      console.log('dele appointment error', data);
    }
  });

  const onDeleteHandler = () => {
    Alert.alert('Delete meeting', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () =>
          deleteAppointment({
            variables: {
              id: item.appointmentId
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
        name={'Appointment details'}
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
          {details('Committee', item?.committeeName)}
          {details('Your role', item?.yourRoleName)}
          {details('Title', item?.appointmentTitle)}
          {details('Description', appointment?.appointmentDescription)}
          {details('Creator', appointment?.creatorName)}
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.txtTitle}>Date & Time</Text>
          <View>
            {details(
              'Start date',
              moment(appointment?.setDate).format('DD MMM,YYYY')
            )}
            <View>
              <Text style={styles.txtDuration}>(Duration {hours} hours)</Text>
            </View>
          </View>
          {details('Timezone', appointment?.timeZone)}

          {details(
            'Repeat',
            appointment?.repeat == 0
              ? "Dosen't repeat"
              : appointment?.repeat == 1
              ? 'Repeat daily'
              : appointment?.repeat == 2
              ? 'Repeat weekly'
              : appointment?.repeat == 3
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
                      03:00 PM
                    </Text>
                  </View>
                </View>
              ) : (
                details('Your answer', item.answers)
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
            {details('Location Title', appointment?.locationName)}
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.primary
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('LocationDetails', {
                    locationId: appointment?.locationId,
                    platform: appointment?.platformName
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
            {details('Vi-nce platform', appointment?.platformName)}

            {appointment?.platformlink && (
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.primary,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text style={styles.txtLink}>{appointment?.platformlink}</Text>
                <TouchableOpacity
                  style={{ marginTop: 32, marginLeft: 14 }}
                  onPress={() => Clipboard.setString(appointment?.platformlink)}
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
                console.log('from retuen', file);
                return (
                  <FilesCard
                    key={index}
                    download={true}
                    filePath={file.name}
                    fileSize={file.size}
                    onDownloadPress={() => checkPermission(file.downloadUrl)}
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
          <View style={{ marginTop: SIZES[40] }}>
            <Text style={styles.txtTitle}>Users</Text>
            <Divider style={[styles.divider, { marginVertical: SIZES[24] }]} />
            {appointment?.userDetails?.length > 0 ? (
              <FlatList
                data={appointment?.userDetails}
                keyExtractor={(item) => `${item.userId}
            `}
                renderItem={({ item, index }) => {
                  return (
                    <UserCard
                      item={item}
                      index={index}
                      isSwitchOnRow={true}
                      userSelect={true}
                      text={''}
                      setRequired={() => {}}
                    />
                  );
                }}
              />
            ) : (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text>No selected user</Text>
              </View>
            )}
            {/* <View style={styles.btnCommittees}>
              <Text style={styles.txtBtnCommittees}>
                {appo?.userIds?.length > 0 ? meeting?.userIds?.length : 0}
              </Text>
              <Icon
                name={IconName.Arrow_Right}
                height={SIZES[12]}
                width={SIZES[6]}
              />
            </View> */}
          </View>
        </View>
      </ScrollView>
      {role == 'Head' || role == 'Secretory' ? (
        <View style={styles.bottomContainer}>
          <Divider style={styles.divider} />
          <View style={styles.btnContainer}>
            <Button
              title={'Edit'}
              layoutStyle={[styles.btnLayout, { backgroundColor: '#F3F6F9' }]}
              textStyle={{
                ...Fonts.PoppinsSemiBold[14],
                color: Colors.primary
              }}
              onPress={() =>
                navigation.navigate('EditAppointmentGeneral', { item: item })
              }
            />
            <Button
              title={'Delete'}
              layoutStyle={[styles.btnLayout, { backgroundColor: '#DD7878' }]}
              onPress={onDeleteHandler}
            />
            <Button title={'Start'} layoutStyle={[styles.btnLayout]} />
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default AppointmentsDetails;
