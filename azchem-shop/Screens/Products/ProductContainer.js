import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { Container, Header, Icon, Text, Item, Input } from "native-base";
import ProductList from "./ProductList";
import SearchedProduct from "./SearchedProduct";
import Banner from "../Shared/Banner";
import CategoryFilter from "./CategoryFilter";

var { height } = Dimensions.get("window");
const data = require("../../assets/data/products.json");
const productCategories = require("../../assets/data/categories.json");
const ProductContainer = () => {
  const [products, setProducts] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState();
  const [categories, setCategories] = useState([]);
  const [productsCategory, setProductsCategory] = useState([]);
  const [active, setActive] = useState();
  const [initialState, setInitialState] = useState([]);

  useEffect(() => {
    setProducts(data);
    setProductsFiltered(data);
    setFocus(false);
    setCategories(productCategories);
    setProductsCategory(data);
    setActive(-1);
    setInitialState(data);
    return () => {
      setProducts([]);
      setProductsFiltered([]);
      setFocus();
      setCategories([]);
      setActive();
      setInitialState();
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

  //Categories
  const changeCategory = (ctg) => {
    {
      ctg === "all"
        ? [setProductsCategory(initialState), setActive(true)]
        : [
            setProductsCategory(
              products.filter((i) => i.category._id === ctg),
              setActive(true)
            ),
          ];
    }
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
          {focus == true ? <Icon onPress={onBlur} name="ios-close" /> : null}
        </Item>
      </Header>
      {focus == true ? (
        <SearchedProduct productsFiltered={productsFiltered} />
      ) : (
        <ScrollView>
          <View>
            <View>
              <Banner />
            </View>
            <View>
              <CategoryFilter
                categories={categories}
                categoryFilter={changeCategory}
                productsCategory={productsCategory}
                active={active}
                setActive={setActive}
              />
            </View>
            {productsCategory.length > 0 ? (
              <View style={styles.listContainer}>
                {productsCategory.map((item) => {
                  return <ProductList key={item._id} item={item} />;
                })}
              </View>
            ) : (
              <View style={[styles.center, { height: height / 2 }]}>
                <Text>No products found</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    backgroundColor: "white",
  },
  listContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    backgroundColor: "white",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
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
