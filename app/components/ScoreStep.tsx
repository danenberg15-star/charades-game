"use client";

import React from "react";
import Logo from "./Logo";
import { styles } from "../game.styles";

interface ScoreStepProps {
  scores: { [key: string]: number };
  entities: string[];
  phaseEnded?: string | null;
  onNextRound: () => void;
  onExit: () => void; // הוספנו את ההגדרה כאן
}

export default function ScoreStep({ scores, entities, phaseEnded, onNextRound, onExit }: ScoreStepProps) {
  const exitBtnStyle: React.CSSProperties = {
    position: 'absolute', top: '15px', left: '15px', width: '35px', height: '35px',
    borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
    border: '1px solid #ef4444', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
    zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'
  };

  return (
    <div style={{...styles.flexLayout, justifyContent: 'flex-start', paddingTop: '40px', padding: '20px', boxSizing: 'border-box', overflowY: 'auto', position: 'relative'}}>
      <button onClick={onExit} style={exitBtnStyle}>✕</button>
      <Logo />
      
      {phaseEnded && (
        <div style={{ 
          backgroundColor: 'rgba(0, 242, 255, 0.15)', 
          padding: '20px', 
          borderRadius: '25px', 
          border: '2px solid #00f2ff', 
          width: '100%', 
          textAlign: 'center',
          marginBottom: '20px',
          boxShadow: '0 0 20px rgba(0, 242, 255, 0.2)'
        }}>
          <h1 style={{ color: '#00f2ff', fontSize: '1.8rem', fontWeight: '900', margin: 0 }}>
            שלב {phaseEnded} הסתיים! 🏁
          </h1>
          <p style={{ color: 'white', fontSize: '1.1rem', marginTop: '5px' }}>והניקוד הוא:</p>
        </div>
      )}

      {!phaseEnded && (
        <h2 style={{ color: '#00f2ff', fontSize: '24px', marginBottom: '20px', fontWeight: '900' }}>
          טבלת ניקוד
        </h2>
      )}
      
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: '24px', 
        padding: '10px', 
        border: '1px solid rgba(0, 242, 255, 0.1)' 
      }}>
        {entities.map((entity) => (
          <div key={entity} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '15px 20px', 
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            color: 'white',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{entity}</span>
            <span style={{ fontSize: '1.4rem', color: '#00f2ff', fontWeight: '900' }}>
              {scores[entity] || 0}
            </span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <button 
        onClick={onNextRound}
        style={{ ...styles.lobbyButton, width: '100%', maxWidth: '400px', marginTop: '30px', marginBottom: '10px' }}
      >
        המשך לסיבוב הבא ➔
      </button>
    </div>
  );
}