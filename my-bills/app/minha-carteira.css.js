import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  /* -----------------------------------------
     HEADER MODERNO
  ----------------------------------------- */
  header: {
    backgroundColor: '#1E88E5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  headerIcon: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },

  headerTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  menuIcon: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },

  /* -----------------------------------------
     CONTEÚDO
  ----------------------------------------- */
  content: {
    flex: 1,
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 60,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 32,
    color: '#1A1A1A',
  },

  /* -----------------------------------------
     INPUTS MODERNOS
  ----------------------------------------- */
  inputContainer: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 15,
    marginBottom: 8,
    color: '#444',
    fontWeight: '600',
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDE3EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  /* -----------------------------------------
     GRÁFICO E LEGENDA
  ----------------------------------------- */
  chartContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 50,
  },

  chartTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1A1A1A',
  },

  legend: {
    marginTop: 20,
    width: '80%',
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 6,
    marginRight: 10,
  },

  legendText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  /* -----------------------------------------
     BOTÃO FINAL
  ----------------------------------------- */
  footer: {
    padding: 20,
    backgroundColor: '#fff',
  },

  saveButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
