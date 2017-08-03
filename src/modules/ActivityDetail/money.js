import React, { Component } from 'react';
import { View, Text ,TouchableOpacity,StyleSheet,ListView,Image,ScrollView,Dimensions} from 'react-native';
import TopNav from '../../component/topNav';
import HTTPBase from '../../network/http.js';
import RaceMessage from '../../component/raceMessage';
import RaceResult from '../../component/raceResult';
var StaticContainer = require('react-static-container');

const baseURI = 'http://m.weguess.cn/memberapi/api/WeChat/SearchActionByActionID';
const getWinnerListURI = 'http://m.weguess.cn/memberapi/api/WeChat/GetWinnerList';
var {height, width} = Dimensions.get('window');
export default class Money extends Component {
    constructor(props){
        super(props);
        this.state = {
            ds: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }),
            raceTitle:'',
            raceOption:[{Option:'',BetCount:0},{Option:'',BetCount:0},{Option:'',BetCount:0}],
            endTime:'',
            PlayerCount:0,
            eachMoney:0,
            data:[]
        }
        this._renderHeader = this._renderHeader.bind(this);
    }
    _renderRow(rowData,sectionID,rowID) {
        return(
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
    _renderHeader() {
        const {raceTitle,raceOption,endTime,PlayerCount,eachMoney} = this.state;
        return(
                <View>
                    <RaceMessage 
                        raceTitle={raceTitle} 
                        raceOption={raceOption}
                        endTime={endTime}
                        PlayerCount={PlayerCount}
                    />
                    <View style={styles.eachBar}>
                        <Text style={styles.eachBarText}>{'中奖名单:每人分得'+Math.ceil(eachMoney)+'元'}</Text>
                    </View>
                </View>
            )
    }
    _renderFooter() {
        return(
            <StaticContainer>
                <View>
                    <Text style={styles.tips}>注：请以上中奖用户添加“众猜体育客服”微信号领取现金红包。</Text>
                    <Text style={styles.tips}> 微信号：zctykf </Text>
                </View>
            </StaticContainer>
            )
    }
  render() {
    return (
      	<View style={styles.container}>
            <TopNav navigator={this.props.navigator}/>
            <ScrollView>
                {this._renderHeader()}
                <ListView 
                    dataSource={this.state.ds.cloneWithRows(dataFormat(this.state.data))}
                    renderRow={this._renderRow}
                    initialListSize={10}
                    enableEmptySections={true}
                    contentContainerStyle = {styles.list}
                />
                {this._renderFooter()}
            </ScrollView>        
         
        </View>
    );
  }
  componentDidMount() {
    let params = {
            "ActionID": this.props.ID,
        };
    let headers = {
        "QIC":"QIC",
        "Authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b3VyaXN0IjpmYWxzZSwiYWNjb3VudCI6IjEwMDYyNmMxLTRmMjUtNGNlYS1iODVhLTM2MTljNjQ5OTA3ZiIsImV4cCI6MTUwMTczMjI0OCwiaWF0IjoxNTAxNzMxNjQ4fQ.KSG7GH6ew-d8I1YneNzaHlvI7zSxcmucS4PPl6GwAPs",
    }
    HTTPBase.post(baseURI,params,headers).then((responseData)=>{
        const {Data} = responseData;
        this.setState({
            raceTitle:Data.Question[0].Question,
            raceOption:Data.Question[0].Options,
            endTime:Data.Action.EndTime,
            PlayerCount:Data.Action.PlayerCount,
            eachMoney:Data.Action.TotalRewards/Data.Question[0].Options[0].BetCount,
        })
    }).catch((error) => {
            console.log(error)
        })
    //如果活动已经结束，则有中奖者列表
    if(this.props.status === 3){
        params = {
            "ActionID": this.props.ID,
            "PageIndex":1,
            "PageSize":20
        };
        HTTPBase.post(getWinnerListURI,params,headers).then((responseData)=>{
            const {Data} = responseData;
            this.setState({
                data:Data
            })
        })
    }
  }
}
    
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    },    
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
    list:{

    },
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
    tips:{
        fontSize:12,
        color:'#d90000',
        marginTop:10,
        marginLeft:10
    },
})
//数据重组格式 [{a:1},{b:2},{c:3},{d:4}]  =>  [[{a:1},{b:2}],[{c:3},{d:4}]]
function dataFormat(data){
    var arr = [];
    for(var i = 0;i<data.length;i+=2){
      var newArr = [];
      newArr.push(data[i]);
      data[i+1]&&newArr.push(data[i+1]);
      arr.push(newArr)
    }
    return arr;
  }