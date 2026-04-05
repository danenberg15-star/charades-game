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
        else updateRoom({ step: 5, timeLeft: 5, roundScore: 0 }); // QA Timer: 5 seconds
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

    if (targetName === "SKIP") {
      const entity = roomData.teamNames[currentP.teamIdx];
      newScores[entity] = (newScores[entity] || 0) - 2;
      updateRoom({ roundScore: (roomData.roundScore || 0) - 2, poolIndex: newIndex, totalScores: newScores });
      return;
    }

    const teamEntity = roomData.teamNames[currentP.teamIdx];
    newScores[teamEntity] = (newScores[teamEntity] || 0) + points;
    
    const pool = roomData.shuffledPools || [];
    if (newIndex >= pool.length) {
      updateRoom({ totalScores: newScores, step: 7, winner: Object.keys(newScores).reduce((a, b) => newScores[a] > newScores[b] ? a : b) });
    } else {
      updateRoom({ roundScore: (roomData.roundScore || 0) + points, poolIndex: newIndex, totalScores: newScores });
    }
  };

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
                updateRoom({ step: 4, preGameTimer: 3, shuffledPools: getInitialShuffledPools(allCustom), poolIndex: 0, roundScore: 0 });
              }} 
              onExit={handleFullReset} 
            />
          )}
          {step === 4 && currentP && <CountdownStep timer={roomData.preGameTimer} turnInfo={{name: currentP.name, team: roomData.teamNames[currentP.teamIdx]}} isTeamMode={true} currentPhase="A" />}
          {step === 5 && <GameStep roomData={roomData} userId={userId!} targets={[roomData.teamNames[currentP.teamIdx]]} updateRoom={updateRoom} handleAction={handleScoreAction} onExit={handleFullReset} />}
          {step === 6 && (
            <ScoreStep 
              scores={roomData.totalScores} 
              entities={roomData.teamNames.slice(0, roomData.numTeams)} 
              phaseEnded={roomData.phaseEnded} 
              onNextRound={() => {
                // לוגיקת תורות: קבוצה אחרת בכל פעם
                const nextTeamIdx = (roomData.currentTeamIdx + 1) % roomData.numTeams;
                const teamPlayerIndices = { ...roomData.teamPlayerIndices };
                
                // קידום השחקן שסיים את תורו עבור הקבוצה שלו
                teamPlayerIndices[roomData.currentTeamIdx] = (teamPlayerIndices[roomData.currentTeamIdx] + 1);

                // מציאת השחקן הבא של הקבוצה החדשה
                const playersInNextTeam = roomData.players.filter((p: any) => p.teamIdx === nextTeamIdx);
                const nextPlayerInTeamIdx = teamPlayerIndices[nextTeamIdx] % playersInNextTeam.length;
                const nextPlayer = playersInNextTeam[nextPlayerInTeamIdx];
                
                // מציאת האינדקס הגלובלי של השחקן בתוך מערך ה-players
                const globalIdx = roomData.players.findIndex((p: any) => p.id === nextPlayer.id);

                updateRoom({ 
                  step: 4, 
                  currentTurnIdx: globalIdx, 
                  currentTeamIdx: nextTeamIdx,
                  teamPlayerIndices: teamPlayerIndices,
                  preGameTimer: 3, 
                  roundScore: 0 
                });
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