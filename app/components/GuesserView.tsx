"use client";

import { styles } from "../game.styles";

interface GuesserViewProps {
  timeLeft: number;
  describerName: string;
  describerTeam: string;
  isTeamMode: boolean;
  totalScores: { [key: string]: number };
  roundScore: number;
  entities: string[];
  onPause: () => void;
}

export default function GuesserView(props: GuesserViewProps) {
  // חישוב ניקוד חי - הניקוד המצטבר + מה שקורה עכשיו בסבב
  const getLiveScore = (entity: string) => {
    const currentActiveEntity = props.isTeamMode ? props.describerTeam : props.describerName;
    const pastScore = props.totalScores[entity] || 0;
    return entity === currentActiveEntity ? pastScore + props.roundScore : pastScore;
  };

  return (
    <div style={styles.gameLayout}>
      {/* טיימר מסונכרן */}
      <div style={{...styles.timerDisplay, color: props.timeLeft <= 15 ? '#ef4444' : 'white'}}>
        00:{props.timeLeft < 10 ? `0${props.timeLeft}` : props.timeLeft}
      </div>

      <div style={styles.flexLayout}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>כרגע מסביר:</div>
          <div style={{ color: '#ffd700', fontSize: '24px', fontWeight: 'bold' }}>{props.describerName}</div>
          {props.isTeamMode && <div style={{ color: 'white', fontSize: '14px' }}>({props.describerTeam})</div>}
        </div>

        {/* טבלת ניקוד חיה */}
        <div style={{ width: '320px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '10px' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textAlign: 'center', marginBottom: '10px' }}>מצב הנקודות בלייב:</p>
          {props.entities.map(entity => (
            <div key={entity} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '10px 15px', 
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              color: 'white'
            }}>
              <span style={{ fontWeight: props.describerTeam === entity || props.describerName === entity ? 'bold' : 'normal' }}>
                {entity}
              </span>
              <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{getLiveScore(entity)}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.gameFooter}>
        <div style={{ color: 'white', fontSize: '14px', opacity: 0.5 }}>הקשיבו למתאר...</div>
        <button onClick={props.onPause} style={styles.modernPauseBtn}>⏸️</button>
      </div>
    </div>
  );
}