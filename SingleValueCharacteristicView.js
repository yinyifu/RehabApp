import * as React from 'react';
import {View, Text,StyleSheet} from 'react-native';
import PropTypes from "prop-types";

export default class SingleValueCharacteristicView extends React.Component {

	static propTypes = {
		_newValueIsReceived : PropTypes.object,
	}

	_newValueIsReceived(newValue){
		this.setState({
			ide: this.getIDE(newValue),
			gyro: this.getTripleLet(newValue),
			acc: this.getTripleLet(newValue),
		});
	}

	constructor(props){
		super(props);

		this.state = {
			ide : 0,
			gyro: [],
			acc: []
		}

		this._newValueIsReceived = this._newValueIsReceived.bind(this);
		this.props._newValueIsReceived.addListener("value", this._newValueIsReceived);
		this.getIDE = this.getIDE.bind(this);
	}


	to32Bits(byteArray){
		position = 0;
		console.log("characteristic size", byteArray);
		int32Array = [];
		while(byteArray.length - position >= 4){
			const int32 = byteArray[position] | byteArray[position + 1] << 8 | byteArray[position + 2] << 16 | byteArray[position + 3] << 24;
			int32Array.push(int32);
			position += 4;
		}
		return int32Array;
	}

	getIDE(byteArray){
		const int32 = byteArray[0] | byteArray[1] << 8 | byteArray[2] << 16 | byteArray[3] << 24;
		byteArray.splice(0, 4);
		return int32;
	}

	getTripleLet(byteArray){
		let intX = byteArray[0] | byteArray[1] << 8;
		if ((intX & 0x8000) > 0) {
		   intX = intX - 0x10000;
		}
		let intY = byteArray[2] | byteArray[3] << 8;
		if ((intY & 0x8000) > 0) {
		   intY = intY - 0x10000;
		}
		let intZ = byteArray[4] | byteArray[5] << 8;
		if ((intZ & 0x8000) > 0) {
		   intZ = intZ - 0x10000;
		}
		byteArray.splice(0, 6);
		return [intX, intY, intZ];
	}

	render(){
		return(
			<View style={styles.button}>
				<Text style={{fontSize: 10, color: "#fff"}}>
					Time: {this.state.ide} 
				</Text>
				<Text style={{fontSize: 10, color: "#fff"}}>
					gyro x: {this.state.gyro[0]} y: {this.state.gyro[1]} z: {this.state.gyro[2]}
				</Text>
				<Text style={{fontSize: 10, color: "#fff"}}>
					acc x: {this.state.acc[0]} y: {this.state.acc[1]} z: {this.state.acc[2]}
				</Text>
			</View>
		);
	}


}
const styles = StyleSheet.create({
	button:{
      backgroundColor: '#0000',
      justifyContent: "center", 
      alignItems: "center", 
      marginHorizontal: 5,
      width: 300,
      height: 100,
      borderColor: "#fff" ,
      borderWidth: 2,
      padding: 10,  
      overflow: "hidden",
    }


});