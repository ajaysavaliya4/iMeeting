import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Divider } from 'react-native-paper';

import { styles } from './styles';
import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { SIZES } from '../../../../themes/Sizes';
import { Button } from '../../../../component/button/Button';
import { Colors } from '../../../../themes/Colors';
import { GET_ALL_LOCATION_BY_ID } from '../../../../graphql/query';
import { useQuery } from '@apollo/client';

const LocationDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { locationId, platform } = route?.params;
  const [location, setLocation] = useState({});
  const [role, setRole] = useState('Head');

  // get location by id
  const {
    loading: LocationLoading,
    error: LocationError,
    data: LocationData
  } = useQuery(GET_ALL_LOCATION_BY_ID, {
    variables: {
      locationId: locationId
    },

    onCompleted: (data) => {
      console.log('get location by id', data);
      // setSubjectData(data?.subjects.items);
      setLocation(data.location);
    }
  });
  if (LocationError) {
    console.log('LocationError', LocationError);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Location details'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.subContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.txtLocationDetailsTitle}>Location details</Text>
        <View style={styles.generalContainer}>
          <Text style={styles.txtTitleGeneral}>General</Text>

          <Text style={styles.txtTitle}>Title</Text>
          <Text style={styles.discription}>{location.title}</Text>
          <Divider style={styles.divider} />

          <Text style={styles.txtTitle}>People capacity</Text>
          <Text style={styles.discription}>{location.peopleCapacity}</Text>
          <Divider style={styles.divider} />
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.txtTitleGeneral}>Address</Text>

          <Text style={styles.txtTitle}>City</Text>
          <Text style={styles.discription}>{location.city}</Text>
          <Divider style={styles.divider} />

          <Text style={styles.txtTitle}>Street</Text>
          <Text style={styles.discription}>{location.street}</Text>
          <Divider style={styles.divider} />

          <Text style={styles.txtTitle}>Building / Floor / Room</Text>
          <Text
            style={styles.discription}
          >{`${location?.building}, ${location?.floor}, ${location?.room}`}</Text>
          <Divider style={styles.divider} />

          <Text style={styles.txtTitle}>Google Map URL</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: SIZES[10]
            }}
          >
            <Text style={styles.txtUrl}>{location.googleMapURL}</Text>
            <TouchableOpacity
              onPress={() => Clipboard.setString(location.googleMapURL)}
            >
              <Icon
                name={IconName.CopyText}
                height={SIZES[20]}
                width={SIZES[20]}
              />
            </TouchableOpacity>
          </View>
          <Divider style={styles.divider} />
        </View>
      </ScrollView>
      {role == 'Head' || role == 'Secretory' ? (
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
              title={'Close'}
              onPress={() => navigation.goBack()}
              layoutStyle={styles.cancelBtnLayout}
              textStyle={styles.txtCancelButton}
            />
            <Button
              title={'Edit'}
              onPress={() =>
                navigation.navigate('EditLocation', {
                  meetingLocation: location
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
      ) : (
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
              title={'Close'}
              onPress={() => navigation.goBack()}
              layoutStyle={[styles.cancelBtnLayout, { width: '100%' }]}
              textStyle={styles.txtCancelButton}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default LocationDetails;
