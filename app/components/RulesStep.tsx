"use client";
import React from "react";

export default function RulesStep({ onStart }: { onStart: () => void }) {
  return (
    <div style={s.layout}>
      <div style={s.container}>
        <h1 style={{ ...s.title, fontSize: '1.8rem', marginBottom: '20px' }}>איך משחקים? 🏆</h1>
        
        <div style={{ ...s.scrollArea, overflowY: 'auto' }}>
          <section style={{ ...s.section, marginBottom: '18px', paddingBottom: '10px' }}>
            <h2 style={{ ...s.subTitle, fontSize: '1.1rem' }}>1. שלב א': בניית החפיסה 🎴</h2>
            <p style={s.text}>
              זהו שלב מקדים שבו מייצרים את מאגר השמות למשחק:
              לכל שחקן יש דקה אחת לתאר כמה שיותר סלבריטאים.
              הניחוש פתוח לכולם! כל ניחוש מוצלח מעניק נקודה אחת לקבוצת המנחש ונקודה אחת לקבוצת המתאר. סלבריטאי שדלגו עליו – נמחק מהמשחק.
              השלב מסתיים ברגע שנאספו מספיק סלבריטאים לחפיסה (5 סלבריטאים לכל משתתף).
            </p>
          </section>

          <section style={{ ...s.section, marginBottom: '18px', paddingBottom: '10px' }}>
            <h2 style={{ ...s.subTitle, fontSize: '1.1rem' }}>2. שלב ב' 🗣️</h2>
            <p style={s.text}>
              מעכשיו משחקים רק עם הסלבריטאים ש"ננעלו" בחפיסה בשלב המקדים.
              בכל תור יש דקה אחת ורק חברי הקבוצה של המתאר יכולים לנחש ולזכות בנקודה.
              המתאר יכול להגיד רק מילה אחת לקבוצה שלו שאמורה לייצג את הסלבריטי בצורה הטובה ביותר.
              אם הם הצליחו הוא לוחץ של שם הקבוצה שלו והם זוכים בנקודה.
              המתאר יכול לדלג על סלבריטאי אך לקבוצה שלו ירדו 2 נקודות.
            </p>
          </section>

          <section style={{ ...s.section, borderBottom: 'none', marginBottom: '10px' }}>
            <h2 style={{ ...s.subTitle, fontSize: '1.1rem' }}>3. סבב ג' ואחרון 🎭</h2>
            <p style={s.text}>
              הסבב הזה זהה לגמרי לסבב ב' אלא שאסור למתאר לדבר בכלל והוא יכול רק בפנטומימה להסביר לקבוצה שלו מי הסלבריטאי.
              סלבריטאי שדלגו עליו – חוזר לסוף החפיסה ומורידים 2 נקודות לקבוצה.
              הקבוצה שצברה במצטבר הכי הרבה נקודות בסוף סבב ג' מנצחת את המשחק! 👑
            </p>
          </section>
        </div>

        <button onClick={onStart} style={{ ...s.button, height: '52px', marginTop: '10px' }}>
          הבנתי, בואו נתחיל!
        </button>

        <div style={{ textAlign: 'center', fontSize: '0.65rem', opacity: 0.4, marginTop: '10px', color: 'white' }}>
          Images courtesy of Pixabay
        </div>
      </div>
    </div>
  );
}

const s: any = {
  layout: { display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: '#05081c', color: 'white', padding: '15px', direction: 'rtl', alignItems: 'center', justifyContent: 'center' },
  container: { width: '100%', maxWidth: '450px', height: 'auto', maxHeight: '98%', backgroundColor: '#1a1d2e', borderRadius: '30px', padding: '25px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(0, 242, 255, 0.2)' },
  title: { color: '#00f2ff', textAlign: 'center', fontWeight: '900' },
  scrollArea: { flex: 1, display: 'flex', flexDirection: 'column' },
  section: { borderBottom: '1px solid rgba(255,255,255,0.1)' },
  subTitle: { color: '#00f2ff', marginBottom: '8px', fontWeight: '700' },
  text: { fontSize: '0.9rem', lineHeight: '1.5', opacity: 0.8 },
  button: { width: '100%', backgroundColor: '#00f2ff', color: '#05081c', border: 'none', borderRadius: '15px', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer' }
};