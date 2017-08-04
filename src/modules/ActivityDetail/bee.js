import React, { Component } from 'react';
import { View, Text ,TouchableOpacity,StyleSheet,ListView,Image,ScrollView,Dimensions,ActivityIndicator} from 'react-native';
import TopNav from '../../component/topNav';
import HTTPBase from '../../network/http.js';;
import RaceResult from '../../component/raceResult';

const baseURI = 'http://m.weguess.cn/memberapi/api/WeChat/SearchActionByActionID';
const getWinnerListURI = 'http://m.weguess.cn/memberapi/api/WeChat/GetWinnerList';

export default class Bee extends Component {
  constructor(props){
        super(props);
        this.state = {
            isload:false,
            ds: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }),
            Code:'',
            question:[{Question:'',Options:[{Option:''}]}],
            data:[],
            betInfo:{},
            isHiddenFooter:true,
            //上拉还能加载更多中奖用户
            hasMorePageIndex:true
        }
        this._renderRaceResult = this._renderRaceResult.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
        this._renderButton = this._renderButton.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }
  _renderRaceResult(){
      if(this.props.status === 3){
          return (<RaceResult />)
      }else{
          return null;
      }
  }
  _renderButton(){
    if(this.props.status === 3){
          return(
            <View style={styles.eachBar}>
              <Text style={styles.eachBarText}>中奖用户</Text>
              <Text style={styles.eachBarText}>中奖额度</Text>
            </View>
            )
      }else{
          return null;
      }
    
  }
  _renderHeader(){
    return(
      <View>
        {this.state.question.map((value,index)=>(
            <View key={index}>
              <View style={styles.titBarBox}>
                <Text style={styles.titBar}>{value.Question}</Text>
              </View>
              <View style={styles.race}>
                  {value.Options.map((v,i)=>(<View key={i} style={[styles.raceRow,v.IsRight?styles.bgBlue:{}]}>
                      <Text style={v.IsRight?styles.fontColorWhite:styles.fontColorBlack}>{v.Option}</Text>
                  </View>))}
              </View>
            </View>
          ))}
          <Text style={styles.tips}>注：参与活动就能获得猜豆奖励。</Text>
          {this._renderRaceResult()}
          {this._renderButton()}
      </View>
      )
  }
  _renderRow(rowData,sectionID,rowID) {
      return(
          /*如果rowID是奇数,改变背景色*/
          <View  style={[styles.row,rowID%2===1?{backgroundColor:'#e6e6e6'}:{}]}>
              <View style={styles.rowItem}>
                  <Image style={styles.winHead} source={{uri:rowData.MemberPic}}/>
                  <Text style={styles.winName}>{rowData.Nickname}</Text>
              </View>
              
              <View style={[styles.rowItem,styles.center]}>
                  <Text style={styles.WinLose}>{rowData.WinLose}</Text>
              </View>
                  
          </View>
          )
  }
  _renderFooter(){
    return (
            this.state.isHiddenFooter ? null : <View>
              <ActivityIndicator size="large"/>
            </View>
        );
  }
  render() {
    console.log('重新渲染整个Bee页面')
    return (
      	<View style={styles.container}>
            <TopNav navigator={this.props.navigator} Code={this.state.Code}/> 
            <ListView 
              dataSource={this.state.ds}
              renderRow={this._renderRow}
              initialListSize={10}
              enableEmptySections={true}
              renderHeader = {this._renderHeader}
              renderFooter = {this._renderFooter}
              onEndReached={this.loadMore}
              onEndReachedThreshold={30}
            />       
        </View>
    );
  }
  componentDidMount() {
    let params = {
            "ActionID": this.props.ID,
        };
    let headers = {
        "QIC":"QIC",
        "Authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b3VyaXN0IjpmYWxzZSwiYWNjb3VudCI6IjEwMDYyNmMxLTRmMjUtNGNlYS1iODVhLTM2MTljNjQ5OTA3ZiIsImV4cCI6MTUwMTgxODEyNCwiaWF0IjoxNTAxODE3NTI0fQ.B_ENgERLJgOUXtXX9g8mxlLz-PZAldOyCcwGHysuOpM",
    }
    HTTPBase.post(baseURI,params,headers).then((responseData)=>{
        
        const {Data} = responseData;
        this.setState({           
            isload:true,
            Code:Data.Action.Code,
            question:Data.Question,
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
                ds:this.state.ds.cloneWithRows(this.data)
            })
            //页面缓存请求的中奖列表的PageIndex
            this.PageIndex = 1
        })
    }
  }
  loadMore() {
    if(this.props.status === 3 && this.PageIndex && this.state.hasMorePageIndex){
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
                  ds:this.state.ds.cloneWithRows(this.data),
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
        height:38,
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
    eachBar:{
        height:42,
        backgroundColor:'#3a66b3',
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center'
    },
    eachBarText:{
        fontSize:14,
        color:'#fff'
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
        flexDirection:'row',
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
    WinLose:{
      color:'#343434',
      fontSize:12,
    },
    center:{
      alignItems:'center',
      justifyContent:'center'
    }
})