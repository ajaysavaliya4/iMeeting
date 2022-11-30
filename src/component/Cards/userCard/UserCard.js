import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Divider, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../../../themes/Colors';
import { Fonts } from '../../../themes';
import Icon from '../../Icon';
import IconName from '../../Icon/iconName';
import { SIZES } from '../../../themes/Sizes';
import Avatar from '../../Avatar/Avatar';
import EditDeleteModal from '../../EditDeleteModal';
import { styles } from './styles';
import { getHighlightedText } from '../../highlitedText/HighlitedText';
import { UserContext } from '../../../context';

const UserCard = ({
  item,
  index,
  text,
  isSwitchOnRow,
  required,
  setRequired,
  userSelect,
  editable,
  deleted,
  userDetails
}) => {
  const navigation = useNavigation();
  const [editModal, setEditModal] = useState(false);
  // const { required, setRequired } = useContext(UserContext);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const { selectedUsers } = useContext(UserContext);

  useEffect(() => {
    if (isSwitchOn) {
      setRequired((prev) => {
        const pevDaa = prev.filter((ite) => {
          return ite.user !== item.userId;
        });
        return [
          ...pevDaa,
          {
            user: item.userId,
            isRequired: isSwitchOn
          }
        ];
      });
    } else {
      setRequired((prev) => {
        const pevDaa = prev.filter((ite) => {
          return ite.user !== item.userId;
        });
        return [
          ...pevDaa,
          {
            user: item.userId,
            isRequired: isSwitchOn
          }
        ];
      });
    }
  }, [isSwitchOn]);

  const onDeleteHandler = () => {
    setEditModal(false);
    Alert.alert('Delete Subject', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () => console.log('delete Pressed'),
        style: 'destructive'
      },
      {
        text: 'Cancel',
        // onPress: () => navigation.navigate("Login"),
        style: 'cancel'
      }
    ]);
  };

  // useEffect(() => {
  //   let newRequired;
  //   if (isSwitchOn) {
  //     newRequired = required.push(true);
  //   } else {
  //     newRequired = required.pop(true);
  //   }
  //   setRequired(newRequired);
  // }, [isSwitchOn]);

  const RowData = ({
    name,
    discription,
    style,
    styleText,
    switchView,
    value
  }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        {switchView && (
          <Switch
            color={Colors.switch}
            value={value}
            onValueChange={() => setIsSwitchOn(!isSwitchOn)}
          />
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={style} />
          <Text style={[styles.discription, styleText]}>{discription}</Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setEditModal(false)}
      key={index}
    >
      {index == 0 ? null : <Divider style={styles.divider} />}
      {/* committee details */}
      <View style={styles.committeeDetailView}>
        <View style={styles.userDetails}>
          <Avatar name={item.firstName} size={SIZES[32]} />
          {/* <Text
            style={styles.txtCommitteeTitle}
          >{`${item.firstName} ${item.secondName}`}</Text> */}
          <Text
            style={{
              marginLeft: SIZES[12],

              width: '80%'
            }}
            numberOfLines={1}
          >
            {getHighlightedText(
              item.firstName
                ? item.firstName + ' ' + item.secondName
                : `${item.userName}`,
              text
            )}
          </Text>
        </View>

        <RowData
          name={'E-mail'}
          discription={item.emails ? item.emails : item.email}
        />
        <RowData
          name={'Role'}
          discription={
            item.roles
              ? item.roles.join(', ')
              : item.yourRoleName
              ? item.yourRoleName
              : item.roleName
          }
        />
        <RowData
          name={'Available'}
          discription={item?.isAvailable || 'Unknown'}
          style={{
            height: SIZES[8],
            width: SIZES[8],
            backgroundColor: item?.isAvailable
              ? '#81AB96'
              : 'Unknown'
              ? '#E6C54F'
              : '#DD7878',
            borderRadius: SIZES[4],
            marginRight: SIZES[8]
          }}
        />
        <RowData
          name={'Answer'}
          discription={item.answer}
          styleText={{ ...Fonts.PoppinsSemiBold[14], color: Colors.secondary }}
        />
        <RowData
          name={'Required'}
          discription={item.isRequired}
          switchView={isSwitchOnRow}
          value={item.isRequired || isSwitchOn}
        />
      </View>

      {/* dotsView */}
      {userSelect && (
        <TouchableOpacity
          onPress={() => setEditModal(!editModal)}
          style={styles.dotsView}
        >
          <Icon name={IconName.Dots} height={SIZES[16]} width={SIZES[4]} />
        </TouchableOpacity>
      )}
      {editModal && (
        <View style={styles.modalView}>
          <EditDeleteModal
            onPressDelete={onDeleteHandler}
            subjectStatus={'NoDeleted'}
            deleted={deleted}
            editable={editable}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default UserCard;
