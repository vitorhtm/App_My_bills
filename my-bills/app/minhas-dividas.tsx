import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTheme } from './theme-context';

import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { PieChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context'; // ✅ IMPORT CORRETO
import { styles } from './minhas-dividas.css.js';

export default function MinhaCarteira() {

    const [lazer, setLazer] = useState("");
    const [casa, setCasa] = useState("");
    const [estudos, setEstudos] = useState("");
    const [transporte, setTransporte] = useState("");

    const handleMenuPress = () => {
        router.push('/menu');
    };

    const lazerNum = Number(lazer.replace(",", ".")) || 0;
    const casaNum = Number(casa.replace(",", ".")) || 0;
    const estudosNum = Number(estudos.replace(",", ".")) || 0;
    const transporteNum = Number(transporte.replace(",", ".")) || 0;

    const total = lazerNum + casaNum + estudosNum + transporteNum;

    const data = [
        { value: lazerNum, color: '#af4c4cff', text: 'Lazer' },
        { value: casaNum, color: '#0b07ffff', text: 'Casa' },
        { value: estudosNum, color: '#4CAF50', text: 'Estudos' },
        { value: transporteNum, color: '#FFC107', text: 'Transporte' },
    ];

    const { theme } = useTheme();

    const isDark = theme === 'dark';

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            {/* 🔥 Agora o conteúdo não fica atrás do notch */}

            {/* Header */}
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
                {/* Título */}
                <Text style={styles.title}>Minhas dívidas</Text>

                {/* Inputs */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Lazer</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o seu gasto com lazer"
                        keyboardType="numeric"
                        value={lazer}
                        onChangeText={(text) => setLazer(text.replace(/[^0-9,]/g, ""))}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Casa</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o seu gasto com casa"
                        keyboardType="numeric"
                        value={casa}
                        onChangeText={(text) => setCasa(text.replace(/[^0-9,]/g, ""))}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Estudos</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o seu gasto com estudos"
                        keyboardType="numeric"
                        value={estudos}
                        onChangeText={(text) => setEstudos(text.replace(/[^0-9,]/g, ""))}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Transporte</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o seu gasto com transporte"
                        keyboardType="numeric"
                        value={transporte}
                        onChangeText={(text) => setTransporte(text.replace(/[^0-9,]/g, ""))}
                    />
                </View>

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
                            <View style={[styles.legendColor, { backgroundColor: '#e91f18ff' }]} />
                            <Text style={styles.legendText}>
                                Lazer ({total > 0 ? ((lazerNum / total) * 100).toFixed(0) : 0}%)
                            </Text>
                        </View>

                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#0b07ffff' }]} />
                            <Text style={styles.legendText}>
                                Casa ({total > 0 ? ((casaNum / total) * 100).toFixed(0) : 0}%)
                            </Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
                            <Text style={styles.legendText}>
                                Estudos ({total > 0 ? ((estudosNum / total) * 100).toFixed(0) : 0}%)
                            </Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
                            <Text style={styles.legendText}>
                                Transporte ({total > 0 ? ((transporteNum / total) * 100).toFixed(0) : 0}%)
                            </Text>
                        </View>
                    </View>
                </View>

            </ScrollView>

            {/* Botão Salvar */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Salvar despesa</Text>
                </TouchableOpacity>
            </View>      <SafeAreaView style={[
                styles.container,
                { backgroundColor: isDark ? '#121212' : '#F5F7FA' }
            ]}>

            </SafeAreaView>

        </SafeAreaView>
    );
}

