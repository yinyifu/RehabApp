import * as React from 'react';
import { View, StyleSheet, Slider,Asset, Text, ScrollView, TextInput, Image, TouchableHighlight, CameraRoll} from 'react-native';
import { Button, Icon	 } from 'native-base';
import {PropTypes} from 'prop-types';
var ImagePicker = require('react-native-image-picker');

const sliderImage = require('./pointa.png');
const options = {
		  title: 'Select Avatar',
		  customButtons: [
		    {name: 'fb', title: 'Choose Photo from Facebook'},
		  ],
		  storageOptions: {
		    skipBackup: true,
		    path: 'images'
		  }
		};
class DefaultMarker extends React.Component {
  static propTypes = {
    pressed: PropTypes.bool,
    enabled: PropTypes.bool,
    currentValue: PropTypes.number,
    valuePrefix: PropTypes.string,
    valueSuffix: PropTypes.string,
  };
  render() {
    return (
      <TouchableHighlight>
        <View
          style={[styles.markerStyle]}
        ></View>
      </TouchableHighlight>
    );
  }
}


export default class CreatePage extends React.Component{
	constructor() {
		super();
		console.log(ImagePicker);
		this.state = {
			id: ""+(Math.floor(Math.random() * 1000000) + 1),
			name: '',
			duration : 20,
			segments : 3,
			timeVariation : [5.00, 7.00],
			speedVariation : [2, 2.5],
			image: 0,
	      	GaitCorrectnessAudio: 1,    //
	      	GaitCorrectnessVibration: 0,      //
	      	GaitInstructionAudio: 1,       //
	      	GaitInstructionSpeech: 0,      // 0 = audio, 1 = speech, 2 = partial, 3 = off
	      	GaitInstructionPartialSpeech: 0,  // 0 = length, 
	      	GaitInstructionVibration: 0,

		}
		
	}

	static navigationOptions = ({ navigation }) => {
	    const params = navigation.state.params || {};
	    
	    return {
	      headerTitle: "Creating an Task",
	      headerLeft: (
	        <Button  transparent onPress={()=>{navigation.goBack()}} >
	        	<Icon name='close' />
	        </Button>
	      ),
	      headerRight: (
	        <Button transparent onPress={params.createPage} >
	        	<Icon name='create' />
	        </Button>
	      ),
	    };
  	};

  	placeHolderName(){
  		return this.state.duration+" Seconds Exercise.";
  	}
  	componentWillMount(){
  		this.props.navigation.setParams({ 
	      createPage: () =>{
	      	if(this.state.name === ''){
	      		this.state.name = this.placeHolderName();
	      	}
	        this.props.navigation.navigate('Home', {addState: this.state});
	      },
	    });
  	}
  	componentDidMount(){
  	
  	}
  	change(dur, value) {
      this.setState(() => {
      return {
          duration: parseFloat(value),
        };
      });
  	}

