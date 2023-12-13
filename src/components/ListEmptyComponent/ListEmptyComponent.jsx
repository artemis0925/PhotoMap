import { AntDesign } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ListEmptyComponent = ({ navigation, text, useCreatePost }) => {
  return (
    <View style={styles.emptyListContainer}>
      <Text style={styles.emptyListText}>{text}</Text>
      {useCreatePost && (
        <TouchableOpacity
          onPress={() => navigation.navigate("CreatePosts")}
          style={styles.createPostBtn}
        >
          <AntDesign name="plus" size={24} color={"white"} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyListContainer: {
    paddingHorizontal: 16,
    paddingTop: 30,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  emptyListText: { fontSize: 20 },
  createPostBtn: {
    height: 40,
    width: 70,
    marginTop: 32,
    backgroundColor: "#FF6C00",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ListEmptyComponent;
