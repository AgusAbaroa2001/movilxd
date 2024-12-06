import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';

export default function App() {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [audioUri, setAudioUri] = useState<string | null>(null);

    const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            Alert.alert('Grabando', 'La grabación ha comenzado.');
        } catch (err) {
            console.error('Error al iniciar la grabación:', err);
        }
    };

    const stopRecording = async () => {
        try {
            await recording?.stopAndUnloadAsync();
            const uri = recording?.getURI();
            setRecording(null);
            setAudioUri(uri);
            Alert.alert('Grabación completa', `Archivo generado en formato .m4a.\nUbicación: ${uri}`);
            console.log('Archivo guardado temporalmente en:', uri);
        } catch (err) {
            console.error('Error al detener la grabación:', err);
        }
    };

    const playRecording = async () => {
        if (!audioUri) {
            Alert.alert('No hay grabación', 'No se encontró ningún archivo para reproducir.');
            return;
        }

        const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
        await sound.playAsync();
        Alert.alert('Reproduciendo', 'El archivo se está reproduciendo.');
    };

    const shareRecording = async () => {
        if (audioUri) {
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(audioUri);
            } else {
                Alert.alert('Compartir no disponible', 'La función de compartir no está disponible en este dispositivo.');
            }
        } else {
            Alert.alert('No hay grabación', 'No se encontró ningún archivo para compartir.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.message}>Grabador de voz</Text>
            <View style={styles.buttonContainer}>
                {!recording ? (
                    <Button title="Iniciar Grabación" onPress={startRecording} color="#4CAF50" />
                ) : (
                    <Button title="Detener Grabación" onPress={stopRecording} color="#F44336" />
                )}
            </View>
            {audioUri && (
                <>
                    <View style={styles.buttonContainer}>
                        <Button title="Reproducir Grabación" onPress={playRecording} color="#2196F3" />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="Descargar/Compartir" onPress={shareRecording} color="#FF9800" />
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    message: {
        fontSize: 20,
        marginBottom: 20,
        color: '#333',
    },
    buttonContainer: {
        marginVertical: 10,
        width: '80%',
    },
});
