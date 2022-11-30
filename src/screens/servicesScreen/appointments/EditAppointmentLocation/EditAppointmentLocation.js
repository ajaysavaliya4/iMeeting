import { View, Text, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import * as Progress from 'react-native-progress';
import DeviceInfo from 'react-native-device-info';

import Header from '../../../../component/header/Header';
import { IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { styles } from './styles';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SIZES } from '../../../../themes/Sizes';
import { Fonts } from '../../../../themes';
import { Divider } from 'react-native-paper';
import { Button } from '../../../../component/button/Button';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_All_APPOINTMENT,
  GET_ALL_LOCATION,
  GET_PLATFORMLINK
} from '../../../../graphql/query';
import { UPDATE_APPOINTMENT } from '../../../../graphql/mutation';

const EditAppointmentLocation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    attachFiles,
    committee,
    title,
    discription,
    users,
    startDate,
    endDate,
    startTime,
    endTime,
    TimeZone,
    Repeat,
    item,
    userRequired
  } = route?.params;
  console.log('appointment data from addmeetinglocation', {
    attachFiles,
    committee,
    title,
    discription,
    users,
    startDate,
    endDate,
    startTime,
    endTime,
    TimeZone,
    Repeat,
    item,
    userRequired
  });
  const [openLocation, setOpenLocation] = useState(false);
  const [valueLocation, setValueLocation] = useState(item.locationId);
  const [openVideoConference, setOpenVideoConference] = useState(false);
  const [valueVideoConference, setValueVideoConference] = useState(
    item.platformName == 'Google Meet' ? 1 : 2
  );
  const [platform, setPlatform] = useState(null);
  const [location, setLocation] = useState([]);
  const [items, setItems] = useState([
    { label: 'Office 2', value: 'Office 2' }
  ]);

  const {
    loading: LocationLoading,
    error: LocationError,
    data: LocationData
  } = useQuery(GET_ALL_LOCATION, {
    variables: {
      locationType: 2
    },

    onCompleted: (data) => {
      console.log('get location', data?.locations);
      // setSubjectData(data?.subjects.items);

      setLocation(data?.locations.items);
    }
  });
  if (LocationError) {
    console.log('LocationError', LocationError);
  }

  // get platform link
  const {
    loading: platformLoading,
    error: platformError,
    data: platformData
  } = useQuery(GET_PLATFORMLINK, {
    variables: {
      platformId: valueVideoConference
    },

    onCompleted: (data) => {
      console.log('get platform link', data.videoConferencePlatformLink);
      // setSubjectData(data?.subjects.items);
      if (data) {
        setPlatform(data?.videoConferencePlatformLink);
      }
    }
  });
  if (platformError) {
    console.log('platformError', platformError);
  }

  const [addAppointment] = useMutation(UPDATE_APPOINTMENT, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [
      {
        query: GET_All_APPOINTMENT,
        variables: { searchValue: '' }
      }
    ],
    onCompleted: (data) => {
      console.log('add appointment', data.updateAppointment);
      if (data.updateAppointment.status[0].statusCode == '200') {
        navigation.navigate('AppointmentsList');
      }
    },
    onError: (data) => {
      console.log('add appointment error', data);
    }
  });

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
            progress={1}
            borderColor={Colors.white}
            unfilledColor={'#e6e7e9'}
            width={DeviceInfo.isTablet() ? 800 : 264}
          />
          <Text style={styles.txtProgress}>Step 4/4</Text>
        </View>

        <Text style={styles.txtAddSubjectTitle}>Location</Text>
        <View style={styles.locationContainer}>
          <Text style={styles.txtTitle}>LOCATION</Text>
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={openLocation}
            value={valueLocation}
            items={location?.map((item) => ({
              label: item.title,
              value: item.locationId
            }))}
            arrowIconStyle={{
              height: SIZES[12],
              width: SIZES[14]
            }}
            setOpen={() => {
              setOpenLocation(!openLocation);
            }}
            setValue={setValueLocation}
            setItems={setItems}
            placeholder={item.locationName}
            placeholderStyle={{
              ...Fonts.PoppinsRegular[14]
            }}
            style={{
              borderWidth: 0,
              paddingRight: SIZES[16],
              paddingLeft: 0
            }}
            textStyle={{ ...Fonts.PoppinsRegular[14] }}
          />
          <Divider style={styles.divider} />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={'View details'}
            onPress={() => navigation.navigate('LocationDetails')}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Add location'}
            onPress={() =>
              navigation.navigate('AddLocation', { locationType: 2 })
            }
            layoutStyle={[
              // {
              //     opacity: title === "" || discription === "" ? 0.5 : null,
              // },
              styles.cancelBtnLayout
            ]}
            textStyle={styles.txtCancelButton}
          />
        </View>

        <View style={styles.locationContainer}>
          <Text style={styles.txtTitle}>VIDEO CONFERENCING PLATFORM</Text>
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={openVideoConference}
            value={valueVideoConference}
            items={[
              {
                value: 1,
                label: 'Google Meet'
              },
              {
                value: 2,
                label: 'Microsoft Teams'
              }
            ]}
            arrowIconStyle={{
              height: SIZES[12],
              width: SIZES[14]
            }}
            setOpen={() => {
              setOpenVideoConference(!openVideoConference);
            }}
            setValue={setValueVideoConference}
            setItems={setItems}
            placeholder={item.platformName}
            placeholderStyle={{
              ...Fonts.PoppinsRegular[14]
            }}
            style={{
              borderWidth: 0,
              paddingRight: SIZES[16],
              paddingLeft: 0
            }}
            textStyle={{ ...Fonts.PoppinsRegular[14] }}
          />
          <Divider style={styles.divider} />
        </View>
      </View>
      <View
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'flex-end'
        }}
      >
        {/* Divider */}
        <Divider style={styles.divider} />
        <View
          style={[styles.buttonContainer, { paddingHorizontal: SIZES[16] }]}
        >
          <Button
            title={'Back'}
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            onPress={() => {
              console.log(valueLocation, platform.platformId);
              addAppointment({
                variables: {
                  appointment: {
                    appointmentDescription: discription,
                    appointmentId: item.appointmentId,
                    appointmentTitle: title,
                    attachFileIds: attachFiles,
                    committeeId: committee,
                    locationId: valueLocation,
                    platformId: platform.platformId,
                    repeat: Repeat,
                    required: userRequired,
                    setDate: startDate,
                    setTime: startTime,
                    endDate: endDate,
                    endTime: endTime,
                    timeZone: TimeZone,
                    userIds: users
                  }
                }
              });
            }}
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

export default EditAppointmentLocation;
