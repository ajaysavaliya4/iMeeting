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
  GET_FILE
} from '../../../../graphql/query';
import { UPDATE_SUBJECTS } from '../../../../graphql/mutation';
import Loader from '../../../../component/Loader/Loader';
import { SIZES } from '../../../../themes/Sizes';

const EditSubjectScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route?.params;
  console.log('item from edit screen', item);
  const [title, setTitle] = useState(item.subjectTitle);
  const [discription, setDescription] = useState(item.description);
  const [openCategory, setOpenCategory] = useState(false);
  const [openCommittee, setOpenCommitee] = useState(false);
  const [openMeeting, setOpenMeeting] = useState(false);
  const [valueCategory, setValueCategory] = useState(item.subjectCategoryId);
  const [valueCommittee, setValueCommittee] = useState(item.committeeId);
  const [valueMeeting, setValueMeeting] = useState(item.committeeId);
  const [fileResponse, setFileResponse] = useState([]);
  const [filesId, setFilesId] = useState([]);
  const [token, setToken] = useState('');
  const [category, setCategory] = useState([]);
  const [committees, setCommittee] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [items, setItems] = useState([{ label: item, value: 'design' }]);

  item?.attachFileIds.map((id) => {
    const { loading, error } = useQuery(GET_FILE, {
      variables: {
        fileEntryId: id
      },
      onCompleted: (data) => {
        if (data) {
          setFileResponse((prev) => {
            const pevDaa = prev.filter((ite) => {
              return ite.fileEnteryId !== data.fileEnteryId;
            });
            return [...pevDaa, data];
          });
        }
      }
    });
    if (error) {
      console.log('file error', error);
    }
  });

  useEffect(() => {
    const fileId = fileResponse.map((file) => file.fileEnteryId);

    setFilesId(fileId);
  }, [fileResponse]);
  console.log('file id', filesId);

  const checkPermission = async (file) => {
    console.log('check permission');
    if (Platform.OS === 'ios') {
      downloadFile(file);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'Application needs access to your storage to download File'
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile(file);
          console.log('Storage Permission Granted.');
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log('++++' + err);
      }
    }
  };

  const downloadFile = (file) => {
    console.log('downloadfile');
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = file;
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true
      }
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then((res) => {
        // Alert after successful downloading
        console.log('res -> ', res.respInfo.redirects[0]);
        alert('File Downloaded Successfully.');
        if (Platform.OS == 'ios') {
          RNFetchBlob.ios.openDocument(res.respInfo.redirects[0]);
        }
      });
  };

  const getFileExtention = (fileUrl) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };
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
      variables: { isDeleted: false },
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

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pickMultiple({
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.allFiles]
      });
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
              // setFileId(responseData?.fileEnteryId);
              if (responseData) {
                setFileResponse((prev) => {
                  const pevDaa = prev.filter((ite) => {
                    return ite.fileEnteryId !== responseData.fileEnteryId;
                  });
                  return [...pevDaa, responseData];
                });
              }
            })
            .then(() => {})
            .catch((e) => console.log('file upload error--', e));
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const [addSubject, { data, loading, error }] = useMutation(UPDATE_SUBJECTS, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [{ query: GET_All_SUBJECTS, variables: { screen: 0 } }]
  });
  if (data) {
    console.log(data);
  }
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

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={() => {
          setOpenCommitee(false);
          setOpenCategory(false);
          setOpenMeeting(false);
        }}
      >
        <Header
          name={'Edit subject'}
          rightIconName={IconName.Close}
          onRightPress={() => navigation.goBack()}
        />

        <View style={styles.container}>
          {SubjectCategoryLoading ? (
            <Loader />
          ) : (
            <ScrollView
              style={styles.subContainer}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.txtEditSubject}>Edit subject</Text>
              <View style={styles.committeeContainer}>
                <Text style={styles.txtTitle}>SELECT COMMITTEE</Text>
                <DropDownPicker
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
                  placeholder={'SELECT COMMITTEE'}
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
                  value={title}
                  style={styles.textInput}
                  onChangeText={(text) => setTitle(text)}
                />
              </View>
              <View style={styles.discriptionContainer}>
                <Text style={styles.txtTitle}>DISCRIPTION</Text>
                <TextInput
                  value={discription}
                  style={styles.textInput}
                  multiline={true}
                  onChangeText={(text) => setDescription(text)}
                />
              </View>
              <View style={styles.categoryView}>
                <Text style={styles.txtTitle}>SUBJECT CATEGORY</Text>
                <DropDownPicker
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
                  placeholder={item.subjectCategoryName}
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

              <View style={{ marginTop: 24 }}>
                <Text style={styles.txtAttachFile}>ATTACH FILE</Text>
                {fileResponse?.map((file, index) => {
                  console.log('from retuen', file);
                  return (
                    <FilesCard
                      key={index}
                      filePath={file.name}
                      fileSize={file.size}
                      onDownloadPress={() => checkPermission(file.downloadUrl)}
                      fileType={file.type}
                      onRemovePress={() => removeFile(file)}
                      download={true}
                      deleted={true}
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
          )}

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
                  addSubject({
                    variables: {
                      subject: {
                        subjectId: item.subjectId,
                        committeeId: valueCommittee,
                        subjectTitle: title,
                        description: discription,
                        subjectCategoryId: valueCategory,
                        draft: false,
                        attachFileIds: filesId
                      }
                    },
                    onCompleted: () => {
                      navigation.navigate('Details', {
                        title: 'Subjects',
                        active: '1'
                      });
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
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditSubjectScreen;
