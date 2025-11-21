import { router } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { styles } from './minhas-dividas.css.js';

export default function MinhasDividas() {
    const handleMenuPress = () => {
        router.push('/menu');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* <StatusBar style="light" /> */}

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
                    <TextInput style={styles.input} placeholder="Digite o seu gasto com lazer" />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Casa</Text>
                    <TextInput style={styles.input} placeholder="Digite o seu gasto com Casa" />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>estudos</Text>
                    <TextInput style={styles.input} placeholder="Digite o seu gasto com estudos" />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>transporte</Text>
                    <TextInput style={styles.input} placeholder="Digite o seu gasto com transportes" />
                </View>

                {/* Gráfico de Pizza */}
                <View style={styles.chartContainer}>
                    <View style={styles.pieChart}>
                        {/* Dívida 1 - 25% (área menor) */}
                        <View style={styles.pieSlice1Container}>
                            <View style={[styles.pieSlice, styles.pieSlice1]}>
                                <Text style={styles.pieText1}>25%</Text>
                                <Text style={styles.pieLabel1}>Dívida 1</Text>
                            </View>
                        </View>
                        {/* Dívida 2 - 75% (área maior) */}
                        <View style={styles.pieSlice2Container}>
                            <View style={[styles.pieSlice, styles.pieSlice2]}>
                                <Text style={styles.pieText2}>75%</Text>
                                <Text style={styles.pieLabel2}>Dívida 2</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Botão Salvar */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Salvar despesa</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

