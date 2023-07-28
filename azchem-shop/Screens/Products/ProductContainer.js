import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
import { Container, Header, Icon, Text, Item, Input } from "native-base";
import ProductList from "./ProductList";
import SearchedProduct from "./SearchedProduct";

const data = require("../../assets/data/products.json");
const ProductContainer = () => {
  const [products, setProducts] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState();

  useEffect(() => {
    setProducts(data);
    setProductsFiltered(data);
    setFocus(false);
    return () => {
      setProducts([]);
      setProductsFiltered([]);
      setFocus();
    };
  }, []);

  const searchProduct = (text) => {
    setProductsFiltered(
      products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  return (
    <Container>
      <Header searchBar rounded style={styles.header}>
        <Item style={styles.item}>
          <Icon
            ios="ios-search"
            android="md-search"
            style={{ fontSize: 20, color: "red" }}
          />
          <Input
            placeholder="Search..."
            onFocus={openList}
            onChangeText={(text) => searchProduct(text)}
          />
          {focus == true ? (
            <Icon onPress={onBlur} name='ios-close'/>
          ) : null }
        </Item>
      </Header>
      {focus == true ? (
        <SearchedProduct productsFiltered={productsFiltered} />
      ) : (
        <View>
          <Text>Product Container</Text>
          <View style={{ marginTop: 20 }} />
          <FlatList
            data={products}
            numColumns={2}
            renderItem={({ item }) => (
              <ProductList key={item._id} item={item} />
            )}
            keyExtractor={(item) => item._id}
          />
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    borderRadius: 4,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    backgroundColor: "white",
  },
});

export default ProductContainer;
