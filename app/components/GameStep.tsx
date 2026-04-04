"use client";
import React, { useMemo } from "react";
import { styles } from "../game.styles";

export default function GameStep({ roomData, userId, updateRoom, handleAction, onExit, poolKey }: any) {
  const currentP = roomData.players[roomData.currentTurnIdx];
  const isIDescriber = currentP.id === userId;
  
  const wordData = useMemo(() => {
    const idx = roomData.poolIndices[poolKey] || 0;
    const pool = roomData.shuffledPools[poolKey] || [];
    return pool[idx % pool.length] || { word: "טוען...", hint: "" };
  }, [roomData.poolIndices, roomData.shuffledPools, poolKey]);

  if (!isIDescriber) {
    return (
      <div style={styles.flexLayout}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h2 style={{ fontSize: '2rem', color: '#ffd700' }}>{currentP.name} מתאר/ת...</h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>נסו לנחש מי הסלב!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.flexLayout}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffd700' }}>ניקוד: {roomData.roundScore}</div>
        <div style={{ fontSize: '2rem', fontWeight: '900', color: '#fff' }}>{roomData.timeLeft}s</div>
      </div>

      {/* Celebrity Card */}
      <div style={{ 
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '30px', width: '100%', margin: '20px 0',
        border: '2px solid rgba(255,215,0,0.3)', padding: '20px'
      }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', textAlign: 'center', marginBottom: '10px' }}>
          {wordData.word}
        </h1>
        <p style={{ fontSize: '1.5rem', color: '#ffd700', textAlign: 'center', opacity: 0.9 }}>
           💡 {wordData.hint}
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', width: '100%' }}>
        <button 
          onClick={() => handleAction(false)} 
          style={{ ...styles.lobbyButton, backgroundColor: '#ef4444', margin: 0 }}
        >
          דלג ⏭️
        </button>
        <button 
          onClick={() => handleAction(true)} 
          style={{ ...styles.lobbyButton, backgroundColor: '#22c55e', margin: 0 }}
        >
          נכון! ✅
        </button>
      </div>
    </div>
  );
}