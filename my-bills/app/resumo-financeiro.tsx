import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { styles } from './resumo-financeiro.css';
import { useWallet } from '../frontend/hooks/useWallet';
import { useExpenses } from '../frontend/hooks/useExpenses';
import { useTheme } from './theme-context';

export default function ResumoFinanceiro() {
  const { wallet, loading: walletLoading } = useWallet();
  const { totalExpenses, expensesByMonth, loading: expensesLoading } = useExpenses();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleMenuPress = () => {
    router.push('/menu');
  };

  const handleNewExpense = () => {
    router.push('/minhas-dividas');
  };

  const loading = walletLoading || expensesLoading;
  const totalInWallet = wallet ? wallet.salary + wallet.emergencyReserve : 0;
  const salary = wallet?.salary || 0;

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthExpenses = expensesByMonth.find(m => m.month === currentMonth);
  const monthTotal = currentMonthExpenses?.total || 0;
  const percentageSpent = salary > 0 ? Math.round((monthTotal / salary) * 100) : 0;

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const cardDefs = {
    totalGasto: {
      label: 'Total gasto',
      icon: '🔥',
      color: '#FF6B6B',
      bgLight: '#FFF5F5',
      bgDark: '#2D1F1F',
    },
    carteira: {
      label: 'Valor na carteira',
      icon: '💰',
      color: '#4CAF50',
      bgLight: '#F0FFF4',
      bgDark: '#1F2D1F',
    },
    saldo: {
      label: 'Saldo restante',
      icon: '🏦',
      color: '#FFC107',
      bgLight: '#FFFBEA',
      bgDark: '#2D2A1F',
    }
  };

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[
        styles.container,
        { backgroundColor: isDark ? '#121212' : '#fff' }
      ]}
    >

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>$</Text>
          <Text style={[styles.headerTitle, { marginLeft: 8 }]}>MyBills</Text>
        </View>
        <TouchableOpacity onPress={handleMenuPress}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[
          styles.content,
          { backgroundColor: isDark ? '#121212' : '#fff' }
        ]}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: 40 }
        ]}
        showsVerticalScrollIndicator={false}
      >

        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          Resumo financeiro
        </Text>

        {loading ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <>
            {/* Card Total gasto */}
            <View style={{
              backgroundColor: isDark ? cardDefs.totalGasto.bgDark : cardDefs.totalGasto.bgLight,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: isDark ? '#444' : '#f0f0f0',
              marginBottom: 12,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: cardDefs.totalGasto.color,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}>
                  <Text style={{ fontSize: 18 }}>{cardDefs.totalGasto.icon}</Text>
                </View>
                <Text style={{ color: cardDefs.totalGasto.color, fontWeight: '600', fontSize: 16 }}>
                  {cardDefs.totalGasto.label}
                </Text>
              </View>

              <Text style={[styles.cardValueRed, { marginTop: 6 }]}>
                {formatCurrency(totalExpenses)}
              </Text>
            </View>

            {/* Card Valor na carteira */}
            <View style={{
              backgroundColor: isDark ? cardDefs.carteira.bgDark : cardDefs.carteira.bgLight,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: isDark ? '#444' : '#f0f0f0',
              marginBottom: 12,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: cardDefs.carteira.color,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}>
                  <Text style={{ fontSize: 18 }}>{cardDefs.carteira.icon}</Text>
                </View>
                <Text style={{ color: cardDefs.carteira.color, fontWeight: '600', fontSize: 16 }}>
                  {cardDefs.carteira.label}
                </Text>
              </View>

              <Text style={styles.cardValueGreen}>
                {formatCurrency(totalInWallet)}
              </Text>
            </View>

            {/* Card Saldo restante */}
            {salary > 0 && (
              <View style={{
                backgroundColor: isDark ? cardDefs.saldo.bgDark : cardDefs.saldo.bgLight,
                borderRadius: 12,
                padding: 20,
                marginTop: 12,
                borderWidth: 1,
                borderColor: isDark ? '#444' : '#e0e0e0',
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: cardDefs.saldo.color,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}>
                      <Text style={{ fontSize: 18 }}>{cardDefs.saldo.icon}</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: isDark ? '#fff' : '#333' }}>
                      Saldo restante este mês
                    </Text>
                  </View>

                  <Text style={{
                    fontSize: 24,
                    fontWeight: '700',
                    color: salary - monthTotal >= 0 ? '#4CAF50' : '#f44336'
                  }}>
                    {formatCurrency(salary - monthTotal)}
                  </Text>
                </View>

                {/* Barra de progresso */}
                <View style={{
                  height: 8,
                  backgroundColor: isDark ? '#2D2D2D' : '#f0f0f0',
                  borderRadius: 4,
                  overflow: 'hidden',
                  marginBottom: 8,
                }}>
                  <View style={{
                    height: '100%',
                    width: `${Math.min(percentageSpent, 100)}%`,
                    backgroundColor:
                      percentageSpent > 80 ? '#f44336' :
                      percentageSpent > 50 ? '#FF9800' :
                      '#4CAF50',
                  }} />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, color: isDark ? '#ccc' : '#666' }}>
                    Gasto: {formatCurrency(monthTotal)}
                  </Text>
                  <Text style={{ fontSize: 12, color: isDark ? '#ccc' : '#666' }}>
                    {percentageSpent}% da renda
                  </Text>
                </View>
              </View>
            )}

            {/* Comparativo mensal */}
            {expensesByMonth.length > 0 && (
              <View style={{ marginTop: 24 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 16, color: isDark ? '#fff' : '#000' }}>
                  Comparativo Mensal
                </Text>

                {expensesByMonth.map((item) => {
                  const isCurrentMonth = item.month === currentMonth;

                  return (
                    <View
                      key={item.month}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 16,
                        backgroundColor: isCurrentMonth
                          ? (isDark ? '#1E3A5F' : '#E3F2FD')
                          : (isDark ? '#1E1E1E' : '#fff'),
                        borderRadius: 12,
                        borderWidth: isCurrentMonth ? 2 : 1,
                        borderColor: isCurrentMonth ? '#1E88E5' : (isDark ? '#444' : '#e0e0e0'),
                        marginBottom: 12,
                      }}
                    >
                      <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{ fontSize: 16, fontWeight: '700', color: isDark ? '#fff' : '#000' }}>
                            {item.monthLabel}
                          </Text>
                          {isCurrentMonth && (
                            <View style={{
                              backgroundColor: '#1E88E5',
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              borderRadius: 10,
                              marginLeft: 8,
                            }}>
                              <Text style={{ fontSize: 10, color: '#fff' }}>ATUAL</Text>
                            </View>
                          )}
                        </View>

                        <Text style={{ fontSize: 12, color: isDark ? '#ccc' : '#666', marginTop: 4 }}>
                          📊 {item.count} {item.count === 1 ? 'despesa' : 'despesas'}
                        </Text>
                      </View>

                      <Text style={{ fontSize: 20, fontWeight: '700', color: '#E53935' }}>
                        {formatCurrency(item.total)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

          </>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={[
        styles.footer,
        { backgroundColor: isDark ? '#1E1E1E' : '#fff' }
      ]}>
        <TouchableOpacity style={styles.button} onPress={handleNewExpense}>
          <Text style={styles.buttonText}>Nova despesa</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}
