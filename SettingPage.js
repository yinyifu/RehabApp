import * as React from 'react';
import { Component } from 'react';
import { View, StyleSheet, Dimensions, SectionList, Text, TouchableOpacity, AppRegistry} from 'react-native';
import { createStore } from 'react-redux';

import { SETTING_CHANGED, SettingChanged,  } from './actionTypes';
import {INSTRUCT_MODE_AUDIO, INSTRUCT_MODE_SPEECH, INSTRUCT_MODE_CHOIR, inDict} from "./constants";

import PropTypes from 'prop-types';

const TrainRoute = () => <View style={[ styles.container, { backgroundColor: '#005bbb' } ]} />;
const DataRoute = () => <View style={[ styles.container, { backgroundColor: '#ff4081' } ]} />;
    
export default class SettingPage extends React.Component {
  static propTypes = {
    setting : PropTypes.object
  };

  static defaultProps = {};

  componentDidMount(){
    this.setState({
      type: this.props.setting.type,
      feedback: this.props.setting.feedback,
      loaded: true});
  }

  constructor(props){
    super(props);
    this.state = {
      type: props.setting.type,
      feedback: props.setting.feedback,
      loaded: false
    };
    //console.log(this.state);
    this.settingOnHit = this.settingOnHit.bind(this);
  }

  settingOnHit(title, data, item, index){
    newState = this.state.feedback;
    newState[title] = inDict[data[index]];
    this.setState({feedback: newState});
    SettingChanged(this.props.setting.id, this.state.feedback);
  }


  render() {
    return (
         <SectionList
          sections={this.props.list}
          renderItem={({item, index, section : {title, data} }) => 
            <TouchableOpacity style={[styles.item]} onPress={()=>this.settingOnHit(title, data, item, index)}>
              <Text style={[styles.itemText]} > {item} </Text>
              {this.state.feedback[title] == inDict[data[index]] && <Text style={[styles.rightMost]}> *</Text>}
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
