import React, { Component ,PureComponent} from 'react';
import { View, Text ,TouchableOpacity,StyleSheet,ListView,Image,ScrollView,Dimensions,ActivityIndicator} from 'react-native';

export default class MoneyButton extends PureComponent{
	render(){
        console.log('呵呵')
        const {eachMoney,order} = this.props;
        if(order === 4){
            return(
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>活动已取消</Text>
                    </TouchableOpacity>
                )
        }else if(order === 6){
            return(
                     <View style={styles.eachBar}>
                        <Text style={styles.eachBarText}>{'中奖名单:每人分得'+Math.ceil(eachMoney)+'元'}</Text>
                    </View>
                )
        }else if(order === 5){
            return(
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>活动已截止</Text>
                    </TouchableOpacity>
                )
        }else if(order === 2){
            return(
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>活动已投注</Text>
                    </TouchableOpacity>
                )
        }else if(order === 3){
            return(
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>活动已满额</Text>
                    </TouchableOpacity>
                )
        }else if(order === 1){
            return(
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>提交</Text>
                    </TouchableOpacity>
                )
        }else{
            return(
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>已截止</Text>
                    </TouchableOpacity>
                )
        }
	}
}

const styles = StyleSheet.create({
     eachBar:{
        height:42,
        backgroundColor:'#3a66b3',
        justifyContent:'center',
        alignItems:'center'
    },
    eachBarText:{
        fontSize:14,
        color:'#fff'
    },
    button:{
        margin:10,
        marginTop:0,
        height:47,
        backgroundColor:'#3a66b3',
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center'
    },
    buttonText:{
        color:'#fff',
        fontSize:16,
        fontWeight:'400'
    },
})