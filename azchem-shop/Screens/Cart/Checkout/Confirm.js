import React from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { Text, Left, Right, ListItem, Thumbnail, Body } from "native-base";
import { connect } from "react-redux";
import * as actions from "../../../Redux/Actions/cartActions.js";
import Button from "react-native-button";
import Toast from "react-native-toast-message";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl.js";

var { height, width } = Dimensions.get("window");

const Confirm = (props) => {
  const finalOrder = props.route.params;

  const confirmOrder = () => {
    
    if(finalOrder === undefined){
      return Toast.show({
        topOffset: 70,
        type: "error",
        text1: "Fill out forms in previous pages",
        text2: "Navigate to shipping page to start",
      });
    }
    const order = finalOrder.order.order;
    axios
      .post(`${baseURL}orders`, order)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          Toast.show({
            topOffset: 70,
            type: "success",
            text1: "Order completed successfully",
            text2: "",
          });
          setTimeout(() => {
            props.clearCart();
            props.navigation.navigate("Cart");
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
          Confirm Order
        </Text>
        {props.route.params ? (
          <View style={{ borderWidth: 1, borderColor: "red" }}>
            <Text style={styles.shipping}>Shipping to </Text>
            <View style={{ padding: 8 }}>
              <Text> Address: {finalOrder.order.order.shippingAddress1}</Text>
              <Text> Address2: {finalOrder.order.order.shippingAddress2}</Text>
              <Text> City: {finalOrder.order.order.city}</Text>
              <Text> Zip Code: {finalOrder.order.order.zip}</Text>
              <Text> Country: {finalOrder.order.order.country}</Text>
            </View>
            <Text style={styles.title}>Items:</Text>
            {finalOrder.order.order.orderItems.map((x) => {
              return (
                <ListItem style={styles.listItem} key={x.product.name} avatar>
                  <Left>
                    <Thumbnail source={{ uri: x.product.image }} />
                  </Left>
                  <Body style={styles.body}>
                    <Left>
                      <Text>{x.product.name}</Text>
                    </Left>
                    <Right>
                      <Text>
                        {" "}
                        {x.product.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "NGN",
                          minimumFractionDigits: 0,
                        })}
                      </Text>
                    </Right>
                  </Body>
                </ListItem>
              );
            })}
          </View>
        ) : null}
        <View style={{ alignItems: "center", margin: 20 }}>
          <Button
            containerStyle={styles.buttonContainer}
            disabledContainerStyle={{ backgroundColor: "grey" }}
            style={{ fontSize: 20, color: "white" }}
            onPress={() => confirmOrder()}
          >
            Place Order
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
  };
};
const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 15,
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
    height: height,
    padding: 8,
    alignContent: "center",
    backgroundColor: "white",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  shipping: {
    alignSelf: "center",
    margin: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    alignSelf: "center",
    margin: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  listItem: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    width: width / 1.2,
  },
  body: {
    margin: 10,
    alignItems: "center",
    flexDirection: "row",
  },
});

export default connect(null, mapDispatchToProps)(Confirm);
