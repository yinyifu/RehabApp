import * as React from 'react';

import { View, StyleSheet, TouchableOpacity, Text, AsyncStorage} from 'react-native';
import Swiper from 'react-native-swiper';
import SingleSlider from './SingleSlider';
import HomePage from './HomePage';
import {SLOW, FAST, PACE, TURN, TURNPACE} from "./exerciseTypes";
import {MAX_SPEED, MIN_SPEED, SPEED_STEP, MIN_SHARP, MAX_SHARP, INSTRUCT_MODE_AUDIO, INSTRUCT_MODE_SPEECH, INSTRUCT_MODE_CHOIR, CORRECTNESS_MODE_AUDIO, CORRECTNESS_MODE_VIBRATION} from "./constants";

export default class IntroPage extends React.Component {
  _gotoHomePage(){
    const item = this.state.averageSpeed;
    const sharp = this.state.turnSharpness;
    const omgList = [{
          id: ""+(Math.floor(Math.random() * 10000000) + 1),
          name: 'Slow Pace',
          type: SLOW,
          settings: {
            duration : 20,
            segments : 3,
            timeVariation : [5.00, 8.00],
            speedVariation : [Math.max(item - 10, MIN_SPEED), item],
          },
          feedback:{
            GaitCorrectnessMode: CORRECTNESS_MODE_AUDIO, 
            GaitInstructionMode: INSTRUCT_MODE_AUDIO,
          },
          data: []
        },{
          id: ""+(Math.floor(Math.random() * 10000000) + 1),
          name: 'Fast Pace',
          type: FAST,
          settings: {
            duration : 20,
            segments : 3,
            timeVariation : [5.00, 8.00],
            speedVariation : [item, Math.min(item+10, MAX_SPEED)],
            
          },
          feedback:{
            GaitCorrectnessMode: CORRECTNESS_MODE_AUDIO, 
            GaitInstructionMode: INSTRUCT_MODE_AUDIO,
          },
          data: []
        },{
          id: ""+(Math.floor(Math.random() * 10000000) + 1),
          name: 'Slow & Fast Pace',
          type: PACE,
          settings: {
            duration : 20,
            segments : 3,
            timeVariation : [5.00, 8.00],
            speedVariation : [Math.max(item - 10, MIN_SPEED), Math.min(item+10, MAX_SPEED)],
            
          },
          feedback:{
            GaitCorrectnessMode: CORRECTNESS_MODE_AUDIO, 
            GaitInstructionMode: INSTRUCT_MODE_AUDIO,
          },
          data: []
        },{
          id: ""+(Math.floor(Math.random() * 10000000) + 1),
          name: 'Turn',
          type: TURN,
          settings: {
            duration : 20,
            segments : 3,
            timeVariation : [5.00, 8.00],
            speedVariation : [item, item],
            turnSharpness : [Math.max(sharp - 10, MIN_SHARP), Math.min(sharp+10, MAX_SHARP)],
            turnRange : [10, 180],
            turnDirection : 0
          },
          feedback:{
            GaitCorrectnessMode: CORRECTNESS_MODE_AUDIO, 
            GaitInstructionMode: INSTRUCT_MODE_AUDIO,
            GaitTurnCorrectnessMode: CORRECTNESS_MODE_AUDIO, 
            GaitTurnInstructionMode: INSTRUCT_MODE_SPEECH,
          },
          data: []
        },{
          id: ""+(Math.floor(Math.random() * 1000000) + 1),
          name: 'Pace & Turn',
          type: TURNPACE,
          settings: {
            duration : 20,
            segments : 3,
            timeVariation : [5.00, 7.00],
            speedVariation : [Math.max(item - 10, MIN_SPEED), Math.min(item+10, MAX_SPEED)],
            turnSharpness : [Math.max(sharp - 10, MIN_SHARP), Math.min(sharp+10, MAX_SHARP)],
            turnRange : [10, 180],
            turnDirection : 0,
          },
          feedback:{
            GaitCorrectnessMode: CORRECTNESS_MODE_AUDIO, 
            GaitInstructionMode: INSTRUCT_MODE_AUDIO,
            GaitTurnCorrectnessMode: CORRECTNESS_MODE_AUDIO, 
            GaitTurnInstructionMode: INSTRUCT_MODE_SPEECH,
          },
          data: []
        }];
    this.props.initialize(omgList);
    this._handleNextPress({
      component: HomePage,
      title: 'GAT Tasks',
    });
  }

  _handleNextPress(nextRoute) {
    this.props.navigator.pop();
  }

  static navigationOptions = {
    tabBarVisible: true,
    header: null
  };

  constructor(){
    super();
    this.state = {
      scrollEnabled: true,
      averageSpeed : 50,
      swiper: this.renderSwpier,
      turnSharpness : 15
    };
    this._gotoHomePage = this._gotoHomePage.bind(this);
  }

  componentDidMount () {
    
  }

  renderSwpier(){

    const {averageSpeed , scrollEnabled} = this.state;
      return(
      <Swiper style={styles.wrapper} 
        showsButtons={true} 
        scrollEnabled={this.state.scrollEnabled} 
        loadMinimal={true}
        loop={false}
      >
        <View style={styles.slide1}>
          <Text style={styles.text}>Welcome to Rehab App</Text>
        </View>
        <View style={styles.slide2}>
          <Text style={styles.text}>Fast and easy walking exercises.</Text>
        </View>
        <View style={styles.slide3} >
          <View style={[styles.containerSheet2]}>
            <Text style={styles.text}>Input your Average Speed (Steps per Minute):</Text>
          </View>
          <View style={[styles.containerSheet]}>
            <SingleSlider 
              style={[styles.inline]}  
              maximumValue={MAX_SPEED}                                             
              minimumValue={MIN_SPEED}  
              minimumTrackTintColor='#ffffff'                          
              maximumTrackTintColor='#ffffff'                         
              value={averageSpeed}
              step={SPEED_STEP}
              labelTextColor = '#ffffff'
              showLabelAll={false}
              onSlidingStart = {()=>{
                this.setState({scrollEnabled: false});
              }}
              onValueChange={(speed)=>{}}
              onSlidingComplete={(value)=>{
                this.setState({scrollEnabled: true, averageSpeed:value});
              }}
            />
          </View>
          <View style={styles.containerSheet1}>
            <TouchableOpacity style={ styles.button }
              onPress={()=>{
                this._gotoHomePage();

              }}>
              <Text style={styles.textOnButton}>Continue To App</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Swiper>
    )
  }
  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.swiper.call(this)}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  wrapper: {
  },
  inline:{
      flex: 1,
      alignSelf:'stretch',
      justifyContent: 'center',
      alignItems: 'center',
  },
  button:{
    width: "100%",
    justifyContent: 'center',
    backgroundColor: '#2f9fd0',
    borderRadius: 5,
    overflow: "hidden",
    padding: 10,
  },
  containerSheet: {
    flex: 3,

    justifyContent: 'center',
    alignItems: 'center',
    width: "80%",
  },
  containerSheet2: {
    flex: 4,

    justifyContent: 'flex-end',
    alignItems: 'center',
    width: "80%",
  },
  containerSheet1: {
    flex: 3,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: "80%",
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#005bbb',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#005bbb',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#005bbb',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    width : "75%",
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textOnButton: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  }
})