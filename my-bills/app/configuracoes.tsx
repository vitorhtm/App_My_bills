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
import { useTheme } from './theme-context';

export default function Configuracoes() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleMenuPress = () => {
    router.push('/menu');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerIcon, { color: isDark ? '#fff' : '#000' }]}>$</Text>
          <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000', marginLeft: 8 }]}>MyBills</Text>
        </View>

        <TouchableOpacity onPress={handleMenuPress}>
          <Text style={[styles.menuIcon, { color: isDark ? '#fff' : '#000' }]}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          Configurações
        </Text>

        <View style={styles.placeholder}>
          <Text style={[styles.placeholderText, { color: isDark ? '#ddd' : '#333' }]}>
            Tela de configurações em desenvolvimento...
          </Text>
        </View>

        {/* Botão de alternar tema */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: isDark ? '#333' : '#EEE',
            borderRadius: 10
          }}
        >
          <Text style={{ color: isDark ? '#fff' : '#000', fontSize: 16 }}>
            Alternar tema ({theme})
          </Text>
        </TouchableOpacity>
      </ScrollView>

    </SafeAreaView>
  );
}
