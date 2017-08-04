import React, { Component ,PureComponent} from 'react';
import { View, Text ,TouchableOpacity,StyleSheet,ListView,Image,ScrollView,Dimensions,ActivityIndicator} from 'react-native';

export default class MoneyRow extends PureComponent{
	render(){
		const {rowData,rowID} = this.props;
		return(
			/*如果rowID是奇数,改变背景色*/
            <View  style={[styles.row,rowID%2===1?{backgroundColor:'#e6e6e6'}:{}]}>
                <View style={styles.rowItem}>
                    <Image style={styles.winHead} source={{uri:rowData[0].MemberPic}}/>
                    <Text style={styles.winName}>{rowData[0].Nickname}</Text>
                </View>
                {rowData[1]&&(
                    <View style={styles.rowItem}>
                        <Image style={styles.winHead} source={{uri:rowData[1].MemberPic}}/>
                        <Text style={styles.winName}>{rowData[1].Nickname}</Text>
                    </View>
                    )}
            </View>
			)
	}
}

const styles = StyleSheet.create({
    row:{
        flexDirection:'row',
        alignItems:'center',
        height:42,
        backgroundColor:'#f2f2f2',
        borderBottomWidth:1,
        borderColor:'#ccc'
    },
    rowItem:{
        flex:1,
        flexDirection:'row'
    },
    winHead:{
        height:24,
        width:24,
        resizeMode:'stretch',
        marginLeft:20
    },
    winName:{
        color:'#343434',
        fontSize:12,
        marginLeft:15
    },

})