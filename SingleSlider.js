import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { View, PanResponder, Dimensions, StyleSheet, Text } from 'react-native';
import Svg,{ Circle, G, Line } from 'react-native-svg';
import SliderBody from './SliderBody';
const ViewPropTypes = require('react-native').ViewPropTypes || View.propTypes;


export default class SingleSlider extends Component {
	// define props
	static propTypes = {
		// Must provide. Shows the user slider initial default value.
	    value: PropTypes.number,
	    onSlidingStart: PropTypes.func,
	    // Called when value changes
	    onValueChange: PropTypes.func,
	    // Called when let go.
	    onSlidingComplete: PropTypes.func,
	    // Custom Slider handle
	    customMarker: PropTypes.func,
	    // Minimum value for slider
	    minimumValue: PropTypes.number,
	    // Max value for slider
	    maximumValue: PropTypes.number,
	    // Color left side of slider handle
	    minimumTrackTintColor: PropTypes.string,
	    // Color right side of slider handle
	    maximumTrackTintColor: PropTypes.string,
	    labelTextColor: PropTypes.string,
	    step: PropTypes.number,
	    // Style onto slider
	    style: ViewPropTypes.style,
	    showLabelAll: PropTypes.bool,
  	};
  	static defaultProps = {
  		onValueChange: (value) => {},
  		onSlidingComplete: (value) => {},
  		onSlidingStart:() => {},
  		labelTextColor: "#fff",
//  		customMarker: defaultMarker,
  		minimumTrackTintColor: '#ddd',
  		maximumTrackTintColor: '#005bbb',
  	};

  	constructor(props) {
	    super(props);
	    this.value = this.props.value
	    this.getColor = this.getColor.bind(this);
	    this.labels = []
  	}
  	componentWillMount(){
  	}
  	componentDidMount(){
  	}
    componentWillUnmount() {
	    this.labels = []

	}
	getColor(text){
		return this.props.minimumTrackTintColor;
	}
  
  	render() {
  		const { width, height } = Dimensions.get("window");
	    const { minimumValue, maximumValue, style, minimumTrackTintColor, maximumTrackTintColor, step, value, onValueChange, onSlidingComplete,showLabelAll,labelTextColor, onSlidingStart } = this.props;
	  
	  	const offset = 5;
	    const numberOfLabels = (maximumValue-minimumValue)/step+1;
	    const stepPercentage = (100-offset*2)/(numberOfLabels-1);
	    labels = [];
	    
	    for(let i = 0; i < numberOfLabels; i+=(showLabelAll? 1:(numberOfLabels-1))){
	    	const percVal = (offset+stepPercentage*i);
	    	const perc = percVal.toFixed(0)+"%";
	    	const text = (minimumValue + step*i).toFixed(0);
	    	labels.push(
	    		<Text key={perc} style={[StyleSheet.absoluteFill, {top: "59%", color: "#fff", fontSize: 20, fontWeight: "bold", left: (percVal-text.length*2)+"%"}]}>
	    		{text}
			    </Text>
			);   
	    }

	    return (
	    	<View style={style} onLayout={(event) => {
				  this.width = event.nativeEvent.layout.width;
				}} >
				{labels}
				<Svg height = "60" width = "100%">
				
				<SliderBody
					value = {value}
					step = {step}
					maximumTrackTintColor={maximumTrackTintColor}
					minimumTrackTintColor={minimumTrackTintColor}
					minimumValue={minimumValue}
					maximumValue={maximumValue}
					hideLabel = {showLabelAll}
					onSlidingStart = {onSlidingStart}
					onSlidingComplete={onSlidingComplete}
					onValueChange={(value) => {
						this.value = value;
						onValueChange(value)
					}}
				/>
				
				</Svg>
				
              	
		    </View>
	    )
	}
}

