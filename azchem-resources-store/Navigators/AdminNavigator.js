import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screens
import Orders from "../Screens/Admin/Orders";
import Categories from "../Screens/Admin/Categories";
import ProductForm from "../Screens/Admin/ProductForm";
import Products from "../Screens/Admin/Products";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "white", // Change this to your desired background color
        },
        headerTintColor: "red", // Set the color of the back button here
      }}
    >
      <Stack.Screen
        name="Products"
        component={Products}
        options={{
          title: "Products",
        }}
      />
      <Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen name="Orders" component={Orders} />
      <Stack.Screen name="Product Form" component={ProductForm} />
    </Stack.Navigator>
  );
}

export default function AdminNavigator() {
  return <MyStack />;
}
