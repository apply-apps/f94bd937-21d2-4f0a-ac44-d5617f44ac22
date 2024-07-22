// Filename: index.js
// Combined code from all files

import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, Button, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

const API_URL = 'http://apihub.p.appply.xyz:3300/chatgpt';

const FairyTaleGenerator = () => {
    const [hero, setHero] = useState('');
    const [villain, setVillain] = useState('');
    const [plot, setPlot] = useState('');
    const [fairyTale, setFairyTale] = useState('');
    const [loading, setLoading] = useState(false);

    const generateFairyTale = async () => {
        setLoading(true);
        const messages = [
            { role: "system", content: "You are a helpful assistant. Please write a fairy tale." },
            { role: "user", content: `Heroes: ${hero}, Villains: ${villain}, Plot: ${plot}` }
        ];

        try {
            const response = await axios.post(API_URL, {
                messages,
                model: "gpt-4o"
            });
            const { data } = response;
            setFairyTale(data.response);
        } catch (error) {
            console.error(error);
            setFairyTale("Sorry, something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Hero(s)"
                    value={hero}
                    onChangeText={setHero}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Villain(s)"
                    value={villain}
                    onChangeText={setVillain}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Plot"
                    value={plot}
                    onChangeText={setPlot}
                />
                <Button title="Generate Fairy Tale" onPress={generateFairyTale} />
                {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
                {fairyTale && <Text style={styles.fairyTale}>{fairyTale}</Text>}
            </View>
        </ScrollView>
    );
};

const App = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Fairy Tale Generator</Text>
            <FairyTaleGenerator />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    content: {
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    inputContainer: {
        marginVertical: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
    },
    loader: {
        marginVertical: 20,
    },
    fairyTale: {
        marginTop: 20,
        fontSize: 16,
        color: '#333',
    },
});

export default App;