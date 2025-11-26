import { router } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';
import { styles } from './resumo-financeiro.css.js';
import { useWallet } from '../frontend/hooks/useWallet';
import { useExpenses } from '../frontend/hooks/useExpenses';

export default function ResumoFinanceiro() {
  const { wallet, loading: walletLoading } = useWallet();
  const { totalExpenses, loading: expensesLoading } = useExpenses();

  const handleMenuPress = () => {
    router.push('/menu');
  };

  const handleNewExpense = () => {
    router.push('/minhas-dividas');
  };

  const loading = walletLoading || expensesLoading;
  const totalInWallet = wallet ? wallet.salary + wallet.emergencyReserve : 0;
  const salary = wallet?.salary || 0;
  const percentageSpent = salary > 0 ? Math.round((totalExpenses / salary) * 100) : 0;

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
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

        {loading ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <>
            {/* Card Total Gasto */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Total gasto</Text>
              <Text style={styles.cardValueRed}>{formatCurrency(totalExpenses)}</Text>
            </View>

            {/* Card Valor na Carteira */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Valor na Carteira</Text>
              <Text style={styles.cardValueGreen}>{formatCurrency(totalInWallet)}</Text>
            </View>

            {/* Banner Informativo */}
            {salary > 0 && (
              <View style={styles.banner}>
                <Text style={styles.bannerText}>
                  Você gastou {percentageSpent}% da sua renda esse mês
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Botão Nova Despesa */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleNewExpense}>
          <Text style={styles.buttonText}>Nova despesa</Text>
        </TouchableOpacity>
      </View>

      
    </SafeAreaView>
  );
}

