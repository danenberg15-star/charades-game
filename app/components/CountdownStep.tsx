"use client";

import React from "react";
import { styles } from "../game.styles";

interface CountdownStepProps {
  timer: number;
  turnInfo: { name: string; team: string };
  isTeamMode: boolean;
  currentPhase: 'A' | 'B' | 'C';
}

export default function CountdownStep({ timer, turnInfo, isTeamMode, currentPhase }: CountdownStepProps) {
  const getPhaseRule = () => {
    switch(currentPhase) {
      case 'A': return "שלב א: ניתן להיעזר בפנטומימה ומילים";
      case 'B': return "שלב ב: רק מילה אחת";
      case 'C': return "שלב ג: רק פנטומימה";
      default: return "";
    }
  };

  return (
    <div style={{...styles.flexLayout, height: '100dvh', justifyContent: 'center'}}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ fontSize: '24px', color: '#64748b', marginBottom: '10px' }}>מתחילים בעוד...</div>
        <div style={{ fontSize: '110px', fontWeight: '900', color: '#ffd700', lineHeight: '1' }}>{timer}</div>
      </div>

      <div style={{ backgroundColor: 'rgba(255,215,0,0.1)', padding: '15px 25px', borderRadius: '20px', border: '1px solid #ffd700', marginBottom: '30px', textAlign: 'center', width: '90%', maxWidth: '350px' }}>
        <div style={{ color: '#ffd700', fontSize: '1.2rem', fontWeight: 'bold' }}>{getPhaseRule()}</div>
      </div>

      <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '24px', width: '320px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '18px', color: '#64748b', marginBottom: '8px' }}>תור השחקן:</div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>{turnInfo.name}</div>
        {isTeamMode && (
          <div style={{ fontSize: '20px', color: '#ffd700', marginTop: '5px' }}>{turnInfo.team}</div>
        )}
      </div>
    </div>
  );
}