import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList
} from 'react-native';
import React, { useState } from 'react';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';

import { styles } from './styles';
import { Icon, IconName } from '../../../../component';
import { SIZES } from '../../../../themes/Sizes';
import AppoinmentCard from '../../../../component/Cards/appointmentCard/AppointmentCard';
import { GET_All_APPOINTMENT } from '../../../../graphql/query';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import Loader from '../../../../component/Loader/Loader';

const AppointmentsList = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [filterAppointmentsData, setFilterAppointmentsData] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  // get ALL appointment
  const Appointment = useQuery(GET_All_APPOINTMENT, {
    variables: {
      searchValue: searchText
    },

    onCompleted: (data) => {
      console.log('all appointment', data?.appointments.items);

      setAppointmentsData(data?.appointments.items);
    },
    onError: (data) => {
      console.log('all appointment error', data);
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name={IconName.Arrow_Left}
            height={SIZES[14]}
            width={SIZES[14]}
          />
        </TouchableOpacity>
        <Text style={styles.txtHeader}>Appointments</Text>
        <View style={styles.headeRightView}>
          <TouchableOpacity
            style={styles.searchIconView}
            onPress={() => setSearch(!search)}
          >
            <Icon name={IconName.Search} height={SIZES[18]} width={SIZES[18]} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AddAppointmentGeneral');
            }}
          >
            <Icon name={IconName.Plus} height={SIZES[14]} width={SIZES[14]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.subContainer}>
        {search ? (
          <View>
            <View style={styles.searchRowContainer}>
              <Icon
                name={IconName.Search}
                height={SIZES[12]}
                width={SIZES[12]}
              />
              <TextInput
                style={{ flex: 1, marginLeft: SIZES[6] }}
                onChangeText={(text) => {
                  setSearchText(text);
                }}
                value={searchText}
                placeholder={'Search appointments'}
              />
              <TouchableOpacity
                onPress={() => {
                  setSearchText('');

                  setFilterAppointmentsData(appointmentsData);
                }}
              >
                <Icon
                  name={IconName.Close}
                  height={SIZES[8]}
                  width={SIZES[8]}
                />
              </TouchableOpacity>
            </View>
            <Divider style={styles.divider} />
          </View>
        ) : (
          <View>
            {/* filter */}
            <TouchableOpacity style={styles.committeeView} activeOpacity={0.5}>
              <Text style={styles.txtCommittee}>Filter</Text>
              <View style={styles.btnCommittees}>
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

        {appointmentsData.length > 0 ? (
          <FlatList
            data={appointmentsData}
            keyExtractor={(item) => `${item.id}`}
            renderItem={({ item, index }) => {
              return (
                <AppoinmentCard
                  item={item}
                  index={index}
                  text={searchText}
                  visibleIndex={visibleIndex}
                  setVisibleIndex={setVisibleIndex}
                />
              );
            }}
            showsVerticalScrollIndicator={false}
          />
        ) : Appointment.error ? (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
              {Appointment.error.message}
            </Text>
          </View>
        ) : Appointment.loading ? (
          <Loader />
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
              No appointment found
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AppointmentsList;
