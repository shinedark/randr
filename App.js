import { View as GraphicsView } from 'expo-graphics';
import ExpoTHREE, { THREE } from 'expo-three';
import React from 'react';
import {TouchableOpacity, View, Dimensions} from 'react-native';
import {  Audio, Asset, Video} from 'expo';


function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;

export default class App extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        animations: false
    };
  }

  componentWillMount() {
    THREE.suppressExpoWarnings();
  }

  async componentDidMount() {
    Expo.Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Expo.Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Expo.Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
    
    this.handlePLay1();
    await this._loadAssetsAsync();
  }


  handlePLay1 = async () => {
      const soundObject = new Expo.Audio.Sound();
        try {
          await soundObject.loadAsync(require('./assets/audio/intro.mp3'));
          this.audioPlayer1  = soundObject;
            this.audioPlayer1.setIsLoopingAsync(true);
            this.audioPlayer1.setPositionAsync(0);
            this.audioPlayer1.setVolumeAsync(0.2);
            this.audioPlayer1.playAsync();
            
          
          
         // Your sound is playing!
        } catch (error) {
        // An error occurred!
          
        } 
  }


  stopMusic1 = async () => {
    this.audioPlayer1.stopAsync();

  }

  handlePLay2 = async () => {
      const soundObject = new Expo.Audio.Sound();
        try {
          await soundObject.loadAsync(require('./assets/audio/main.mp3'));
          this.audioPlayer2  = soundObject;
            this.audioPlayer2.setIsLoopingAsync(true);
            this.audioPlayer2.setPositionAsync(0);
            this.audioPlayer2.setVolumeAsync(1);
            this.audioPlayer2.playAsync();
            
          
          
         // Your sound is playing!
        } catch (error) {
        // An error occurred!
          
        } 
  }


  stopMusic2 = async () => {
    this.audioPlayer2.stopAsync();

  }

  pressBoom = async () =>{
    if (!this.state.animations) {
      
      this.setState({animations: true});
      this.handlePLay2();
      this.stopMusic1();
      
      
    } else {
      this.setState({animations: false});
      this.stopMusic2();
      this.handlePLay1();
      
    }
  }

  animation =  () => {
    if (!this.state.animations) {
      this.onRender();
    }
    else{
      this.onPress();
    }
  }

  render() {
    // Create an `ExpoGraphics.View` covering the whole screen, tell it to call our
    // `onContextCreate` function once it's initialized.
    return (
      <TouchableOpacity style={{flex: 1}} onPress={this.pressBoom}>
      <GraphicsView
        onContextCreate={this.onContextCreate}
        onRender={this.animation}
      />
      </TouchableOpacity>
    );
  }

  async _loadAssetsAsync() {
      const imageAssets = cacheImages([
          
          require('./assets/icon.png'),
          require('./assets/audio/intro.mp3'),
          require('./assets/audio/main.mp3'),
      ]);

      await Promise.all([... imageAssets]);
  }
  // This is called by the `ExpoGraphics.View` once it's initialized
  onContextCreate = async ({
    gl,
    canvas,
    width,
    height,
    scale: pixelRatio,
  }) => {
    this.renderer = new ExpoTHREE.Renderer({ gl, pixelRatio, width, height });
    this.renderer.setClearColor(0xffffff)
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, deviceWidth / deviceHeight, 0.1, 1000);
    this.camera.position.z = 6;
    
    const texture = await ExpoTHREE.loadAsync(require('./assets/icon.png'));
      texture.needsupdate = true;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter
      

    const texture2 = await ExpoTHREE.loadAsync(require('./assets/giphy.gif'));
      texture2.needsupdate = true;
      texture2.minFilter = THREE.LinearFilter;
      texture2.magFilter = THREE.LinearFilter

    const flakeGeometry = new THREE.SphereGeometry( 0.10, 32, 32, 6, 6.3);
    const flakeGeometry2 = new THREE.TorusBufferGeometry( 1, 0.3, 30, 600, 6.3);
    const flakeMaterial2 = new THREE.MeshPhongMaterial({map:texture2});

    const flakeMaterial = new THREE.MeshPhongMaterial({map:texture});
    flakeMaterial.map.needsUpdate = true;
    const flakeCount = 9000;
    const snow = new THREE.Group();
    for (let i = 0; i < flakeCount; i++) {
      const flakeMesh = new THREE.Mesh(flakeGeometry, flakeMaterial);
      flakeMesh.position.set(
        (Math.random() - 0.190) * 90,
        (Math.random() - 0.16) * 10,
        (Math.random() + 0.990) * 3
      );
      snow.add(flakeMesh);
    }
    const flakeCount2 = 90;
    const snow2 = new THREE.Group();
    for (let i = 0; i < flakeCount2; i++) {
      const flakeMesh2 = new THREE.Mesh(flakeGeometry2, flakeMaterial2);
      flakeMesh2.transparent = true;
      flakeMesh2.side = THREE.DoubleSide;
      flakeMesh2.position.set(
        z = 0.6,
        y = 0.10,
        x = 0.33
      );
      snow2.add(flakeMesh2);
    }

    

    this.cube2 = snow2;
    this.cube = snow;
    flakeArray = this.cube.children;
    flakeArray2 = this.cube2.children;
    this.scene.add(this.cube, this.cube2);
    

    this.scene.add(new THREE.AmbientLight(0x404040));

    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(3, 3, 3);
    this.scene.add(light);
  };


  onPress = delta => {
    for (i = 0; i < flakeArray2.length / 2; i++) {
       flakeArray2[i].rotation.y += 0.01;
       flakeArray2[i].rotation.x += 0.02;
       flakeArray2[i].rotation.z += 0.03;
       flakeArray2[i].position.y -= 1;
       if (flakeArray2[i].position.y < -9) {
         flakeArray2[i].position.y += 10;
       }
     }
     for (i = flakeArray.length / 2; i < flakeArray.length; i++) {
       flakeArray[i].rotation.y -= 0.02;
       flakeArray[i].rotation.x -= 0.03;
       flakeArray[i].rotation.z -= 0.02;
       flakeArray[i].position.y -= 0.1;
       if (flakeArray[i].position.y < -6) {
         flakeArray[i].position.y += 5;
       }

       this.cube.rotation.y += 0.000009;
       
     }
     this.renderer.render(this.scene, this.camera);
  };

  onRender = delta => {

    this.cube.rotation.x += 0.00009;
    this.cube.rotation.y -= 0.00003;
    this.renderer.render(this.scene, this.camera);
  };
}
