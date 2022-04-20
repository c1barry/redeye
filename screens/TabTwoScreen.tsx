import {
  StyleSheet,
  Dimensions,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  PermissionsAndroid
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';
import { AVPlaybackStatus, Video } from 'expo-av';
import * as Speech from 'expo-speech';
import * as Brightness from 'expo-brightness';
import moment from 'moment';
import * as FileSystem from 'expo-file-system';

export default function TabTwoScreen() {
  const [participantNumber, onChangeNumber] = React.useState('0');
  const cameraRef = React.useRef<Camera>(null)
  const [status, setStatus] = useState({})
  const [playStatus, setPlayStatus] = useState<AVPlaybackStatus>();
  const [flashlight, setFlashlight] = useState(Camera.Constants.FlashMode.off)
  const video = useRef<Video>(null);
  const [record, setRecord] = useState("");
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const [isRecord, setIsRecord] = useState(false);
  const [isLightOn, setIslightOn] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState(Date().toLocaleString().toString());
  // let cameraRef: Camera;
  //camera functions//////////////////////////////////////////////////////////////////
  
  // cameraRef=Camera.Constants.Type.back
  const onCameraReady = () => {
    setIsCameraReady(true);
  };
  // const onSnap = async () => {
  //   if (cameraRef) {
  //     const options = { quality: 0.7, base64: true };
  //     const data = await cameraRef.takePictureAsync(options);
  //     const source = data.base64;
  
  //     if (source) {
  //       await cameraRef.pausePreview();
  //       setIsPreview(true);
  //     }
  //   }
  // };
  // const cancelPreview = async () => {
  //   await cameraRef.resumePreview();
  //   setIsPreview(false);
  //   // setCameraType(Camera.Constants.Type.front);
  //   // setIsCameraReady(true);
  // };
  // const switchCamera = () => {
  //   if (isPreview) {
  //     return;
  //   }
  //   setCameraType(prevCameraType =>
  //     prevCameraType === Camera.Constants.Type.back
  //       ? Camera.Constants.Type.front
  //       : Camera.Constants.Type.back
  //   );
  // };

    //Video functions////////////////////////////////////////////////////////////////////
    const stopVideo=async() => {
      if (cameraRef.current){
        cameraRef.current.stopRecording()
        setIsRecord(false);
        // FileSystem.copyAsync('file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252Fredpupil-51071a81-9107-4202-b2cd-8ece7637462e/Camera', FileSystem.documentDirectory)
        
        setTimeout(() => {
          loadFiletoDownloads(record);
        }, 2000);
        
      }
    }

  
    const takeVideo = async () => {
      setIsRecord(true);
      if(cameraRef.current){
          const dataVid = await cameraRef.current.recordAsync({
            // VideoQuality:['2160p'],
            // maxDuration:10,
            // maxFileSize:200,
            // mute:false,
            // videoBitrate:5000000
          })
          setRecord(dataVid.uri);
          console.log(dataVid.uri);
          let now = moment().format('YYYY_MM_DD_hh_mm_ss')
          // console.log(now)
          setRecordingStartTime(now)
          console.log(recordingStartTime)
      }
    }
  
    const loadFiletoDownloads = async(dataUri:string) => {
      // try {
        
        const savealbum = await MediaLibrary.getAlbumAsync('Download');
        console.log(savealbum.toString())
        if (savealbum == null) {
          console.log('no folder of this name')
        }
        const asset = await MediaLibrary.createAssetAsync(dataUri);
        console.log('asset acquired')
        asset.filename = participantNumber+"__"+recordingStartTime;

        console.log(asset.creationTime.toString())
        const album = await MediaLibrary.getAlbumAsync('Download');
        console.log('album acquired')
        if (album == null) {
          console.log('no folder of this name')
          await MediaLibrary.createAlbumAsync('Download', asset, false);
        } else {
          console.log('album nonnull')
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, true);
          // FileSystem.moveAsync(dataUri, )
          console.log('saved to downloads folder')
          console.log(asset.filename)
          
        }
      // } catch (e) {
      //   console.log('failed')
      //   handleError(e);
      // }
    }
    const PLR = () => {
      const lightFlashTime =150;
      const delayTime = 6000;
      takeVideo();
      for(var i=1;i<5;i++){
        setTimeout(() => {
          // Brightness.setSystemBrightnessAsync(1);
          // setLightColor('#ffffff');
          setFlashlight(Camera.Constants.FlashMode.torch);
          setTimeout(() => {
            // Brightness.setSystemBrightnessAsync(0);
            // setLightColor('#ff0000');
            setFlashlight(Camera.Constants.FlashMode.off);
          }, lightFlashTime);
          
        }, delayTime*i);
        
      }
      setTimeout(() => {
        stopVideo();
      }, delayTime*5);
      
    }

    const digitspan = ()=>{ 
      takeVideo()
      var list = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      list = list.sort(() => Math.random()-0.5) 
      var num = 0
      for (var i=0; i<8; i++){
          setTimeout(()=>{
            var numberToSay = list[num].toString()
            Speech.speak(numberToSay)
            num++
          }, i*1000);
      }
      setTimeout(()=>{stopVideo()},8000+2000)
    }

    const irisColorCheck = ()=>{
      setFlashlight(Camera.Constants.FlashMode.torch);
      setTimeout(()=>{
        takeVideo()
      }, 3000);
      setTimeout(()=>{
        stopVideo()
        setFlashlight(Camera.Constants.FlashMode.off);
      }, 8000);
    }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.containerCam}
        type={Camera.Constants.Type.back}
        onCameraReady={onCameraReady}
        flashMode= {flashlight}
      >
      </Camera>
      <Video
        ref={video}
        style={styles.containerVid}
        source={{
          uri: record,
        }}
        useNativeControls
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={status => setPlayStatus(() => status)}
      ></Video>
      <View style={styles.PLRButton}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    {/* <View style={styles.container}> */}
      <TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        value={participantNumber}
        placeholder="Enter Participant Number"
        keyboardType="numeric"
      />
    {/* </View> */}
    </TouchableWithoutFeedback>
      <Button
        title={'PLR'}
        onPress={()=>PLR()}
        />
      <Button
        title={'Digit Span'}
        onPress={()=>digitspan()}
        />
      <Button
        title={'Iris Color'}
        onPress={()=>irisColorCheck()}
        />
      <Button 
            title = {isRecord ? "Stop Video": 'Start Video'}
            // backgroundColor = {isRecord ? "#ff0000" : "#000000"}
           onPress={() => isRecord ?  stopVideo(): takeVideo()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerCam: {
    width:'100%',
    height:'50%',
    top: '5%'
  },
  containerVid: {
    width:'50%',
    top: '10%',
    height:'32%',
    backgroundColor: '#000000',
    justifyContent:'flex-start',
    right: 90
  },
  videoPlayButton:{
    // backgroundColor:'#000000',
    color:'#ffffff',
    justifyContent: 'center',
    alignItems: 'flex-end',
    // top:200,
    // right:50
  },
  PLRButton:{
    // backgroundColor:'#000000',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent:'center',
    bottom:80,
    left:110
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding:10,
  }
  // title: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  // },
  // separator: {
  //   marginVertical: 30,
  //   height: 1,
  //   width: '80%',
  // },
});
