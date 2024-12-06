import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [message, setMessage] = useState('Presiona para grabar');

    const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            setMessage('Grabando...');
        } catch (err) {
            console.error('Error al iniciar la grabación', err);
        }
    };

    const stopRecording = async () => {
        setMessage('Procesando grabación...');
        recording?.stopAndUnloadAsync();
        const uri = recording?.getURI();
        const { sound } = await recording?.createNewLoadedSoundAsync();
        setSound(sound);
        setRecording(null);
        setMessage('Grabación lista para reproducir');
        console.log('Grabación guardada en:', uri);
    };

    const playSound = async () => {
        try {
            await sound?.replayAsync();
        } catch (err) {
            console.error('Error al reproducir', err);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttonContainer}>
                {!recording ? (
                    <Button title="Iniciar Grabación" onPress={startRecording} color="#4CAF50" />
                ) : (
                    <Button title="Detener Grabación" onPress={stopRecording} color="#F44336" />
                )}
            </View>
            {sound && (
                <View style={styles.buttonContainer}>
                    <Button title="Reproducir Grabación" onPress={playSound} color="#2196F3" />
                </View>
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
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    buttonContainer: {
        width: '80%',
        marginVertical: 10, // Separación entre botones
        borderRadius: 10,
        overflow: 'hidden',
    },
    button: {
        height: 60, // Altura del botón
        justifyContent: 'center',
    },
});
