import { router } from 'expo-router';
import { useTheme } from './theme-context';


import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { PieChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context'; // ✅ IMPORT CORRETO
import { useWallet } from '../frontend/hooks/useWallet';
import { styles } from './minha-carteira.css.js';

export default function MinhaCarteira() {
    const { wallet, loading, updateWallet } = useWallet();
    const [salario, setSalario] = useState("");
    const [reserva, setReserva] = useState("");

    useEffect(() => {
        if (wallet) {
            setSalario(wallet.salary.toString());
            setReserva(wallet.emergencyReserve.toString());
        }
    }, [wallet]);

    const handleMenuPress = () => {
        router.push('/menu');
    };

    const salarioNum = Number(salario.replace(",", ".")) || 0;
    const reservaNum = Number(reserva.replace(",", ".")) || 0;

    const total = salarioNum + reservaNum;

    const data = [
        { value: salarioNum, color: '#4CAF50', text: 'Salário' },
        { value: reservaNum, color: '#FFC107', text: 'Reserva' },
    ];

    const { theme } = useTheme();

    const isDark = theme === 'dark';


    const handleSave = async () => {
        const salaryValue = parseFloat(salario) || 0;
        const reserveValue = parseFloat(reserva) || 0;

        if (salaryValue < 0 || reserveValue < 0) {
            Alert.alert('Erro', 'Os valores não podem ser negativos');
            return;
        }

        try {
            await updateWallet({
                salary: salaryValue,
                emergencyReserve: reserveValue,
            });
            Alert.alert('Sucesso', 'Carteira salva com sucesso!');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar a carteira');
        }
    };

    if (loading && !wallet) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            {/* 🔥 Agora o conteúdo não fica atrás do notch */}

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

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Salário</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o seu salário"
                        keyboardType="numeric"
                        value={salario}
                        onChangeText={(text) => setSalario(text.replace(/[^0-9,]/g, ""))}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Reserva de emergência</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o saldo da reserva"
                        keyboardType="numeric"
                        value={reserva}
                        onChangeText={(text) => setReserva(text.replace(/[^0-9,]/g, ""))}
                    />
                </View>
            </ScrollView>

            <View style={styles.chartContainer}>

                <PieChart
                    data={data}
                    donut
                    radius={80}
                    innerRadius={40}
                    textColor="black"
                />

                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
                        <Text style={styles.legendText}>
                            Salário ({total > 0 ? ((salarioNum / total) * 100).toFixed(0) : 0}%)
                        </Text>
                    </View>

                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
                        <Text style={styles.legendText}>
                            Reserva ({total > 0 ? ((reservaNum / total) * 100).toFixed(0) : 0}%)
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[styles.saveButton, loading && { opacity: 0.6 }]} 
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Salvar carteira</Text>
                    )}
                </TouchableOpacity>
            </View>
            <SafeAreaView style={[
                styles.container,
                { backgroundColor: isDark ? '#121212' : '#F5F7FA' }
            ]}>
                
            </SafeAreaView>
        </SafeAreaView>
    );
}
