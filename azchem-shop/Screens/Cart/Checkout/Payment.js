import React, { useState, useEffect } from "react";
import { View, StyleSheet} from "react-native";
import {
  Left,
  Right,
  Item,
  Container,
  Header,
  Content,
  Text,
  Radio,
  Picker,
  Body,
  Title,
  ListItem,
} from "native-base";
import Button from "react-native-button";
import Icon from "react-native-vector-icons/FontAwesome5";

const methods = [
  { name: "Cash on Delivery", value: 1 },
  { name: "Bank Transfer", value: 2 },
  { name: "Card Payment", value: 3 },
];

const paymentCards = [
  { name: "MasterCard", value: 1 },
  { name: "Visa", value: 2 },
  { name: "Others", value: 3 },
];

const Payment = (props) => {
  const order = props.route.params;
  const [selected, setSelected] = useState();
  const [card, setCard] = useState();

  return (
    <Container>
      <Header style={{ backgroundColor: "red", color: "white" }}>
        <Body>
          <Title>Choose your payment method</Title>
        </Body>
      </Header>

      <Content>
        {methods.map((item, index) => {
          return (
            <ListItem key={item.name} onPress={() => setSelected(item.value)}>
              <Left>
                <Text>{item.name}</Text>
              </Left>
              <Right>
                <Radio selected={selected == item.value} />
              </Right>
            </ListItem>
          );
        })}

        {selected == 3 ? (
          <Picker
            mode="dropdown"
            iosIcon={<Icon name={"arrow-down"} />}
            headerStyle={{ backgroundColor: "red" }}
            headerBackButtonTextStyle={{ color: "white" }}
            headerTitleStyle={{ color: "white" }}
            selectedValue={card}
            onValueChange={(x) => setCard(x)}
          >
            {paymentCards.map((c, index) => {
              return <Picker.Item key={c.name} label={c.name} value={c.name} />;
            })}
          </Picker>
        ) : null}
        <View style={{marginTop: 60, alignSelf: 'center'}}>
        <Button
            containerStyle={styles.buttonContainer}
            disabledContainerStyle={{ backgroundColor: "grey" }}
            style={{ fontSize: 20, color: "white" }}
            onPress={() => props.navigation.navigate('Confirm', {order})}
          >
            Confirm
          </Button>
        </View>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
    buttonContainer: {
        marginTop: 15,
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
})

export default Payment;
