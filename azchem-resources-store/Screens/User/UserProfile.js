import React, { useContext, useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Button from "react-native-button";
import { Container } from "native-base";
import { useFocusEffect,   useRoute, } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/store/AuthGlobal";
import { logoutUser } from "../../Context/actions/Auth.actions";
import OrderCard from "../Shared/OrderCard";

const UserProfile = (props) => { 
  const context = useContext(AuthGlobal);
  const route = useRoute();
  // Access the name of the current screen
  const currentScreen = route.name;
  const { user } = context.stateUser;
  const [orders, setOrders] = useState([]);

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
        })
        .catch((error) => console.log(error));
    }, [user.userId,currentScreen])
  );

  return (
    <Container style={styles.container}>
      <ScrollView contentContainerStyle={styles.subContainer}>
        <Text style={{ fontSize: 30 }}>{user ? user.name : ""}</Text>
        <View>
          <Text style={{ margin: 10 }}>Email: {user ? user.email : ""}</Text>
          <Text style={{ margin: 10 }}>Phone: {user ? user.phone : ""}</Text>
        </View>
        <View style={{ marginTop: 10 }}>
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
        <View style={styles.order}>
          <Text style={{ fontSize: 20 }}>My Orders</Text>
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
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 10,
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
  container: {
    flex: 1,
    alignItems: "center",
  },
  subContainer: {
    alignItems: "center",
  },
  order: {
    marginTop: 20,
    alignItems: "center",
    marginBottom: 60,
  },
});

export default UserProfile;
