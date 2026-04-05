"use client";

import Logo from "./Logo";
import { styles } from "../game.styles";

interface ScoreStepProps {
  scores: { [key: string]: number };
  entities: string[];
  phaseEnded?: string | null;
  onNextRound: () => void;
}

export default function ScoreStep({ scores, entities, phaseEnded, onNextRound }: ScoreStepProps) {
  return (
    <div style={{...styles.flexLayout, justifyContent: 'flex-start', paddingTop: '40px', padding: '20px', boxSizing: 'border-box'}}>
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

      {!phaseEnded && <h2 style={{ color: '#00f2ff', fontSize: '24px', marginBottom: '20px', fontWeight: '900' }}>טבלת ניקוד</h2>}
      
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '24px', padding: '10px', border: '1px solid rgba(0, 242, 255, 0.1)' }}>
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
            <span style={{ color: '#00f2ff', fontSize: '1.3rem', fontWeight: '900' }}>
              {scores[entity] || 0} 🏆
            </span>
          </div>
        ))}
      </div>

      <button 
        onClick={onNextRound} 
        style={{ ...styles.lobbyButton, marginTop: '30px', width: '90%', maxWidth: '350px' }}
      >
        המשך לסבב הבא ➔
      </button>
    </div>
  );
}