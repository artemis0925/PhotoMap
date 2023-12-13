import PostsScreen from "./PostsScreen";
import CreatePostsScreen from "./CreatePostsScreen";
import ProfileScreen from "./ProfileScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  SimpleLineIcons,
  AntDesign,
  Feather,
  Ionicons,
} from "@expo/vector-icons";
import { TouchableOpacity, View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { logOut } from "../redux/auth/operations";

const Tab = createBottomTabNavigator();

const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(logOut());
  };

  return (
    <Tab.Navigator
      initialRouteNawme="Posts"
      screenOptions={{
        tabBarStyle: { height: 83 },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name={"Posts"}
        component={PostsScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={handleLogOut} style={{ padding: 10 }}>
              <Feather name="log-out" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          ),
          title: "Publications",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 17 },
          tabBarIcon: ({ focused, color, size }) => (
            <View
              style={{
                padding: 14,
                position: "absolute",
                right: 0,
              }}
            >
              <SimpleLineIcons name="grid" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={"CreatePosts"}
        component={CreatePostsScreen}
        options={{
          tabBarStyle: { display: "none" },
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 17 },
          title: "Create a post",
          tabBarIcon: ({ focused, color, size }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("CreatePosts");
              }}
              style={{
                height: 40,
                width: 70,
                backgroundColor: "#FF6C00",
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AntDesign name="plus" size={24} color={"white"} />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Posts")}
              style={{ padding: 10 }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="rgba(33, 33, 33, 0.8)"
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name={"Profile"}
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <View
              style={{
                padding: 14,
                position: "absolute",
                left: 0,
              }}
            >
              <Feather name="user" size={24} color={color} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Home;
