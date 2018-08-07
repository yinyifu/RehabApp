import * as React from 'react'; 
import { AreaChart, Grid, BarChart, LineChart, XAxis,YAxis, PieChart} from 'react-native-svg-charts';     
import { View, StyleSheet, ScrollView ,SectionList,Text, AsyncStorage } from 'react-native';
import {Text as Tex} from 'react-native-svg';
import * as shape from 'd3-shape';

export default class HistoricalPage extends React.Component{
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        
        return {
          headerTitle: "Historical",
          headerLeft: (<View/>)
        };
    };

    render(){
        const data = [ 0.03, 0.11, 0.12, 0.10, 0.05, 0.04, 0.06]
        const data1 = data
            .map((value) => ({ value }))
        
        

        const datav = [ 0.75, 0.81, 0.64, 0.73, 0.81, 0.82, 0.85]
        const data3 = datav
            .map((value) => ({ value }))
        const fontStyle = { fontSize: 10, fill: '#005bbb' };
        const barData2 = [
            {
                data: data3,
                svg: {
                    fill: '#005bbb',
                },
            }
        ]
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
                    {value}
                </Tex>
            ))
        );
        const LabelsPercentage = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => (
                <Tex
                    key={ x(index)+index }
                    x={ (x(index) + (bandwidth / 2)) }
                    y={ y(value) - 10 }
                    fontSize="14"
                    fill='#005bbb'
                    alignmentBaseline='middle'
                    textAnchor='middle' >
                    {value+"%"}
                </Tex>
            ))
        );
//
        return( 
            <ScrollView style={{backgroundColor:"#005bbb", padding: 20}}>

                <Text style={styles.titleText}>Historical Average Symmetry</Text>
                <View style={[ styles.container, { backgroundColor: '#fff', height: 240, padding: 0 } ]} >
                    <BarChart
                        style={ styles.chart }
                        data={ data }
                        svg={{ fill: '#005bbbff' }}
                        spacingInner={0.5}
                        curve={ shape.curveBasis }
                        gridMin={0}
                        gridMax={0.15}
                        contentInset={{ left: 20, right: 20, top: 10 }}>
                        <Grid/>
                        <LabelsPercentage/>
                    </BarChart>
                    <XAxis
                        style={{ marginHorizontal: 0, height: 30, paddingTop: 10 }}
                        data={data}
                        formatLabel={(value, index) => "May "+(index+1)}
                        contentInset={{ left: 35, right: 35 }}
                        svg={fontStyle}
                    />
                </View>
                <Text style={styles.titleText}>Historical Average Sync Index</Text>
                <View style={[ styles.container, { backgroundColor: '#fff', height: 260, padding: 0} ]} >
                    
                    <BarChart
                        style={ styles.chart }
                        data={ datav.map((v)=>(v*100)) }
                        svg={{ fill: '#005bbbff' }}
                        spacingInner={0.5}
                        curve={ shape.curveBasis }
                        gridMin={0}
                        gridMax={100}
                        contentInset={{ left: 20, right: 20, top: 10 }}
                        >
                        <Grid/>
                        <LabelsPercentage/>
                    </BarChart>
//
                    <XAxis
                        style={{ marginHorizontal: 0, height: 30, paddingTop: 10 }}
                        data={datav.map((v)=>(v*100))}
                        formatLabel={(value, index) => "May "+(index+1)}
                        contentInset={{ left: 35, right: 35, top: 10 }}
                        svg={fontStyle}
                    />
                </View>
            
          </ScrollView>);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    chart:{
        flex: 1,
    },
    titleText:{
        fontSize: 25, color:"#ffffff", paddingTop: 10
    },
})