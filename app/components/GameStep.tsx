"use client";
import React, { useMemo } from "react";

export default function GameStep({ roomData, userId, targets, updateRoom, handleAction, onExit }: any) {
  const currentP = roomData.players[roomData.currentTurnIdx];
  const isIDescriber = currentP.id === userId;
  const me = roomData.players.find((p: any) => p.id === userId);

  const myDisplayScore = useMemo(() => {
    if (roomData.gameMode === 'individual') {
      return roomData.totalScores[me?.name] || 0;
    } else {
      const myTeamName = roomData.teamNames[me?.teamIdx];
      return roomData.totalScores[myTeamName] || 0;
    }
  }, [roomData.totalScores, roomData.gameMode, me]);

  const wordData = useMemo(() => {
    const difficulty = roomData.difficulty || "age-appropriate";
    const idxs = roomData.poolIndices || { KIDS: 0, JUNIOR: 0, TEEN: 0, ADULT: 0 };
    const pool = roomData.shuffledPools?.JUNIOR || [];
    const index = (idxs.KIDS + idxs.JUNIOR + idxs.TEEN + idxs.ADULT) || 0;
    
    // הצגת תמונה נקבעת כעת רק לפי רמת הקושי
    const showImage = difficulty === "easy";
    
    return { 
      ...(pool[index % (pool.length || 1)] || { word: "טוען...", en: "" }), 
      showImage
    };
  }, [roomData.poolIndices, roomData.shuffledPools, roomData.difficulty]);

  return (
    <div style={s.layout}>
      <div style={s.header}>
        <div style={s.scoreBox}>🏆 {myDisplayScore}</div>
        <div style={s.timer}>{roomData.timeLeft}</div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => updateRoom({ isPaused: !roomData.isPaused })} style={s.icon}>
            {roomData.isPaused ? '▶️' : '⏸️'}
          </button>
          <button onClick={onExit} style={s.icon}>✕</button>
        </div>
      </div>
      
      {isIDescriber && !roomData.isPaused && (
        <button onClick={() => handleAction("SKIP")} style={s.skip}>דלג (1-)</button>
      )}

      <div style={s.center}>
        {roomData.isPaused ? (
          <div style={s.pauseBox}>
            <h3 style={{ color: '#00f2ff', textAlign: 'center', marginBottom: '15px' }}>ניהול ניקוד</h3>
            <div style={s.scroll}>
              {(roomData.gameMode === 'individual' ? roomData.players.map((p: any) => p.name) : roomData.teamNames.slice(0, roomData.numTeams)).map((n: string) => (
                <div key={n} style={s.row}>
                  <span style={{ color: 'white' }}>{n}</span>
                  <div style={s.rowBtn}>
                    <button style={s.miniBtn} onClick={() => { 
                      const sc = {...roomData.totalScores}; sc[n] = (sc[n] || 0) - 1; 
                      updateRoom({totalScores: sc}); 
                    }}>-</button>
                    <span style={{ minWidth: '30px', textAlign: 'center', color: '#00f2ff', fontWeight: 'bold' }}>{roomData.totalScores[n] || 0}</span>
                    <button style={s.miniBtn} onClick={() => { 
                      const sc = {...roomData.totalScores}; sc[n] = (sc[n] || 0) + 1; 
                      updateRoom({totalScores: sc}); 
                    }}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => updateRoom({ isPaused: false })} style={s.resume}>המשך במשחק</button>
          </div>
        ) : (
          <div style={s.card}>
            {isIDescriber ? (
              <>
                {wordData.showImage && wordData.img && (
                  <div style={s.imgBox}>
                    <img src={wordData.img} alt="" style={s.img} />
                  </div>
                )}
                <div style={wordData.showImage ? s.heb : s.hebL}>{wordData.word}</div>
                <div style={wordData.showImage ? s.en : s.enL}>{wordData.en}</div>
                <div style={s.catLabel}>{wordData.category}</div>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ color: '#00f2ff', fontSize: '2rem', marginBottom: '10px' }}>{currentP.name}</h2>
                <p style={{ opacity: 0.8, fontSize: '1.2rem' }}>מתאר/ת עכשיו...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {isIDescriber && !roomData.isPaused && (
        <div style={s.grid}>
          {targets.map((n: string) => (
            <button key={n} onClick={() => handleAction(n)} style={s.target}>{n}</button>
          ))}
        </div>
      )}
    </div>
  );
}

const s: any = {
  layout: { display: 'flex', flexDirection: 'column', height: '100%', padding: 'env(safe-area-inset-top) 20px 20px', gap: '10px', maxWidth: '600px', margin: '0 auto', direction: 'rtl' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  scoreBox: { backgroundColor: 'rgba(0, 242, 255, 0.15)', padding: '8px 15px', borderRadius: '15px', color: '#00f2ff', fontWeight: '900', fontSize: '1.2rem', minWidth: '70px', textAlign: 'center' },
  timer: { fontSize: '2.5rem', fontWeight: '900', color: '#ef4444', position: 'absolute', left: '50%', transform: 'translateX(-50%)' },
  icon: { background: 'none', border: 'none', color: 'white', fontSize: '1.8rem', cursor: 'pointer', padding: '5px' },
  skip: { width: '100%', height: '55px', border: '2px dashed #ef4444', borderRadius: '15px', color: '#ef4444', fontWeight: 'bold', background: 'none', cursor: 'pointer', fontSize: '1.1rem' },
  center: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '10px 0' },
  card: { width: '100%', maxWidth: '340px', height: '100%', maxHeight: '300px', backgroundColor: '#1a1d2e', borderRadius: '35px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', overflow: 'hidden', border: '1px solid rgba(0, 242, 255, 0.1)' },
  imgBox: { width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'contain' },
  heb: { fontSize: '1.8rem', fontWeight: '900', textAlign: 'center', wordBreak: 'break-word', color: 'white' }, 
  en: { fontSize: '1.3rem', opacity: 0.6, textAlign: 'center', wordBreak: 'break-word', color: '#00f2ff' },
  hebL: { fontSize: '2.5rem', fontWeight: '900', textAlign: 'center', wordBreak: 'break-word', color: 'white' }, 
  enL: { fontSize: '1.6rem', opacity: 0.6, textAlign: 'center', wordBreak: 'break-word', color: '#00f2ff' },
  catLabel: { marginTop: '10px', fontSize: '0.8rem', backgroundColor: 'rgba(0, 242, 255, 0.2)', padding: '4px 12px', borderRadius: '15px', color: '#00f2ff' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', paddingBottom: '10px' },
  target: { height: '75px', border: '2px solid #00f2ff', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '900', backgroundColor: 'rgba(0, 242, 255, 0.05)', color: '#00f2ff', cursor: 'pointer' },
  pauseBox: { width: '100%', height: '100%', backgroundColor: '#1a1d2e', borderRadius: '35px', padding: '20px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(0, 242, 255, 0.2)' },
  scroll: { flex: 1, overflowY: 'auto', margin: '10px 0' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #333', alignItems: 'center' },
  rowBtn: { display: 'flex', gap: '15px', alignItems: 'center' },
  miniBtn: { width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #00f2ff', background: 'none', color: '#00f2ff', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' },
  resume: { height: '55px', backgroundColor: '#00f2ff', color: '#05081c', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', border: 'none', marginTop: '10px', fontSize: '1.1rem' }
};