import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import { Container, Header, Icon, Text, Item, Input } from "native-base";
import ProductList from "./ProductList";
import SearchedProduct from "./SearchedProduct";
import Banner from "../Shared/Banner";
import CategoryFilter from "./CategoryFilter";

var { height } = Dimensions.get("window");
const ProductContainer = (props) => {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState();
  const [categories, setCategories] = useState([]);
  const [productsCategory, setProductsCategory] = useState([]);
  const [active, setActive] = useState();
  const [initialState, setInitialState] = useState([]);

  useFocusEffect(
    useCallback(() => {
      setFocus(false);
      setActive(-1);

      //products
      axios
        .get(`${baseURL}products`)
        .then((res) => {
          setProducts(res.data);
          setProductsFiltered(res.data);
          setProductsCategory(res.data);
          setInitialState(res.data);
          setLoading(false)
        })
        .catch((error) => {
          console.log("API call error: ", error);
        });

      //categories
      axios
        .get(`${baseURL}categories`)
        .then((res) => {
          setCategories(res.data);
        })
        .catch((error) => {
          console.log("API call error: ", error);
        });
      return () => {
        setProducts([]);
        setProductsFiltered([]);
        setFocus();
        setCategories([]);
        setActive();
        setInitialState();
      };
    }, [])
  );

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
    <>
    {loading == false ? (
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
            <SearchedProduct
              navigation={props.navigation}
              productsFiltered={productsFiltered}
            />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
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
                      return (
                        <ProductList
                          key={item._id}
                          item={item}
                          navigation={props.navigation}
                        />
                      );
                    })}
                  </View>
                ) : (
                  <View style={[styles.center, { height: 50 }]}>
                    <Text>No products found</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </Container>
    ) : //loading
      <Container style={[styles.center, {backgroundColor:'white'}]}>
        <ActivityIndicator
        size="large"
        color="red"
        />
      </Container>
  }
    </>
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
