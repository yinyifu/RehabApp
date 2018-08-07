
<G key={perc} >
	    			<Line
	    				x1= {perc}
	    				y1= "24"
	    				x2= {perc}
	    				y2= "30"
	    				stroke={ ()=>{this.getColor(text)} }
	    				strokeWidth = "2"
	    				/>
<Text key={perc}
	    			fill={labelTextColor}
	    			stroke="none"
			        fontSize="20"
			        fontWeight="bold"
			        x= {perc}
			        y="55"
			        textAnchor={(i==0) ? 'start' : ( (i==numberOfLabels) ? 'end' : "middle")}>
			        {text}
			    </Text>);



/*
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

*/