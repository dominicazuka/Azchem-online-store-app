import React, { useContext, useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Button from "react-native-button";
import { Container } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/store/AuthGlobal";
import { logoutUser } from "../../Context/actions/Auth.actions";

const UserProfile = (props) => {
  const context = useContext(AuthGlobal);
  const { user } = context.stateUser;


  return ( 
    <Container style={styles.container}>
      <ScrollView contentContainerStyle={styles.subContainer}>
        <Text style={{ fontSize: 30 }}>
          {user ? user.name : ""}
        </Text>
        <View style={{ marginTop: 20 }}>
          <Text style={{ margin: 10 }}>
            Email: {user ? user.email : ""}
          </Text>
          <Text style={{ margin: 10 }}>
            Phone: {user ? user.phone : ""}
          </Text>
        </View>
        <View style={{ marginTop: 80 }}>
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
    marginTop: 60,
  },
});

export default UserProfile;
