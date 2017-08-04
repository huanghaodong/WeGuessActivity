import React, { Component } from 'react';
import { View, Text ,TouchableOpacity,StyleSheet,ListView,Image,ScrollView,Dimensions,ActivityIndicator} from 'react-native';
import TopNav from '../../component/topNav';
import HTTPBase from '../../network/http.js';
import RaceMessage from '../../component/raceMessage';
import RaceResult from '../../component/raceResult';

const baseURI = 'http://m.weguess.cn/memberapi/api/WeChat/SearchActionByActionID';
const getWinnerListURI = 'http://m.weguess.cn/memberapi/api/WeChat/GetWinnerList';
var {height, width} = Dimensions.get('window');
export default class Money extends Component {
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
            endTime:'',
            PlayerCount:0,
            eachMoney:0,
            data:[],
            betInfo:{},
            isHiddenFooter:false,
            //上拉还能加载更多中奖用户
            hasMorePageIndex:true
        }
        this._renderRaceResult = this._renderRaceResult.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this._renderButton = this._renderButton.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
        this.loadMore = this.loadMore.bind(this);
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
        const {raceTitle,raceOption,endTime,PlayerCount,eachMoney} = this.state;
        return(
                <View>
                    <RaceMessage 
                        raceTitle={raceTitle} 
                        raceOption={raceOption}
                        endTime={endTime}
                        PlayerCount={PlayerCount}
                    />
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
        const {eachMoney} = this.state;
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
        }








        else{
            return(
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>已截止</Text>
                    </TouchableOpacity>
                )
        }
    }
    _renderFooter() {
        if(this.props.status === 3){
            return(
                <View>
                    <Text style={styles.tips}>注：请以上中奖用户添加“众猜体育客服”微信号领取现金红包。</Text>
                    <Text style={styles.tips}> 微信号：zctykf </Text>
                    {this.state.isHiddenFooter ? null : <View>
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
  render() {
    if(this.state.isload){
    return (
        <View style={styles.container}>
            <TopNav navigator={this.props.navigator} Code={this.state.Code}/>
            <ListView 
                    dataSource={this.state.ds}
                    renderRow={this._renderRow}
                    enableEmptySections={true}
                    renderHeader = {this._renderHeader}
                    renderFooter = {this._renderFooter}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={60}
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
        this.setState({
            isload:true,
            Code:Data.Action.Code,
            raceTitle:Data.Question[0].Question,
            raceOption:Data.Question[0].Options,
            endTime:Data.Action.EndTime,
            PlayerCount:Data.Action.PlayerCount,
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
            this.data = Data;
            this.setState({
                ds:this.state.ds.cloneWithRows(dataFormat(this.data)),
                eachMoney:Data[0].WinLose
            })
            //页面缓存请求的中奖列表的PageIndex
            this.PageIndex = 1
        })
    }
  }
  loadMore() {
    if(this.props.status === 3 && this.PageIndex && this.state.hasMorePageIndex){
        console.log('触发loadmore')
      this.setState({
            isHiddenFooter: false
        })
      let params = {
            "ActionID": this.props.ID,
            "PageIndex":++this.PageIndex,
            "PageSize":20
        };
      let headers = {
        "QIC":"QIC",
        "Authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b3VyaXN0IjpmYWxzZSwiYWNjb3VudCI6IjEwMDYyNmMxLTRmMjUtNGNlYS1iODVhLTM2MTljNjQ5OTA3ZiIsImV4cCI6MTUwMTgxODEyNCwiaWF0IjoxNTAxODE3NTI0fQ.B_ENgERLJgOUXtXX9g8mxlLz-PZAldOyCcwGHysuOpM",
    }
        HTTPBase.post(getWinnerListURI,params,headers).then((responseData)=>{
            const {Data} = responseData;
            if(Data.length === 0){
              this.setState({
                hasMorePageIndex:false,
                isHiddenFooter: true
              })
            }else{
              // 拼接数据
              this.data = this.data.concat(Data);
              this.setState({
                  ds:this.state.ds.cloneWithRows(dataFormat(this.data)),
                  isHiddenFooter: true
              })
            }
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