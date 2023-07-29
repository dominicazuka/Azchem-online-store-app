import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

//Stacks
import HomeNavigator from "./HomeNavigator";

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
               tabBatIcon: ({color}) => (
                <Icon
                    name="home"
                    style={{position: 'relative'}}
                    color={color}
                    siz={30}
                />
               )
            }}
        />

        {/* <Tab.Screen 
            name="Cart"
            component={}
            options={{
                tabBatIcon: ({color}) => (
                    <Icon
                        name="shopping-cart"
                        color={color}
                        siz={30}
                    />
                   )
            }}
        />



<Tab.Screen 
            name="Admin"
            component={}
            options={{
                tabBatIcon: ({color}) => (
                    <Icon
                        name="cog"
                        color={color}
                        siz={30}
                    />
                   )
            }}
        />

<Tab.Screen 
            name="User"
            component={}
            options={{
                tabBatIcon: ({color}) => (
                    <Icon
                        name="user"
                        style={{position: 'relative'}}
                        color={color}
                        siz={30}
                    />
                   )
            }}
        /> */}
    </Tab.Navigator>
  );
};

export default Main;
