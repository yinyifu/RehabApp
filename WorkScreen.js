import * as React from 'react';
import { View, StyleSheet, Dimensions, ScrollView ,Text, AsyncStorage, TabBarIOS } from 'react-native';
import { AreaChart, Grid, BarChart, LineChart, XAxis, PieChart} from 'react-native-svg-charts';

import Charts from './Charts';
import HistoryCharts from './HistoryCharts';
import FeedbackPage from './FeedbackPage';
import TrainPage from './TrainPage';

// class for  //
export default class WorkScreen extends React.Component {
	
  componentWillMount() {
    this.mounted && clearInterval(this.intervalId);
    this.mounted = false;
  }
  componentDidMount(){
    const allSet = this.props.allSet;
    this.setState({userSetting:allSet, loaded: true});
  }
  _randomFunction(){

  }
  constructor(){
    super();
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
      if(setting != null){
        this.props.setting = null;
        for(key in setting){
          this.state.userSetting[key] = setting[key]
        }
        AsyncStorage.setItem(this.state.userSetting.id, JSON.stringify(this.state.userSetting), (error) => {
        if(error){
          console.log("error occured in updating setting in databse");
        }
      });
    }

    return (
      <View style={[ styles.container]}>
         {(this.state.loaded && !this.state.exerciseStarted) && 
          <TabBarIOS selectedTab={this.state.selectedTab}>
              <TabBarIOS.Item
                selected={this.state.selectedTab === 'Workout'}
                
                title={'Workout'}
                onPress={() => {
                  this.setState({
                    selectedTab: 'Workout',
                  });
                }}>
              
                <TrainPage key={this.state.userSetting.speedVariation[0]+this.state.userSetting.speedVariation[1]}
                  speedRange={this.state.userSetting.speedVariation.map( (v) => 60000/v)} 
                  timeRange={this.state.userSetting.timeVariation.map((v) => v*1000)} 
                  duration={this.state.userSetting.duration*1000}
                  segments={this.state.userSetting.segments}
                  gaitInstruct = {this.state.userSetting.GaitInstructionAudio}
                  onExerciseStart = {() => {
                      //this.setState({exerciseStarted: true});
                  }}
                  onExerciseComplete = {() => {
                      //this.setState({exerciseStarted: false});
                  }}/>
                </TabBarIOS.Item>
              <TabBarIOS.Item
                selected={this.state.selectedTab === 'Charts'}
                
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
                
                title={'HistoricalCharts'}
                onPress={() => {
                    this.setState({
                        selectedTab: 'HistoricalCharts',
                    });
                }}>
                  <HistoryCharts/>
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
        {this.state.exerciseStarted && 
          <TrainPage key={this.state.userSetting.speedVariation[0]+this.state.userSetting.speedVariation[1]}
                speedRange={this.state.userSetting.speedVariation.map( (v) => 60000/v)} 
                timeRange={this.state.userSetting.timeVariation.map((v) => v*1000)} 
                duration={this.state.userSetting.duration*1000}
                segments={this.state.userSetting.segments}
                gaitInstruct = {this.state.userSetting.GaitInstructionAudio}
                onExerciseStart = {() => {
                  this.setState({exerciseStarted: true});
                }}
                onExerciseComplete = {() => {
                  this.setState({exerciseStarted: false});
                }}
            />
        }
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