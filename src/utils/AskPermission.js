import {PermissionsAndroid, ToastAndroid} from 'react-native';

// to request the perrmission if not granted
export const requestPermission = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
    console.log(granted);

    if (
      granted['android.permission.READ_EXTERNAL_STORAGE'] === 'denied' ||
      granted['android.permission.WRITE_EXTERNAL_STORAGE'] === 'denied'
    ) {
      ToastAndroid.show('We need permission', ToastAndroid.LONG);
      requestPermission();
    }
  } catch (error) {
    console.error(error);
  }
};
