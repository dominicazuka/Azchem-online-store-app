import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import * as actions from "../../Redux/Actions/cartActions";
import Button from "react-native-button";

var { width } = Dimensions.get("window");

const ProductCard = (props) => {
  const { name, price, image, stock } = props;

  return (
    <ScrollView horizontal={true} horizontalSpacing={20}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          resizeMode="contain"
          source={{
            uri: image
              ? image
              : "https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png",
          }}
        />
        <View style={styles.card} />
        <Text style={styles.title}>
          {name.length > 15 ? name.substring(0, 15 - 3) + "..." : name}
        </Text>
        <Text style={styles.price}> ₦{price} </Text>
        {stock > 0 ? (
          <View style={{ marginBottom: 60, marginTop: 10 }}>
            <Button
              containerStyle={styles.buttonContainer}
              disabledContainerStyle={{ backgroundColor: "grey" }}
              style={{ fontSize: 20, color: "white" }}
              onPress={() => {
                props.addItemToCart(props);
              }}
            >
              Add to Cart
            </Button>
          </View>
        ) : (
          <Text style={{ marginTop: 20 }}> Out of Stock</Text>
        )}
      </View>
    </ScrollView>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (product) =>
      dispatch(actions.addToCart({ quantity: 1, product })),
  };
};

const styles = StyleSheet.create({
  container: {
    width: width / 2 - 20,
    height: width / 1.7,
    padding: 10,
    borderRadius: 20,
    marginTop: 30,
    marginBottom: 5,
    marginLeft: 10,
    alignItems: "center",
    elevation: 8,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, //shadow to work on andriod
  },
  image: {
    width: width / 2 - 20 - 10,
    height: width / 2 - 20 - 30,
    backgroundColor: "transparent",
    position: "absolute",
    top: -45,
  },
  card: {
    marginBottom: 10,
    height: width / 2 - 20 - 90,
    backgroundColor: "transparent",
    width: width / 2 - 20 - 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  price: {
    fontSize: 20,
    color: "black",
    marginTop: 10,
  },
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
});

export default connect(null, mapDispatchToProps)(ProductCard);
