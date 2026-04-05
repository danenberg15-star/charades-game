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

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (draggedPlayer) e.preventDefault();
    };
    document.addEventListener('touchmove', preventDefault, { passive: false });
    return () => document.removeEventListener('touchmove', preventDefault);
  }, [draggedPlayer]);

  const handleAddTeam = () => {
    if (props.numTeams < 4) props.setNumTeams(props.numTeams + 1);
  };

  const handleRemoveTeam = (idx: number) => {
    props.players.forEach(p => {
      if (p.teamIdx === idx) props.onPlayerMove(p.id, 0);
      else if (p.teamIdx > idx) props.onPlayerMove(p.id, p.teamIdx - 1);
    });
    const newNames = [...props.teamNames];
    newNames.splice(idx, 1);
    newNames.push(`קבוצה ${String.fromCharCode(1488 + props.numTeams - 1)}'`);
    props.updateTeamNames(newNames);
    props.setNumTeams(props.numTeams - 1);
  };

  const canStart = props.gameMode === "individual" 
    ? props.players.length >= 2
    : Array.from({ length: props.numTeams }).every((_, i) => props.players.filter(p => p.teamIdx === i).length >= 2);

  const hasEmptyTeam = props.gameMode === "team" && Array.from({ length: props.numTeams }).some((_, i) => props.players.filter(p => p.teamIdx === i).length === 0);

  return (
    <div style={{ ...styles.flexLayout, padding: '15px', justifyContent: 'flex-start', overflowY: 'auto', gap: '15px' }}>
      
      {/* Header */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={props.onExit} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '1.2rem', fontWeight: 'bold' }}>✕ יציאה</button>
        <div style={{ textAlign: 'right' }}>
          <h1 style={{ color: '#00f2ff', fontSize: '1.4rem', margin: 0, fontWeight: '900' }}>הגדרות חדר</h1>
          <p style={{ color: 'rgba(0, 242, 255, 0.7)', fontSize: '0.8rem', margin: 0 }}>קוד: <span style={{ color: 'white', fontWeight: 'bold' }}>{props.roomId}</span></p>
        </div>
      </div>

      {/* Mode Switch */}
      <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '4px', width: '100%' }}>
        <button 
          onClick={() => props.setGameMode("individual")}
          style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', fontWeight: 'bold', backgroundColor: props.gameMode === 'individual' ? '#00f2ff' : 'transparent', color: props.gameMode === 'individual' ? '#05081c' : 'white' }}
        >כולם נגד כולם</button>
        <button 
          onClick={() => props.setGameMode("team")}
          style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', fontWeight: 'bold', backgroundColor: props.gameMode === 'team' ? '#00f2ff' : 'transparent', color: props.gameMode === 'team' ? '#05081c' : 'white' }}
        >קבוצות</button>
      </div>

      {/* Difficulty Switch */}
      <div style={{ width: '100%' }}>
        <p style={{ color: '#00f2ff', fontSize: '0.8rem', marginBottom: '8px', fontWeight: 'bold', paddingRight: '5px' }}>רמת קושי:</p>
        <div style={{ display: 'flex', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '4px' }}>
          <button 
            onClick={() => props.setDifficulty("easy")}
            style={{ flex: 1, padding: '8px', borderRadius: '11px', border: 'none', fontSize: '0.9rem', fontWeight: 'bold', backgroundColor: props.difficulty === 'easy' ? '#00f2ff' : 'transparent', color: props.difficulty === 'easy' ? '#05081c' : 'white' }}
          >קל (עם תמונה)</button>
          <button 
            onClick={() => props.setDifficulty("hard")}
            style={{ flex: 1, padding: '8px', borderRadius: '11px', border: 'none', fontSize: '0.9rem', fontWeight: 'bold', backgroundColor: props.difficulty === 'hard' ? '#00f2ff' : 'transparent', color: props.difficulty === 'hard' ? '#05081c' : 'white' }}
          >קשה (ללא תמונה)</button>
        </div>
      </div>

      {/* Teams/Players Grid */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {Array.from({ length: props.gameMode === "individual" ? 1 : props.numTeams }).map((_, tIdx) => {
          const teamPlayers = props.players.filter(p => p.teamIdx === tIdx);
          return (
            <div 
              key={tIdx}
              ref={el => { teamRefs.current[tIdx] = el; }}
              style={{ ...styles.teamBox, position: 'relative', borderColor: hoveredTeam === tIdx ? '#00f2ff' : 'rgba(0, 242, 255, 0.2)', backgroundColor: hoveredTeam === tIdx ? 'rgba(0, 242, 255, 0.05)' : 'rgba(255,255,255,0.03)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ color: 'rgba(0, 242, 255, 0.5)', fontSize: '0.7rem' }}>{teamPlayers.length} שחקנים</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ color: '#00f2ff', margin: 0, fontSize: '1rem' }}>{props.gameMode === "individual" ? "רשימת שחקנים" : props.teamNames[tIdx]}</h3>
                  {props.gameMode === "team" && <button onClick={() => props.editTeamName(tIdx)} style={{ background: 'none', border: 'none', fontSize: '0.8rem' }}>✏️</button>}
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {teamPlayers.map(p => (
                  <div key={p.id} style={{ ...styles.playerChip, backgroundColor: '#00f2ff', color: '#05081c', fontWeight: 'bold', fontSize: '0.9rem' }}>{p.name}</div>
                ))}
              </div>

              {props.gameMode === "team" && props.numTeams > 2 && teamPlayers.length === 0 && (
                <div style={{ position: 'absolute', left: '10px', top: '10px' }}>
                  <button onClick={() => handleRemoveTeam(tIdx)} style={{ ...styles.minusBtnCentered, border: '1px solid #ef4444', color: '#ef4444' }}>-</button>
                </div>
              )}
            </div>
          );
        })}
        {props.gameMode === "team" && props.numTeams < 4 && !hasEmptyTeam && (
          <button onClick={handleAddTeam} style={{ ...styles.teamBox, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', minHeight: '60px' }}>
            <span style={{ fontSize: '1.2rem', color: '#00f2ff' }}>+ הוספת קבוצה</span>
          </button>
        )}
      </div>

      {/* Footer */}
      <div style={{ width: '100%', paddingBottom: '10px' }}>
        {!canStart && <p style={{ color: '#ef4444', fontSize: '0.75rem', textAlign: 'center', marginBottom: '8px' }}>{props.gameMode === "team" ? "לפחות 2 שחקנים בכל קבוצה" : "צריך לפחות 2 שחקנים"}</p>}
        <button 
          onClick={props.onStart} 
          disabled={!canStart} 
          style={{ ...(canStart ? styles.lobbyButton : styles.disabledButton), width: '100%', fontSize: '1.2rem' }}
        >בואו נשחק! 🚀</button>
      </div>
    </div>
  );
}