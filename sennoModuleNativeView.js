//  Created by react-native-create-bridge

import React, { Component } from 'react'
import { requireNativeComponent } from 'react-native'
import PropTypes from "prop-types"

const sennoModule = requireNativeComponent('sennoModule', sennoModuleView)

export default class sennoModuleView extends Component {
  render () {
    return <sennoModule {...this.props} />
  }
}

sennoModuleView.propTypes = {
  exampleProp: PropTypes.any
}
