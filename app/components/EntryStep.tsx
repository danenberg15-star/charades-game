"use client";

import React, { useState, useEffect, CSSProperties } from "react";

const localStyles: { [key: string]: CSSProperties } = {
  flexLayout: { 
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', 
    width: '100%', height: '100dvh', justifyContent: 'space-between', 
    direction: 'rtl', boxSizing: 'border-box', padding: '15px'
  },
  topSection: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%'
  },
  entryLogo: { 
    width: '85%', height: 'auto', maxHeight: '22vh', objectFit: 'contain'
  },
  entryTitle: { 
    color: '#00f2ff', 
    fontSize: 'clamp(1.1rem, 4.5vw, 1.6rem)', 
    fontWeight: '900', 
    textAlign: 'center', 
    lineHeight: '1.2',
    whiteSpace: 'nowrap',
    width: '100%'
  },
  formSection: {
    width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '15px', flex: 1, justifyContent: 'center'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  label: {
    color: '#00f2ff',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    paddingRight: '5px'
  },
  entryInput: { 
    width: '100%', height: '3.2em', padding: '0 12px', borderRadius: '12px', 
    backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', 
    border: '1px solid rgba(255,255,255,0.15)', fontSize: '1.1rem', 
    textAlign: 'center', boxSizing: 'border-box'
  },
  ageGrid: { 
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%' 
  },
  ageButton: { 
    padding: '12px', borderRadius: '12px', border: '1px solid #00f2ff', 
    backgroundColor: 'transparent', color: '#00f2ff', fontWeight: 'bold', 
    fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s'
  },
  ageButtonActive: { 
    backgroundColor: '#00f2ff', color: '#05081c', boxShadow: '0 0 10px rgba(0, 242, 255, 0.4)' 
  },
  joinContainer: { 
    width: '100%', backgroundColor: 'rgba(0, 242, 255, 0.05)', borderRadius: '20px', 
    padding: '15px', border: '1px solid rgba(0, 242, 255, 0.2)', 
    display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box'
  },
  primaryButton: { 
    width: '100%', height: '3.5em', borderRadius: '16px', backgroundColor: '#00f2ff', 
    color: '#05081c', fontWeight: '900', border: 'none', fontSize: '1.3rem', 
    cursor: 'pointer', boxShadow: '0 4px 15px rgba(0, 242, 255, 0.3)' 
  },
  secondaryButton: { 
    width: '100%', height: '3.2em', borderRadius: '14px', backgroundColor: 'transparent', 
    color: 'rgba(0, 242, 255, 0.8)', fontWeight: 'bold', 
    border: '1px solid rgba(0, 242, 255, 0.3)', fontSize: '1.1rem', 
    cursor: 'pointer', marginBottom: '10px'
  }
};

export default function EntryStep({ onJoin, onCreate, onSetName, onSetAge }: any) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [hasUrlCode, setHasUrlCode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('room');
    if (code) {
      setInputCode(code.toUpperCase());
      setHasUrlCode(true);
    }
  }, []);

  const handleAgeSelect = (val: string) => {
    setAge(val);
    onSetAge(val);
  };

  const validate = (action: 'join' | 'create') => {
    if (!name.trim()) return alert("אנא הכנס שם שחקן");
    if (!age) return alert("אנא בחר קבוצת גיל");
    if (action === 'join' && !inputCode.trim()) return alert("אנא הכנס קוד חדר");
    
    if (action === 'join') onJoin(inputCode.trim());
    else onCreate();
  };

  const ageCategories = [
    { label: "מתחת ל-7", value: "6" },
    { label: "7 עד 12", value: "12" },
    { label: "13 עד 20", value: "20" },
    { label: "מעל 21", value: "21" }
  ];

  return (
    <div style={localStyles.flexLayout}>
      <div style={localStyles.topSection}>
        <img src="/logo.webp" alt="Logo" style={localStyles.entryLogo} />
        <h1 style={localStyles.entryTitle}>נראה אתכם תופסים את הסלב</h1>
      </div>

      <div style={localStyles.formSection}>
        <div style={localStyles.inputGroup}>
          <label style={localStyles.label}>מה השם שלך?</label>
          <input 
            type="text" value={name} 
            onChange={(e) => { setName(e.target.value); onSetName(e.target.value); }} 
            placeholder="הכנס שם שחקן" 
            style={localStyles.entryInput} 
          />
        </div>

        <div style={localStyles.inputGroup}>
          <label style={localStyles.label}>באיזו קבוצת גיל אתה?</label>
          <div style={localStyles.ageGrid}>
            {ageCategories.map((cat) => (
              <button 
                key={cat.value}
                onClick={() => handleAgeSelect(cat.value)}
                style={{
                  ...localStyles.ageButton,
                  ...(age === cat.value ? localStyles.ageButtonActive : {})
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div style={localStyles.joinContainer}>
          <input 
            type="text" value={inputCode} 
            onChange={(e) => setInputCode(e.target.value.toUpperCase())} 
            placeholder="קוד חדר (למשל: 1234)" 
            style={{ ...localStyles.entryInput, backgroundColor: 'rgba(0,0,0,0.2)' }} 
          />
          <button onClick={() => validate('join')} style={localStyles.primaryButton}>
            הצטרפות למשחק
          </button>
          {hasUrlCode && (
            <p style={{ color: 'rgba(0, 242, 255, 0.6)', fontSize: '0.8rem', textAlign: 'center', marginTop: '-5px' }}>
              כניסה אוטומטית לחדר: {inputCode}
            </p>
          )}
        </div>
      </div>

      <button onClick={() => validate('create')} style={localStyles.secondaryButton}>
        + פתיחת חדר חדש
      </button>
    </div>
  );
}