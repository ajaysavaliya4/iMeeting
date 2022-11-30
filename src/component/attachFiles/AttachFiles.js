import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';
import DocumentPicker from 'react-native-document-picker';

const handleDocumentSelection = useCallback(async () => {
  try {
    const response = await DocumentPicker.pickMultiple({
      presentationStyle: 'fullScreen',
      type: [DocumentPicker.types.allFiles],
      allowMultiSelection: true,
      copyTo: 'cachesDirectory'
    });
    const url = await AsyncStorage.getItem('@url');
    const user = await AsyncStorage.getItem('@token');

    console.log('token', user);
    response.map((res) => {
      if (res !== null) {
        const formData = new FormData();
        formData.append('file', res);
        console.log('formdata', formData);
        console.log('companyUrl', url);

        fetch(`https://${url}//o/imeeting-rest/v1.0/file-upload`, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + `${user}`,
            'Content-Type': 'multipart/form-data'
          },
          body: formData
        })
          .then((response) => response.json())
          .then((responseData) => {
            console.log('response data', responseData);
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
