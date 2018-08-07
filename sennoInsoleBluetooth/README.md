
# react-native-senno-insole-bluetooth

## Getting started

`$ npm install react-native-senno-insole-bluetooth --save`

### Mostly automatic installation

`$ react-native link react-native-senno-insole-bluetooth`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-senno-insole-bluetooth` and add `RNSennoInsoleBluetooth.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNSennoInsoleBluetooth.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNSennoInsoleBluetoothPackage;` to the imports at the top of the file
  - Add `new RNSennoInsoleBluetoothPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-senno-insole-bluetooth'
  	project(':react-native-senno-insole-bluetooth').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-senno-insole-bluetooth/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-senno-insole-bluetooth')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNSennoInsoleBluetooth.sln` in `node_modules/react-native-senno-insole-bluetooth/windows/RNSennoInsoleBluetooth.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Senno.Insole.Bluetooth.RNSennoInsoleBluetooth;` to the usings at the top of the file
  - Add `new RNSennoInsoleBluetoothPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNSennoInsoleBluetooth from 'react-native-senno-insole-bluetooth';

// TODO: What to do with the module?
RNSennoInsoleBluetooth;
```
  