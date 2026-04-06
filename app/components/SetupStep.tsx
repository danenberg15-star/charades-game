"use client";

import React, { useState, useRef, useEffect } from "react";
import { styles } from "../game.styles";

interface SetupStepProps {
  roomId: string; 
  gameMode: "individual" | "team"; 
  setGameMode: (m: "individual" | "team") => void;
  difficulty: "hard" | "easy"; 
  setDifficulty: (d: "hard" | "easy") => void;
  numTeams: number; 
  setNumTeams: (n: number) => void; 
  players: any[];
  onPlayerMove: (pId: string, tIdx: number) => void; 
  onStart: () => void; 
  teamNames: string[];
  updateTeamNames: (names: string[]) => void; 
  onExit: () => void; 
  editTeamName: (idx: number) => void;
}

export default function SetupStep(props: SetupStepProps) {
  const [draggedPlayer, setDraggedPlayer] = useState<any>(null);
  const [hoveredTeam, setHoveredTeam] = useState<number | null>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const teamRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // מניעת גלילה בזמן גרירה במובייל
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
    props.players.forEach(p => {
      if (p.teamIdx === idx) props.onPlayerMove(p.id, 0);
      else if (p.teamIdx > idx) props.onPlayerMove(p.id, p.teamIdx - 1);
    });
    const newNames = [...props.teamNames];
    newNames.splice(idx, 1);
    props.updateTeamNames(newNames);
    props.setNumTeams(props.numTeams - 1);
  };

  const hasEmptyTeam = Array.from({ length: props.numTeams }).some((_, i) => 
    props.players.filter(p => p.teamIdx === i).length === 0
  );

  const canStart = Array.from({ length: props.numTeams }).every((_, i) => 
    props.players.filter(p => p.teamIdx === i).length >= 2
  );

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedPlayer) return;
    if (ghostRef.current) {
      ghostRef.current.style.left = `${e.clientX - 60}px`;
      ghostRef.current.style.top = `${e.clientY - 25}px`;
    }
    let found: number | null = null;
    for (let i = 0; i < props.numTeams; i++) {
      const rect = teamRefs.current[i]?.getBoundingClientRect();
      if (rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        found = i;
        break;
      }
    }
    if (found !== hoveredTeam) setHoveredTeam(found);
  };

  // תיקון: עדכון טקסט השיתוף והכתובת למשחק "תופסים את הסלב"
  const handleWhatsAppShare = () => {
    const shareUrl = `${window.location.origin}/?room=${props.roomId}`;
    const text = `בואו לשחק איתי "נחשו את הסלב"! כנסו לקישור והצטרפו לחדר: ${shareUrl}`;
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
        gap: '12px',
        padding: '15px',
        margin: '0 auto',
        overflow: 'hidden',
        boxSizing: 'border-box',
        touchAction: 'none',
        userSelect: 'none',
        overscrollBehavior: 'none',
        direction: 'rtl',
        backgroundColor: '#05081c'
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={() => {
        if (draggedPlayer && hoveredTeam !== null) props.onPlayerMove(draggedPlayer.id, hoveredTeam);
        setDraggedPlayer(null); setHoveredTeam(null);
      }}
    >
      <button onClick={props.onExit} style={{...styles.exitBtnRed, zIndex: 10, top: '20px', left: '20px'}}>✕</button>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
        <h1 style={{ color: 'white', fontSize: '1.3rem', margin: 0, fontWeight: '900' }}>הגדרות חדר</h1>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '12px', 
          backgroundColor: 'rgba(0, 242, 255, 0.05)', 
          padding: '8px 20px', borderRadius: '25px', 
          border: '1px solid rgba(0, 242, 255, 0.3)' 
        }}>
          <span style={{ color: 'white', fontSize: '1.1rem' }}>קוד:</span>
          <span style={{ color: '#00f2ff', fontWeight: '900', fontSize: '1.8rem' }}>{props.roomId}</span>
          <button onClick={handleWhatsAppShare} style={{ background: '#25D366', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginRight: '5px' }}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.415 0 12.051c0 2.12.553 4.189 1.601 6.01L0 24l6.135-1.61a11.815 11.815 0 005.912 1.583h.005c6.635 0 12.05-5.417 12.05-12.052a11.75 11.75 0 00-3.528-8.52z"/></svg>
          </button>
        </div>
      </div>

      <div style={{ height: '8px' }}></div> 

      <div style={{ 
        ...styles.setupGrid, 
        gridTemplateColumns: '1fr 1fr',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
        gap: '12px'
      }}>
        {Array.from({ length: props.numTeams }).map((_, tIdx) => {
          const teamPlayers = props.players.filter(p => p.teamIdx === tIdx);
          return (
            <div 
              key={tIdx} 
              ref={el => { teamRefs.current[tIdx] = el; }} 
              style={{ 
                ...styles.teamBox, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                backgroundColor: hoveredTeam === tIdx ? 'rgba(0, 242, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                borderColor: hoveredTeam === tIdx ? '#00f2ff' : 'rgba(0, 242, 255, 0.15)',
                borderWidth: '2px',
                borderRadius: '20px'
              }}
            >
              <div style={{ 
                padding: '8px', textAlign: 'center', fontSize: '0.85rem', 
                color: '#00f2ff', fontWeight: 'bold', 
                borderBottom: '1px solid rgba(0, 242, 255, 0.1)',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px'
              }}>
                {props.teamNames[tIdx]} 
                <button onClick={() => props.editTeamName(tIdx)} style={{background:'none', border:'none', cursor:'pointer', fontSize:'0.75rem'}}>✏️</button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {teamPlayers.map(p => (
                  <div 
                    key={p.id} 
                    onPointerDown={(e) => {
                      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
                      setDraggedPlayer(p);
                    }} 
                    style={{ 
                      ...styles.playerCard, 
                      backgroundColor: '#00f2ff', color: '#05081c', 
                      fontWeight: 'bold', borderRadius: '12px', 
                      padding: '10px', fontSize: '0.9rem', textAlign: 'center'
                    }}
                  >
                    {p.name}
                  </div>
                ))}
                {props.numTeams > 2 && teamPlayers.length === 0 && (
                  <button onClick={() => handleRemoveTeam(tIdx)} style={{...styles.minusBtnCentered, margin: '5px auto', color: '#ef4444', borderColor: '#ef4444'}}>-</button>
                )}
              </div>
            </div>
          );
        })}
        {props.numTeams < 4 && !hasEmptyTeam && (
          <button onClick={handleAddTeam} style={{ 
            ...styles.teamBox, borderStyle: 'dashed', 
            borderColor: 'rgba(0, 242, 255, 0.4)', 
            justifyContent: 'center', alignItems: 'center', 
            backgroundColor: 'transparent', borderRadius: '20px' 
          }}>
            <span style={{ fontSize: '2.5rem', color: '#00f2ff' }}>+</span>
          </button>
        )}
      </div>

      <div style={{ width: '100%', paddingBottom: '10px' }}>
        {!canStart && <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', marginBottom: '10px' }}>לפחות 2 שחקנים בכל קבוצה כדי להתחיל</p>}
        <button 
          onClick={props.onStart} 
          disabled={!canStart} 
          style={{
            ...styles.lobbyButton,
            backgroundColor: canStart ? '#00f2ff' : 'rgba(255,255,255,0.1)',
            color: canStart ? '#05081c' : 'rgba(255,255,255,0.3)',
            width: '100%', height: '65px', borderRadius: '20px', 
            fontSize: '1.5rem', fontWeight: '900', border: 'none'
          }}
        >
          בואו נשחק! 🚀
        </button>
      </div>

      {draggedPlayer && (
        <div ref={ghostRef} style={{ 
          position: 'fixed', zIndex: 9999, pointerEvents: 'none', 
          backgroundColor: '#00f2ff', padding: '12px 25px', 
          borderRadius: '15px', color: '#05081c', fontWeight: 'bold', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)', fontSize: '1rem' 
        }}>
          {draggedPlayer.name}
        </div>
      )}
    </div>
  );
}