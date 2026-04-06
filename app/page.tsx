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
  const roomDataRef = useRef(roomData);

  useEffect(() => { roomDataRef.current = roomData; }, [roomData]);

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
    
    // בחדר עומר, נאפשר לכל מי שנכנס להריץ את הטיימר אם הוא תקוע
    const shouldRunTimer = isIDescriber || (isBot && isHost) || (roomId === "עומר");
    if (!shouldRunTimer) return;

    const interval = setInterval(() => {
      const currentData = roomDataRef.current;
      if (!currentData || currentData.isPaused) return;

      if (step === 4) {
        if (currentData.preGameTimer > 0) updateRoom({ preGameTimer: currentData.preGameTimer - 1 });
        else updateRoom({ step: 5, timeLeft: 60, roundScore: 0 }); 
      } else if (step === 5) {
        if (currentData.timeLeft > 0) updateRoom({ timeLeft: currentData.timeLeft - 1 });
        else updateRoom({ step: 6, phaseEnded: null });
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
        updateRoom({ [`totalScores.${describerTeam}`]: increment(-2), roundScore: increment(-2), shuffledPools: pool });
      }
      return;
    }

    if (roomData.currentPhase === 'A') {
      const updatedDeck = [...(roomData.gameDeck || []), currentWord];
      const updates: any = { [`totalScores.${describerTeam}`]: increment(1), [`totalScores.${targetName}`]: increment(1), poolIndex: increment(1), roundScore: increment(1), gameDeck: updatedDeck };
      if (updatedDeck.length >= roomData.players.length * 5) {
        Object.assign(updates, { poolIndex: 0, shuffledPools: shuffleArray(updatedDeck), currentPhase: 'B', step: 6, phaseEnded: 'א' });
      }
      updateRoom(updates);
    } else {
      const updates: any = { [`totalScores.${targetName}`]: increment(points), roundScore: increment(points), poolIndex: increment(1) };
      if ((roomData.poolIndex + 1) >= pool.length) {
        if (roomData.currentPhase === 'B') updateRoom({ ...updates, currentPhase: 'C', shuffledPools: shuffleArray(pool), poolIndex: 0, step: 6, phaseEnded: 'ב' });
        else updateRoom({ ...updates, step: 7 });
      } else updateRoom(updates);
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

          {roomData.isPaused && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(5, 8, 28, 0.98)', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', direction: 'rtl', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '100%', maxWidth: '450px', backgroundColor: '#1a1d2e', borderRadius: '35px', padding: '30px', border: '2px solid rgba(0, 242, 255, 0.4)', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 0 40px rgba(0, 242, 255, 0.2)' }}>
                <h2 style={{ color: 'white', textAlign: 'center', fontSize: '2.2rem', fontWeight: '900', margin: 0 }}>המשחק בהפסקה</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {roomData.teamNames.slice(0, roomData.numTeams).map((team: string) => (
                    <div key={team} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <button onClick={() => updateRoom({ [`totalScores.${team}`]: increment(-1) })} style={{ width: '45px', height: '45px', borderRadius: '12px', border: '2px solid #ef4444', color: '#ef4444', background: 'none', fontSize: '1.8rem', fontWeight: '900' }}>-</button>
                      <div style={{ textAlign: 'center', flex: 1 }}><div style={{ color: 'white', fontWeight: 'bold' }}>{team}</div><div style={{ fontSize: '1.8rem', color: '#00f2ff', fontWeight: '900' }}>{roomData.totalScores[team] || 0}</div></div>
                      <button onClick={() => updateRoom({ [`totalScores.${team}`]: increment(1) })} style={{ width: '45px', height: '45px', borderRadius: '12px', border: '2px solid #00f2ff', color: '#00f2ff', background: 'none', fontSize: '1.8rem', fontWeight: '900' }}>+</button>
                    </div>
                  ))}
                </div>
                <button onClick={() => updateRoom({ isPaused: false })} style={{ height: '65px', backgroundColor: '#00f2ff', color: '#05081c', borderRadius: '18px', fontWeight: '900', border: 'none', fontSize: '1.3rem', marginTop: '10px' }}>המשך לשחק</button>
                <button onClick={handleFullReset} style={{ height: '55px', backgroundColor: 'transparent', border: '2px solid #ef4444', color: '#ef4444', borderRadius: '18px', fontWeight: 'bold', fontSize: '1.1rem' }}>צא מהחדר</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}