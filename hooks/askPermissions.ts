
import { useEffect, useState } from 'react';
import * as Brightness from 'expo-brightness';
import {PermissionsAndroid} from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';

export default function askPermissions() {
    const [isPermissionComplete, setPermissionComplete] = useState(false);
    const [hasAudioPermission, setHasAudioPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);
    const [mediastatus, setRequestMediaPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    async function askPermissionsAsync() {
      try {
          await Camera.requestCameraPermissionsAsync();
          // setHasCameraPermission(status === 'granted');
          await Camera.requestMicrophonePermissionsAsync();
          // setHasAudioPermission(status === 'granted'); 
          // await MediaLibrary.requestPermissionsAsync();
          // await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
          await Permissions.askAsync(Permissions.MEDIA_LIBRARY_WRITE_ONLY);
          // await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.MEDIA_LIBRARY);
          // await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRI);
          // await MediaLibrary.presentPermissionsPickerAsync()
          
          if(mediastatus){
            const i = 0;
          }
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setPermissionComplete(true);
      }
    }

    askPermissionsAsync();
  }, []);

  return isPermissionComplete;
}
