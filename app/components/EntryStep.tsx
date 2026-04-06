"use client";

import React, { useState, CSSProperties, useEffect } from "react";

const localStyles: { [key: string]: CSSProperties } = {
  flexLayout: { 
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', 
    width: '100%', height: '100dvh', justifyContent: 'space-between', 
    direction: 'rtl', boxSizing: 'border-box', padding: '20px', overflowY: 'auto'
  },
  topSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' },
  entryLogo: { width: '80%', height: 'auto', maxHeight: '30vh', objectFit: 'contain', borderRadius: '25px' },
  formSection: { width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#00f2ff', fontSize: '0.9rem', fontWeight: 'bold', paddingRight: '5px' },
  entryInput: { 
    width: '100%', height: '3.5em', padding: '0 15px', borderRadius: '15px', 
    backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', 
    border: '1px solid rgba(0, 242, 255, 0.3)', fontSize: '1.1rem', textAlign: 'right', boxSizing: 'border-box'
  },
  customBox: { 
    backgroundColor: 'rgba(0, 242, 255, 0.03)', borderRadius: '20px', padding: '15px', 
    border: '1px dashed rgba(0, 242, 255, 0.4)', display: 'flex', flexDirection: 'column', gap: '10px' 
  },
  addBtn: { 
    backgroundColor: '#00f2ff', color: '#05081c', border: 'none', borderRadius: '10px', 
    padding: '10px', fontWeight: '900', cursor: 'pointer', transition: 'transform 0.1s' 
  },
  wordList: { display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px', maxHeight: '80px', overflowY: 'auto' },
  wordTag: { 
    backgroundColor: 'rgba(0, 242, 255, 0.15)', color: '#00f2ff', padding: '4px 10px', 
    borderRadius: '12px', fontSize: '0.8rem', border: '1px solid rgba(0, 242, 255, 0.2)' 
  },
  actionButtons: { width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px' },
  primaryButton: { 
    width: '100%', height: '3.8em', borderRadius: '18px', backgroundColor: '#00f2ff', 
    color: '#05081c', fontWeight: '900', border: 'none', fontSize: '1.3rem', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 242, 255, 0.3)'
  },
  secondaryButton: { 
    width: '100%', height: '3.2em', borderRadius: '16px', backgroundColor: 'transparent', 
    color: 'rgba(0, 242, 255, 0.9)', fontWeight: 'bold', border: '1px solid rgba(0, 242, 255, 0.4)', 
    fontSize: '1.1rem', cursor: 'pointer' 
  }
};

const CATEGORIES = [
  "זמר/ת", "שחקן/ית", "במאי/ת", "דמות קולנועית", "דמות טלוויזיונית", "ראש מדינה", 
  "פוליטיקאי/ת", "מדען והוגה דעות", "אמן/צייר", "מלחין/ה", "דמות מקראית", 
  "מנהיג דתי", "כדורגלן", "כדורסלן", "טניסאי/ת", "ספורטאי אולימפי", "נהג מרוצים", 
  "דוגמן/ית", "שף/קולינריה", "גיבור על", "דמות מצוירת", "כוכב ילדים", 
  "מגיש/עיתונאי", "כוכב ריאליטי", "OTHER (אחר)"
];

// הוספת initialCode ל-Props
export default function EntryStep({ initialCode, onJoin, onCreate, onSetName }: any) {
  const [name, setName] = useState("");
  const [inputCode, setInputCode] = useState(initialCode || "");
  const [customWords, setCustomWords] = useState<any[]>([]);
  
  const [newHeb, setNewHeb] = useState("");
  const [newCat, setNewCat] = useState(CATEGORIES[0]);

  // עדכון השדה אם קוד מוזרק מה-URL
  useEffect(() => {
    if (initialCode) setInputCode(initialCode);
  }, [initialCode]);

  const handleAddWord = () => {
    if (!newHeb.trim()) return;
    setCustomWords([...customWords, { word: newHeb.trim(), en: "", category: newCat }]);
    setNewHeb("");
  };

  const startAction = (type: 'create' | 'join') => {
    if (!name.trim()) return alert("נא להזין שם שחקן");
    if (type === 'join' && !inputCode.trim()) return alert("נא להזין קוד חדר");
    
    const payload = { name: name.trim(), customWords };
    if (type === 'create') onCreate(payload);
    else onJoin(inputCode.trim(), payload);
  };

  return (
    <div style={localStyles.flexLayout}>
      <div style={localStyles.topSection}>
        <img src="/icon.jpg" alt="SAME-SAME Logo" style={localStyles.entryLogo} />
      </div>

      <div style={localStyles.formSection}>
        <div style={localStyles.inputGroup}>
          <label style={localStyles.label}>השם שלך:</label>
          <input 
            type="text" value={name} 
            onChange={(e) => { setName(e.target.value); onSetName(e.target.value); }} 
            placeholder="איך יקראו לך במשחק?" 
            style={localStyles.entryInput} 
          />
        </div>

        <div style={localStyles.customBox}>
          <label style={localStyles.label}>הוספת שמות אישיים לחבילה:</label>
          <input 
            placeholder="שם בעברית (למשל: דודה שרה)" 
            value={newHeb} onChange={e => setNewHeb(e.target.value)} 
            style={{...localStyles.entryInput, height: '2.8em', fontSize: '0.9rem'}} 
          />
          <select 
            value={newCat} onChange={e => setNewCat(e.target.value)} 
            style={{...localStyles.entryInput, height: '2.8em', fontSize: '0.9rem', marginTop: '5px'}}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={handleAddWord} style={localStyles.addBtn}>+ הוסף שם</button>
          
          <div style={localStyles.wordList}>
            {customWords.map((w, i) => (
              <span key={i} style={localStyles.wordTag}>{w.word}</span>
            ))}
          </div>
        </div>

        <div style={{...localStyles.inputGroup, marginTop: '10px'}}>
          <input 
            type="text" value={inputCode} 
            onChange={(e) => setInputCode(e.target.value.toUpperCase())} 
            placeholder="יש לך קוד חדר?" 
            style={{...localStyles.entryInput, borderStyle: 'dashed'}} 
          />
          <button onClick={() => startAction('join')} style={localStyles.primaryButton}>הצטרפות</button>
        </div>
      </div>

      <div style={localStyles.actionButtons}>
        <button onClick={() => startAction('create')} style={localStyles.secondaryButton}>+ פתיחת חדר חדש</button>
      </div>
    </div>
  );
}