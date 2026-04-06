"use client";
import { useEffect, useState } from "react";
import { useGameState } from "./lib/useGameState";
import { getInitialShuffledPools } from "./lib/game-utils";
import RulesStep from "./components/RulesStep"; 
import EntryStep from "./components/EntryStep";
import SetupStep from "./components/SetupStep";
import CountdownStep from "./components/CountdownStep";
import GameStep from "./components/GameStep";
import ScoreStep from "./components/ScoreStep";
import VictoryStep from "./components/VictoryStep";
import SevenBoomStep from "./components/SevenBoomStep";

export default function FamilyAliasApp() {
  const { mounted, userId, roomId, roomData, step, setStep, updateRoom, handleFullReset, handleCreateRoom, handleJoinRoom, setUserName, setUserAge } = useGameState();

  const currentP = roomData?.players?.[roomData?.currentTurnIdx];
  const isIDescriber = currentP?.id === userId;

  useEffect(() => {
    if (!roomId || !roomData || !currentP || roomData.isPaused || step < 4 || step === 8) return;
    
    const isBot = currentP?.id?.startsWith('d_');
    const isHost = roomData.players?.[0]?.id === userId;
    
    // מכניקה מ-SAME SAME: בחדר עומר כולם רשאים להריץ את הטיימר כדי למנוע תקיעה
    const shouldRunTimer = isIDescriber || (isBot && isHost) || (roomId === "עומר");

    if (!shouldRunTimer) return;

    const interval = setInterval(() => {
      if (step === 4) {
        if (roomData.preGameTimer > 0) {
          updateRoom({ preGameTimer: roomData.preGameTimer - 1 });
        } else {
          updateRoom({ 
            step: 5, 
            timeLeft: 60, 
            roundScore: 0 
          });
        }
      } else if (step === 5) {
        if (roomData.timeLeft > 0) {
          updateRoom({ timeLeft: roomData.timeLeft - 1 });
        } else {
          updateRoom({ step: 6 });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [step, roomId, roomData, isIDescriber, currentP, updateRoom, userId]);

  if (!mounted) return null;

  const handleScoreAction = (targetName: string, points: number = 1) => {
    if (!roomData || roomData.isPaused) return;

    const newScores = { ...roomData.totalScores };
    const entity = roomData.gameMode === "individual" ? currentP?.name : roomData.teamNames[currentP?.teamIdx];

    if (targetName === "SKIP") {
      newScores[entity] = (newScores[entity] || 0) - 1;
      updateRoom({ 
        roundScore: (roomData.roundScore || 0) - 1, 
        totalScores: newScores 
      });
    } else {
      newScores[targetName] = (newScores[targetName] || 0) + points;
      if (roomData.gameMode === "individual") {
        newScores[currentP?.name] = (newScores[currentP?.name] || 0) + points;
      }
      
      const winningScore = 50;
      if (newScores[targetName] >= winningScore) {
        updateRoom({ 
          totalScores: newScores, 
          step: 7, 
          winner: targetName 
        });
      } else {
        updateRoom({ 
          roundScore: (roomData.roundScore || 0) + points, 
          totalScores: newScores 
        });
      }
    }
  };

  const gameTargets = roomData?.gameMode === "individual" 
    ? roomData.players.filter((p: any) => p.id !== currentP?.id).map((p: any) => p.name) 
    : [roomData?.teamNames[currentP?.teamIdx]];

  return (
    <div style={{ backgroundColor: '#05081c', height: '100dvh', color: 'white', direction: 'rtl', overscrollBehavior: 'none', overflow: 'hidden' }}>
      {step === 0 && <RulesStep onStart={() => setStep(1)} />}
      
      {step === 1 && (
        <EntryStep 
          onJoin={handleJoinRoom} 
          onCreate={handleCreateRoom} 
          onSetName={setUserName} 
          onSetAge={setUserAge} 
        />
      )}

      {step === 3 && roomData && (
        <SetupStep 
          roomId={roomId!} 
          gameMode={roomData.gameMode} 
          setGameMode={(m) => updateRoom({ gameMode: m })} 
          difficulty={roomData.difficulty || "age-appropriate"} 
          setDifficulty={(d) => updateRoom({ difficulty: d })} 
          numTeams={roomData.numTeams} 
          setNumTeams={(n) => updateRoom({ numTeams: n })} 
          players={roomData.players} 
          teamNames={roomData.teamNames} 
          updateTeamNames={(names) => updateRoom({ teamNames: names })} 
          onPlayerMove={(pId, tIdx) => {
            const p = roomData.players.map((pl: any) => pl.id === pId ? {...pl, teamIdx: tIdx} : pl);
            updateRoom({ players: p });
          }} 
          editTeamName={(idx: number) => {
            const n = prompt("שם קבוצה:", roomData.teamNames[idx]);
            if(n) {
              const t = [...roomData.teamNames];
              t[idx] = n;
              updateRoom({ teamNames: t });
            }
          }} 
          onStart={() => {
            updateRoom({ 
              step: 4, 
              preGameTimer: 3, 
              roundScore: 0,
              currentPhase: 'A' 
            });
          }} 
          onExit={handleFullReset} 
        />
      )}

      {step === 4 && roomData && (
        <CountdownStep 
          timer={roomData.preGameTimer} 
          turnInfo={{ name: currentP?.name, team: roomData.teamNames[currentP?.teamIdx] }} 
          isTeamMode={roomData.gameMode === "team"} 
        />
      )}

      {step === 5 && roomData && (
        <GameStep 
          roomData={roomData} 
          userId={userId!} 
          targets={gameTargets} 
          updateRoom={updateRoom} 
          handleAction={handleScoreAction} 
          onExit={handleFullReset} 
        />
      )}

      {step === 6 && roomData && (
        <ScoreStep 
          scores={roomData.totalScores} 
          entities={roomData.gameMode === 'individual' ? roomData.players.map((p: any) => p.name) : roomData.teamNames.slice(0, roomData.numTeams)} 
          onNextRound={() => {
            let nextIdx = (roomData.currentTurnIdx + 1) % roomData.players.length;
            if (roomData.gameMode === 'team') {
              const currentTeamIdx = roomData.players[roomData.currentTurnIdx].teamIdx;
              while (roomData.players[nextIdx].teamIdx === currentTeamIdx) {
                nextIdx = (nextIdx + 1) % roomData.players.length;
                if (nextIdx === roomData.currentTurnIdx) break;
              }
            }
            
            const nextP = roomData.players[nextIdx];
            const nextScore = Number(roomData.totalScores[roomData.gameMode === 'team' ? roomData.teamNames[nextP.teamIdx] : nextP.name] || 0);
            
            if (roomData.gameMode === 'team' && [7, 14, 21, 28, 35, 42, 49].includes(nextScore)) {
              updateRoom({ step: 8, currentTurnIdx: nextIdx, roundScore: 0 });
            } else {
              updateRoom({ step: 4, currentTurnIdx: nextIdx, preGameTimer: 3, roundScore: 0 });
            }
          }} 
        />
      )}

      {step === 7 && roomData && (
        <VictoryStep 
          winnerName={roomData.winner} 
          onRestart={handleFullReset} 
        />
      )}

      {step === 8 && roomData && (
        <SevenBoomStep 
          roomData={roomData} 
          userId={userId!} 
          updateRoom={updateRoom} 
          handleAction={handleScoreAction} 
          onExit={handleFullReset} 
        />
      )}
    </div>
  );
}