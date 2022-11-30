import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../../../themes/Colors';
import { Fonts } from '../../../themes';
import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import { Divider } from 'react-native-paper';
import EditDeleteModal from '../../EditDeleteModal';
import { SIZES } from '../../../themes/Sizes';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_All_APPOINTMENT,
  GET_APPOINTMENT_BY_ID
} from '../../../graphql/query';
import { DELETE_APPOINTMENT, DELETE_SUBJECTS } from '../../../graphql/mutation';
import { styles } from './styles';
import { getHighlightedText } from '../../highlitedText/HighlitedText';
import moment from 'moment';

const AppoinmentCard = ({
  item,
  index,
  text,
  visibleIndex,
  setVisibleIndex
}) => {
  const navigation = useNavigation();
  const [data, setData] = useState('');

  const LocationById = useQuery(GET_APPOINTMENT_BY_ID, {
    variables: {
      id: item.appointmentId
    },
    onCompleted: (data) => {
      console.log('appointment by id', data.appointment);
      if (data) {
        setData(data.appointment);
      }
    }
  });

  const [deleteAppointment] = useMutation(DELETE_APPOINTMENT, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [
      {
        query: GET_All_APPOINTMENT,
        variables: { searchValue: '' }
      }
    ],
    onCompleted: (data) => {
      console.log('delete appointment', data.deleteAppointment.status);
    }
  });

  // <View> {getHighlightedText(item.subjectTitle)} </View>;

  const onDeleteHandler = (id) => {
    console.log(id);
    setEditModal(false);
    Alert.alert('Delete Subject', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () =>
          deleteAppointment({
            variables: {
              id: id
            }
          }),
        style: 'destructive'
      },
      {
        text: 'Cancel',
        // onPress: () => {
        //   deleteSubject({
        //     variables: {
        //       subjectId: id
        //     }
        //   });
        // },
        style: 'cancel'
      }
    ]);
  };

  const RowData = ({
    name,
    discription,
    backgroundColor,
    style,
    marginLeft
  }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        <View
          style={[
            styles.discriptionView,
            { backgroundColor: backgroundColor, marginLeft: marginLeft }
          ]}
        >
          <Text style={[styles.discription, style]}>{discription}</Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setVisibleIndex(-1)}
      key={index}
    >
      {index !== 0 && <Divider style={styles.divider} />}

      {/* committee details */}
      <View
        style={styles.committeeDetailView}
        onPress={() => {
          // navigation.navigate("SubjectDetails");
          setEditModal(false);
        }}
        activeOpacity={0.5}
      >
        {getHighlightedText(item.appointmentTitle, text)}

        {/* subject details */}
        <RowData name={'Committee'} discription={item.committeeName} />
        <RowData name={'Your role'} discription={item.yourRoleName} />
        <RowData
          name={'Date & Time'}
          discription={`${moment(item.setTime).format('DD MMM YYYY')},${
            data.setTime
          }`}
        />
        <RowData name={'Location'} discription={item.locationName} />
      </View>

      {/* dotsView */}
      <TouchableOpacity
        onPress={() => setVisibleIndex(!visibleIndex ? -1 : index)}
        style={styles.dotsView}
      >
        <Icon name={IconName.Dots} height={16} width={6} />
      </TouchableOpacity>
      {visibleIndex == index && (
        <View style={styles.modalView}>
          <EditDeleteModal
            onPressDownload={() => navigation.navigate('SubjectDownload')}
            subjectStatus={item.isDisable && 'Deleted'}
            onPressDelete={() => {
              onDeleteHandler(item.appointmentId);
              setVisibleIndex(-1);
            }}
            onPressEdit={() => {
              navigation.navigate('EditAppointmentGeneral', { data });
              setVisibleIndex(-1);
            }}
            onPressView={() => {
              navigation.navigate('AppointmentDetails', { item });
              setVisibleIndex(-1);
            }}
            editable={
              item.yourRoleName == 'Member' && item.isDisable ? false : true
            }
            deleted={
              item.yourRoleName == 'Member' && item.isDisable ? false : true
            }
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default AppoinmentCard;
