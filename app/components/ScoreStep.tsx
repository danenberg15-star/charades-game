"use client";

import Logo from "./Logo";
import { styles } from "../game.styles";

interface ScoreStepProps {
  scores: { [key: string]: number };
  entities: string[]; 
  onNextRound: () => void;
}

export default function ScoreStep({ scores, entities, onNextRound }: ScoreStepProps) {
  return (
    <div style={{...styles.flexLayout, height: '100dvh', justifyContent: 'flex-start', paddingTop: '40px', boxSizing: 'border-box'}}>
      <Logo />
      <h2 style={{ color: '#ffd700', fontSize: '24px', marginBottom: '20px', fontWeight: '900' }}>טבלת ניקוד</h2>
      
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '24px', padding: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
        {entities.map((entity) => (
          <div key={entity} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '15px 20px', 
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            color: 'white',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{entity}</span>
            <span style={{ color: '#ffd700', fontSize: '1.3rem', fontWeight: '900' }}>
              {scores[entity] || 0} 🏆
            </span>
          </div>
        ))}
      </div>

      <button 
        onClick={onNextRound} 
        style={{ ...styles.goldButton, marginTop: '30px', width: '90%', maxWidth: '350px', fontSize: '1.3rem' }}
      >
        המשך לסבב הבא ➔
      </button>
    </div>
  );
}