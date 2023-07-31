import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

//Stacks
import HomeNavigator from "./HomeNavigator";
import CartNavigator from "./CartNavigator";

//cartIcon
import CartIcon from "../Screens/Shared/CartIcon";

const Tab = createBottomTabNavigator();

const Main = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        keyboardHidesTabBar: true,
        showLabel: true,
        activeTintColor: "red",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              name="home"
              style={{ position: "relative" }}
              color={color}
              size={30}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Cart"
        component={CartNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <View>
              <Icon name="shopping-cart" color={color} size={30} />
              <CartIcon />
            </View>
          ),
        }}
      />

      {/* <Tab.Screen 
            name="Admin"
            component={}
            options={{
                tabBarIcon: ({color}) => (
                    <Icon
                        name="cog"
                        color={color}
                        size={30}
                    />
                   )
            }}
        />

<Tab.Screen 
            name="User"
            component={}
            options={{
                tabBarIcon: ({color}) => (
                    <Icon
                        name="user"
                        style={{position: 'relative'}}
                        color={color}
                        size={30}
                    />
                   )
            }}
        /> */}
    </Tab.Navigator>
  );
};

export default Main;
