import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';  
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'; 
import { faEnvelope, faArrowUp } from '@fortawesome/free-solid-svg-icons'; 
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [showScroll, setShowScroll] = useState(false);

    const checkScrollTop = () => {
        if (!showScroll && window.pageYOffset > 400) {
            setShowScroll(true);
        } else if (showScroll && window.pageYOffset <= 400) {
            setShowScroll(false);
        }
    };

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', checkScrollTop);
        return () => window.removeEventListener('scroll', checkScrollTop);
    }, [showScroll]);

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3 className="footer-title">القرية الهندسية</h3>
                    <ul className="footer-links">
                        <li>
                            <a href="https://www.ev-center.com/ar.html" target="_blank" rel="noopener noreferrer">
                                الموقع الرسمي للقرية
                            </a>
                        </li>
                        <li>
                            <a href="https://www.ev-center.com/career.html?lang=ar" target="_blank" rel="noopener noreferrer">
                                فرص التدريب و العمل
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3 className="footer-title">تواصل معنا</h3>
                    <div className="social-links">
                        <a href="https://x.com/ev_centers" target="_blank" rel="noopener noreferrer" aria-label="X">
                            <FontAwesomeIcon icon={faTwitter} className="social-icon" />
                        </a>
                        <a href="https://www.instagram.com/ev_centers/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FontAwesomeIcon icon={faInstagram} className="social-icon" />
                        </a>
                        <a href="mailto:info@ev-center.com" aria-label="Email">
                            <FontAwesomeIcon icon={faEnvelope} className="social-icon" />
                        </a>
                        <a href="https://www.linkedin.com/company/engineering-village/?trk=tyah&trkInfo=tarId%3A1396603528454%2Ctas%3AEngineering+vil%2Cidx%3A1-1-1" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <FontAwesomeIcon icon={faLinkedin} className="social-icon" />
                        </a>
                    </div>
                </div>

                <div className="footer-section">
                    <h3 className="footer-title">موقعنا</h3>
                    <ul className="footer-links">
                        <li>
                            <a href="https://www.google.com/maps/place/Engineering+Village/@23.6229727,58.2494584,17z/data=!3m1!4b1!4m6!3m5!1s0x3e8dfd9e88fb6fab:0x4ebf682885e95e74!8m2!3d23.6229727!4d58.2494584!16s%2Fg%2F1ptyqhx20?entry=ttu" target="_blank" rel="noopener noreferrer">
                                فرع مسقط - المزن مول
                            </a>
                        </li>
                        <li>
                            <a href="https://www.google.com/maps/place/%D8%A7%D9%84%D9%82%D8%B1%D9%8A%D8%A9+%D8%A7%D9%84%D9%87%D9%86%D8%AF%D9%8A%D8%A9%E2%80%AD/@22.7774833,57.5578337,17z/data=!3m1!4b1!4m6!3m5!1s0x3e8efa0b0659d2bf:0xf7de9c66e5e72ea7!8m2!3d22.7774833!4d57.5578337!16s%2Fg%2F11cnch4cfl?entry=ttu" target="_blank" rel="noopener noreferrer">
                                فرع الداخلية - متحف عمان عبر الزمان
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <button
                className={`scroll-top ${showScroll ? 'show' : ''}`}
                onClick={scrollTop}
                aria-label="Scroll to top"
            >
                <FontAwesomeIcon icon={faArrowUp} />
            </button>
        </footer>
    );
};

export default Footer;
