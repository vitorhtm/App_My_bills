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
import { useTheme } from './theme-context';
import { styles } from './minhas-dividas.css.js'; // reutiliza o CSS da tela de dívidas

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
        }
    }, [wallet]);

    const handleMenuPress = () => {
        router.push('/menu');
    };

    const salarioNum = Number(salario.replace(",", ".")) || 0;
    const reservaNum = Number(reserva.replace(",", ".")) || 0;
    const total = salarioNum + reservaNum;

    const categoryStyles = {
        salario: {
            label: "Salário",
            color: "#4CAF50",
            icon: "💰",
            bgLight: "#F0FFF4",
            bgDark: "#1F2D1F"
        },
        reserva: {
            label: "Reserva",
            color: "#FFC107",
            icon: "🏦",
            bgLight: "#FFFBEA",
            bgDark: "#2D2A1F"
        }
    };

    const data = [
        ...(salarioNum > 0 ? [{ value: salarioNum, color: categoryStyles.salario.color, text: "Salário" }] : []),
        ...(reservaNum > 0 ? [{ value: reservaNum, color: categoryStyles.reserva.color, text: "Reserva" }] : []),
    ];

    const handleSave = async () => {
        const sanitize = (v: string) => parseFloat(v.replace(",", ".").replace(/[^0-9.]/g, "")) || 0;

        const sal = sanitize(salario);
        const res = sanitize(reserva);

        if (sal === 0 && res === 0) {
            Alert.alert("Atenção", "Digite pelo menos um valor.");
            return;
        }

        try {
            await updateWallet({
                salary: sal,
                emergencyReserve: res,
            });
            Alert.alert("Sucesso", "Carteira salva!");
        } catch {
            Alert.alert("Erro", "Não foi possível salvar.");
        }
    };

    return (
        <SafeAreaView
            edges={['top', 'bottom']}
            style={[
                styles.container,
                { backgroundColor: isDark ? '#121212' : '#F5F7FA' }
            ]}
        >
            {/* Header */}
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
                style={[
                    styles.content,
                    { backgroundColor: isDark ? '#121212' : '#F5F7FA' }
                ]}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.title, { color: isDark ? '#fff' : '#1A1A1A' }]}>
                    Minha carteira
                </Text>

                {/* Card SALÁRIO */}
                <View style={{
                    backgroundColor: isDark ? categoryStyles.salario.bgDark : categoryStyles.salario.bgLight,
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: salario ? 2 : 1,
                    borderColor: salario ? categoryStyles.salario.color : (isDark ? '#444' : '#e0e0e0'),
                    marginBottom: 12,
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <View style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: categoryStyles.salario.color,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 12,
                        }}>
                            <Text style={{ fontSize: 18 }}>{categoryStyles.salario.icon}</Text>
                        </View>

                        <Text style={{
                            color: categoryStyles.salario.color,
                            fontWeight: '600',
                            fontSize: 16
                        }}>
                            Salário
                        </Text>
                    </View>

                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: categoryStyles.salario.color,
                            borderRadius: 12,
                            padding: 14,
                            fontSize: 16,
                            backgroundColor: isDark ? '#1E1E1E' : '#fff',
                            color: isDark ? '#fff' : '#000',
                        }}
                        placeholder="Digite o valor"
                        placeholderTextColor={isDark ? '#888' : '#999'}
                        keyboardType="numeric"
                        value={salario}
                        onChangeText={(t) => setSalario(t.replace(/[^0-9,]/g, ""))}
                    />
                </View>

                {/* Card RESERVA */}
                <View style={{
                    backgroundColor: isDark ? categoryStyles.reserva.bgDark : categoryStyles.reserva.bgLight,
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: reserva ? 2 : 1,
                    borderColor: reserva ? categoryStyles.reserva.color : (isDark ? '#444' : '#e0e0e0'),
                    marginBottom: 12,
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <View style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: categoryStyles.reserva.color,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 12,
                        }}>
                            <Text style={{ fontSize: 18 }}>{categoryStyles.reserva.icon}</Text>
                        </View>

                        <Text style={{
                            color: categoryStyles.reserva.color,
                            fontWeight: '600',
                            fontSize: 16
                        }}>
                            Reserva de emergência
                        </Text>
                    </View>

                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: categoryStyles.reserva.color,
                            borderRadius: 12,
                            padding: 14,
                            fontSize: 16,
                            backgroundColor: isDark ? '#1E1E1E' : '#fff',
                            color: isDark ? '#fff' : '#000',
                        }}
                        placeholder="Digite o saldo da reserva"
                        placeholderTextColor={isDark ? '#888' : '#999'}
                        keyboardType="numeric"
                        value={reserva}
                        onChangeText={(t) => setReserva(t.replace(/[^0-9,]/g, ""))}
                    />
                </View>

                {/* Gráfico */}
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
                        <View style={{
                            width: 160,
                            height: 160,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 80,
                            backgroundColor: isDark ? '#2D2D2D' : '#f5f5f5'
                        }}>
                            <Text style={{
                                color: isDark ? '#888' : '#999',
                                fontSize: 14,
                                textAlign: 'center',
                                padding: 20
                            }}>
                                Adicione valores para ver o gráfico
                            </Text>
                        </View>
                    )}

                    {/* Legendas */}
                    <View style={styles.legend}>
                        {salarioNum > 0 && (
                            <View style={styles.legendItem}>
                                <View style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    backgroundColor: categoryStyles.salario.color,
                                    marginRight: 10,
                                }} />
                                <Text style={[
                                    styles.legendText,
                                    { color: isDark ? '#fff' : '#333' }
                                ]}>
                                    💰 Salário ({((salarioNum / total) * 100).toFixed(0)}%)
                                </Text>
                            </View>
                        )}

                        {reservaNum > 0 && (
                            <View style={styles.legendItem}>
                                <View style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    backgroundColor: categoryStyles.reserva.color,
                                    marginRight: 10,
                                }} />
                                <Text style={[
                                    styles.legendText,
                                    { color: isDark ? '#fff' : '#333' }
                                ]}>
                                    🏦 Reserva ({((reservaNum / total) * 100).toFixed(0)}%)
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={[
                styles.footer,
                {
                    backgroundColor: isDark ? '#1E1E1E' : '#fff',
                    borderTopColor: isDark ? '#444' : '#E0E0E0'
                }
            ]}>
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
        </SafeAreaView>
    );
}
