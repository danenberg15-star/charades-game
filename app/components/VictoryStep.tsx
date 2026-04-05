"use client";

import React from "react";

interface VictoryStepProps {
  winnerName: string;
  onRestart: () => void;
}

export default function VictoryStep({ winnerName, onRestart }: VictoryStepProps) {
  return (
    <div style={{
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      width: '100vw', 
      height: '100dvh', 
      backgroundColor: '#f8fafc', // רקע בהיר וחגיגי כמקור
      direction: 'rtl', 
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px'
    }}>
      {/* אנימציית קונפטי */}
      <div className="confetti-container">
        <style>{`
          .confetti-container { position: absolute; width: 100%; height: 100%; overflow: hidden; pointer-events: none; top: 0; left: 0; z-index: 1; }
          .confetti { position: absolute; width: 12px; height: 12px; animation: fall 4s linear infinite; opacity: 0.9; }
          @keyframes fall { 
            0% { transform: translateY(-10vh) rotate(0deg); } 
            100% { transform: translateY(110vh) rotate(720deg); } 
          }
        `}</style>
        {[...Array(100)].map((_, i) => {
          const colors = ['#00f2ff', '#ff5e5e', '#5eff8a', '#5ebcff', '#b85eff'];
          return (
            <div 
              key={i} 
              className="confetti" 
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                borderRadius: i % 2 === 0 ? '50%' : '0'
              }} 
            />
          );
        })}
      </div>

      {/* תוכן מרכזי */}
      <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center', marginTop: '-10vh' }}>
        <div style={{ fontSize: '120px', animation: 'bounce 2s infinite' }}>
          <style>{`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-15px); }
            }
          `}</style>
          🏆
        </div>
        
        <h1 style={{ color: '#05081c', fontSize: '2.2rem', fontWeight: '900', margin: '0', lineHeight: '1.2' }}>
          כל הכבוד על הניצחון שלכם!
        </h1>
        
        <div style={{ 
          backgroundColor: '#00f2ff', 
          padding: '15px 40px', 
          borderRadius: '20px', 
          boxShadow: '0 8px 25px rgba(0, 242, 255, 0.4)',
          marginTop: '10px'
        }}>
          <h2 style={{ color: '#05081c', fontSize: '2.5rem', fontWeight: '900', margin: '0' }}>
            {winnerName}
          </h2>
        </div>
      </div>

      {/* כפתור תחתון */}
      <div style={{ zIndex: 10, position: 'absolute', bottom: '30px', width: '100%', padding: '0 20px', boxSizing: 'border-box' }}>
         <button onClick={onRestart} style={{
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto',
            display: 'block',
            height: '60px',
            borderRadius: '18px',
            backgroundColor: '#00f2ff',
            color: '#05081c',
            fontWeight: '900',
            border: 'none',
            fontSize: '1.4rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0, 242, 255, 0.3)',
            transition: 'transform 0.2s active'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
         >
          משחק חדש 🔄
        </button>
      </div>
    </div>
  );
}