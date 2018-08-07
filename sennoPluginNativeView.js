//  Created by react-native-create-bridge

import React, { Component } from 'react'
import PropTypes from "prop-types"
import { requireNativeComponent } from 'react-native'

const sennoPlugin = requireNativeComponent('sennoPlugin', sennoPluginView)

export default class sennoPluginView extends Component {
  render () {
    return <sennoPlugin {...this.props} />
  }
}

sennoPluginView.propTypes = {
  exampleProp: PropTypes.String
}
