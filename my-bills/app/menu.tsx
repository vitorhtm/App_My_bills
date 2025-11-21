import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import { styles } from './menu.css.js';

export default function Menu() {
  const handleSair = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>$</Text>
          <Text style={styles.headerTitle}>MyBills</Text>
        </View>
        <TouchableOpacity onPress={handleSair}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Título */}
        <Text style={styles.title}>Menu</Text>

        {/* Item Menu - Resumo financeiro */}
        <Link href="/resumo-financeiro" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>📊</Text>
              </View>
              <Text style={styles.menuItemText}>Resumo financeiro</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </Link>

        {/* Item Menu - Minhas dívidas */}
        <Link href="/minhas-dividas" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>📋</Text>
              </View>
              <Text style={styles.menuItemText}>Minhas dívidas</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </Link>

                {/* Item Menu - Minha carteira */}
        <Link href="/minha-carteira" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>💵</Text>
              </View>
              <Text style={styles.menuItemText}>Minha carteira</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </Link>

        {/* Item Menu - Configurações */}
        <Link href="/configuracoes" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconText}>⚙️</Text>
              </View>
              <Text style={styles.menuItemText}>Configurações</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </Link>

        {/* Link Sair do menu */}
        <TouchableOpacity onPress={handleSair} style={styles.exitLink}>
          <Text style={styles.exitLinkText}>Sair do menu</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

