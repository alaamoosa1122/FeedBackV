import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EventFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const eventName = params.get('event');

  useEffect(() => {
    if (!eventName) {
      setError('لم يتم تحديد الفعالية');
      setLoading(false);
      return;
    }
            fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/feedback`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(fb => fb.event === eventName);
        setFeedbacks(filtered);
        setLoading(false);
      })
      .catch(() => {
        setError('تعذر جلب التقييمات');
        setLoading(false);
      });
  }, [eventName]);

  return (
    <div style={{ 
      maxWidth: 700, 
      margin: '2rem auto', 
      marginTop: 'clamp(100px, 15vh, 120px)',
      background: '#fff', 
      borderRadius: 16, 
      boxShadow: '0 2px 12px #eee', 
      padding: '2.5rem 1.5rem' 
    }}>
      <h2 style={{ textAlign: 'center', color: '#1a4d8f', marginBottom: 24 }}>تقييمات الفعالية: {eventName || ''}</h2>
      {loading && <div style={{ textAlign: 'center', color: '#888' }}>جاري التحميل...</div>}
      {error && <div style={{ textAlign: 'center', color: '#c00', marginBottom: 16 }}>{error}</div>}
      {!loading && !error && feedbacks.length === 0 && (
        <div style={{ textAlign: 'center', color: '#888' }}>لا توجد تقييمات لهذه الفعالية بعد.</div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {feedbacks.map((fb, idx) => (
          <div key={fb._id || idx} style={{ background: '#f7f3e9', borderRadius: 12, padding: '1.2rem 1.5rem', boxShadow: '0 1px 6px #eee' }}>
            <div style={{ fontWeight: 700, color: '#a67c52', fontSize: '1.1rem', marginBottom: 8 }}>
              الاسم: <span style={{ color: '#333' }}>{fb.name}</span>
            </div>
            <div style={{ fontWeight: 600, color: '#a67c52', fontSize: '1.05rem', marginBottom: 8 }}>
              التقييم:
              <span style={{ fontSize: '1.3rem', color: '#ffb400', marginLeft: 8 }}>
                {Array.from({ length: fb.rating }, (_, i) => (
                  <span key={i}>★</span>
                ))}
              </span>
            </div>
            <div style={{ fontWeight: 600, color: '#a67c52', fontSize: '1.05rem', marginBottom: 8 }}>
              التعليق:
              <div style={{ color: '#333', fontWeight: 400, marginTop: 2 }}>{fb.comments || <span style={{color:'#bbb'}}>لا يوجد تعليق</span>}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <button onClick={() => navigate(-1)} style={{ background: '#a67c52', color: '#fff', border: 'none', borderRadius: 6, padding: '0.7rem 2.2rem', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer' }}>رجوع</button>
      </div>
    </div>
  );
};

export default EventFeedback; 