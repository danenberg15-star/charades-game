"use client";

import React, { useState, CSSProperties } from "react";

const localStyles: { [key: string]: CSSProperties } = {
  flexLayout: { 
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', 
    width: '100%', height: '100dvh', justifyContent: 'space-between', 
    direction: 'rtl', boxSizing: 'border-box', padding: '15px', overflowY: 'auto'
  },
  topSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' },
  entryLogo: { width: '85%', height: 'auto', maxHeight: '18vh', objectFit: 'contain' },
  entryTitle: { color: '#00f2ff', fontSize: 'clamp(1.1rem, 4.5vw, 1.6rem)', fontWeight: '900', textAlign: 'center', lineHeight: '1.2' },
  formSection: { width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '15px', paddingBottom: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { color: '#00f2ff', fontSize: '0.85rem', fontWeight: 'bold', paddingRight: '5px' },
  entryInput: { 
    width: '100%', height: '3.2em', padding: '0 12px', borderRadius: '12px', 
    backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', 
    border: '1px solid rgba(255,255,255,0.15)', fontSize: '1rem', textAlign: 'right', boxSizing: 'border-box'
  },
  customSection: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '15px', padding: '15px', border: '1px dashed #00f2ff' },
  addBtn: { backgroundColor: '#00f2ff', color: '#05081c', border: 'none', borderRadius: '8px', padding: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' },
  wordTag: { display: 'inline-block', backgroundColor: 'rgba(0, 242, 255, 0.2)', padding: '4px 10px', borderRadius: '20px', margin: '3px', fontSize: '0.8rem' },
  primaryButton: { width: '100%', height: '3.5em', borderRadius: '16px', backgroundColor: '#00f2ff', color: '#05081c', fontWeight: '900', border: 'none', fontSize: '1.3rem', cursor: 'pointer' },
  secondaryButton: { width: '100%', height: '3.2em', borderRadius: '14px', backgroundColor: 'transparent', color: 'rgba(0, 242, 255, 0.8)', fontWeight: 'bold', border: '1px solid rgba(0, 242, 255, 0.3)', fontSize: '1.1rem', cursor: 'pointer' }
};

const CATEGORIES = [
  "זמר/ת", "שחקן/ית", "במאי/ת", "דמות קולנועית", "דמות טלוויזיונית", "ראש מדינה", 
  "פוליטיקאי/ת", "מדען והוגה דעות", "אמן/צייר", "מלחין/ה", "דמות מקראית", 
  "מנהיג דתי", "כדורגלן", "כדורסלן", "טניסאי/ת", "ספורטאי אולימפי", "נהג מרוצים", 
  "דוגמן/ית", "שף/קולינריה", "גיבור על", "דמות מצוירת", "כוכב ילדים", 
  "מגיש/עיתונאי", "כוכב ריאליטי", "דמות היסטורית", "סופר/ת", "קומיקאי/ת", 
  "דמות ספרותית", "מעצב/ת אופנה", "יוטיובר/טיקטוקר", "אסטרונאוט/ית", 
  "פילוסוף/ית", "דמות מיתולוגית", "OTHER (אחר)"
];

export default function EntryStep({ onJoin, onCreate, onSetName }: any) {
  const [name, setName] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [customWords, setCustomWords] = useState<any[]>([]);
  const [newHeb, setNewHeb] = useState("");
  const [newEn, setNewEn] = useState("");
  const [newCat, setNewCat] = useState(CATEGORIES[0]);

  const addCustomWord = () => {
    if (!newHeb || !newEn) return alert("אנא מלא שם בעברית ובאנגלית");
    setCustomWords([...customWords, { word: newHeb, en: newEn, category: newCat }]);
    setNewHeb(""); setNewEn("");
  };

  const validate = (action: 'join' | 'create') => {
    if (!name.trim()) return alert("אנא הכנס שם שחקן");
    if (action === 'join' && !inputCode.trim()) return alert("אנא הכנס קוד חדר");
    
    const payload = { name, customWords };
    if (action === 'join') onJoin(inputCode.trim(), payload);
    else onCreate(payload);
  };

  return (
    <div style={localStyles.flexLayout}>
      <div style={localStyles.topSection}>
        <img src="/logo.webp" alt="Logo" style={localStyles.entryLogo} />
        <h1 style={localStyles.entryTitle}>תופסים את הסלב</h1>
      </div>

      <div style={localStyles.formSection}>
        <div style={localStyles.inputGroup}>
          <label style={localStyles.label}>מה השם שלך?</label>
          <input type="text" value={name} onChange={(e) => { setName(e.target.value); onSetName(e.target.value); }} placeholder="הכנס שם" style={localStyles.entryInput} />
        </div>

        <div style={localStyles.customSection}>
          <label style={{...localStyles.label, display: 'block', marginBottom: '10px'}}>הוספת שמות למשחק (יופיעו ראשונים):</label>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            <input placeholder="שם בעברית" value={newHeb} onChange={e => setNewHeb(e.target.value)} style={{...localStyles.entryInput, height: '2.5em'}} />
            <input placeholder="Name in English" value={newEn} onChange={e => setNewEn(e.target.value)} style={{...localStyles.entryInput, height: '2.5em', textAlign: 'left'}} />
            <select value={newCat} onChange={e => setNewCat(e.target.value)} style={{...localStyles.entryInput, height: '2.5em'}}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={addCustomWord} style={localStyles.addBtn}>+ הוסף שם לחבילה</button>
          </div>
          <div style={{marginTop: '10px', maxHeight: '100px', overflowY: 'auto'}}>
            {customWords.map((w, i) => <span key={i} style={localStyles.wordTag}>{w.word} ({w.category})</span>)}
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <input type="text" value={inputCode} onChange={(e) => setInputCode(e.target.value.toUpperCase())} placeholder="קוד חדר להצטרפות" style={{...localStyles.entryInput, backgroundColor: 'rgba(0,0,0,0.2)'}} />
          <button onClick={() => validate('join')} style={localStyles.primaryButton}>הצטרפות</button>
        </div>
      </div>

      <button onClick={() => validate('create')} style={localStyles.secondaryButton}>+ פתיחת חדר חדש</button>
    </div>
  );
}