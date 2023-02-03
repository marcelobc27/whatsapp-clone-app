import { Platform, View } from "react-native"
import * as ImagePicker from 'expo-image-picker'
import { getFirebaseApp } from "../../firebaseConfig";
import uuid from 'react-native-uuid';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

export const launchImagePicker = async () => {
  await checkMediaPermissions();

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1
  });

  if(!result.canceled){
    return result.assets[0].uri
  }
}

export const uploadImageAsync = async (uri) => {
  const app = getFirebaseApp();

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = function(){
      resolve(xhr.response)
    }

    xhr.onerror = function(e) {
      console.log(e)
      reject(new TypeError('Network request failed'));
    }

    xhr.responseType = "blol";
    xhr.open("get", uri, true)
    xhr.send();

  })

  const pathFolder = 'profilePics' 
  const storageRef = ref(getStorage(app), `${pathFolder}/${uuid.v4()}`)

  await uploadBytesResumable(storageRef, blob)

  return await getDownloadURL(storageRef)
}

const checkMediaPermissions = async () => {
  if(Platform.OS !== "ios"){
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(permissionResult.granted === false){
      return Promise.reject("We need permission to access  your photos")
    } 
  } else {
    console.log("Web platform")
  }

  return Promise.resolve()
}