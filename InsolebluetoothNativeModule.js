//  Created by react-native-create-bridge

import { NativeModules } from 'react-native'

const { Insolebluetooth } = NativeModules

export default {
  exampleMethod () {
    return Insolebluetooth.exampleMethod()
  },

  EXAMPLE_CONSTANT: Insolebluetooth.EXAMPLE_CONSTANT
}
