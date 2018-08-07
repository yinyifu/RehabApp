import * as React from 'react'; 
import { AreaChart, Grid, BarChart, LineChart, XAxis,YAxis} from 'react-native-svg-charts'; 
import { View, StyleSheet, ScrollView ,SectionList, AsyncStorage, Text } from 'react-native';
import {Text as Tex, Line,G, Rect} from "react-native-svg";
import * as shape from 'd3-shape';

export default class FeedbackPage extends React.Component{

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        
        return {
          headerTitle: "Feedback",
          headerLeft: (<View/>)
        };
    };

    render(){
        const rawdata = [ [ 5,4, 4], [2, 1, 4], [2, 3, 3, 3, 4]];
        const aim = [ 4,4,4, 2.5,2.5,2.5, 3,3,3,3,3 ];
        const indexFirst = [true, false,false, true, false, false, true, false, false,false, false];
        const indexToArray = [0,0,0,1,1,1,2,2,2,2, 2];
        const syncIndex = [0.75, 0.63, 0.92];
        const size = 12;
        const symmetry = [ 0.15, 0.11, 0.13, 0.08, 0.17, 0.15,  0.06, 0.06, 0.08,  0.13];

        const randomColor = () => ('#' + (Math.random() * 0xFFFFFF << 0).toString(16) + '000000').slice(0, 7)
        
        const yAxisInset= { top: 0, bottom: 40};
        const xAxisInset= { left: 10, right: 10 };
        const textStyle = { fontSize: 15, fill: '#005bbb' };
        const CUT_OFF = 20
        const Labels = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => (
                <Tex
                    key={ x(index)+index }
                    x={ (x(index) + (bandwidth / 2)) }
                    y={ y(value) - 10 }
                    fontSize="14"
                    fill='#005bbb'
                    alignmentBaseline='middle'
                    textAnchor='middle' >
                    {(value*100).toFixed(0)+"%"}
                </Tex>
            ))
        );

        const LineSyncs = ({ x, y, data }) => {
            return data.map((value, index) => (
                <G key={ index }>
                    {indexFirst[index] && <Line
                        x1={x(index)}
                        x2={x(index+rawdata[indexToArray[index]].length)}
                        y1={y(aim[index])}
                        y2={y(aim[index])}
                        strokeWidth={2}
                        stroke={"#005BBB"}
                    />}
                    {indexFirst[index] && <Line
                        x1={x(index)}
                        x2={x(index)}
                        y1={y(aim[index-1])}
                        y2={y(aim[index])}
                        strokeWidth={2}
                        stroke={"#006ccc"}
                        strokeDasharray={[2,2]}
                        strokeDashoffset={5}
                    />}
                    {indexFirst[index] &&
                        <Rect
                            x={x(index)}
                            y={y(aim[index])-10}
                            width={x(index+rawdata[indexToArray[index]].length)-x(index)}
                            height={22}
                            strokeWidth={1.5}
                            fill="none"
                            stroke="#005bbb"
                            strokeDasharray={[5,5]}
                            strokeDashoffset={5}
                        />
                    }
                    {indexFirst[index] &&
                        <Tex
                            key = {x(index)+y(index)}
                            fill="#005bbb"
                            fontSize="20"
                            fontWeight="bold"
                            x= {(x(index+rawdata[indexToArray[index]].length)+x(index))/2}
                            y= {y(aim[index]) - 20}
                            textAnchor="middle"
                        >
                        {Math.round(aim[index]*18)}                   </Tex>
                    }
                    
                </G>
            ))
        };

        return( 
            <ScrollView style={{backgroundColor:"#005bbb", padding: 20}}>

                <Text style={styles.titleText}>Symmetry of gait</Text>
                <View style={[ styles.container, styles.chartContainer ]} >
                    
                    <View style={styles.chartColumn}>
                        
                        <BarChart
                            style={ styles.chart }
                            data={ symmetry.map((v)=>(1-v)-0.05) }
                            svg={{ fill: '#005bbbff' }}
                            spacingInner={0.5}
                            curve={ shape.curveBasis }
                            gridMin={0}
                            gridMax={1.1}
                            contentInset={{left: 10, right: 10}}
                            >
                            <Grid/>
                            <Labels/>
                        </BarChart>
                        <Text style={[StyleSheet.absoluteFill, styles.xAxisCaption]}>
                            Strides
                        </Text>
                        <Text style={[StyleSheet.absoluteFill, styles.yAxisCaption]}>
                            % symmetry
                        </Text>
                        <XAxis
                            style={styles.xAxisStyle}
                            data={symmetry}
                            formatLabel={(value, index) => index+1}
                            contentInset={{ left: 20, right: 21 }}
                            svg={textStyle}
                        />
                    </View>
                </View>

                
            <Text style={styles.titleText}>Gait Sync to GAT cue</Text>
            <View style={[ styles.container,  styles.chartContainer]} >
                    <View style={styles.chartColumn}>
                        <AreaChart
                                style={ styles.chart }
                                data={ rawdata.reduce((acc, cur) => acc.concat(cur)) }
                                svg={{ stroke: '#ff0000', strokeWidth: 3}}
                                curve={ shape.curveBasis }
                                gridMin={2}
                                gridMax={10.5}
                                contentInset={{ left: -2, bottom: -5, right: -2 }} >
                            <Grid direction={Grid.Direction.HORIZONTAL}/>
                            <LineSyncs/>
                        </AreaChart>
                        <Text style={[StyleSheet.absoluteFill, styles.xAxisCaption]}>
                            Time (seconds)
                        </Text>
                        <Text style={[StyleSheet.absoluteFill, styles.yAxisCaption]}>
                            Pace (steps/minute)
                        </Text>
                        <XAxis
                            style={ styles.xAxisStyle }
                            data={ rawdata.reduce((acc, cur) => acc.concat(cur))  }
                            formatLabel={(value, index) => index*2}
                            contentInset={xAxisInset}
                            svg={textStyle}
                        />
                    </View>
                </View>
            <View style={styles.syncRow}>
                <Text style={styles.syncText}>% Sync</Text>
                <View style={styles.syncCol}>
                    <Text style={styles.syncUnderlineText}>Pace 1</Text>
                    <Text style={styles.syncText}>{syncIndex[0]*100}%</Text>
                </View>
                <View style={styles.syncCol}>
                    <Text style={styles.syncUnderlineText}>Pace 2</Text>
                    <Text style={styles.syncText}>{syncIndex[1]*100}%</Text>
                </View>
                <View style={styles.syncCol}>
                    <Text style={styles.syncUnderlineText}>Pace 3</Text>
                    <Text style={styles.syncText}>{syncIndex[2]*100}%</Text>
                </View>
            </View>
          </ScrollView>);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleText:{
        fontSize: 25, color:"#ffffff", paddingTop: 0
    },
    yAxisStyle:{
        width: 33
    },
    xAxisStyle:{
        paddingVertical: 10, 
        height: 40,
        marginBottom: 20,
    },
    chart:{
        flex: 1,
    },
    chartContainer:{
        backgroundColor: '#fff',
        height: 240, 
        padding: 0, 
        flexDirection: 'row',
        marginBottom: 10,
    },
    chartUp:{
        paddingBottom: 30
    },
    yAxisCaption:{
        fontSize: 20, 
        color: "#005bbb",

        textAlign: 'center',
        top: -30,
        left: -100,
        transform: [{ rotate: '-90deg'}],
    },
    xAxisCaption:{
        fontSize: 20, 
        color: "#005bbb", 
        textAlign: 'center',
        top: '85%',
    },
    syncRow:{
        flexDirection: 'row',
        paddingTop: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    syncCol:{
        flex: 1,
        paddingHorizontal: 20,
        flexDirection: 'column'
    },
    syncText:{
        fontSize: 20,
        color:"#ffffff", 
        paddingTop: 0,
    },
    syncUnderlineText:{
        fontSize: 20,
        textDecorationLine: 'underline',
        color:"#ffffff", 
        paddingTop: 0,
        fontWeight: 'bold',
    },
    chartColumn:{
        flex: 1,
        paddingLeft: 30,
        alignItems: 'stretch',
        flexDirection: 'column',
        justifyContent: 'space-between'
    }
})