import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Divider } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';

import { styles } from './styles';
import { IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { Fonts } from '../../../../themes';
import FilesCard from '../../../../component/Cards/FilesCard';
import { Button } from '../../../../component/button/Button';
import Header from '../../../../component/header/Header';
import {
  GET_All_COMMITTEE,
  GET_All_MEETING,
  GET_All_SUBJECTS,
  GET_All_SUBJECTS_CATEGORY,
  GET_COMMITTEE_BY_ID,
  GET_FILE
} from '../../../../graphql/query';
import { UPDATE_SUBJECTS } from '../../../../graphql/mutation';
import { SIZES } from '../../../../themes/Sizes';
import RNFetchBlob from 'rn-fetch-blob';

const AddSubjectScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { committee } = route?.params;
  console.log('committee from add subjects', committee);
  const [title, setTitle] = useState('');
  const [discription, setDescription] = useState('');
  const [openCategory, setOpenCategory] = useState(false);
  const [openCommittee, setOpenCommitee] = useState(false);
  const [openMeeting, setOpenMeeting] = useState(false);
  const [valueCategory, setValueCategory] = useState(null);
  const [valueCommittee, setValueCommittee] = useState(committee || null);
  const [valueMeeting, setValueMeeting] = useState(0);
  const [fileResponse, setFileResponse] = useState([]);
  const [filesId, setFilesId] = useState([]);
  const [token, setToken] = useState('');
  const [category, setCategory] = useState([]);
  const [committees, setCommittee] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [committeeData, setCommitteeData] = useState([]);
  const [items, setItems] = useState([{ label: 'Design', value: 'design' }]);
  let fileId = [];
  let file = [];

  // fetch file
  const [fetchFile, getFile] = useLazyQuery(GET_FILE);

  // fetch subject category
  const { loading: SubjectCategoryLoading, error: SubjeCategoryError } =
    useQuery(GET_All_SUBJECTS_CATEGORY, {
      onCompleted: (data) => {
        if (data) {
          console.log('subject category', data.subjectCategories.items);
          setCategory(data.subjectCategories.items);
        }
      }
    });

  if (SubjeCategoryError) {
    console.log('category error', SubjeCategoryError);
  }

  // fetch commitees
  const { loading: CommitteeLoading, error: CommitteeError } = useQuery(
    GET_All_COMMITTEE,
    {
      variables: { isDeleted: true },
      onCompleted: (data) => {
        if (data) {
          console.log('committees', data?.committees.items);
          setCommittee(data.committees.items);
        }
      }
    }
  );
  if (CommitteeError) {
    console.log('commitee error', CommitteeError);
  }

  // fetch meetings
  const { loading: MeetingLoading, error: MeetingError } = useQuery(
    GET_All_MEETING,
    {
      variables: { onlyMyMeeting: false, screen: 1 },
      onCompleted: (data) => {
        if (data) {
          console.log('meetings', data?.meetings.items);
          setMeetings(data.meetings.items);
        }
      }
    }
  );
  if (MeetingError) {
    console.log('MeetingError', MeetingError);
  }

  useEffect(() => {
    getToken();
  }, [token]);

  const getToken = async () => {
    const user = await AsyncStorage.getItem('@user').catch((e) =>
      console.log(e)
    );
    setToken(JSON.parse(user)?.dataToken);
  };
  console.log('token from add subject', token);

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pickMultiple({
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.allFiles]
      });
      console.log('file response', response);
      const url = await AsyncStorage.getItem('@url');
      response.map((res) => {
        if (res !== null) {
          const formData = new FormData();
          formData.append('file', res);
          console.log('formdata', formData);

          fetch(`https://${url}//o/imeeting-rest/v1.0/file-upload`, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + `${token}`,
              'Content-Type': 'multipart/form-data'
            },
            body: formData
          })
            .then((response) => response.json())
            .then((responseData) => {
              if (responseData) {
                setFileResponse((prev) => {
                  const pevDaa = prev.filter((ite) => {
                    return ite.fileEnteryId !== responseData.fileEnteryId;
                  });
                  return [...pevDaa, responseData];
                });
              }
            })

            .catch((e) => console.log('file upload error--', e));
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  console.log('fileId', fileResponse);

  useEffect(() => {
    const fileId = fileResponse.map((file) => file.fileEnteryId);

    setFilesId(fileId);
  }, [fileResponse]);

  const [addSubject, { data, loading, error }] = useMutation(UPDATE_SUBJECTS, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [
      {
        query: GET_All_SUBJECTS,
        variables: {
          searchValue: '',
          screen: committee ? 1 : 0,
          committeeIds: committee,
          page: -1,
          pageSize: -1
        }
      }
    ],
    onCompleted: (data) => {
      console.log(data);
    }
  });

  if (error) {
    console.log('addsubject error--', error);
  }

  const removeFile = (file) => {
    setFileResponse((prev) => {
      const pevDaa = prev.filter((ite) => {
        return ite.fileEnteryId !== file.fileEnteryId;
      });
      return [...pevDaa];
    });
  };

  const Committee = useQuery(GET_COMMITTEE_BY_ID, {
    variables: {
      organizationId: committee
    },
    onCompleted: (data) => {
      console.log('get committee by id', data);
      if (data) {
        setCommitteeData(data.committee);
      }
    },
    onError: (data) => {
      console.log('error in get committee by id', data);
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Add subject'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />

      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          setOpenMeeting(false);
          setOpenCategory(false);
          setOpenCommitee(false);
        }}
        activeOpacity={1}
      >
        <ScrollView
          style={styles.subContainer}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.txtAddSubjectTitle}>Add subject</Text>
          <View style={styles.committeeContainer}>
            <Text style={styles.txtTitle}>SELECT COMMITTEE</Text>
            <DropDownPicker
              disabled={committee ? true : false}
              listMode="SCROLLVIEW"
              open={openCommittee}
              value={valueCommittee}
              items={committees?.map((item) => ({
                label: item.committeeTitle,
                value: item.organizationId
              }))}
              setOpen={() => {
                setOpenCommitee(!openCommittee);
                setOpenCategory(false);
                setOpenMeeting(false);
              }}
              setValue={setValueCommittee}
              setItems={setItems}
              placeholder={''}
              placeholderStyle={{
                ...Fonts.PoppinsRegular[12],
                color: Colors.secondary
              }}
              arrowIconStyle={{
                height: SIZES[12],
                width: SIZES[14]
              }}
              style={{
                borderWidth: 0,
                paddingRight: SIZES[16],
                paddingLeft: 0
              }}
              textStyle={{ ...Fonts.PoppinsRegular[14] }}
            />
          </View>

          <View style={styles.meetingContainer}>
            <Text style={styles.txtTitle}>SELECT MEETING</Text>
            <DropDownPicker
              listMode="SCROLLVIEW"
              open={openMeeting}
              disabled={committee ? true : false}
              value={valueMeeting}
              items={meetings?.map((item) => ({
                label: item.meetingTitle,
                value: item.meetingId
              }))}
              setOpen={() => {
                setOpenMeeting(!openMeeting);
                setOpenCategory(false);
                setOpenCommitee(false);
              }}
              setValue={setValueMeeting}
              setItems={setItems}
              placeholder={''}
              placeholderStyle={{
                ...Fonts.PoppinsRegular[12],
                color: Colors.secondary
              }}
              arrowIconStyle={{
                height: SIZES[12],
                width: SIZES[14]
              }}
              style={{
                borderWidth: 0,
                paddingRight: SIZES[16],
                paddingLeft: 0
              }}
              textStyle={{ ...Fonts.PoppinsRegular[14] }}
            />
          </View>
          {/* title */}
          <View style={styles.titleContainer}>
            <Text style={styles.txtTitle}>TITLE</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setTitle(text)}
            />
          </View>
          <View style={styles.discriptionContainer}>
            <Text style={styles.txtTitle}>DESCRIPTION</Text>
            <TextInput
              style={styles.textInput}
              multiline={true}
              onChangeText={(text) => setDescription(text)}
            />
          </View>
          <View style={styles.categoryContainer}>
            <View style={styles.categoryTitleView}>
              <Text style={styles.txtTitle}>SUBJECT CATEGORY</Text>
              <Button
                title={'Add category'}
                textStyle={{ ...Fonts.PoppinsRegular[12] }}
                layoutStyle={{ paddingHorizontal: SIZES[10] }}
                onPress={() => navigation.navigate('AddSubjectCategory')}
              />
            </View>
            <DropDownPicker
              dropDownDirection="TOP"
              listMode="SCROLLVIEW"
              open={openCategory}
              value={valueCategory}
              items={category.map((item) => ({
                label: item.categoryTitle,
                value: item.id
              }))}
              setOpen={() => {
                setOpenCommitee(false);
                setOpenCategory(!openCategory);
                setOpenMeeting(false);
              }}
              setValue={setValueCategory}
              setItems={setItems}
              placeholder={''}
              placeholderStyle={{
                ...Fonts.PoppinsRegular[12],
                color: Colors.secondary
              }}
              arrowIconStyle={{
                height: SIZES[12],
                width: SIZES[14]
              }}
              style={{
                borderWidth: 0,
                paddingRight: SIZES[16],
                paddingLeft: 0
              }}
              textStyle={{ ...Fonts.PoppinsRegular[14] }}
              listItemContainerStyle={{ height: SIZES[50] }}
            />
          </View>

          <View style={{ marginTop: SIZES[24] }}>
            <Text style={styles.txtAttachFile}>ATTACH FILE</Text>
            {fileResponse?.map((file, index) => {
              console.log('from retuen', file);
              return (
                <FilesCard
                  download={true}
                  deleted={true}
                  key={index}
                  filePath={file.name}
                  fileSize={file.size}
                  fileType={file.type}
                  fileUrl={file.downloadUrl}
                  onRemovePress={() => removeFile(file)}
                  style={{
                    borderBottomWidth: SIZES[1],
                    borderBottomColor: Colors.Approved
                  }}
                />
              );
            })}

            <Button
              title={'Attach file'}
              layoutStyle={{
                backgroundColor: 'rgba(243, 246, 249,1)',
                marginBottom: 32
              }}
              textStyle={{
                ...Fonts.PoppinsSemiBold[14],
                color: Colors.primary
              }}
              onPress={() => handleDocumentSelection()}
            />
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
          <View style={styles.buttonContainer}>
            <Button
              title={'Cancel'}
              onPress={() => navigation.goBack()}
              layoutStyle={styles.cancelBtnLayout}
              textStyle={styles.txtCancelButton}
            />
            <Button
              title={'Save'}
              onPress={() => {
                console.log('subjectTitle', title);
                console.log('description', discription);
                console.log('attachFileIds', filesId);
                console.log('valueCommittee', valueCommittee);
                console.log('valueCategory', valueCategory);
                console.log('meetingId', valueMeeting);
                addSubject({
                  variables: {
                    subject: {
                      subjectId: 0,
                      committeeId: valueCommittee,
                      subjectTitle: title,
                      description: discription,
                      subjectCategoryId: valueCategory,
                      draft: false,
                      attachFileIds: filesId,
                      meetingId: valueMeeting,
                      id: 0
                    }
                  },
                  onCompleted: (data) => {
                    console.log(data.updateSubject);
                    if (data.updateSubject.status[0].statusCode == '200') {
                      if (committee) {
                        navigation.goBack();
                      } else {
                        navigation.navigate('Details', {
                          title: 'Subjects',
                          active: '1'
                        });
                      }
                    }
                  }
                });

                // navigation.navigate('Details', {
                //   title: 'Subjects',
                //   active: '1'
                // });
              }}
              disable={title === '' || discription === '' ? true : false}
              layoutStyle={[
                {
                  opacity: title === '' || discription === '' ? 0.5 : null
                },
                styles.nextBtnLayout
              ]}
              textStyle={styles.txtNextBtn}
            />
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddSubjectScreen;
