import React from "react";
import { StyleSheet, View, Text } from "react-native";

const Error =(props) =>{
    return(
        <View style={styles.container}>
            <Text style={styles.text}>{props.message}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        width: '100%',
        margin: 10
    },
    text:{
        color: 'red'
    }
})

export default Error