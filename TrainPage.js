import * as React from 'react'; 
import { View, StyleSheet ,Text, AsyncStorage, TouchableOpacity, NativeModules, NativeEventEmitter} from 'react-native';
import PropTypes from 'prop-types';
import Svg,{
    Line,
    Circle
} from 'react-native-svg';

import Tts from 'react-native-tts';
import SingleValueCharacteristicView from "./SingleValueCharacteristicView";

import InsolebluetoothView from "./InsolebluetoothNativeView";
const {RNTBlueManager} = NativeModules;

var Sound = require('react-native-sound');
Sound.setCategory('Playback');

var Metronome1 = new Sound('stepLeft.wav', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // loaded successfully
  console.log('duration in seconds: ' + Metronome1.getDuration() + 'number of channels: ' + Metronome1.getNumberOfChannels());
});

var Metronome2 = new Sound('stepRight.wav', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // loaded successfully
  console.log('duration in seconds: ' + Metronome2.getDuration() + 'number of channels: ' + Metronome2.getNumberOfChannels());
});

const beforeLoad = -1;
const beforeScan = 0;
const scanning = 1;
const scanDone = 2;
const scanSelected = 3;
const playing = 4;
const endOfExercise = 5;

const restoreKey = "RehabTrainingKey";

export default class TrainPage extends React.Component{
  static propTypes = {
      timeRange : PropTypes.arrayOf(PropTypes.number),
      speedRange : PropTypes.arrayOf(PropTypes.number),
      segments : PropTypes.number,
      onExerciseStart: PropTypes.func,
      onExercistChange : PropTypes.func,
      onExerciseComplete : PropTypes.func,
      duration: PropTypes.number,
      gaitInstruct: PropTypes.number // 1=audio 0=speech
    };
    static defaultProps = {
      onExerciseStart: () => {},
      onExercistChange : () => {},
      onExerciseComplete : (v) => {console.log(v)},
    };
  constructor(props){
    super(props);
    console.log("constructed once")
    this.timerTick = this.timerTick.bind(this);
    this.state = {
      curTime: 0,
      curSpeed: 0,    // interval of each timer 
      curTimeTable:[],
      curDevicesScanLeft: [],
      curDevicesScanRight: [],
      loaded : beforeLoad
    }

    this.timer = 0;
    this.speedChangeRateLimit = 0.5;
    // this.eventEmitter1 = new EventEmitter();
    // this.eventEmitter2 = new EventEmitter();
    // this.eventEmitter3 = new EventEmitter();

    Tts.getInitStatus().then(() => {

      this.setState({loaded: beforeScan});
    });
/*
    BleManager.start({showAlert: true})
      .then(() => {
        console.log("Bluetooth Initialized");
      });*/

    this.grapha = [];
    this.backup = [];
    //Tts.setDefaultPitch(1.9);
    Tts.addEventListener('tts-start', (event) => console.log("start", event));
    Tts.addEventListener('tts-finish', (event) => console.log("finish", event));
    Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));
    

    this.randomNumberWithinRange = this.randomNumberWithinRange.bind(this);
    this.nextSegSpeed = this.nextSegSpeed.bind(this);
    /*this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
    this.disconnectAllConnectedPeriphrals = this.disconnectAllConnectedPeriphrals.bind(this);*/
  }

  timerTick(){
    if(this.props.gaitInstruct == 1){
      Metronome1.play((success) => {
      });
    }

    if(this.state.curTimeTable.length == 1 && this.state.curTime > this.state.curTimeTable[0]){
        console.log("finished");
        this.exerciseFinished();

        return;
      } else if(this.state.curTime > this.state.curTimeTable[0]){
        console.log("next session");
        temp = this.state.curTimeTable
        lastSpeed = this.state.curSpeed;
        temp.splice(0,1);
        newGeneratedSpeed = this.nextSegSpeed(this.state.curSpeed, this.props.speedRange[1], this.props.speedRange[0], this.speedChangeRateLimit);
        //this.setState({ curTime: this.state.curTime + this.state.curSpeed, curSpeed: newGeneratedSpeed, curTimeTable:temp});
        this.state.curTime = this.state.curTime + this.state.curSpeed;
        this.state.curSpeed = newGeneratedSpeed;
        this.state.curTimeTable = temp;

        if(this.props.gaitInstruct == 0){
          Tts.setDefaultRate(3);
          text = (( lastSpeed >= newGeneratedSpeed ? 'Go faster! ' : 'Go Slower! '));
          Tts.speak(text);
        }
      }else{
        //this.setState({ curTime: this.state.curTime + this.state.curSpeed});
        this.state.curTime = this.state.curTime + this.state.curSpeed;
      }
      if(this.state.loaded == playing ){
        this.timer = setTimeout(this.timerTick, this.state.curSpeed);
      }
  }

  exerciseStart(){
    temp = [0];
    remainingDur = this.props.duration;
    for(i = 0; i < this.props.segments-1; i++){
      temp.push(temp[temp.length-1]+this.nextSegDuration(remainingDur, temp[temp.length-1], this.props.segments-i, this.props.timeRange[0], this.props.timeRange[1]));
    }
    temp.push(this.props.duration)
    temp.splice(0, 1);
    this.backup = temp;
    newGeneratedSpeed = this.nextSegSpeed(0, this.props.speedRange[1], this.props.speedRange[0], this.speedChangeRateLimit);
    this.state.curSpeed = newGeneratedSpeed;
    this.state.curTimeTable = temp;
    this.timer = setTimeout(this.timerTick, this.state.curSpeed);
    if(this.props.gaitInstruct == 0){
      text = 'Hi! Welcome! Go' + (60000/newGeneratedSpeed).toFixed(0) + ' Steps per minute.';
      Tts.speak(text);
    }
    this.props.onExerciseStart();
  }
  exerciseFinished(){
    clearInterval(this.timer);
    this.timer = 0;
    this.disconnectAllConnectedPeriphrals();
    this.props.onExerciseComplete();
  }
  /*
  disconnectAllConnectedPeriphrals(){
    let discPheri = this.state.curDevicesScan;
    let elems = Object.keys(discPheri);
    elems.map((id) => {
      if(discPheri[id].connected){
        BleManager.disconnect(id).then(() => {
          console.log(id, "disconnected")
          this.setState({loaded: endOfExercise, curTime: 0, curSpeed: 0, curTimeTable:[], curDevicesScan: {}});
        });
      }
    });
  }*/
  componentWillUnmount(){
    this.this.disconnectAllConnectedPeriphrals();
    this.timerTick = null;
    this.randomNumberWithinRange = null;
    this.speedChangeRateLimit = 0;
    this.state = null;

    clearInterval(this.timer);
    this.timer = 0;
    this.grapha = [];
    this.backup = [];
  }
  componentDidMount(){
   /* this.handlerDiscover = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      this.handleDiscoverPeripheral
    );
    this.handlerStop = bleManagerEmitter.addListener(
      'BleManagerStopScan', 
      this.handleStopScan 
    );
    this.handlerUpdate = bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic', 

      this.handleUpdateValueForCharacteristic 
    );*/
    const blueEmitter = new NativeEventEmitter(NativeModules.ReactNativeEventEmitter);
    const subscription = blueEmitter.addListener( 'DiscInsole', (reminder) => {
        console.log(reminder)
        this.setState({loaded: scanDone});
        let lefts = reminder.filter(v => v.side == "left");
        console.log(lefts)
        let rights = reminder.filter(v => v.side == "right");
        console.log(rights)
        this.setState({curDevicesScanLeft: lefts, curDevicesScanRight: rights});
      }
    );
    const subscription2 = blueEmitter.addListener('DataInsole', (reminder) => {
        console.log(reminder)
      }
    );

  }
