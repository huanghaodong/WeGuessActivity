import React, { Component } from 'react';
import { View, Text ,StyleSheet} from 'react-native';
import {format,timeFormat} from '../../method';

export default class RaceMessage extends Component {
  render() {
    const {raceTitle,raceOption,endTime,PlayerCount,eachMoney} = this.props;
    return (
      	<View>
            <View style={styles.titBarBox}>
                <Text style={styles.titBar}>{raceTitle}</Text>
            </View>
            <View style={styles.race}>
                {raceOption.map((value,index)=>(<View key={index} style={styles.raceRow}>
                    <Text>{value.Option}</Text>
                    <Text>{value.BetCount+'人'}</Text>
                </View>))}
            </View>
            <View style={styles.cutOffBox}>
                <Text style={styles.cutOff}>{'截止时间:'+timeFormat(endTime,"yyyy年MM月dd日 hh:mm")}</Text>
                <Text style={styles.cutOff}>{'截止人数:'+PlayerCount+'人'}</Text>
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
	titBarBox:{
        height:36,
        justifyContent:'center',
        backgroundColor:'#f2f2f2',
        paddingLeft:10,
    },
    titBar:{            
        color:'#4c4c4c',
        fontSize:14
    },
    race:{
        height:62,
        flexDirection:'row'
    },
    raceRow:{
        flex:1,
        borderColor:'#ccc',
        borderWidth:1,
        borderLeftWidth:0,
        justifyContent:'center',
        alignItems:'center'
    },
    cutOffBox:{
        height:60,
        paddingLeft:10,
        paddingRight:10,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    cutOff:{
        fontSize:13,
        color:'grey'
    },
})

