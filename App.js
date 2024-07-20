/**
 * Dependências:
 * npx expo install expo-camera expo-contacts expo-sensors
 * npx expo install react-native-view-shot
 */
import React, {useState, useRef} from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Modal, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { FontAwesome } from "@expo/vector-icons";

export default function App() {

  /** Para tirar foto */
  const camRef = useRef(null)
  /** Inicia câmera traseira */
  const [facing, setFacing] = useState('back');
  /** Constantes solicita permissão do usuário */
  const [permission, requestPermission] = useCameraPermissions();
  /** Setar o caminho para armazenar a imagem */
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  /** Modifica o open */
  const [open, setOpen] = useState(false)

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Camera permissions are still loading.
  if(!permission){
    return <View/>
  }

  // Camera permissions are not granted yet.
  if(!permission.granted){
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Precisamos da sua permissão para mostrar a câmera</Text>
        <Button onPress={requestPermission} title="Conceder Permissão" />
      </View>
    );
  }

  /** Função captura foto de forma assincrona */
  async function takePicture(){
    if(camRef){
      // Pega o caminho da imagem
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri)
      setOpen(true)
    }
    
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={camRef}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.buttonFlip} 
            onPress={toggleCameraFacing}>
            <FontAwesome 
              name="exchange"
              size={23}
              color="#fff"  
            >
            </FontAwesome>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonCamera}
            onPress={takePicture}
          >
            <FontAwesome
              name="camera"
              size={23}
              color="#fff"
            >
            </FontAwesome>
          </TouchableOpacity>
        </View>
      </CameraView>
      {capturedPhoto && (
      <Modal
        animationType='slide'
        transparent={true}
        visible={open}
        >
          <View
            style={styles.contentModal}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => { setOpen(false) }}
            >
              <FontAwesome
                name='close'
                size={50}
                color="#fff"
              ></FontAwesome>
            </TouchableOpacity>
          
            <Image
              style={styles.imgPhoto}
              source={{ uri: capturedPhoto}}
            ></Image>
          </View>
        </Modal>
      )}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  contentModal:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    margin: 20,
  },
  imgPhoto:{
    width: "100%",
    height: 400,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  buttonFlip: {
    position: "absolute",
    bottom: 20,
    left: 30,
    justifyContent: "center",
    alignContent: "center",
    height: 20,
  },
  closeButton:{
    position: 'absolute',
    top: 10,
    left: 2,
    margin: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonCamera:{
    position: "absolute",
    bottom: 20,
    right: 30,
    justifyContent: "center",
    alignContent: "center",
    height: 20,
  },

});
