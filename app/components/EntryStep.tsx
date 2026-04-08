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
    backgroundColor: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(0, 242, 255, 0.2)',
    fontSize: '1.1rem', outline: 'none', textAlign: 'right'
  },
  primaryButton: {
    width: '100%', height: '3.5em', borderRadius: '15px', border: 'none',
    backgroundColor: '#00f2ff', color: '#05081c', fontSize: '1.2rem', fontWeight: '900',
    cursor: 'pointer', transition: 'transform 0.1s'
  },
  addWordsToggle: {
    color: '#00f2ff', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline',
    textAlign: 'center', marginTop: '5px', opacity: 0.8
  },
  customWordsArea: {
    width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '15px',
    padding: '15px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '10px'
  },
  addBtn: {
    backgroundColor: 'rgba(0, 242, 255, 0.15)', color: '#00f2ff', border: '1px solid #00f2ff',
    borderRadius: '10px', padding: '8px', cursor: 'pointer', fontWeight: 'bold'
  },
  wordList: { display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' },
  wordTag: {
    backgroundColor: 'rgba(0, 242, 255, 0.1)', color: 'white', padding: '4px 10px',
    borderRadius: '8px', fontSize: '0.8rem', border: '1px solid rgba(0, 242, 255, 0.3)'
  }
};

const CATEGORIES = ["כללי", "ספורט", "מוזיקה", "קולנוע", "פוליטיקה", "היסטוריה"];

interface EntryStepProps {
  onJoin: (id: string, payload: any) => void;
  onCreate: (payload: any) => void;
  onSetName: (name: string) => void;
  initialCode: string | null;
}

export default function EntryStep({ onJoin, onCreate, onSetName, initialCode }: EntryStepProps) {
  const [name, setName] = useState("");
  const [inputCode, setInputCode] = useState(initialCode || "");
  const [showCustomWords, setShowCustomWords] = useState(false);
  const [customWords, setCustomWords] = useState<any[]>([]);
  const [newWord, setNewWord] = useState("");
  const [newCat, setNewCat] = useState("כללי");

  useEffect(() => {
    if (initialCode) setInputCode(initialCode);
  }, [initialCode]);

  const handleAddWord = () => {
    if (!newWord.trim()) return;
    setCustomWords([...customWords, { word: newWord.trim(), category: newCat, en: "" }]);
    setNewWord("");
  };

  const startAction = (type: 'create' | 'join') => {
    if (!name.trim()) { alert("אנא הכנס שם"); return; }
    onSetName(name.trim());
    const payload = { name: name.trim(), customWords };
    if (type === 'create') onCreate(payload);
    else {
      if (!inputCode.trim()) { alert("אנא הכנס קוד חדר"); return; }
      onJoin(inputCode.trim().toUpperCase(), payload);
    }
  };

  return (
    <div style={localStyles.flexLayout}>
      <div style={localStyles.topSection}>
        {/* תיקון טעינת הלוגו עם עדיפות גבוהה */}
        <img 
          src="/logo.png" 
          alt="Family Alias Logo" 
          style={localStyles.entryLogo}
          fetchPriority="high"
          loading="eager"
        />
        <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '900', margin: 0 }}>Family Alias</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>המשחק שיוציא מכם את המיטב</p>
      </div>

      <div style={localStyles.formSection}>
        <div style={localStyles.inputGroup}>
          <label style={localStyles.label}>השם שלך:</label>
          <input 
            type="text" value={name} onChange={(e) => setName(e.target.value)} 
            placeholder="איך קוראים לך?" style={localStyles.entryInput} 
          />
        </div>

        <div style={localStyles.inputGroup}>
          <button onClick={() => setShowCustomWords(!showCustomWords)} style={localStyles.addWordsToggle}>
            {showCustomWords ? "- סגור הוספת שמות" : "+ רוצה להוסיף שמות משלך לחפיסה?"}
          </button>
          
          {showCustomWords && (
            <div style={localStyles.customWordsArea}>
              <input 
                type="text" placeholder="שם של סלב / דמות..." 
                value={newWord} onChange={e => setNewWord(e.target.value)}
                style={{...localStyles.entryInput, height: '2.8em', fontSize: '0.9rem'}}
              />
              <select 
                value={newCat} onChange={e => setNewCat(e.target.value)} 
                style={{...localStyles.entryInput, height: '2.8em', fontSize: '0.9rem'}}
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
          )}
        </div>

        <div style={{...localStyles.inputGroup, marginTop: '10px'}}>
          <input 
            type="text" value={inputCode} 
            onChange={(e) => setInputCode(e.target.value.toUpperCase())} 
            placeholder="יש לך קוד חדר?" 
            style={{...localStyles.entryInput, borderStyle: 'dashed'}} 
          />
          <button onClick={() => startAction('join')} style={localStyles.primaryButton}>הצטרפות</button>
          {initialCode && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textAlign: 'center', marginTop: '5px' }}>כניסה אוטומטית לחדר: {inputCode}</p>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '10px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>או</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        <button 
          onClick={() => startAction('create')} 
          style={{...localStyles.primaryButton, backgroundColor: 'transparent', border: '2px solid #00f2ff', color: '#00f2ff'}}
        >
          יצירת חדר חדש
        </button>
      </div>

      <div style={{ paddingBottom: '10px', opacity: 0.3, fontSize: '0.7rem', color: 'white' }}>
        v3.01 | Powered by Firebase
      </div>
    </div>
  );
}