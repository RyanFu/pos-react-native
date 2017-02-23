import React, { Component } from 'react';
import CatalogList from './CatalogList';
import {
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Text,
    View,
    Button,
    AsyncStorage,
    NativeModules,
    ListView,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

var PangPangBridge = NativeModules.PangPangBridge;

const navigatorTitle = "Set Spot";
class SpotSet extends Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            dataSource: ds.cloneWithRows([]),
            currentSpotId: 0
        };
        this._renderRow = this._renderRow.bind(this);
    }
    componentWillMount() {

    }
    componentDidMount() {
        this._getContextUser();
    }
    _getContextUser() {
        PangPangBridge.callAPI("/context/user", null).then((data) => {
            var rs = JSON.parse(data);
            // console.log(rs.result.spots);
            if (rs.success) {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(rs.result.spots),
                    currentSpotId: rs.result.currentSpotId
                });
            } else {
                console.log(rs);
                alert('get user faild')
            }
        });
    }
    async _pressSpot(spotId) {
        // console.log(spotId)
        const { navigator } = this.props;
        let spotsResult = null;
        await PangPangBridge.callAPI("/account/set-spot", { spotId: spotId }).then((data) => {
            spotsResult = JSON.parse(data);
        });

        if (spotsResult.success) {
            await AsyncStorage.setItem("spot", spotsResult.result.currentSpotId.toString());
            this._getContextUser();
        } else {
            console.log(spotsResult.error);
            alert('set spot faild')
        }
    }
    _renderRow(rowData, sectionID, rowID) {
        if (this.state.currentSpotId === rowData.id) {
            return (
                <TouchableOpacity onPress={() => { this._pressSpot(rowData.id) } }>
                    <View style={styles.groupitem}>
                        <Text style={styles.itemText}>{rowData.name}    <Icon name="check-circle-o" style={styles.checkIcon} ></Icon></Text>
                    </View>
                </TouchableOpacity>);
        }
        else {
            return (
                <TouchableOpacity onPress={() => { this._pressSpot(rowData.id) } }>
                    <View style={styles.groupitem}>
                        <Text style={styles.itemText}>{rowData.name}</Text>
                    </View>
                </TouchableOpacity>);
        }
    }
    _pressMenuButton() {
        const {updateMenuState} = this.props;
        updateMenuState(true);
    }
    _pressSyncButton() {
        PangPangBridge.callAPI("/catalog/download", null).then((data) => {
            console.log(JSON.parse(data))

            // if (navigator) {
            //     navigator.replace({
            //         name: 'CatalogList',
            //         component: CatalogList,
            //     })
            // }
        });
    }
    render() {
        return (
            <View style={{ backgroundColor: '#f0f0f0', height: Dimensions.get('window').height }}>
                <View style={styles.navigatorBar} >
                    <TouchableOpacity onPress={this._pressMenuButton.bind(this)} style={styles.backBtn}>
                        <Icon name="bars" style={styles.backBtnImg} ></Icon>
                    </TouchableOpacity>
                    <View style={styles.navigatorTitle}>
                        <Text style={styles.navigatorTitleText}>{navigatorTitle}</Text>
                    </View>
                    <TouchableOpacity style={styles.rightBtn} onPress={this._pressSyncButton.bind(this)}>
                        <Icon name="refresh" style={styles.rightBtnImg} ></Icon>
                    </TouchableOpacity>
                </View>
                <View >
                    <ListView style={styles.listView}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                        enableEmptySections={true}
                        />
                </View>
            </View>
        );
    }
}

let styles;

if (Platform.OS === 'ios') {
    styles = StyleSheet.create({
        navigatorBar: {
            backgroundColor: "#3e9ce9",
            height: 64,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        backBtn: {
            marginTop: 20,
            height: 40,
            width: 50,
            justifyContent: 'center',
        },
        navigatorTitle: {
            // backgroundColor:'red',
            marginTop: 20,
            height: 40,
            width: 150,
            justifyContent: 'center',
            flex: 1,
        },
        navigatorTitleText: {
            fontSize: 20,
            color: 'white',
            textAlign: 'center',
        },
        scrollView: {
            height: Dimensions.get('window').height - 64,
            // backgroundColor:'yellow',
        },
        group: {
            marginTop: 10,
            alignItems: 'center',
        },
        groupTile: {
            margin: 5,
        },
        groupContent: {
            backgroundColor: 'white',
            paddingLeft: 10,
            paddingRight: 10,
        },
        groupLine: {
            // marginTop: 1,
            height: 0.5,
            backgroundColor: 'gray',
            width: Dimensions.get('window').width - 10,
            alignSelf: 'center',
            opacity: 0.4,
        },
        groupitem: {
            flexDirection: 'row',
            height: 60,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: 5,
            width: Dimensions.get('window').width,
        },
        itemText: {
            fontSize: 20,
            fontWeight: 'bold',
            width: Dimensions.get('window').width,
            textAlign: 'center'
        },
        checkIcon: {
            marginLeft: 120,
            fontSize: 20,
            textAlign: 'center',
            color: '#3e9ce9',
        },
        backBtnImg: {
            fontSize: 25,
            textAlign: 'center',
            color: 'white',
        },
        rightBtn: {
            //  backgroundColor:'green',
            marginTop: 20,
            height: 40,
            width: 50,
            justifyContent: 'center',
        },
        rightBtnImg: {
            fontSize: 25,
            textAlign: 'center',
            color: 'white',
        },
    });
}
else if (Platform.OS === 'android') {
    styles = StyleSheet.create({
        navigatorBar: {
            backgroundColor: "#3e9ce9",
            height: 44,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        backBtn: {
            marginTop: 0,
            height: 40,
            width: 50,
            justifyContent: 'center',
        },
        navigatorTitle: {
            // backgroundColor:'red',
            marginTop: 0,
            height: 40,
            width: 150,
            justifyContent: 'center',
        },
        navigatorTitleText: {
            fontSize: 20,
            color: 'white',
            textAlign: 'center',
        },
        scrollView: {
            height: Dimensions.get('window').height - 64,
            // backgroundColor:'yellow',
        },
        group: {
            marginTop: 10,
            alignItems: 'center',
        },
        groupTile: {
            margin: 5,
        },
        groupContent: {
            backgroundColor: 'white',
            paddingLeft: 10,
            paddingRight: 10,
        },
        groupLine: {
            // marginTop: 1,
            height: 0.5,
            backgroundColor: 'gray',
            width: Dimensions.get('window').width - 10,
            alignSelf: 'center',
            opacity: 0.4,
        },
        groupitem: {
            flex: 1,
            flexDirection: 'row',
            height: 60,
            alignItems: 'center',
            marginLeft: 5,
            width: Dimensions.get('window').width,
        },
        itemText: {
            fontSize: 20,
            fontWeight: 'bold',
            width: Dimensions.get('window').width,
            textAlign: 'center'
        },
        checkIcon: {
            marginLeft: 120,
            fontSize: 20,
            textAlign: 'center',
            color: '#3e9ce9',
        },
        backBtnImg: {
            fontSize: 25,
            textAlign: 'center',
            color: 'white',
        },
        rightBtn: {
            //  backgroundColor:'green',
            height: 40,
            width: 50,
            justifyContent: 'center',
        },
        rightBtnImg: {
            fontSize: 25,
            textAlign: 'center',
            color: 'white',
        },
    });
}

export default SpotSet;
