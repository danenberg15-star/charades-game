"use client";
import React from "react";

export default function RulesStep({ onStart }: { onStart: () => void }) {
  return (
    <div style={s.layout}>
      <div style={s.container}>
        <h1 style={{ ...s.title, fontSize: '1.8rem', marginBottom: '20px' }}>איך משחקים? 🏆</h1>
        
        <div style={{ ...s.scrollArea, overflowY: 'hidden' }}>
          <section style={{ ...s.section, marginBottom: '18px', paddingBottom: '10px' }}>
            <h2 style={{ ...s.subTitle, fontSize: '1.1rem' }}>1. התחברות</h2>
            <p style={s.text}>פותחים חדר חדש ושולחים את הקוד לחברים, או מצטרפים לחדר קיים בעזרת קוד או קישור.</p>
          </section>

          <section style={{ ...s.section, marginBottom: '18px', paddingBottom: '10px' }}>
            <h2 style={{ ...s.subTitle, fontSize: '1.1rem' }}>2. הגדרות החדר</h2>
            <p style={s.text}>בדף החדר תגדירו את סוג המשחק: <b>יחידים</b> או <b>קבוצות</b>. ברמה הקלה תקבלו מילים עם תמונות שכל ילד בן 5 מכיר.</p>
          </section>

          <section style={{ ...s.section, borderBottom: 'none', marginBottom: '15px' }}>
            <h2 style={{ ...s.subTitle, fontSize: '1.1rem' }}>3. מהלך המשחק והניקוד</h2>
            <p style={s.text}>
              בכל תור (דקה) תתאר מילה <b>בלי להשתמש בשורש המילה או בשפה אחרת.</b>
            </p>
            <p style={{ ...s.text, marginTop: '8px' }}>
              • <b>ניחשו?</b> לחץ על שם השחקן לניקוד (+1).<br/>
              • <b>קשה?</b> "דלג" יחליף מילה ויוריד נקודה (-1).
            </p>
          </section>

          <div style={{ textAlign: 'center', color: '#ffd700', fontWeight: '900', fontSize: '1.15rem', marginTop: '10px' }}>
            הראשון ל-50 נקודות מנצח!
          </div>
        </div>

        {/* כפתור ההתחלה */}
        <button onClick={onStart} style={{ ...s.button, height: '52px', marginTop: '10px' }}>
          הבנתי, בואו נתחיל!
        </button>

        {/* שורת הקרדיט ל-Pixabay - הועברה אל מתחת לכפתור */}
        <div style={{ textAlign: 'center', fontSize: '0.65rem', opacity: 0.4, marginTop: '10px', color: 'white' }}>
          Images courtesy of Pixabay
        </div>
      </div>
    </div>
  );
}

const s: any = {
  layout: { display: 'flex', flexDirection: 'column', height: '100dvh', backgroundColor: '#05081c', color: 'white', padding: '15px', direction: 'rtl', alignItems: 'center', justifyContent: 'center' },
  container: { width: '100%', maxWidth: '450px', height: 'auto', maxHeight: '98%', backgroundColor: '#1a1d2e', borderRadius: '30px', padding: '25px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255, 215, 0, 0.2)' },
  title: { color: '#ffd700', textAlign: 'center', fontWeight: '900' },
  scrollArea: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  section: { borderBottom: '1px solid rgba(255,255,255,0.1)' },
  subTitle: { color: '#ffd700', marginBottom: '6px', fontWeight: '700' },
  text: { fontSize: '0.95rem', lineHeight: '1.4', opacity: 0.9 },
  button: { width: '100%', backgroundColor: '#ffd700', color: '#05081c', border: 'none', borderRadius: '15px', fontSize: '1.3rem', fontWeight: '900', cursor: 'pointer', transition: 'transform 0.1s active' }
};