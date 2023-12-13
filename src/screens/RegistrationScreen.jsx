import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import PhotoBG from "../../assets/PhotoBG.jpg";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { registerDB, uploadPhotoToStorage } from "../redux/auth/operations";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import uuid from "react-native-uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../config";
import { writeUserAvatarToFirebase } from "../redux/posts/operations";
import { selectUserAvatar } from "../redux/auth/selectors";

const RegistrationScreen = () => {
  const [isShowKeyboard, setShowKeyboard] = useState(false);
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [validationErr, setValidationErr] = useState("");

  const [isShownPassword, setIsShownPassword] = useState(true);
  const [userAvatar, setUserAvatar] = useState(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
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

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const isValidateUserData = () => {
    if (!userAvatar) {
      setValidationErr("Choose an avatar from the gallery!");
      alert("Choose an avatar from the gallery!");
      return;
    }
    if (login.length < 6) {
      setValidationErr("Login should be at least 6 characters");
      alert("Login should be at least 6 characters");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationErr("Invalid email");
      alert("Invalid email: it must contain @ and domain part, invalid space");
      return;
    }
    if (password.length < 8) {
      setValidationErr("Password should be at least 8 characters");
      alert("Password should be at least 8 characters");
      return;
    }

    setValidationErr("");
    handleSignIn();
  };

  const keyboardHide = () => {
    setShowKeyboard(false);
    Keyboard.dismiss();
  };

  const handleSignIn = async () => {
    setShowKeyboard(false);
    Keyboard.dismiss();

    const downloadUrl = await dispatch(
      uploadPhotoToStorage(userAvatar)
    ).unwrap();

    dispatch(registerDB({ login, email, password, photoURL: downloadUrl }));
    setEmail("");
    setLogin("");
    setPassword("");
  };

  const changeUserAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUserAvatar(result.assets[0].uri);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <ImageBackground source={PhotoBG} style={styles.image}>
          <View style={styles.containerScreen}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View
                style={{
                  ...styles.formContainer,
                  marginBottom: isShowKeyboard ? 20 : 78,
                }}
              >
                <TouchableOpacity
                  style={styles.userPhoto}
                  onPress={changeUserAvatar}
                  activeOpacity={0.8}
                >
                  <Image
                    style={{ height: "100%", width: "100%", borderRadius: 16 }}
                    source={{ uri: userAvatar }}
                  />
                  {!userAvatar ? (
                    <AntDesign
                      name="pluscircleo"
                      size={24}
                      color="rgba(255, 108, 0, 1)"
                      style={styles.addPhotoImg}
                    />
                  ) : (
                    <AntDesign
                      name="closecircleo"
                      size={24}
                      color="rgba(232, 232, 232, 1)"
                      style={styles.addPhotoImg}
                    />
                  )}
                </TouchableOpacity>
                <Text style={styles.titleForm}>Registration</Text>
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder={"Login"}
                    onFocus={() => {
                      setShowKeyboard(true);
                    }}
                    onChangeText={(value) => setLogin(value)}
                    value={login}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={"Email address"}
                    onFocus={() => {
                      setShowKeyboard(true);
                    }}
                    onChangeText={(value) => setEmail(value)}
                    value={email}
                  />
                  <View>
                    <TextInput
                      style={styles.input}
                      placeholder={"Password"}
                      secureTextEntry={isShownPassword}
                      onFocus={() => {
                        setShowKeyboard(true);
                      }}
                      onChangeText={(value) => setPassword(value)}
                      value={password}
                    />
                    <TouchableOpacity
                      style={styles.passwordShowBtn}
                      onPress={() => setIsShownPassword(!isShownPassword)}
                    >
                      <Text style={styles.passwordShowText}>
                        {isShownPassword ? "Show" : "Hide"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.btnRegistration}
                  onPress={isValidateUserData}
                >
                  <Text style={styles.textRegistration}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnLogIn}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.textLogIn}>Already have an account? Sign in</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
    resizeMode: "cover",
  },
  containerScreen: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },
  formContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 78,
  },
  userPhoto: {
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    position: "absolute",
    top: -60,
  },
  addPhotoImg: {
    position: "absolute",
    right: -12.5,
    bottom: 20,
    borderRadius: 25,
  },
  titleForm: {
    fontSize: 30,
    letterSpacing: 0.3,
    marginTop: 92,
    marginBottom: 17,
  },
  input: {
    padding: 15,
    width: 343,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#F6F6F6",
    marginTop: 16,
    fontSize: 16,
  },
  btnRegistration: {
    width: 343,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    backgroundColor: "#FF6C00",
    marginTop: 43,
  },
  textRegistration: {
    fontSize: 16,
    color: "#fff",
  },
  btnLogIn: { borderColor: "#FF6C00", marginTop: 16 },
  textLogIn: { color: "#1B4371", fontSize: 16 },
  passwordShowBtn: {
    position: "absolute",
    top: "45%",
    right: 16,
    color: "#1B4371",
  },
  passwordShowText: { color: "#1B4371", fontSize: 16 },
});

export default RegistrationScreen;
