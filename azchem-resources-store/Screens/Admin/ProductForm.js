import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  NativeEventEmitter,
  ActivityIndicator,
} from "react-native";
import { Item, Picker } from "native-base";
import FormContainer from "../Shared/Form/FormContainer.js";
import Input from "../Shared/Form/Input.js";
import EasyButton from "../Shared/StyledComponents/EasyButton";
import Error from "../Shared/Error.js";
import Icon from "react-native-vector-icons/FontAwesome5";
import Toast from "react-native-toast-message";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";

const ProductForm = (props) => {
  const [pickerValue, setPickerValue] = useState();
  const [brand, setBrand] = useState();
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const [image, setImage] = useState();
  const [mainImage, setMainImage] = useState();
  const [category, setCategory] = useState();
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState();
  const [err, setError] = useState();
  const [stock, setStock] = useState();
  const [rating, setRating] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [richDescription, setRichDescription] = useState();
  const [numReviews, setNumReviews] = useState(0);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!props.route.params) {
      setItem(null);
    } else {
      setItem(props.route.params.item);
      setBrand(props.route.params.item.brand);
      setName(props.route.params.item.name);
      setPrice(props.route.params.item.price.toString());
      setDescription(props.route.params.item.description);
      setMainImage(props.route.params.item.image);
      setMainImage(props.route.params.item.image);
      setCategory(props.route.params.item.category._id);
      setStock(props.route.params.item.stock.toString());
    }
    setLoading(false);
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((err) => console.log(err));

    //Category
    axios
      .get(`${baseURL}categories`)
      .then((res) => setCategories(res.data))
      .catch((err) =>
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Error to load categories",
          text2: "",
        })
      );

    //imagePicker

    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Sorry, we need camera roll permissions to make this work!",
            text2: "",
          });
        }
      }
    })();

    return () => {
      setCategories([]);
    };
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Image result", result);

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setMainImage(selectedImage.uri);
      setImage(selectedImage.uri);
    }
  };

  const addProduct = () => {
    if (
      image == undefined ||
      name == "" ||
      brand == "" ||
      price == "" ||
      description == "" ||
      category == "" ||
      stock == ""
    ) {
      return setError("Please fill in the form correctly");
    }
    setLoading(true);
    let formData = new FormData();

    const newImageUri = "file:///" + image.split("file:/").join("");
    console.log("newImageUri", newImageUri.split("/").pop());

    formData.append("image", {
      uri: newImageUri,
      type: mime.getType(newImageUri),
      name: newImageUri.split("/").pop(),
    });
    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("stock", stock);
    formData.append("richDescription", richDescription);
    formData.append("rating", rating);
    formData.append("numReviews", numReviews);
    formData.append("isFeatured", isFeatured);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    //Update Product
    if (item !== null) {
      axios
        .put(`${baseURL}products/${item.id}`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 70,
              type: "success",
              text1: "Product updated successfully",
              text2: "",
            });
            setLoading(false);
            setTimeout(() => {
              props.navigation.navigate("Products");
            }, 500);
          }
        })
        .catch((err) => {
          Toast.show({
            topOffset: 70,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
    } else {
      //Create Product
      axios
        .post(`${baseURL}products`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 70,
              type: "success",
              text1: "New product added successfully",
              text2: "",
            });
            setLoading(false);
            setTimeout(() => {
              props.navigation.navigate("Products");
            }, 500);
          }
        })
        .catch((err) => {
          Toast.show({
            topOffset: 70,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
    }
  };

  return (
    <FormContainer title="Add Product">
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: mainImage }} />
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Icon style={{ color: "white" }} name="camera" size={50} />
        </TouchableOpacity>
      </View>
      <View style={styles.label}>
        <Text style={{ color: "red" }}>Brand</Text>
      </View>
      <Input
        placeholder="Brand"
        name="brand"
        id="brand"
        value={brand}
        onChangeText={(text) => setBrand(text)}
      />
      <View style={styles.label}>
        <Text style={{ color: "red" }}>Name</Text>
      </View>
      <Input
        placeholder="Name"
        name="name"
        id="name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <View style={styles.label}>
        <Text style={{ color: "red" }}>Price</Text>
      </View>
      <Input
        placeholder="Price"
        name="price"
        id="price"
        value={price}
        onChangeText={(text) => setPrice(text)}
        keyboardType={"numeric"}
      />
      <View style={styles.label}>
        <Text style={{ color: "red" }}>Stock</Text>
      </View>
      <Input
        placeholder="Stock"
        name="stock"
        id="stock"
        value={stock}
        onChangeText={(text) => setStock(text)}
        keyboardType={"numeric"}
      />
      <View style={styles.label}>
        <Text style={{ color: "red" }}>Description</Text>
      </View>
      <Input
        placeholder="Description"
        name="description"
        id="description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <Item picker>
        <Picker
          mode="dropdown"
          iosIcon={<Icon color={"#f40105"} name="arrow-down" />}
          style={{ width: undefined }}
          placeholder="Select your category..."
          selectedValue={pickerValue}
          placeholderStyle={{ color: "#f40105" }}
          placeholderIconColor="#f40105"
          onValueChange={(e) => {
            setCategory(e);
            setPickerValue(e);
          }}
        >
          {categories.map((c) => {
            return <Picker.Item key={c.id} label={c.name} value={c.id} />;
          })}
        </Picker>
      </Item>
      {loading ? (
        <View style={{ marginTop: 10 }}>
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : null}
      {err ? <Error message={err} /> : null}
      <View style={styles.buttonContainer}>
        <EasyButton large danger onPress={() => addProduct()}>
          <Text style={styles.buttonText}>Add Product</Text>
        </EasyButton>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  label: {
    width: "80%",
    marginTop: 10,
  },
  buttonContainer: {
    width: "80%",
    marginTop: 20,
    alignItems: "center",
    marginBottom: 40,
  },
  buttonText: {
    color: "white",
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderStyle: "solid",
    borderWidth: 8,
    padding: 0,
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "red",
    elevation: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10, //shadow to work on andriod
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  imagePicker: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "grey",
    padding: 8,
    borderRadius: 100,
    elevation: 8,
  },
});

export default ProductForm;
