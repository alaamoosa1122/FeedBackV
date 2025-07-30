import React from 'react';
import { useLanguage } from '../Store/LanguageContext';
import logo from '../Components/lo.png';
import { useNavigate, useLocation } from 'react-router-dom';

const titles = {
  "/":               { ar: "الرئيسية",            en: "Home" },
  "/admin/login":    { ar: "المصرحين",            en: "Admin" },
  "/admin/add-event":{ ar: "إضافة فعالية",        en: "Add Event" },
  "/admin/feedback": { ar: "تقييمات الفعاليات",   en: "Event Feedback" },
  "/event-feedback": { ar: "ملاحظات الفعالية",    en: "Event Feedback" },
};

const Header = () => {
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const isRTL = lang === "ar";

  // تحقق إن الأدمن مسجل دخول
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  // يستخدم لتحديد التبويب النشط
  const isActive = (pathname) => location.pathname === pathname;

  // تغيير اللغة
  const toggleLang = () => setLang(lang === 'en' ? 'ar' : 'en');

  // عنوان الصفحة الحالي (للاستخدام مستقبلاً)
  const pageTitle =
    titles[location.pathname]
      ? titles[location.pathname][lang]
      : (lang === "ar" ? "..." : "...");

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 10000,
        backdropFilter: 'blur(8px) saturate(150%)',
        WebkitBackdropFilter: 'blur(8px) saturate(150%)',
        background: 'rgba(40,40,46,0.36)',
        borderBottom: '1.7px solid #ece2c6',
        boxShadow: '0 2px 18px 0 rgba(199, 182, 148, 0.07)',
        minHeight: 'clamp(50px, 8vh, 60px)',
        display: 'block',
        fontFamily: 'Tajawal, Cairo, Roboto, Arial, sans-serif',
        transition: "background 0.25s"
      }}
    >
      <div
        style={{
          maxWidth: 1220,
          margin: "0 auto",
          padding: "clamp(0.5rem, 3vw, 2rem)",
          height: 'clamp(50px, 8vh, 60px)',
          display: 'flex',
          flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        {/* الشعار */}
        <div
          style={{
            display: 'flex', alignItems: 'center',
            cursor: "pointer",
            minWidth: 'clamp(80px, 15vw, 110px)',
          }}
          onClick={() => navigate("/")}
          tabIndex={0}
          aria-label="Home Page"
        >
          <img
            src={logo}
            alt="Engineering Village Logo"
            style={{
              height: 'clamp(30px, 6vw, 41px)',
              width: "auto",
              filter: "drop-shadow(0 1px 2px #d4af6e34)",
              transition: "transform 0.18s",
            }}
            onMouseOver={e=>e.currentTarget.style.transform="scale(1.07)"}
            onMouseOut ={e=>e.currentTarget.style.transform="scale(1)"}
          />
        </div>

        {/* التبويبات */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(0.3rem, 1vw, 0.7rem)',
          minWidth: 'clamp(120px, 20vw, 180px)',
          justifyContent: isRTL ? "flex-start" : "flex-end",
          flexWrap: 'wrap',
        }}>
          <NavTab
            active={isActive("/admin/login")}
            label={lang === "ar" ? "المصرح لهم" : "Admin"}
            onClick={() => navigate('/admin/login')}
          />
          <NavTab
            active={false}
            label={lang === "ar" ? "English" : "عربي"}
            onClick={toggleLang}
          />

          {/* زر تسجيل الخروج للأدمن فقط */}
          {isAdmin && (
            <NavTab
              active={false}
              label={lang === "ar" ? "تسجيل الخروج" : "Logout"}
              onClick={handleLogout}
            />
          )}
        </nav>
      </div>
    </header>
  );
};

// مكون زر/تاب
function NavTab({ label, active, onClick }) {
  const baseColor = "#fff";
  const baseBg = active ? "rgba(245,245,245,0.18)" : "transparent";
  const hoverBg = "rgba(218,200,164,0.13)";

  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={0}
      style={{
        background: baseBg,
        border: "none",
        outline: "none",
        color: baseColor,
        fontWeight: active ? 900 : 700,
        fontSize: "clamp(0.9rem, 2.5vw, 1.08rem)",
        padding: "clamp(0.25rem, 1vw, 0.36rem) clamp(0.8rem, 2vw, 1.11rem)",
        borderRadius: 24,
        transition: "background 0.14s, color 0.16s",
        cursor: "pointer",
        boxShadow: active ? "0 1px 7px #f4e9c12a" : "none",
        textShadow: "0 1px 8px #1114",
        position: "relative",
        whiteSpace: 'nowrap',
      }}
      onMouseOver={e => {
        e.currentTarget.style.backgroundColor = hoverBg;
        e.currentTarget.style.color = baseColor;
      }}
      onMouseOut={e => {
        e.currentTarget.style.backgroundColor = baseBg;
        e.currentTarget.style.color = baseColor;
      }}
    >
      {label}
    </button>
  );
}

export default Header;