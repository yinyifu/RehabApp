import * as React from 'react'; 
import { AreaChart, Grid, BarChart, LineChart, XAxis,YAxis, PieChart} from 'react-native-svg-charts';     
import { View, StyleSheet, ScrollView ,SectionList,Text, AsyncStorage } from 'react-native';
import * as shape from 'd3-shape';

export default class Charts extends React.Component{
    render(){
        


        const data = [ 14, 1, 100, 5, 94, 24, 8]
        const data1 = data
            .map((value) => ({ value }))
        const data2 = [ 24, 28, 93, 77, 42, 62, 52]
            .map((value) => ({ value }))

        const barData = [
            {
                data: data1,
                svg: {
                    fill: 'rgb(134, 65, 244)',
                },
            },
            {
                data: data2,
            },
        ]

        const datav = [ 2, 3, 10, 5, 5, 4, 4]
        const data3 = datav
            .map((value) => ({ value }))
        const data4 = [ 10, 8, 7, 5, 5, 6, 4]
            .map((value) => ({ value }))
        const fontStyle = { fontSize: 10, fill: '#005bbb' };
        const barData2 = [
            {
                data: data3,
                svg: {
                    fill: 'rgb(134, 65, 244)',
                },
            },
            {
                data: data4,
            },
        ]

        return( 
            <ScrollView style={{backgroundColor:"#005bbb", padding: 20}}>

                <Text style={styles.titleText}>Historical Average Stride Time</Text>
                <View style={[ styles.container, { backgroundColor: '#fff', height: 240, padding: 20, flexDirection: 'row' } ]} >
                    <YAxis
                        data={data.map((v)=>v/100)}
                        style={{ marginBottom: 0 }}

                        contentInset={{ top: 10, bottom: 10 }}
                        svg={fontStyle}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        
                        <BarChart
                            style={ { height: 200 } }
                            data={ barData }
                            yAccessor={({ item }) => item.value}
                            svg={{
                                fill: 'green',
                            }}
                            contentInset={ { top: 10, bottom: 10 } }
                            { ...this.props }
                        >
                            <Grid/>
                        </BarChart>
                        <XAxis
                            style={{ marginHorizontal: 0, height: 30 }}
                            data={data}
                            formatLabel={(value, index) => "May "+(index+1)}
                            contentInset={{ left: 20, right: 20 }}
                            svg={fontStyle}
                        />
                    </View>
                </View>
                <Text style={styles.titleText}>Historical Average Varibility</Text>
                <View style={[ styles.container, { backgroundColor: '#fff', height: 260, padding: 20, flexDirection: 'row' } ]} >
                    <YAxis
                        data={datav.map((v)=>v/2)}
                        style={{ marginBottom: 0 }}

                        contentInset={{ top: 10, bottom: 10 }}
                        svg={fontStyle}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        
                        <BarChart
                            style={ { height: 200 } }
                            data={ barData2 }
                            yAccessor={({ item }) => item.value}
                            svg={{
                                fill: 'green',
                            }}
                            contentInset={ { top: 10, bottom: 10 } }
                            { ...this.props }
                        >
                            <Grid/>
                        </BarChart>
                        <XAxis
                            style={{ marginHorizontal: 0, height: 30, paddingTop: 10 }}
                            data={data}
                            formatLabel={(value, index) => "May "+(index+1)}
                            contentInset={{ left: 20, right: 20, top: 10 }}
                            svg={fontStyle}
                        />
                    </View>
                </View>
            <Text style={styles.titleText}>Historical Step Length</Text>
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
})