import React, { Component } from 'react';
import { View, Image,Text ,TouchableOpacity,StyleSheet,InteractionManager} from 'react-native';
import Help from '../help';

export default class TopNav extends Component {
    _onPress() {   

            this.props.navigator.pop();

    }
    helpButton() {
        this.props.navigator.push({
            component:Help
        });
    }
    render() {
        return (
          	<View style={styles.topNav}>
                    <TouchableOpacity style={styles.left} onPress={this._onPress.bind(this)}>
                        <View style={styles.arrow}></View>
                    </TouchableOpacity>
                    <Text style={styles.center}>{this.props.Code}</Text>
                    <TouchableOpacity style={styles.right} onPress={this.helpButton.bind(this)}>
                        <Image style={styles.img} source={require('../../img/help.png')} />
                    </TouchableOpacity>
            </View>
        );
      }
    }

const styles = StyleSheet.create({
	topNav:{
        height:44,
        marginLeft:10,
        marginRight:10,
        backgroundColor:'#fff',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    left:{
        width:0,
        height:0,
        borderColor:'transparent',
        borderRightColor:'#3a66b3',
        borderWidth:12,
    },
    arrow:{
        width:0,
        height:0,
        borderColor:'transparent',
        borderRightColor:'#fff',
        borderWidth:12,
        top:-12,
        right:8
    },
    center:{
        fontSize:17,
        fontWeight:'500',
        color:'#3a66b3'
    },
    right:{
        width:20,
        height:20
    },
    img:{
        width:20,
        height:20,
        resizeMode:'stretch'
    }
})