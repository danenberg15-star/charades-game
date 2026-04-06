"use client";
import React, { useMemo } from "react";
import { increment } from "firebase/firestore";

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
      {/* תפריט השהייה עם עריכת נקודות */}
      {roomData.isPaused && (
        <div style={s.pauseOverlay}>
          <div style={s.pauseModal}>
            <button onClick={() => updateRoom({ isPaused: false })} style={s.closePause}>✕</button>
            <h2 style={{ color: '#00f2ff', marginBottom: '5px', marginTop: '10px' }}>המשחק מושהה</h2>
            <p style={{ color: 'white', marginBottom: '20px', opacity: 0.8 }}>עריכת נקודות ידנית:</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
              {roomData.teamNames.slice(0, roomData.numTeams).map((teamName: string) => (
                <div key={teamName} style={s.scoreEditRow}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>{teamName}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => updateRoom({ [`totalScores.${teamName}`]: increment(-1) })} style={s.scoreBtn}>-</button>
                    <span style={{ fontSize: '1.5rem', fontWeight: '900', minWidth: '30px', textAlign: 'center', color: '#00f2ff' }}>
                      {roomData.totalScores[teamName] || 0}
                    </span>
                    <button onClick={() => updateRoom({ [`totalScores.${teamName}`]: increment(1) })} style={s.scoreBtn}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={s.header}>
        <div style={s.scoreBox}>🏆 {myDisplayScore}</div>
        <div style={{...s.timer, color: roomData.timeLeft <= 10 ? '#ef4444' : '#00f2ff'}}>
          {roomData.timeLeft}s
        </div>
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
                <p style={{ opacity: 0.8, fontSize: '1.2rem', color: 'white' }}>מתאר/ת עכשיו...</p>
                <p style={{ color: '#00f2ff', fontWeight: 'bold', marginTop: '10px' }}>{phaseInfo.instruction}</p>
              </div>
            )}
          </div>
      </div>

      {isIDescriber && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ textAlign: 'center', fontSize: '0.9rem', opacity: 0.8, color: '#00f2ff', margin: 0 }}>מי ניחש נכון?</p>
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
  layout: { 
    display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '100dvh', 
    padding: 'env(safe-area-inset-top) 20px 20px', gap: '10px', maxWidth: '600px', 
    margin: '0 auto', direction: 'rtl', boxSizing: 'border-box', overflowY: 'auto' 
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px', flexShrink: 0 },
  scoreBox: { backgroundColor: 'rgba(0, 242, 255, 0.15)', padding: '8px 15px', borderRadius: '15px', color: '#00f2ff', fontWeight: '900', fontSize: '1.2rem' },
  timer: { fontSize: '2.5rem', fontWeight: '900' },
  icon: { background: 'none', border: 'none', color: 'white', fontSize: '1.8rem', cursor: 'pointer' },
  phaseHeader: { textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '15px', border: '1px solid rgba(0, 242, 255, 0.2)', flexShrink: 0 },
  phaseTitle: { color: '#00f2ff', fontWeight: 'bold', fontSize: '1rem' },
  phaseInstruction: { color: 'white', fontSize: '0.9rem', opacity: 0.9 },
  skip: { width: '100%', minHeight: '50px', border: '2px dashed #ef4444', borderRadius: '15px', color: '#ef4444', fontWeight: 'bold', background: 'none', cursor: 'pointer', flexShrink: 0 },
  center: { flex: 1, minHeight: '20vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  card: { width: '100%', backgroundColor: '#1a1d2e', borderRadius: '35px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0, 242, 255, 0.2)' },
  imgBox: { height: '150px', maxHeight: '15vh', marginBottom: '10px' },
  img: { height: '100%', objectFit: 'contain' },
  heb: { fontSize: '1.8rem', fontWeight: '900', textAlign: 'center', wordBreak: 'break-word', color: 'white' }, 
  en: { fontSize: '1.2rem', opacity: 0.6, textAlign: 'center', wordBreak: 'break-word', color: '#00f2ff' },
  hebL: { fontSize: '2.5rem', fontWeight: '900', textAlign: 'center', wordBreak: 'break-word', color: 'white' }, 
  enL: { fontSize: '1.5rem', opacity: 0.6, textAlign: 'center', wordBreak: 'break-word', color: '#00f2ff' },
  catLabel: { marginTop: '10px', fontSize: '0.8rem', backgroundColor: 'rgba(0, 242, 255, 0.2)', padding: '4px 12px', borderRadius: '15px', color: '#00f2ff' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', paddingBottom: '15px', flexShrink: 0 },
  target: { height: '60px', border: '2px solid #00f2ff', borderRadius: '20px', fontSize: '1.1rem', fontWeight: '900', color: '#00f2ff', background: 'none', cursor: 'pointer' },
  
  // סגנונות חדשים עבור תפריט ההשהייה (Pause Overlay)
  pauseOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100dvh', backgroundColor: 'rgba(5, 8, 28, 0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box', direction: 'rtl' },
  pauseModal: { backgroundColor: '#1a1d2e', borderRadius: '25px', padding: '30px', width: '100%', maxWidth: '400px', border: '1px solid #00f2ff', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' },
  closePause: { position: 'absolute', top: '15px', left: '15px', background: 'none', border: 'none', color: '#ef4444', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' },
  scoreEditRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px 15px', borderRadius: '15px' },
  scoreBtn: { backgroundColor: '#00f2ff', color: '#05081c', border: 'none', borderRadius: '50%', width: '35px', height: '35px', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};