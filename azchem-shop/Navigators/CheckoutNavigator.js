import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet } from "react-native";

//screens
import Checkout from "../Screens/Cart/Checkout/Checkout";
import Payment from "../Screens/Cart/Checkout/Payment";
import Confirm from "../Screens/Cart/Checkout/Confirm";

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        indicatorStyle: styles.tabIndicator, // Apply the custom style here
      }}
    >
      <Tab.Screen name="Shipping" component={Checkout} />
      <Tab.Screen name="Payment" component={Payment} />
      <Tab.Screen name="Confirm" component={Confirm} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIndicator: {
    backgroundColor: "red", // Change this to the desired color for the indicator
    height: 2, // Adjust the height of the indicator as needed
  },
});

export default function CheckoutNavigator() {
  return <MyTabs />;
}
