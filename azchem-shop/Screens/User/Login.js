import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import Button from "react-native-button";
import Error from "../Shared/Error";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const user = {
      email,
      password,
    };
    if (email === "" || password === "") {
      setError("Please fill in your credentials");
    } else {
      setError("");
      console.log("Successfully submitted");
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
    marginTop: 10
  },
  middleText: {
    marginBottom: 10,
    alignItems: "center",
  },
});

export default Login;
