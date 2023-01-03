import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert
} from 'react-native';
import React, { useState } from 'react';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@apollo/client';

import { styles } from './styles';
import { Icon, IconName } from '../../../../component';
import { SIZES } from '../../../../themes/Sizes';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import Loader from '../../../../component/Loader/Loader';
import { GET_ALL_TASKS } from '../../../../graphql/query';
import TasksDetailsCard from '../../../../component/Cards/tasksDetailsCard/TasksDetailsCard';
import { DELETE_TASK } from '../../../../graphql/mutation';

const TasksList = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [tasksData, setTasksData] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  // get ALL appointment
  const Tasks = useQuery(GET_ALL_TASKS, {
    variables: {
      searchValue: searchText,
      onlyMyTask: false
    },

    onCompleted: (data) => {
      console.log('all tasks', data?.tasks.items);

      setTasksData(data?.tasks.items);
    },
    onError: (data) => {
      console.log('all tasks error', data);
    }
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: ['tasks'],
    onCompleted: (data) => {
      console.log('delete tasks', data.deleteTask.status);
    }
  });

  const onDeleteHandler = (id) => {
    console.log(id);

    Alert.alert('Delete Subject', 'Are you sure you want to delete this?', [
      {
        text: 'Delete',
        onPress: () =>
          deleteTask({
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
        <Text style={styles.txtHeader}>Tasks</Text>
        <View style={styles.headeRightView}>
          <TouchableOpacity
            style={styles.searchIconView}
            onPress={() => setSearch(!search)}
          >
            <Icon name={IconName.Search} height={SIZES[18]} width={SIZES[18]} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AddTask', {
                meetingDetails: null,
                isMeetingTask: false,
                isEdit: false,
                taskData: null
              });
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
                placeholder={'Search tasks'}
              />
              <TouchableOpacity
                onPress={() => {
                  setSearchText('');
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
            <TouchableOpacity
              style={styles.committeeView}
              activeOpacity={0.5}
              onPress={() => navigation.navigate('FilterTask')}
            >
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
            <TouchableOpacity style={styles.committeeView} activeOpacity={0.5}>
              <Text style={styles.txtCommittee}>Secretary permission</Text>
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

        {tasksData.length > 0 ? (
          <FlatList
            data={tasksData}
            keyExtractor={(item, index) => {
              return index.toString();
            }}
            renderItem={({ item, index }) => {
              return (
                <TasksDetailsCard
                  item={item}
                  index={index}
                  visibleIndex={visibleIndex}
                  editable={true}
                  setVisibleIndex={setVisibleIndex}
                  isDeleteable={true}
                  onPressDelete={(items) => {
                    console.log('delete task item', items);
                    onDeleteHandler(items?.taskId);
                    setVisibleIndex(-1);
                  }}
                  text={searchText}
                  onPressEdit={(items) => {
                    setVisibleIndex(-1);
                    navigation.navigate('AddTask', {
                      meetingDetails: null,
                      isMeetingTask: false,
                      isEdit: true,
                      taskData: items
                    });
                  }}
                />
              );
            }}
            showsVerticalScrollIndicator={false}
          />
        ) : Tasks.error ? (
          <View
            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
          >
            <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
              {Tasks?.error?.message == 'Network request failed'
                ? 'No Internet connection'
                : Tasks?.error?.message}
            </Text>
          </View>
        ) : Tasks.loading ? (
          <Loader color={Colors.primary} />
        ) : (
          <View
            style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
          >
            <Text style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}>
              No tasks found
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default TasksList;
