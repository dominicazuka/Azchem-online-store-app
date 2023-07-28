import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Dimensions, View, ScrollView } from "react-native";
import Swiper from "react-native-swiper";

var { width } = Dimensions.get("window");

const Banner = () => {
  const [bannerData, setBannerData] = useState([]);

  useEffect(() => {
    setBannerData([
      "https://i.ibb.co/Cs2Xnnp/1-Large.jpg",
      "https://i.ibb.co/gdsmJjz/2-Large.jpg",
      "https://i.ibb.co/4FnrPLh/3-Large.jpg",
    ]);

    return () => {
      setBannerData([]);
    };
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.swiper}>
          <Swiper
            style={styles.swiperCont}
            showButton={false}
            autoplay={true}
            autoplayTimeout={2}
          >
            {bannerData.map((item) => {
              return (
                <Image
                  key={item}
                  style={styles.imageBanner}
                  resizeMode="contain"
                  source={{ uri: item }}
                />
              );
            })}
          </Swiper>
          <View style={{ height: 10 }}></View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  swiper: {
    width: width,
    alignItems: "center",
    marginTop: 10,
  },
  swiperCont:{
    height: width / 2,
  },
  imageBanner: {
    height: width / 2,
    width: width - 40,
    borderRadius: 20,
    marginHorizontal: 20,
  },
});

export default Banner;
