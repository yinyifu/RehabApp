import * as React from 'react';

import { View, StyleSheet, TouchableOpacity, Text, AsyncStorage} from 'react-native';
import Swiper from 'react-native-swiper';
import MultiSlider from './MultiSlider';
import HomePage from './HomePage';
export default class IntroPage extends React.Component {
  _gotoHomePage(prop1){
    const item = this.state.valuesForRange;
    const omgList = [{
          id: ""+(Math.floor(Math.random() * 1000000) + 1),
          name: 'Slow Pace',
          duration : 20,
          segments : 3,
          timeVariation : [5.00, 7.00],
          speedVariation : item,
          GaitCorrectnessAudio: 1,    //
          GaitCorrectnessVibration: 0,      //
          GaitInstructionAudio: 1,       //
          GaitInstructionSpeech: 0,      // 0 = audio, 1 = speech, 2 = partial, 3 = off
          GaitInstructionPartialSpeech: 0,  // 0 = length, 
          GaitInstructionVibration: 0,
        },{
          id: ""+(Math.floor(Math.random() * 1000000) + 1),
          name: 'Fast Pace',
          duration : 20,
          segments : 3,
          timeVariation : [5.00, 7.00],
          speedVariation : item,
          GaitCorrectnessAudio: 1,    //
          GaitCorrectnessVibration: 0,      //
          GaitInstructionAudio: 1,       //
          GaitInstructionSpeech: 0,      // 0 = audio, 1 = speech, 2 = partial, 3 = off
          GaitInstructionPartialSpeech: 0,  // 0 = length, 
          GaitInstructionVibration: 0,
        },{
          id: ""+(Math.floor(Math.random() * 1000000) + 1),
          name: 'Slow & Fast Pace',
          duration : 20,
          segments : 3,
          timeVariation : [5.00, 7.00],
          speedVariation : item,
          GaitCorrectnessAudio: 1,    //
          GaitCorrectnessVibration: 0,      //
          GaitInstructionAudio: 1,       //
          GaitInstructionSpeech: 0,      // 0 = audio, 1 = speech, 2 = partial, 3 = off
          GaitInstructionPartialSpeech: 0,  // 0 = length, 
          GaitInstructionVibration: 0,
        },{
          id: ""+(Math.floor(Math.random() * 1000000) + 1),
          name: 'Turn',
          duration : 20,
          segments : 3,
          timeVariation : [5.00, 7.00],
          speedVariation : item,
          GaitCorrectnessAudio: 1,    //
          GaitCorrectnessVibration: 0,      //
          GaitInstructionAudio: 1,       //
          GaitInstructionSpeech: 0,      // 0 = audio, 1 = speech, 2 = partial, 3 = off
          GaitInstructionPartialSpeech: 0,  // 0 = length, 
          GaitInstructionVibration: 0,
        },{
          id: ""+(Math.floor(Math.random() * 1000000) + 1),
          name: 'Pace & Turn',
          duration : 20,
          segments : 3,
          timeVariation : [5.00, 7.00],
          speedVariation : item,
          GaitCorrectnessAudio: 1,    //
          GaitCorrectnessVibration: 0,      //
          GaitInstructionAudio: 1,       //
          GaitInstructionSpeech: 0,      // 0 = audio, 1 = speech, 2 = partial, 3 = off
          GaitInstructionPartialSpeech: 0,  // 0 = length, 
          GaitInstructionVibration: 0,
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
      valuesForRange : [50, 70],
      swiper: this.renderSwpier
    };
    this._gotoHomePage = this._gotoHomePage.bind(this);
  }

  componentDidMount () {
    
  }

  renderSwpier(){

    const {valuesForRange , scrollEnabled} = this.state;
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
            <Text style={styles.text}>Input your Suggest Speed (Steps per Minute):</Text>
          </View>
          <View style={[styles.containerSheet]}>
            <MultiSlider 
              style={[styles.inline]}  
              maximumValue={200}                                             
              minimumValue={20}  
              minimumTrackTintColor='#ffffff'                          
              maximumTrackTintColor='#ffffff'                         
              value={valuesForRange}
              step={1}
              labelTextColor = '#ffffff'
              showLabelAll={false}
              onSlidingStart = {()=>{
                this.setState({scrollEnabled: false});
              }}
              onValueChange={(speed)=>{
              }}
              onSlidingComplete={(value)=>{
                this.setState({scrollEnabled: true, valuesForRange:value});
              }}
            />
          </View>
          <View style={styles.containerSheet1}>
            <TouchableOpacity style={styles.button}
              onPress={()=>{
                this._gotoHomePage(this.state.valuesForRange);
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