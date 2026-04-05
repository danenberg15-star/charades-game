"use client";
import React, { useState, useMemo } from "react";

export default function SevenBoomStep({ roomData, userId, updateRoom, handleAction, onExit }: any) {
  const [showExplanation, setShowExplanation] = useState(true);
  const [wordsCount, setWordsCount] = useState(0);

  const currentP = roomData.players[roomData.currentTurnIdx];
  const isIDescriber = currentP.id === userId;
  const me = roomData.players.find((p: any) => p.id === userId);

  const myDisplayScore = useMemo(() => {
    if (roomData.gameMode === 'individual') return roomData.totalScores[me?.name] || 0;
    const myTeamName = roomData.teamNames[me?.teamIdx];
    return roomData.totalScores[myTeamName] || 0;
  }, [roomData.totalScores, roomData.gameMode, me, roomData.teamNames]);

  const wordData = useMemo(() => {
    // במשחק הסלבריטאים אנו משתמשים במאגר JUNIOR כברירת מחדל או בחפיסה שנבנתה (כאן ברירת מחדל לפי הקוד המקורי)
    const pool = roomData.shuffledPools?.JUNIOR || [];
    const idxs = roomData.poolIndices || { JUNIOR: 0 };
    const index = idxs.JUNIOR || 0;
    
    return pool[index % (pool.length || 1)] || { word: "טוען...", en: "", category: "generic" };
  }, [roomData.poolIndices, roomData.shuffledPools]);

  // פונקציית עזר להצגת אייקון לפי קטגוריה
  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'singer': return '🎤';
      case 'actor': return '🎬';
      case 'athlete': return '⚽';
      case 'politician': return '🏛️';
      case 'influencer': return '🤳';
      default: return '⭐';
    }
  };

  const handleCorrect = (teamName: string) => {
    handleAction(teamName, 2);
    // בסיום 7 מילים, חוזרים לשלב 6 (ScoreStep) של הסבב המקורי
    if (wordsCount + 1 >= 7) updateRoom({ step: 6 });
    else setWordsCount(prev => prev + 1);
  };

  const handleSkip = () => {
    // דילוג ב-7 בום עשוי לגרור קנס לפי חוקי הדילוג של handleScoreAction ב-page
    handleAction("SKIP");
    if (wordsCount + 1 >= 7) updateRoom({ step: 6 });
    else setWordsCount(prev => prev + 1);
  };

  if (showExplanation) {
    return (
      <div style={{...s.layout, justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
        <div style={s.pauseBox}>
          <h1 style={{ color: '#00f2ff', fontSize: '3rem', fontWeight: '900', marginBottom: '20px' }}>7 בום! 💣</h1>
          <div style={{ color: 'white', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '30px' }}>
            <p><strong>בשלב זה אין טיימר!</strong></p>
            <p>עליכם לתאר 7 מילים ברצף.</p>
            <p>כולם מנחשים. <b>כל ניחוש נכון שווה 2 נקודות!</b></p>
          </div>
          <button onClick={() => setShowExplanation(false)} style={s.resume}>הבנתי, בואו נתחיל!</button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.layout}>
      <div style={s.header}>
        <div style={s.scoreBox}>🏆 {myDisplayScore}</div>
        <div style={{...s.timer, color: '#00f2ff', fontSize: '1.5rem', width: 'max-content'}}>מילה {wordsCount + 1} / 7</div>
        <button onClick={onExit} style={s.icon}>✕</button>
      </div>
      <button onClick={handleSkip} style={s.skip}>דלג (קנס אפשרי)</button>
      <div style={s.center}>
          <div style={s.card}>
            {isIDescriber ? (
              <>
                <div style={s.categoryIcon}>{getCategoryIcon(wordData.category)}</div>
                <div style={s.hebL}>{wordData.word}</div>
                <div style={s.enL}>{wordData.en}</div>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ color: '#00f2ff', fontSize: '2rem', fontWeight: '900' }}>{currentP.name} מתאר/ת...</h2>
                <p style={{ opacity: 0.7 }}>כל הקבוצות יכולות לנחש!</p>
              </div>
            )}
          </div>
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <p style={{ textAlign: 'center', fontSize: '0.9rem', opacity: 0.8 }}>מי ניחש נכון? (2+)</p>
        <div style={s.grid}>
          {roomData.teamNames.slice(0, roomData.numTeams).map((n: string) => (
            <button key={n} onClick={() => handleCorrect(n)} style={s.target}>{n}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

const s: any = {
  layout: { display: 'flex', flexDirection: 'column', height: '100dvh', padding: 'env(safe-area-inset-top) 20px 20px', gap: '10px', maxWidth: '600px', margin: '0 auto', direction: 'rtl', boxSizing: 'border-box', backgroundColor: '#05081c' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', position: 'relative' },
  scoreBox: { backgroundColor: 'rgba(0, 242, 255, 0.15)', padding: '8px 15px', borderRadius: '15px', color: '#00f2ff', fontWeight: '900', fontSize: '1.2rem' },
  timer: { fontSize: '2rem', fontWeight: '900' },
  icon: { background: 'none', border: 'none', color: 'white', fontSize: '1.8rem', cursor: 'pointer' },
  skip: { width: '100%', minHeight: '55px', border: '2px dashed #ef4444', borderRadius: '15px', color: '#ef4444', fontWeight: 'bold', background: 'none', cursor: 'pointer' },
  center: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  card: { width: '100%', maxWidth: '320px', height: '320px', backgroundColor: '#1a1d2e', borderRadius: '35px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(0, 242, 255, 0.1)' },
  categoryIcon: { fontSize: '4.5rem', marginBottom: '15px', filter: 'drop-shadow(0 0 10px rgba(0, 242, 255, 0.5))' },
  hebL: { fontSize: '2.5rem', fontWeight: '900', wordBreak: 'break-word', textAlign: 'center', color: 'white' },
  enL: { fontSize: '1.5rem', opacity: 0.6, wordBreak: 'break-word', textAlign: 'center', color: '#00f2ff' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  target: { height: '60px', border: '2px solid #00f2ff', borderRadius: '15px', color: '#00f2ff', fontWeight: '900', background: 'rgba(0, 242, 255, 0.05)', cursor: 'pointer' },
  pauseBox: { backgroundColor: '#0f172a', borderRadius: '24px', padding: '25px', border: '1px solid #00f2ff' },
  resume: { height: '55px', backgroundColor: '#00f2ff', color: '#05081c', borderRadius: '15px', fontWeight: '900', border: 'none', width: '100%', cursor: 'pointer' }
};