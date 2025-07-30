import React, { useState, useEffect } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import img from '../Components/img3.JPG';
import { useLanguage } from '../Store/LanguageContext';
import logo from '../Components/lo.png';

// دالة تحويل الأرقام العربية إلى إنجليزية
function normalizeDigits(str) {
  if (!str) return '';
  // ٠١٢٣٤٥٦٧٨٩ (Unicode Arabic)    ۰۱۲۳۴۵۶۷۸۹ (Persian)
  return str
    .replace(/[\u0660-\u0669]/g, c => String(c.charCodeAt(0) - 0x0660))
    .replace(/[\u06f0-\u06f9]/g, c => String(c.charCodeAt(0) - 0x06f0));
}

const Feed = () => {
  const navigate = useNavigate();
  const [adminMenuOpen, setAdminMenuOpen] = React.useState(false);
  const [adminUnlocked, setAdminUnlocked] = React.useState(false);
  const [showAdminLogin, setShowAdminLogin] = React.useState(false);
  const [adminPassword, setAdminPassword] = React.useState("");
  const [adminError, setAdminError] = React.useState("");
  const ADMIN_PASSWORD = "admin123";
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    event: "",
    rating: 0,
    comments: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const { lang, setLang } = useLanguage();
  const [events, setEvents] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({
    name: false,
    event: false,
    rating: false,
    comments: false,
    number: false
  });
  const [submitError, setSubmitError] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  // جلب الفعاليات من الخادم
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:3001/events');
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setEvents([
          { en: "Share your opinion, because your opinion matters! ⭐", ar: "⭐ شاركنا رأيك، لأن رأيك يفرق " },
        ]);
      }
    };
    fetchEvents();
  }, []);

  const t = {
    en: {
      formTitle: 'Share your opinion, because your opinion matters! ⭐',
      yourName: 'Your Name',
      namePlaceholder: 'Enter your full name',
      eventName: 'Event Name',
      selectEvent: '-- Select an Event --',
      engineeringDay: 'Engineering Day',
      orientationSession: 'Orientation Session',
      workshop: 'Workshop',
      rating: 'Rating (1 to 5)',
      comments: 'Additional Comments',
      commentsPlaceholder: 'Share your thoughts...',
      submit: 'Submit',
      thankYou: 'Thank you for your feedback!',
      help: 'Your opinion helps us improve our events.',
      yourPhone: "Your Phone Number",
      phonePlaceholder: "Enter your phone number",
      chooseLang: 'عربي',
    },
    ar: {
      formTitle: '⭐شاركنا رأيك، لأن رأيك يفرق ',
      yourName: 'اسمك',
      namePlaceholder: 'أدخل اسمك الكامل',
      eventName: 'اسم الفعالية',
      selectEvent: '-- اختر فعالية --',
      engineeringDay: 'يوم الهندسة',
      orientationSession: 'جلسة تعريفية',
      workshop: 'ورشة عمل',
      rating: 'التقييم (1 إلى 5)',
      comments: 'تعليقات إضافية',
      commentsPlaceholder: 'شاركنا رأيك...',
      submit: 'تسليم ',
      thankYou: 'شكراً لملاحظاتك!',
      help: 'رأيك يساعدنا في تحسين فعالياتنا.',
      yourPhone: "رقم الهاتف",
      phonePlaceholder: "أدخل رقم هاتفك",
      chooseLang: 'English',
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Star rating handler
  const handleStarClick = (star) => {
    setFormData((prev) => ({ ...prev, rating: star }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setFieldErrors({ name: false, number: false , event: false, rating: false, comments: false });

    // تحويل رقم الإدخال لأرقام إنجليزية للفاليديشن
    const normalizedNumber = normalizeDigits(formData.number);

    // Validate form
    let isValid = true;
    const errors = { name: false, number: false , event: false, rating: false, comments: false };

    if (!formData.name.trim()) {
      errors.name = true;
      isValid = false;
    }
    if (!normalizedNumber || !/^[0-9]{8}$/.test(normalizedNumber)) {
      errors.number = true;
      isValid = false;
    }
    if (!formData.event) {
      errors.event = true;
      isValid = false;
    }
    if (formData.rating < 1 || formData.rating > 5) {
      errors.rating = true;
      isValid = false;
    }
    if (!formData.comments || formData.comments.length < 3) {
      errors.comments = true;
      isValid = false;
    }

    setFieldErrors(errors);

    if (!isValid) return;

    try {
      const res = await fetch('http://localhost:3001/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          number: normalizedNumber    // الرقم الموحّد يتم إرساله للسيرفر
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || 'Failed to submit feedback');
      }
      setShowThankYou(true);
      setTimeout(() => {
        setShowThankYou(false);
        navigate(`/event-feedback?event=${encodeURIComponent(formData.event)}`);
      }, 2500);
      setFormData({ name: "", number: "", event: "", rating: 0, comments: "" });
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  // Redirect to feedback page after submit
  React.useEffect(() => {
    if (submitted) {
      const eventParam = encodeURIComponent(formData.event);
      navigate(`/admin/feedback?event=${eventParam}`);
    }
  }, [submitted, navigate]);

  if (submitted) {
    return (
      <Container style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #eee', padding: '2.5rem 2rem', textAlign: 'center' }}>
          <h2 style={{ color: '#43a047', marginBottom: 12 }}>
            {t[lang].thankYou}
          </h2>
          <div style={{ color: '#888', fontSize: '1.1rem' }}>{t[lang].help}</div>
        </div>
      </Container>
    );
  }

  return (
    <>
     {showThankYou && (
          <div style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#43a047',
            color: '#fff',
            padding: '1rem 2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 12px #aaa',
            zIndex: 9999,
            fontSize: 'clamp(1rem, 4vw, 1.2rem)',
            fontWeight: 700,
            letterSpacing: '0.5px',
            maxWidth: '90vw',
            textAlign: 'center',
          }}>
            {t[lang].thankYou}
          </div>
        )}
      <Container fluid
        className="justify-content-center"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Tajawal, Cairo, Roboto, Arial, sans-serif',
          color: '#232336',
          padding: '1rem',
        }}
      >
        <Row className="justify-content-center w-100 mx-auto" style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '80%',
            width: '80%',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft:'1rem',
            paddingRight:'5rem',
  
}}>
          <Col xs={12} sm={11} md={9} lg={7} xl={6} xxl={5} style={{
              maxWidth: '80%',
              width: '80%',
              margin:'0 auto',
              padding:'0 auto',
              paddingTop: 'clamp(2rem, 8vh, 5.5rem)',
              
            }}>
            {/* Box for title and subtitle */}
            <div
              className="title-box"
              style={{
                background: 'linear-gradient(120deg, #f7f3ff 0%, #e3f0ff 100%)',
                borderRadius: '18px',
                boxShadow: '0 6px 32px rgba(45,25,118,0.13)',
                padding: '1.7rem 1.7rem 1.2rem 1.7rem',
                marginBottom: '0.7rem',
                textAlign: 'center',
                fontFamily: 'Tajawal, Cairo, Roboto, Arial, sans-serif',
                border: '1.5px solid #d1c4e9',
                marginTop: 'clamp(2rem, 8vh, 5.5rem)',
                width: '100%',
              }}
            >
              <div className="title-text" style={{
                fontSize:'clamp(1.5rem, 6vw, 2.3rem)',
                fontWeight:900,
                color:'#4b2996',
                letterSpacing:'1.2px',
                textShadow:'0 2px 8px #b39ddb44',
                fontFamily:'Tajawal, Cairo, Roboto, Arial, sans-serif',
                marginBottom:'0.2rem',
                position:'relative',
                display:'inline-block',
                lineHeight: '1.2',
              }}>
                <span role="img" aria-label="party"></span> {t[lang].formTitle} <span role="img" aria-label="sparkle"></span>
                <div style={{
                  height:'3px',
                  width:'80%',
                  background:'linear-gradient(90deg, #4b2996 0%, #1a4d8f 100%)',
                  borderRadius:'2px',
                  margin:'0.5rem auto 0 auto',
                  opacity:0.7,
                }}></div>
              </div>
              <div className="subtitle-text" style={{
                color:'#1a4d8f',
                fontWeight:700,
                fontSize:'clamp(1rem, 3vw, 1.18rem)',
                marginTop:'0.7rem',
                letterSpacing:'0.3px',
                fontFamily:'inherit',
                textShadow:'0 1px 4px #b3c6e744',
                lineHeight: '1.4',
              }}>
                {lang === 'ar'
                  ? 'كل كلمة منك تصنع فرق كبير في فعالياتنا القادمة 🎯'
                  : 'Every word from you makes a big difference in our upcoming events 🎯'}
              </div>
            </div>
            {/* End box */}
            <div
              className="form-container"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '18px',
                boxShadow: '0 4px 24px rgba(30, 64, 175, 0.08)',
                padding: '2rem',
                border: '1px solid rgba(227, 212, 163, 0.8)',
                marginBottom: '2rem',
                marginTop: 0,
                backdropFilter: 'blur(8px)',
                fontFamily: 'Tajawal, Cairo, Roboto, Arial, sans-serif',
                position: 'relative',
                overflow: 'hidden',
                color: '#232336',
                width: '100%',
              }}
            >
              <Form onSubmit={handleSubmit}>
                {submitError && (
                  <div style={{ color: '#c00', fontWeight: 700, textAlign: 'center', marginTop: 12 }}>{submitError}</div>
                )}
                <FormGroup>
                  <Label for="name" className="form-label" style={{
                    fontWeight:700,
                    color:'#2d1976',
                    marginBottom:'0.2rem',
                    fontSize:'clamp(1rem, 3vw, 1.15rem)',
                    letterSpacing:'0.2px',
                    display:'flex',
                    alignItems:'center',
                    gap:'0.3rem',
                    fontFamily:'inherit',
                  }}>
                    <span role="img" aria-label="user">🧑</span> {t[lang].yourName}
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder={t[lang].namePlaceholder}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                    style={{
                      background: 'rgba(255,255,255,0.99)',
                      border: '2px solid #ffb86c',
                      borderRadius: '18px',
                      padding: 'clamp(0.8rem, 2vw, 1.15rem) clamp(1rem, 2.5vw, 1.2rem)',
                      fontSize: 'clamp(1rem, 2.5vw, 1.13rem)',
                      marginBottom: '1.2rem',
                      boxShadow: '0 2px 12px rgba(255, 107, 203, 0.10)',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.15s',
                      fontFamily: 'inherit',
                      width: '85%',
                      minWidth: '220px',
                    }}
                    onFocus={e => {e.currentTarget.style.border = '2px solid #5f6cff'; e.currentTarget.style.transform = 'scale(1.03)';}}
                    onBlur={e => {e.currentTarget.style.border = '2px solid #ffb86c'; e.currentTarget.style.transform = 'scale(1)';}}
                  />
                  {fieldErrors.name && (
                    <div style={{ color: '#c00', fontWeight: 600, fontSize: '1rem', marginTop: '-0.8rem', marginBottom: '0.7rem', textAlign: 'left' }}>
                      {lang === 'ar' ? 'الاسم مطلوب و يجب أن يكون على الأقل حرفين' : 'Name is required and must be at least 2 characters'}
                    </div>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="number" className="form-label" style={{
                    fontWeight: 700,
                    color: '#2d1976',
                    marginBottom: '0.2rem',
                    fontSize: 'clamp(1rem, 3vw, 1.15rem)',
                    letterSpacing: '0.2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontFamily: 'inherit',
                  }}>
                    <span role="img" aria-label="phone">📱</span> {t[lang].yourPhone}
                  </Label>
                  <Input
                    type="text"
                    name="number"
                    id="number"
                    placeholder={t[lang].phonePlaceholder}
                    value={formData.number}
                    onChange={handleChange}
                    required
                    className="form-input"
                    style={{
                      background: 'rgba(255,255,255,0.99)',
                      border: '2px solid #ffb86c',
                      borderRadius: '18px',
                      padding: 'clamp(0.8rem, 2vw, 1.15rem) clamp(1rem, 2.5vw, 1.2rem)',
                      fontSize: 'clamp(1rem, 2.5vw, 1.13rem)',
                      marginBottom: '1.2rem',
                      boxShadow: '0 2px 12px rgba(255, 107, 203, 0.10)',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.15s',
                      fontFamily: 'inherit',
                      width: '90%',
                      maxWidth: '400px',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.border = '2px solid #5f6cff';
                      e.currentTarget.style.transform = 'scale(1.03)';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.border = '2px solid #ffb86c';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                  {fieldErrors.number && (
                    <div style={{
                      color: '#c00',
                      fontWeight: 600,
                      fontSize: '1rem',
                      marginTop: '-0.8rem',
                      marginBottom: '0.7rem',
                      textAlign: 'left'
                    }}>
                      {lang === 'ar' ? 'رقم الهاتف غير صحيح (يجب أن يكون 8 أرقام)' : 'Invalid phone number (must be 8 digits)'}
                    </div>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="event" className="form-label" style={{
                    fontWeight:700,
                    color:'#1a4d8f',
                    marginBottom:'0.3rem',
                    fontSize:'clamp(1rem, 3vw, 1.15rem)',
                    letterSpacing:'0.2px',
                    display:'flex',
                    alignItems:'center',
                    gap:'0.3rem',
                    fontFamily:'inherit',
                  }}>
                    <span role="img" aria-label="event">📅</span> {t[lang].eventName}
                  </Label>
                  <Input
                    type="select"
                    name="event"
                    id="event"
                    value={formData.event}
                    onChange={handleChange}
                    required
                    className="form-input"
                    style={{
                      background: 'rgba(255,255,255,0.99)',
                      border: '2px solid #ffb86c',
                      borderRadius: '18px',
                      padding: 'clamp(0.8rem, 2vw, 1.15rem) clamp(1rem, 2.5vw, 1.2rem)',
                      fontSize: 'clamp(1rem, 2.5vw, 1.13rem)',
                      marginBottom: '1.2rem',
                      boxShadow: '0 2px 12px rgba(255, 107, 203, 0.10)',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.15s',
                      fontFamily: 'inherit',
                      width: '100%',
                      maxWidth: '400px',
                    }}
                    onFocus={e => {e.currentTarget.style.border = '2px solid #5f6cff'; e.currentTarget.style.transform = 'scale(1.03)';}}
                    onBlur={e => {e.currentTarget.style.border = '2px solid #ffb86c'; e.currentTarget.style.transform = 'scale(1)';}}
                  >
                    <option value="">{t[lang].selectEvent}</option>
                    {events.map((ev, idx) => (
                      <option key={ev.en + ev.ar + idx} value={lang === 'ar' ? ev.ar : ev.en}>
                        {lang === 'ar' ? ev.ar : ev.en}
                      </option>
                    ))}
                  </Input>
                  {fieldErrors.event && (
                    <div style={{ color: '#c00', fontWeight: 600, fontSize: '1rem', marginTop: '-0.8rem', marginBottom: '0.7rem', textAlign: 'left' }}>
                      {lang === 'ar' ? 'الفعالية مطلوبة' : 'Event is required'}
                    </div>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="rating" className="form-label" style={{
                    fontWeight:700,
                    color:'#e67e22',
                    marginBottom:'0.3rem',
                    fontSize:'clamp(1rem, 3vw, 1.15rem)',
                    letterSpacing:'0.2px',
                    display:'flex',
                    alignItems:'center',
                    gap:'0.3rem',
                    fontFamily:'inherit',
                  }}>
                    <span role="img" aria-label="star">⭐</span> {t[lang].rating}
                  </Label>
                  <div className="star-rating" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'clamp(0.3rem, 1vw, 0.5rem)', 
                    marginBottom: '1.2rem', 
                    userSelect: 'none',
                    flexWrap: 'wrap',
                    justifyContent: 'left'
                  }}>
                    {[1,2,3,4,5].map((star) => (
                      <span
                        key={star}
                        onClick={() => handleStarClick(star)}
                        className="star-button"
                        style={{
                          fontSize: 'clamp(1.5rem, 5vw, 2.1rem)',
                          cursor: 'pointer',
                          color: star <= formData.rating ? '#ffb400' : '#e0e0e0',
                          transition: 'color 0.2s',
                          filter: star <= formData.rating ? 'drop-shadow(0 2px 6px #ffb40044)' : 'none',
                        }}
                        role="img"
                        aria-label={star + ' star'}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  {fieldErrors.rating && (
                    <div style={{ color: '#c00', fontWeight: 600, fontSize: '1rem', marginTop: '-0.8rem', marginBottom: '0.7rem', textAlign: 'left' }}>
                      {lang === 'ar' ? 'التقييم مطلوب (من 1 إلى 5)' : 'Rating is required (1 to 5)'}
                    </div>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="comments" className="form-label" style={{
                    fontWeight:700,
                    color:'#2d1976',
                    marginBottom:'0.3rem',
                    fontSize:'clamp(1rem, 3vw, 1.15rem)',
                    letterSpacing:'0.2px',
                    display:'flex',
                    alignItems:'center',
                    gap:'0.3rem',
                    fontFamily:'inherit',
                  }}>
                    <span role="img" aria-label="comment">💬</span> {t[lang].comments}
                  </Label>
                  <Input
                    type="textarea"
                    name="comments"
                    id="comments"
                    placeholder={t[lang].commentsPlaceholder}
                    rows="4"
                    value={formData.comments}
                    onChange={handleChange}
                    className="form-input"
                    style={{
                      background: 'rgba(255,255,255,0.99)',
                      border: '2px solid #ff6bcb',
                      borderRadius: '18px',
                      padding: 'clamp(0.8rem, 2vw, 1.15rem) clamp(1rem, 2.5vw, 1.2rem)',
                      fontSize: 'clamp(1rem, 2.5vw, 1.13rem)',
                      marginBottom: '1.2rem',
                      boxShadow: '0 2px 12px rgba(255, 107, 203, 0.10)',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.15s',
                      fontFamily: 'inherit',
                      width: '90%',
                      maxWidth: '400px',
                      resize: 'vertical',
                    }}
                    onFocus={e => {e.currentTarget.style.border = '2px solid #ffb86c'; e.currentTarget.style.transform = 'scale(1.03)';}}
                    onBlur={e => {e.currentTarget.style.border = '2px solid #ff6bcb'; e.currentTarget.style.transform = 'scale(1)';}}
                  />
                  {fieldErrors.comments && (
                    <div style={{ color: '#c00', fontWeight: 600, fontSize: '1rem', marginTop: '-0.8rem', marginBottom: '0.7rem', textAlign: 'left' }}>
                      {lang === 'ar' ? 'التعليقات مطلوبة و يجب أن تكون على الأقل 3 أحرف' : 'Comments are required and must be at least 3 characters'}
                    </div>
                  )}
                </FormGroup>
                <Button
                  color="primary"
                  block
                  className="mt-3 submit-button"
                  style={{
                    background: 'linear-gradient(90deg, #2d1976 0%, #1a4d8f 100%)',
                    border: 'none',
                    borderRadius: '999px',
                    fontWeight: 900,
                    fontSize: 'clamp(1.1rem, 3vw, 1.35rem)',
                    padding: 'clamp(0.8rem, 2vw, 1.15rem) 0',
                    boxShadow: '0 6px 24px rgba(45,25,118,0.10)',
                    letterSpacing: '1px',
                    transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
                    outline: 'none',
                    marginTop: '1.7rem',
                    fontFamily: 'inherit',
                    textShadow: '0 1px 2px rgba(45,25,118,0.10)',
                    width: '100%',
                    maxWidth: '400px',
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    color: '#fff',
                  }}
                  onMouseOver={e => {e.currentTarget.style.background = 'linear-gradient(90deg, #1a4d8f 0%, #2d1976 100%)'; e.currentTarget.style.transform = 'scale(1.07)';}}
                  onMouseOut={e => {e.currentTarget.style.background = 'linear-gradient(90deg, #2d1976 0%, #1a4d8f 100%)'; e.currentTarget.style.transform = 'scale(1)';}}
                >
                  <span role="img" aria-label="rocket">🚀</span> {t[lang].submit}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Feed;