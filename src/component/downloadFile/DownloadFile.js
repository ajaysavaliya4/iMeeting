import { PermissionsAndroid } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

export const checkPermission = async (file) => {
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
