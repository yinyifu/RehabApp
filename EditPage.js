import * as React from 'react';
import { View, StyleSheet, ImageBackground, Text, ScrollView, TextInput, Image, TouchableOpacity} from 'react-native';
import SingleSlider from './SingleSlider';
import MultiSlider from './MultiSlider';
import HomePage from "./HomePage";
import {PropTypes} from 'prop-types';

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
		this.state = null;
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
	    this.setState(item);
	    console.log(item);
	    this.image = this.props.image;
	}
	shouldComponentUpdate(){
		return this.shouldRender;
	}
	render(){
		return(
			<ScrollView style={[styles.sv]} scrollEnabled={this.shouldScroll}>
				{this.state != null && <View style={[ styles.shadowed]}>
						
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
									duration : dur, 
									segments : Math.min(this.state.segments, dur/5)
								});
							}}
							value={this.state.duration} 
							maximumValue={120} 
							minimumValue={5} 
							minimumTrackTintColor='#ffffff' 
							maximumTrackTintColor='#005bbb' 
							step={5}
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
							<SingleSlider  key={this.state.duration/5}                                       
								style={[styles.inline]}                                  
								onSlidingStart = {()=>{
									this.shouldScroll = false;
									this.forceUpdate();
									this.shouldRender = false;
								}}
								onSlidingComplete={(seg)=>{
									this.shouldScroll = true;
									this.shouldRender = true;
									this.setState({segments: seg})
								}}
								value={this.state.segments}                                 
								maximumValue={this.state.duration/5}                                             
								minimumValue={1}                                          
								minimumTrackTintColor='#ffffff'                          
								maximumTrackTintColor='#005bbb'                         
								step={1}             
								labelTextColor = '#ffffff'
								showLabelAll={(this.state.duration/5 > 10) ? false : true}>
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
								maximumValue={this.state.duration}                                             
								minimumValue={2}                                     
								minimumTrackTintColor='#005bbb'                          
								maximumTrackTintColor='#ffffff'                         
								value={this.state.timeVariation}
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
									this.setState({timeVariation:time})
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
								maximumValue={200}                                             
								minimumValue={20}                                  
								minimumTrackTintColor='#005bbb'                          
								maximumTrackTintColor='#ffffff'                         
								value={this.state.speedVariation}
								step={1}
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
									this.setState({speedVariation:speed})
								}}
							/>
						</View>	
					</View>
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


