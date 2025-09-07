import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    scrollView: {
      flex: 1,
    },
    header: {
      backgroundColor: 'white',
      alignItems: 'center',
      paddingVertical: 32,
      marginBottom: 20,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#2C3E50',
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
    },
    section: {
      backgroundColor: 'white',
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#2C3E50',
      marginBottom: 16,
    },
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#E5E5EA',
    },
    profileRowContent: {
      flex: 1,
      marginLeft: 12,
    },
    profileRowLabel: {
      fontSize: 16,
      color: '#2C3E50',
      fontWeight: '500',
    },
    profileRowValue: {
      fontSize: 14,
      marginTop: 2,
      fontWeight: '500',
    },
    footer: {
      alignItems: 'center',
      paddingVertical: 32,
      paddingHorizontal: 16,
    },
    footerText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#2C3E50',
      marginBottom: 4,
    },
    footerSubtext: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
    },
  });
  