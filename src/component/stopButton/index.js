import React, { Component } from 'react';
import { View, Text ,TouchableOpacity,StyleSheet} from 'react-native';

export default class stopButton extends Component {
  render() {
    return (
      	<TouchableOpacity style={styles.hasStop}>
            <Text style={styles.hasStopText}>已截止</Text>
        </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
	hasStop:{
        margin:10,
        marginTop:0,
        height:47,
        backgroundColor:'#3a66b3',
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center'
    },
    hasStopText:{
        color:'#fff',
        fontSize:16,
        fontWeight:'400'
    },
})