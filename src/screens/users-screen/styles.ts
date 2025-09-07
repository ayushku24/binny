import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  listContent: { paddingHorizontal: 16, paddingBottom: 20, paddingTop: 16 },
  emptyContentContainer: { flex: 1 },
  header: {
    backgroundColor: 'white', padding: 16, marginBottom: 16, borderRadius: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50' },
  statusIndicator: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  headerSubtitle: { fontSize: 16, color: '#666', marginBottom: 4 },
  lastFetch: { fontSize: 12, color: '#999', marginBottom: 12 },
  errorContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBEE', padding: 8, borderRadius: 6, marginBottom: 12 },
  errorText: { color: '#FF3B30', fontSize: 12, flex: 1, marginLeft: 6 },
  offlineBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', padding: 8, borderRadius: 6 },
  offlineBannerText: { color: '#007AFF', fontSize: 12, marginLeft: 6 },
  userCard: {
    backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', padding: 16, marginBottom: 12,
    borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  userAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  userAvatarText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '600', color: '#2C3E50', marginBottom: 2 },
  userEmail: { fontSize: 14, color: '#007AFF', marginBottom: 2 },
  userCompany: { fontSize: 14, color: '#666', marginBottom: 4 },
  userMeta: { flexDirection: 'row', alignItems: 'center' },
  userPhone: { fontSize: 12, color: '#666', marginLeft: 4 },
  userActions: { paddingLeft: 12 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginTop: 16, textAlign: 'center' },
  emptySubtitle: { fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center', lineHeight: 20 },
  retryButton: { backgroundColor: '#007AFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: 24 },
  retryButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' },
  loadingContainer: {
    backgroundColor: 'white', padding: 20, borderRadius: 12, alignItems: 'center', shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 8,
  },
  loadingText: { marginTop: 8, fontSize: 16, color: '#2C3E50' },
});


