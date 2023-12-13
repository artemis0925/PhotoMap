import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const CreatePostBtn = ({ children, onPress }) => {
  return (
    <View
      onPress={onPress}
      style={{
        height: 40,
        width: 70,
        backgroundColor: "#FF6C00",
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );
};

export default CreatePostBtn;
