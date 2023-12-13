import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
} from "react-native";
import PhotoBG from "../../assets/PhotoBG.jpg";
import { useNavigation } from "@react-navigation/native";
import { loginDB } from "../redux/auth/operations";
import { useDispatch } from "react-redux";

const LoginScreen = () => {
  const [isShowKeyboard, setShowKeyboard] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationPasswordErr, setValidationPasswordErr] = useState("");
  const [validationEmailErr, setValidationEmailErr] = useState("");
  const [isShownPassword, setIsShownPassword] = useState(true);

  const dispatch = useDispatch();
  const navigation = useNavigation();

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

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationEmailErr("Invalid email");
      alert("Invalid email: it must contain @ and domain part, invalid space");
    } else {
      setValidationEmailErr("");
    }
  };

  const validatePassword = () => {
    if (password.length < 8) {
      setValidationPasswordErr("Password should be at least 8 characters");
      alert("Password should be at least 8 characters");
    } else {
      setValidationPasswordErr("");
    }
  };

  const isValidateData = () => {
    validateEmail();
    validatePassword();
    if (!validationEmailErr && !validationPasswordErr && email && password) {
      handleSignIn();
      return true;
    }
    return false;
  };

  const handleSignIn = () => {
    dispatch(loginDB({ email, password }));
    setEmail("");
    setPassword("");
  };

  const hideKeyboard = () => {
    setShowKeyboard(false);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={hideKeyboard}>
      <View style={styles.container}>
        <ImageBackground source={PhotoBG} style={styles.image}>
          <View style={styles.containerScreen}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View
                style={{
                  ...styles.formContainer,
                  marginBottom: isShowKeyboard ? 20 : 144,
                }}
              >
                <Text style={styles.titleForm}>Login</Text>
                <View>
                  <TextInput
                    onFocus={() => {
                      setShowKeyboard(true);
                    }}
                    style={styles.input}
                    placeholder={"Email Address"}
                    onChangeText={(value) => setEmail(value)}
                    value={email}
                    inputMode={"email"}
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
                  onPress={isValidateData}
                >
                  <Text style={styles.textRegistration}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnLogIn}
                  onPress={() => navigation.navigate("Registration")}
                >
                  <Text style={styles.textLogIn}>
                    No account? Register
                  </Text>
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
    marginTop: 32,
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
  textRegistration: { fontSize: 16, color: "#fff" },
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

export default LoginScreen;
