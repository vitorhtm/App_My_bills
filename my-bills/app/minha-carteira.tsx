import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { styles } from './minha-carteira.css.js';

export default function MinhaCarteira() {

    const [salario, setSalario] = useState("");
    const [reserva, setReserva] = useState("");

    const handleMenuPress = () => {
        router.push('/menu');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerIcon}>$</Text>
                    <Text style={styles.headerTitle}>MyBills</Text>
                </View>
                <TouchableOpacity onPress={handleMenuPress}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>

                <Text style={styles.title}>Minha carteira</Text>

                {/* Inputs */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Salário</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o seu salário"
                        keyboardType="numeric"
                        value={salario}
                        onChangeText={setSalario}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Reserva de emergência</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o saldo da reserva"
                        keyboardType="numeric"
                        value={reserva}
                        onChangeText={setReserva}
                    />
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Salvar carteira</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
}
