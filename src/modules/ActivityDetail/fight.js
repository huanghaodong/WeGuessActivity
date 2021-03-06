import React, { Component } from 'react';
import { View, Text ,TouchableOpacity,StyleSheet,ListView,Image,ScrollView,Dimensions} from 'react-native';
import TopNav from '../../component/topNav';
import HTTPBase from '../../network/http.js';
import RaceMessage from '../../component/raceMessage';
import RaceResult from '../../component/raceResult';
import {format} from '../../method';

const baseURI = 'http://m.weguess.cn/memberapi/api/WeChat/SearchActionByActionID';
const getWinnerListURI = 'http://m.weguess.cn/memberapi/api/WeChat/GetWinnerList';
var {height, width} = Dimensions.get('window');
export default class Bee extends Component {
    constructor(props){
        super(props);
        this.state = {
            isload:false,
            ds: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }),
            Code:'',
            raceTitle:'',
            raceOption:[{Option:'',BetCount:0},{Option:'',BetCount:0},{Option:'',BetCount:0}],
            eachBee:0,
            entryFee:0,
            data:[],
            betInfo:{}
        }
        this._renderRaceResult = this._renderRaceResult.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this._renderButton = this._renderButton.bind(this);
    }
    _renderRow(rowData,sectionID,rowID) {
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
    _renderHeader() {
        const {raceTitle,raceOption,eachBee,entryFee} = this.state;
        return(
                <View>
                    <View>
                        <View style={styles.titBarBox}>
                            <Text style={styles.titBar}>{raceTitle}</Text>
                        </View>
                        <View style={styles.race}>
                            {raceOption.map((value,index)=>(<View key={index} style={[styles.raceRow,value.IsRight?styles.bgBlue:{}]}>
                                <Text>
                                    <Text style={[{fontSize:15,color:'#333'},value.IsRight?styles.fontColorWhite:{}]}>{value.Option}</Text>
                                    <Text style={[{fontSize:12,color:'grey'},value.IsRight?styles.fontColorWhite:{}]}>{'('+value.BetCount+'人)'}</Text>
                                </Text>
                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                    <Image style={styles.bee} source={require('../../img/bean.png')}/>
                                    <Text style={[{fontSize:12,color:'grey'},value.IsRight?styles.fontColorWhite:{}]}>{format(entryFee*value.BetCount)}</Text>
                                </View>               
                            </View>))}
                        </View>
                    </View>
                    {this._renderRaceResult()}                    
                    {this._renderButton()}
                </View>
            )
    }
    _renderRaceResult(){
        if(this.props.status === 3){
            return (<RaceResult />)
        }else{
            return null;
        }
    }
    _renderButton() {
        const {eachBee} = this.state;
        const order = dealStatus(this.state.betInfo).Order;
        if(order === 4){
            return(
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>活动已取消</Text>
                    </TouchableOpacity>
                )
        }else if(order === 6){
            return(
                     <View style={styles.eachBar}>
                        <Text style={styles.eachBarText}>{'中奖名单:每人分得'+Math.ceil(eachBee)+'猜豆'}</Text>
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
        }








        else{
            return(
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>已截止</Text>
                    </TouchableOpacity>
                )
        }
    }
  render() {
    if(this.state.isload){
    return (
        <View style={styles.container}>
            <TopNav navigator={this.props.navigator} Code={this.state.Code}/>
            <ListView 
                    dataSource={this.state.ds.cloneWithRows(dataFormat(this.state.data))}
                    renderRow={this._renderRow}
                    initialListSize={10}
                    enableEmptySections={true}
                    contentContainerStyle = {styles.list}
                    renderHeader = {this._renderHeader}
                />
        </View>
        )
    }else{
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>无数据</Text></View>
            )
    }
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
        console.log(Data)
        this.setState({
            isload:true,
            Code:Data.Action.Code,
            raceTitle:Data.Question[0].Question,
            raceOption:Data.Question[0].Options,
            entryFee:Data.Action.EntryFee,
            betInfo:Data.BetInfo
        })
    }).catch((error) => {
            console.log(error)
        })
    //如果活动已经结束，则应该渲染有中奖者列表
    if(this.props.status === 3){
        params = {
            "ActionID": this.props.ID,
            "PageIndex":1,
            "PageSize":20
        };
        HTTPBase.post(getWinnerListURI,params,headers).then((responseData)=>{
            const {Data} = responseData;
            this.setState({
                data:Data,
                eachBee:Data[0].WinLose
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
    bee:{
        width:14,
        height:14,
        resizeMode:'stretch'
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
     bgBlue:{
        backgroundColor:'#3a66b3'
    },
    fontColorBlack:{
        color:'#333'
    },
    fontColorWhite:{
        color:'#fff'
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

//抢红包活动状态
function dealStatus(betInfo){
    if(betInfo.IsCancel){
        betInfo.Order = 4;
    }else if(betInfo.IsEnd){
        betInfo.Order = 6;
    }else if(betInfo.IsOver){
        betInfo.Order = 5;
    }else if(betInfo.IsBet){
        betInfo.Order = 2;
    }else if(betInfo.IsFull){
        betInfo.Order = 3;
    }else{
        betInfo.Order = 1;
    }
    return betInfo;
}