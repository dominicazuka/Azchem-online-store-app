import React, { useEffect, useState, useContext } from "react";
import { Image, View, StyleSheet, Text, ScrollView } from "react-native";
import { Left, Right, Item, Picker, Container, H1 } from "native-base";
import Button from "react-native-button";
import Icon from "react-native-vector-icons/FontAwesome5";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import Error from "../../Shared/Error";
import AuthGlobal from "../../../Context/store/AuthGlobal";

const countries = require("../../../assets/data/countries.json");

const Checkout = (props) => {
  const [orderItems, setOrderItems] = useState();
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [err, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [user, setUser] = useState();

  const context = useContext(AuthGlobal)

  useEffect(() => {
    setOrderItems(props.cartItems);
    if (Object.keys(context.stateUser.user).length === 0) {
      props.navigation.navigate("User");
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please Login to Checkout",
        text2: "",
      });
    } else {
      setUser(context.stateUser.user.userId);
    }
    return () => {
      setOrderItems();
    };
  }, []);

  const checkOut = () => {
    if (
      city === "" ||
      country === "" ||
      phone === "" ||
      address === "" ||
      address2 === "" ||
      zip === ""
    ) {
      return setError("Please fill in the form correctly");
    } else {
      setError(""); // Clear the error if the form is valid
      setDisabled(false);
      let order = {
        city,
        country,
        dateOrdered: Date.now(),
        orderItems,
        phone,
        shippingAddress1: address,
        shippingAddress2: address2,
        status: "3",
        user,
        zip,
      };
      props.navigation.navigate("Payment", { order: order });
    }
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndroid={true}
    >
      <FormContainer title={"Shipping Address"}>
        <Input
          placeholder={"Phone"}
          name={"phone"}
          value={phone}
          keyboardType={"numeric"}
          onChangeText={(text) => setPhone(text)}
          required
        />
        <Input
          placeholder={"Shipping Address 1"}
          name={"ShippingAddress1"}
          value={address}
          onChangeText={(text) => setAddress(text)}
        />
        <Input
          placeholder={"Shipping Address 2"}
          name={"ShippingAddress2"}
          value={address2}
          onChangeText={(text) => setAddress2(text)}
        />
        <Input
          placeholder={"City"}
          name={"city"}
          value={city}
          onChangeText={(text) => setCity(text)}
        />
        <Input
          placeholder={"Zip Code"}
          name={"zip"}
          value={zip}
          keyboardType={"numeric"}
          onChangeText={(text) => setZip(text)}
        />
        <Item picker>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" color={"red"} />}
            style={{ width: undefined }}
            selectedValue={country}
            placeholder="Select your country"
            placeholderStyle={{ color: "black" }}
            placeholderIconColor="black"
            onValueChange={(e) => setCountry(e)}
          >
            {countries.map((c) => {
              return <Picker.Item key={c.code} label={c.name} value={c.name} />;
            })}
          </Picker>
        </Item>
        {err ? <Error message={err} /> : null}
        <View style={{ width: "80%", alignItems: "center" }}>
          <Button
            containerStyle={styles.buttonContainer}
            disabledContainerStyle={{ backgroundColor: "grey" }}
            style={{ fontSize: 20, color: "white" }}
            onPress={() => checkOut()}
            disabled={disabled} // Disable the button if there's an error
          >
            Confirm
          </Button>
        </View>
      </FormContainer>
    </KeyboardAwareScrollView>
  );
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
});

const mapStateToProps = (state) => {
  const { cartItems } = state;
  return {
    cartItems: cartItems,
  };
};

export default connect(mapStateToProps)(Checkout);
