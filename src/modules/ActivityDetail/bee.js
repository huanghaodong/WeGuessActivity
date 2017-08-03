import React, { Component } from 'react';
import { View, Text ,TouchableOpacity,StyleSheet} from 'react-native';
import TopNav from '../../component/topNav';

export default class Bee extends Component {
  render() {
    return (
      	<View style={styles.container}>
            <TopNav navigator={this.props.navigator} /> 
            <Text>我是Bee</Text>       
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