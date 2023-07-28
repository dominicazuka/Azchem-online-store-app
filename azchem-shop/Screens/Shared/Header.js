import React from 'react';
import { StyleSheet, Image, SafeAreaView } from 'react-native';
import logo from '../../assets/logo.png'

const Header = () =>{

    return (
        <SafeAreaView style={styles.header}>
            <Image 
            source = {logo}
            resizeMode='contain'
            style={{height: 50}}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header:{
        width: '100%',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        padding: 20,
        marginTop: 130
    }
})

export default Header;