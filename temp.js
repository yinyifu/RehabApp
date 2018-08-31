import * as React from 'react';
import {  AsyncStorage, NavigatorIOS } from 'react-native';
import HomePage from './HomePage';
import IntroPage from './IntroPage'
import LoginPage from "./LoginPage"
import InsolebluetoothView from "./InsolebluetoothNativeView"
//import RNTBlue from "react-native-senno-insole-bluetooth"
import {NativeEventEmitter, NativeModules} from 'react-native';
const {RNTBlueManager} = NativeModules;

export default class App extends React.Component {
  constructor(){
    super();
    this._gotoLoginPage = this._gotoLoginPage.bind(this);
  }
  _gotoLoginPage(){
    this.refs.nav.push({
      component: LoginPage,
      title: 'Login To SennoGait'
    });
  }
  componentDidMount () {
    const blueEmitter = new NativeEventEmitter(NativeModules.ReactNativeEventEmitter);
    const subscription = blueEmitter.addListener(
      'DiscInsole',
      (reminder) => {
        console.log(reminder)
        if(reminder.length == 2){
          RNTBlueManager.connectPair(reminder[0].name, reminder[1].name, (data)=>{})
        }
      }
    );
    const subscription2 = blueEmitter.addListener(
      'DataInsole',
      (reminder) => {
        console.log(reminder)
      }
    );
    RNTBlueManager.discoverInsoles((insoles)=>{});
     < InsolebluetoothView style={{flex: 1}}/>
     
  }
  render() {
    return (
      <InsolebluetoothView style={{flex: 1}}/>
    )
  }
}
/*
<NavigatorIOS
        initialRoute={{
          component: HomePage,
          title: 'Workout',
          navigationBarHidden: false,
        }}
        style={{flex: 1}}
      />
     */
