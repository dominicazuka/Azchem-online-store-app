import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
import ProductList from './ProductList'

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
    <View>
      <Text>Product Container</Text>
      <View style={{marginTop: 100}}/>
      <FlatList
      data={products}
      numColumns={2}
      renderItem={({item}) => <ProductList key={item._name} item={item}/>}
      keyExtractor={item => item._id}
      />
    </View>
  );
};

export default ProductContainer;
