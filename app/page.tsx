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

  // מונים מקומיים לסנכרון מושלם
  const [localTimeLeft, setLocalTimeLeft] = useState(0);
  const [localCountdown, setLocalCountdown] = useState(0);

  const wakeLockRef = useRef<any>(null);
  const roomDataRef = useRef(roomData);
  useEffect(() => { roomDataRef.current = roomData; }, [roomData]);

  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      } catch (err: any) {
        console.error(`Wake Lock Error: ${err.name}, ${err.message}`);
      }
    }
  };

  useEffect(() => {
    if (roomId && step >= 4) {
      requestWakeLock();
    }
    const handleVisibilityChange = async () => {
      if (wakeLockRef.current !== null && document.visibilityState === 'visible') {
        await requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
  }, [roomId, step]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const room = params.get("room");
      if (room) setUrlRoomId(room.toUpperCase());
    }
  }, []);

  const currentP = roomData?.players && roomData?.currentTurnIdx !== undefined ? roomData.players[roomData.currentTurnIdx] : null;
  const isIDescriber = currentP?.id === userId;
  
  // זיהוי אם התור הנוכחי הוא של בוט ואם המשתמש המקומי הוא המארח (Host)
  const isBot = currentP?.id?.startsWith('d_');
  const isHost = roomData?.players?.[0]?.id === userId;
  // הרשאה להעברת שלבים: רק המסביר, או המארח אם זה תור של בוט
  const canTriggerTransition = isIDescriber || (isBot && isHost);

  // לוגיקת סנכרון טיימר משחק (Step 5)
  useEffect(() => {
    if (!roomData?.timerEndsAt || roomData.isPaused || step !== 5) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((roomData.timerEndsAt - now) / 1000));
      setLocalTimeLeft(diff);

      if (diff === 0 && canTriggerTransition) {
        updateRoom({ step: 6, phaseEnded: null });
      }
    }, 100); 
    return () => clearInterval(interval);
  }, [roomData?.timerEndsAt, roomData?.isPaused, step, canTriggerTransition, updateRoom]);

  // לוגיקת סנכרון ספירה לאחור (Step 4)
  useEffect(() => {
    if (!roomData?.countdownEndsAt || step !== 4) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((roomData.countdownEndsAt - now) / 1000));
      setLocalCountdown(diff);

      if (diff === 0 && canTriggerTransition) {
        let duration = roomData.currentPhase === 'A' ? 30 : 60;
        if (roomId === "עומר") duration = 5;
        updateRoom({ 
          step: 5, 
          timerEndsAt: Date.now() + (duration * 1000), 
          roundScore: 0 
        });
      }
    }, 100);
    return () => clearInterval(interval);
  }, [roomData?.countdownEndsAt, step, canTriggerTransition, roomId, roomData?.currentPhase, updateRoom]);

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
    <div style={{ 
      backgroundColor: '#05081c', height: '100dvh', color: 'white', direction: 'rtl', 
      overscrollBehavior: 'none', overflow: 'hidden', userSelect: 'none', WebkitUserSelect: 'none'
    }}>
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
                const updates: any = { 
                  step: 4, 
                  countdownEndsAt: Date.now() + 3000, 
                  poolIndex: 0, roundScore: 0, currentPhase: 'A', gameDeck: [] 
                };
                if (roomId === "עומר" && (!roomData.shuffledPools || roomData.shuffledPools.length === 0)) {
                  const allCustom = roomData.players.reduce((acc: any[], p: any) => [...acc, ...(p.customWords || [])], []);
                  updates.shuffledPools = getInitialShuffledPools(allCustom);
                }
                updateRoom(updates);
              }} 
              onExit={handleFullReset} 
            />
          )}
          {step === 4 && currentP && (
            <CountdownStep 
              timer={localCountdown} 
              turnInfo={{name: currentP.name, team: roomData.teamNames[currentP.teamIdx]}} 
              isTeamMode={true} 
              currentPhase={roomData.currentPhase} 
            />
          )}
          {step === 5 && <GameStep roomData={{...roomData, timeLeft: localTimeLeft}} userId={userId!} targets={gameTargets} updateRoom={updateRoom} handleAction={handleScoreAction} onExit={handleFullReset} />}
          {step === 6 && (
            <ScoreStep 
              scores={roomData.totalScores} 
              entities={roomData.teamNames.slice(0, roomData.numTeams)} 
              phaseEnded={roomData.phaseEnded} 
              onNextRound={() => {
                const nextTeamIdx = (roomData.currentTeamIdx + 1) % roomData.numTeams;
                const teamPlayerIndices = { ...roomData.teamPlayerIndices };
                teamPlayerIndices[roomData.currentTeamIdx] = (teamPlayerIndices[roomData.currentTeamIdx] + 1);
                
                const playersInNextTeam = roomData.players
                  .filter((p: any) => p.teamIdx === nextTeamIdx)
                  .sort((a: any, b: any) => a.id.localeCompare(b.id));

                const nextPlayer = playersInNextTeam[teamPlayerIndices[nextTeamIdx] % playersInNextTeam.length];
                const globalIdx = roomData.players.findIndex((p: any) => p.id === nextPlayer.id);
                const nextScore = Number(roomData.totalScores[roomData.teamNames[nextTeamIdx]] || 0);

                const baseUpdate = { 
                  currentTurnIdx: globalIdx, currentTeamIdx: nextTeamIdx, teamPlayerIndices, 
                  countdownEndsAt: Date.now() + 3000, roundScore: 0, phaseEnded: null 
                };

                if (roomData.currentPhase !== 'A' && nextScore > 0 && nextScore % 7 === 0) {
                  updateRoom({ ...baseUpdate, step: 8 });
                } else {
                  updateRoom({ ...baseUpdate, step: 4 });
                }
              }} 
            />
          )}
          {step === 7 && <VictoryStep winnerName={Object.keys(roomData.totalScores).reduce((a, b) => roomData.totalScores[a] > roomData.totalScores[b] ? a : b)} onRestart={handleFullReset} />}
          {step === 8 && <SevenBoomStep roomData={{...roomData, timeLeft: localTimeLeft}} userId={userId!} updateRoom={updateRoom} handleAction={handleScoreAction} onExit={handleFullReset} />}
        </>
      )}
    </div>
  );
}