import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot, updateDoc, arrayUnion, getDoc, deleteDoc, increment } from "firebase/firestore";
import { generateRoomCode, getInitialShuffledPools } from "./game-utils";

export function useGameState() {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<any>(null);
  const [step, setStep] = useState(0); 
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setMounted(true);
    const id = localStorage.getItem("alias_userId") || "u_" + Math.random().toString(36).substring(2, 9);
    setUserId(id); localStorage.setItem("alias_userId", id);
    const n = localStorage.getItem("alias_userName");
    if (n) { setUserName(n); const r = localStorage.getItem("alias_roomId"); if (r) setRoomId(r); else setStep(1); }
  }, []);

  useEffect(() => {
    if (!roomId) return;
    return onSnapshot(doc(db, "rooms", roomId), async (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        const INACTIVITY_LIMIT = 5 * 60 * 1000; 
        if (d.lastActivity && (Date.now() - d.lastActivity > INACTIVITY_LIMIT)) {
            if (d.players && d.players[0].id === userId) await deleteDoc(doc(db, "rooms", roomId));
            handleFullReset(); return;
        }
        setRoomData(d);
        if (d.step !== step) setStep(d.step);
      } else if (roomId) handleFullReset();
    });
  }, [roomId, step, userId]);

  const updateRoom = async (newData: any) => { 
    if (roomId) await updateDoc(doc(db, "rooms", roomId), { ...newData, lastActivity: Date.now() }); 
  };

  const handleFullReset = () => { localStorage.clear(); window.location.href = '/'; };

  const handleCreateRoom = async (payload: { name: string, customWords: any[] }) => {
    const id = generateRoomCode();
    setRoomId(id); setStep(3);
    localStorage.setItem("alias_roomId", id); localStorage.setItem("alias_userName", payload.name);

    await setDoc(doc(db, "rooms", id), {
      id, step: 3, createdAt: Date.now(), lastActivity: Date.now(), 
      gameMode: "team", difficulty: "easy", numTeams: 2,
      players: [{ id: userId, name: payload.name, teamIdx: 0, customWords: payload.customWords }],
      teamNames: ["קבוצה א'", "קבוצה ב'", "קבוצה ג'", "קבוצה ד'"],
      totalScores: {}, roundScore: 0, timeLeft: 5, 
      isPaused: false, currentTurnIdx: 0, currentTeamIdx: 0,
      teamPlayerIndices: { 0: 0, 1: 0, 2: 0, 3: 0 },
      currentPhase: 'A', poolIndex: 0, preGameTimer: 3, shuffledPools: [], gameDeck: []
    });
  };

  const handleJoinRoom = async (idInput: string, payload: { name: string, customWords: any[] }) => {
    const id = idInput.toUpperCase();
    if (id === "עומר") {
      const qp = [{ id: userId, name: payload.name || "עומר", teamIdx: 0, customWords: payload.customWords }, ...Array(5).fill(0).map((_, i) => ({ id: `d_${i}`, name: `שחקן ${i+2}`, teamIdx: 1, customWords: [] }))];
      localStorage.setItem("alias_roomId", "עומר"); localStorage.setItem("alias_userName", payload.name || "עומר");
      await setDoc(doc(db, "rooms", "עומר"), { 
        id: "עומר", step: 3, createdAt: Date.now(), lastActivity: Date.now(), 
        gameMode: "team", numTeams: 2, difficulty: "easy", 
        players: qp, teamNames: ["קבוצה א'", "קבוצה ב'"], totalScores: {}, roundScore: 0, 
        timeLeft: 5, isPaused: false, currentTurnIdx: 0, currentTeamIdx: 0, 
        teamPlayerIndices: { 0: 0, 1: 0, 2: 0, 3: 0 }, currentPhase: 'A', poolIndex: 0, 
        preGameTimer: 3, shuffledPools: getInitialShuffledPools(payload.customWords), gameDeck: [] 
      });
      setRoomId("עומר"); setStep(3); return;
    }
    const snap = await getDoc(doc(db, "rooms", id));
    if (snap.exists()) { 
      const data = snap.data();
      setRoomId(id); setStep(data.step); localStorage.setItem("alias_roomId", id); localStorage.setItem("alias_userName", payload.name);
      if (data.step === 3) await updateDoc(doc(db, "rooms", id), { players: arrayUnion({ id: userId, name: payload.name, teamIdx: 0, customWords: payload.customWords }) }); 
    } else alert("חדר לא נמצא");
  };

  return { mounted, userId, roomId, roomData, step, setStep, userName, setUserName, updateRoom, handleFullReset, handleCreateRoom, handleJoinRoom, increment };
}