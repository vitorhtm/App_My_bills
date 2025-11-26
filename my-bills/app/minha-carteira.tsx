import { router } from 'expo-router';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '../frontend/hooks/useWallet';
import { styles } from './minha-carteira.css.js';
import { useTheme } from './theme-context';

export default function MinhaCarteira() {
    const { wallet, loading, updateWallet } = useWallet();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [salario, setSalario] = useState("");
    const [reserva, setReserva] = useState("");

    useEffect(() => {
        if (wallet) {
            setSalario(wallet.salary > 0 ? wallet.salary.toString() : "");
            setReserva(wallet.emergencyReserve > 0 ? wallet.emergencyReserve.toString() : "");
        } else {
            // Se não há carteira, deixar campos vazios
            setSalario("");
            setReserva("");
        }
    }, [wallet]);

    const handleMenuPress = () => {
        router.push('/menu');
    };

    const salarioNum = Number(salario.replace(",", ".")) || 0;
    const reservaNum = Number(reserva.replace(",", ".")) || 0;

    const total = salarioNum + reservaNum;

    // Gráfico só mostra dados quando há valores maiores que zero
    const data = [
        ...(salarioNum > 0 ? [{ value: salarioNum, color: '#4CAF50', text: 'Salário' }] : []),
        ...(reservaNum > 0 ? [{ value: reservaNum, color: '#FFC107', text: 'Reserva' }] : []),
    ];



    const handleSave = async () => {
        // Converter valores de forma segura
        const parseValue = (value: string): number => {
            if (!value || value.trim() === '') return 0;
            const cleaned = value.replace(",", ".").replace(/[^0-9.]/g, "");
            if (!cleaned || cleaned === '') return 0;
            const num = parseFloat(cleaned);
            return isNaN(num) || num < 0 ? 0 : num;
        };

        const salaryValue = parseValue(salario);
        const reserveValue = parseValue(reserva);

        if (salaryValue === 0 && reserveValue === 0) {
            Alert.alert('Atenção', 'Digite pelo menos um valor para salvar a carteira.');
            return;
        }

        try {
            await updateWallet({
                salary: salaryValue,
                emergencyReserve: reserveValue,
            });
            Alert.alert('Sucesso', 'Carteira salva com sucesso!');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar a carteira. Tente novamente.');
        }
    };

    if (loading && !wallet) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F7FA' }]}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F7FA' }]}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerIcon}>$</Text>
                    <Text style={[styles.headerTitle, { marginLeft: 10 }]}>MyBills</Text>
                </View>
                <TouchableOpacity onPress={handleMenuPress}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
            </View>

            <ScrollView 
                style={[styles.content, { backgroundColor: isDark ? '#121212' : '#F5F7FA' }]} 
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.title, { color: isDark ? '#fff' : '#1A1A1A' }]}>Minha carteira</Text>

                <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: isDark ? '#B0B0B0' : '#444' }]}>Salário</Text>
                    <TextInput
                        style={[styles.input, {
                            backgroundColor: isDark ? '#1E1E1E' : '#fff',
                            borderColor: isDark ? '#444' : '#DDE3EB',
                            color: isDark ? '#fff' : '#000',
                        }]}
                        placeholder="Digite o seu salário"
                        placeholderTextColor={isDark ? '#888' : '#999'}
                        keyboardType="numeric"
                        value={salario}
                        onChangeText={(text) => setSalario(text.replace(/[^0-9,]/g, ""))}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: isDark ? '#B0B0B0' : '#444' }]}>Reserva de emergência</Text>
                    <TextInput
                        style={[styles.input, {
                            backgroundColor: isDark ? '#1E1E1E' : '#fff',
                            borderColor: isDark ? '#444' : '#DDE3EB',
                            color: isDark ? '#fff' : '#000',
                        }]}
                        placeholder="Digite o saldo da reserva"
                        placeholderTextColor={isDark ? '#888' : '#999'}
                        keyboardType="numeric"
                        value={reserva}
                        onChangeText={(text) => setReserva(text.replace(/[^0-9,]/g, ""))}
                    />
                </View>

                <View style={styles.chartContainer}>
                    {total > 0 ? (
                        <PieChart
                            data={data}
                            donut
                            radius={80}
                            innerRadius={40}
                            textColor={isDark ? '#fff' : 'black'}
                        />
                    ) : (
                        <View style={{ width: 160, height: 160, justifyContent: 'center', alignItems: 'center', borderRadius: 80, backgroundColor: isDark ? '#2D2D2D' : '#f5f5f5' }}>
                            <Text style={{ color: isDark ? '#888' : '#666', fontSize: 14, textAlign: 'center', padding: 20 }}>
                                Adicione valores para ver o gráfico
                            </Text>
                        </View>
                    )}

                    <View style={styles.legend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
                            <Text style={[styles.legendText, { color: isDark ? '#fff' : '#333' }]}>
                                Salário ({total > 0 ? ((salarioNum / total) * 100).toFixed(0) : 0}%)
                            </Text>
                        </View>

                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
                            <Text style={[styles.legendText, { color: isDark ? '#fff' : '#333' }]}>
                                Reserva ({total > 0 ? ((reservaNum / total) * 100).toFixed(0) : 0}%)
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <SafeAreaView edges={['bottom']} style={[styles.footer, { backgroundColor: isDark ? '#1E1E1E' : '#fff', borderTopColor: isDark ? '#444' : '#E0E0E0' }]}>
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
            </SafeAreaView>
        </SafeAreaView>
    );
}
