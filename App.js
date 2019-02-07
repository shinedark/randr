import { View as GraphicsView } from 'expo-graphics';
import ExpoTHREE, { THREE } from 'expo-three';
import React from 'react';
import {  Audio, Asset} from 'expo';


function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}


export default class App extends React.Component {
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
    await this.playBackgroundMusicAsync();
    await this._loadAssetsAsync();
  }

  playBackgroundMusicAsync = async () => {
    const soundObject = new Expo.Audio.Sound();
    try {
      await soundObject.loadAsync(require('./assets/audio/wuuu.wav'));
      await soundObject.playAsync();
      await soundObject.setStatusAsync({
        shouldPlay: true,
        isLooping: true,
        volume: 1,
      });
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  }

  render() {
    // Create an `ExpoGraphics.View` covering the whole screen, tell it to call our
    // `onContextCreate` function once it's initialized.
    return (
      <GraphicsView
        onContextCreate={this.onContextCreate}
        onRender={this.onRender}
      />
    );
  }

  async _loadAssetsAsync() {
      const imageAssets = cacheImages([
          
          require('./assets/videos/giphy.gif'),
          require('./assets/audio/wuuu.wav'),
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
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;
    
    const texture = await ExpoTHREE.loadAsync(require('./assets/videos/giphy.gif'));
      texture.needsupdate = true;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    const material = new THREE.MeshPhongMaterial({
      map: texture
    });

    const flakeGeometry = new THREE.BoxGeometry( 0.3, 0.3, 0.3 );
    const flakeMaterial = new THREE.MeshPhongMaterial({map:texture});
    const flakeCount = 9000;
    const snow = new THREE.Group();
    for (let i = 0; i < flakeCount; i++) {
      const flakeMesh = new THREE.Mesh(flakeGeometry, flakeMaterial);
      flakeMesh.position.set(
        (Math.random() + 0.190) * 9,
        (Math.random() - 0.160) * 10,
        (Math.random() - 0.190) * 30
      );
      snow.add(flakeMesh);
    }

    // this.scene.add(snow);
    
    this.cube = snow;
    flakeArray = this.cube.children;
    this.scene.add(this.cube);
    

    this.scene.add(new THREE.AmbientLight(0x404040));

    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(3, 3, 3);
    this.scene.add(light);
  };

  onRender = delta => {
    for (i = 0; i < flakeArray.length / 2; i++) {
       flakeArray[i].rotation.y += 0.01;
       flakeArray[i].rotation.x += 0.02;
       flakeArray[i].rotation.z += 0.03;
       flakeArray[i].position.y -= 1;
       if (flakeArray[i].position.y < -6) {
         flakeArray[i].position.y += 100;
       }
     }
     for (i = flakeArray.length / 2; i < flakeArray.length; i++) {
       flakeArray[i].rotation.y -= 0.02;
       flakeArray[i].rotation.x -= 0.03;
       flakeArray[i].rotation.z -= 0.02;
       flakeArray[i].position.y -= 0.1;
       if (flakeArray[i].position.y < -6) {
         flakeArray[i].position.y += 35;
       }

       this.cube.rotation.y -= 0.000009;
     }
    // this.cube.rotation.x += 1.5 * delta;
    // this.cube.rotation.y += 1 * delta;
    this.renderer.render(this.scene, this.camera);
  };
}
