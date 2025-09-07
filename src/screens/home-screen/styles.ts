import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 30, paddingTop: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50', marginTop: 16, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#7F8C8D', marginTop: 8, textAlign: 'center' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statCard: {
    backgroundColor: 'white', borderRadius: 12, padding: 16, alignItems: 'center', flex: 1, marginHorizontal: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#7F8C8D', marginTop: 4 },
  section: {
    backgroundColor: 'white', borderRadius: 12, padding: 20, marginBottom: 20, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#2C3E50', marginBottom: 16 },
  featureText: { fontSize: 14, color: '#34495E', lineHeight: 20 },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, marginBottom: 12 },
  primaryButton: { backgroundColor: '#007AFF' },
  secondaryButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#007AFF' },
  dangerButton: { backgroundColor: '#FF3B30' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8 },
});


