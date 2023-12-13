import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";

import store from "./src/redux/store";
import MainScreen from "./src/screens/MainScreen";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainScreen />
      </NavigationContainer>
    </Provider>
  );
}
