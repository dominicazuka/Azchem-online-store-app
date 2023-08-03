import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import Button from "react-native-button";
import Error from "../Shared/Error";
import axios from "axios";
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";

//Context
import AuthGlobal from "../../Context/store/AuthGlobal";
import { loginUser, setCurrentUser } from "../../Context/actions/Auth.actions";
import Toast from "react-native-toast-message";

const Login = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (context.stateUser.isAuthenticated === true) {
  //     return props.navigation.navigate("User Profile");
  //   }
  // }, [context.stateUser.isAuthenticated]);

  const handleSubmit = async () => {
    const user = {
      email,
      password,
    };

    if (email === "" || password === "") {
      return setError("Please fill in your credentials");
    }
    setError("");
    const loginResponse = await fetch(`${baseURL}users/login`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const loginData = await loginResponse.json();
    if (loginData.message === "Wrong Credentials!") {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please provide correct credentials",
        text2: "",
      });
    } else {
      const token = loginData.token;
      await AsyncStorage.setItem("jwt", token);
      const decoded = jwt_decode(token);
      setCurrentUser({ decoded, user: user.email });
      loginUser(user, context.dispatch);
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Login Successful",
        text2: "",
      });
      return props.navigation.navigate("User Profile");
    }
  };

  return (
    <FormContainer title={"Login"}>
      <Input
        placeholder={"Enter Email"}
        name={"email"}
        id={"email"}
        value={email}
        onChangeText={(text) => {
          setEmail(text.toLowerCase());
        }}
      />
      <Input
        placeholder={"Enter Password"}
        name={"password"}
        id={"password"}
        value={password}
        secureTextEntry={true}
        onChangeText={(text) => {
          setPassword(text);
        }}
      />
      <View style={styles.buttonGroup}>
        {error ? <Error message={error} /> : null}
        <Button
          containerStyle={styles.buttonContainer}
          disabledContainerStyle={{ backgroundColor: "grey" }}
          style={{ fontSize: 20, color: "white" }}
          onPress={() => {
            handleSubmit();
          }}
        >
          Login
        </Button>
      </View>
      <View style={[{ marginTop: 10 }, styles.buttonGroup]}>
        <Text style={styles.middleText}>Don't have an account yet?</Text>
        <Button
          containerStyle={styles.buttonContainer}
          disabledContainerStyle={{ backgroundColor: "grey" }}
          style={{ fontSize: 20, color: "white" }}
          onPress={() => {
            props.navigation.navigate("Register");
          }}
        >
          Register
        </Button>
      </View>
    </FormContainer>
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
  buttonGroup: {
    width: "80%",
    alignItems: "center",
    marginTop: 10,
  },
  middleText: {
    marginBottom: 10,
    alignItems: "center",
  },
});

export default Login;
