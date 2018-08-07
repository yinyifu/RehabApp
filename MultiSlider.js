import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { TouchableOpacity, View,PanResponder, Dimensions,StyleSheet } from 'react-native';
import Svg,{
    Circle,
    Line,
    Rect,
    Text,
    G
} from 'react-native-svg';

const ViewPropTypes = require('react-native').ViewPropTypes || View.propTypes;

export default class MultiSlider extends React.Component {
	static propTypes = {
	    value: PropTypes.arrayOf(PropTypes.number),
	    onSlidingStart : PropTypes.func,
	    onValueChange: PropTypes.func,
	    onSlidingComplete: PropTypes.func,

//	    customMarker: PropTypes.func,

	    minimumValue: PropTypes.number,
	    maximumValue: PropTypes.number,
	    minimumTrackTintColor: PropTypes.string,
	    maximumTrackTintColor: PropTypes.string,
	    step: PropTypes.number,
	    disabled: PropTypes.bool,
	    style: ViewPropTypes.style,
	    labelTextColor: PropTypes.string,
	    showLabelAll: PropTypes.bool,
	    stepAverage: PropTypes.number,


  	};
  	static defaultProps = {
  		onValueChange: (value) => {},
  		onSlidingComplete: (value) => {},
  		onSlidingStart: () => {},
//  		customMarker: defaultMarker,
  		minimumTrackTintColor: '#fff',
  		maximumTrackTintColor: '#005bbb',
  		labelTextColor: '#fff',
  		disabled: false,
  		showLabelAll: false,
  		stepAverage: -9999999,
  		step: 0.01
  	};
  	constructor(props) {
	    super(props);
	    this.state = {
	      value: this.props.value,
	      pressedOne: false,
	      pressedTwo: false
	    };
  	}

	  componentWillMount() {
	  	const startOne = () => {
	  		this.start = this.state.value[0];
	  		this.setState({pressedOne: true});
	  		this.props.onSlidingStart();
	  	}
	  	const endOne= ({dx, dy}) => {

	  		this.setState({pressedOne: false});

	  		if(this.state.pressedTwo == false){
	  			this.props.onSlidingComplete(this.state.value);
	  		}
	  	}
	  	const moveOne=({dx, dy}) => {
	  		const {maximumValue, minimumValue, step,onValueChange } = this.props;
	  		const modifiedDx = (maximumValue - minimumValue)/(this.width*0.9) * dx;
	  			
  			let valueRaw = this.start+modifiedDx;
  			value2 = Math.round(valueRaw/step);
  			value = value2*step;
  			value2 = this.state.value[1];
  			if(value < minimumValue){
  				value = minimumValue;
  			}
  			if(value >= value2){
  				value = value2-step;
  			}

  			if( Math.abs(value-this.state.value[0]) > step/2){
	  			this.setState({ value: [value, value2]});
	  			onValueChange(value);
  			}	
	  	}
	  	const startTwo = () => {
	  		this.start = this.state.value[1];
	  		this.setState({pressedTwo: true});
	  		this.props.onSlidingStart();
	  	}
	  	const endTwo= ({dx, dy}) => {
	  		this.setState({pressedTwo: false});
	  		if(this.state.pressedOne == false){
	  			this.props.onSlidingComplete(this.state.value);
	  		}
	  	}
	  	const moveTwo=({dx, dy}) => {
	  		const {maximumValue, minimumValue, step,onValueChange } = this.props;
	  		const modifiedDx = (maximumValue - minimumValue)/this.width * dx;
	  			
  			let valueRaw = this.start+modifiedDx;
  			value2 = Math.round(valueRaw/step);
  			value = value2*step;
  			value1 = this.state.value[0];
  			if(value > maximumValue){
  				value = maximumValue;
  			}
  			if(value <= value1){
  				value = value1+step;
  			}
  			if( Math.abs(value-this.state.value[0]) > step/2){
	  			this.setState({ value: [value1, value]});
	  			onValueChange(value);
	  		}
	  		
	  	}
	    this._panResponderOne = PanResponder.create({
	        onStartShouldSetPanResponder: (evt, gestureState) => true,
	        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
	        onMoveShouldSetPanResponder: (evt, gestureState) => true,
	        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
	        onPanResponderGrant: (evt, gestureState) => startOne(),
	        onPanResponderMove: (evt, gestureState) => moveOne(gestureState),
	        onPanResponderTerminationRequest: (evt, gestureState) => false,
	        onPanResponderRelease: (evt, gestureState) =>endOne(gestureState),
	        onPanResponderTerminate: (evt, gestureState) =>endOne(gestureState),
	        onShouldBlockNativeResponder: (evt, gestureState) => true,
	      });
	    this._panResponderTwo = PanResponder.create({
	        onStartShouldSetPanResponder: (evt, gestureState) => true,
	        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
	        onMoveShouldSetPanResponder: (evt, gestureState) => true,
	        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
	        onPanResponderGrant: (evt, gestureState) => startTwo(),
	        onPanResponderMove: (evt, gestureState) => moveTwo(gestureState),
	        onPanResponderTerminationRequest: (evt, gestureState) => false,
	        onPanResponderRelease: (evt, gestureState) =>endTwo(gestureState),
	        onPanResponderTerminate: (evt, gestureState) =>endTwo(gestureState),
	        onShouldBlockNativeResponder: (evt, gestureState) => true,
	      });
	  }

 

