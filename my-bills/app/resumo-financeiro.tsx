import { router } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { styles } from './resumo-financeiro.css.js';

export default function ResumoFinanceiro() {
  const handleMenuPress = () => {
    router.push('/menu');
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.title}>Resumo financeiro</Text>

        {/* Card Total Gasto */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total gasto</Text>
          <Text style={styles.cardValueRed}>R$ 690.00</Text>
        </View>

        {/* Card Valor na Carteira */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Valor na Carteira</Text>
          <Text style={styles.cardValueGreen}>R$ 300.00</Text>
        </View>

        {/* Banner Informativo */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Você gastou 70% da sua renda esse mês</Text>
        </View>
      </ScrollView>

      {/* Botão Nova Despesa */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Nova despesa</Text>
        </TouchableOpacity>
      </View>

      
    </SafeAreaView>
  );
}

