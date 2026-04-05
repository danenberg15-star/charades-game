"use client";
import React, { useState, useMemo } from "react";

export default function SevenBoomStep({ roomData, userId, updateRoom, handleAction, onExit }: any) {
  const [showExplanation, setShowExplanation] = useState(true);
  const [wordsCount, setWordsCount] = useState(0);

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

  const handleCorrect = (teamName: string) => {
    // שליחת 2 נקודות בונוס לפי האפיון
    handleAction(teamName, 2);
    if (wordsCount + 1 >= 7) {
      updateRoom({ step: 6 }); // חזרה למסך התוצאות בסיום 7 מילים
    } else {
      setWordsCount(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    // דילוג גורר קנס של 2- נקודות לפי אפיון סבב ב/ג
    handleAction("SKIP");
    if (wordsCount + 1 >= 7) {
      updateRoom({ step: 6 });
    } else {
      setWordsCount(prev => prev + 1);
    }
  };

  if (showExplanation) {
    return (
      <div style={{...s.layout, justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
        <div style={{...s.pauseBox, height: 'auto', padding: '40px 20px', maxWidth: '400px'}}>
          <h1 style={{ color: '#00f2ff', fontSize: '3.5rem', fontWeight: '900', marginBottom: '20px' }}>7 בום! 💣</h1>
          <div style={{ color: 'white', fontSize: '1.3rem', lineHeight: '1.6', marginBottom: '30px' }}>
            <p><strong>שלב בונוס ללא טיימר!</strong></p>
            <p>עליכם לתאר 7 מילים ברצף.</p>
            <p>הניחוש פתוח לכולם - <b>כל הצלחה שווה 2 נקודות!</b></p>
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
        <div style={{...s.timer, color: '#00f2ff', fontSize: '1.6rem', width: 'max-content'}}>מילה {wordsCount + 1} מתוך 7</div>
        <button onClick={onExit} style={s.icon}>✕</button>
      </div>
      
      {isIDescriber && (
        <button onClick={handleSkip} style={s.skip}>דלג (2- נקודות)</button>
      )}

      <div style={s.center}>
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
                <h2 style={{ color: '#00f2ff', fontSize: '2.2rem', marginBottom: '10px' }}>{currentP.name}</h2>
                <p style={{ opacity: 0.8, fontSize: '1.2rem' }}>מתאר/ת עכשיו (7 בום)...</p>
                <p style={{ color: '#00f2ff', fontWeight: 'bold', marginTop: '15px' }}>תחרות חופשית! כולם מנחשים!</p>
              </div>
            )}
          </div>
      </div>

      {isIDescriber && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ textAlign: 'center', fontSize: '0.9rem', opacity: 0.8, color: '#00f2ff' }}>מי מהקבוצות ניחשה נכון? (2+)</p>
          <div style={s.grid}>
            {roomData.teamNames.slice(0, roomData.numTeams).map((n: string) => (
              <button key={n} onClick={() => handleCorrect(n)} style={s.target}>{n}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const s: any = {
  layout: { display: 'flex', flexDirection: 'column', height: '100%', padding: 'env(safe-area-inset-top) 20px 20px', gap: '10px', maxWidth: '600px', margin: '0 auto', direction: 'rtl' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', position: 'relative' },
  scoreBox: { backgroundColor: 'rgba(0, 242, 255, 0.15)', padding: '8px 15px', borderRadius: '15px', color: '#00f2ff', fontWeight: '900', fontSize: '1.2rem' },
  timer: { fontSize: '2rem', fontWeight: '900', color: '#00f2ff' },
  icon: { background: 'none', border: 'none', color: 'white', fontSize: '1.8rem' },
  skip: { width: '100%', minHeight: '55px', border: '2px dashed #ef4444', borderRadius: '15px', color: '#ef4444', fontWeight: 'bold', background: 'none', cursor: 'pointer' },
  center: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  card: { width: '100%', backgroundColor: '#1a1d2e', borderRadius: '35px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(0, 242, 255, 0.1)' },
  imgBox: { height: '150px', marginBottom: '10px' },
  img: { height: '100%', objectFit: 'contain' },
  heb: { fontSize: '1.8rem', fontWeight: '900', wordBreak: 'break-word', textAlign: 'center', color: 'white' }, 
  hebL: { fontSize: '2.5rem', fontWeight: '900', wordBreak: 'break-word', textAlign: 'center', color: 'white' },
  en: { fontSize: '1.2rem', opacity: 0.6, wordBreak: 'break-word', textAlign: 'center', color: '#00f2ff' }, 
  enL: { fontSize: '1.5rem', opacity: 0.6, wordBreak: 'break-word', textAlign: 'center', color: '#00f2ff' },
  catLabel: { marginTop: '10px', fontSize: '0.8rem', backgroundColor: 'rgba(0, 242, 255, 0.2)', padding: '4px 12px', borderRadius: '15px', color: '#00f2ff' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  target: { height: '60px', border: '2px solid #00f2ff', borderRadius: '15px', color: '#00f2ff', fontWeight: '900', background: 'none', cursor: 'pointer' },
  pauseBox: { backgroundColor: '#0f172a', borderRadius: '24px', padding: '25px', border: '1px solid #00f2ff' },
  resume: { height: '55px', backgroundColor: '#00f2ff', color: '#05081c', borderRadius: '15px', fontWeight: '900', border: 'none', width: '100%', fontSize: '1.1rem', cursor: 'pointer' }
};