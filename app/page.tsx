"use client";
import { useEffect, useState, useRef } from "react";
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
  const { mounted, userId, roomId, roomData, step, setStep, updateRoom, handleFullReset, handleCreateRoom, handleJoinRoom, setUserName, increment } = useGameState();
  const [urlRoomId, setUrlRoomId] = useState<string | null>(null);

  // מראה (Ref) שקוראת תמיד את הנתון העדכני ביותר מבלי לאתחל את הטיימר מחדש
  const roomDataRef = useRef(roomData);
  useEffect(() => { roomDataRef.current = roomData; }, [roomData]);

  // חילוץ קוד חדר מהכתובת עבור כניסה חלקה
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const room = params.get("room");
      if (room) setUrlRoomId(room.toUpperCase());
    }
  }, []);

  const currentP = roomData?.players && roomData?.currentTurnIdx !== undefined ? roomData.players[roomData.currentTurnIdx] : null;
  const isIDescriber = currentP?.id === userId;

  useEffect(() => {
    if (!roomId || !roomData || !currentP || roomData.isPaused || step < 4 || step === 8) return;
    const isBot = currentP?.id?.startsWith('d_');
    const isHost = roomData.players?.[0]?.id === userId;
    
    // בחדר עומר מאפשרים לכל אחד להריץ את הטיימר כדי למנוע קיפאון
    const shouldRunTimer = isIDescriber || (isBot && isHost) || (roomId === "עומר");
    if (!shouldRunTimer) return;

    const interval = setInterval(() => {
      const liveData = roomDataRef.current;
      if (!liveData || liveData.isPaused) return;

      if (step === 4) {
        if (liveData.preGameTimer > 0) updateRoom({ preGameTimer: liveData.preGameTimer - 1 });
        else updateRoom({ step: 5, timeLeft: 5, roundScore: 0 }); 
      } else if (step === 5) {
        if (liveData.timeLeft > 0) updateRoom({ timeLeft: liveData.timeLeft - 1 });
        else {
          updateRoom({ step: 6, phaseEnded: null });
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [step, roomId, isIDescriber, userId, updateRoom]);

  if (!mounted) return null;

  const handleScoreAction = (targetName: string, points: number = 1) => {
    if (!roomData || !currentP || roomData.isPaused) return;
    const describerTeam = roomData.teamNames[currentP.teamIdx];
    const pool = [...(roomData.shuffledPools || [])];
    const currentWord = pool[roomData.poolIndex];

    if (targetName === "SKIP") {
      if (roomData.currentPhase === 'A') {
        updateRoom({ poolIndex: increment(1) });
      } else {
        pool.splice(roomData.poolIndex, 1);
        pool.push(currentWord);
        updateRoom({ 
          [`totalScores.${describerTeam}`]: increment(-2), 
          roundScore: increment(-2), 
          shuffledPools: pool 
        });
      }
      return;
    }

    if (roomData.currentPhase === 'A') {
      const updatedDeck = [...(roomData.gameDeck || []), currentWord];
      const nPlayers = roomData.players.length;
      
      const updates: any = {
        [`totalScores.${describerTeam}`]: increment(1),
        [`totalScores.${targetName}`]: increment(1),
        poolIndex: increment(1),
        roundScore: increment(1),
        gameDeck: updatedDeck
      };

      if (updatedDeck.length >= nPlayers * 5) {
        Object.assign(updates, { 
          poolIndex: 0, 
          shuffledPools: shuffleArray(updatedDeck), 
          currentPhase: 'B', 
          step: 6, 
          phaseEnded: 'א' 
        });
      }
      updateRoom(updates);
    } else {
      const updates: any = {
        [`totalScores.${targetName}`]: increment(points),
        roundScore: increment(points),
        poolIndex: increment(1)
      };

      if ((roomData.poolIndex + 1) >= pool.length) {
        if (roomData.currentPhase === 'B') {
          updateRoom({ 
            ...updates, 
            currentPhase: 'C', 
            shuffledPools: shuffleArray(pool), 
            poolIndex: 0, 
            step: 6, 
            phaseEnded: 'ב' 
          });
        } else {
          updateRoom({ ...updates, step: 7 });
        }
      } else {
        updateRoom(updates);
      }
    }
  };

  const gameTargets = roomData?.currentPhase === 'A' || step === 8
    ? (roomData.teamNames.slice(0, roomData.numTeams) || [])
    : [roomData?.teamNames[currentP?.teamIdx]];

  return (
    <div style={{ backgroundColor: '#05081c', height: '100dvh', color: 'white', direction: 'rtl', overscrollBehavior: 'none', overflow: 'hidden' }}>
      {step === 0 && <RulesStep onStart={() => setStep(1)} />}
      {step === 1 && <EntryStep initialCode={urlRoomId} onJoin={handleJoinRoom} onCreate={handleCreateRoom} onSetName={setUserName} />}
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
              scores={roomData.totalScores} entities={roomData.teamNames.slice(0, roomData.numTeams)} phaseEnded={roomData.phaseEnded} 
              onNextRound={() => {
                const nextTeamIdx = (roomData.currentTeamIdx + 1) % roomData.numTeams;
                const teamPlayerIndices = { ...roomData.teamPlayerIndices };
                teamPlayerIndices[roomData.currentTeamIdx] = (teamPlayerIndices[roomData.currentTeamIdx] + 1);
                const playersInNextTeam = roomData.players.filter((p: any) => p.teamIdx === nextTeamIdx);
                const nextPlayer = playersInNextTeam[teamPlayerIndices[nextTeamIdx] % playersInNextTeam.length];
                const globalIdx = roomData.players.findIndex((p: any) => p.id === nextPlayer.id);
                const nextScore = Number(roomData.totalScores[roomData.teamNames[nextTeamIdx]] || 0);

                if (roomData.currentPhase !== 'A' && nextScore > 0 && nextScore % 7 === 0) {
                  updateRoom({ step: 8, currentTurnIdx: globalIdx, currentTeamIdx: nextTeamIdx, teamPlayerIndices, roundScore: 0, phaseEnded: null });
                } else {
                  updateRoom({ step: 4, currentTurnIdx: globalIdx, currentTeamIdx: nextTeamIdx, teamPlayerIndices, preGameTimer: 3, roundScore: 0, phaseEnded: null });
                }
              }} 
            />
          )}
          {step === 7 && <VictoryStep winnerName={Object.keys(roomData.totalScores).reduce((a, b) => roomData.totalScores[a] > roomData.totalScores[b] ? a : b)} onRestart={handleFullReset} />}
          {step === 8 && <SevenBoomStep roomData={roomData} userId={userId!} updateRoom={updateRoom} handleAction={handleScoreAction} onExit={handleFullReset} />}
        </>
      )}
    </div>
  );
}