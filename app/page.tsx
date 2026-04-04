"use client";
import { useEffect } from "react";
import { useGameState } from "./lib/useGameState";
import { getInitialShuffledPools } from "./lib/game-utils";
import RulesStep from "./components/RulesStep"; 
import EntryStep from "./components/EntryStep";
import LobbyStep from "./components/LobbyStep";
import SetupStep from "./components/SetupStep";
import CountdownStep from "./components/CountdownStep";
import GameStep from "./components/GameStep";
import ScoreStep from "./components/ScoreStep";
import VictoryStep from "./components/VictoryStep";
import SevenBoomStep from "./components/SevenBoomStep";

export default function CharadesApp() {
  const { mounted, userId, roomId, roomData, step, setStep, updateRoom, handleFullReset, handleCreateRoom, handleJoinRoom, setUserName, setUserAge } = useGameState();

  const currentP = roomData?.players?.[roomData?.currentTurnIdx];
  const isIDescriber = currentP?.id === userId;

  // פישוט בחירת המאגר - ב-Charades כולם משתמשים באותו מאגר סלבס
  const getWordPoolKey = () => "JUNIOR"; 

  const handleScoreAction = (isCorrect: boolean) => {
    if (!roomData) return;
    const poolKey = getWordPoolKey();
    const currentIdx = roomData.poolIndices[poolKey] || 0;
    
    const points = isCorrect ? 1 : 0;
    const teamName = roomData.gameMode === 'team' ? roomData.teamNames[currentP.teamIdx] : currentP.name;
    
    updateRoom({
      [`totalScores.${teamName}`]: (roomData.totalScores[teamName] || 0) + points,
      roundScore: roomData.roundScore + points,
      [`poolIndices.${poolKey}`]: currentIdx + 1
    });
  };

  if (!mounted) return null;

  return (
    <main style={{ minHeight: '100dvh', backgroundColor: '#05081c', color: 'white' }}>
      {step === 0 && <RulesStep onStart={() => setStep(1)} />}
      {step === 1 && <EntryStep onJoin={handleJoinRoom} onCreate={() => setStep(2)} setUserName={setUserName} setUserAge={setUserAge} />}
      {step === 2 && <LobbyStep onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />}
      {step === 3 && roomData && (
        <SetupStep 
          {...roomData} 
          onPlayerMove={(pId: any, tIdx: any) => {
            const newPlayers = roomData.players.map((p: any) => p.id === pId ? { ...p, teamIdx: tIdx } : p);
            updateRoom({ players: newPlayers });
          }}
          onStart={() => updateRoom({ step: 4, preGameTimer: 3, shuffledPools: getInitialShuffledPools() })}
          setGameMode={(m: any) => updateRoom({ gameMode: m })}
          setDifficulty={(d: any) => updateRoom({ difficulty: d })}
          setNumTeams={(n: any) => updateRoom({ numTeams: n })}
          updateTeamNames={(names: any) => updateRoom({ teamNames: names })}
          onExit={handleFullReset}
          editTeamName={(idx: any) => {
            const newName = prompt("שם קבוצה חדש:", roomData.teamNames[idx]);
            if (newName) {
              const newNames = [...roomData.teamNames];
              newNames[idx] = newName;
              updateRoom({ teamNames: newNames });
            }
          }}
        />
      )}
      {step === 4 && roomData && <CountdownStep timer={roomData.preGameTimer} turnInfo={{ name: currentP.name, team: roomData.teamNames[currentP.teamIdx] }} isTeamMode={roomData.gameMode === "team"} />}
      {step === 5 && roomData && (
        <GameStep 
          roomData={roomData} 
          userId={userId!} 
          updateRoom={updateRoom} 
          handleAction={handleScoreAction} 
          onExit={handleFullReset} 
          poolKey={getWordPoolKey()}
        />
      )}
      {step === 6 && roomData && (
        <ScoreStep 
          scores={roomData.totalScores} 
          entities={roomData.gameMode === 'individual' ? roomData.players.map((p: any) => p.name) : roomData.teamNames.slice(0, roomData.numTeams)} 
          onNextRound={() => {
            const nextIdx = (roomData.currentTurnIdx + 1) % roomData.players.length;
            updateRoom({ step: 4, currentTurnIdx: nextIdx, preGameTimer: 3, roundScore: 0 });
          }} 
        />
      )}
      {step === 8 && roomData && <SevenBoomStep teamName={roomData.teamNames[currentP.teamIdx]} onContinue={() => updateRoom({ step: 4, preGameTimer: 3 })} />}
    </main>
  );
}