// ============================================
// STYLES
// ============================================

export const styles = {
  // Layout
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  landingContent: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
    paddingTop: '60px',
  },

  // Typography
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '50px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
  },
  pageSubtitle: {
    fontSize: '16px',
    color: '#666',
  },
  participantTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    margin: '15px 0 10px 0',
  },
  participantSubtitle: {
    fontSize: '16px',
    color: '#666',
  },

  // Cards & Containers
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '30px',
  },
  header: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    border: '1px solid #ddd',
  },
  participantHeader: {
    textAlign: 'center',
    marginBottom: '40px',
  },

  // Icons & Labels
  icon: {
    color: '#666',
    marginBottom: '15px',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  cardText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
  },

  // Buttons
  primaryButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
  toggleButton: {
    width: '100%',
    padding: '12px',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
  iconButton: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#666',
  },
  interactiveButton: {
    padding: '30px',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    position: 'relative',
    minHeight: '180px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Input
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '18px',
    textAlign: 'center',
    border: '2px solid #ddd',
    borderRadius: '6px',
    fontWeight: 'bold',
    letterSpacing: '3px',
  },

  // Code Display
  codeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  label: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '5px',
  },
  codeDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f9f9f9',
    padding: '10px 15px',
    borderRadius: '6px',
    border: '1px solid #ddd',
  },
  code: {
    fontSize: '24px',
    fontWeight: 'bold',
    letterSpacing: '3px',
    color: '#333',
  },

  // Button Control
  buttonControl: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  buttonControlHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  buttonLabel: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },

  // Interactive Button Elements
  buttonIcon: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    opacity: 0.8,
  },
  buttonNumber: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  buttonText: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  clickBadge: {
    marginTop: '10px',
    padding: '5px 12px',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: '12px',
    fontSize: '14px',
  },

  // Status
  sessionBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #ddd',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
  },

  // Modal
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    color: '#666',
  },

  // QR Code
  qrContainer: {
    textAlign: 'center',
  },
  qrImage: {
    width: '300px',
    height: '300px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    backgroundColor: 'white',
  },
  qrText: {
    fontSize: '16px',
    color: '#666',
    marginTop: '15px',
    marginBottom: '10px',
  },
  qrSubText: {
    fontSize: '14px',
    color: '#999',
    marginTop: '10px',
  },
  qrCodeBox: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    marginTop: '10px',
  },
  qrCodeText: {
    fontSize: '32px',
    fontWeight: 'bold',
    letterSpacing: '5px',
    color: '#333',
  },
};