using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Senno.Insole.Bluetooth.RNSennoInsoleBluetooth
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNSennoInsoleBluetoothModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNSennoInsoleBluetoothModule"/>.
        /// </summary>
        internal RNSennoInsoleBluetoothModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNSennoInsoleBluetooth";
            }
        }
    }
}
