import React, { Component } from 'react';
import PropTypes from "prop-types"

import { View, PanResponder, Dimensions, StyleSheet } from 'react-native';
import Svg,{ Circle, G, Line, Text, Rect } from 'react-native-svg';

const ViewPropTypes = require('react-native').ViewPropTypes || View.propTypes;


export default class SliderBody extends Component {
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
	    //customMarker: PropTypes.func,
	    // Custom Floating Label displaying value
	    minimumValue: PropTypes.number,
	    // Max value for slider
	    maximumValue: PropTypes.number,
	    // Color left side of slider handle
	    minimumTrackTintColor: PropTypes.string,
	    // Color right side of slider handle
	    maximumTrackTintColor: PropTypes.string,
	    step: PropTypes.number,
	    hideLabel: PropTypes.bool
  	};
  	static defaultProps = {
//  		customMarker: defaultMarker,
  		minimumTrackTintColor: '#ddd',
  		maximumTrackTintColor: '#005bbb',
  		hideLabel: false
  	};
  	shouldComponentUpdate(){
  		return true;
  	}
  	constructor(props) {
	    super(props);
	    this.state = {
	      value: this.props.value,
	      pressed: false
	    };
	    this.shouldSetState = true;
  	}
  	componentDidUpdate(){
  		this.shouldSetState = true;
  	}
    componentWillMount() {
    	
    	const start = () => {
    		this.start = this.state.value;
    		this.setState({pressed: true});
    		this.props.onSlidingStart();
  	    }
  	    const end= ({dx, dy}) => {
  		    this.setState({pressed: false});
  		    this.props.onSlidingComplete(this.state.value);
  	    }
	  	const move=(state) => {
	  		const {moveX} = state;
	  		const {maximumValue, minimumValue, step, onValueChange, } = this.props;
	  		const modifiedDx = (maximumValue - minimumValue)/(this.width*0.9) * state.dx;
	  		
  			let valueRaw = this.start+modifiedDx;
  			value2 = Math.round(valueRaw/step);
  			value = value2*step;
  			if(value < minimumValue){
  				value = minimumValue;
  			}
  			if(value > maximumValue){
  				value = maximumValue;
  			}
  			if(this.shouldSetState && Math.abs(value - this.state.value) >= this.props.step ){
	  			this.setState({ value: value});
	  			onValueChange(value);
	  			
  				this.shouldSetState = false;

	  		}
	  		
	  	}
	    this._panResponder = PanResponder.create({
	        onStartShouldSetPanResponder: (evt, gestureState) => true,
	        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
	        onMoveShouldSetPanResponder: (evt, gestureState) => true,
	        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
	        onPanResponderGrant: (evt, gestureState) => start(),
	        onPanResponderMove: (evt, gestureState) => move(gestureState),
	        onPanResponderTerminationRequest: (evt, gestureState) => false,
	        onPanResponderRelease: (evt, gestureState) =>end(gestureState),
	        onPanResponderTerminate: (evt, gestureState) =>end(gestureState),
	        onShouldBlockNativeResponder: (evt, gestureState) => true,
	    });
	}

	  componentDidCatch(){
	  	
	  }

  	render() {
  		const { width, height } = Dimensions.get("window");
	    const { value } = this.state;
	    const { hideLabel,minimumValue, maximumValue, style, minimumTrackTintColor, maximumTrackTintColor, step } = this.props;

	    const offset = 5;
	    const radius = 30;
	    const drawEnd = 30;
	    const fontSize = 20;

	    const currentPercentageVal = (((value-minimumValue)/(maximumValue-minimumValue))*(100-offset*2)+offset)
	    const currentPercentage = currentPercentageVal+"%";
	    const TagPercentage = (((value-minimumValue)/(maximumValue-minimumValue))*(100-offset*2)+offset)-radius/this.width*100+"%";
	    return (
	    	// view containing whole
	    	<View style={style} onLayout={(event) => {
				  this.width = event.nativeEvent.layout.width;
				}} >
				// view of circle bubble
			     {this.state.pressed && <View style={[StyleSheet.absoluteFill, {top:-radius*2, width: radius*2, height: radius*2, left:(TagPercentage)}]}>
			      	<Svg height = "100%" width = "100%">
				      	<Circle 
				      		cx = "50%"
				      		cy = "50%"
				            r = {radius}
				            fill = "#005bbb">
			      		</Circle>

			      		<Text 
			      			fontSize={fontSize}
					        fontWeight="bold"
					        x= "50%"
					        y= {radius+fontSize/4}
					        fill="#fff"
					        textAnchor="middle" >
			      			{this.state.value.toFixed(1)}
			      		</Text>
			      	</Svg>
			    </View>}
			    
	    		<Svg height = "60" width = "100%">

              	<Line
              		x1={(offset)+"%"}
        			y1="25"
        			x2={currentPercentage}
        			y2="25"
        			stroke={minimumTrackTintColor}
        			strokeWidth = "2"
              	/>

	            <Line
	            	x1={currentPercentage}
        			y1="25"
        			x2={(100-offset)+"%"}
        			y2="25"
        			stroke={maximumTrackTintColor}
        			strokeWidth = "2"
	            />
	    		
	    		{(!hideLabel&& currentPercentageVal > 10 && currentPercentageVal < 90) &&<Text 
	    			fill="#fff"
	    			stroke="none"
    				key={currentPercentage}
			        fontSize="20"
			        fontWeight="bold"
			        x= {currentPercentage}
			        y="55"
			        textAnchor="middle">
			        {this.state.value.toFixed(0)}
			    </Text>}

	            <Rect  {...this._panResponder.panHandlers}
	        	  x = {0}
	              y = {0}
	              width = "100%"
	              height = "100%"
	              fill = "#0000"
              	/>

              	<Circle
	        	  cx = {currentPercentage}
	              cy = "25"
	              r = {this.state.pressed? 5:8}
	              stroke = {maximumTrackTintColor}
	              strokeWidth = "2"
	              fill = {minimumTrackTintColor}
          		/>

		      </Svg>
		    </View>
	    )
	}
}