  	render() {
  		const { width, height } = Dimensions.get("window");
	    const { value } = this.state;
	    const { minimumValue, maximumValue, style, minimumTrackTintColor, maximumTrackTintColor, labelTextColor, step, showLabelAll, stepAverage } = this.props;
	    
	    const offset = 5;

	    const radius = 30;
	    const fontSize = 20;
	    const currentPercentage1Val = (((value[0]-minimumValue)/(maximumValue-minimumValue))*(100-offset*2)+offset)
	    const currentPercentage1 = currentPercentage1Val +"%";
	    const currentPercentage2Val = (((value[1]-minimumValue)/(maximumValue-minimumValue))*(100-offset*2)+offset);
	    const currentPercentage2 = currentPercentage2Val + "%";
	    const tag1 = (((value[0]-minimumValue)/(maximumValue-minimumValue))*(100-offset*2)+offset) - radius/this.width*100 + "%";
	    const tag2 = (((value[1]-minimumValue)/(maximumValue-minimumValue))*(100-offset*2)+offset) - radius/this.width*100 + "%";

	    const numberOfLabels = (maximumValue-minimumValue)/step;
	    const stepPercentage = (100-offset*2)/numberOfLabels;

	    const upperLimPerc = 85;
	    const lowerLimPerc = 15;

	    var labels = []; 
	    for(var i = 0; i <= numberOfLabels; i+=(showLabelAll ? 1 : numberOfLabels)){
	    	const percVal = (offset+stepPercentage*i);
	    	const perc = percVal+"%";
	    	const text = (minimumValue + step*i);
    		labels.push(
	    		<G key={i} >
	    			<Line
	    				x1= {perc}
	    				y1= {(text == minimumValue || text == maximumValue) ? "20" : "24"}
	    				x2= {perc}
	    				y2= "30"
	    				stroke={(text < this.state.value[0] || text > this.state.value[1])? minimumTrackTintColor : maximumTrackTintColor}
        				strokeWidth = "2"
        				/>
		    		<Text 
		    			fill={labelTextColor}
				        stroke="none"
				        fontSize={fontSize}
				        fontWeight="bold"
				        x= {perc}
				        y="55"
				        textAnchor={(i==0) ? 'start' : ( (i==numberOfLabels) ? 'end' : "middle")}>
				        {text.toFixed(0)}
				        </Text>
			    </G>
	    	);
	    	
	    }
	    return (
	    	<View style={style} onLayout={(event) => {
				  this.width = event.nativeEvent.layout.width;
				}} >
				{this.state.pressedOne && <View style={[StyleSheet.absoluteFill, {top:-radius*2, width: radius*2, height: radius*2, left:(tag1)}]}>
			      	<Svg height = "100%" width = "100%">
				      	<Circle 
				      		cx = "50%"
				      		cy = "50%"
				            r = {radius}
				            fill = "#005bbb">
			      		</Circle>

			      		<Text fontSize={fontSize}
					        x= "50%"
					        y= {radius+fontSize/4}
					        fill="#fff"
					        textAnchor="middle" >
			      			{this.state.value[0].toFixed(1)}
			      		</Text>
			      	</Svg>
			    </View>}

			    {this.state.pressedTwo && <View style={[StyleSheet.absoluteFill, {top: -radius*2, width: radius*2, height: radius*2, left:(tag2)}]}>
			      	<Svg height = "100%" width = "100%">
				      	<Circle 
				      		cx = "50%"
				      		cy = "50%"
				            r = {radius}
				            fill = "#005bbb">
			      		</Circle>

			      		<Text fontSize="20"
					        fontWeight="bold"
					        x= "50%"
					        y= {radius+fontSize/4}
					        fill="#fff"
					        textAnchor="middle" >
			      			{this.state.value[1].toFixed(1)}
			      		</Text>
			      	</Svg>
			    </View>}
	    		<Svg height = "60" width = "100%">
			   	{labels}
              	<Line
              		x1={(offset)+"%"}
        			y1="25"
        			x2={currentPercentage1}
        			y2="25"
        			stroke={minimumTrackTintColor}
        			strokeWidth = "2"
              	/>
	            <Line
	            	x1={currentPercentage1}
        			y1="25"
        			x2={currentPercentage2}
        			y2="25"
        			stroke={maximumTrackTintColor}
        			strokeWidth = "2"
	            />
	            <Line
	            	x1={currentPercentage2}
        			y1="25"
        			x2={(100-offset)+"%"}
        			y2="25"
        			stroke={minimumTrackTintColor}
        			strokeWidth = "2"
	            />
		        <Rect  {...this._panResponderOne.panHandlers}
		        	  x = {0}
		              y = {0}
		              width = {(currentPercentage1Val + currentPercentage2Val)/2+"%"}
		              height = "100%"
		              
		              fill = "#0000"
              	/>
              	<Circle
		        	  cx = {currentPercentage1}
		              cy = "25"
		              r = {this.state.pressedOne? 5:8}
		              stroke = {minimumTrackTintColor}
		              strokeWidth = "2"
		              fill = {maximumTrackTintColor}
              		/>
              	{(currentPercentage1Val > lowerLimPerc && currentPercentage1Val < upperLimPerc) &&<Text 
	    			fill="#fff"
	    			stroke="none"
    				key={currentPercentage1}
			        fontSize="20"
			        fontWeight="bold"
			        x= {currentPercentage1}
			        y="55"
			        textAnchor="middle">
			        {this.state.value[0].toFixed((this.state.value[0]*10%10 == 0? 0:1))}
			    </Text>}
              	<Rect  {...this._panResponderTwo.panHandlers}
		        	  x = {(currentPercentage1Val + currentPercentage2Val)/2+"%"}
		              y = {0}
		              width = "100%"
		              height = "100%"
		              fill = "#0000"
              	/>
              	<Circle
		        	  cx = {currentPercentage2}
		              cy = "25"
		              r = {this.state.pressedTwo? 5:8}
		              stroke = {minimumTrackTintColor}
		              strokeWidth = "2"
		              fill = {maximumTrackTintColor}
              		/>
              	{(currentPercentage2Val > lowerLimPerc && currentPercentage2Val < upperLimPerc) &&<Text 
	    			fill="#fff"
	    			stroke="none"
    				key={currentPercentage2}
			        fontSize="20"
			        fontWeight="bold"
			        x= {currentPercentage2}
			        y="55"
			        textAnchor="middle">
			        {this.state.value[1].toFixed((this.state.value[1]*10%10 == 0? 0:1))}
			    </Text>}
		      </Svg>
		    </View>
	    )
	}
}