  	multiSliderValuesChange = (values) => {
	    this.setState({
	      timeVariation: values,
	    });
	  }
	  //
	render(){
		const { navigation } = this.props;
	    const item = navigation.getParam('editSetting', 0);

	    if(item != 0){
	      this.state = item;	

	      navigation.state.params.editSetting = 0;
	    }

		return(
			<ScrollView style={[styles.sv]}>
				<View style={[styles.containerList, styles.shadowed]}>	
					<View style={[styles.containerSheet]}>
						<Text style={[styles.labelSeg]}>Name</Text>
					</View>	
					<View style={[styles.containerSheet]}>
						<TextInput
					      style={styles.nameInput}
					      placeholder={this.placeHolderName()}

  						  placeholderTextColor="#fff6"
					      onChangeText={(text) => this.setState({name: text})}
					      value={this.state.name}
					    />
				    </View>	
					<View style={[styles.containerSheet]}>
						<Text style={[styles.labelSeg]}>Total Workout Time</Text>
					</View>	
					<View style={[styles.containerSheet]}>
						<Slider 
							style={[styles.inline]} 
							onValueChange={(dur) => this.setState({duration: dur, segments: Math.min(this.state.segments, dur/5)})} 
							value={this.state.duration} 
							maximumValue={40} 
							minimumValue={10} 
							maximumTrackTintColor='#ffffff' 
							minimumTrackTintColor='#005bbb' 
							step={5}
							thumbImage={sliderImage}>
						</Slider>
						<Text style={[styles.labelSegRight]}>{this.state.duration}s</Text>
					</View>

					<View style={[styles.containerSheet]}>
						<Text style={[styles.labelSeg]}>Number of Pace Walk</Text>
					</View>	
					<View style={[styles.containerSheet]}>
						<Slider 
							style={[styles.inline]} 
							onValueChange={(seg) => this.setState({segments: seg})} 
							value={this.state.segments} 
							maximumValue={this.state.duration/5} 
							minimumValue={1} 
							maximumTrackTintColor='#ffffff' 
							minimumTrackTintColor='#005bbb' 
							step={1}
							thumbImage={sliderImage}>
						</Slider>
						<Text style={[styles.labelSegRight]}>{this.state.segments}</Text>
					</View>	

					<View style={[styles.containerSheet]}>
						<Text style={[styles.labelSeg]}>Pace Walk Duration</Text>
					</View>	
					<View style={[styles.containerSheet]}>
						<MultiSlider 
							min={this.state.duration/this.state.segments-3} 
							max={this.state.duration/this.state.segments+3} 
							values={this.state.timeVariation}
							step={0.1}
							selectedStyle={[{backgroundColor: '#005bbb'}]}
							unselectedStyle={[{backgroundColor: '#ffffff'}]}
							containerStyle={[{paddingTop: 23}]}
							onValuesChange={this.multiSliderValuesChange}
							sliderLength={170}
							customMarker={DefaultMarker}
							isMarkersSeparated={false}
						>
    					</MultiSlider>	
						<Text style={[styles.labelSegRight]}>
							{this.state.timeVariation[0].toFixed(1)}~{this.state.timeVariation[1].toFixed(1)}
						</Text>
					
					</View>	

					<View style={[styles.containerSheet]}>
						<Text style={[styles.labelSeg]}>Pace Range</Text>
					</View>	
					<View style={[styles.containerSheet]}>
						<MultiSlider 
							min={0} 
							max={3}
							values={this.state.speedVariation}
							step={0.1}
							selectedStyle={[{backgroundColor: '#005bbb'}]}
							unselectedStyle={[{backgroundColor: '#ffffff'}]}

							containerStyle={[{paddingTop: 23}]}
							onValuesChange={(speed)=>{this.setState({speedVariation:speed})}}
							sliderLength={170}
							customMarker={DefaultMarker}
						>
    					</MultiSlider>	
						<Text style={[styles.labelSegRight]}>
							{this.state.speedVariation[0].toFixed(1)}~{this.state.speedVariation[1].toFixed(1)}
						</Text>
						
					</View>	
					<Button block info style={{backgroundColor: '#005bbb'}} onPress={
							()=>{
								ImagePicker.showImagePicker(options, (response) => {
							  		console.log('Response = ', response);
							  		if (response.didCancel) {
									    console.log('User cancelled image picker');
									  }
									  else if (response.error) {
									    console.log('ImagePicker Error: ', response.error);
									  }
									  else if (response.customButton) {
									    console.log('User tapped custom button: ', response.customButton);
									  }
									  else {
									    //let source = { uri: response.uri };

									    // You can also display the image using data:
									    let source = { uri: 'data:image/jpeg;base64,' + response.data };

									    this.setState({
									      image: source
									    });
									  }

							  	})
							  }
							}> 
							<Text style={{color: "#fff", fontSize: 24}}>Add Image</Text></Button>
				</View>
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
	    alignItems: 'flex-start',
	    flexWrap: 'nowrap',
	    margin: 20,
	    paddingHorizontal: 35,
	    paddingTop	: 33,
	    paddingBottom	: 23,
	    backgroundColor: '#2f9fd0',
	    borderRadius: 7,
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
	    flexWrap: 'nowrap',
	    justifyContent: 'space-between',
	    alignItems: 'center',
	},
	labelSeg: {
	  	fontSize: 25,
	  	color: '#ffffff',
	  	marginBottom: 5
	},
	labelSegRight: {
	  	fontSize: 24, 
	  	textAlign: 'center',
	  	color: '#ffffff',
	  	fontWeight: 'bold',
	  	flex: 2
	},
	inline:{
	    marginBottom: 5,
	  	flex: 4,
	},
	title:{
		fontSize: 32, 
		color: '#057',
		marginBottom: 20
	},
	nameInput:{
	  	fontSize: 24,
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
})
