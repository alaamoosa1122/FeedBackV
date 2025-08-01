import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from '../Store/LanguageContext';
import { useLocation } from "react-router-dom";

const ADMIN_PASSWORD = "admin123";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("isAdmin") === "true");
  const navigate = useNavigate();
  const { lang } = useLanguage();


const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdmin", "true");
      setLoggedIn(true);
      setError("");
      // لا ننتقل تلقائياً، نبقى في نفس الصفحة ليظهر الخيارين
    } else {
      setError("Incorrect password");
    }
  };

  return (
        <div
      style={{
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
          paddingTop: 'clamp(5px, 3vh, 8px)',
          overflowX: "hidden"
      }}
    >
  {/* ... */}

      {/* زر العودة أعلى الصفحة خارج الصندوق الأبيض */}
            <button
        onClick={() => navigate('/')}
        style={{
          position: "absolute",
          top: "clamp(50px, 5vh, 70px)",
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

      <div
        style={{
          background: "rgba(255,255,255,0.97)",
          borderRadius: "20px",
          boxShadow: "0 8px 40px rgba(30, 64, 175, 0.10)",
          padding: "clamp(1.5rem, 4vw, 2.5rem)",
          border: "2px solid #e9dbc7",
          minWidth: "clamp(280px, 90vw, 320px)",
          maxWidth: "clamp(320px, 95vw, 400px)",
          width: "100%",
          textAlign: "center",
          marginTop: "clamp(1px, 0.1vh, 20px)",
        }}
      >
        {loggedIn ? (
          <>
            <h2 style={{ 
              color: "#a67c52", 
              fontWeight: 800, 
              marginBottom: "1.5rem",
              fontSize: "clamp(1.5rem, 4vw, 2rem)"
            }}>
                  مرحباً  
            </h2>
            {location.state && location.state.from && (
              <div style={{ color: "#b11", marginBottom: 12 }}>
                الرجاء تسجيل الدخول لمتابعة الوصول للصفحة المطلوبة
              </div>
            )}
            <button
              style={{
                width: "100%",
                padding: "clamp(0.8rem, 2vw, 1rem) 0",
                borderRadius: "999px",
                background: "linear-gradient(90deg, #43a047 0%, #a6d1ff 100%)",
                color: "#fff",
                fontWeight: 800,
                fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
                border: "none",
                boxShadow: "0 2px 8px rgba(67, 160, 71, 0.10)",
                cursor: "pointer",
                marginBottom: 12,
                marginTop: 6,
                transition: "background 0.2s, transform 0.13s",
              }}
              onClick={() => navigate('/admin/add-event')}
            >
              إضافة فعالية
            </button>
            <button
              style={{
                width: "100%",
                padding: "clamp(0.8rem, 2vw, 1rem) 0",
                borderRadius: "999px",
                background: "linear-gradient(90deg, #e53935 0%, #e67e22 100%)",
                color: "#fff",
                fontWeight: 800,
                fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
                border: "none",
                boxShadow: "0 2px 8px rgba(229,57,53,0.10)",
                cursor: "pointer",
                marginBottom: 6,
                marginTop: 6,
                transition: "background 0.2s, transform 0.13s",
              }}
              onClick={() => navigate('/admin/feedback')}
            >
              تعديل أو حذف فعالية
            </button>
          </>
        ) : (
          <>
            <h2 style={{ 
              textAlign: "center", 
              color: "#a67c52", 
              fontWeight: 800, 
              marginBottom: "1.5rem",
              fontSize: "clamp(1.5rem, 4vw, 2rem)"
            }}>
              Admin Login
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                style={{
                  width: "80%",
                  padding: "clamp(0.8rem, 2vw, 1rem)",
                  borderRadius: "14px",
                  border: "1.5px solid #e9dbc7",
                  margin: "0.8rem 0 1rem 0",
                  fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                  outline: "none",
                  background: "#f7f3e9",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.border = '1.5px solid #a67c52'}
                onBlur={e => e.target.style.border = '1.5px solid #e9dbc7'}
                required
              />
              {error && <div style={{ color: "#c00", marginBottom: 8, textAlign: 'center' }}>{error}</div>}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "clamp(0.8rem, 2vw, 1rem) 0",
                  borderRadius: "999px",
                  background: "linear-gradient(90deg, #a67c52 0%, #e9dbc7 100%)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(166, 124, 82, 0.10)",
                  cursor: "pointer",
                  transition: "background 0.2s, transform 0.13s",
                }}
                onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #e9dbc7 0%, #a67c52 100%)'}
                onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #a67c52 0%, #e9dbc7 100%)'}
              >
                Login
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;