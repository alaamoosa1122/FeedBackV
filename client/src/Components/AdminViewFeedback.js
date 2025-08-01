import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from '../Store/LanguageContext';

const AdminViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const eventFilter = params.get('event');
  const [deleteMsg, setDeleteMsg] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(true);
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openGroups, setOpenGroups] = useState({});
  const [eventsList, setEventsList] = useState([]);

  // حماية الصفحة - فقط إذا موجود isAdmin = true في localStorage
  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/admin/login'); 
    }
  }, [navigate])

  useEffect(() => {
            fetch(`${process.env.REACT_APP_API_URL}/api/events`)
      .then(res => res.json())
      .then(setEventsList)
      .catch(() => setEventsList([]));
  }, [lang]);

  useEffect(() => {
    setLoading(true);
    setFetchError("");
            fetch(`${process.env.REACT_APP_API_URL}/api/feedback`)
      .then(res => res.json())
      .then(data => {
        let all = data;
        if (eventFilter) {
          all = all.filter(fb => fb.event === eventFilter);
        }
        setFeedbacks(all);
        setLoading(false);
      })
      .catch(() => {
        setFetchError(lang === 'ar' ? 'تعذر جلب التقييمات من الخادم' : 'Failed to fetch feedbacks from server');
        setLoading(false);
      });
  }, [eventFilter, lang]);

  // حذف تقييم مفرد
  const handleDelete = async (idx) => {
    setDeleteError("");
    if (!window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا التقييم؟' : 'Are you sure you want to delete this feedback?')) return;
    const fbToDelete = feedbacks[idx];
    try {
              const res = await fetch(`${process.env.REACT_APP_API_URL}/api/feedback/${fbToDelete._id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.msg || (lang === 'ar' ? 'فشل الحذف' : 'Delete failed'));
        return;
      }
      const updated = feedbacks.filter((fb, i) => i !== idx);
      setFeedbacks(updated);
      setDeleteMsg(document.documentElement.dir === 'rtl' || document.body.dir === 'rtl' ? 'تم الحذف بنجاح' : 'Deleted successfully');
      setTimeout(() => setDeleteMsg(""), 1500);
    } catch (err) {
      setDeleteError(lang === 'ar' ? 'تعذر الاتصال بالخادم' : 'Could not connect to server');
    }
  };

  // حذف الفعالية نفسها مع كل تقييماتها (حتى لو ما فيها تقييمات)
  const handleDeleteEvent = async (eventName) => {
    if (!window.confirm(lang === 'ar'
      ? 'سيتم حذف الفعالية وجميع تقييماتها نهائياً. هل أنت متأكد؟'
      : 'This will delete the event and all its feedback forever. Are you sure?')) return;
    try {
      // احذف جميع التقييمات لو فيه
      const promises = feedbacks
        .filter(fb => fb.event === eventName)
        .map(fb =>
          fetch(`${process.env.REACT_APP_API_URL}/api/feedback/${fb._id}`, { method: 'DELETE' })
        );
      await Promise.all(promises);

      // احذف الفعالية نفسها من قاعدة البيانات
      const eventObj = eventsList.find(ev =>
        (lang === 'ar' ? ev.ar : ev.en) === eventName
      );
      if (eventObj) {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/events/${eventObj._id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('حدث خطأ عند حذف الفعالية!');
      }

      setEventsList(eventsList.filter(ev =>
        (lang === 'ar' ? ev.ar : ev.en) !== eventName
      ));
      setFeedbacks(feedbacks.filter(fb => fb.event !== eventName));

      setDeleteMsg(document.documentElement.dir === 'rtl' || document.body.dir === 'rtl'
        ? 'تم حذف الفعالية وجميع تقييماتها'
        : 'Event and all its feedback deleted');
      setTimeout(() => setDeleteMsg(""), 1500);
    } catch (err) {
      setDeleteError(lang === 'ar' ? 'تعذر حذف الفعالية' : 'Could not delete the event');
    }
  };

  // بحث وتصفية
  const filteredFeedbacks = feedbacks.filter(fb => {
    const s = search.trim().toLowerCase();
    if (!s) return true;
    return fb.name.toLowerCase().includes(s) || fb.event.toLowerCase().includes(s);
  });

  const allEventNames = eventsList.map(ev => lang === 'ar' ? ev.ar : ev.en);
  const grouped = allEventNames.length > 0
    ? allEventNames.map(eventName => [
        eventName,
        filteredFeedbacks.filter(fb => fb.event === eventName)
      ])
    : Object.entries(
        filteredFeedbacks.reduce((acc, fb) => {
          acc[fb.event] = acc[fb.event] || [];
          acc[fb.event].push(fb);
          return acc;
        }, {})
      );

  function highlight(text) {
    const s = search.trim();
    if (!s) return text;
    const regex = new RegExp(`(${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = String(text).split(regex);
    return parts.map((part, i) =>
      regex.test(part)
        ? <span key={i} style={{ background: '#ffe066', color: '#232336', borderRadius: 4, padding: '0 2px' }}>{part}</span>
        : part
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f3e9dd 0%, #e9dbc7 35%, #f7f3e9 70%, #e2c9a7 100%)",
        fontFamily: "Tajawal, Cairo, Roboto, sans-serif",
        padding: "2rem 0",
        position: 'relative',
      }}>
      <button
        onClick={() => navigate('/')}
        style={{
          position: "absolute",
          top: "clamp(80px, 12vh, 100px)",
          left: lang === "ar" ? "clamp(20px, 4vw, 32px)" : "auto",
          right: lang === "ar" ? "auto" : "clamp(20px, 4vw, 32px)",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: "clamp(5px, 1vw, 7px)",
          padding: "clamp(0.5rem, 2vw, 0.6rem) clamp(1rem, 2.5vw, 1.3rem) clamp(0.5rem, 2vw, 0.6rem) clamp(0.8rem, 2vw, 1.1rem)",
          border: "none",
          borderRadius: 100,
          background: "rgba(255,255,255,0.85)",
          boxShadow: "0 2px 12px 0 rgba(44,62,80,0.11)",
          fontWeight: 800,
          fontSize: "clamp(0.9rem, 2.5vw, 1.04rem)",
          color: "#393E46",
          letterSpacing: "0.1px",
          cursor: "pointer",
          transition: "background 0.16s, box-shadow 0.16s, color 0.16s, transform 0.14s",
          backdropFilter: "blur(5px)", // لمسة زجاجية
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
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {deleteMsg && (
          <div style={{
            background: '#43a047',
            color: '#fff',
            borderRadius: 10,
            padding: '0.7rem 1.2rem',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '1.1rem',
            marginBottom: 18,
            boxShadow: '0 2px 8px rgba(67,160,71,0.10)',
            letterSpacing: '0.5px',
          }}>
            {deleteMsg}
          </div>
        )}
        {fetchError && (
          <div style={{ color: '#c00', fontWeight: 700, textAlign: 'center', marginBottom: 18 }}>
            {fetchError}
          </div>
        )}
        {deleteError && (
          <div style={{ color: '#c00', fontWeight: 700, textAlign: 'center', marginBottom: 18 }}>
            {deleteError}
          </div>
        )}
       <h2
          style={{
            textAlign: "center",
            color: "#a67c52",
            fontWeight: 800,
            marginBottom: "2.5rem",
            marginTop: "clamp(100px, 15vh, 120px)",  // <--- المسافة بين زر العودة (الهيدر) والعنوان
            fontSize: "clamp(1.5rem, 4vw, 2rem)"
          }}
        >
          {eventFilter ? `Feedback for: ${eventFilter}` : (lang === 'ar' ? 'كل التقييمات' : 'All Feedback')}
        </h2>
        {/* شريط البحث */}
        <div style={{ maxWidth: 850, margin: '0 auto 2.2rem auto', textAlign: 'center' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث باسم الفعالية أو المشارك...' : 'Search by event or name...'}
            style={{
              width: '100%',
              padding: '1.1rem 1.5rem',
              borderRadius: 14,
              border: '1.5px solid #e9dbc7',
              fontSize: '1.18rem',
              outline: 'none',
              background: '#f7f3e9',
              marginBottom: 0,
              transition: 'border-color 0.2s',
              boxShadow: '0 2px 12px #b39ddb22',
            }}
            onFocus={e => e.target.style.border = '1.5px solid #a67c52'}
            onBlur={e => e.target.style.border = '1.5px solid #e9dbc7'}
          />
        </div>
        {loading ? (
          <div style={{ textAlign: "center", color: "#888", fontSize: "1.2rem" }}>
            {lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </div>
        ) : grouped.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", fontSize: "1.2rem" }}>
            {lang === 'ar' ? 'لا توجد نتائج مطابقة' : 'No matching results'}
          </div>
        ) : (
          grouped.map(([eventName, group], groupIdx) => {
            const isOpen = openGroups[eventName] ?? true;
            return (
              <div key={eventName} style={{ maxWidth: 850, margin: '0 auto 2.5rem auto', border: '1.5px solid #d1c4e9', borderRadius: 14, background: '#f7f3e9', boxShadow: '0 2px 12px #b39ddb22' }}>
                <div
                  onClick={() => setOpenGroups(g => ({ ...g, [eventName]: !isOpen }))}
                  style={{
                    cursor: 'pointer',
                    padding: '1.1rem 1.5rem',
                    fontWeight: 900,
                    fontSize: '1.25rem',
                    color: '#4b2996',
                    background: isOpen ? '#e3f0ff' : '#f7f3e9',
                    borderRadius: '14px 14px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    letterSpacing: '1px',
                    userSelect: 'none',
                    minWidth: 0,
                  }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                      position: 'relative',
                    }}>
                    <span>{eventName}</span>
                    {/* زر حذف الفعالية نفسها يبقى دائمًا حتى بدون تقييمات */}
                    <button
                      onClick={e => { e.stopPropagation(); handleDeleteEvent(eventName); }}
                      style={{
                        background: '#e53935',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        boxShadow: '0 2px 8px rgba(229,57,53,0.10)',
                        cursor: 'pointer',
                        transition: 'background 0.2s, transform 0.13s',
                        zIndex: 2,
                      }}
                      title={lang === 'ar' ? 'حذف الفعالية' : 'Delete Event'}
                      aria-label={lang === 'ar' ? 'حذف الفعالية' : 'Delete Event'}
                      onMouseOver={e => e.currentTarget.style.background = '#b71c1c'}
                      onMouseOut={e => e.currentTarget.style.background = '#e53935'}
                    >
                      <span role="img" aria-label="delete">🗑️</span>
                    </button>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a4d8f', marginLeft: 8 }}>
                    ({group.length})
                  </span>
                  <span style={{ fontSize: '1.3rem', marginLeft: 8 }}>{isOpen ? '▼' : '▶'}</span>
                </div>
                {isOpen && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center", padding: '1.5rem 0' }}>
                    {group.length === 0 ? (
                      <div style={{ color: "#bbb", fontWeight: 500, padding: "1.5rem", textAlign: "center" }}>
                        {lang === 'ar'
                          ? 'لا يوجد تقييمات لهذه الفعالية حالياً'
                          : 'No feedback for this event yet.'}
                      </div>
                    ) : group.map((fb, idx) => (
                      <div
                        key={fb._id || idx}
                        style={{
                          background: "rgba(255,255,255,0.97)",
                          borderRadius: "22px",
                          boxShadow: "0 4px 24px rgba(30, 64, 175, 0.10)",
                          padding: "1.5rem 2rem",
                          minWidth: 270,
                          maxWidth: 340,
                          width: "100%",
                          border: "1.5px solid #e9dbc7",
                          position: "relative",
                        }}>
                        <div style={{ fontWeight: 700, color: "#a67c52", fontSize: "1.1rem", marginBottom: 8 }}>
                          Name: <span style={{ color: "#333" }}>{highlight(fb.name)}</span>
                        </div>
                        <div style={{ fontWeight: 600, color: "#a67c52", fontSize: "1.05rem", marginBottom: 8 }}>
                          Phone: <span style={{ color: "#333" }}>{highlight(fb.number)}</span>
                        </div>
                        <div style={{ fontWeight: 600, color: "#a67c52", fontSize: "1.05rem", marginBottom: 8 }}>
                          Event: <span style={{ color: "#333" }}>{highlight(fb.event)}</span>
                        </div>
                        <div style={{ fontWeight: 600, color: "#a67c52", fontSize: "1.05rem", marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                          Rating:
                          <span style={{ fontSize: '1.3rem', color: '#ffb400', marginLeft: 4 }}>
                            {Array.from({ length: fb.rating }, (_, i) => (
                              <span key={i}>★</span>
                            ))}
                          </span>
                        </div>
                        <div style={{ fontWeight: 600, color: "#a67c52", fontSize: "1.05rem", marginBottom: 8 }}>
                          Comments:
                          <div style={{ color: "#333", fontWeight: 400, marginTop: 2 }}>{highlight(fb.comments) || <span style={{color:'#bbb'}}>No comments</span>}</div>
                        </div>
                        {localStorage.getItem('isAdmin') === 'true' && (
                          <button
                            onClick={() => handleDelete(feedbacks.findIndex(f => f._id === fb._id))}
                            style={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                              background: 'linear-gradient(90deg, #c0392b 0%, #e67e22 100%)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '50%',
                              width: 32,
                              height: 32,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.2rem',
                              boxShadow: '0 1px 4px rgba(192,57,43,0.10)',
                              cursor: 'pointer',
                              transition: 'background 0.2s, transform 0.13s',
                            }}
                            title="Delete Feedback"
                            aria-label="Delete Feedback"
                          >
                            <span role="img" aria-label="delete">🗑️</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminViewFeedback;