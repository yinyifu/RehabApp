export const MAX_EXERCISE_LEN = 120;
export const MIN_EXERCISE_LEN = 5;
export const EXERCISE_STEP = 5;

export const MAX_SPEED = 80;
export const MIN_SPEED = 40;
export const SPEED_STEP = 1;

export const MIN_SHARP = 5;
export const MAX_SHARP = 45;

export const MIN_RANGE = 5;
export const MAX_RANGE = 360;

export const MIN_DIRECTION = -1;
export const MAX_DIRECTION = 1;

export const INSTRUCT_MODE_AUDIO = 0;
export const INSTRUCT_MODE_SPEECH = 1;
export const INSTRUCT_MODE_CHOIR = 2;

export const CORRECTNESS_MODE_AUDIO = 0;
export const CORRECTNESS_MODE_VIBRATION = 1;

export const inDict = {Audio : INSTRUCT_MODE_AUDIO, Speech: INSTRUCT_MODE_SPEECH, Choir: INSTRUCT_MODE_CHOIR};

export function mapTurnToRate(turn){
	return turn/361;
};

export function mapSharpToPitch(sharp){
	return (sharp-MIN_SHARP)/(MAX_SHARP-MIN_SHARP)*1.5+0.5;
}


export const Sound = require('react-native-sound');
Sound.setCategory('Playback');


const male1 = new Sound("male1.wav", Sound.MAIN_BUNDLE, (error) => {if (error) {
    console.log('failed to load the sound', error)}});
const male2 = new Sound("male2.wav", Sound.MAIN_BUNDLE, (error) => {if (error) {
    console.log('failed to load the sound', error)}});
const male3 = new Sound("male3.wav", Sound.MAIN_BUNDLE, (error) => {if (error) {
    console.log('failed to load the sound', error)}});
const male4 = new Sound("male4.wav", Sound.MAIN_BUNDLE, (error) => {if (error) {
    console.log('failed to load the sound', error)}});
const male5 = new Sound("male5.wav", Sound.MAIN_BUNDLE, (error) => {if (error) {
    console.log('failed to load the sound', error)}});
const male6 = new Sound("male6.wav", Sound.MAIN_BUNDLE, (error) => {if (error) {
    console.log('failed to load the sound', error)}});
const male7 = new Sound("male7.wav", Sound.MAIN_BUNDLE, (error) => {if (error) {
    console.log('failed to load the sound', error)}});

const female1 = new Sound("female1.wav", Sound.MAIN_BUNDLE, (error) => {});
const female2 = new Sound("female2.wav", Sound.MAIN_BUNDLE, (error) => {});
const female3 = new Sound("female3.wav", Sound.MAIN_BUNDLE, (error) => {});
const female4 = new Sound("female4.wav", Sound.MAIN_BUNDLE, (error) => {});
const female5 = new Sound("female5.wav", Sound.MAIN_BUNDLE, (error) => {});
const female6 = new Sound("female6.wav", Sound.MAIN_BUNDLE, (error) => {});
const female7 = new Sound("female7.wav", Sound.MAIN_BUNDLE, (error) => {});
export function mapTurnAndSharpToNotes(direction, turn, sharp){
	
	const o = (sharp-MIN_SHARP)/(MAX_SHARP - MIN_SHARP);
	
	if(direction == "left"){
		var result = male1;
		if(o > 0.20){
			result = male2;
		}else if(o > 0.4){
			result = male3;
		}else if(o > 0.6){
			result = male4;
		}else if(o > 0.8){
			result = male5;
		}
		return result;
	}else{
		var result = female1;
		if(o > 0.20){
			result = female2;
		}else if(o > 0.4){
			result = female3;
		}else if(o > 0.6){
			result = female4;
		}else if(o > 0.8){
			result = female5;
		}
		return result;
	}
};







