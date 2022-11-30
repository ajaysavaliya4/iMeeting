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
import { useQuery } from '@apollo/client';
import {
  GET_ALL_LOCATION,
  GET_ALL_LOCATION_BY_ID,
  GET_PLATFORMLINK
} from '../../../../graphql/query';

const EditMeetingLocation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    attachFiles,
    committee,
    title,
    discription,
    users,
    userRequired,
    startDate,
    endDate,
    startTime,
    endTime,
    TimeZone,
    Repeat,
    item
  } = route?.params;
  console.log('meeting data from Editmeetinglocation', {
    attachFiles,
    committee,
    title,
    discription,
    users,
    userRequired,
    startDate,
    endDate,
    startTime,
    endTime,
    TimeZone,
    Repeat,
    item
  });
  const [openLocation, setOpenLocation] = useState(false);
  const [valueLocation, setValueLocation] = useState(item.locationId);
  const [openVideoConference, setOpenVideoConference] = useState(false);
  const [valueVideoConference, setValueVideoConference] = useState(
    item.platformId
  );
  const [platform, setPlatform] = useState(null);
  const [location, setLocation] = useState([]);
  const [locationId, setLocationId] = useState([]);
  const [items, setItems] = useState([
    { label: 'Google meet', value: 1 },
    { label: 'Team meet', value: 2 }
  ]);

  const {
    loading: LocationLoading,
    error: LocationError,
    data: LocationData
  } = useQuery(GET_ALL_LOCATION, {
    variables: {
      locationType: 1
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

  const Location = useQuery(GET_ALL_LOCATION_BY_ID, {
    variables: {
      locationId: item.locationId
    },
    onCompleted: (data) => {
      console.log('location by id', data);
      if (data) {
        setLocationId(data.location);
      }
    },
    onError: (data) => {
      console.log('error in get meeting by id', data);
    }
  });

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
            progress={0.8}
            borderColor={Colors.white}
            unfilledColor={'#e6e7e9'}
            width={DeviceInfo.isTablet() ? 800 : 264}
          />
          <Text style={styles.txtProgress}>Step 4/5</Text>
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
            placeholder={locationId?.title}
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
            onPress={() =>
              navigation.navigate('LocationDetails', {
                locationId: valueLocation,
                platform: platform
              })
            }
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Add location'}
            onPress={() =>
              navigation.navigate('AddLocation', { locationType: 1 })
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
            placeholder={
              valueVideoConference == 1 ? 'Google Meet' : 'Microsoft Teams'
            }
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
            title={'Next'}
            onPress={() =>
              navigation.navigate('EditMeetingSubjects', {
                attachFiles,
                committee,
                title,
                discription,
                users,
                userRequired,
                startDate,
                endDate,
                startTime,
                endTime,
                TimeZone,
                Repeat,
                platform: platform,
                location: valueLocation,
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

export default EditMeetingLocation;
