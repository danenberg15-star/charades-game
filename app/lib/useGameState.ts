import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot, updateDoc, arrayUnion, getDoc, deleteDoc } from "firebase/firestore";
import { generateRoomCode } from "./game-utils";

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
    
    if (n) { 
      setUserName(n); 
      const r = localStorage.getItem("alias_roomId"); 
      if (r) setRoomId(r); else setStep(1); 
    }
  }, []);

  useEffect(() => {
    if (!roomId) return;
    return onSnapshot(doc(db, "rooms", roomId), async (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        const INACTIVITY_LIMIT = 5 * 60 * 1000; 
        if (d.lastActivity && (Date.now() - d.lastActivity > INACTIVITY_LIMIT)) {
            if (d.players && d.players[0].id === userId) {
                await deleteDoc(doc(db, "rooms", roomId));
            }
            handleFullReset(); 
            return;
        }
        setRoomData(d);
        if (d.step !== step) setStep(d.step);
      } else {
        if (roomId) handleFullReset();
      }
    });
  }, [roomId, step, userId]);

  const updateRoom = async (newData: any) => { 
    if (roomId) {
      await updateDoc(doc(db, "rooms", roomId), { ...newData, lastActivity: Date.now() }); 
    }
  };

  const handleFullReset = () => { localStorage.clear(); window.location.href = '/'; };

  const handleCreateRoom = async (payload: { name: string, customWords: any[] }) => {
    const finalName = payload.name;
    const id = generateRoomCode();
    
    setRoomId(id);
    setStep(3);
    localStorage.setItem("alias_roomId", id);
    localStorage.setItem("alias_userName", finalName);

    await setDoc(doc(db, "rooms", id), {
      id, step: 3, createdAt: Date.now(), 
      lastActivity: Date.now(), 
      gameMode: "team",
      difficulty: "easy",
      numTeams: 2,
      players: [{ id: userId, name: finalName, teamIdx: 0, customWords: payload.customWords }],
      teamNames: ["קבוצה א'", "קבוצה ב'", "קבוצה ג'", "קבוצה ד'"],
      totalScores: {}, roundScore: 0, 
      timeLeft: 5, // QA Timer
      isPaused: false, 
      currentTurnIdx: 0,
      currentTeamIdx: 0, // מעקב אחרי הקבוצה הנוכחית
      teamPlayerIndices: { 0: 0, 1: 0, 2: 0, 3: 0 }, // מעקב אחרי השחקן הבא בכל קבוצה
      poolIndex: 0, preGameTimer: 3, shuffledPools: []
    });
  };

  const handleJoinRoom = async (idInput: string, payload: { name: string, customWords: any[] }) => {
    const finalName = payload.name;
    const id = idInput.toUpperCase();
    const snap = await getDoc(doc(db, "rooms", id));
    if (snap.exists()) { 
      const data = snap.data();
      setRoomId(id); setStep(data.step); localStorage.setItem("alias_roomId", id); 
      if (data.step === 3) {
        await updateDoc(doc(db, "rooms", id), { 
          players: arrayUnion({ id: userId, name: finalName, teamIdx: 0, customWords: payload.customWords }),
          lastActivity: Date.now() 
        }); 
      } 
    } else { alert("חדר לא נמצא"); }
  };

  return { mounted, userId, roomId, roomData, step, setStep, userName, setUserName, updateRoom, handleFullReset, handleCreateRoom, handleJoinRoom };
}