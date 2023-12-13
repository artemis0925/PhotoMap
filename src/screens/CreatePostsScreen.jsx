import {
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  View,
  Keyboard,
  StyleSheet,
  TextInput,
} from "react-native";
import { useEffect, useState, React } from "react";
import { useDispatch, useSelector } from "react-redux";
import uuid from "react-native-uuid";
import { useIsFocused } from "@react-navigation/native";

import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";

import { Camera } from "expo-camera";
import { AntDesign } from "@expo/vector-icons";
import * as Location from "expo-location";

import { auth, storage } from "../../config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { writeDataToFirestore } from "../redux/posts/operations";
import { selectUser } from "../redux/auth/selectors";

import * as ImagePicker from "expo-image-picker";
import DatePicker from '@dietime/react-native-date-picker';
import Modal from 'react-native-modal';

import { format, parse } from "date-fns";
import { uk } from "date-fns/locale";

const CreatePostsScreen = ({ navigation }) => {
  const [isShowKeyboard, setShowKeyboard] = useState(false);
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [postName, setPostName] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postLocation, setPostLocation] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationParams, setLocationParams] = useState({});
  const [isDoPhoto, setIsDoPhoto] = useState(true);

  const [date, setDate] = useState(Date.now());
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  // const isFocused = useIsFocused();

  // useEffect(() => {
  //   if (isFocused) {
  //     setIsDoPhoto(!isFocused);
  //   }
  // }, [isFocused]);

  useEffect(() => {
    requestLocationPermission();
    requestCameraPermission();

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setShowKeyboard(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setShowKeyboard(false);
      }
    );

    setIsDoPhoto(true);
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      setPhoto(null);
    };
  }, []);

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
    } else {
      // Permission granted, get current location
      try {
        const location = await Location.getCurrentPositionAsync({});
        await setLocationParams(location);
      } catch (error) {
        console.log("Error getting current location:", error);
      }
    }
  };

  const requestCameraPermission = async () => {
    let { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
    }
  };

  const keyboardHide = () => {
    Keyboard.dismiss();
    setShowKeyboard(false);
  };

  const takePhoto = async () => {
    const photo_local = await camera.takePictureAsync();
    setIsDoPhoto(true);
    setPhoto(photo_local.uri);
  };

  const sendPost = () => {
    if (postLocation.trim() === "" || postName.trim() === "" || postDescription.trim() === "" || date === "" || date === undefined) {
      alert("All fields must be filled!");
      return;
    }
    uploadPostToServer();
    navigation.navigate("DefaultPosts");

    resetCreatePost();
  };

  const uploadPhotoToServer = async () => {
    const metadata = {
      contentType: "image/jpeg",
    };
    const uniqId = uuid.v4();

    const response = await fetch(photo);
    const blob = await response.blob();

    const storageRef = ref(storage, "images/" + uniqId);
    const uploadTask = await uploadBytesResumable(storageRef, blob, metadata);

    return await getDownloadURL(storageRef);
  };

  const uploadPostToServer = async () => {
    const photo_local = await uploadPhotoToServer();

    const postDate = format(
      date,
      "dd MMMM, yyyy",
      {
        locale: uk,
      }
    );

    dispatch(
      writeDataToFirestore({
        userId: user.userId,
        userName: auth.currentUser.displayName,
        postName,
        postLocation,
        photoUrl: photo_local,
        location: locationParams,
        email: auth.currentUser.email,
        avatarUser: auth.currentUser.photoURL,
        whoLeavedLike: [],
        postDescription,
        postDate,
      })
    );
  };

  const resetCreatePost = () => {
    setPhoto(null);
    setPostLocation("");
    setPostName("");
    setPostDescription("");
    setDate(undefined);
  };

  const updatePhoto = () => {
    setIsDoPhoto(false);
    keyboardHide();
  };

  //by milo
  const changePhotoInGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <>
      <View
        style={{
          ...styles.cameraContainer,
          display: isDoPhoto ? "none" : "flex",
        }}
      >
        <Camera style={styles.camera} ref={setCamera} ratio="16:9">
          <TouchableOpacity
            style={styles.btnCamera}
            activeOpacity={0.7}
            onPress={takePhoto}
          >
            <Ionicons name="camera-outline" size={30} color="white" />
          </TouchableOpacity>
        </Camera>
      </View>

      <TouchableWithoutFeedback onPress={keyboardHide}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            style={{
              ...styles.createPostContainer,
              display: isDoPhoto ? "flex" : "none",
            }}
          >
            <View
              style={{
                ...styles.createPostSection,
                marginBottom: isShowKeyboard ? -55 : 22,
              }}
            >
              <TouchableOpacity activeOpacity={0.6} onPress={changePhotoInGallery}>
                <View style={styles.photoContainer}>
                  {photo && (
                    <View style={styles.isPhotoContainer}>
                      <Image source={{ uri: photo }} style={styles.photoImg} />
                    </View>
                  )}
                  <View
                    style={{
                      ...styles.cameraIconContainer,
                      opacity: photo ? 0.3 : 0.8,
                    }}
                  >
                    <AntDesign
                      name="pluscircleo"
                      size={24}
                      color="rgba(255, 108, 0, 1)"
                      style={styles.addPhotoImg}
                    />
                  </View>
                </View>
                <Text style={styles.photoDescription}>
                  {photo ? "Edit photo" : "Upload a photo"}
                </Text>
              </TouchableOpacity>
              <TextInput
                onFocus={() => {
                  setShowKeyboard(true);
                }}
                placeholder="Name..."
                onChangeText={(value) => setPostName(value)}
                value={postName}
                style={styles.nameOfPhoto}
              />
              <TextInput
                onFocus={() => {
                  setShowKeyboard(true);
                }}
                placeholder="Description..."
                onChangeText={(value) => setPostDescription(value)}
                value={postDescription}
                style={styles.descriptionOfPhoto}
                multiline
                numberOfLines={2}
              />
              <TextInput
                onFocus={() => {
                  setShowKeyboard(true);
                }}
                placeholder="Date..."
                onChangeText={(value) => setDate(value)}
                value={date===undefined ? "" : format(date, 'yyyy-MM-dd')}
                style={styles.nameOfPhoto}
                onPressIn={() => {
                  setDate(new Date());
                  toggleModal();
                }}
                readonly={true}
              />
              <View style={{ paddingLeft: 30 }}>
                <Feather
                  name="map-pin"
                  size={24}
                  color="rgba(189, 189, 189, 1)"
                  style={styles.iconMap}
                />

                <TextInput
                  onFocus={() => {
                    setShowKeyboard(true);
                  }}
                  placeholder="Locality..."
                  onChangeText={(value) => setPostLocation(value)}
                  value={postLocation}
                  style={styles.nameLocationOfPhoto}
                />
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={sendPost}
                  activeOpacity={1}
                  style={{
                    ...styles.btnCreatePost,
                    backgroundColor:
                      photo && postLocation && postName
                        ? "rgba(255, 108, 0, 1)"
                        : "#F6F6F6",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        photo && postLocation && postName && date && postDescription
                          ? "rgba(255, 255, 255, 1)"
                          : "#BDBDBD",
                    }}
                  >
                    Publish
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection:'row', alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity
                  onPress={updatePhoto}
                  style={styles.btnResetPost}
                >
                  <FontAwesome
                      name="camera"
                      size={24}
                      color={"grey"}
                      iconStyle={{ opacity: 0.8 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={resetCreatePost}
                  style={styles.btnResetPost}
                >
                  <Feather
                    name="trash-2"
                    size={24}
                    color="rgba(189, 189, 189, 1)"
                  />
                </TouchableOpacity>
              </View>

              {/* start of modal */}
              <Modal isVisible={isModalVisible}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                    <DatePicker
                      value={Date.now()}
                      onChange={(value) => setDate(value)}
                      format="yyyy-mm-dd"
                    />
                    <TouchableOpacity onPress={toggleModal} style={{alignItems: 'center', justifyContent: 'center'}}>
                      <Text>Close Modal</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              {/* end of modal */}
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  cameraContainer: { flex: 1 },
  camera: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
  btnCamera: {
    borderColor: "#fff",
    borderRadius: 35,
    width: 70,
    height: 70,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  createPostContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "rgba(33, 33, 33, 0.8)",
    justifyContent: "flex-end",
  },
  createPostSection: {
    marginHorizontal: 16,
    marginTop: 32,
  },
  photoContainer: {
    width: "100%",
    height: 240,
    borderRadius: 8,
    backgroundColor: "rgba(246, 246, 246, 1)",
    borderWidth: 1,
    borderColor: "rgba(232, 232, 232, 1)",
    alignItems: "center",
    justifyContent: "center",
  },
  isPhotoContainer: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  photoImg: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  cameraIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  photoDescription: { color: "rgba(189, 189, 189, 1)", fontSize: 16 },
  nameOfPhoto: {
    height: 50,
    marginTop: 32,
    fontSize: 16,
    borderBottomColor: "rgba(232, 232, 232, 1)",
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingBottom: 15,
  },
  descriptionOfPhoto: {
    marginTop: 32,
    fontSize: 16,
    borderBottomColor: "rgba(232, 232, 232, 1)",
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingBottom: 15,
  },
  iconMap: { position: "absolute", top: 30, width: 24 },
  nameLocationOfPhoto: {
    height: 50,
    marginTop: 16,
    fontSize: 16,
    borderBottomColor: "rgba(232, 232, 232, 1)",
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingBottom: 15,
  },
  btnCreatePost: {
    width: 343,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    marginTop: 32,
  },
  btnResetPost: {
    width: 70,
    height: 40,
    borderRadius: 20,
    marginTop: 120,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
    marginRight: "auto",
    marginLeft: "auto",
  },
});

export default CreatePostsScreen;
