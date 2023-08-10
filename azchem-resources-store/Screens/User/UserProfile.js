import React, { useContext, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import Button from "react-native-button";
import { Container } from "native-base";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/store/AuthGlobal";
import { logoutUser } from "../../Context/actions/Auth.actions";
import OrderCard from "../Shared/OrderCard";
import image from "../../assets/background.png";

const UserProfile = (props) => {
  const context = useContext(AuthGlobal);
  const route = useRoute();
  // Access the name of the current screen
  const currentScreen = route.name;
  const { user } = context.stateUser;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      axios
        .get(`${baseURL}orders`)
        .then((response) => {
          const data = response.data;
          const userOrders = data.filter(
            (order) => order.user.id === user.userId
          );
          setOrders(userOrders);
          setLoading(false);
        })
        .catch((error) => console.log(error));
    }, [user.userId, currentScreen])
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <ImageBackground
            source={{ uri: "https://i.ibb.co/q0SpPPX/Untitled-design.png" }}
            style={styles.backgroundImage}
          >
            {/* Your other content here */}
            <View>
              <Image
                style={styles.location}
                source={require("../../assets/locationSvg.svg")}
              />
            </View>
            {/* <View>
            <Image
              style={styles.hamburger}
              source={require("../../assets/HamburgerIcon.png")}
            />
          </View> */}
            <View style={styles.headerContent}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>Welcome</Text>
                <Text style={styles.userInfo}>{user ? user.name : ""}</Text>
              </View>
              <View>
                <Image
                  style={styles.avatar}
                  source={require("../../assets/profile.png")}
                />
              </View>
            </View>
            <View>
              <Text style={styles.text}>
                Dashboard | {user ? user.email : ""}
              </Text>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.body}>
          <Pressable style={styles.RectangleShapeView}></Pressable>
          {loading ? (
            <View style={{ marginTop: 20 }}>
              <ActivityIndicator size="large" color="red" />
            </View>
          ) : null}
          <View style={styles.order}>
            <Text style={styles.headtText}>My orders</Text>
            <View>
              {orders ? (
                orders.map((x) => {
                  return <OrderCard key={x.id} {...x} />;
                })
              ) : (
                <View style={styles.order}>
                  <Text>You have no orders</Text>
                </View>
              )}
            </View>
          </View>
          <View>
            <Button
              containerStyle={styles.buttonContainer}
              disabledContainerStyle={{ backgroundColor: "grey" }}
              style={{ fontSize: 20, color: "white" }}
              onPress={() => {
                AsyncStorage.removeItem("jwt"),
                  logoutUser(context.dispatch),
                  props.navigation.navigate("Login");
              }}
            >
              Sign Out
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    // backgroundImage: `url(https://i.ibb.co/q0SpPPX/Untitled-design.png)`,
    // backgroundSize: "contain",
    height: 300,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "contain",
  },
  headerContent: {
    padding: 30,
    alignItems: "center",
    display: "flex",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 63,
    borderWidth: 2,
    borderColor: "white",
    marginBottom: 10,
    // float: "right"
  },
  location: {
    borderColor: "white",
    width: 10,
    height: 10,
    // float: "left"
  },
  hamburger: {
    borderColor: "white",
    width: 10,
    height: 10,
    // float: "right"
  },
  name: {
    fontSize: 22,
    color: "#A8A8A8",
    // fontWeight: "600",
    fontFamily: "Helvetica",
  },
  headtText: {
    fontFamily: "Helvetica",
    color: "grey",
    fontWeight: "600",
    // float: "left",
    marginTop: 10,
  },
  SubjectText: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Helvetica",
    // float: "left",
    marginLeft: 20,
    marginTop: 10,
  },
  userInfo: {
    fontSize: 30,
    color: "white",
    // fontWeight: "600",
  },
  btn: {
    marginTop: 20,
    backgroundColor: "#3B525F",
    borderRadius: 10,
    width: 200,
    height: 50,
    alignItems: "center",
    padding: 6,
    elevation: 3,
  },
  body: {
    backgroundColor: "white",
    // height: 500,
    alignItems: "center",
  },
  text: {
    color: "white",
    margin: 10,
  },
  RectangleShapeView: {
    marginTop: 20,
    width: "80%",
    height: 10,
    backgroundColor: "white",
    color: "black",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    elevation: 3,
  },
  order: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonContainer: {
    padding: 10,
    marginBottom: 30,
    height: 45,
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "red",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 7,
  },
  order: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 30,
  },
});

export default UserProfile;
