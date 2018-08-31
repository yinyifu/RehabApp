import React, {Component} from 'react';


const beforeScan = 0;
const scanning = 1;
const scanDone = 2;
const scanSelected = 3;

class ScanView : Component{
   componentDidMount(){
    const blueEmitter = new NativeEventEmitter(NativeModules.ReactNativeEventEmitter);
    const subscription = blueEmitter.addListener( 'DiscInsole', (reminder) => {
        console.log(reminder)
        this.setState({loaded: scanDone});
        let lefts = reminder.filter(v => v.side == "left");
        console.log(lefts)
        let rights = reminder.filter(v => v.side == "right");
        console.log(rights)
        this.setState({curDevicesScanLeft: lefts, curDevicesScanRight: rights});
      }
    );
    const subscription2 = blueEmitter.addListener('DataInsole', (reminder) => {
        console.log(reminder)
      }
    );
  }
/*
  disconnectAllConnectedPeriphrals(){
    let discPheri = this.state.curDevicesScan;
    let elems = Object.keys(discPheri);
    elems.map((id) => {
      if(discPheri[id].connected){
        BleManager.disconnect(id).then(() => {
          console.log(id, "disconnected")
          this.setState({loaded: endOfExercise, curTime: 0, curSpeed: 0, curTimeTable:[], curDevicesScan: {}});
        });
      }
    });
  }*/

/*
  handleStopScan() {
    console.log('Scan is stopped');
    this.setState({ loaded: scanDone });
  }
*/
 constructor(props){
  this.state={
      curDevicesScanLeft: [],
      curDevicesScanRight: [],

      loaded : beforeLoad
  }
 }
  startScanning(){
      this.setState({loaded: scanning});
      RNTBlueManager.discoverInsoles((insoles) => {});
  }


  render(){
    var discPheri = this.state.curDevicesScanLeft;
    let discPheriRight = this.state.curDevicesScanRight;
    const arrayLeft = [];
    for(let i = 0; i < discPheri.length; i++){
      let id = discPheri[i].name;
      arrayLeft.push(
        <TouchableOpacity key={id}
          onPress={() => {
            let val = this.state.curDevicesScanLeft[i].selected;
            if(val == undefined){val = false}
            this.state.curDevicesScanLeft[i].selected = !val;
            let initLeft = discPheri.filter((v) => {v.side == "left" && v.selected});
            let initRight = discPheriRight.filter((v) => {v.side == "right" && v.selected});
            //console.log("init", init);
            if(initLeft.length == 1 && initRight.length == 1){
              this.setState({loaded: scanDone});
              
            }else{
              this.setState({loaded: scanSelected});
            }
            console.log("Right CLicked")
            console.log(initLeft)
            console.log(initRight)
          }}
          style={[styles.buttonInsole, {borderWidth: discPheri[i].selected ? 4 : 2 }]}>
          <Text style={[styles.textInCircle,]}>
            #{id.substring(id.length - 7, id.length)}
          </Text>
          <Text style={[styles.textInCircle]}>
            Signal: {discPheri[i].rssi}
          </Text>
        </TouchableOpacity>
      );
    }

    const arrayRight = [];
    for(let i = 0; i < discPheriRight.length; i++){
      let id = discPheriRight[i].name;
      arrayRight.push(
        <TouchableOpacity key={id}
          onPress={() => {
            let val = this.state.curDevicesScanRight[i].selected;
            if(val == undefined){val = false}
            this.state.curDevicesScanRight[i].selected = !val;
            let initLeft = discPheri.filter((v) => {v.selected});
            let initRight = discPheriRight.filter((v) => {v.side == "right" && v.selected});
            //console.log("init", init);
            if(initLeft.length == 1 && initRight.length == 1){
              this.setState({loaded: scanDone});
            }else{
              this.setState({loaded: scanSelected});
            }
            console.log("Right CLicked")
            console.log(initLeft)
            console.log(initRight)
          }}
          style={[styles.buttonInsole, {borderWidth: discPheriRight[i].selected ? 4 : 2 }]}>
          <Text style={[styles.textInCircle,]}>
            #{id.substring(id.length - 7, id.length)}
          </Text>
          <Text style={[styles.textInCircle]}>
            Signal: {discPheriRight[i].rssi}
          </Text>
        </TouchableOpacity>
      );
    }
    return(
      {(this.state.loaded === beforeScan) &&
        <TouchableOpacity 
        style={[ styles.button]}
        onPress={() => {
          this.startScanning()
        }}>
          <Text style={styles.textInCircle}>Start Scanning</Text> 
        </TouchableOpacity>
      }
      {(this.state.loaded === beforeLoad)&&
        <Text style={{ flex: 1, color:"#fff",
              fontSize: fontSize*2, alignItems: 'center', padding: 20}}>
          Loading
        </Text>
      }
      {(this.state.loaded === scanning) &&
        <View style={[ styles.button]}>
          <Text style={styles.textInCircle}>Scanning...</Text> 
        </View>
      }
      {(this.state.loaded === scanDone || this.state.loaded === scanSelected) &&
        <View style={{flex: 1, flexDirection: "row", margin: 10,marginTop: 40, alignSelf: "stretch"}}>
          
          <View style={{flex: 1, margin: 10, alignSelf: "stretch", justifyContent: "flex-start", alignItems: "center"}}>
            {arrayLeft}
          </View>
          <View style={{flex: 1, margin: 10, alignSelf: "stretch", justifyContent: "flex-start", alignItems: "center"}}>
            {arrayRight}
          </View>
        </View>
      }
      {(this.state.loaded === scanSelected) &&
        <TouchableOpacity style={{width: 180, 
                                  height: 80, 
                                  margin: 10, 
                                  marginBottom: 50,
                                  backgroundColor: "#cccccc"
                                }}
            onPress={() => {
                    let left = this.curDevicesScanLeft.filter((v) => v.selected == true)[0];
                    let right = this.curDevicesScanRight.filter((v) => v.selected == true)[0]
                    RNTBlueManager.connectPair(left.name, right.name, (data) => {});
                    /*console.log(key ,searcha[key]);
                    BleManager.connect(key).then(() => {
                      searcha[key].connected = true;
                      console.log(key ,"connected");
                      setTimeout(() => 
                      BleManager.retrieveServices(key).then((peripheralInfo) => {
                        console.log("peripheralInfo", peripheralInfo);
                        var service = '33000100-121F-3E53-656E-6E6F54656368';
                        BleManager.startNotification(key, service, thirdCharacteristic).then(() => {
                            console.log('Started notification on ' + key);
                        });
                        BleManager.startNotification(key, service, fourthCharacteristic).then(() => {
                            console.log('Started notification on ' + key);
                        });
                        BleManager.startNotification(key, service, fifthCharacteristic).then(() => {
                            console.log('Started notification on ' + key);
                        });
                      }),300);
                    });*/
              this.setState({loaded: playing});
              this.exerciseStart();
            }}
          >
            <Text style={styles.textInCircle}>
              Start Exercise
            </Text>
          </TouchableOpacity>
      }
    }
  });