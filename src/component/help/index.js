import React, { Component } from 'react';
import { View, Text ,TouchableOpacity,StyleSheet,WebView} from 'react-native';


export default class Help extends Component {
  render() {
    return (
      	<View style={styles.container}>
            <WebView 
              source={{html:'http://m.weguess.cn/#/tab/gamerule/3'}}
            />       
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    },
})