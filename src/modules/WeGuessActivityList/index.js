import React, {
    Component
} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    TouchableHighlight,
} from 'react-native';
import {
    PullList
} from 'react-native-pull';
import {
    AsyncStorage,
} from 'react-native';
import HTTPBase from '../../network/http.js';
import Money from '../ActivityDetail/money.js';
import Bee from '../ActivityDetail/bee.js';
import Fight from '../ActivityDetail/fight.js';
import {format,timeFormat} from '../../method';

const baseURI = 'http://m.weguess.cn/image/action';
const guessOrderMap = {
    1:"joinnow.png",
    2:"join.png",
    3:"full.png",
    4:"cancel.png",
    5:"over.png",
    6:"end.png"
}
export default class WeGuessActivityList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ds: new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            }),
            isload: false,
            data: [],
            isHiddenFooter: true,
        }
        this.fetchData = this.fetchData.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this._onPress = this._onPress.bind(this);
    }
    //网络请求
    fetchData(resolve) {
        let PageIndex = 1;
        let params = {
            "PageIndex": PageIndex,
            "PageSize":20
        };
        let headers = {
            "QIC":"QIC",
            "Authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b3VyaXN0Ijp0cnVlLCJhY2NvdW50IjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIiwiZXhwIjoxNTAxNjQ0MTc3LCJpYXQiOjE1MDE2NDM1Nzd9.Uj120NDjViMjQwuw6BOWakafvpsN9Sig1h2FNBNmccI"
        }
        HTTPBase.get('http://m.weguess.cn/memberapi/api/WeChat/SearchAction', params,headers).then((responseData) => {
            console.log('数据加载完成')
            // 清空数组
            this.data = [];

            // 拼接数据
            this.data = this.data.concat(responseData.Data);
            this.setState({
                ds: this.state.ds.cloneWithRows(responseData.Data),
                isload: true,
                isHiddenFooter: true
            });

            //关闭刷新动画
            if (resolve !== undefined) {
                resolve()
            }
            // 存储本次的PageIndex
            AsyncStorage.setItem('pageIndex', PageIndex.toString());
        }).catch((error) => {
            console.log(error)
        })
    }
    _onPress(type,ID,status) {
        let component;
        if(type === 1){
            component = Bee;
        }else if(type === 2){
            component = Fight;
        }else if(type === 3){
            component = Money;
        }
        this.props.navigator.push({
            component,
            data:{
                ID,
                status
            }
        })
    }
    _renderRow(rowData) {
        return (
            <TouchableOpacity onPress={this._onPress.bind(this,rowData.Type,rowData.ID,rowData.Status)}>
                <View style={styles.cell}>
                    <Image style={styles.img} source={{uri:rowData.Pictures[0]}}/>
                    <View style={styles.titBox}>
                        <Text style={styles.tit,{color:(rowData.Type === 3?'red':'rgb(52, 52, 52)')}}>{rowData.Code}</Text>
                        <View>
                            <Text style={styles.mall}>{rowData.Remark}</Text>
                            <View style={styles.rowIconBox}>
                                {rowData.Type === 2?null:<Image style={styles.rowIcon} source={require('../../img/person.png')} />}
                                <Text style={styles.time}>{rowData.Type === 2?("胜:"+format(rowData.SingleBetCount[0].BetCount*rowData.EntryFee)+"  平:"+format(rowData.SingleBetCount[1].BetCount*rowData.EntryFee)+"  负: "+format(rowData.SingleBetCount[2].BetCount*rowData.EntryFee)):(rowData.Type === 3&&rowData.Type!==1?(rowData.BetCount+"/"+rowData.MaxPlayers+"人"):(rowData.BetCount+"人"))}</Text>
                            </View>
                            <View style={styles.rowIconBox}>
                                <Image style={styles.rowIcon} source={require('../../img/endtime.png')}/>
                                <Text style={styles.time}>{timeFormat(rowData.EndTime,"yyyy年MM月dd日hh:mm截止")}</Text>
                            </View>
                        </View>
                    </View>
                    <Image style={styles.rightIcon} source={{uri:baseURI+'/'+guessOrderMap[rowData.Order]}}/>
                </View>
            </TouchableOpacity>
        )
    }
    _renderFooter() {
        return (
            this.state.isHiddenFooter ? null : <View>
              <ActivityIndicator size="large"/>
            </View>
        );
    }
    loadMore(value) {
        this.setState({
            isHiddenFooter: false
        })
        AsyncStorage.getItem('pageIndex')
            .then((value) => {
                let PageIndex = parseInt(value)+1;
                let params = {
                    "PageSize": 20,
                    "PageIndex": PageIndex,
                };
                let headers = {
                    "QIC":"QIC",
                    "Authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b3VyaXN0Ijp0cnVlLCJhY2NvdW50IjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIiwiZXhwIjoxNTAxNjQ0MTc3LCJpYXQiOjE1MDE2NDM1Nzd9.Uj120NDjViMjQwuw6BOWakafvpsN9Sig1h2FNBNmccI"
                }
                HTTPBase.get('http://m.weguess.cn/memberapi/api/WeChat/SearchAction', params,headers)
                    .then((responseData) => {
                        // 拼接数据
                        this.data = this.data.concat(responseData.Data);

                        this.setState({
                            ds: this.state.ds.cloneWithRows(this.data),
                            isHiddenFooter: true
                        });
                        // 存储
                        AsyncStorage.setItem('pageIndex', PageIndex.toString());
                    })
                    .catch((error) => {

                    })
            })
    }
    topIndicatorRender(pulling,pullok,pullrelease) {
        return(
            <View style={{alignItems:'center'}}>
                <ActivityIndicator size="small" color="gray" />
                {pulling ? <Text>下拉刷新</Text>:null}
                {pullok ? <Text>下拉刷新</Text>:null}
                {pullrelease ? <Text>下拉刷新</Text>:null}
            </View>
            )
    }
    componentDidMount() {
        this.fetchData();
    }
    render() {
        if(this.state.isload){
            return(
                <PullList
                initialListSize={7}
                pageSize={4}
                dataSource = {this.state.ds}
                renderRow={this._renderRow}
                //showsVerticalScrollIndicator ={false}
                onPullRelease = {
                    this.fetchData
                }
                // topIndicatorRender = {
                //     this.topIndicatorRender
                // }
                onEndReached={this.loadMore}
                onEndReachedThreshold={60}
                renderFooter={this._renderFooter}
            />
                )
        }
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>无数据</Text></View>
            )
        
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cell: {
        height: 116,
        padding: 12,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        alignItems:'center'
    },
    img: {
        width: 92,
        height: 92,
        resizeMode: 'stretch'
    },
    titBox: {
        flex: 1,
        marginLeft:20
    },
    tit: {
        color: 'rgb(52, 52, 52)',
        fontSize:16
    },
    rowIconBox:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:5
    },
    mall: {
        fontSize: 12,
        color: 'grey',
        marginBottom:12
    },
    time: {
        fontSize: 12,
        color: 'grey',
        marginLeft:5
    },
    rowIcon:{
        width:16,
        height:16,
        resizeMode:'stretch',
    },
    rightIcon: {
        width:22,
        height: 64,
        resizeMode: 'stretch',

    },
    topTab: {
        height: 50,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#ccc'
    },
    topTabCellL: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    topTabCellC: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    topTabCellR: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },

})