/*
  handleStopScan() {
    console.log('Scan is stopped');
    this.setState({ loaded: scanDone });
  }
*/
  componentWillUnmount(){
   // this.handlerDiscover.remove();
  }
/*
  handleDiscoverPeripheral(data){
    console.log(data);
    data.selected = false;
    const discPheri = this.state.curDevicesScan;
    const len = Object.keys(discPheri).length;
    discPheri[data.id] = data;
    const newLen = Object.keys(discPheri).length;
    if(newLen > len){
      discPheri[data.id].selected = false;
      this.setState({curDevicesScan: discPheri});
    }
  }

  handleUpdateValueForCharacteristic(data) {

    if(data.characteristic === thirdCharacteristic){
      this.eventEmitter1.emit("value", data.value);
    }else if(data.characteristic === fourthCharacteristic){
      this.eventEmitter2.emit("value", data.value);
    }
    else if(data.characteristic === fifCharacteristic){
      this.eventEmitter3.emit("value", data.value);
    }
  }
*/
  destroy(){
    
  }
  // return a random number within range of maxSpeed
  randomNumberWithinRange(maxNumber, minNumber){
    return Math.random()*(maxNumber-minNumber)+minNumber;
  };

  nextSegDuration(remainingDur, previousSegTime, remainingSegs, minTime, maxTime){
    remainingTime = remainingDur - previousSegTime;
    remainingMaxTime = remainingTime - minTime * (remainingSegs-1);
    remainingMinTime = remainingTime - maxTime * (remainingSegs-1);
    actualMax = Math.min(remainingMaxTime, maxTime);
    actualMin = Math.max(remainingMinTime, minTime);
    return this.randomNumberWithinRange(actualMax, actualMin);
  }
  // return the speed for next segment in range between (minspeed, maxspeed)
  nextSegSpeed(curSpeed,minSpeed, maxSpeed, percent){
    if(curSpeed == 0){
      return this.randomNumberWithinRange(maxSpeed, minSpeed);
    }else{
      curMax = curSpeed*(1+percent);
      curMin = curSpeed*(1-percent);
      actualMax = Math.min(maxSpeed, curMax);
      actualMin = Math.max(minSpeed, curMin);
      return this.randomNumberWithinRange(actualMax, actualMin);
    }
  }

  startScanning(){
      this.setState({loaded: scanning});
      RNTBlueManager.discoverInsoles((insoles) => {});
      /*BleManager.scan(["180A"], 1, true).then((results) => {
          console.log('Scanning...');
      });*/   
  }

  render(){
    fontSize = 23;
    var discPheri = this.state.curDevicesScanLeft;
    let discPheriRight = this.state.curDevicesScanRight;
    const arrayLeft = [];
    for(let i = 0; i < discPheri.length; i++){
      let id = discPheri[i].name;
      arrayLeft.push(
        <TouchableOpacity key={id}
          onPress={() => {
            let val = this.state.curDevicesScanLeft[i].selected;
            if(val == undefined){val = false}
            this.state.curDevicesScanLeft[i].selected = !val;
            let initLeft = discPheri.filter((v) => {v.side == "left" && v.selected});
            let initRight = discPheriRight.filter((v) => {v.side == "right" && v.selected});
            //console.log("init", init);
            if(initLeft.length == 1 && initRight.length == 1){
              this.setState({loaded: scanDone});
              
            }else{
              this.setState({loaded: scanSelected});
            }
            console.log("Right CLicked")
            console.log(initLeft)
            console.log(initRight)
          }}
          style={[styles.buttonInsole, {borderWidth: discPheri[i].selected ? 4 : 2 }]}>
          <Text style={[styles.textInCircle,]}>
            #{id.substring(id.length - 7, id.length)}
          </Text>
          <Text style={[styles.textInCircle]}>
            Signal: {discPheri[i].rssi}
          </Text>
        </TouchableOpacity>
      );
    }

    const arrayRight = [];
    for(let i = 0; i < discPheriRight.length; i++){
      let id = discPheriRight[i].name;
      arrayRight.push(
        <TouchableOpacity key={id}
          onPress={() => {
            let val = this.state.curDevicesScanRight[i].selected;
            if(val == undefined){val = false}
            this.state.curDevicesScanRight[i].selected = !val;
            let initLeft = discPheri.filter((v) => {v.selected});
            let initRight = discPheriRight.filter((v) => {v.side == "right" && v.selected});
            //console.log("init", init);
            if(initLeft.length == 1 && initRight.length == 1){
              this.setState({loaded: scanDone});
            }else{
              this.setState({loaded: scanSelected});
            }
            console.log("Right CLicked")
            console.log(initLeft)
            console.log(initRight)
          }}
          style={[styles.buttonInsole, {borderWidth: discPheriRight[i].selected ? 4 : 2 }]}>
          <Text style={[styles.textInCircle,]}>
            #{id.substring(id.length - 7, id.length)}
          </Text>
          <Text style={[styles.textInCircle]}>
            Signal: {discPheriRight[i].rssi}
          </Text>
        </TouchableOpacity>
      );
    }

    var sectionblock = []
    sliderLength = 300;
    for(var i = 0; i < this.backup.length; i++){
      amount = this.backup[i]/this.props.duration * sliderLength;
      sectionblock.push(
        <Circle key={i}
            cx={amount} 
            cy={50} r="5" 
            fill="#fff"
        />);
    }

    return(
      <View style={[ styles.container, { backgroundColor: '#005bbb' } ]} >
          {(this.state.loaded === beforeScan) &&
            <TouchableOpacity 
            style={[ styles.button]}
            onPress={() => {
              this.startScanning()
            }}>
              <Text style={styles.textInCircle}>Start Scanning</Text> 
            </TouchableOpacity>
          }
          {(this.state.loaded === beforeLoad)&&
            <Text style={{ flex: 1, color:"#fff",
                  fontSize: fontSize*2, alignItems: 'center', padding: 20}}>
              Loading
            </Text>
          }
          {(this.state.loaded === scanning) &&
            <View style={[ styles.button]}>
              <Text style={styles.textInCircle}>Scanning...</Text> 
            </View>
          }
          {(this.state.loaded === scanDone || this.state.loaded === scanSelected) &&
            <View style={{flex: 1, flexDirection: "row", margin: 10,marginTop: 40, alignSelf: "stretch"}}>
              
              <View style={{flex: 1, margin: 10, alignSelf: "stretch", justifyContent: "flex-start", alignItems: "center"}}>
                {arrayLeft}
              </View>
              <View style={{flex: 1, margin: 10, alignSelf: "stretch", justifyContent: "flex-start", alignItems: "center"}}>
                {arrayRight}
              </View>
            </View>
          }
          {(this.state.loaded === scanSelected) &&
            <TouchableOpacity style={{width: 180, 
                                      height: 80, 
                                      margin: 10, 
                                      marginBottom: 50,
                                      backgroundColor: "#cccccc"
                                    }}
                onPress={() => {
                        let left = this.curDevicesScanLeft.filter((v) => v.selected == true)[0];
                        let right = this.curDevicesScanRight.filter((v) => v.selected == true)[0]
                        RNTBlueManager.connectPair(left.name, right.name, (data) => {});
                        /*console.log(key ,searcha[key]);
                        BleManager.connect(key).then(() => {
                          searcha[key].connected = true;
                          console.log(key ,"connected");
                          setTimeout(() => 
                          BleManager.retrieveServices(key).then((peripheralInfo) => {
                            console.log("peripheralInfo", peripheralInfo);
                            var service = '33000100-121F-3E53-656E-6E6F54656368';
                            BleManager.startNotification(key, service, thirdCharacteristic).then(() => {
                                console.log('Started notification on ' + key);
                            });
                            BleManager.startNotification(key, service, fourthCharacteristic).then(() => {
                                console.log('Started notification on ' + key);
                            });
                            BleManager.startNotification(key, service, fifthCharacteristic).then(() => {
                                console.log('Started notification on ' + key);
                            });
                          }),300);
                        });*/
                  this.setState({loaded: playing});
                  this.exerciseStart();
                }}
              >
                <Text style={styles.textInCircle}>
                  Start Exercise
                </Text>
              </TouchableOpacity>
          }
          {(this.state.loaded === playing) &&
            <View>
              
            </View>
          }
          {(this.state.loaded === endOfExercise) &&

            <TouchableOpacity style={[styles.buttonInsole, {borderWidth: 2 }]}
                onPress={() => {
                  this.setState({loaded:beforeScan});
                }}
              >
                <Text style={styles.textInCircle}>
                  Restart
                </Text>
              </TouchableOpacity>
          }
      </View>);
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    textInCircle:{
      flex: 1,
      color:"#fff",
      fontSize: 13,
      textAlign: 'center',
      marginVertical: 10,
    },
    buttonInsole:{
      width: 80, 
      height: 80, 
      margin: 10, 
      borderRadius: 5, 
      borderColor: "#fff", 
      
    },
    button:{
      backgroundColor: '#0000',
      justifyContent: "center", 
      alignItems: "center", 
      marginHorizontal: 5,
      width: 100,
      height: 100,
      borderRadius: 50,
      borderColor: "#fff" ,
      borderWidth: 2,
      padding: 10,  
      overflow: "hidden",
    }
})







