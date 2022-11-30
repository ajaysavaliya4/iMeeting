import { View, Text, SafeAreaView, ScrollView, Switch } from 'react-native';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TASK_STATUS, GET_TASK_TYPES } from '../../../../graphql/query';
import Header from '../../../../component/header/Header';
import { styles } from './styles';
import { IconName } from '../../../../component';
import { useNavigation } from '@react-navigation/native';
import CheckBox from '../../../../component/checkBox/CheckBox';
import { Divider } from 'react-native-paper';
import { Colors } from '../../../../themes/Colors';
import { Button } from '../../../../component/button/Button';

const FilterTask = () => {
  const navigation = useNavigation();
  const [taskTypes, setTaskTypes] = useState([]);
  const [taskStatus, setTaskStatus] = useState([]);
  const [onlyMyTasks, setOnlyMyTasks] = useState(false);
  const [checkedTypes, setCheckedTypes] = useState({});

  // get all task type
  const taskType = useQuery(GET_TASK_TYPES, {
    onCompleted: (data) => {
      console.log('task type', data.taskType.items);
      if (data) {
        setTaskTypes(data.taskType.items);
      }
    },
    onError: (data) => {
      console.log('get task type error', data);
    }
  });

  // get all task status
  const taskStatusData = useQuery(GET_TASK_STATUS, {
    onCompleted: (data) => {
      console.log('task status', data.taskStatus.items);
      if (data) {
        setTaskStatus(data.taskStatus.items);
      }
    },
    onError: (data) => {
      console.log('get task status error', data);
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        leftIconName={IconName.Arrow_Left}
        name={'Filter'}
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.subContainer}>
        {/* task types filter */}
        <View style={styles.typeContainer}>
          <Text style={styles.txtTitle}>Type</Text>
          {taskTypes.map((type, index) => {
            return (
              <View key={index} style={styles.rowContainer}>
                <CheckBox
                  value={checkedTypes}
                  onValueChange={(newValue) => {
                    setCheckedTypes({ ...checkedTypes, [type.id]: newValue });
                  }}
                />
                <View
                  style={[
                    styles.round,
                    {
                      backgroundColor:
                        type.name == 'Subject approval'
                          ? '#E6C54F'
                          : type.name == 'Minutes of Meeting approval'
                          ? '#C8ABCD'
                          : type.name == 'Meeting task'
                          ? '#81AB96'
                          : type.name == 'Confirm attendance'
                          ? '#E79D73'
                          : type.name == 'Video Conference meeting'
                          ? '#E79D73'
                          : type.name == 'Schedule an appointment response'
                          ? '#658EB4'
                          : '#E6C54F'
                    }
                  ]}
                />
                <Text style={styles.txtDiscription}>{type.name}</Text>
              </View>
            );
          })}
        </View>

        {/* task status filter */}
        <View style={styles.typeContainer}>
          <Text style={styles.txtTitle}>Status</Text>
          {taskStatus.map((status, index) => {
            return (
              <View key={index} style={styles.rowContainer}>
                <CheckBox />
                <View
                  style={[
                    styles.round,
                    {
                      backgroundColor:
                        status.name == 'Open'
                          ? '#658EB4'
                          : status.name == 'In progress'
                          ? '#658EB4'
                          : status.name == 'Completed'
                          ? '#81AB96'
                          : status.name == 'Closed'
                          ? '#DD7878'
                          : status.name == 'Deleted'
                          ? '#DD7878'
                          : '#658EB4'
                    }
                  ]}
                />
                <Text style={styles.txtDiscription}>{status.name}</Text>
              </View>
            );
          })}
        </View>
        <Divider style={styles.divider} />
        <View style={styles.switchContainer}>
          <Text style={styles.txtSwitchLabel}>Only my tasks</Text>
          <Switch
            color={Colors.switch}
            value={onlyMyTasks}
            onChange={() => setOnlyMyTasks(!onlyMyTasks)}
          />
        </View>
        <Divider style={styles.divider} />
      </ScrollView>
      <View
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'flex-end'
        }}
      >
        {/* Divider */}
        <Divider style={styles.divider} />
        <View style={styles.buttonContainer}>
          <Button
            title={'Cancel'}
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            onPress={() =>
              navigation.navigate('AddAppointmentDateAndTime', {
                attachFiles,
                committee,
                title,
                discription,
                users
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
    </SafeAreaView>
  );
};

export default FilterTask;
