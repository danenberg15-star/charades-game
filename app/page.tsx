"use client";
import { useEffect } from "react";
import { useGameState } from "./lib/useGameState";
import { getInitialShuffledPools, shuffleArray } from "./lib/game-utils";
import RulesStep from "./components/RulesStep"; 
import EntryStep from "./components/EntryStep";
import SetupStep from "./components/SetupStep";
import CountdownStep from "./components/CountdownStep";
import GameStep from "./components/GameStep";
import ScoreStep from "./components/ScoreStep";
import VictoryStep from "./components/VictoryStep";
import SevenBoomStep from "./components/SevenBoomStep";

export default function FamilyAliasApp() {
  const { mounted, userId, roomId, roomData, step, setStep, updateRoom, handleFullReset, handleCreateRoom, handleJoinRoom, setUserName } = useGameState();

  const currentP = roomData?.players && roomData?.currentTurnIdx !== undefined 
    ? roomData.players[roomData.currentTurnIdx] 
    : null;
    
  const isIDescriber = currentP?.id === userId;

  useEffect(() => {
    if (!roomId || !roomData || !currentP || roomData.isPaused || step < 4 || step === 8) return;
    
    const isBot = currentP?.id?.startsWith('d_');
    const isHost = roomData.players?.[0]?.id === userId;
    if (!isIDescriber && !(isBot && isHost)) return;

    const interval = setInterval(() => {
      if (step === 4) {
        if (roomData.preGameTimer > 0) updateRoom({ preGameTimer: roomData.preGameTimer - 1 });
        else updateRoom({ step: 5, timeLeft: 5, roundScore: 0 }); // QA: 5 שניות
      } else if (step === 5) {
        if (roomData.timeLeft > 0) updateRoom({ timeLeft: roomData.timeLeft - 1 });
        else {
          updateRoom({ step: 6, poolIndex: (roomData.poolIndex || 0) + 1, phaseEnded: null });
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [step, roomId, roomData, isIDescriber, currentP, updateRoom]);

  if (!mounted) return null;

  const handleScoreAction = (targetName: string, points: number = 1) => {
    if (!roomData || !currentP || roomData.isPaused) return;
    const newIndex = (roomData.poolIndex || 0) + 1;
    const newScores = { ...roomData.totalScores };
    const describerEntity = roomData.teamNames[currentP.teamIdx];

    // טיפול בדילוג (SKIP)
    if (targetName === "SKIP") {
      if (roomData.currentPhase === 'A') {
        // שלב א': סלבריטאי נמחק, אין קנס
        updateRoom({ poolIndex: newIndex });
      } else {
        // שלב ב/ג: קנס של 2- נקודות
        newScores[describerEntity] = (newScores[describerEntity] || 0) - 2;
        updateRoom({ roundScore: (roomData.roundScore || 0) - 2, poolIndex: newIndex, totalScores: newScores });
      }
      return;
    }

    // ניקוד לפי שלב
    if (roomData.currentPhase === 'A') {
      // שלב א': +1 למנחש, +1 למתאר
      newScores[describerEntity] = (newScores[describerEntity] || 0) + 1;
      newScores[targetName] = (newScores[targetName] || 0) + 1;
      
      const pool = roomData.shuffledPools || [];
      const currentWord = pool[roomData.poolIndex % (pool.length || 1)];
      const updatedDeck = [...(roomData.gameDeck || []), currentWord];
      const uniquePlayersCount = new Set(roomData.players.map((p: any) => p.id)).size;
      
      if (updatedDeck.length >= uniquePlayersCount * 5) {
        updateRoom({ 
          totalScores: newScores, 
          poolIndex: 0, 
          shuffledPools: shuffleArray(updatedDeck), 
          currentPhase: 'B', 
          gameDeck: updatedDeck, 
          step: 6, 
          phaseEnded: 'א' 
        });
      } else {
        updateRoom({ totalScores: newScores, roundScore: (roomData.roundScore || 0) + 1, poolIndex: newIndex, gameDeck: updatedDeck });
      }
    } else {
      // שלב ב/ג או 7 בום: +1 או +2 נקודות
      newScores[targetName] = (newScores[targetName] || 0) + points;
      
      const pool = roomData.shuffledPools || [];
      if (newIndex >= pool.length) {
        if (roomData.currentPhase === 'B') {
          updateRoom({ totalScores: newScores, currentPhase: 'C', poolIndex: 0, step: 6, phaseEnded: 'ב' });
        } else {
          updateRoom({ totalScores: newScores, step: 7, winner: Object.keys(newScores).reduce((a, b) => newScores[a] > newScores[b] ? a : b) });
        }
      } else {
        updateRoom({ roundScore: (roomData.roundScore || 0) + points, poolIndex: newIndex, totalScores: newScores });
      }
    }
  };

  const gameTargets = roomData?.currentPhase === 'A' || step === 8
    ? (roomData.teamNames.slice(0, roomData.numTeams) || [])
    : [roomData?.teamNames[currentP?.teamIdx]];

  return (
    <div style={{ backgroundColor: '#05081c', height: '100dvh', color: 'white', direction: 'rtl', overscrollBehavior: 'none', overflow: 'hidden' }}>
      {step === 0 && <RulesStep onStart={() => setStep(1)} />}
      {step === 1 && <EntryStep onJoin={handleJoinRoom} onCreate={handleCreateRoom} onSetName={setUserName} />}
      
      {roomData && (
        <>
          {step === 3 && (
            <SetupStep 
              roomId={roomId!} gameMode={roomData.gameMode} setGameMode={(m) => updateRoom({ gameMode: m })} 
              difficulty={roomData.difficulty} setDifficulty={(d) => updateRoom({ difficulty: d })} 
              numTeams={roomData.numTeams} setNumTeams={(n) => updateRoom({ numTeams: n })} players={roomData.players} 
              teamNames={roomData.teamNames} updateTeamNames={(names) => updateRoom({ teamNames: names })} 
              onPlayerMove={(pId, tIdx) => updateRoom({ players: roomData.players.map((pl: any) => pl.id === pId ? {...pl, teamIdx: tIdx} : pl) })} 
              editTeamName={(idx: number) => { const n = prompt("שם קבוצה:", roomData.teamNames[idx]); if(n) { const t = [...roomData.teamNames]; t[idx] = n; updateRoom({ teamNames: t }); } }} 
              onStart={() => {
                const allCustom = roomData.players.reduce((acc: any[], p: any) => [...acc, ...(p.customWords || [])], []);
                updateRoom({ step: 4, preGameTimer: 3, shuffledPools: getInitialShuffledPools(allCustom), poolIndex: 0, roundScore: 0, currentPhase: 'A', gameDeck: [] });
              }} 
              onExit={handleFullReset} 
            />
          )}
          {step === 4 && currentP && <CountdownStep timer={roomData.preGameTimer} turnInfo={{name: currentP.name, team: roomData.teamNames[currentP.teamIdx]}} isTeamMode={true} currentPhase={roomData.currentPhase} />}
          {step === 5 && <GameStep roomData={roomData} userId={userId!} targets={gameTargets} updateRoom={updateRoom} handleAction={handleScoreAction} onExit={handleFullReset} />}
          {step === 6 && (
            <ScoreStep 
              scores={roomData.totalScores} 
              entities={roomData.teamNames.slice(0, roomData.numTeams)} 
              phaseEnded={roomData.phaseEnded} 
              onNextRound={() => {
                const nextTeamIdx = (roomData.currentTeamIdx + 1) % roomData.numTeams;
                const teamPlayerIndices = { ...roomData.teamPlayerIndices };
                teamPlayerIndices[roomData.currentTeamIdx] = (teamPlayerIndices[roomData.currentTeamIdx] + 1);

                const playersInNextTeam = roomData.players.filter((p: any) => p.teamIdx === nextTeamIdx);
                const nextPlayer = playersInNextTeam[teamPlayerIndices[nextTeamIdx] % playersInNextTeam.length];
                const globalIdx = roomData.players.findIndex((p: any) => p.id === nextPlayer.id);

                const nextScore = Number(roomData.totalScores[roomData.teamNames[nextTeamIdx]] || 0);

                // בדיקת 7 בום: רק בשלב ב' ו-ג' אם הניקוד הוא כפולה של 7
                if (roomData.currentPhase !== 'A' && nextScore > 0 && nextScore % 7 === 0) {
                  updateRoom({ step: 8, currentTurnIdx: globalIdx, currentTeamIdx: nextTeamIdx, teamPlayerIndices, roundScore: 0, phaseEnded: null });
                } else {
                  updateRoom({ step: 4, currentTurnIdx: globalIdx, currentTeamIdx: nextTeamIdx, teamPlayerIndices, preGameTimer: 3, roundScore: 0, phaseEnded: null });
                }
              }} 
            />
          )}
          {step === 7 && <VictoryStep winnerName={roomData.winner} onRestart={handleFullReset} />}
          {step === 8 && <SevenBoomStep roomData={roomData} userId={userId!} updateRoom={updateRoom} handleAction={handleScoreAction} onExit={handleFullReset} />}
        </>
      )}
    </div>
  );
}