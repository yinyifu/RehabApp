import * as React from 'react';
import { View, StyleSheet, ImageBackground, Text, ScrollView, TextInput, Image, TouchableOpacity} from 'react-native';
import SingleSlider from './SingleSlider';
import MultiSlider from './MultiSlider';
import HomePage from "./HomePage";
import {PropTypes} from 'prop-types';

import {MAX_EXERCISE_LEN, MIN_EXERCISE_LEN, EXERCISE_STEP, MAX_SPEED, MIN_SPEED, SPEED_STEP, MAX_SHARP, MIN_SHARP, MIN_RANGE, MAX_RANGE, MIN_DIRECTION, MAX_DIRECTION} from "./constants";
import {DISABLE_LEFT, DISABLE_RIGHT, DISABLE_LEFT_AND_RIGHT} from "./disablesOptions";

import {SLOW, FAST, PACE, TURN, TURNPACE} from "./exerciseTypes";

export default class EditPage extends React.Component{

	_handleCancel() {
	  this.props.navigator.pop();
	}

	_saveSettingAndGoBack(prop1){
		this.props.callBack(prop1);
		this._handleCancel();
	}

	_handleNextPress(previousRoute) {
	  this.props.navigator.replacePreviousAndPop(previousRoute);
	}
	constructor() {
		super();
		console.log(MAX_EXERCISE_LEN, MIN_EXERCISE_LEN);
		this.state = {
			loaded: false,
			settings: {}
		};
		this.shouldRender = false;
		this.shouldScroll = true;
		this.image = 0;
	}

