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
import { useMutation } from '@apollo/client';
import { GET_All_SUBJECTS } from '../../../graphql/query';
import { DELETE_SUBJECTS } from '../../../graphql/mutation';
import { styles } from './styles';
import { ModalContext } from '../../../context';
import { getHighlightedText } from '../../highlitedText/HighlitedText';

const SubjectsCard = ({
  item,
  index,
  searchText,
  visibleIndex,
  setVisibleIndex
}) => {
  console.log('index', index);
  const navigation = useNavigation();

  const [deleteSubject, { data, loading, error }] = useMutation(
    DELETE_SUBJECTS,
    {
      // export const GET_All_SUBJECTS = gql`
      refetchQueries: [
        {
          query: GET_All_SUBJECTS,
          variables: {
            screen: 0
          }
        }
      ]
    }
  );
  if (data) {
    console.log('delete data', data.deleteSubject.status);
  }
  if (error) {
    Alert.alert('Delete Subject Error', [
      {
        text: error,

        style: 'default'
      }
    ]);
  }

  const onDeleteHandler = (id) => {
    console.log(id);
    setEditModal(false);
    Alert.alert('Delete Subject', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () =>
          deleteSubject({
            variables: {
              subjectId: id
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
    <TouchableOpacity activeOpacity={1} onPress={() => setVisibleIndex(-1)}>
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
        {getHighlightedText(item.subjectTitle, searchText)}
        {/* {getHighlightedText(item.subjectTitle)} */}

        {/* subject details */}
        <RowData name={'ID'} discription={item.subjectId} />
        <RowData name={'Category'} discription={item.subjectCategoryName} />
        <RowData name={'Creator'} discription={item.createrName} />
        <RowData
          name={'Status'}
          discription={item.subjectStatus}
          backgroundColor={
            item.subjectStatus === 'Approved'
              ? Colors.BG_Approved
              : item.subjectStatus === 'Verified'
              ? Colors.BG_Verified
              : item.subjectStatus === 'Rejected'
              ? Colors.BG_Rejected
              : item.subjectStatus === 'Deleted'
              ? Colors.BG_Rejected
              : item.subjectStatus === 'Pending'
              ? Colors.BG_Pending
              : Colors.BG_Transferred
          }
          style={{
            color:
              item.subjectStatus === 'Approved'
                ? Colors.Approved
                : item.subjectStatus === 'Verified'
                ? Colors.Verified
                : item.subjectStatus === 'Rejected'
                ? Colors.Rejected
                : item.subjectStatus === 'Deleted'
                ? Colors.Rejected
                : item.subjectStatus === 'Pending'
                ? Colors.Pending
                : Colors.Transfered
          }}
          marginLeft={24}
        />
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
            onPressDownload={() => {
              navigation.navigate('SubjectDownload', { item });
              setVisibleIndex(-1);
            }}
            subjectStatus={item.subjectStatus}
            onPressDelete={() => {
              onDeleteHandler(item.subjectId);
              setVisibleIndex(-1);
            }}
            onPressEdit={() => {
              navigation.navigate('EditSubject', { item });
              setVisibleIndex(-1);
            }}
            onPressView={() => {
              navigation.navigate('SubjectDetails', { item });
              setVisibleIndex(-1);
            }}
            download={true}
            editable={item.subjectStatus === 'Deleted' ? false : true}
            deleted={true}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SubjectsCard;
