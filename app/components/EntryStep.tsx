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
    color: '#ffd700', 
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
    display: 'flex', flexDirection: 'column', gap: '5px', width: '100%'
  },
  label: {
    color: '#ffd700', fontSize: '0.85rem', fontWeight: 'bold', paddingRight: '5px'
  },
  entryInput: { 
    width: '100%', height: '3em', padding: '0 12px', borderRadius: '12px', 
    backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', 
    border: '1px solid rgba(255,255,255,0.15)', fontSize: '1.1rem', 
    textAlign: 'center', boxSizing: 'border-box' 
  },
  ageGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%'
  },
  ageButton: {
    padding: '10px', borderRadius: '12px', border: '1px solid #ffd700',
    backgroundColor: 'transparent', color: '#ffd700', fontWeight: 'bold',
    fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s'
  },
  ageButtonActive: {
    backgroundColor: '#ffd700', color: '#05081c'
  },
  joinContainer: {
    width: '100%', backgroundColor: 'rgba(255, 215, 0, 0.05)', borderRadius: '20px',
    padding: '12px', border: '1px solid rgba(255, 215, 0, 0.2)', 
    display: 'flex', flexDirection: 'column', gap: '10px'
  },
  primaryButton: { 
    width: '100%', height: '3.5em', borderRadius: '16px', 
    backgroundColor: '#ffd700', color: '#05081c', fontWeight: '900', 
    border: 'none', fontSize: '1.3rem', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
  },
  secondaryButton: { 
    width: '100%', height: '3em', borderRadius: '14px', 
    backgroundColor: 'transparent', color: 'rgba(255, 215, 0, 0.7)', fontWeight: 'bold', 
    border: '1px solid rgba(255, 215, 0, 0.3)', fontSize: '1rem', cursor: 'pointer'
  }
};

interface EntryStepProps {
  onJoin: (code: string) => void;
  onCreate: () => void;
  onSetName: (name: string) => void;
  onSetAge: (age: string) => void;
}

export default function EntryStep({ onJoin, onCreate, onSetName, onSetAge }: EntryStepProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [hasUrlCode, setHasUrlCode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const roomFromUrl = params.get('room');
      if (roomFromUrl) {
        setInputCode(roomFromUrl.trim().toUpperCase());
        setHasUrlCode(true);
      }
    }
  }, []);

  const handleAgeSelect = (val: string) => {
    setAge(val);
    onSetAge(val);
    
    if (hasUrlCode && name.trim() && inputCode.trim()) {
        setTimeout(() => {
            onJoin(inputCode.trim().toUpperCase());
        }, 100);
    }
  };

  const validate = (action: 'create' | 'join') => {
    if (!name.trim()) { alert("אנא הכנס שם שחקן 🙂"); return; }
    if (!age) { alert("אנא בחר קבוצת גיל 🙂"); return; }

    if (action === 'join') {
      if (!inputCode.trim()) { alert("אנא הכנס קוד חדר כדי להצטרף"); return; }
      onJoin(inputCode.trim().toUpperCase());
    } else {
      onCreate();
    }
  };

  const ageCategories = [
    { label: "מתחת ל-7", value: "6" },
    { label: "7 עד 12", value: "12" },
    { label: "13 עד 20", value: "20" },
    { label: "מעל 21", value: "21" }
  ];

  return (
    <div style={localStyles.flexLayout}>
      {/* Top Section - לוגו מוגדל וכותרת בשורה אחת */}
      <div style={localStyles.topSection}>
        <img src="/logo.webp" alt="Logo" style={localStyles.entryLogo} />
        <h1 style={localStyles.entryTitle}>נראה אתכם תופסים את המילה הנרדפת</h1>
      </div>

      {/* Main Form Section */}
      <div style={localStyles.formSection}>
        {/* Name Input - כותרת "איך קוראים לך" הוסרה */}
        <div style={localStyles.inputGroup}>
          <input 
            type="text" value={name} 
            onChange={(e) => { setName(e.target.value); onSetName(e.target.value); }} 
            placeholder="הכנס שם שחקן" style={localStyles.entryInput} 
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

        {/* JOIN SECTION */}
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
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textAlign: 'center', marginTop: '-5px' }}>
              כניסה אוטומטית לחדר: {inputCode}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <button onClick={() => validate('create')} style={localStyles.secondaryButton}>
          + פתיחת חדר חדש
        </button>
      </div>
    </div>
  );
}