	placeHolderName(){
		return this.state.duration+" Seconds Exercise.";
	}
	componentWillMount(){

	}
	componentDidMount(){
		this.shouldRender = true;
		const item = this.props.editSetting;
		this.state.loaded = true;
	    this.setState(item);
	    console.log(item);
	    this.image = this.props.image;
	}
	shouldComponentUpdate(){
		return this.shouldRender;
	}
	render(){
		const { loaded, type } = this.state;
		const { duration, segments, speedVariation, timeVariation, turnSharpness, turnRange, turnDirection } = this.state.settings;
		var choices = {}
		choices[SLOW] = DISABLE_RIGHT;
		choices[FAST] = DISABLE_LEFT;
		choices[TURN] = DISABLE_LEFT_AND_RIGHT;

		const disableOption = choices[type];

		const isTurn = type == TURN || type == TURNPACE;

		console.log(type, disableOption);

		return(
			<ScrollView style={[styles.sv]} scrollEnabled={this.shouldScroll}>
				{loaded && <View style={[ styles.shadowed]}>
						
						<View style={[styles.imageCard]}>
			              <ImageBackground style={[styles.buttonImage]} source={ this.image }/>
			              <Text style={[styles.buttonText]}> {this.state.name} </Text>
			            </View>
			        
			        <View style={[styles.containerList]}>	
						<View style={[styles.containerSheet]}>
							<Text style={[styles.labelSeg]}>Total Task Time (seconds)</Text>
						</View>	

					<View style={[styles.containerSheet]}>
						<SingleSlider 
							style={[styles.inline]} 
							onSlidingStart = {()=>{
								this.shouldScroll = false;
								this.forceUpdate();
								this.shouldRender = false;
							}}
							onSlidingComplete={(dur)=>{
								this.shouldRender = true;
								this.shouldScroll = true;
								this.setState({
									settings:Object.assign(this.state.settings, {
										duration: dur,
										segments : Math.min(segments, dur/5)
									})
								});
							}}
							value={duration} 
							maximumValue={MAX_EXERCISE_LEN} 
							minimumValue={MIN_EXERCISE_LEN} 
							minimumTrackTintColor='#ffffff' 
							maximumTrackTintColor='#005bbb' 
							step={EXERCISE_STEP}
							labelTextColor = '#ffffff'
							showLabelAll={false}>
						</SingleSlider>
					</View>
					</View>
					<View style={[styles.containerList]}>
						<View style={[styles.containerSheet]}>
							<Text style={[styles.labelSeg]}>Number of Pace Changes</Text>
						</View>	
						<View style={[styles.containerSheet]}>.                         
							<SingleSlider key={duration/5}                                       
								style={[styles.inline]}                                  
								onSlidingStart = {()=>{
									this.shouldScroll = false;
									this.forceUpdate();
									this.shouldRender = false;
								}}
								onSlidingComplete={(seg)=>{
									this.shouldScroll = true;
									this.shouldRender = true;
									this.state.settings.segments = seg;
									this.forceUpdate();
								}}
								value={segments}                                 
								maximumValue={duration/5}                                             
								minimumValue={1}                                          
								minimumTrackTintColor='#ffffff'                          
								maximumTrackTintColor='#005bbb'                         
								step={1}             
								labelTextColor = '#ffffff'
								showLabelAll={(duration/5 > 10) ? false : true}>
							</SingleSlider>
						</View>	
					</View>
					<View style={[styles.containerList]}>
						<View style={[styles.containerSheet]}>
							<Text style={[styles.labelSeg]}>Time Bound for Pace Changes (seconds)</Text>
						</View>	
						<View style={[styles.containerSheet]}>
							<MultiSlider 
								style={[styles.inline]}  
								maximumValue={duration}                                             
								minimumValue={2}                                     
								minimumTrackTintColor='#005bbb'                          
								maximumTrackTintColor='#ffffff'                         
								value={timeVariation}
								step={0.5}
								labelTextColor = '#ffffff'
								showLabelAll={false}
								onSlidingStart = {()=>{
									this.shouldScroll = false;
									this.forceUpdate();
									this.shouldRender = false;
								}}
								onSlidingComplete={(time)=>{
									this.shouldScroll = true;
									this.shouldRender = true;
									this.state.settings.timeVariation = time;
									this.forceUpdate();
								}}
							>
	    					</MultiSlider>	
						
						</View>	
					</View>

					<View style={[styles.containerList]}>
					
						<View style={[styles.containerSheet]}>
							<Text style={[styles.labelSeg]}>Pace Bound for Pace Changes (steps/minute)</Text>
						</View>	
						<View style={[styles.containerSheet]}>
							<MultiSlider 
								style={[styles.inline, {marginBottom: 20}]}  
								maximumValue={MAX_SPEED}                                             
								minimumValue={MIN_SPEED}                                  
								minimumTrackTintColor='#005bbb'                          
								maximumTrackTintColor='#ffffff'                         
								value={speedVariation}
								step={SPEED_STEP}
								disables = {disableOption}
								labelTextColor = '#ffffff'
								showLabelAll={false}
								onSlidingStart = {()=>{
									this.shouldScroll = false;
									this.forceUpdate();
									this.shouldRender = false;
								}}
								onSlidingComplete={(speed)=>{
									this.shouldScroll = true;
									this.shouldRender = true;
									this.state.settings.speedVariation = speed;
									this.forceUpdate();
								}}
							/>
						</View>	
					</View>
					{isTurn && 
						<View style={[styles.containerList]}>
					
						<View style={[styles.containerSheet]}>
							<Text style={[styles.labelSeg]}>Turn Sharpness (degrees/second)</Text>
						</View>	
						<View style={[styles.containerSheet]}>
							<MultiSlider 
								style={[styles.inline, {marginBottom: 20}]}  
								maximumValue={MAX_SHARP}                                             
								minimumValue={MIN_SHARP}                                  
								minimumTrackTintColor='#005bbb'                          
								maximumTrackTintColor='#ffffff'                         
								value={turnSharpness}
								step={SPEED_STEP}
								labelTextColor = '#ffffff'
								showLabelAll={false}
								onSlidingStart = {()=>{
									this.shouldScroll = false;
									this.forceUpdate();
									this.shouldRender = false;
								}}
								onSlidingComplete={(sharp)=>{
									this.shouldScroll = true;
									this.shouldRender = true;
									this.state.settings.turnSharpness = sharp;
									this.forceUpdate();
								}}
							/>
						</View>	
					</View>}
					{isTurn && 
						<View style={[styles.containerList]}>
						<View style={[styles.containerSheet]}>
							<Text style={[styles.labelSeg]}>Turn Range (degrees)</Text>
						</View>	
						<View style={[styles.containerSheet]}>
							<MultiSlider 
								style={[styles.inline, {marginBottom: 20}]}  
								maximumValue={MAX_RANGE}                                             
								minimumValue={MIN_RANGE}                                  
								minimumTrackTintColor='#005bbb'                          
								maximumTrackTintColor='#ffffff'                         
								value={turnRange}
								step={SPEED_STEP}
								labelTextColor = '#ffffff'
								showLabelAll={false}
								onSlidingStart = {()=>{
									this.shouldScroll = false;
									this.forceUpdate();
									this.shouldRender = false;
								}}
								onSlidingComplete={(sharp)=>{
									this.shouldScroll = true;
									this.shouldRender = true;
									this.state.settings.turnRange = sharp;
									this.forceUpdate();
								}}
							/>
						</View>	
					</View>}

					{isTurn && 
						<View style={[styles.containerList]}>
						<View style={[styles.containerSheet]}>
							<Text style={[styles.labelSeg]}>Turn Direction (left/both/right)</Text>
						</View>	
						<View style={[styles.containerSheet]}>
							<SingleSlider 
								style={[styles.inline, {marginBottom: 20}]}  
								maximumValue={MAX_DIRECTION}                                             
								minimumValue={MIN_DIRECTION}                                  
								minimumTrackTintColor='#005bbb'                          
								maximumTrackTintColor='#ffffff'                         
								value={turnDirection}
								step={SPEED_STEP}
								labelTextColor = '#ffffff'
								showLabelAll={false}
								onSlidingStart = {()=>{
									this.shouldScroll = false;
									this.forceUpdate();
									this.shouldRender = false;
								}}
								onSlidingComplete={(sharp)=>{
									this.shouldScroll = true;
									this.shouldRender = true;
									this.state.settings.turnDirection = sharp;
									this.forceUpdate();
								}}
							/>
						</View>	
					</View>}

					<View style={[styles.containerList]}>
					
						<View style={[styles.containerSheet]}>
							<TouchableOpacity block info style={styles.navButton} 
								onPress={()=>{
									this._handleCancel();
								}}>
								<Text style={{color: "#fff", fontSize: 20}}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity block info style={styles.navButton} 
								onPress={()=>{
									this._saveSettingAndGoBack(this.state);
								}}> 
								<Text style={{color: "#fff", fontSize: 20}}>Save</Text>
							</TouchableOpacity>
						</View>
					</View>

				</View>}
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	sv:{
	    backgroundColor: '#005bbb',
	},
	containerList: {
	    flex: 1,
	    flexDirection:'column',
	    justifyContent: 'center',
	    alignItems: 'center',
	    flexWrap: 'nowrap',
	    marginVertical: 5,
	    marginHorizontal: -5,
	    padding : 5,

	    backgroundColor: '#2f9fd0',
	    
	    borderColor: "#fff",
	    borderWidth: 1
	},
	shadowed:{
		shadowColor: '#000000',
	    shadowOffset: {
	      width: 4,
	      height: 3
	    },
	    shadowRadius: 5,
	    shadowOpacity: 0.25
	},
	containerSheet: {
	    flex: 3,
	    flexDirection:'row',
	    flexWrap: 'nowrap' ,
	    justifyContent: 'space-between',
	    alignItems: 'center',
	},
	labelSeg: {
	  	fontSize: 21,
	  	color: '#ffffff',
	  	marginBottom: 5
	},
	labelSegRight: {
	  	fontSize: 20, 
	  	textAlign: 'center',
	  	color: '#ffffff',
	  	fontWeight: 'bold',
	  	flex: 2
	},
	inline:{
	    marginBottom: 5,
	  	flex: 1,
	  	alignSelf:'stretch',
	},
	title:{
		fontSize: 32, 
		color: '#057',
		marginBottom: 20
	},
	nameInput:{
	  	fontSize: 20,
		flex: 1,
		color: '#ffffff',
		borderBottomWidth: 1.5,
		borderColor: '#ffffff',
		marginTop: 14,
	    marginBottom: 20,
	    paddingBottom: 8,
	},
	markerStyle: {
        height: 15,
        width: 15,
        borderRadius: 8,
        borderColor: '#DDDDDD',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 1,
        shadowOpacity: 0.2,
    },
	imageCard:{
	  flex: 1,
	  justifyContent: 'flex-end',
	  alignItems: 'flex-end',
	  backgroundColor: 'white',
	  alignSelf: 'stretch',


	    flexWrap: 'nowrap',
	    marginVertical: 5,
	    marginHorizontal: -5,
	    padding : 5,
	    
	    borderColor: "#fff",
	    borderWidth: 1
	},
	buttonImage:{

	  width: 125,
	  height: 60,
	  alignSelf: 'flex-end',
	  borderRadius: 7,
	  overflow: 'hidden'
	},
	buttonText:{
	  top: 15,
	  fontSize: 20,
	  paddingHorizontal: 3,
	  left: 0,
	  right: 0,
	  backgroundColor: '#0000',
	  color: '#005bbb',
	  fontWeight: 'bold',
	  position: 'absolute',
	},
	navButton: {
		backgroundColor: '#005bbb', 
		flex: 1, 
		justifyContent: "center", 
		alignItems: "center", 
		marginHorizontal: 5,
		borderRadius: 5,
		padding: 10,
		overflow: "hidden"
	}
})


