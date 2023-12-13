import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DefaultPostsScreen from "./nestedScreens/DefaultPostsScreen";

const NestedScreen = createStackNavigator();

const PostsScreen = () => {
  return (
    <NestedScreen.Navigator initialRouteName="DefaultPosts">
      <NestedScreen.Screen
        name="DefaultPosts"
        component={DefaultPostsScreen}
        options={{ headerShown: false }}
      />
    </NestedScreen.Navigator>
  );
};

export default PostsScreen;
