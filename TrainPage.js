import * as React from 'react'; 
import { View, StyleSheet ,Text, AsyncStorage, TouchableOpacity, NativeModules, NativeEventEmitter} from 'react-native';
import PropTypes from 'prop-types';
import Svg,{
    Line,
    Circle
} from 'react-native-svg';


import { SETTING_CHANGED } from './actionTypes';
import { INSTRUCT_MODE_AUDIO, INSTRUCT_MODE_SPEECH, INSTRUCT_MODE_CHOIR, 
          CORRECTNESS_MODE_AUDIO, CORRECTNESS_MODE_VIBRATION , 
          mapTurnToRate, mapSharpToPitch, mapTurnAndSharpToNotes} from "./constants";
import { TURN, TURNPACE } from "./exerciseTypes";
import Tts from 'react-native-tts';
import SingleValueCharacteristicView from "./SingleValueCharacteristicView";
import InsolebluetoothView from "./InsolebluetoothNativeView";

import {store} from "./actionTypes";
import {Sound} from "./constants";
const {RNTBlueManager} = NativeModules;

const load = 0;
const wait = 1;
const play = 2;
const endOfExercise = 3;
const defaultSettings = { rate: 0.5, pitch: 1 };

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

// actual component
export default class TrainPage extends React.Component{
  static propTypes = {
    setting: PropTypes.object,
    feedback: PropTypes.object,
    type: PropTypes.string,
    onExerciseStart: PropTypes.func,
    onExercistChange : PropTypes.func,
    onExerciseComplete : PropTypes.func,
    gaitInstruct: PropTypes.number, // 1=audio 0=speech
  };

  static defaultProps = {
    onExerciseStart: () => {},
    onExercistChange : () => {},
    onExerciseComplete : (v) => {console.log(v)},
    gaitInstruct: 0,
  };

  componentDidMount(){
    //this.setState({gaitInstruct: this.props.gaitInstruct});
  }

