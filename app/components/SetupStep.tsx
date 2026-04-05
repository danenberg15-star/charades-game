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
    props.updateTeamNames(newNames);
    props.setNumTeams(props.numTeams - 1);
  };

  const canStart = Array.from({ length: props.numTeams }).every((_, i) => 
    props.players.filter(p => p.teamIdx === i).length >= 2
  );

  const hasEmptyTeam = Array.from({ length: props.numTeams }).some((_, i) => 
    props.players.filter(p => p.teamIdx === i).length === 0
  );

  const handleWhatsAppShare = () => {
    const shareUrl = `https://family-alias.vercel.app/?room=${props.roomId}`;
    const text = `בואו לשחק איתי סלבס! כנסו לקישור והצטרפו לחדר: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div style={{ ...styles.flexLayout, padding: '20px', justifyContent: 'flex-start', overflowY: 'auto', gap: '20px', backgroundColor: '#05081c' }}>
      
      {/* Header - נקי וממוקד */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={props.onExit} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>הגדרות חדר</h1>
        </div>
        <button onClick={handleWhatsAppShare} style={{ background: '#25D366', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.415 0 12.051c0 2.12.553 4.189 1.601 6.01L0 24l6.135-1.61a11.815 11.815 0 005.912 1.583h.005c6.635 0 12.05-5.417 12.05-12.052a11.75 11.75 0 00-3.528-8.52z"/></svg>
        </button>
      </div>

      <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '10px 25px', borderRadius: '25px', border: '1px solid rgba(0, 242, 255, 0.3)', textAlign: 'center', alignSelf: 'center' }}>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>קוד חדר:</span>
        <div style={{ color: '#00f2ff', fontSize: '2.2rem', fontWeight: '900', lineHeight: '1.2' }}>{props.roomId}</div>
      </div>

      {/* Grid של קבוצות ושחקנים */}
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flex: 1 }}>
        {Array.from({ length: props.numTeams }).map((_, tIdx) => {
          const teamPlayers = props.players.filter(p => p.teamIdx === tIdx);
          return (
            <div 
              key={tIdx}
              ref={el => { teamRefs.current[tIdx] = el; }}
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.03)', 
                borderRadius: '24px', 
                border: hoveredTeam === tIdx ? '2px solid #00f2ff' : '1px solid rgba(0, 242, 255, 0.15)',
                display: 'flex', 
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ backgroundColor: 'rgba(0, 242, 255, 0.1)', padding: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: '#00f2ff', fontWeight: 'bold', fontSize: '0.9rem' }}>{props.teamNames[tIdx]}</span>
                <button onClick={() => props.editTeamName(tIdx)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>✏️</button>
              </div>

              <div style={{ flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                {teamPlayers.map(p => (
                  <div 
                    key={p.id} 
                    onPointerDown={(e) => { (e.target as HTMLElement).releasePointerCapture(e.pointerId); setDraggedPlayer(p); }}
                    style={{ backgroundColor: '#00f2ff', color: '#05081c', padding: '10px', borderRadius: '14px', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center', touchAction: 'none' }}
                  >
                    {p.name}
                  </div>
                ))}
                {props.numTeams > 2 && teamPlayers.length === 0 && (
                  <button onClick={() => handleRemoveTeam(tIdx)} style={{ border: '1px solid #ef4444', color: '#ef4444', background: 'none', borderRadius: '50%', width: '24px', height: '24px', alignSelf: 'center', cursor: 'pointer' }}>-</button>
                )}
              </div>
            </div>
          );
        })}
        {props.numTeams < 4 && !hasEmptyTeam && (
          <button onClick={handleAddTeam} style={{ border: '2px dashed rgba(0, 242, 255, 0.3)', borderRadius: '24px', background: 'none', color: '#00f2ff', fontSize: '2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
        )}
      </div>

      <div style={{ width: '100%', paddingBottom: '10px' }}>
        {!canStart && <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', marginBottom: '10px' }}>לפחות 2 שחקנים בכל קבוצה כדי להתחיל</p>}
        <button 
          onClick={props.onStart} 
          disabled={!canStart} 
          style={{ 
            width: '100%', height: '65px', borderRadius: '20px', 
            backgroundColor: canStart ? '#00f2ff' : 'rgba(255,255,255,0.1)', 
            color: canStart ? '#05081c' : 'rgba(255,255,255,0.3)', 
            fontWeight: '900', border: 'none', fontSize: '1.4rem', cursor: 'pointer' 
          }}
        >
          בואו נשחק! 🚀
        </button>
      </div>

      {draggedPlayer && (
        <div ref={ghostRef} style={{ position: 'fixed', zIndex: 9999, pointerEvents: 'none', backgroundColor: '#00f2ff', padding: '12px 20px', borderRadius: '15px', color: '#05081c', fontWeight: 'bold', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          {draggedPlayer.name}
        </div>
      )}
    </div>
  );
}