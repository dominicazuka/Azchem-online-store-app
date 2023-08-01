import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import Cart from '../Screens/Cart/Cart';
import CheckoutNavigator from './CheckoutNavigator';

const Stack = createStackNavigator();

function MyStack(){
    return(
        <Stack.Navigator  screenOptions={{
            headerTintColor: 'red', // Set the color of the back button here
          }}>
            <Stack.Screen 
                name="Cart"
                component={Cart}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen 
                name="Checkout"
                component={CheckoutNavigator}
                options={{
                    title: "Checkout"
                }}
            />
        </Stack.Navigator>
    )
}

export default function CartNavigator() {
    return <MyStack />
  }
