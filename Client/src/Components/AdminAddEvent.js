import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../Store/LanguageContext';

const AdminAddEvent = () => {
  const [eventAr, setEventAr] = useState('');
  const [eventEn, setEventEn] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!eventAr.trim() || !eventEn.trim()) {
      setError('يرجى إدخال اسم الفعالية بالعربي والإنجليزي');
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ar: eventAr, en: eventEn })
      });
      if (!res.ok) throw new Error('فشل الإضافة');
      setSuccess(true);
      setEventAr('');
      setEventEn('');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError('حدث خطأ أثناء إضافة الفعالية');
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      position: "relative",
      background: "linear-gradient(135deg, #f3e9dd 0%, #e9dbc7 35%, #f7f3e9 70%, #e2c9a7 100%)",
      fontFamily: "Tajawal, Cairo, Roboto, sans-serif",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: 0,
      padding: 0,
      overflowX: "hidden"
    }}>
      {/* زر العودة أعلى الصفحة */}
      <button
        onClick={() => navigate('/admin/login')}
        style={{
          position: "absolute",
          top: 100,
          left: lang === "ar" ? 32 : "auto",
          right: lang === "ar" ? "auto" : 32,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "0.6rem 1.3rem 0.6rem 1.1rem",
          border: "none",
          borderRadius: 100,
          background: "rgba(255,255,255,0.85)",
          boxShadow: "0 2px 12px 0 rgba(44,62,80,0.11)",
          fontWeight: 800,
          fontSize: "1.04rem",
          color: "#393E46",
          letterSpacing: "0.1px",
          cursor: "pointer",
          transition: "background 0.16s, box-shadow 0.16s, color 0.16s, transform 0.14s",
          backdropFilter: "blur(5px)",
          outline: "none",
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = "rgba(225, 208, 175,0.94)";
          e.currentTarget.style.color = "#812828";
          e.currentTarget.style.transform = "scale(1.049)";
          e.currentTarget.style.boxShadow = "0 6px 18px 1px rgba(78, 52, 25, 0.18)";
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = "rgba(255,255,255,0.85)";
          e.currentTarget.style.color = "#393E46";
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 2px 12px 0 rgba(44,62,80,0.11)";
        }}
      >
        {lang === "ar" ? (
          <>
            <span style={{ fontSize: "1.2em", marginRight: 5, transition: "color 0.2s" }}>{"←"}</span>
            <span>الرجوع</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: "1.2em", marginLeft: 5, transition: "color 0.2s" }}>{"→"}</span>
            <span>Back</span>
          </>
        )}
      </button>

      <div style={{
        maxWidth: 400,
        background: "rgba(255,255,255,0.97)",
        borderRadius: "20px",
        boxShadow: "0 8px 40px rgba(30, 64, 175, 0.10)",
        padding: "3.5rem 3.5rem",
        border: "2px solid #e9dbc7",
        minWidth: "320px",
        width: "100%",
        textAlign: "center",
      }}>
      <h2 style={{ textAlign: 'center', color: '#a67c52', marginBottom: 24 }}>إضافة فعالية جديدة</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>اسم الفعالية (عربي):</label>
          <input type="text" value={eventAr} onChange={e => setEventAr(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>اسم الفعالية (إنجليزي):</label>
          <input type="text" value={eventEn} onChange={e => setEventEn(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }} required />
        </div>
        {error && <div style={{ color: '#c00', marginBottom: 12, textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: '#43a047', marginBottom: 12, textAlign: 'center' }}>تمت إضافة الفعالية بنجاح</div>}
        <button type="submit" style={{ width: '100%', background: '#a67c52', color: '#fff', border: 'none', borderRadius: 6, padding: '0.7rem', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}>إضافة الفعالية</button>
      </form>
      </div>
    </div>
  );
};

export default AdminAddEvent;