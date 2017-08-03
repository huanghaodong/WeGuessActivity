import React, { Component } from 'react';
import { View, Text ,StyleSheet} from 'react-native';

export default class RaceResult extends Component {
  render() {
    return (
      	<View style={styles.raceResult}>
	        <View style={styles.raceItem}>
	            <View style={[styles.raceSqure,styles.blue]}></View>
	            <Text style={styles.ResultText}>正确结果</Text>
	        </View>
	        <View style={styles.raceItem}>
	            <View style={[styles.raceSqure,styles.red]}></View>
	            <Text style={styles.ResultText}>您的选择</Text>
	        </View>
	        <View style={styles.raceItem}>
	            <View style={[styles.raceSqure,styles.green]}></View>
	            <Text style={styles.ResultText}>您猜对了</Text>
	        </View>
	    </View>
    );
  }
}

const styles = StyleSheet.create({
	raceResult:{
        height:40,
        paddingLeft:10,
        paddingRight:10,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    raceItem:{
        flexDirection:'row',
        alignItems:'center'
    },
    raceSqure:{
        width:16,
        height:16
    },
    ResultText:{
        fontSize:13,
        color:'grey'
    },
    blue:{
        backgroundColor:'#3a66b3'
    },
    red:{
        backgroundColor:'#d90000'
    },
    green:{
        backgroundColor:'#009A44'
    },
})