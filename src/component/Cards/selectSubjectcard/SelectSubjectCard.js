import {
  View,
  Text,
  TouchableOpacity,
  RecyclerViewBackedScrollViewComponent
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Divider } from 'react-native-paper';

import { styles } from './styles';
import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import EditDeleteModal from '../../EditDeleteModal';
import { SIZES } from '../../../themes/Sizes';
import CheckBox from '../../checkBox/CheckBox';
import { getHighlightedText } from '../../highlitedText/HighlitedText';
import { confirmButtonStyles } from 'react-native-modal-datetime-picker';
import { UserContext } from '../../../context';

const SelectSubjectCard = ({
  item,
  index,
  searchText,
  visibleIndex,
  setVisibleIndex
  // selectedSubjects,
  // setSelectedSubjects
}) => {
  const [editModal, setEditModal] = useState(false);
  const [selectSubject, setSelectSubject] = useState([]);
  const [isCheck, setIsCheck] = useState(false);
  const { selectedSubjects, setSelectedSubjects } = useContext(UserContext);

  console.log('selectedSubjects from select card', selectedSubjects);

  useEffect(() => {
    if (isCheck) {
      setSelectedSubjects((prev) => {
        const pevDaa = prev.filter((ite) => {
          return ite.subjectId !== item.subjectId;
        });
        return [...pevDaa, item];
      });
    } else {
      setSelectedSubjects((prev) => {
        const pevDaa = prev.filter((ite) => {
          return ite.subjectId !== item.subjectId;
        });
        return [...pevDaa, item];
      });
    }
  }, [isCheck]);

  // console.log('selected subject from select subject', selectSubject);

  const RowData = ({ name, discription }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        <Text style={styles.discription} numberOfLines={1}>
          {discription}
        </Text>
      </View>
    );
  };
  return (
    <TouchableOpacity
      key={index}
      activeOpacity={1}
      onPress={() => setVisibleIndex(-1)}
    >
      {/* committee details */}
      <Text style={{ marginLeft: SIZES[12], marginTop: SIZES[24] }}>
        {getHighlightedText(`${item.subjectTitle} `, searchText)}
      </Text>
      {/* <Text style={styles.txtCommitteeTitle}>{item.subjectTitle}</Text> */}
      <View style={styles.userDetailsContainer}>
        <View style={{ width: '50%' }}>
          <RowData name={'ID'} discription={item.subjectId} />
          <RowData name={'Category'} discription={item.subjectCategoryName} />
          <RowData name={'Creator'} discription={item.createrName} />
        </View>
        <CheckBox
          value={isCheck}
          onValueChange={() => setIsCheck(!isCheck)}
          disabled={item.subjectStatus == 'Deleted' ? true : false}
        />
      </View>
      <Divider style={styles.divider} />

      {/* dotsView */}
      <TouchableOpacity
        onPress={() => setVisibleIndex(!visibleIndex ? -1 : index)}
        style={styles.dotsView}
      >
        <Icon name={IconName.Dots} height={SIZES[16]} width={SIZES[4]} />
      </TouchableOpacity>
      {visibleIndex == index && (
        <View style={styles.modalView}>
          <EditDeleteModal download={false} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SelectSubjectCard;
