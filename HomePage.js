import * as React from 'react';

import { View, StyleSheet, ScrollView, TouchableOpacity, Text, AsyncStorage, ImageBackground} from 'react-native';
import EditPage from "./EditPage";
import WorkScreen from "./WorkScreen";
import SettingPage from "./SettingPage";
import IntroPage from "./IntroPage"
export default class HomePage extends React.Component {
  _handleBackPress() {
    this.props.navigator.pop();
  }
  _handleNavigationSettingDoneRequest(prop1){
    
  }

  _gotoWorkPage(prop1){
    this._handleNextPress({
      component: WorkScreen,
      title: 'Workout',
      passProps: {allSet : prop1},
      rightButtonTitle: 'Setting',
      onRightButtonPress: () => this._handleNavigationRequest(prop1),
    });
  }

  _handleNavigationRequest(prop1) {
    this.props.navigator.push({
      component: SettingPage,
      title: 'Setting',
      passProps: {  },
      rightButtonTitle: 'Done',
      onRightButtonPress: () => {
        this._handleBackPress();
      },
    });
  }

  _gotoSettingPage(prop1, prop2){
    this._handleNextPress({
      component: EditPage,
      title: 'Edit a Task',
      passProps: {editSetting : prop1, image: prop2, callBack : this._addStateHandler}
    })
  }

  _handleNextPress(nextRoute) {
    this.props.navigator.push(nextRoute);
  }
  _addStateHandler(item){
    for(let i = 0; i < this.state.list.length; i++){
        if(this.state.list[i].id == item.id){
          this.state.list[i] = item;
          break;
        }
      }
      AsyncStorage.setItem(item.id, JSON.stringify(item), (error) => {
        if(error){
          console.log("set item failed");
          console.log(JSON.stringify(item));
        }
      });
  }
  exercisePicked(){

  } 
  _componentInitialize(item) {
    console.log(item);
      AsyncStorage.multiSet(item.map((v) => [v.id, JSON.stringify(v)]), (errors) => {
        if(errors){
          console.log("you have failed me one more time son.");
        }else{
          console.log("Save Succeed");
        }
      });
      this.setState({list: item});
  }


  constructor(props){
    super(props);
    this.state = {list: []}
    this.opDict = {
      "Slow Pace" : require("./images/slow.png"),
      "Fast Pace" : require("./images/fast.png"),
      "Slow & Fast Pace" : require("./images/pace.png"),
      "Turn" : require("./images/turn.png"),
      "Pace & Turn" : require("./images/paceandturn.png")
    }
    AsyncStorage.getAllKeys((error, keys) => {
      if(!error && keys.length == 5){
        AsyncStorage.multiGet(keys,(error, result) => {
          this.setState({list : result.map(x=>JSON.parse(x[1]))});
        });
      }else{
          console.log(error, keys.length);
          AsyncStorage.clear((succeed) => {
            this.props.navigator.push({
              component: IntroPage,
              title: 'GAT Tasks',
              navigationBarHidden: true,
              passProps: {initialize : this._componentInitialize}
            });});
        }
      });
    this._componentInitialize = this._componentInitialize.bind(this);
    this._addStateHandler = this._addStateHandler.bind(this);
  }
  
  ready(){
    this.readyInt -=1;
    if(this.readyInt == 0){
      this.forceUpdate();
    }
  }
  onDestroy(){
    console.log("homepage destroy");

  }
  componentWillUnmount(){
    this.state=null;
    console.log("homepages unmount");

  }


  render() {
    exercises = [];
    for(let i = 0; i < this.state.list.length; i++){
      exercises.push(
        <View key={i} style={styles.card}>
          <TouchableOpacity style={[styles.button]} 
            onPress={()=>{ 
              this._gotoWorkPage( this.state.list[i] );
            }}>
            <View style={[styles.imageCard]}>
              <ImageBackground style={[styles.buttonImage]} source={this.opDict[ this.state.list[i].name ] }/>
              <Text style={[styles.buttonText]}> {this.state.list[i].name} </Text>
            </View>
          </TouchableOpacity>

          <View style={[styles.botMenu]}>
            <TouchableOpacity transparent style={[styles.deleteButton]} onPress={()=>{
              this._gotoSettingPage(this.state.list[i], this.opDict[this.state.list[i].name]);
            }}>
              <Text style={styles.icon}>Edit</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      )
    }

    return (
      <ScrollView style={[styles.sv]}>
        <View style={[ styles.container]}>
          {exercises}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  sv:{backgroundColor: '#005bbb'},

  card:{
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 7,
    flexWrap: 'nowrap',
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 4,
      height: 3,
    },
    shadowRadius: 20,
    shadowOpacity: 0.25,
    backgroundColor: '#2f9fd0',
  },
  container: {
    flex: 1,
    margin: 10,
  },
  buttonImage:{
    width: 135,
    height: 70,
    marginRight: 10,
    flex: 4,
    alignSelf: 'flex-end'
  },
  buttonText:{
    top: 21,
    fontSize: 24,
    paddingHorizontal: 3,
    left: 0,
    right: 0,
    backgroundColor: '#0000',
    color: '#005bbb',
    fontWeight: 'bold',
    position: 'absolute',
  },
  button:{
    flex: 2,
    borderColor: '#fff',
    backgroundColor: '#bbb',
    overflow:'hidden',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  botMenu:{
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2f9fd0',
    overflow:'hidden',
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7
  },
  topMenu:{
    flex: 2,
  },
  icon:{
    color: '#ffffff',
    paddingHorizontal: 15,
    fontSize: 15,
    marginVertical: 15,
  },
  deleteButton:{

  },
  imageCard:{
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'white'
  }
})


/*  Delete button


          */