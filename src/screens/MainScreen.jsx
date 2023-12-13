import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn } from "../redux/auth/selectors";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./LoginScreen";
import RegistrationScreen from "./RegistrationScreen";
import Home from "./Home";
import { useEffect } from "react";
import { authStateChanged } from "../redux/auth/operations";
import MapPostScreen from "./nestedScreens/MapScreen";
import CommentsPostScreen from "./nestedScreens/CommentsScreen";

const MainStack = createStackNavigator();

const MainScreen = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    dispatch(authStateChanged());
  }, []);

  if (!isLoggedIn) {
    return (
      <>
        <MainStack.Navigator initialRouteName="Login">
          <MainStack.Screen
            name={"Login"}
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            name={"Registration"}
            component={RegistrationScreen}
            options={{ headerShown: false }}
          />
        </MainStack.Navigator>
      </>
    );
  }

  return (
    <MainStack.Navigator initialRouteName="Home">
      <MainStack.Screen
        name={"Home"}
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name="CommentsPost"
        component={CommentsPostScreen}
        options={{ title: "Comments" }}
      />
      <MainStack.Screen
        name="MapPost"
        component={MapPostScreen}
        options={{ title: "Location" }}
      />
    </MainStack.Navigator>
  );
};

export default MainScreen;
