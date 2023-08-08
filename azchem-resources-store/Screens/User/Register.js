import React, { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import Error from "../Shared/Error";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "react-native-button";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl.js";
import Toast from "react-native-toast-message";

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const register = () => {
    if (email === "" || name === "" || phone === "" || password === "") {
      return setError("Please fill in the form correctly");
    }
    // Regular expression to validate email format
    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailPattern.test(email)) {
      return setError("Invalid email format");
    }
    setError("");
    setLoading(true);
    let user = {
      name: name,
      email: email,
      password: password,
      phone: phone,
      isAdmin: false,
    };
    axios
      .post(`${baseURL}users/register`, user)
      .then((res) => {
        if (res.status == 200) {
          setLoading(false);
          Toast.show({
            topOffset: 70,
            type: "success",
            text1: "Registration Successful",
            text2: "Please login into your account",
          });
          setTimeout(() => {
            props.navigation.navigate("Login");
          }, 500);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          // Handle email or phone already exists error
          Toast.show({
            topOffset: 70,
            type: "error",
            text1: "Email or phone number already exists",
            text2: "Please try again with new credentials",
          });
        } else {
          console.log(error);
          Toast.show({
            topOffset: 70,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        }
      });

    console.log("Successfully submitted");
  };

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar={true}
      extraHeight={200}
      enableOnAndriod={true}
    >
      <FormContainer title={"Register"}>
        <Input
          placeholder={"Email"}
          name={"email"}
          id={"email"}
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />
        <Input
          placeholder={"Name"}
          name={"name"}
          id={"name"}
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder={"Phone Number"}
          name={"phone"}
          id={"phone"}
          keyboardType={"numeric"}
          onChangeText={(text) => setPhone(text)}
        />
        <Input
          placeholder={"Password"}
          name={"password"}
          id={"password"}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        {loading ? (
          <View style={{ marginTop: 10 }}>
            <ActivityIndicator size="large" color="red" />
          </View>
        ) : null}
        <View>{error ? <Error message={error} /> : null}</View>
        <View>
          <Button
            containerStyle={styles.buttonContainer}
            disabledContainerStyle={{ backgroundColor: "grey" }}
            style={{ fontSize: 20, color: "white" }}
            onPress={() => register()}
          >
            Register
          </Button>
        </View>
        <View style={styles.buttonGroup}>
          <Button
            containerStyle={[
              styles.buttonContainer,
              { backgroundColor: "#1F8B0D" },
            ]}
            disabledContainerStyle={{ backgroundColor: "grey" }}
            style={{ fontSize: 20, color: "white" }}
            onPress={() => {
              props.navigation.navigate("Login");
            }}
          >
            Back to Login
          </Button>
        </View>
      </FormContainer>
    </KeyboardAwareScrollView>
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
    marginBottom: 10,
  },
  buttonGroup: {
    width: "80%",
    margin: 10,
    alignItems: "center",
  },
});

export default Register;
