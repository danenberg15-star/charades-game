"use client";
import { useEffect, useState, useRef } from "react";
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
  const { mounted, userId, roomId, roomData, step, setStep, updateRoom, handleFullReset, handleCreateRoom, handleJoinRoom, increment } = useGameState();
  const [urlRoomId, setUrlRoomId] = useState<string | null>(null);

  const roomDataRef = useRef(roomData);
  useEffect(() => { roomDataRef.current = roomData; }, [roomData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const room = params.get("room");
      if (room) setUrlRoomId(room);
    }
  }, []);

  if (!mounted) return null;

  return (
    <main style={{ height: '100dvh', width: '100vw', backgroundColor: '#05081c', color: 'white', overflow: 'hidden', position: 'relative' }}>
      <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
        
        {step === 0 && <RulesStep onStart={() => setStep(1)} />}
        
        {step === 1 && (
          <EntryStep 
            onJoin={(name: string, code: string, words: any[]) => handleJoinRoom(code, { name, customWords: words })} 
            onCreate={(name: string, words: any[]) => handleCreateRoom({ name, customWords: words })}
            initialCode={urlRoomId}
          />
        )}

        {step === 3 && roomData && (
          <SetupStep 
            roomId={roomId!} 
            gameMode={roomData.gameMode} 
            setGameMode={(m: any) => updateRoom({ gameMode: m })}
            difficulty={roomData.difficulty} 
            setDifficulty={(d: any) => updateRoom({ difficulty: d })}
            numTeams={roomData.numTeams} 
            setNumTeams={(n: any) => updateRoom({ numTeams: n })}
            players={roomData.players}
            onPlayerMove={(pId: string, tIdx: number) => {
              const newPlayers = roomData.players.map((p: any) => p.id === pId ? { ...p, teamIdx: tIdx } : p);
              updateRoom({ players: newPlayers });
            }}
            onStart={() => {
              const updates: any = { step: 4, preGameTimer: 3 };
              // לוגיקת טעינה עצלה לחדר עומר:
              if (roomId === "עומר" && (!roomData.shuffledPools || roomData.shuffledPools.length === 0)) {
                const allCustom = roomData.players.flatMap((p: any) => p.customWords || []);
                updates.shuffledPools = getInitialShuffledPools(allCustom);
              }
              updateRoom(updates);
            }}
            teamNames={roomData.teamNames}
            updateTeamNames={(names: string[]) => updateRoom({ teamNames: names })}
            onExit={handleFullReset}
            editTeamName={(idx: number) => {
              const newName = prompt("הכנס שם קבוצה חדש:", roomData.teamNames[idx]);
              if (newName) {
                const newNames = [...roomData.teamNames];
                newNames[idx] = newName;
                updateRoom({ teamNames: newNames });
              }
            }}
          />
        )}

        {step === 4 && roomData && (
          <CountdownStep 
            {...({
              // אנחנו שולחים את preGameTimer תחת השם preGameTimer למקרה שזה השם המצופה
              preGameTimer: roomData.preGameTimer,
              // ובנוסף timeLeft לגיבוי
              timeLeft: roomData.preGameTimer
            } as any)}
            onComplete={() => {
              if (roomData.players[roomData.currentTurnIdx].id === userId) {
                updateRoom({ step: 5, timeLeft: 60, isPaused: false });
              }
            }} 
          />
        )}

        {step === 5 && roomData && (
          <GameStep 
            roomData={roomData} 
            userId={userId} 
            targets={roomData.teamNames.slice(0, roomData.numTeams)}
            updateRoom={updateRoom}
            onExit={handleFullReset}
            handleAction={(target: string) => {
              if (target === "SKIP") {
                const penalty = roomData.currentPhase === 'A' ? 0 : -2;
                updateRoom({ 
                  poolIndex: increment(1),
                  [`totalScores.${roomData.teamNames[roomData.currentTeamIdx]}`]: increment(penalty)
                });
              } else {
                updateRoom({ 
                  poolIndex: increment(1),
                  roundScore: increment(1),
                  [`totalScores.${target}`]: increment(1)
                });
              }
            }}
          />
        )}

        {step === 6 && roomData && (
          <ScoreStep 
            {...({
              // העברת הנתונים כ-Any כדי לעקוף את השגיאה של TS שאינו מזהה את ה-Prop
              data: roomData,
              roomData: roomData
            } as any)}
            onNext={() => {
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

        {step === 7 && roomData && (
          <VictoryStep 
            winnerName={Object.keys(roomData.totalScores).reduce((a, b) => roomData.totalScores[a] > roomData.totalScores[b] ? a : b)} 
            onRestart={handleFullReset} 
          />
        )}
        
        {step === 8 && roomData && (
          <SevenBoomStep 
            roomData={roomData} 
            onComplete={() => updateRoom({ step: 4, preGameTimer: 3 })} 
          />
        )}

      </div>
    </main>
  );
}