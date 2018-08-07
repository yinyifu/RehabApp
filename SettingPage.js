import * as React from 'react';
import { Component } from 'react';
import { View, StyleSheet, Dimensions, SectionList, Text, TouchableOpacity, AppRegistry} from 'react-native';

const TrainRoute = () => <View style={[ styles.container, { backgroundColor: '#005bbb' } ]} />;
const DataRoute = () => <View style={[ styles.container, { backgroundColor: '#ff4081' } ]} />;
export default class SettingPage extends React.Component {
  

  componentDidMount(){
    const item = this.props.setting;
    this.state = item;
  }

  constructor(){
    super();
    this.state = {
      GaitCorrectnessAudio: 1,    //
      GaitCorrectnessVibration: 0,      //
      GaitInstructionAudio: 1,       //
      GaitInstructionSpeech: 0,      // 0 = audio, 1 = speech, 2 = partial, 3 = off
      GaitInstructionPartialSpeech: 0,  // 0 = length, 
      GaitInstructionVibration: 0,
    }
    this.settingOnHit = this.settingOnHit.bind(this);
  }

  settingOnHit(title, data, item){ 
    newState = {};
    for (var i = 0; i < data.length; i++) {
        newState[title+data[i]] = 0;
        if(data[i]==item){
          newState[title+data[i]] = 1;
        }
    }
    this.setState(newState);   
  }
  render() {

    return (
         <SectionList
          sections={[
            {title: 'GaitCorrectness', data: ['Audio', 'Vibration']},
            {title: 'GaitInstruction', data: ['Audio', 'Speech']},
          ]}
          renderItem={({item, index, section : {title, data} }) => 
            <TouchableOpacity style={[styles.item]} onPress={()=>this.settingOnHit(title, data, item)}>
              <Text style={[styles.itemText]} > {item} </Text>
              {this.state[title + item] == 1 && <Text style={[styles.rightMost]}> *</Text>}
            </TouchableOpacity>
          }
          renderSectionHeader={({section}) => <Text style={[styles.sectionHeader]}>{section.title}</Text>}
          keyExtractor={(item, index) => index}
          
        />

    );
  }
}
const styles = StyleSheet.create({
  sectionHeader: {
    paddingTop: 4,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  rightMost:{
    justifyContent: 'flex-end',
  },
  item:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 40,

    backgroundColor: '#ffffff',
  },
  itemText: {
    fontSize: 18,
    color: '#555',
  },
})
