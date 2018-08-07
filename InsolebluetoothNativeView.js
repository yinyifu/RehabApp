//  Created by react-native-create-bridge

import React, { Component } from 'react'
import { requireNativeComponent } from 'react-native'
import PropTypes from "prop-types"

const Insolebluetooth = requireNativeComponent('RNTBlue', InsolebluetoothView)

export default class InsolebluetoothView extends Component {

  render () {
    return <Insolebluetooth {...this.props} style={{flex: 1}} />
  }
}

InsolebluetoothView.propTypes = {
  exampleProp: PropTypes.any
}
