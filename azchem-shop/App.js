import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

//Navigators
import Main from "./Navigators/Main";

//Screens Import
import ProductContainer from "./Screens/Products/ProductContainer";
import Header from "./Screens/Shared/Header";

// LogBox.ignoreAllLogs(true) //would enable this before publishing

export default function App() {
  return (
    <NavigationContainer>
        <Header />
        <Main/>
    </NavigationContainer>
  ); 
}
