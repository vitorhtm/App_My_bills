import { router } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from './configuracoes.css.js';

export default function Configuracoes() {
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
        <Text style={styles.title}>Configurações</Text>

        {/* Conteúdo da tela de configurações */}
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Tela de configurações em desenvolvimento...</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

