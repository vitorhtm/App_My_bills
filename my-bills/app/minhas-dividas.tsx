import { router } from 'expo-router';
import React, { useState } from 'react';
import { Expense, ExpenseCategory } from '../backend/models/types';
import { useExpenses } from '../frontend/hooks/useExpenses';
import { useTheme } from './theme-context';

import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { PieChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './minhas-dividas.css.js';

// Funções auxiliares para cores e ícones por categoria
const getCategoryColor = (category: ExpenseCategory): string => {
    const colors: Record<ExpenseCategory, string> = {
        lazer: '#FF6B6B',
        casa: '#4ECDC4',
        estudos: '#45B7D1',
        transporte: '#FFA07A',
    };
    return colors[category] || '#999';
};

const getCategoryIcon = (category: ExpenseCategory): string => {
    const icons: Record<ExpenseCategory, string> = {
        lazer: '🎮',
        casa: '🏠',
        estudos: '📚',
        transporte: '🚗',
    };
    return icons[category] || '💰';
};

const getCategoryBgColor = (category: ExpenseCategory, isDark: boolean = false): string => {
    if (isDark) {
        const colors: Record<ExpenseCategory, string> = {
            lazer: '#2D1F1F',
            casa: '#1F2D2C',
            estudos: '#1F262D',
            transporte: '#2D2620',
        };
        return colors[category] || '#1E1E1E';
    }
    const colors: Record<ExpenseCategory, string> = {
        lazer: '#FFF5F5',
        casa: '#F0FDFC',
        estudos: '#F0F9FF',
        transporte: '#FFF7ED',
    };
    return colors[category] || '#F5F5F5';
};

export default function MinhaCarteira() {

    const [lazer, setLazer] = useState("");
    const [casa, setCasa] = useState("");
    const [estudos, setEstudos] = useState("");
    const [transporte, setTransporte] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Estados para edição de despesa
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editAmount, setEditAmount] = useState("");
    const [editCategory, setEditCategory] = useState<ExpenseCategory>('lazer');
    const [editSaving, setEditSaving] = useState(false);

    // Estados para exclusão de despesa
    const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteDeleting, setDeleteDeleting] = useState(false);

    const { addExpense, expenses, expensesByCategory, error: expensesError, refreshExpenses, deleteExpense, updateExpense } = useExpenses();

    React.useEffect(() => {
        if (expensesError) {
            setError(expensesError);
        }
    }, [addExpense, deleteExpense, updateExpense, expensesError]);

    const handleMenuPress = () => {
        router.push('/menu');
    };

    const handleEditExpense = (expense: Expense) => {
        setEditingExpense(expense);
        setEditAmount(expense.amount.toString().replace('.', ','));
        setEditCategory(expense.category);
        setEditModalVisible(true);
    };

    const handleDeleteExpense = (expense: Expense) => {
        setDeletingExpense(expense);
        setDeleteModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingExpense) return;
        
        try {
            if (!deleteExpense) {
                Alert.alert('Erro', 'Função de exclusão não está disponível.');
                return;
            }
            
            setDeleteDeleting(true);
            await deleteExpense(deletingExpense.id);
            
            // Pequeno delay para garantir que o banco processou
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Forçar refresh manual
            await refreshExpenses();
            
            setDeleteModalVisible(false);
            setDeletingExpense(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
            Alert.alert('Erro', `Não foi possível excluir a despesa: ${errorMessage}`);
        } finally {
            setDeleteDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalVisible(false);
        setDeletingExpense(null);
    };

    const handleSaveEdit = async () => {
        if (!editingExpense) return;

        const parseValue = (value: string): number => {
            if (!value || value.trim() === '') return 0;
            const cleaned = value.replace(",", ".").replace(/[^0-9.]/g, "");
            if (!cleaned || cleaned === '' || cleaned === '.') return 0;
            const num = parseFloat(cleaned);
            if (isNaN(num) || !isFinite(num) || num <= 0) return 0;
            return Math.round(num * 100) / 100;
        };

        const amountValue = parseValue(editAmount);

        if (amountValue === 0) {
            Alert.alert('Atenção', 'Digite um valor válido para a despesa.');
            return;
        }

        try {
            setEditSaving(true);
            await updateExpense(editingExpense.id, {
                category: editCategory,
                amount: amountValue,
            });
            setEditModalVisible(false);
            setEditingExpense(null);
            Alert.alert('Sucesso', 'Despesa atualizada com sucesso!');
        } catch (err) {
            Alert.alert('Erro', 'Não foi possível atualizar a despesa.');
        } finally {
            setEditSaving(false);
        }
    };

    const handleCloseEditModal = () => {
        setEditModalVisible(false);
        setEditingExpense(null);
        setEditAmount("");
    };

    const handleSaveExpenses = async () => {
        // Converter valores de forma mais segura
        const parseValue = (value: string): number => {
            if (!value || value.trim() === '') return 0;
            // Substituir vírgula por ponto e remover caracteres inválidos
            const cleaned = value.replace(",", ".").replace(/[^0-9.]/g, "");
            if (!cleaned || cleaned === '' || cleaned === '.') return 0;
            const num = parseFloat(cleaned);
            // Retornar 0 se não for um número válido ou se for menor ou igual a zero
            if (isNaN(num) || !isFinite(num) || num <= 0) return 0;
            // Retornar o número arredondado para 2 casas decimais
            return Math.round(num * 100) / 100;
        };
        
        const lazerNum = parseValue(lazer);
        const casaNum = parseValue(casa);
        const estudosNum = parseValue(estudos);
        const transporteNum = parseValue(transporte);

        // Verificar se há pelo menos uma despesa para salvar
        if (lazerNum === 0 && casaNum === 0 && estudosNum === 0 && transporteNum === 0) {
            Alert.alert('Atenção', 'Digite pelo menos um valor para salvar uma despesa.');
            return;
        }

        if (!addExpense) {
            Alert.alert('Erro', 'Serviço de despesas não está disponível. Verifique o console.');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            // Preparar lista de despesas para salvar
            const expensesToSave: Array<{ category: 'lazer' | 'casa' | 'estudos' | 'transporte', amount: number }> = [];

            if (lazerNum > 0) {
                const amount = Number(lazerNum);
                if (isNaN(amount) || amount <= 0) {
                    throw new Error(`Valor inválido para lazer: ${lazerNum}`);
                }
                expensesToSave.push({ category: 'lazer', amount });
            }
            if (casaNum > 0) {
                const amount = Number(casaNum);
                if (isNaN(amount) || amount <= 0) {
                    throw new Error(`Valor inválido para casa: ${casaNum}`);
                }
                expensesToSave.push({ category: 'casa', amount });
            }
            if (estudosNum > 0) {
                const amount = Number(estudosNum);
                if (isNaN(amount) || amount <= 0) {
                    throw new Error(`Valor inválido para estudos: ${estudosNum}`);
                }
                expensesToSave.push({ category: 'estudos', amount });
            }
            if (transporteNum > 0) {
                const amount = Number(transporteNum);
                if (isNaN(amount) || amount <= 0) {
                    throw new Error(`Valor inválido para transporte: ${transporteNum}`);
                }
                expensesToSave.push({ category: 'transporte', amount });
            }
            
            // Executar inserções SEQUENCIALMENTE para evitar conflito de conexões no web
            for (let i = 0; i < expensesToSave.length; i++) {
                const expense = expensesToSave[i];
                await addExpense(expense);
            }

            // Limpar campos após salvar
            setLazer("");
            setCasa("");
            setEstudos("");
            setTransporte("");
            setError(null);

            // Recarregar despesas para atualizar a lista
            await refreshExpenses();

            Alert.alert('Sucesso', 'Despesas salvas com sucesso!');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            setError(errorMessage);
            Alert.alert('Erro', `Não foi possível salvar as despesas: ${errorMessage}`);
        } finally {
            setSaving(false);
        }
    };

    const lazerNum = Number(lazer.replace(",", ".")) || 0;
    const casaNum = Number(casa.replace(",", ".")) || 0;
    const estudosNum = Number(estudos.replace(",", ".")) || 0;
    const transporteNum = Number(transporte.replace(",", ".")) || 0;

    const total = lazerNum + casaNum + estudosNum + transporteNum;

    // Filtrar apenas valores > 0 e usar cores padronizadas
    const data = [
        ...(lazerNum > 0 ? [{ value: lazerNum, color: getCategoryColor('lazer'), text: 'Lazer' }] : []),
        ...(casaNum > 0 ? [{ value: casaNum, color: getCategoryColor('casa'), text: 'Casa' }] : []),
        ...(estudosNum > 0 ? [{ value: estudosNum, color: getCategoryColor('estudos'), text: 'Estudos' }] : []),
        ...(transporteNum > 0 ? [{ value: transporteNum, color: getCategoryColor('transporte'), text: 'Transporte' }] : []),
    ];

    const { theme } = useTheme();

    const isDark = theme === 'dark';

    return (
        <SafeAreaView edges={['top', 'bottom']} style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F7FA' }]}>
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
                style={[styles.content, { backgroundColor: isDark ? '#121212' : '#F5F7FA' }]} 
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
            >
                {/* Título */}
                <Text style={[styles.title, { color: isDark ? '#fff' : '#1A1A1A' }]}>Minhas dívidas</Text>

                {/* Inputs */}
                <View style={{
                    backgroundColor: getCategoryBgColor('lazer', isDark),
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: lazer ? 2 : 1,
                    borderColor: lazer ? getCategoryColor('lazer') : (isDark ? '#444' : '#e0e0e0'),
                    marginBottom: 12,
                }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <View style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: getCategoryColor('lazer'),
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12,
                            }}>
                                <Text style={{ fontSize: 18 }}>{getCategoryIcon('lazer')}</Text>
                            </View>
                            <Text style={{ 
                                color: getCategoryColor('lazer'),
                                fontWeight: '600',
                                fontSize: 16,
                            }}>Lazer</Text>
                        </View>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: getCategoryColor('lazer'),
                                borderRadius: 12,
                                padding: 14,
                                fontSize: 16,
                                backgroundColor: isDark ? '#1E1E1E' : '#fff',
                                color: isDark ? '#fff' : '#000',
                                shadowColor: '#000',
                                shadowOpacity: isDark ? 0.3 : 0.05,
                                shadowRadius: 3,
                                shadowOffset: { width: 0, height: 2 },
                                elevation: 1,
                            }}
                            placeholder="Digite o valor"
                            placeholderTextColor={isDark ? '#888' : '#999'}
                            keyboardType="numeric"
                            value={lazer}
                            onChangeText={(text) => setLazer(text.replace(/[^0-9,]/g, ""))}
                        />
                    </View>

                    <View style={{
                        backgroundColor: getCategoryBgColor('casa', isDark),
                        borderRadius: 12,
                        padding: 16,
                        borderWidth: casa ? 2 : 1,
                        borderColor: casa ? getCategoryColor('casa') : (isDark ? '#444' : '#e0e0e0'),
                        marginBottom: 12,
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <View style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: getCategoryColor('casa'),
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12,
                            }}>
                                <Text style={{ fontSize: 18 }}>{getCategoryIcon('casa')}</Text>
                            </View>
                            <Text style={{ 
                                color: getCategoryColor('casa'),
                                fontWeight: '600',
                                fontSize: 16,
                            }}>Casa</Text>
                        </View>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: getCategoryColor('casa'),
                                borderRadius: 12,
                                padding: 14,
                                fontSize: 16,
                                backgroundColor: isDark ? '#1E1E1E' : '#fff',
                                color: isDark ? '#fff' : '#000',
                                shadowColor: '#000',
                                shadowOpacity: isDark ? 0.3 : 0.05,
                                shadowRadius: 3,
                                shadowOffset: { width: 0, height: 2 },
                                elevation: 1,
                            }}
                            placeholder="Digite o valor"
                            placeholderTextColor={isDark ? '#888' : '#999'}
                            keyboardType="numeric"
                            value={casa}
                            onChangeText={(text) => setCasa(text.replace(/[^0-9,]/g, ""))}
                        />
                    </View>

                    <View style={{
                        backgroundColor: getCategoryBgColor('estudos', isDark),
                        borderRadius: 12,
                        padding: 16,
                        borderWidth: estudos ? 2 : 1,
                        borderColor: estudos ? getCategoryColor('estudos') : (isDark ? '#444' : '#e0e0e0'),
                        marginBottom: 12,
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <View style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: getCategoryColor('estudos'),
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12,
                            }}>
                                <Text style={{ fontSize: 18 }}>{getCategoryIcon('estudos')}</Text>
                            </View>
                            <Text style={{ 
                                color: getCategoryColor('estudos'),
                                fontWeight: '600',
                                fontSize: 16,
                            }}>Estudos</Text>
                        </View>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: getCategoryColor('estudos'),
                                borderRadius: 12,
                                padding: 14,
                                fontSize: 16,
                                backgroundColor: isDark ? '#1E1E1E' : '#fff',
                                color: isDark ? '#fff' : '#000',
                                shadowColor: '#000',
                                shadowOpacity: isDark ? 0.3 : 0.05,
                                shadowRadius: 3,
                                shadowOffset: { width: 0, height: 2 },
                                elevation: 1,
                            }}
                            placeholder="Digite o valor"
                            placeholderTextColor={isDark ? '#888' : '#999'}
                            keyboardType="numeric"
                            value={estudos}
                            onChangeText={(text) => setEstudos(text.replace(/[^0-9,]/g, ""))}
                        />
                    </View>

                    <View style={{
                        backgroundColor: getCategoryBgColor('transporte', isDark),
                        borderRadius: 12,
                        padding: 16,
                        borderWidth: transporte ? 2 : 1,
                        borderColor: transporte ? getCategoryColor('transporte') : (isDark ? '#444' : '#e0e0e0'),
                        marginBottom: 12,
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <View style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: getCategoryColor('transporte'),
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12,
                            }}>
                                <Text style={{ fontSize: 18 }}>{getCategoryIcon('transporte')}</Text>
                            </View>
                            <Text style={{ 
                                color: getCategoryColor('transporte'),
                                fontWeight: '600',
                                fontSize: 16,
                            }}>Transporte</Text>
                        </View>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: getCategoryColor('transporte'),
                                borderRadius: 12,
                                padding: 14,
                                fontSize: 16,
                                backgroundColor: isDark ? '#1E1E1E' : '#fff',
                                color: isDark ? '#fff' : '#000',
                                shadowColor: '#000',
                                shadowOpacity: isDark ? 0.3 : 0.05,
                                shadowRadius: 3,
                                shadowOffset: { width: 0, height: 2 },
                                elevation: 1,
                            }}
                            placeholder="Digite o valor"
                            placeholderTextColor={isDark ? '#888' : '#999'}
                            keyboardType="numeric"
                            value={transporte}
                            onChangeText={(text) => setTransporte(text.replace(/[^0-9,]/g, ""))}
                        />
                    </View>

                <View style={styles.chartContainer}>
                    {total > 0 && data.length > 0 ? (
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
                            backgroundColor: isDark ? '#2D2D2D' : '#f5f5f5',
                        }}>
                            <Text style={{ color: isDark ? '#888' : '#999', fontSize: 14, textAlign: 'center', padding: 20 }}>
                                Adicione valores para ver o gráfico
                            </Text>
                        </View>
                    )}

                    <View style={styles.legend}>
                        {lazerNum > 0 && (
                            <View style={styles.legendItem}>
                                <View style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    backgroundColor: getCategoryColor('lazer'),
                                    marginRight: 10,
                                }} />
                                <Text style={[styles.legendText, { color: isDark ? '#fff' : '#333' }]}>
                                    {getCategoryIcon('lazer')} Lazer ({total > 0 ? ((lazerNum / total) * 100).toFixed(0) : 0}%)
                                </Text>
                            </View>
                        )}
                        {casaNum > 0 && (
                            <View style={styles.legendItem}>
                                <View style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    backgroundColor: getCategoryColor('casa'),
                                    marginRight: 10,
                                }} />
                                <Text style={[styles.legendText, { color: isDark ? '#fff' : '#333' }]}>
                                    {getCategoryIcon('casa')} Casa ({total > 0 ? ((casaNum / total) * 100).toFixed(0) : 0}%)
                                </Text>
                            </View>
                        )}
                        {estudosNum > 0 && (
                            <View style={styles.legendItem}>
                                <View style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    backgroundColor: getCategoryColor('estudos'),
                                    marginRight: 10,
                                }} />
                                <Text style={[styles.legendText, { color: isDark ? '#fff' : '#333' }]}>
                                    {getCategoryIcon('estudos')} Estudos ({total > 0 ? ((estudosNum / total) * 100).toFixed(0) : 0}%)
                                </Text>
                            </View>
                        )}
                        {transporteNum > 0 && (
                            <View style={styles.legendItem}>
                                <View style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 10,
                                    backgroundColor: getCategoryColor('transporte'),
                                    marginRight: 10,
                                }} />
                                <Text style={[styles.legendText, { color: isDark ? '#fff' : '#333' }]}>
                                    {getCategoryIcon('transporte')} Transporte ({total > 0 ? ((transporteNum / total) * 100).toFixed(0) : 0}%)
                                </Text>
                            </View>
                        )}
                        {total === 0 && (
                            <Text style={{ fontSize: 14, color: isDark ? '#888' : '#999', textAlign: 'center', marginTop: 10 }}>
                                Adicione valores para ver o gráfico
                            </Text>
                        )}
                    </View>
                </View>

                {/* Seção Despesas por Categoria */}
                {expensesByCategory.length > 0 && (
                    <View style={{ marginTop: 40 }}>
                        <Text style={[styles.title, { fontSize: 24, marginBottom: 20, color: isDark ? '#fff' : '#1A1A1A' }]}>
                            Despesas por Categoria
                        </Text>
                        {expensesByCategory.map((item) => (
                            <View key={item.category} style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 16,
                                marginBottom: 12,
                                backgroundColor: getCategoryBgColor(item.category, isDark),
                                borderRadius: 12,
                                borderWidth: 2,
                                borderColor: getCategoryColor(item.category),
                                borderLeftWidth: 4,
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 24,
                                        backgroundColor: getCategoryColor(item.category),
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: 12,
                                    }}>
                                        <Text style={{ fontSize: 24 }}>{getCategoryIcon(item.category)}</Text>
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 16, textTransform: 'capitalize', fontWeight: '600', color: isDark ? '#fff' : '#1A1A1A' }}>
                                            {item.category}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: isDark ? '#B0B0B0' : '#666', marginTop: 2 }}>
                                            {item.percentage.toFixed(1)}% do total
                                        </Text>
                                    </View>
                                </View>
                                <Text style={{ fontSize: 18, fontWeight: '700', color: getCategoryColor(item.category) }}>
                                    R$ {item.total.toFixed(2).replace('.', ',')}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Seção Últimas Despesas */}
                {expenses.length > 0 && (
                    <View style={{ marginTop: 32 }}>
                        <Text style={[styles.title, { fontSize: 24, marginBottom: 20, color: isDark ? '#fff' : '#1A1A1A' }]}>
                            Últimas Despesas
                        </Text>
                        {expenses.slice(0, 10).map((expense) => {
                            const categoryColor = getCategoryColor(expense.category);
                            const categoryIcon = getCategoryIcon(expense.category);
                            const categoryBg = getCategoryBgColor(expense.category, isDark);
                            
                            return (
                                <View key={expense.id} style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 16,
                                    marginBottom: 12,
                                    backgroundColor: categoryBg,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: categoryColor,
                                    borderLeftWidth: 4,
                                }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                        <View style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 20,
                                            backgroundColor: categoryColor,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 12,
                                        }}>
                                            <Text style={{ fontSize: 20 }}>{categoryIcon}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 16, textTransform: 'capitalize', fontWeight: '600', color: isDark ? '#fff' : '#1A1A1A' }}>
                                                {expense.category}
                                            </Text>
                                            <Text style={{ fontSize: 12, color: isDark ? '#B0B0B0' : '#666', marginTop: 2 }}>
                                                {new Date(expense.createdAt).toLocaleDateString('pt-BR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 18, fontWeight: '700', color: categoryColor, marginRight: 8 }}>
                                            R$ {expense.amount.toFixed(2).replace('.', ',')}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                handleEditExpense(expense);
                                            }}
                                            style={{
                                                padding: 8,
                                                backgroundColor: '#2196F3',
                                                borderRadius: 6,
                                                minWidth: 36,
                                                minHeight: 36,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={{ color: '#fff', fontSize: 14 }}>✏️</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                handleDeleteExpense(expense);
                                            }}
                                            style={{
                                                padding: 8,
                                                backgroundColor: '#f44336',
                                                borderRadius: 6,
                                                minWidth: 36,
                                                minHeight: 36,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={{ color: '#fff', fontSize: 14 }}>🗑️</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })}
                        {expenses.length > 10 && (
                            <Text style={{ textAlign: 'center', color: isDark ? '#B0B0B0' : '#666', marginTop: 12, fontSize: 14 }}>
                                + {expenses.length - 10} outras despesas
                            </Text>
                        )}
                    </View>
                )}

                {/* Mensagem quando não há despesas */}
                {expenses.length === 0 && (
                    <View style={{ marginTop: 40, padding: 20, alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: isDark ? '#B0B0B0' : '#666', textAlign: 'center' }}>
                            Nenhuma despesa cadastrada ainda.
                        </Text>
                    </View>
                )}

            </ScrollView>

            {/* Botão Salvar */}
            <View style={[styles.footer, { backgroundColor: isDark ? '#1E1E1E' : '#fff', borderTopColor: isDark ? '#444' : '#E0E0E0' }]}>
                {error && (
                    <View style={{ padding: 10, marginBottom: 10, backgroundColor: isDark ? '#3D2A2A' : '#ffebee', borderRadius: 8 }}>
                        <Text style={{ color: isDark ? '#ff6b6b' : '#c62828', fontSize: 14 }}>⚠️ {error}</Text>
                    </View>
                )}
                <TouchableOpacity 
                    style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                    onPress={handleSaveExpenses}
                    disabled={saving}
                    activeOpacity={0.7}
                >
                    <Text style={styles.saveButtonText}>
                        {saving ? 'Salvando...' : 'Salvar despesa'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Modal de Edição de Despesa */}
            <Modal
                visible={editModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCloseEditModal}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                }}>
                    <View style={{
                        backgroundColor: isDark ? '#1E1E1E' : '#fff',
                        borderRadius: 16,
                        padding: 24,
                        width: '100%',
                        maxWidth: 400,
                    }}>
                        <Text style={{
                            fontSize: 22,
                            fontWeight: '700',
                            marginBottom: 20,
                            color: isDark ? '#fff' : '#1A1A1A',
                        }}>
                            Editar Despesa
                        </Text>

                        {/* Seletor de Categoria */}
                        <Text style={{ fontSize: 15, marginBottom: 8, color: isDark ? '#B0B0B0' : '#444', fontWeight: '600' }}>
                            Categoria
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
                            {(['lazer', 'casa', 'estudos', 'transporte'] as ExpenseCategory[]).map((cat, index) => (
                                <TouchableOpacity
                                    key={cat}
                                    onPress={() => setEditCategory(cat)}
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 16,
                                        borderRadius: 8,
                                        backgroundColor: editCategory === cat ? '#1E88E5' : (isDark ? '#2D2D2D' : '#f0f0f0'),
                                        marginRight: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <Text style={{
                                        color: editCategory === cat ? '#fff' : (isDark ? '#fff' : '#333'),
                                        fontWeight: '600',
                                        textTransform: 'capitalize',
                                    }}>
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Input de Valor */}
                        <Text style={{ fontSize: 15, marginBottom: 8, color: isDark ? '#B0B0B0' : '#444', fontWeight: '600' }}>
                            Valor
                        </Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: isDark ? '#444' : '#DDE3EB',
                                borderRadius: 12,
                                padding: 14,
                                fontSize: 16,
                                backgroundColor: isDark ? '#2D2D2D' : '#fff',
                                color: isDark ? '#fff' : '#000',
                                marginBottom: 20,
                            }}
                            placeholder="Digite o valor"
                            placeholderTextColor={isDark ? '#888' : '#999'}
                            keyboardType="numeric"
                            value={editAmount}
                            onChangeText={(text) => setEditAmount(text.replace(/[^0-9,]/g, ""))}
                        />

                        {/* Botões */}
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={handleCloseEditModal}
                                style={{
                                    flex: 1,
                                    padding: 14,
                                    borderRadius: 12,
                                    backgroundColor: isDark ? '#2D2D2D' : '#f0f0f0',
                                    alignItems: 'center',
                                    marginRight: 12,
                                }}
                            >
                                <Text style={{ color: isDark ? '#fff' : '#333', fontWeight: '600' }}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSaveEdit}
                                disabled={editSaving}
                                style={{
                                    flex: 1,
                                    padding: 14,
                                    borderRadius: 12,
                                    backgroundColor: '#1E88E5',
                                    alignItems: 'center',
                                    opacity: editSaving ? 0.6 : 1,
                                }}
                            >
                                {editSaving ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={{ color: '#fff', fontWeight: '600' }}>Salvar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de Confirmação de Exclusão */}
            <Modal
                visible={deleteModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCancelDelete}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                }}>
                    <View style={{
                        backgroundColor: isDark ? '#1E1E1E' : '#fff',
                        borderRadius: 16,
                        padding: 24,
                        width: '100%',
                        maxWidth: 400,
                    }}>
                        <Text style={{
                            fontSize: 22,
                            fontWeight: '700',
                            marginBottom: 12,
                            color: isDark ? '#fff' : '#1A1A1A',
                        }}>
                            Excluir Despesa
                        </Text>

                        {deletingExpense && (
                            <>
                                <Text style={{
                                    fontSize: 16,
                                    color: isDark ? '#B0B0B0' : '#666',
                                    marginBottom: 20,
                                    lineHeight: 22,
                                }}>
                                    Deseja realmente excluir esta despesa?
                                </Text>

                                <View style={{
                                    backgroundColor: isDark ? '#2D2D2D' : '#f5f5f5',
                                    borderRadius: 8,
                                    padding: 12,
                                    marginBottom: 20,
                                }}>
                                    <Text style={{ fontSize: 14, color: isDark ? '#fff' : '#333', marginBottom: 4 }}>
                                        <Text style={{ fontWeight: '600' }}>Categoria:</Text> {deletingExpense.category.charAt(0).toUpperCase() + deletingExpense.category.slice(1)}
                                    </Text>
                                    <Text style={{ fontSize: 14, color: isDark ? '#fff' : '#333' }}>
                                        <Text style={{ fontWeight: '600' }}>Valor:</Text> R$ {deletingExpense.amount.toFixed(2).replace('.', ',')}
                                    </Text>
                                </View>
                            </>
                        )}

                        {/* Botões */}
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={handleCancelDelete}
                                disabled={deleteDeleting}
                                style={{
                                    flex: 1,
                                    padding: 14,
                                    borderRadius: 12,
                                    backgroundColor: isDark ? '#2D2D2D' : '#f0f0f0',
                                    alignItems: 'center',
                                    opacity: deleteDeleting ? 0.6 : 1,
                                    marginRight: 12,
                                }}
                            >
                                <Text style={{ color: isDark ? '#fff' : '#333', fontWeight: '600' }}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleConfirmDelete}
                                disabled={deleteDeleting}
                                style={{
                                    flex: 1,
                                    padding: 14,
                                    borderRadius: 12,
                                    backgroundColor: '#f44336',
                                    alignItems: 'center',
                                    opacity: deleteDeleting ? 0.6 : 1,
                                }}
                            >
                                {deleteDeleting ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={{ color: '#fff', fontWeight: '600' }}>Excluir</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

