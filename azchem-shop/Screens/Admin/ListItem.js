import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import Button from "react-native-button";
import Icon from "react-native-vector-icons/FontAwesome5";
import EasyButton from "../Shared/StyledComponents/EasyButton";

var { width } = Dimensions.get("window");

const ListItem = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              underlayColor="#E8E8E8"
              onPress={() => {
                setModalVisible(false);
              }}
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                top: 5,
                right: 10,
              }}
            >
              <Icon name="window-close" size={20} />
            </TouchableOpacity>
            <Button
              containerStyle={[
                styles.buttonContainer,
                { marginBottom: 10, backgroundColor: "#1F8B0D" },
              ]}
              disabledContainerStyle={{ backgroundColor: "grey" }}
              style={{ fontSize: 20, color: "white" }}
              onPress={() => {
                props.navigation.navigate("Product Form", { item: props }),
                  setModalVisible(false);
              }}
            >
              Edit
            </Button>

            <Button
              containerStyle={styles.buttonContainer}
              disabledContainerStyle={{ backgroundColor: "grey" }}
              style={{ fontSize: 20, color: "white" }}
              onPress={() => {
                props.deleteProduct();
                setModalVisible(false);
              }}
            >
              Delete
            </Button>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("Product Detail", { item: props });
        }}
        onLongPress={() => setModalVisible(true)}
        style={[
          styles.container,
          {
            backgroundColor: props.index % 2 == 0 ? "white" : "gainsboro",
          },
        ]}
      >
        <Image
          source={{
            uri: props.image
              ? props.image
              : "https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png",
          }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.item}>{props.brand}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.item}>
          {props.name}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.item}>
          {props.category.name}
        </Text>
        <Text style={styles.item}>
          {props.price.toLocaleString("en-US", {
            style: "currency",
            currency: "NGN",
            currencyDisplay: "symbol",
            minimumFractionDigits: 0,
          })}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 5,
    width: width,
  },
  image: {
    borderRadius: 15,
    width: width / 6,
    height: 20,
    margin: 2,
  },
  item: {
    flexWrap: "wrap",
    margin: 3,
    width: width / 6,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
});
export default ListItem;
