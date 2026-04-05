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
  const { mounted, userId, roomId, roomData, step, setStep, updateRoom, handleFullReset, handleCreateRoom, handleJoinRoom, setUserName, setUserAge } = useGameState();

  const currentP = roomData?.players?.[roomData?.currentTurnIdx];
  const isIDescriber = currentP?.id === userId;

  const calculatePoolKey = (age: number, idxs: any, difficulty: string) => {
    const totalIdx = (idxs.KIDS + idxs.JUNIOR + idxs.TEEN + idxs.ADULT);
    if (difficulty === "easy") return (totalIdx % 2 === 0) ? "KIDS" : "JUNIOR";
    if (age <= 6) return (totalIdx % 5 < 4) ? "KIDS" : "JUNIOR";
    else if (age <= 12) return (totalIdx % 10 < 2) ? "KIDS" : "JUNIOR";
    else if (age <= 20) { 
      const mod = totalIdx % 10;
      return mod === 0 ? "JUNIOR" : (mod < 9 ? "TEEN" : "ADULT");
    } else { 
      const mod = totalIdx % 10;
      return mod === 0 ? "JUNIOR" : (mod === 1 ? "TEEN" : "ADULT");
    }
  };

  useEffect(() => {
    if (!roomId || !roomData || roomData.isPaused || step < 4 || step === 8) return;
    const isBot = currentP?.id?.startsWith('d_');
    const isHost = roomData.players[0].id === userId;
    if (!isIDescriber && !(isBot && isHost)) return;

    const interval = setInterval(() => {
      if (step === 4) {
        if (roomData.preGameTimer > 0) {
          updateRoom({ preGameTimer: roomData.preGameTimer - 1 });
        } else {
          updateRoom({ step: 5, timeLeft: 5, roundScore: 0 }); // טיימר QA: 5 שניות
        }
      } else if (step === 5) {
        if (roomData.timeLeft > 0) {
          updateRoom({ timeLeft: roomData.timeLeft - 1 });
        } else {
          const age = parseInt(currentP.age) || 21;
          const idxs = roomData.poolIndices || { KIDS: 0, JUNIOR: 0, TEEN: 0, ADULT: 0 };
          const poolKey = calculatePoolKey(age, idxs, roomData.difficulty || "age-appropriate");
          const newIndices = { ...idxs };
          newIndices[poolKey] = (newIndices[poolKey] || 0) + 1;
          updateRoom({ step: 6, poolIndices: newIndices });
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [step, roomId, roomData?.preGameTimer, roomData?.timeLeft, roomData?.isPaused, isIDescriber, currentP, updateRoom]);

  if (!mounted) return null;

  const handleScoreAction = (targetName: string, points: number = 1) => {
    if (roomData.isPaused) return;
    const age = parseInt(currentP.age) || 21;
    const idxs = roomData.poolIndices || { KIDS: 0, JUNIOR: 0, TEEN: 0, ADULT: 0 };
    const poolKey = calculatePoolKey(age, idxs, roomData.difficulty || "age-appropriate");
    const newIndices = { ...idxs };
    newIndices[poolKey] = (newIndices[poolKey] || 0) + 1;
    const newScores = { ...roomData.totalScores };

    if (targetName === "SKIP") {
      const entity = roomData.gameMode === "individual" ? currentP.name : roomData.teamNames[currentP.teamIdx];
      if (roomData.currentPhase === 'A') {
        updateRoom({ poolIndices: newIndices });
      } else {
        newScores[entity] = (newScores[entity] || 0) - 2;
        const pool = roomData.shuffledPools?.[poolKey] || [];
        const skippedWord = pool[roomData.poolIndices[poolKey] % pool.length];
        const newPool = [...pool];
        newPool.push(newPool.splice(roomData.poolIndices[poolKey] % pool.length, 1)[0]);
        updateRoom({ 
          roundScore: (roomData.roundScore || 0) - 2, 
          poolIndices: newIndices, 
          totalScores: newScores,
          [`shuffledPools.${poolKey}`]: newPool
        });
      }
      return;
    }

    if (roomData.currentPhase === 'A') {
      const describerEntity = roomData.gameMode === "individual" ? currentP.name : roomData.teamNames[currentP.teamIdx];
      newScores[describerEntity] = (newScores[describerEntity] || 0) + 1;
      newScores[targetName] = (newScores[targetName] || 0) + 1;

      const pool = roomData.shuffledPools?.[poolKey] || [];
      const guessedWord = pool[roomData.poolIndices[poolKey] % pool.length];
      const updatedDeck = [...(roomData.gameDeck || []), guessedWord];
      
      if (updatedDeck.length >= roomData.players.length * 5) {
        const finalPool = shuffleArray(updatedDeck);
        updateRoom({
          totalScores: newScores, poolIndices: { KIDS: 0, JUNIOR: 0, TEEN: 0, ADULT: 0 },
          shuffledPools: { KIDS: finalPool, JUNIOR: finalPool, TEEN: finalPool, ADULT: finalPool },
          currentPhase: 'B', gameDeck: updatedDeck, step: 6 
        });
      } else {
        updateRoom({ totalScores: newScores, roundScore: (roomData.roundScore || 0) + 1, poolIndices: newIndices, gameDeck: updatedDeck });
      }
    } else {
      newScores[targetName] = (newScores[targetName] || 0) + points;
      if (roomData.gameMode === "individual") newScores[currentP.name] = (newScores[currentP.name] || 0) + points;
      
      const pool = roomData.shuffledPools?.[poolKey] || [];
      if (newIndices[poolKey] >= pool.length) {
        if (roomData.currentPhase === 'B') updateRoom({ totalScores: newScores, currentPhase: 'C', poolIndices: { KIDS: 0, JUNIOR: 0, TEEN: 0, ADULT: 0 }, step: 6 });
        else {
          const entities = roomData.gameMode === 'individual' ? roomData.players.map((p: any) => p.name) : roomData.teamNames.slice(0, roomData.numTeams);
          const winner = entities.reduce((a: string, b: string) => (newScores[a] || 0) > (newScores[b] || 0) ? a : b);
          updateRoom({ totalScores: newScores, step: 7, winner: winner });
        }
      } else {
        updateRoom({ roundScore: (roomData.roundScore || 0) + points, poolIndices: newIndices, totalScores: newScores });
      }
    }
  };

  const gameTargets = roomData?.currentPhase === 'A' 
    ? (roomData.gameMode === "individual" ? roomData.players.map((p: any) => p.name) : roomData.teamNames.slice(0, roomData.numTeams))
    : (roomData?.gameMode === "individual" ? roomData.players.filter((p: any) => p.id !== currentP?.id).map((p: any) => p.name) : [roomData?.teamNames[currentP?.teamIdx]]);

  return (
    <div style={{ backgroundColor: '#05081c', height: '100dvh', color: 'white', direction: 'rtl', overscrollBehavior: 'none', overflow: 'hidden' }}>
      {step === 0 && <RulesStep onStart={() => setStep(1)} />}
      {step === 1 && <EntryStep onJoin={handleJoinRoom} onCreate={handleCreateRoom} onSetName={setUserName} onSetAge={setUserAge} />}
      {step === 3 && roomData && (
        <SetupStep 
          roomId={roomId!} gameMode={roomData.gameMode} setGameMode={(m) => updateRoom({ gameMode: m })} 
          difficulty={roomData.difficulty || "age-appropriate"} setDifficulty={(d) => updateRoom({ difficulty: d })} 
          numTeams={roomData.numTeams} setNumTeams={(n) => updateRoom({ numTeams: n })} players={roomData.players} 
          teamNames={roomData.teamNames} updateTeamNames={(names) => updateRoom({ teamNames: names })} 
          onPlayerMove={(pId, tIdx) => { const p = roomData.players.map((pl: any) => pl.id === pId ? {...pl, teamIdx: tIdx} : pl); updateRoom({ players: p }); }} 
          editTeamName={(idx: number) => { const n = prompt("שם קבוצה:", roomData.teamNames[idx]); if(n) { const t = [...roomData.teamNames]; t[idx] = n; updateRoom({ teamNames: t }); } }} 
          onStart={() => {
            // לוגיקת Master Rotation - הבטחת החלפת קבוצות ושחקנים
            let masterRotation = [];
            if (roomData.gameMode === "team") {
              const playersByTeam = Array.from({ length: roomData.numTeams }, (_, i) => 
                roomData.players.filter((p: any) => p.teamIdx === i)
              );
              const maxPlayers = Math.max(...playersByTeam.map(t => t.length));
              for (let i = 0; i < maxPlayers; i++) {
                for (let j = 0; j < roomData.numTeams; j++) {
                  if (playersByTeam[j].length > 0) {
                    masterRotation.push(playersByTeam[j][i % playersByTeam[j].length]);
                  }
                }
              }
            } else {
              masterRotation = shuffleArray(roomData.players);
            }

            updateRoom({ 
              step: 4, preGameTimer: 3, 
              players: masterRotation, // עדכון המערך לסדר התורות הקבוע
              shuffledPools: getInitialShuffledPools(), 
              poolIndices: { KIDS: 0, JUNIOR: 0, TEEN: 0, ADULT: 0 }, 
              roundScore: 0, currentPhase: 'A', gameDeck: [] 
            });
          }} 
          onExit={handleFullReset} 
        />
      )}
      {step === 4 && roomData && <CountdownStep timer={roomData.preGameTimer} turnInfo={{name: currentP?.name, team: roomData.teamNames[currentP?.teamIdx]}} isTeamMode={roomData.gameMode === "team"} currentPhase={roomData.currentPhase} />}
      {step === 5 && roomData && <GameStep roomData={roomData} userId={userId!} targets={gameTargets} updateRoom={updateRoom} handleAction={handleScoreAction} onExit={handleFullReset} />}
      {step === 6 && roomData && (
        <ScoreStep 
          scores={roomData.totalScores} entities={roomData.gameMode === 'individual' ? roomData.players.map((p: any) => p.name) : roomData.teamNames.slice(0, roomData.numTeams)} 
          onNextRound={() => {
            const nextIdx = (roomData.currentTurnIdx + 1) % roomData.players.length;
            const nextP = roomData.players[nextIdx];
            const nextScore = Number(roomData.totalScores[roomData.gameMode === 'team' ? roomData.teamNames[nextP.teamIdx] : nextP.name] || 0);
            if (roomData.gameMode === 'team' && roomData.currentPhase !== 'A' && [7,14,21,28,35,42,49].includes(nextScore)) updateRoom({ step: 8, currentTurnIdx: nextIdx, roundScore: 0 });
            else updateRoom({ step: 4, currentTurnIdx: nextIdx, preGameTimer: 3, roundScore: 0 });
          }} 
        />
      )}
      {step === 7 && roomData && <VictoryStep winnerName={roomData.winner} onRestart={handleFullReset} />}
      {step === 8 && roomData && <SevenBoomStep roomData={roomData} userId={userId!} updateRoom={updateRoom} handleAction={handleScoreAction} onExit={handleFullReset} />}
    </div>
  );
}