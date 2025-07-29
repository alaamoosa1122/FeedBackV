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

  // يرجع true إذا المسار الحالي هو نفس رابط التبويب
  const isActive = (pathname) => location.pathname === pathname;

  // تغيير اللغة
  const toggleLang = () => setLang(lang === 'en' ? 'ar' : 'en');

  // عنوان الصفحة الحالي
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
        minHeight: 76,
        display: 'block',
        fontFamily: 'Tajawal, Cairo, Roboto, Arial, sans-serif',
        transition: "background 0.25s"
      }}
    >
      {/* حاوية الداخلية: تعطي حدود للمحتوى ومسافة جانبية */}
      <div
        style={{
          maxWidth: 1220,
          margin: "0 auto",
          padding: "0 32px",
          height: 76,
          display: 'flex',
          flexDirection: isRTL ? "row-reverse" : "row",
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* الشعار */}
        <div
          style={{
            display: 'flex', alignItems: 'center',
            cursor: "pointer",
            minWidth: 110,
          }}
          onClick={() => navigate("/")}
          tabIndex={0}
          aria-label="Home Page"
        >
          <img
            src={logo}
            alt="Engineering Village Logo"
            style={{
              height: 41,
              width: "auto",
              filter: "drop-shadow(0 1px 2px #d4af6e34)",
              transition: "transform 0.18s",
            }}
            onMouseOver={e=>e.currentTarget.style.transform="scale(1.07)"}
            onMouseOut ={e=>e.currentTarget.style.transform="scale(1)"}
          />
        </div>

        {/* (اختياري) العنوان في المنتصف أو بجانب الشعار
        <span style={{
          color: "#fff", fontWeight: 900, fontSize: "1.22rem", letterSpacing: "1px"
        }}>
          {pageTitle}
        </span>
        */}

        {/* التبويبات */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.7rem',
          minWidth: 180,
          justifyContent: isRTL ? "flex-start" : "flex-end"
        }}>
          <NavTab
            active={isActive("/admin/login")}
            label={lang === "ar" ? "المصرح لهم" : "Admin"}
            onClick={() => navigate('/admin/login')}
          />
          <NavTab
            active={false}
            label={lang === "ar" ? 'عربي' : 'English'}
            onClick={toggleLang}
          />
        </nav>
      </div>
    </header>
  );
};

// مكون الزر بشكل تابع/رابط، بنص أبيض في كل الحالات
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
        fontSize: "1.08rem",
        padding: "0.36rem 1.11rem",
        borderRadius: 24,
        transition: "background 0.14s, color 0.16s",
        cursor: "pointer",
        boxShadow: active ? "0 1px 7px #f4e9c12a" : "none",
        textShadow: "0 1px 8px #1114",
        position: "relative",
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