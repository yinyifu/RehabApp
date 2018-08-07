import * as React from 'react'; 
import { AreaChart, Grid, BarChart, LineChart, XAxis,YAxis, PieChart} from 'react-native-svg-charts';     
import { View, StyleSheet, ScrollView ,SectionList,Text, AsyncStorage } from 'react-native';
import * as shape from 'd3-shape';

export default class Charts extends React.Component{
    render(){
        const data = [ 5, 4, 4, 2, 1, 5, 4, 5, 7, 8 ];
        const data2 = [ 4, 5, 4, 3, 3, 2, 3, 5, 8, 7 ];
        const aim = [ 4, 4, 4, 2, 2, 2, 9, 9, 9, 9 ];


        const symmetry = [ 2, 1, 1, 0, -1, -1, -1, -2, -2, -1 ];

        const varibility = [ 3, 1, 1, 0, 0, 1, 2, 3, 3, 2 ];
        const varibility2 = [2, 1, 2, 1, 0, 2, 2, 3, 4, 3]
        const stepLen = [ 0.64, 0.74, 0.54, 0.64, 0.44, 0.54, 0.57, 0.46, 0.46, 0.50 ];
        const stepLen2 = [ 0.54, 0.64, 0.64, 0.64, 0.44, 0.54, 0.67, 0.56, 0.56, 0.50 ];
        const stepLeAim = [ 0.50, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50 ];

        const randomColor = () => ('#' + (Math.random() * 0xFFFFFF << 0).toString(16) + '000000').slice(0, 7)
        
        const pieData = data.filter(value => value > 0).map((value, index) => ({
            value,
            svg: {
                fill: randomColor(),
                onPress: () => console.log('press', index),
            },
            key: `pie-${index}`,
        }));
        const yAxisInset={top: 0, bottom: 40};
        const xAxisInset={ left: 10, right: 12 };
        const textStyle={ fontSize: 10, fill: '#005bbb' };
        return( 
            <ScrollView style={{backgroundColor:"#005bbb", padding: 20}}>

                <Text style={styles.titleText}>Symmetry</Text>
                <View style={[ styles.container, 0, styles.chartContainer ]} >
                    <YAxis
                        data={symmetry.map((value) => value/10)}
                        style={styles.yAxisStyle}
                        contentInset={yAxisInset}
                        svg={textStyle}
                    />
                    <View style={styles.chartColumn}>
                        
                        <AreaChart
                            style={ styles.chart }
                            data={ symmetry }
                            svg={{ fill: '#005bbb80' }}
                            curve={ shape.curveBasis }
                        />
                        <XAxis
                            style={styles.xAxisStyle}
                            data={symmetry}
                            formatLabel={(value, index) => (index/10*40).toFixed(1)}
                            contentInset={xAxisInset}
                            svg={textStyle}
                        />
                    </View>
                </View>

                <Text style={styles.titleText}>Varibility</Text>
                <View style={[ styles.container, styles.chartContainer ]} >
                    <YAxis
                        data={varibility}
                        
                        style={styles.yAxisStyle}

                        contentInset={yAxisInset}
                        svg={textStyle}
                    />
                    <View style={styles.chartColumn}>
                        
                        <AreaChart
                            style={ styles.chart }
                            data={ varibility }
                            svg={{ stroke: '#ffc72cbb', fill: '#ffc72c55'}}
                            curve={ shape.curveBasis }
                        />
                        <AreaChart
                            style={ [ StyleSheet.absoluteFill,  styles.chart , styles.chartUp] }
                            data={ varibility2 }
                            svg={{ stroke: 'rgba(134, 65, 244, 0.8)', fill: 'rgba(134, 65, 244, 0.2)'}}
                            curve={ shape.curveBasis }
                        />
                        <XAxis
                            style={styles.xAxisStyle}
                            data={varibility}
                            formatLabel={(value, index) => (index/10*40).toFixed(1)}
                            contentInset={xAxisInset}
                            svg={textStyle}
                        />
                    </View>
                </View>

            <Text style={styles.titleText}>Stride Time</Text>
              <View style={[ styles.container,  styles.chartContainer]} >
                    <YAxis
                        data={data.map((value)=>(value/10.0))}
                        style={styles.yAxisStyle}

                        contentInset={yAxisInset}
                        svg={textStyle}
                    />
                    <View style={styles.chartColumn}>
                        <AreaChart
                            style={ styles.chart }
                            data={ data }
                            svg={{ stroke: 'rgba(134, 65, 244, 0.8)', fill: 'rgba(134, 65, 244, 0.2)'}}
                            curve={ shape.curveBasis }>
                            <Grid/>
                        </AreaChart>

                        <AreaChart
                            style={[ StyleSheet.absoluteFill,  styles.chart , styles.chartUp] }
                            data={ data2 }
                            svg={{ stroke: '#ffc72cbb', fill: '#ffc72c55'}}
                            contentInset={ yAxisInset }
                            curve={ shape.curveBasis }
                        />

                        <AreaChart
                            style={[ StyleSheet.absoluteFill,  styles.chart , styles.chartUp] }
                            data={ aim }
                            svg={{ fill: '#005bbb80' }}
                            contentInset={ yAxisInset }
                            curve={ shape.curveBasis }
                        />
                        <XAxis
                            style={styles.xAxisStyle}
                            data={data}
                            formatLabel={(value, index) => (index/10*40).toFixed(1)}
                            contentInset={xAxisInset}
                            svg={textStyle}
                        />
                    </View>
                </View>
                <Text style={styles.titleText}>Step Length</Text>
                <View style={[ styles.container,  styles.chartContainer]} >
                    <YAxis
                        data={stepLen.map((value)=>(value))}
                        style={styles.yAxisStyle}

                        contentInset={yAxisInset}
                        svg={textStyle}
                    />
                    <View style={styles.chartColumn}>
                        <AreaChart
                            style={ styles.chart }
                            data={ stepLen }
                            svg={{ stroke: 'rgba(134, 65, 244, 0.8)', fill: 'rgba(134, 65, 244, 0.2)'}}
                            
                            curve={ shape.curveBasis }
                        >
                            <Grid/>
                        </AreaChart>
                        <AreaChart
                            style={[ StyleSheet.absoluteFill,  styles.chart , styles.chartUp] }
                            data={ stepLen2 }
                            svg={{ stroke: '#ffc72cbb', fill: '#ffc72c55'}}
                            contentInset={ yAxisInset }
                            curve={ shape.curveBasis }
                        />
                        <AreaChart
                            style={[ StyleSheet.absoluteFill, styles.chart , ] }
                            data={ stepLeAim }
                            svg={{ fill: '#005bbb80' }}
                            contentInset={ yAxisInset }
                            curve={ shape.curveBasis }
                        />
                        <XAxis
                            style={styles.xAxisStyle}
                            data={stepLen}
                            formatLabel={(value, index) => (index/10*40).toFixed(1)}
                            contentInset={xAxisInset}
                            svg={textStyle}
                        />

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
        fontSize: 25, color:"#ffffff", paddingTop: 10
    },
    yAxisStyle:{
        width: 33
    },
    xAxisStyle:{
        paddingVertical: 10, 
        height: 40 
    },
    chart:{
        flex: 1,
    },
    chartContainer:{
        backgroundColor: '#fff',
        height: 240, 
        padding: 15, 
        flexDirection: 'row' 
    },
    chartUp:{
        paddingBottom: 40
    },
    chartColumn:{
        flex: 1,
        alignItems: 'stretch',
        flexDirection: 'column',
        justifyContent: 'space-between'
    }
})