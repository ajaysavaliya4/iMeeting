import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import { useMutation, useQuery } from '@apollo/client';
import moment from 'moment';

import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import Icon from '../Icon';
import IconName from '../Icon/iconName';
import EditDeleteModal from '../EditDeleteModal';
import { SIZES } from '../../themes/Sizes';
import { GET_ALL_LOCATION_BY_ID, GET_All_MEETING } from '../../graphql/query';
import { UserContext } from '../../context';
import { DELETE_MEETING } from '../../graphql/mutation';
import { getHighlightedText } from '../highlitedText/HighlitedText';

const MeetingsCard = ({ item, text, index, visibleIndex, setVisibleIndex }) => {
  const navigation = useNavigation();

  const [location, setLocation] = useState('');
  const [role, setRole] = useState(item.yourRoleName);
  const [showModal, setShowModal] = useState(false);

  const {
    loading: loadingLocation,
    error: errorLocation,
    data: dataLocation
  } = useQuery(GET_ALL_LOCATION_BY_ID, {
    variables: {
      locationId: item.locationId
    },
    onCompleted: (data) => {
      if (data) {
        setLocation(data?.location.city);
      }
    }
  });

  if (errorLocation) {
    console.log('errorLocation', errorLocation);
  }

  const [deleteMeeting, { data, loading, error }] = useMutation(
    DELETE_MEETING,
    {
      // export const GET_All_SUBJECTS = gql`
      refetchQueries: [
        {
          query: GET_All_MEETING,
          variables: {
            onlyMyMeeting: false,
            screen: 0
          }
        }
      ],
      onCompleted: (data) => {
        console.log('delete meeting', data.deleteMeeting.status);
      }
    }
  );

  if (error) {
    Alert.alert('Delete Subject Error', [
      {
        text: error,

        style: 'default'
      }
    ]);
  }

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

  const RowData = ({ name, discription, style, btnStyle }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        <View style={[styles.discriptionView, btnStyle]}>
          <Text style={[styles.discription, style]}>{discription}</Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => setVisibleIndex(-1)}>
      {index !== 0 && <Divider style={styles.divider} />}

      {/* committee details */}
      <View style={styles.committeeDetailView}>
        {getHighlightedText(item.meetingTitle, text)}
        {/* <Text style={styles.txtCommitteeTitle} numberOfLines={1}>
          {item.title}
        </Text> */}

        <RowData
          name={'Date & Time'}
          discription={moment(item.setDate).format('D MMMM YYYY,hh:mm A')}
        />
        <RowData name={'Location'} discription={location} />
        <RowData
          name={'Status'}
          discription={item.meetingStatusTitle}
          style={{
            color: Colors.bold,
            ...Fonts.PoppinsSemiBold[14]
          }}
          marginLeft={24}
          btnStyle={{
            backgroundColor: Colors.white,
            marginLeft: SIZES[24],
            borderColor: Colors.line,
            borderWidth: SIZES[1],
            borderRadius: SIZES[8]
          }}
        />
      </View>

      {/* dotsView */}
      <TouchableOpacity
        onPress={() => {
          setShowModal(!showModal);

          setVisibleIndex(visibleIndex == -1 ? index : -1);
        }}
        style={styles.dotsView}
      >
        <Icon name={IconName.Dots} height={16} width={6} />
      </TouchableOpacity>
      {visibleIndex === index && (
        <View style={styles.modalView}>
          <EditDeleteModal
            onPressDelete={() => {
              onDeleteHandler();
              setVisibleIndex(-1);
            }}
            onPressView={() => {
              navigation.navigate('MeetingDetails', { item });
              setVisibleIndex(-1);
            }}
            onPressEdit={() => {
              setVisibleIndex(-1);
              navigation.navigate('EditMeetingGeneral', { item });
            }}
            subjectStatus={item.meetingStatusTitle}
            editable={role == 'Head' || role == 'Secretory' ? true : false}
            deleted={role == 'Head' || role == 'Secretory' ? true : false}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default MeetingsCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES[12]
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  txtCommitteeName: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary,
    width: '30%'
  },
  discription: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
  committeeDetailView: {
    paddingVertical: SIZES[24],
    paddingHorizontal: SIZES[16],
    width: '90%'
  },
  txtCommitteeTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold
  },
  dotsView: {
    position: 'absolute',
    right: SIZES[18],
    top: SIZES[32],
    width: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  discriptionView: {
    paddingVertical: SIZES[6],
    paddingHorizontal: SIZES[24],
    borderRadius: SIZES[8]
  },
  modalView: {
    position: 'absolute',
    top: SIZES[60],
    right: SIZES[8]
  }
});
