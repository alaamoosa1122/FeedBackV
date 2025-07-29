import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAddEvent = () => {
  const [eventAr, setEventAr] = useState('');
  const [eventEn, setEventEn] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      maxWidth: 400,
      margin: '110px auto 48px', // <-- المسافة تحت الفورم قبل الفوتر (عدّل كما تحب)
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 2px 12px #eee',
      padding: '2rem',
      // لا يوجد خط سفلي ولا أي حد إضافي هنا أبداً!
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
  );
};

export default AdminAddEvent;