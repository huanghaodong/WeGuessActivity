import React, { Component ,PureComponent} from 'react';
import { View, Text ,TouchableOpacity,StyleSheet,ListView,Image,ScrollView,Dimensions,ActivityIndicator} from 'react-native';

export default class MoneyFooter extends PureComponent{
	render(){
        console.log('啊啊啊啊')
		 if(this.props.status === 3){
            return(
                <View>
                    <Text style={styles.tips}>注：请以上中奖用户添加“众猜体育客服”微信号领取现金红包。</Text>
                    <Text style={styles.tips}> 微信号：zctykf </Text>
                    {this.props.isHiddenFooter ? null : <View>
                                            <ActivityIndicator size="large"/>
                                                </View>}
                </View>
                )
        }else{
            return(
                    <Text style={styles.tips}>参与抢红包将扣除您3,888猜豆。</Text>
                )
        }
	}
}

const styles = StyleSheet.create({
    tips:{
        fontSize:12,
        color:'#d90000',
        marginTop:10,
        marginLeft:10
    },

})