import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";

//Redux
import { Provider } from "react-redux";
import store from "./Redux/store";

//Context API
import Auth from "./Context/store/Auth";

//Navigators
import Main from "./Navigators/Main";

//Screens Import
import ProductContainer from "./Screens/Products/ProductContainer";
import Header from "./Screens/Shared/Header";

// LogBox.ignoreAllLogs(true) //would enable this before publishing

export default function App() {
  return (
    <Auth>
      <Provider store={store}>
        <NavigationContainer>
          <StatusBar backgroundColor="red" />
          <Header />
          <Main />
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </NavigationContainer>
      </Provider>
    </Auth>
  );
}
