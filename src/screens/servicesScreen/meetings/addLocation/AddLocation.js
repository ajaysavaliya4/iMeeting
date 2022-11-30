import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';
import React, { useState } from 'react';
import { Divider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useMutation } from '@apollo/client';

import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { SIZES } from '../../../../themes/Sizes';
import { Button } from '../../../../component/button/Button';
import { styles } from './styles';
import { Colors } from '../../../../themes/Colors';
import { UPDATE_LOCATION } from '../../../../graphql/mutation';
import { GET_ALL_LOCATION } from '../../../../graphql/query';

const AddLocation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { locationType } = route?.params;
  const [linkText, setLinkText] = useState('');
  const [title, setTitle] = useState('');
  const [capacity, setCapacity] = useState('');
  const [city, setCity] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [street, setStreet] = useState('');
  const [room, setRoom] = useState('');

  const [addLocation, { data, loading, error: addLocationError }] = useMutation(
    UPDATE_LOCATION,
    {
      refetchQueries: [
        { query: GET_ALL_LOCATION, variables: { locationType: locationType } }
      ],
      onCompleted: (data) => {
        if (data) {
          console.log(data.updateLocation.status[0]);
          if (data.updateLocation.status[0].statusCode == '200') {
            navigation.goBack();
          }
          // navigation.goBack();
        }
      }
    }
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Add location'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />
      {addLocationError && (
        <Text style={{ alignSelf: 'center', color: Colors.Rejected }}>
          Please enter valid field
        </Text>
      )}
      <ScrollView
        style={styles.subContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.txtLocationDetailsTitle}>Add location</Text>
        <View style={styles.generalContainer}>
          <Text style={styles.txtTitleGeneral}>General</Text>

          <Text style={styles.txtTitle}>TITLE</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setTitle(text)}
          />
          <Divider style={styles.divider} />

          <Text style={styles.txtTitle}>PEOPLE CAPACITY</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setCapacity(text)}
            keyboardType="numeric"
          />
          <Divider style={styles.divider} />
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.txtTitleGeneral}>Address</Text>

          <Text style={styles.txtTitle}>CITY</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setCity(text)}
          />
          <Divider style={styles.divider} />

          <Text style={styles.txtTitle}>STREET</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => setStreet(text)}
          />
          <Divider style={styles.divider} />

          <View style={styles.buildingContainer}>
            <View style={{ width: '30%' }}>
              <Text style={styles.txtTitle}>BUILDING</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => setBuilding(text)}
                keyboardType="numeric"
              />
              <Divider style={styles.divider} />
            </View>
            <View style={{ width: '30%' }}>
              <Text style={styles.txtTitle}>FLOOR</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => setFloor(text)}
                keyboardType="numeric"
              />
              <Divider style={styles.divider} />
            </View>
            <View style={{ width: '30%' }}>
              <Text style={styles.txtTitle}>ROOM</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => setRoom(text)}
                keyboardType="numeric"
              />
              <Divider style={styles.divider} />
            </View>
          </View>

          <Text style={styles.txtTitle}>Google Map URL</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: SIZES[10]
            }}
          >
            <TextInput
              onChangeText={(text) => setLinkText(text)}
              style={{ flex: 1 }}
            />
            <TouchableOpacity onPress={() => Clipboard.setString(linkText)}>
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
            title={'Cancel'}
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            onPress={() => {
              console.log(
                'building',
                parseInt(building),
                'city',
                city,
                'floor',
                parseInt(floor),
                'googleMapURL',
                linkText,
                'locationId',
                0,
                'peopleCapacity',
                parseInt(capacity),
                'room',
                parseInt(room),
                'street',
                street,
                'title',
                title,
                'locationType',
                2
              );
              addLocation({
                variables: {
                  location: {
                    building: parseInt(building),
                    city: city,
                    floor: parseInt(floor),
                    googleMapURL: linkText,
                    locationId: 0,
                    peopleCapacity: parseInt(capacity),
                    room: parseInt(room),
                    street: street,
                    title: title,
                    locationType: locationType
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

export default AddLocation;
