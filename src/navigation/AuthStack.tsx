import React from "react";

import { College } from "../types/models";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SearchCollege, Enter } from "../screens/AuthStack/index";
// import { SearchCollege, Enter } from "@screens/AuthStack";

export type AuthStackParamList = {
  SearchCollege: undefined;
  Enter: { college: College };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="SearchCollege"
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="SearchCollege"
        component={SearchCollege}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="Enter" component={Enter} />
    </Stack.Navigator>
  );
};

export default AuthStack;