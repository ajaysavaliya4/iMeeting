import { View, Text, TouchableOpacity, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

import { styles } from './styles';
import EditDeleteModal from '../../../../component/EditDeleteModal';
import { SIZES } from '../../../../themes/Sizes';
import { Colors } from '../../../../themes/Colors';
import { Icon, IconName } from '../../../../component';
import { Divider } from 'react-native-paper';
import { getHighlightedText } from '../../../../component/highlitedText/HighlitedText';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_SUBJECT_STATUS } from '../../../../graphql/mutation';
import { GET_ALL_SUBJECTS_STATUS } from '../../../../graphql/query';

const AddSubjectsCard = ({
  item,
  searchText,
  index,
  visibleIndex,
  setVisibleIndex,
  openIndex,
  setOpenIndex
}) => {
  console.log(item);
  const [editModal, setEditModal] = useState(false);
  const [valueStatus, setValueStatus] = useState('Created');
  const [openStatus, setOpenStatus] = useState(false);
  const [subjectStatus, setSubectStatus] = useState([]);
  const [items, setItems] = useState([{ label: 'Design', value: 'design' }]);

  const getSubjectStatus = useQuery(GET_ALL_SUBJECTS_STATUS, {
    onCompleted: (data) => {
      console.log('subject status', data.subjectStatus.items);
      if (data) {
        setSubectStatus(data.subjectStatus.items);
      }
    },
    onError: (data) => {
      console.log('subject status error', data);
    }
  });

  useEffect(() => {
    subjectStatus?.map((status) => {
      console.log('subjectStatusId', status.subjectStatusId);
      console.log('subjectStatus', status.subjectStatus);
      setItems([
        {
          label: status.subjectStatus,
          value: status.subjectStatusId
        }
      ]);
    });
  }, [subjectStatus]);

  // const getSubjectStatus = useQuery(GET_ALL_SUBJECTS_STATUS, {
  //   onCompleted: (data) => {
  //     console.log('subject status', data.subjectStatus.items);
  //   },
  //   onError: (data) => {
  //     console.log('get subject status error', data);
  //   }
  // });

  const [updateSubjectStatus] = useMutation(UPDATE_SUBJECT_STATUS, {
    onCompleted: (data) => {
      console.log('update subject status', data.updateSubjectStatus.status);
    },
    onError: (data) => console.log('update subject status error', data)
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      key={index}
      style={[
        Platform.OS === 'ios'
          ? { zIndex: -2 * index }
          : { elevation: -2 * index, zIndex: -2 * index }
      ]}
      onPress={() => {
        setVisibleIndex(-1);
      }}
      index={index}
    >
      {/* committee details */}
      <View style={styles.committeeDetailView} activeOpacity={0.5}>
        {getHighlightedText(item.subjectTitle, searchText)}

        {/* subject details */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: SIZES[12]
          }}
        >
          <Text style={styles.txtSubjectsTitle}>Category</Text>
          <Text style={styles.txtDiscription}>{item.subjectCategoryName}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: SIZES[12]
          }}
        >
          <Text style={styles.txtSubjectsTitle}>Creator</Text>
          <Text style={styles.txtDiscription}>{item.createrName} </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: SIZES[12],
            width: '90%'
          }}
        >
          <Text style={styles.txtSubjectsTitle}>Status</Text>
          <DropDownPicker
            listMode="MODAL"
            open={openIndex == index}
            dropDownDirection="TOP"
            zIndex={2}
            value={valueStatus}
            listChildContainerStyle={{ height: 500 }}
            items={subjectStatus.map((status) => {
              return {
                label: status.subjectStatus,
                value: status.subjectStatusId
              };
            })}
            arrowIconStyle={{
              height: SIZES[12],
              width: SIZES[14]
            }}
            setOpen={() => {
              // setOpenStatus(!openStatus);
              setOpenIndex(index);
            }}
            onClose={() => {
              setOpenIndex(-1);
            }}
            setValue={setValueStatus}
            setItems={setItems}
            placeholder={item.subjectStatus}
            placeholderStyle={styles.txtDiscription}
            style={{
              borderWidth: 0,
              paddingHorizontal: SIZES[24],

              backgroundColor:
                valueStatus === 'Approved'
                  ? Colors.BG_Approved
                  : valueStatus === 'Verified'
                  ? Colors.BG_Verified
                  : valueStatus === 'Rejected'
                  ? Colors.BG_Rejected
                  : valueStatus === 'Deleted'
                  ? Colors.BG_Rejected
                  : valueStatus === 'Pending'
                  ? Colors.BG_Pending
                  : Colors.BG_Transferred
            }}
            containerStyle={{
              width: '52%',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            textStyle={[
              styles.txtDiscription,
              {
                color:
                  valueStatus === 'Approved'
                    ? Colors.Approved
                    : valueStatus === 'Verified'
                    ? Colors.Verified
                    : valueStatus === 'Rejected'
                    ? Colors.Rejected
                    : valueStatus === 'Deleted'
                    ? Colors.Rejected
                    : valueStatus === 'Pending'
                    ? Colors.Pending
                    : Colors.Transfered
              }
            ]}
          />
        </View>
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
          />
        </View>
      )}

      <Divider style={styles.divider} />
    </TouchableOpacity>
  );
};

export default AddSubjectsCard;
