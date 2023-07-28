import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
import { Container, Header, Icon, Item, Input, Text } from "native-base";
import ProductList from "./ProductList";

const data = require("../../assets/data/products.json");
const ProductContainer = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(data);
    return () => {
      setProducts([]);
    };
  }, []);

  return (
    <Container>
      <Header searchBar rounded>
        <Item>
          <Icon name="ios-search"/>
          <Input
          placeholder="Search..."
          //onFocus={}
          //onChangeText={{(text) => {}}}
          />
        </Item>
      </Header>
      <View>
        <Text>Product Container</Text>
        <View style={{ marginTop: 100 }} />
        <FlatList
          data={products}
          numColumns={2}
          renderItem={({ item }) => (
            <ProductList key={item._name} item={item} />
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
    </Container>
  );
};

export default ProductContainer;
