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
  const { mounted, userId, roomId, roomData, step, setStep, updateRoom, handleFullReset, handleCreateRoom, handleJoinRoom, setUserName, increment } = useGameState();

  const currentP = roomData?.players && roomData?.currentTurnIdx !== undefined ? roomData.players[roomData.currentTurnIdx] : null;
  const isIDescriber = currentP?.id === userId;

  useEffect(() => {
    if (!roomId || !roomData || !currentP || roomData.isPaused || step < 4 || step === 8) return;
    const isBot = currentP?.id?.startsWith('d_');
    const isHost = roomData.players?.[0]?.id === userId;
    if (!isIDescriber && !(isBot && isHost)) return;

    const interval = setInterval(() => {
      if (step === 4) {
        if (roomData.preGameTimer > 0) updateRoom({ preGameTimer: roomData.preGameTimer - 1 });
        else updateRoom({ step: 5, timeLeft: 5, roundScore: 0 }); // QA Timer: 5s
      } else if (step === 5) {
        if (roomData.timeLeft > 0) updateRoom({ timeLeft: roomData.timeLeft - 1 });
        else {
          // בסיום זמן: עוברים למסך תוצאות מבלי לקדם אינדקס (המילה חוזרת בתור הבא)
          updateRoom({ step: 6, phaseEnded: null });
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [step, roomId, roomData, isIDescriber, currentP, updateRoom]);

  if (!mounted) return null;

  const handleScoreAction = (targetName: string, points: number = 1) => {
    if (!roomData || !currentP || roomData.isPaused) return;
    const describerTeam = roomData.teamNames[currentP.teamIdx];
    const pool = [...(roomData.shuffledPools || [])];
    const currentWord = pool[roomData.poolIndex];

    if (targetName === "SKIP") {
      if (roomData.currentPhase === 'A') {
        // שלב א': מילה שדלגו עליה נמחקת מהמשחק [cite: 10, 36]
        updateRoom({ poolIndex: increment(1) });
      } else {
        // שלב ב/ג: מילה חוזרת לסוף החפיסה וקנס 2- [cite: 17, 43, 47]
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
      // שלב א': נקודה למנחש ונקודה למתאר 
      const updatedDeck = [...(roomData.gameDeck || []), currentWord];
      const nPlayers = roomData.players.length;
      
      const updates: any = {
        [`totalScores.${describerTeam}`]: increment(1),
        [`totalScores.${targetName}`]: increment(1),
        poolIndex: increment(1),
        roundScore: increment(1),
        gameDeck: updatedDeck
      };

      // מעבר ל-B רק כשמגיעים למכסה (N*5) 
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
      // שלב ב/ג: נקודה לקבוצה [cite: 16, 40, 42]
      const updates: any = {
        [`totalScores.${targetName}`]: increment(points),
        roundScore: increment(points),
        poolIndex: increment(1)
      };

      // בדיקה אם עברנו על כל החפיסה
      if ((roomData.poolIndex + 1) >= pool.length) {
        if (roomData.currentPhase === 'B') {
          // מעבר לסבב ג' עם ערבוב מחדש של המילים
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