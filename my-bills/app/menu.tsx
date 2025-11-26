import React, { useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import { styles } from './menu.css.js';
import { useTheme } from './theme-context';

export default function Menu() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSair = () => {
    router.back();
  };

  // Memoizar estilos dinâmicos para evitar recriação a cada render
  const dynamicStyles = useMemo(() => ({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#fff',
    },
    content: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#fff',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold' as const,
      marginBottom: 24,
      color: isDark ? '#fff' : '#000',
      textAlign: 'center' as const,
    },
    headerTitle: {
      fontSize: 20,
      color: '#fff',
      fontWeight: 'bold' as const,
      marginLeft: 8,
    },
    menuItem: {
      backgroundColor: isDark ? '#1E1E1E' : '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: isDark ? '#444' : '#f0f0f0',
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? '#2D2D2D' : '#E3F2FD',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    menuItemText: {
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
      fontWeight: '500' as const,
      marginLeft: 12,
    },
    arrow: {
      fontSize: 24,
      color: isDark ? '#fff' : '#1E88E5',
      fontWeight: 'bold' as const,
    },
    exitLinkText: {
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
      textDecorationLine: 'underline' as const,
    },
  }), [isDark]);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>$</Text>
          <Text style={[styles.headerTitle, { marginLeft: 8 }]}>MyBills</Text>
        </View>
        <TouchableOpacity onPress={handleSair}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={dynamicStyles.content} contentContainerStyle={styles.contentContainer}>
        {/* Título */}
        <Text style={dynamicStyles.title}>Menu</Text>

        {/* Item Menu - Resumo financeiro */}
        <Link href="/resumo-financeiro" asChild>
          <TouchableOpacity style={dynamicStyles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={dynamicStyles.iconContainer}>
                <Text style={styles.iconText}>📊</Text>
              </View>
              <Text style={dynamicStyles.menuItemText}>Resumo financeiro</Text>
            </View>
            <Text style={dynamicStyles.arrow}>›</Text>
          </TouchableOpacity>
        </Link>

        {/* Item Menu - Minhas dívidas */}
        <Link href="/minhas-dividas" asChild>
          <TouchableOpacity style={dynamicStyles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={dynamicStyles.iconContainer}>
                <Text style={styles.iconText}>📋</Text>
              </View>
              <Text style={dynamicStyles.menuItemText}>Minhas dívidas</Text>
            </View>
            <Text style={dynamicStyles.arrow}>›</Text>
          </TouchableOpacity>
        </Link>

        {/* Item Menu - Minha carteira */}
        <Link href="/minha-carteira" asChild>
          <TouchableOpacity style={dynamicStyles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={dynamicStyles.iconContainer}>
                <Text style={styles.iconText}>💵</Text>
              </View>
              <Text style={dynamicStyles.menuItemText}>Minha carteira</Text>
            </View>
            <Text style={dynamicStyles.arrow}>›</Text>
          </TouchableOpacity>
        </Link>

        {/* Item Menu - Configurações */}
        <Link href="/configuracoes" asChild>
          <TouchableOpacity style={dynamicStyles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={dynamicStyles.iconContainer}>
                <Text style={styles.iconText}>⚙️</Text>
              </View>
              <Text style={dynamicStyles.menuItemText}>Configurações</Text>
            </View>
            <Text style={dynamicStyles.arrow}>›</Text>
          </TouchableOpacity>
        </Link>

        {/* Link Sair do menu */}
        <TouchableOpacity onPress={handleSair} style={styles.exitLink}>
          <Text style={dynamicStyles.exitLinkText}>Sair do menu</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

