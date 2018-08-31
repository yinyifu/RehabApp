import * as React from 'react';
import { View, StyleSheet, Dimensions, ScrollView ,Text, AsyncStorage, TabBarIOS } from 'react-native';
import { AreaChart, Grid, BarChart, LineChart, XAxis, PieChart} from 'react-native-svg-charts';

import Charts from './Charts';
import HistoryCharts from './HistoryCharts';
import FeedbackPage from './FeedbackPage';
import TrainPage from './TrainPage';
import SettingPage from './SettingPage';

import {TURN, TURNPACE} from './exerciseTypes';
import {store, SettingChanged} from './actionTypes';



const workoutIcon = require('./images/stopwatch.png');
const staticticIcon = require('./images/Investment.png');
const feedbackIcon = require('./images/statistics.png');
const settingIcon = require('./images/settings.png');
// class for  //
export default class WorkScreen extends React.Component {
  _handleNavigationRequest(prop1) {
    this.props.navigator.push({
      component: SettingPage,
      title: 'Setting',
      passProps: {},
    });
  }

  componentWillMount() {
    this.mounted && clearInterval(this.intervalId);
    this.mounted = false;
  }
  componentDidMount(){
    const { allSet } = this.props;
    SettingChanged(allSet.id, allSet.feedback);
    this.setState({ type : allSet.type, userSetting:allSet.settings, feedback: allSet.feedback,  loaded: true});
  }
  _randomFunction(){

  }
  constructor(props){
    super(props);
    this.state = {
      selectedTab : "Workout",
      userSetting: [],
      exerciseStarted : false,
      loaded : false,
    };
    this.left = 0;
    this._randomFunction = this._randomFunction.bind(this);
  }
  render() {

    const setting = this.props.setting;
    const isTurn = this.state.type == TURNPACE || this.state.type == TURN;
    /*if(setting != null){
        this.props.setting = null;
        for(key in setting){
          this.state.userSetting[key] = setting[key]
        }
        AsyncStorage.setItem(this.state.userSetting.id, JSON.stringify(this.state.userSetting), (error) => {
        if(error){
          console.log("error occured in updating setting in databse");
        }
      });
    }*/
    const { feedback } = this.state;

    //const mode = feedback.GaitInstructionMode;
    const settingListDefault =  [{title: 'GaitInstructionMode', data: ['Audio', 'Speech']}];
    const settingListTurn = [{title: 'GaitInstructionMode', data: ['Audio']},
                            {title: 'GaitTurnInstructionMode', data: ['Speech', 'Choir']}];
    //console.log(isTurn);
    return (
      <View style={[ styles.container]}>
         {(this.state.loaded && !this.state.exerciseStarted) && 
          <TabBarIOS selectedTab={this.state.selectedTab}>
              <TabBarIOS.Item
                selected={this.state.selectedTab === 'Workout'}
                icon={workoutIcon}
                title={'Workout'}
                onPress={() => {
                  this.setState({
                    selectedTab: 'Workout',
                  });
                }}>
              
                <TrainPage key={this.state.userSetting.speedVariation[0]+this.state.userSetting.speedVariation[1]}
                  /*speedRange={this.state.userSetting.speedVariation.map( (v) => 60000/v)} 
                  timeRange={this.state.userSetting.timeVariation.map((v) => v*1000)} 
                  duration={this.state.userSetting.duration*1000}
                  segments={this.state.userSetting.segments}*/
                  setting = {this.state.userSetting}
                  feedback = {this.state.feedback}
                  type = {this.state.type}
                  gaitInstruct = {this.state.userSetting.GaitInstructionMode}
                  onExerciseStart = {() => {
                      //this.setState({exerciseStarted: true});
                  }}
                  onExerciseComplete = {() => {
                      //this.setState({exerciseStarted: false});
                  }}/>
              </TabBarIOS.Item>
              <TabBarIOS.Item
                selected={this.state.selectedTab === 'Charts'}
                icon={feedbackIcon}
                title={'Charts'}
                onPress={() => {
                    this.setState({
                        selectedTab: 'Charts',
                    });
                }}>
                <FeedbackPage/>
              </TabBarIOS.Item>
              <TabBarIOS.Item
                selected={this.state.selectedTab === 'HistoricalCharts'}
                icon={staticticIcon}
                title={'HistoricalCharts'}
                onPress={() => {
                    this.setState({
                        selectedTab: 'HistoricalCharts',
                    });
                }}>
                  <HistoryCharts/>
                </TabBarIOS.Item>
              <TabBarIOS.Item
                selected={this.state.selectedTab === 'SettingPage'}
                icon={settingIcon}
                title={'Setting'}

                onPress={() => {
                    this.setState({
                        selectedTab: 'SettingPage',
                    });
                }}>
                  <SettingPage setting={this.props.allSet}
                    list = {isTurn ? settingListTurn : settingListDefault}
                  />
                </TabBarIOS.Item>
              </TabBarIOS>
            }

        {!this.state.loaded &&
          <View style={{flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems : 'center'}}>
            <Text style={{
              fontSize:20 
            }}>Loading
            </Text>
          </View>
        }
        /*{this.state.loaded && this.state.exerciseStarted && 
          <TrainPage key={this.state.userSetting.speedVariation[0]+this.state.userSetting.speedVariation[1]}
                speedRange={this.state.userSetting.speedVariation.map( (v) => 60000/v)} 
                timeRange={this.state.userSetting.timeVariation.map((v) => v*1000)} 
                duration={this.state.userSetting.duration*1000}
                segments={this.state.userSetting.segments}
                
                allSet = {this.state.allSet}
                onExerciseStart = {() => {
                  this.setState({exerciseStarted: true});
                }}
                onExerciseComplete = {() => {
                  this.setState({exerciseStarted: false});
                }}
            />
        }*/
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    backgroundColor: '#ffffff',
  },
  infobox:{
    padding: 10,
  },

})