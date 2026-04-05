"use client";
import React, { useMemo } from "react";

export default function GameStep({ roomData, userId, targets, updateRoom, handleAction, onExit }: any) {
  const currentP = roomData.players[roomData.currentTurnIdx];
  const isIDescriber = currentP.id === userId;
  const me = roomData.players.find((p: any) => p.id === userId);

  const myDisplayScore = useMemo(() => {
    return roomData.gameMode === 'individual' ? (roomData.totalScores[me?.name] || 0) : (roomData.totalScores[roomData.teamNames[me?.teamIdx]] || 0);
  }, [roomData.totalScores, roomData.gameMode, me, roomData.teamNames]);

  const wordData = useMemo(() => {
    const pool = roomData.shuffledPools?.JUNIOR || [];
    const index = roomData.poolIndices?.JUNIOR || 0;
    return pool[index % (pool.length || 1)] || { word: "טוען...", en: "" };
  }, [roomData.currentTurnIdx, roomData.poolIndices, roomData.shuffledPools]);

  const isPhaseA = roomData.currentPhase === 'A';
  const isPhaseC = roomData.currentPhase === 'C';

  const s: any = {
    layout: { display: 'flex', flexDirection: 'column', height: '100dvh', padding: 'env(safe-area-inset-top) 20px 20px', gap: '10px', maxWidth: '600px', margin: '0 auto', direction: 'rtl', boxSizing: 'border-box' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.1)' },
    scoreBox: { backgroundColor: 'rgba(0, 242, 255, 0.15)', padding: '8px 15px', borderRadius: '15px', color: '#00f2ff', fontWeight: '900', fontSize: '1.2rem', minWidth: '70px', textAlign: 'center' },
    timer: { fontSize: '2.5rem', fontWeight: '900', color: '#ef4444', position: 'absolute', left: '50%', transform: 'translateX(-50%)' },
    icon: { background: 'none', border: 'none', color: 'white', fontSize: '1.8rem', cursor: 'pointer' },
    skip: { width: '100%', height: '55px', border: '2px dashed #ef4444', borderRadius: '15px', color: '#ef4444', fontWeight: 'bold', background: 'none', cursor: 'pointer' },
    center: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    card: { width: '100%', maxWidth: '320px', height: '280px', backgroundColor: '#1a1d2e', borderRadius: '35px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    hebL: { fontSize: '2.5rem', fontWeight: '900', textAlign: 'center' }, enL: { fontSize: '1.6rem', opacity: 0.6, textAlign: 'center' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', paddingBottom: '10px' },
    target: { height: '70px', border: '2px solid #00f2ff', borderRadius: '20px', fontSize: '1.1rem', fontWeight: '900', backgroundColor: 'rgba(0, 242, 255, 0.05)', color: '#00f2ff', cursor: 'pointer' },
    pauseBox: { width: '100%', height: '100%', backgroundColor: '#1a1d2e', borderRadius: '35px', padding: '20px', display: 'flex', flexDirection: 'column' },
    scroll: { flex: 1, overflowY: 'auto' }, row: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #333' },
    miniBtn: { width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #00f2ff', background: 'none', color: '#00f2ff' },
    resume: { height: '50px', backgroundColor: '#00f2ff', color: '#05081c', borderRadius: '15px', fontWeight: 'bold', border: 'none', marginTop: '10px' }
  };

  if (!isIDescriber) {
    return (
      <div style={s.layout}>
        <div style={s.header}><div style={s.scoreBox}>🏆 {myDisplayScore}</div><div style={s.timer}>{roomData.timeLeft}</div><button onClick={onExit} style={s.icon}>✕</button></div>
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <h2 style={{ color: '#00f2ff', fontSize: '2rem' }}>{currentP.name} מתאר/ת...</h2>
          <p style={{ opacity: 0.7 }}>{isPhaseA ? "שלב א': כולם מנחשים!" : isPhaseC ? "סבב ג': פנטומימה בלבד!" : "היו מוכנים לנחש!"}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.layout}>
      <div style={s.header}>
        <div style={s.scoreBox}>🏆 {myDisplayScore}</div><div style={s.timer}>{roomData.timeLeft}</div>
        <div style={{ display: 'flex', gap: '15px' }}><button onClick={() => updateRoom({ isPaused: !roomData.isPaused })} style={s.icon}>{roomData.isPaused ? '▶️' : '⏸️'}</button><button onClick={onExit} style={s.icon}>✕</button></div>
      </div>
      <button onClick={() => handleAction("SKIP")} style={s.skip}>דילוג {isPhaseA ? "" : "(2-)"}</button>
      <div style={s.center}>
        {roomData.isPaused ? (
          <div style={s.pauseBox}><h3 style={{ color: '#00f2ff', textAlign: 'center' }}>ניהול ניקוד</h3><div style={s.scroll}>
            {(roomData.gameMode === 'individual' ? roomData.players.map((p: any) => p.name) : roomData.teamNames.slice(0, roomData.numTeams)).map((n: string) => (
              <div key={n} style={s.row}><span>{n}</span><div style={{ display: 'flex', gap: '15px' }}>
                <button style={s.miniBtn} onClick={() => { const sc = {...roomData.totalScores}; sc[n] = (sc[n] || 0) - 1; updateRoom({totalScores: sc}); }}>-</button>
                <span style={{ minWidth: '30px', textAlign: 'center' }}>{roomData.totalScores[n] || 0}</span>
                <button style={s.miniBtn} onClick={() => { const sc = {...roomData.totalScores}; sc[n] = (sc[n] || 0) + 1; updateRoom({totalScores: sc}); }}>+</button>
              </div></div>
            ))}
          </div><button onClick={() => updateRoom({ isPaused: false })} style={s.resume}>המשך</button></div>
        ) : (
          <div style={s.card}>
            {isPhaseC ? <div style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '10px' }}>🎭 פנטומימה בלבד!</div> : !isPhaseA ? <div style={{ color: '#00f2ff', fontWeight: 'bold', marginBottom: '10px' }}>🗣️ מילה אחת בלבד!</div> : null}
            <div style={s.hebL}>{wordData.word}</div><div style={s.enL}>{wordData.en}</div>
            {isPhaseA && <div style={{marginTop: '15px', color: '#00f2ff', fontSize: '0.9rem'}}>חפיסה: {roomData.gameDeck?.length || 0} / {roomData.players.length * 5}</div>}
          </div>
        )}
      </div>
      {!roomData.isPaused && <div style={s.grid}>{targets.map((n: string) => <button key={n} onClick={() => handleAction(n)} style={s.target}>{n} (+1)</button>)}</div>}
    </div>
  );
}