  constructor(props){
    super(props);
    // set 
    this.timerTick = this.timerTick.bind(this);
    this.exerciseStart = this.exerciseStart.bind(this);
    this.state = {
      curTime: 0,
      curSpeed: 0,    // interval of each timer 
      curTimeTable: [],
      loaded : load,
      foot: false,
      waitCounter: 2,
      turnDirection : "",
      turnTimer : 0,
      ttsSetting: {},
      GaitInstructMode: store.getState().feedback.GaitInstructionMode,
      GaitTurnInstructMode: store.getState().feedback.GaitTurnInstructionMode
    }
    //
    this.wait = 0;
    this.timer = 0;
    this.speedChangeRateLimit = 0.5;

    Tts.getInitStatus().then(() => {
      this.setState({loaded: wait});
    });
    
    this.grapha = [];
    this.backup = [];
    //Tts.setDefaultPitch(1.9);
    Tts.addEventListener('tts-start', (event) => console.log("start", event));
    Tts.addEventListener('tts-finish', (event) => console.log("finish", event));
    Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));
    
    this.randomNumberWithinRange = this.randomNumberWithinRange.bind(this);
    this.nextSegSpeed = this.nextSegSpeed.bind(this);
    this.playSound = this.playSound.bind(this);
    this.countDownTimer = this.countDownTimer.bind(this);
    this.setTTSStatus = this.setTTSStatus.bind(this);
    this.nextTurnSpecific = this.nextTurnSpecific.bind(this);
    this.isTurn = this.isTurn.bind(this);

    store.subscribe(() =>{
        const state = store.getState( );
        this.setState( state.feedback );
      }
    );
  }

  countDownTimer(){
    if(this.state.countDown >= 0){
      this.timer = setTimeout(this.countDownTimer, 1000);
      this.playSound(INSTRUCT_MODE_SPEECH, this.state.countDown == 0 ? "Start" : ""+this.state.countDown);
      this.setState({countDown: this.state.countDown-1});
    }else{
      clearInterval(this.timer);
      this.timer = setTimeout(this.timerTick, 0);
    }
  }

  async playSound(mode, txt, choirNode){
    //console.log(mode, txt)
    if(mode == INSTRUCT_MODE_AUDIO){
      if(this.state.foot){
        Metronome1.play((success) => {});
      }else{
        Metronome2.play((success) => {});
      }
      this.state.foot = !this.state.foot;
    }
    if(mode == INSTRUCT_MODE_SPEECH){
      Tts.speak(txt);
    }
    if(mode == INSTRUCT_MODE_CHOIR){
      if(!this.rntone){
        
        this.curChoirNode.play((success) => {});
        this.rntone = true;
      }
    }
  }

  timerTick(){
    const {GaitInstructMode, GaitTurnInstructMode} = this.state;

    console.log(GaitTurnInstructMode);
    
    while(this.state.curTime > this.state.curTimeTable[0]){
      lastSpeed = this.state.curSpeed;
        this.state.curTimeTable.splice(0,1);
        let newSpeed = this.nextSegSpeed(this.state.curSpeed, this.props.setting.speedVariation[1], this.props.setting.speedVariation[0], this.speedChangeRateLimit);
        
        this.setState({
          curTime: this.state.curTime + this.state.curSpeed, 
          curSpeed: newSpeed,
        });

        console.log("type", this.props.type);
        if(this.isTurn(this.props.type)){

            const turnSpec = this.nextTurnSpecific(this.props.setting.turnSharpness, this.props.setting.turnRange, this.props.setting.turnDirection);
            this.state.turnDirection = turnSpec.direction;
            this.state.turnTimer = turnSpec.turn / turnSpec.sharpness * 1000;
            this.state.ttsSetting = { spec: turnSpec,rate: mapTurnToRate(turnSpec.turn), pitch: mapSharpToPitch(turnSpec.sharpness) };
        }
        //this.state.curTime = this.state.curTime + this.state.curSpeed;
        //this.state.curSpeed = ;
        if(this.state.curTimeTable.length > 0 && lastSpeed != newSpeed)
          this.playSound(GaitInstructMode, lastSpeed >= newSpeed ? 'Go faster! ' : 'Go Slower! ');
    }

    if(this.state.curTimeTable.length == 0){
      this.exerciseFinished();
      return;
    } else {
      this.state.curTime = this.state.curTime + this.state.curSpeed;
    }

    if(this.state.loaded == play ){

      if(this.state.turnTimer > 0 ){
        this.setTTSStatus(this.state.ttsSetting);
         /* const turnSpec = this.nextTurnSpecific(this.props.setting.turnSharpness, this.props.setting.turnRange, this.props.setting.turnDirection);
            this.state.turnDirection = turnSpec.direction;*/
        this.curChoirNode = mapTurnAndSharpToNotes(this.state.turnDirection, this.state.ttsSetting.spec.turn, this.state.ttsSetting.spec.sharpness);
        this.playSound(GaitTurnInstructMode, this.state.turnDirection, this.curChoirNode);
        this.setTTSStatus(defaultSettings);
        //this.state.ttsSetting = { rate: mapTurnToRate(turnSpec.turn), pitch: mapSharpToPitch(turnSpec.sharpness) };
      }
      
      console.log(this.state.turnTimer);

      if(this.state.turnTimer <= 0){
        this.playSound(GaitInstructMode, "");
      }

      if(this.state.turnTimer > 0){
        this.state.turnTimer = this.state.turnTimer-this.state.curSpeed;
      }

      if(this.state.turnTimer < -1 && this.rntone){
          this.curChoirNode.stop();
          this.rntone = false;
      }

      this.timer = setTimeout(this.timerTick, this.state.curSpeed);
    }
  }

  exerciseStart(duration, segments, timeRange, speedRange){
    temp = [0];
    remainingDur = duration;
    for(i = 0; i < segments-1; i++){
      temp.push(temp[temp.length-1]+this.nextSegDuration(remainingDur, temp[temp.length-1], segments-i, timeRange[0], timeRange[1]));
    }
    temp.push(duration)
    temp.splice(0, 1);
    this.backup = temp;
    let newSpeed = this.nextSegSpeed(0, speedRange[1], speedRange[0], this.speedChangeRateLimit);
    this.setState({
      curSpeed: newSpeed,
      curTimeTable: temp,
      loaded: play,
    });
    this.state.countDown = 3;
    this.timer = setTimeout(this.countDownTimer, 0);
    let speedInSPM = (60000/newSpeed).toFixed(0);
    if(this.state.GaitInstructMode == INSTRUCT_MODE_SPEECH)
      this.playSound(this.state.GaitInstructMode, "Exercise Begin! Go "+ speedInSPM);
    this.props.onExerciseStart();
  }

  setTTSStatus(ttsStatus){
    Tts.setDefaultRate(ttsStatus.rate);
    Tts.setDefaultPitch(ttsStatus.pitch);
  }

  isTurn(type){
    return type == TURNPACE || type == TURN;
  }
  exerciseFinished(){
    clearInterval(this.timer);
    this.timer = 0;
    //this.disconnectAllConnectedPeriphrals();
    this.props.onExerciseComplete();
    this.setState({loaded: endOfExercise, curTime: 0, curSpeed: 0, curTimeTable:[], curDevicesScan: {}});
  }
  
  componentWillUnmount(){

    //this.this.disconnectAllConnectedPeriphrals();
    //clearInterval(this.timer);
    this.timerTick = null;
    this.randomNumberWithinRange = null;
    this.speedChangeRateLimit = 0;
    this.state = null;

    clearInterval(this.timer);
    this.timer = 0;
    this.grapha = [];
    this.backup = [];
  }

  destroy(){}
  // return a random number within range of maxSpeed
  randomNumberWithinRange(maxNumber, minNumber){
    return Math.random()*(maxNumber-minNumber)+minNumber;
  };

  nextSegDuration(remainingDur, previousSegTime, remainingSegs, minTime, maxTime){
    minTime = minTime * 1000;
    maxTime = maxTime * 1000;
    remainingTime = remainingDur - previousSegTime;
    remainingMaxTime = remainingTime - minTime * (remainingSegs-1);
    remainingMinTime = remainingTime - maxTime * (remainingSegs-1);
    actualMax = Math.min(remainingMaxTime, maxTime);
    actualMin = Math.max(remainingMinTime, minTime);
    return this.randomNumberWithinRange(actualMax, actualMin);
  }

  // return the speed for next segment in range between (minspeed, maxspeed)
  nextSegSpeed(curSpeed,minSpeed, maxSpeed, percent){
    minSpeed = 60000/minSpeed;
    maxSpeed = 60000/maxSpeed;
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

  nextTurnSpecific(rangeSharpness,rangeTurn, direction){
    var directionIndic = "left";
    console.log("turn spec", direction);
    if(direction == 1){
      directionIndic = "right";
    }else if(direction == 0 && Math.random() > 0.5){
      directionIndic = "right";
    }
    return {turn: this.randomNumberWithinRange(rangeTurn[0], rangeTurn[1]), 
      sharpness: this.randomNumberWithinRange(rangeSharpness[0], rangeSharpness[1]),
      direction: directionIndic
    }
  }

  render(){
    console.log(this.props);
    const {duration, segments, timeVariation, speedVariation} = this.props.setting;
    const timeRange = timeVariation;
    const speedRange = speedVariation;
    fontSize = 23;

    return(
      <View style={[ styles.container, { backgroundColor: '#005bbb' } ]} >
        {(this.state.loaded === wait ) &&
          <TouchableOpacity onPress={() => {

              console.log(timeRange);
              this.exerciseStart(duration*1000, segments, timeRange, speedRange);
          }} style={[styles.buttonInsole, {borderWidth: 2 }]}>
            <Text style={styles.textInCircle}>
                Start
            </Text>
          </TouchableOpacity>
        }
        {this.state.loaded == play &&
          <View>
            <Text style={[{width: 200,textAlign: "center", fontSize: 40, color: "#fff"}]}>
                   { this.state.countDown == -1 ? "In Process" : this.state.countDown+1+""}
            </Text>
          </View>
        } 
        {(this.state.loaded === endOfExercise) &&

          <TouchableOpacity style={[styles.buttonInsole, {borderWidth: 2 }]}
            onPress={() => {
              this.setState({loaded:wait});
            }}>
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
      alignItems: 'center',
    },
    textInCircle:{
      flex: 1,
      color:"#fff",
      fontSize: 25,
      textAlign: 'center',
      marginVertical: 10,
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonInsole:{
      width: 160,
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