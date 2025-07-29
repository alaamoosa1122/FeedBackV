import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from '../Store/LanguageContext';
import { useLocation } from "react-router-dom";

const ADMIN_PASSWORD = "admin123";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { lang } = useLanguage();


const location = useLocation();

{location.state && location.state.from && (
  <div style={{ color: "#b11", marginBottom: 18 }}>
    الرجاء تسجيل الدخول لمتابعة الوصول للصفحة المطلوبة
  </div>
)}
const handleSubmit = (e) => {
  e.preventDefault();
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem("isAdmin", "true");
    setLoggedIn(true);
    setError("");
    // انتقل تلقائياً لصفحة التعديل مثلاً، أو أي صفحة إدارية
    navigate('/admin/feedback');
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
    overflowX: "hidden"
  }}
>
  {/* ... */}

      {/* زر العودة أعلى الصفحة خارج الصندوق الأبيض */}
      <button
  onClick={() => navigate('/')}
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
          padding: "3.5rem 3.5rem",
          border: "2px solid #e9dbc7",
          minWidth: "320px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {loggedIn ? (
          <>
            <h2 style={{ color: "#a67c52", fontWeight: 800, marginBottom: "2rem" }}>
                  مرحباً  
            </h2>
            <button
              style={{
                width: "100%",
                padding: "1rem 0",
                borderRadius: "999px",
                background: "linear-gradient(90deg, #43a047 0%, #a6d1ff 100%)",
                color: "#fff",
                fontWeight: 800,
                fontSize: "1.15rem",
                border: "none",
                boxShadow: "0 2px 8px rgba(67, 160, 71, 0.10)",
                cursor: "pointer",
                marginBottom: 18,
                marginTop: 8,
                transition: "background 0.2s, transform 0.13s",
              }}
              onClick={() => navigate('/admin/add-event')}
            >
              إضافة فعالية
            </button>
            <button
              style={{
                width: "100%",
                padding: "1rem 0",
                borderRadius: "999px",
                background: "linear-gradient(90deg, #e53935 0%, #e67e22 100%)",
                color: "#fff",
                fontWeight: 800,
                fontSize: "1.15rem",
                border: "none",
                boxShadow: "0 2px 8px rgba(229,57,53,0.10)",
                cursor: "pointer",
                marginBottom: 8,
                marginTop: 8,
                transition: "background 0.2s, transform 0.13s",
              }}
              onClick={() => navigate('/admin/feedback')}
            >
              تعديل أو حذف فعالية
            </button>
          </>
        ) : (
          <>
            <h2 style={{ textAlign: "center", color: "#a67c52", fontWeight: 800, marginBottom: "2rem" }}>
              Admin Login
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                style={{
                  width: "100%",
                  padding: "1rem",
                  borderRadius: "14px",
                  border: "1.5px solid #e9dbc7",
                  margin: "1rem 0 1.5rem 0",
                  fontSize: "1.1rem",
                  outline: "none",
                  background: "#f7f3e9",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.border = '1.5px solid #a67c52'}
                onBlur={e => e.target.style.border = '1.5px solid #e9dbc7'}
                required
              />
              {error && <div style={{ color: "#c00", marginBottom: 10, textAlign: 'center' }}>{error}</div>}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "1rem 0",
                  borderRadius: "999px",
                  background: "linear-gradient(90deg, #a67c52 0%, #e9dbc7 100%)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "1.15rem",
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