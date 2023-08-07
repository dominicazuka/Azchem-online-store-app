import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TextInput,
  StyleSheet,
} from "react-native";
import EasyButton from "../Shared/StyledComponents/EasyButton";
import Toast from "react-native-toast-message";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

var { width } = Dimensions.get("window");

const Item = (props) => {
  return(
    <View style={styles.item}>
      <Text>{props.item.name}</Text>
      <EasyButton
      danger
      medium
      onPress={() => props.delete(props.item.id)}
      >
        <Text style={{color: "white", fontWeight: "bold"}}>Delete</Text>
      </EasyButton>
    </View>
  )
}
const Categories = (props) => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [token, setToken] = useState();

  useEffect(() => {
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`${baseURL}categories`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.log(error);
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Failed to load categories",
          text2: "",
        });
      });
      setCategoryName("")

    return () => {
      setCategories();
      setToken();
    };
  }, []);

  const addCategory = () => {
    const category = {
      name: categoryName
    }
    if(categoryName === ""){
      return Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Add a category name",
        text2: "Fill in the input field",
      });
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`  
      }
    }

    axios.post(`${baseURL}categories`, category, config).then((res) => {
      setCategories([...categories, res.data])
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Category added successfully",
        text2: "",
      });
    }).catch((error) =>{
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Failed to add category",
        text2: "",
      });
    })
  }

  const deleteCategory = (id) =>{
    const config = {
      headers: {
        Authorization: `Bearer ${token}`  
      }
    }
    axios.delete(`${baseURL}categories/${id}`, config).then((res) => {
      const newCategories = categories.filter((item) => item.id !== id)
      setCategories(newCategories)
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Category created successfully",
        text2: "",
      });
    }).catch((error) =>{
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Failed to add category",
        text2: "",
      });
    })
  }

  return (
    <View style={{ position: "relative", height: "100%" }}>
      <View style={{ marginBottom: 60 }}>
        <FlatList
          data={categories}
          renderItem={({ item, index }) => (<Item item={item} index={index} delete={deleteCategory}/>)}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View style={styles.bottomBar}>
        <View>
          <Text style={{marginLeft: 5}}>Add Category</Text>
        </View>
        <View style={{ width: width / 2.5 }}>
          <TextInput
            value={categoryName}
            style={styles.input}
            onChangeText={(text) => setCategoryName(text)}
          />
        </View>
        <View>
          <EasyButton
            medium
            primary
            onPress={() => addCategory()}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Submit</Text>
          </EasyButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    background: "white",
    width: width,
    height: 60,
    padding: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  input: {
    height: 40,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 15
  },
  item:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10, //shadow to work on andriod
    padding: 5,
    margin: 5,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 5
  }
});

export default Categories;
