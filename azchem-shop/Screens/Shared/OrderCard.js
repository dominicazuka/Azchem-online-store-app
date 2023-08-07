import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "native-base";
import Toast from "react-native-toast-message";
import TrafficLight from "../Shared/StyledComponents/TrafficLight";
import Icon from "react-native-vector-icons/FontAwesome5";
import EasyButton from "../Shared/StyledComponents/EasyButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/store/AuthGlobal";
import { useFocusEffect, useRoute } from "@react-navigation/native";

const codes = [
  { name: "pending", code: "3" },
  { name: "shipped", code: "2" },
  { name: "delivered", code: "1" },
];

const OrderCard = (props) => {
  const context = useContext(AuthGlobal);
  const route = useRoute();
  // Access the name of the current screen
  const currentScreen = route.name;
  const [orderStatus, setOrderStatus] = useState();
  const [statusText, setStatusText] = useState();
  const [token, setToken] = useState();
  const [cardColor, setCardColor] = useState();
  const [statusChange, setStatusChange] = useState();
  const [userState, setUserState] = useState(false);

  useEffect(() => {
    if (currentScreen === "Orders") {
      setUserState(true);
    }
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => {
        console.log(error);
        Toast.show({
          topOffset: 70,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
    if (props.status == "3") {
      setOrderStatus(<TrafficLight unavailable></TrafficLight>);
      setStatusText("pending");
      setCardColor("#890909");
    } else if (props.status == "2") {
      setOrderStatus(<TrafficLight limited></TrafficLight>);
      setStatusText("shipped");
      setCardColor("#0000FF");
    } else {
      setOrderStatus(<TrafficLight available></TrafficLight>);
      setStatusText("delivered");
      setCardColor("#1F8B0D");
    }

    return () => {
      setOrderStatus();
      setStatusText();
      setCardColor("#e74c3c");
    };
  }, [currentScreen]);

  const updateOrder = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const order = {
      city: props.city,
      country: props.country,
      dateOrdered: props.dateOrdered,
      orderItems: props.orderItems,
      phone: props.phone,
      shippingAddress1: props.shippingAddress1,
      shippingAddress2: props.shippingAddress2,
      status: statusChange,
      totalPrice: props.totalPrice,
      user: props.user,
      zip: props.zip,
    };
    axios
      .put(`${baseURL}orders/${props.id}`, order, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 70,
            type: "success",
            text1: "Order edited successfully",
            text2: "",
          });
          setTimeout(() => {
            props.navigation.navigate("Products");
          }, 500);
        }
      })
      .catch((err) => {
        console.log(err);
        Toast.show({
          topOffset: 70,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
  };
  return (
    <View style={[{ backgroundColor: cardColor }, styles.container]}>
      <View style={styles.orderNumber}>
        <Text style={{ color: "white" }}>Order Number: #{props.id}</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={{ color: "white" }}>
          Status: {statusText} {orderStatus}
        </Text>
         <Text style={{ color: "white" }}>
          Phone Number: {props.phone}
        </Text>
        <Text style={{ color: "white" }}>
          Address: {props.shippingAddress1} {props.shippingAddress2}
        </Text>
        <Text style={{ color: "white" }}>City {props.city}</Text>
        <Text style={{ color: "white" }}>Country: {props.country}</Text>
        <Text style={{ color: "white" }}>
          Date Ordered: {props.dateOrdered.split("T")[0]}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={{ color: "white" }}>Price: </Text>
          <Text style={styles.price}>
            {props.totalPrice.toLocaleString("en-US", {
              style: "currency",
              currency: "NGN",
              minimumFractionDigits: 0,
            })}
          </Text>
        </View>
        {currentScreen === "Orders" ? (
          <>
            <View>
              <Picker
                mode="dropdown"
                iosIcon={<Icon color={"#0F0"} name="arrow-down" />}
                style={{ width: undefined }}
                selectedValue={statusChange}
                placeholderIconColor={{ color: "#0071ff" }}
                placeholder="Change Status"
                placeholderStyle={{ color: "white" }}
                onValueChange={(e) => setStatusChange(e)}
              >
                {codes.map((c) => {
                  return (
                    <Picker.Item key={c.code} label={c.name} value={c.code} />
                  );
                })}
              </Picker>
            </View>
            <EasyButton dark large onPress={() => updateOrder()}>
              <Text style={{ color: "black" }}>Update</Text>
            </EasyButton>
          </>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5, //shadow to work on andriod
  },
  title: {
    backgroundColor: "#62b1f6",
    padding: 5,
  },
  priceContainer: {
    marginTop: 10,
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  price: {
    color: "white",
    fontWeight: "bold",
  },
  orderNumber: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default OrderCard;
