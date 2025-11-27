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

  /* ---------------------------------------------------
     CARDS PRINCIPAIS
  --------------------------------------------------- */
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  cardLabel: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
    fontWeight: '500',
  },

  /* ---------------------------------------------------
     VALORES DO RESUMO FINANCEIRO
     (usados no seu TSX)
  --------------------------------------------------- */
  cardValueRed: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E53935',
    marginTop: 4,
  },

  cardValueGreen: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
    marginTop: 4,
  },

  /* ---------------------------------------------------
     BANNERS DE AVISO
  --------------------------------------------------- */
  banner: {
    padding: 14,
    borderLeftWidth: 6,
    borderRadius: 10,
    marginTop: 18,
  },

  bannerText: {
    fontSize: 15,
    fontWeight: '500',
  },

  /* ---------------------------------------------------
     FOOTER / BOTÃO NOVA DESPESA
  --------------------------------------------------- */
  footer: {
    padding: 16,
    backgroundColor: '#fff',
  },

  button: {
    backgroundColor: '#1E88E5',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
