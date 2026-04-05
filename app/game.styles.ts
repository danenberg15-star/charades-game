import { CSSProperties } from "react";

export const styles: { [key: string]: CSSProperties } = {
  container: { 
    display: 'flex', justifyContent: 'center', height: '100dvh', width: '100vw', 
    backgroundColor: '#05081c', direction: 'rtl', overflow: 'hidden', position: 'fixed',
    touchAction: 'none', userSelect: 'none', overscrollBehavior: 'none' 
  },
  safeAreaWrapper: { 
    width: '100%', maxWidth: '450px', height: '100%', display: 'flex', flexDirection: 'column', 
    paddingTop: 'env(safe-area-inset-top, 10px)', paddingBottom: 'env(safe-area-inset-bottom, 20px)', 
    paddingLeft: '15px', paddingRight: '15px', alignItems: 'center', boxSizing: 'border-box',
    justifyContent: 'space-between', position: 'relative'
  },
  flexLayout: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%' },

  setupHeader: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '12px', marginTop: '45px', marginBottom: '10px' },
  exitBtnRed: { position: 'absolute', top: '15px', left: '15px', width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#ef4444', border: 'none', color: 'white', fontSize: '20px', fontWeight: 'bold', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },

  bigToggleBtn: { flex: 1, minHeight: '52px', borderRadius: '16px', border: '2px solid rgba(0, 242, 255, 0.2)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer' },
  bigToggleBtnActive: { backgroundColor: '#00f2ff', color: '#05081c', borderColor: '#00f2ff', boxShadow: '0 0 15px rgba(0, 242, 255, 0.3)' },

  setupGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', flex: 1, margin: '15px 0', alignContent: 'start' },
  teamBox: { backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '18px', border: '1px solid rgba(0, 242, 255, 0.1)', padding: '10px', display: 'flex', flexDirection: 'column', minHeight: '130px', position: 'relative' },
  playerCard: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', padding: '8px', borderRadius: '12px', margin: '3px 0', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold' },

  lobbyButton: { width: '100%', minHeight: '60px', borderRadius: '20px', backgroundColor: '#00f2ff', color: '#05081c', fontWeight: '900', border: 'none', fontSize: '1.4rem', cursor: 'pointer' },
  goldButton: { width: '100%', minHeight: '60px', borderRadius: '20px', backgroundColor: '#00f2ff', color: '#05081c', fontWeight: '900', border: 'none', fontSize: '1.4rem', cursor: 'pointer' },
  disabledButton: { width: '100%', minHeight: '60px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.2)', fontWeight: '900', border: 'none', fontSize: '1.4rem' },
  
  modernPauseBtn: { width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(0, 242, 255, 0.15)', border: '2px solid #00f2ff', color: '#00f2ff', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};