/*
var sectionblock = []
    sliderLength = 300;
    for(var i = 0; i < this.backup.length; i++){
      amount = this.backup[i]/this.props.duration * sliderLength;
      sectionblock.push(
        <Circle key={i}
            cx={amount} 
            cy={50} r="5" 
            fill="#fff"
        />);
    }
<Text style={{ flex: 1, color:"#fff",
                  fontSize: fontSize, alignItems: 'center', padding: 20}}>
                  Current Speed : {(60000/this.state.curSpeed).toFixed(1)} Steps/Minute
                
                </Text>

                <Text style={{ flex: 1, color:"#fff",
                  fontSize: fontSize, alignItems: 'center', padding: 20}}>

                  Current Segment : { this.props.segments - this.state.curTimeTable.length+1 }
                  
                </Text>
                <Text style={{ flex: 1, color:"#fff",
                  fontSize: fontSize, alignItems: 'center', padding: 20}}>
                  Current Time : { (this.state.curTime/1000).toFixed(1) } Seconds
                </Text>
                <Text style = {{ flex: 1, color:"#fff",
                  fontSize: fontSize, alignItems: 'center', padding: 20}}>
                  Total Time : { (this.props.duration/1000).toFixed(1) } Seconds
                </Text>
                <Text style={{ flex: 1, color:"#fff",
                  fontSize: fontSize, alignItems: 'center', padding: 20}}>
                </Text>

                <Svg
                  height="100"
                  width={sliderLength}
                >
                  <Line
                    x1="0"
                    y1="50"
                    x2={sliderLength}
                    y2="50"
                    stroke="#fff"
                    strokeWidth="3"
                  >
                  
                  </Line>
                  <Line
                    x1="0"
                    y1="50"
                    x2={this.state.curTime/this.props.duration * sliderLength}
                    y2="50"
                    stroke="#005bbb"
                    strokeWidth="3">
                  </Line>

                  {sectionblock}
                </Svg>


                // laoaded
              <SingleValueCharacteristicView _newValueIsReceived={this.eventEmitter1}>
              </SingleValueCharacteristicView>
              <SingleValueCharacteristicView _newValueIsReceived={this.eventEmitter2}>
              </SingleValueCharacteristicView>
              <SingleValueCharacteristicView _newValueIsReceived={this.eventEmitter3}>
              </SingleValueCharacteristicView>
              <Svg
                  height="100"
                  width={sliderLength}
                >
                <Line
                  x1="0"
                  y1="50"
                  x2={sliderLength}
                  y2="50"
                  stroke="#fff"
                  strokeWidth="3"
                >
                
                </Line>
                <Line
                  x1="0"
                  y1="50"
                  x2={this.state.curTime/this.props.duration * sliderLength}
                  y2="50"
                  stroke="#005bbb"
                  strokeWidth="3">
                </Line>

                {sectionblock}
              </Svg>



               <TouchableOpacity style={[styles.buttonInsole, {borderWidth: 2 }]}
                onPress={() => {
                }}
              >
                <Text style={styles.textInCircle}>
                  Refresh
                </Text>
              </TouchableOpacity>*/