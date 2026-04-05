"use client";
import React from "react";

export default function RulesStep({ onStart }: { onStart: () => void }) {
  return (
    <div style={s.layout}>
      <div style={s.container}>
        <h1 style={{ ...s.title, fontSize: '1.8rem', marginBottom: '15px' }}>איך משחקים? 🏆</h1>
        
        <div style={s.scrollArea}>
          <section style={s.section}>
            <h2 style={s.subTitle}>1. שלב א': בניית החפיסה 🎴</h2>
            <p style={s.text}>
              זהו שלב מקדים שבו מייצרים את מאגר השמות למשחק:<br/>
              • לכל שחקן יש <b>דקה אחת</b> לתאר כמה שיותר סלבריטאים.<br/>
              • <b>הניחוש פתוח לכולם!</b> כל ניחוש מוצלח מעניק נקודה אחת לקבוצת המנחש ונקודה אחת לקבוצת המתאר.<br/>
              • סלבריטאי שדלגו עליו – נמחק מהמשחק.<br/>
              • השלב מסתיים כשנאספו 5 סלבריטאים לכל משתתף.
            </p>
          </section>

          <section style={s.section}>
            <h2 style={s.subTitle}>2. שלב ב' 🗣️</h2>
            <p style={s.text}>
              משחקים רק עם הסלבריטאים ש"ננעלו" בחפיסה.<br/>
              • בכל תור יש דקה אחת ורק חברי הקבוצה של המתאר יכולים לנחש.<br/>
              • המתאר יכול להגיד <b>מילה אחת בלבד</b> לקבוצה שלו.<br/>
              • ניחשתם? לוחצים על שם הקבוצה (+1).<br/>
              • דילגתם? יורדות לקבוצה <b>2 נקודות</b>.
            </p>
          </section>

          <section style={{ ...s.section, borderBottom: 'none' }}>
            <h2 style={s.subTitle}>3. סבב ג' ואחרון 🎭</h2>
            <p style={s.text}>
              זהה לגמרי לסבב ב', אלא שאסור למתאר לדבר בכלל!<br/>
              • המתאר מסביר ב<b>פנטומימה בלבד</b> (ומילה אחת מייצגת).<br/>
              • דילגתם? <b>2- נקודות</b> והסלבריטאי חוזר לסוף החפיסה.
            </p>
          </section>

          <div style={{ textAlign: 'center', color: '#ffd700', fontWeight: '900', fontSize: '1.1rem', marginTop: '10px' }}>
            הקבוצה שצברה הכי הרבה נקודות בסוף סבב ג' מנצחת! 👑
          </div>
        </div>

        <button onClick={onStart} style={s.button}>
          הבנתי, בואו נתחיל!
        </button>
      </div>
    </div>
  );
}

const s: any = {
  layout: { display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: '#05081c', color: 'white', padding: '15px', direction: 'rtl', alignItems: 'center', justifyContent: 'center' },
  container: { width: '100%', maxWidth: '450px', backgroundColor: '#1a1d2e', borderRadius: '30px', padding: '20px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255, 215, 0, 0.2)', maxHeight: '95vh' },
  title: { color: '#ffd700', textAlign: 'center', fontWeight: '900' },
  scrollArea: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', paddingRight: '5px' },
  section: { borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' },
  subTitle: { color: '#ffd700', marginBottom: '4px', fontWeight: '700', fontSize: '1.1rem' },
  text: { fontSize: '0.9rem', lineHeight: '1.4', opacity: 0.9 },
  button: { width: '100%', height: '52px', backgroundColor: '#ffd700', color: '#05081c', border: 'none', borderRadius: '15px', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer', marginTop: '15px', flexShrink: 0 }
};