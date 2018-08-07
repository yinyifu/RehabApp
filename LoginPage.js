import * as React from 'react'; 
import { View, StyleSheet ,Text, TextInput, TouchableOpacity} from 'react-native';

export default class LoginPage extends React.Component{
	constructor(){
		super();
		this.state = {
			username: "",
			password: ""
		}
	}


	render(){
		return(
		<View style={styles.container}>
			<TextInput
		        style={styles.textInput}
		        onChangeText={(text) => this.setState({username: text})}
		        value={this.state.text}
		        multiline = {false}
		        maxLength = {20}
		        placeholder = "Username"
		        placeholderTextColor = "#fff7"
		    />
		    <TextInput
		        style={styles.textInput}
		        onChangeText={(text) => this.setState({password: text})}
		        value={this.state.text}
		        multiline = {false}
		        maxLength = {20}
		        placeholder = "password"
		        placeholderTextColor = "#fff7"
		    />
		    <TouchableOpacity style={styles.loginButton}>
		    	<Text style={styles.buttonText}>
		    	</Text>
		    </TouchableOpacity>
		</View>
		)
	}

}
const styles = StyleSheet.create({
	container:{
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#005bbb'
	},
	textInput:{
		height: 40,
		alignSelf: 'stretch', 
		borderColor: '#fff', 
		borderWidth: 2,
		margin: 10,
		color: '#fff',
		fontWeight: 'bold'
	},
	loginButton:{
		width: 200,
		height: 50,
		backgroundColor: "#2f9fd0",
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonText:{
		color: "#fff",
		fontSize: 15,

	}
});