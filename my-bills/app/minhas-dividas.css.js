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
  chartContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  pieChart: {
    width: 200,
    height: 200,
    borderRadius: 100,
    position: 'relative',
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: '#1565C0',
  },
  pieSlice1Container: {
    width: '25%',
    height: '100%',
    overflow: 'hidden',
  },
  pieSlice2Container: {
    width: '75%',
    height: '100%',
    overflow: 'hidden',
  },
  pieSlice: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  pieSlice1: {
    backgroundColor: '#80CBC4',
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
  },
  pieSlice2: {
    backgroundColor: '#1565C0',
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
  },
  pieText1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  pieText2: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  pieLabel1: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  pieLabel2: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
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

