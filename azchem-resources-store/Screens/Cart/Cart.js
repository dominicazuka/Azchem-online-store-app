import React, { useEffect, useContext, useCallback } from "react";
import {
  Image,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  Left,
  Right,
  Container,
  H1,
  Text,
  Thumbnail,
  Body,
  ListItem,
} from "native-base";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome5";
import Button from "react-native-button";
import * as actions from "../../Redux/Actions/cartActions";
import { SwipeListView } from "react-native-swipe-list-view";
import CartItem from "./CartItem.js";
import AuthGlobal from "../../Context/store/AuthGlobal.js";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";

var { height, width } = Dimensions.get("window");

const Cart = (props) => {
  const context = useContext(AuthGlobal);
  const { cartItems } = props;
  var total = 0;
  props.cartItems.forEach((cart) => {
    return (total += cart.product.price);
  });

  useEffect(() => {
    // This will log the cartItems whenever they change
    const productNames = cartItems.map((product) => product.product.name);
  }, [cartItems]);

  return (
    <>
      {props.cartItems.length ? (
        <Container>
          <SwipeListView
            data={cartItems}
            renderItem={({ item }) => <CartItem item={item} />}
            renderHiddenItem={(data) => (
              <View style={styles.hiddenContainer}>
                <TouchableOpacity
                  style={styles.hiddenButton}
                  onPress={() => props.removeFromCart(data.item)}
                >
                  <Icon name="trash" color={"white"} size={30} />
                </TouchableOpacity>
              </View>
            )}
            disableRightSwipe={true}
            previewOpenDelay={3000}
            friction={1000}
            tension={40}
            leftOpenValue={75}
            stopLeftSwipe={75}
            rightOpenValue={-75}
          />
          <View style={styles.bottomContainer}>
            <Left>
              <Text style={styles.price}>
                {total.toLocaleString("en-US", {
                  style: "currency",
                  currency: "NGN",
                  minimumFractionDigits: 0,
                })}
              </Text>
            </Left>
            <Right>
              <Button
                containerStyle={[
                  { backgroundColor: "#1F8B0D" },
                  styles.buttonContainer
                ]}
                disabledContainerStyle={{ backgroundColor: "grey" }}
                style={{ fontSize: 20, color: "white" }}
                onPress={() => {
                  props.clearCart(props);
                }}
              >
                Clear
              </Button>
            </Right>
            <Right>
              {context.stateUser.isAuthenticated ? (
                <Button
                  containerStyle={[{ backgroundColor: "red" },styles.buttonContainer]}
                  disabledContainerStyle={{ backgroundColor: "grey" }}
                  style={{ fontSize: 20, color: "white" }}
                  onPress={() => props.navigation.navigate("Checkout")}
                >
                  Checkout
                </Button>
              ) : (
                <Button
                  containerStyle={[
                    { backgroundColor: "#62b1f6" },
                    styles.buttonContainer,
                  ]}
                  disabledContainerStyle={{ backgroundColor: "grey" }}
                  style={{ fontSize: 20, color: "white" }}
                  onPress={() => props.navigation.navigate("User")}
                >
                  Login
                </Button>
              )}
            </Right>
          </View>
        </Container>
      ) : (
        <Container style={styles.emptyContainer}>
          <Text>Cart is empty!</Text>
          <Text>Add products to your cart to get started</Text>
        </Container>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    height: height,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    padding: 10,
    height: 45,
    overflow: "hidden",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 7,
    marginRight: 10,
  },
  bottomContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "white",
    elevation: 20,
  },
  price: {
    fontSize: 18,
    margin: 20,
    color: "red",
  },
  hiddenContainer: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  hiddenButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 25,
    height: 70,
    width: width / 1.2,
  },
});

const mapStateToProps = (state) => {
  const { cartItems } = state;
  return {
    cartItems: cartItems,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
    removeFromCart: (item) => dispatch(actions.removeFromCart(item)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
