"use client";
import React, { useMemo } from "react";

export default function GameStep({ roomData, userId, targets, updateRoom, handleAction, onExit }: any) {
  const currentP = roomData.players[roomData.currentTurnIdx];
  const isIDescriber = currentP.id === userId;
  const me = roomData.players.find((p: any) => p.id === userId);

  const myDisplayScore = useMemo(() => {
    const myTeamName = roomData.teamNames[me?.teamIdx];
    return roomData.totalScores[myTeamName] || 0;
  }, [roomData.totalScores, me, roomData.teamNames]);

  const wordData = useMemo(() => {
    const difficulty = roomData.difficulty || "easy";
    const pool = roomData.shuffledPools || [];
    const index = roomData.poolIndex || 0;
    const showImage = difficulty === "easy";
    
    return { 
      ...(pool[index % (pool.length || 1)] || { word: "טוען...", en: "", category: "" }), 
      showImage 
    };
  }, [roomData.poolIndex, roomData.shuffledPools, roomData.difficulty]);

  const phaseInfo = useMemo(() => {
    switch (roomData.currentPhase) {
      case 'A': return { title: "סבב א': בניית החפיסה", instruction: "תיאור חופשי - כולם מנחשים!" };
      case 'B': return { title: "סבב ב': מילה אחת", instruction: "מילה אחת בלבד - רק הקבוצה שלך מנחשת!" };
      case 'C': return { title: "סבב ג': פנטומימה", instruction: "פנטומימה בלבד (ללא קול) - רק הקבוצה שלך מנחשת!" };
      default: return { title: "", instruction: "" };
    }
  }, [roomData.currentPhase]);

  return (
    <div style={s.layout}>
      <div style={s.header}>
        <div style={s.scoreBox}>🏆 {myDisplayScore}</div>
        <div style={{...s.timer, color: roomData.timeLeft <= 10 ? '#ef4444' : '#00f2ff'}}>
          {roomData.timeLeft}s
        </div>
        {/* עדכון: הפסקה גלובלית דרך Firebase */}
        <button onClick={() => updateRoom({ isPaused: true })} style={s.icon}>⏸</button>
      </div>

      <div style={s.phaseHeader}>
        <div style={s.phaseTitle}>{phaseInfo.title}</div>
        <div style={s.phaseInstruction}>{phaseInfo.instruction}</div>
      </div>
      
      {isIDescriber && (
        <button onClick={() => handleAction("SKIP")} style={s.skip}>
          {roomData.currentPhase === 'A' ? "דלג (ללא קנס)" : "דלג (2- נקודות)"}
        </button>
      )}

      <div style={s.center}>
          <div style={s.card}>
            {isIDescriber ? (
              <>
                {wordData.showImage && wordData.img && (
                  <div style={s.imgBox}><img src={wordData.img} alt="" style={s.img} /></div>
                )}
                <div style={wordData.showImage ? s.heb : s.hebL}>{wordData.word}</div>
                <div style={wordData.showImage ? s.en : s.enL}>{wordData.en}</div>
                <div style={s.catLabel}>{wordData.category}</div>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ color: '#00f2ff', fontSize: '2.2rem', marginBottom: '10px' }}>{currentP.name}</h2>
                <p style={{ opacity: 0.8, fontSize: '1.2rem' }}>מתאר/ת עכשיו...</p>
                <p style={{ color: '#00f2ff', fontWeight: 'bold', marginTop: '10px' }}>{phaseInfo.instruction}</p>
              </div>
            )}
          </div>
      </div>

      {isIDescriber && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ textAlign: 'center', fontSize: '0.9rem', opacity: 0.8, color: '#00f2ff' }}>מי ניחש נכון?</p>
          <div style={s.grid}>
            {targets.map((name: string) => (
              <button key={name} onClick={() => handleAction(name)} style={s.target}>{name}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const s: any = {
  layout: { display: 'flex', flexDirection: 'column', height: '100%', padding: 'env(safe-area-inset-top) 20px 20px', gap: '10px', maxWidth: '600px', margin: '0 auto', direction: 'rtl' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' },
  scoreBox: { backgroundColor: 'rgba(0, 242, 255, 0.15)', padding: '8px 15px', borderRadius: '15px', color: '#00f2ff', fontWeight: '900', fontSize: '1.2rem' },
  timer: { fontSize: '2.5rem', fontWeight: '900' },
  icon: { background: 'none', border: 'none', color: 'white', fontSize: '1.8rem' },
  phaseHeader: { textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '15px', border: '1px solid rgba(0, 242, 255, 0.2)' },
  phaseTitle: { color: '#00f2ff', fontWeight: 'bold', fontSize: '1rem' },
  phaseInstruction: { color: 'white', fontSize: '0.9rem', opacity: 0.9 },
  skip: { width: '100%', minHeight: '50px', border: '2px dashed #ef4444', borderRadius: '15px', color: '#ef4444', fontWeight: 'bold', background: 'none' },
  center: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  card: { width: '100%', backgroundColor: '#1a1d2e', borderRadius: '35px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0, 242, 255, 0.2)' },
  imgBox: { height: '150px', marginBottom: '10px' },
  img: { height: '100%', objectFit: 'contain' },
  heb: { fontSize: '1.8rem', fontWeight: '900', textAlign: 'center', wordBreak: 'break-word', color: 'white' }, 
  en: { fontSize: '1.2rem', opacity: 0.6, textAlign: 'center', wordBreak: 'break-word', color: '#00f2ff' },
  hebL: { fontSize: '2.5rem', fontWeight: '900', textAlign: 'center', wordBreak: 'break-word', color: 'white' }, 
  enL: { fontSize: '1.5rem', opacity: 0.6, textAlign: 'center', wordBreak: 'break-word', color: '#00f2ff' },
  catLabel: { marginTop: '10px', fontSize: '0.8rem', backgroundColor: 'rgba(0, 242, 255, 0.2)', padding: '4px 12px', borderRadius: '15px', color: '#00f2ff' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', paddingBottom: '10px' },
  target: { height: '60px', border: '2px solid #00f2ff', borderRadius: '20px', fontSize: '1.1rem', fontWeight: '900', color: '#00f2ff', background: 'none' }
};