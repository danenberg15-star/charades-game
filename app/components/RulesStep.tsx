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
              • חצי דקה לכל שחקן לתאר כמה שיותר סלבס.<br/>
              • <b>כולם מנחשים!</b> נקודה למנחש ונקודה למתאר.<br/>
              • מסתיים כשנאספו 5 סלבס לכל משתתף.
            </p>
          </section>

          <section style={s.section}>
            <h2 style={s.subTitle}>2. שלב ב' 🗣️</h2>
            <p style={s.text}>
              • משחקים רק עם הסלבס שננעלו בחפיסה.<br/>
              • מותר להגיד <b>מילה אחת בלבד</b>.<br/>
              • ניחוש נכון = +1. דילוג = <b>2- נקודות</b>.
            </p>
          </section>

          <section style={{ ...s.section, borderBottom: 'none' }}>
            <h2 style={s.subTitle}>3. סבב ג' ואחרון 🎭</h2>
            <p style={s.text}>
              • הסבר ב<b>פנטומימה בלבד</b>.<br/>
              • דילוג מוריד 2 נקודות והסלב חוזר לסוף החפיסה.
            </p>
          </section>
        </div>

        <div style={s.footer}>
          <div style={{ textAlign: 'center', color: '#00f2ff', fontWeight: '900', fontSize: '1.1rem', marginBottom: '10px' }}>
            הקבוצה עם הכי הרבה נקודות מנצחת! 👑
          </div>
          <button onClick={onStart} style={s.button}>הבנתי, בואו נתחיל!</button>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.65rem', opacity: 0.4, marginTop: '10px', color: 'white' }}>
          Images courtesy of Pixabay
        </div>
      </div>
    </div>
  );
}

const s: any = {
  layout: { display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: '#05081c', color: 'white', padding: '15px', direction: 'rtl', alignItems: 'center', justifyContent: 'center' },
  container: { width: '100%', maxWidth: '450px', backgroundColor: '#1a1d2e', borderRadius: '30px', padding: '20px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(0, 242, 255, 0.2)', maxHeight: '95vh' },
  title: { color: '#00f2ff', textAlign: 'center', fontWeight: '900' },
  scrollArea: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' },
  section: { borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' },
  subTitle: { color: '#00f2ff', marginBottom: '3px', fontWeight: '700', fontSize: '1.1rem' },
  text: { fontSize: '0.9rem', lineHeight: '1.4', opacity: 0.9, margin: 0 },
  footer: { width: '100%', paddingTop: '5px', borderTop: '1px solid rgba(0, 242, 255, 0.1)' },
  button: { width: '100%', height: '52px', backgroundColor: '#00f2ff', color: '#05081c', border: 'none', borderRadius: '15px', fontSize: '1.25rem', fontWeight: '900', cursor: 'pointer' }
};