import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    backgroundColor: '#1E88E5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  headerIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },

  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },

  menuIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },

  content: {
    flex: 1,
  },

  contentContainer: {
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000',
  },

  inputContainer: {
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  /* -----------------------------
     GRÁFICO PERSONALIZADO
  ----------------------------- */
  chartContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },

  graphicBox: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },

  graphicText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565C0',
  },

  /* -----------------------------
     BOTÃO
  ----------------------------- */
  footer: {
    padding: 16,
    backgroundColor: '#fff',
  },

  saveButton: {
    backgroundColor: '#1565C0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
