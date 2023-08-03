import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Header, Item, Input } from "native-base";
import Button from "react-native-button";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListItem from "./ListItem";

var { height, width } = Dimensions.get("window");

const ListHeader = () => {
  return (
    <View elevation={1} style={styles.listHeader}>
      <View style={styles.headerItem}></View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Brand</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Name</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Category</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Price</Text>
      </View>
    </View>
  );
};

const Products = (props) => {
  const [productList, setProductList] = useState();
  const [productFilter, setProductFilter] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((err) => console.log(err));
      axios.get(`${baseURL}products`).then((res) => {
        setProductList(res.data);
        setProductFilter(res.data);
        setLoading(false);
      });

      return () => {
        setProductList();
        setProductFilter();
        setLoading();
      };
    }, [])
  );

   const searchProduct =(text) =>{
    if(text == ""){
      setProductFilter(productList)
    }
    setProductFilter(
      productList.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    )
   }

   const deleteProduct = (id) => {
    axios
        .delete(`${baseURL}products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
            const products = productFilter.filter((item) => item.id !== id)
            setProductFilter(products)
        })
        .catch((error) => console.log(error));
}

  return (
    <View>
      <View>
        <Header searchBar rounded style={{backgroundColor: "white", margin: 10}}>
          <Item style={{ padding: 5 }}>
            <Icon name="search" style={{color:'red'}}/>
            <Input
              placeholder="Search..."
              onChangeText={(text) => searchProduct(text)}
            />
          </Item>
        </Header>
      </View>

      {loading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <FlatList
          data={productFilter}
          renderItem={({ item, index }) => (
            <ListItem 
            {...item} 
            navigation={props.navigation} 
            index={index}
            delete={deleteProduct}
            />
          )}
          ListHeaderComponent={ListHeader}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: "gainsboro",
  },
  headerItem: {
    margin: 3,
    width: width / 6,
  },
  spinner:{
    height: height /2,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Products;
