"use client";

import React, { useState, useRef, useEffect } from "react";
import { styles } from "../game.styles";

interface SetupStepProps {
  roomId: string; gameMode: "individual" | "team"; setGameMode: (m: "individual" | "team") => void;
  difficulty: "age-appropriate" | "easy"; setDifficulty: (d: "age-appropriate" | "easy") => void;
  numTeams: number; setNumTeams: (n: number) => void; players: any[];
  onPlayerMove: (pId: string, tIdx: number) => void; onStart: () => void; teamNames: string[];
  updateTeamNames: (names: string[]) => void; onExit: () => void; editTeamName: (idx: number) => void;
}

export default function SetupStep(props: SetupStepProps) {
  const [draggedPlayer, setDraggedPlayer] = useState<any>(null);
  const [hoveredTeam, setHoveredTeam] = useState<number | null>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const teamRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (draggedPlayer) e.preventDefault();
    };
    document.addEventListener('touchmove', preventDefault, { passive: false });
    return () => document.removeEventListener('touchmove', preventDefault);
  }, [draggedPlayer]);

  const HEBREW_LETTERS = ['א', 'ב', 'ג', 'ד'];

  const getNextTeamName = () => {
    for (let letter of HEBREW_LETTERS) {
      const nameToCheck = `קבוצה ${letter}`;
      if (!props.teamNames.slice(0, props.numTeams).includes(nameToCheck)) return nameToCheck;
    }
    return `קבוצה ?`;
  };

  const handleAddTeam = () => {
    if (props.numTeams >= 4) return;
    const newNames = [...props.teamNames];
    newNames[props.numTeams] = getNextTeamName();
    props.updateTeamNames(newNames);
    props.setNumTeams(props.numTeams + 1);
  };

  const handleRemoveTeam = (idx: number) => {
    const newNames = [...props.teamNames];
    newNames.splice(idx, 1);
    props.updateTeamNames(newNames);
    props.setNumTeams(props.numTeams - 1);
  };

  const hasEmptyTeam = Array.from({ length: props.numTeams }).some((_, i) => 
    props.players.filter(p => p.teamIdx === i).length === 0
  );

  const canStart = props.gameMode === "individual" ? props.players.length >= 2 : 
    Array.from({ length: props.numTeams }).every((_, i) => props.players.filter(p => p.teamIdx === i).length >= 2);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedPlayer) return;
    if (ghostRef.current) {
      ghostRef.current.style.left = `${e.clientX - 60}px`;
      ghostRef.current.style.top = `${e.clientY - 25}px`;
    }
    let found: number | null = null;
    const count = props.gameMode === "team" ? props.numTeams : 1;
    for (let i = 0; i < count; i++) {
      const rect = teamRefs.current[i]?.getBoundingClientRect();
      if (rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        found = i;
        break;
      }
    }
    if (found !== hoveredTeam) setHoveredTeam(found);
  };

  const handleWhatsAppShare = () => {
    const shareUrl = `https://family-alias.vercel.app/?room=${props.roomId}`;
    const text = `בואו לשחק איתי מילה נרדפת! כנסו לקישור והצטרפו לחדר: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div 
      style={{ 
        ...styles.flexLayout, 
        display: 'grid',
        gridTemplateRows: 'auto auto 1fr auto',
        height: '100dvh',
        width: '100vw',
        maxWidth: '100%',
        gap: '10px',
        padding: '10px',
        margin: '0 auto',
        overflow: 'hidden',
        boxSizing: 'border-box',
        touchAction: 'none',
        userSelect: 'none',
        overscrollBehavior: 'none',
        direction: 'rtl'
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={() => {
        if (draggedPlayer && hoveredTeam !== null) props.onPlayerMove(draggedPlayer.id, hoveredTeam);
        setDraggedPlayer(null); setHoveredTeam(null);
      }}
    >
      <button onClick={props.onExit} style={{...styles.exitBtnRed, zIndex: 10}}>✕</button>

      {/* Header */}
      <div style={{...styles.setupHeader, width: '100%', boxSizing: 'border-box', padding: '0 5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px'}}>
        <div style={{ color: 'white', fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
          קוד: <span style={{ color: '#ffd700', fontWeight: '900', fontSize: '1.6rem', marginRight: '5px' }}>{props.roomId}</span>
        </div>
        <button onClick={handleWhatsAppShare} style={{ background: '#25D366', border: 'none', borderRadius: '50%', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.415 0 12.051c0 2.12.553 4.189 1.601 6.01L0 24l6.135-1.61a11.815 11.815 0 005.912 1.583h.005c6.635 0 12.05-5.417 12.05-12.052a11.75 11.75 0 00-3.528-8.52z"/></svg>
        </button>
      </div>

      {/* Toggles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          <button onClick={() => props.setGameMode("individual")} style={{ ...styles.bigToggleBtn, flex: 1, margin: 0, ...(props.gameMode === "individual" ? styles.bigToggleBtnActive : {}) }}>יחידים</button>
          <button onClick={() => props.setGameMode("team")} style={{ ...styles.bigToggleBtn, flex: 1, margin: 0, ...(props.gameMode === "team" ? styles.bigToggleBtnActive : {}) }}>קבוצות</button>
        </div>
        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          <button onClick={() => props.setDifficulty("age-appropriate")} style={{ ...styles.bigToggleBtn, flex: 1, margin: 0, ...(props.difficulty === "age-appropriate" ? styles.bigToggleBtnActive : {}) }}>מותאמת גיל</button>
          <button onClick={() => props.setDifficulty("easy")} style={{ ...styles.bigToggleBtn, flex: 1, margin: 0, ...(props.difficulty === "easy" ? styles.bigToggleBtnActive : {}) }}>רמה קלה</button>
        </div>
      </div>

      {/* Players Grid */}
      <div style={{ 
        ...styles.setupGrid, 
        gridTemplateColumns: props.gameMode === "team" ? '1fr 1fr' : '1fr',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        marginTop: 0,
        boxSizing: 'border-box',
        gap: '8px'
      }}>
        {Array.from({ length: props.gameMode === "team" ? props.numTeams : 1 }).map((_, tIdx) => {
          const teamPlayers = props.players.filter(p => props.gameMode === "individual" || p.teamIdx === tIdx);
          return (
            <div key={tIdx} ref={el => { teamRefs.current[tIdx] = el; }} style={{ 
              ...styles.teamBox, 
              minHeight: 0, 
              height: '100%', 
              width: '100%',
              display: 'flex', 
              flexDirection: 'column',
              boxSizing: 'border-box',
              touchAction: 'none',
              ...(hoveredTeam === tIdx ? { borderColor: '#ffd700', backgroundColor: 'rgba(255,215,0,0.1)' } : {}) 
            }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '4px', textAlign: 'center', fontSize: '0.75rem', color: '#ffd700', fontWeight: 'bold' }}>
                {props.gameMode === "team" ? props.teamNames[tIdx] : "משתתפים"}
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '5px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {teamPlayers.map(p => (
                  <div 
                    key={p.id} 
                    onPointerDown={(e) => {
                      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
                      setDraggedPlayer(p);
                    }} 
                    style={{ ...styles.playerCard, padding: '6px 2px', fontSize: '0.85rem', flexShrink: 0, touchAction: 'none', width: '100%', boxSizing: 'border-box' }}
                  >
                    {p.name}
                  </div>
                ))}
                {props.gameMode === "team" && props.numTeams > 2 && teamPlayers.length === 0 && (
                  <button onClick={() => handleRemoveTeam(tIdx)} style={{...styles.minusBtnCentered, margin: '5px auto'}}>-</button>
                )}
              </div>
            </div>
          );
        })}
        {props.gameMode === "team" && props.numTeams < 4 && !hasEmptyTeam && (
          <button onClick={handleAddTeam} style={{ ...styles.teamBox, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', minHeight: 0, width: '100%', boxSizing: 'border-box' }}>
            <span style={{ fontSize: '1.5rem', color: '#ffd700' }}>+</span>
          </button>
        )}
      </div>

      {/* Footer */}
      <div style={{ width: '100%', paddingBottom: '5px', boxSizing: 'border-box' }}>
        {!canStart && props.gameMode === "team" && <p style={{ color: '#ef4444', fontSize: '0.7rem', textAlign: 'center', marginBottom: '4px' }}>לפחות 2 בכל קבוצה</p>}
        <button onClick={props.onStart} disabled={!canStart} style={{...(canStart ? styles.lobbyButton : styles.disabledButton), width: '100%', margin: 0}}>בואו נשחק! 🚀</button>
      </div>

      {draggedPlayer && (
        <div ref={ghostRef} style={{ position: 'fixed', zIndex: 9999, pointerEvents: 'none', backgroundColor: '#ffd700', padding: '10px', borderRadius: '12px', color: '#05081c', fontWeight: 'bold', width: '100px', textAlign: 'center' }}>
          {draggedPlayer.name}
        </div>
      )}
    </div>
  );
}