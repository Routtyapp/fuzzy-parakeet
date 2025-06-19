import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import './App.css';
import { VscAccount, VscTools, VscBriefcase, VscMail, VscHome } from 'react-icons/vsc';
import { motion, AnimatePresence } from 'framer-motion';

// 상수 및 훅 임포트
import { PRESET_CONFIG, NAVIGATION_CONFIG, BLOB_CURSOR_CONFIG, ANIMATION_CONFIG } from './constants';
import { 
  useDeviceType,
  useWebGLSupport, 
  useKeyboardNavigation,
  usePageVisibility
} from './hooks';

// 동적 임포트 (코드 스플리팅)
const BlobCursor = lazy(() => import('./BlobCursor'));
const Aurora = lazy(() => import('./Aurora'));
const Orb = lazy(() => import('./Orb'));
const Particles = lazy(() => import('./Particles'));
const Cubes = lazy(() => import('./Cubes'));

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [homePreset, setHomePreset] = useState(1);

  // 커스텀 훅들
  const deviceType = useDeviceType();
  const { isSupported: webglSupported } = useWebGLSupport();
  const isPageVisible = usePageVisibility();

  // 키보드 네비게이션
  useKeyboardNavigation(setActivePage, setHomePreset, activePage);

  useEffect(() => {
    document.body.classList.add('blob-cursor-active');
    return () => document.body.classList.remove('blob-cursor-active');
  }, []);

  // 네비게이션 아이템 생성 (메모이제이션)
  const navItems = useMemo(() => 
    NAVIGATION_CONFIG.map(item => ({
      ...item,
      icon: getIconComponent(item.icon)
    })), []
  );

  // 아이콘 컴포넌트 매핑
  function getIconComponent(iconName) {
    const icons = {
      VscHome: <VscHome size={20} />,
      VscAccount: <VscAccount size={20} />,
      VscTools: <VscTools size={20} />,
      VscBriefcase: <VscBriefcase size={20} />,
      VscMail: <VscMail size={20} />
    };
    return icons[iconName];
  }

  // 페이지 변경 핸들러 (useCallback으로 최적화)
  const handlePageChange = useCallback((page) => {
    setActivePage(page);
  }, []);

  const handlePresetChange = useCallback((preset) => {
    setHomePreset(preset);
  }, []);

  // 홈페이지 컴포넌트 (메모이제이션 적용)
  const HomePage = React.memo(() => {
    const currentPreset = PRESET_CONFIG[homePreset];

    // 프리셋별 배경 렌더링 함수
    const renderPresetBackground = () => {
      switch (homePreset) {
        case 1:
          return (
            <>
              {webglSupported ? (
                <>
                  <div className="aurora-background">
                    <Aurora
                      colorStops={currentPreset.colorStops}
                      blend={currentPreset.aurora.blend}
                      amplitude={currentPreset.aurora.amplitude}
                      speed={isPageVisible ? currentPreset.aurora.speed : 0}
                    />
                  </div>
                  <div className="orb-background">
                    <Orb
                      hoverIntensity={currentPreset.orb.hoverIntensity}
                      rotateOnHover={currentPreset.orb.rotateOnHover}
                      hue={currentPreset.orb.hue}
                      forceHoverState={currentPreset.orb.forceHoverState}
                    />
                  </div>
                </>
              ) : (
                <div className="webgl-fallback">
                  <div className="simple-gradient"></div>
                  <div className="fallback-text">
                    <p>WebGL을 지원하지 않는 브라우저입니다.</p>
                  </div>
                </div>
              )}
            </>
          );

        case 2:
          return (
            <div className="space-background">
              <Suspense fallback={<div className="loading-placeholder">우주 로딩 중...</div>}>
                <Particles
                  particleColors={['#ffffff', '#4ECDC4', '#45B7D1', '#667eea', '#f093fb']}
                  particleCount={deviceType === 'mobile' ? 150 : deviceType === 'tablet' ? 250 : 350}
                  particleSpread={15}
                  speed={isPageVisible ? 0.05 : 0}
                  particleBaseSize={deviceType === 'mobile' ? 80 : 120}
                  moveParticlesOnHover={true}
                  particleHoverFactor={2}
                  alphaParticles={true}
                  disableRotation={false}
                  sizeRandomness={1.5}
                  cameraDistance={25}
                />
              </Suspense>
            </div>
          );

        case 3:
          return (
            <div className="cyberpunk-background">
              <Suspense fallback={<div className="loading-placeholder">사이버 큐브 로딩 중...</div>}>
                <Cubes 
                  preset="cyberpunk"
                  theme="matrix"
                  isActive={isPageVisible}
                  deviceType={deviceType}
                />
              </Suspense>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className={`page-container home-page ${homePreset === 3 ? 'cyberpunk-layout' : ''}`}>
        {renderPresetBackground()}
        
        <div className="main-welcome-display">
          <div className="welcome-content">
            {homePreset === 3 ? (
              /* 사이버펑크 레이아웃: 좌측 텍스트, 우측 큐브 */
              <div className="cyberpunk-content-layout">
                <div className="cyberpunk-text-section">
                  <motion.h1
                    key={homePreset}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {currentPreset.title}
                  </motion.h1>
                  <motion.p 
                    className="welcome-subtitle"
                    key={`${homePreset}-subtitle`}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {currentPreset.subtitle}
                  </motion.p>
                </div>
                <div className="cyberpunk-cubes-section">
                  {/* Cubes는 CSS에서 우측으로 배치됨 */}
                </div>
              </div>
            ) : (
              /* 기본 레이아웃: 중앙 정렬 */
              <div className="welcome-text">
                <motion.h1
                  key={homePreset}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {currentPreset.title}
                </motion.h1>
                <motion.p 
                  className="welcome-subtitle"
                  key={`${homePreset}-subtitle`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {currentPreset.subtitle}
                </motion.p>
              </div>
            )}
          </div>
        </div>

        <div className="preset-buttons">
          {[1, 2, 3].map((preset) => (
            <motion.button
              key={preset}
              onClick={() => handlePresetChange(preset)}
              className={`preset-btn ${homePreset === preset ? 'preset-btn-active' : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`프리셋 ${preset} (F${preset})`}
              title={`프리셋 ${preset} - F${preset} 키로 전환 가능`}
            >
              {preset}
            </motion.button>
          ))}
        </div>
      </div>
    );
  });

  // About Page Component
  const AboutPage = () => (
    <div className="page-container">
      <div className="page-content">
        <div className="page-header">
          <h1>소개</h1>
          <div className="page-header-decoration"></div>
        </div>
        
        <div className="content-section">
          <div className="intro-text">
            <h2>안녕하세요! 👋</h2>
            <p>창의적이고 혁신적인 개발자입니다.</p>
            <p>사용자 경험을 중시하며, 아름답고 실용적인 웹 솔루션을 만듭니다.</p>
          </div>
          
          <div className="about-details">
            <div className="detail-card">
              <div className="detail-icon">🎯</div>
              <div className="detail-content">
                <h3>전문 분야</h3>
                <p>프론트엔드 개발, UI/UX 디자인</p>
              </div>
            </div>
            
            <div className="detail-card">
              <div className="detail-icon">💡</div>
              <div className="detail-content">
                <h3>관심사</h3>
                <p>인터랙티브 웹, 사용자 경험, 최신 기술</p>
              </div>
            </div>
            
            <div className="detail-card">
              <div className="detail-icon">🚀</div>
              <div className="detail-content">
                <h3>목표</h3>
                <p>더 나은 웹 경험을 통한 사용자의 삶의 질 향상</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Skills Page Component
  const SkillsPage = () => {
    const skillCategories = [
      {
        title: '프론트엔드',
        icon: '🎨',
        skills: ['React', 'Vue.js', 'TypeScript', 'Next.js', 'Tailwind CSS']
      },
      {
        title: '백엔드',
        icon: '⚙️',
        skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB']
      },
      {
        title: '도구 및 기타',
        icon: '🛠️',
        skills: ['Git', 'Docker', 'AWS', 'Figma']
      }
    ];

    return (
      <div className="page-container">
        <div className="page-content">
          <div className="page-header">
            <h1>기술 스택</h1>
            <div className="page-header-decoration"></div>
          </div>
          
          <div className="content-section">
            <div className="skills-grid">
              {skillCategories.map((category, index) => (
                <div key={index} className="skill-category-card">
                  <div className="category-header">
                    <span className="category-icon">{category.icon}</span>
                    <h3>{category.title}</h3>
                  </div>
                  <div className="skill-tags">
                    {category.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="skill-description">
              <p>다양한 기술 스택을 활용하여 사용자 중심의 웹 애플리케이션을 개발합니다.</p>
              <p>새로운 기술 학습과 적용을 통해 지속적으로 발전하고 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Experience Page Component
  const ExperiencePage = () => {
    const experiences = [
      {
        period: '2022 - Present',
        title: '시니어 프론트엔드 개발자',
        company: 'Tech Company A',
        description: 'React 기반 웹 애플리케이션 개발 및 팀 리딩',
        achievements: [
          '사용자 경험 개선으로 전환율 30% 향상',
          '성능 최적화로 로딩 시간 50% 단축',
          '주니어 개발자 3명 멘토링'
        ]
      },
      {
        period: '2020 - 2022',
        title: '풀스택 개발자',
        company: 'Startup B',
        description: '다양한 프로젝트의 프론트엔드/백엔드 개발',
        achievements: [
          '10+ 프로젝트 성공적 완료',
          '새로운 기술 스택 도입 및 표준화',
          '코드 리뷰 문화 정착'
        ]
      }
    ];

    return (
      <div className="page-container">
        <div className="page-content">
          <div className="page-header">
            <h1>경력 사항</h1>
            <div className="page-header-decoration"></div>
          </div>
          
          <div className="content-section">
            <div className="experience-timeline">
              {experiences.map((exp, index) => (
                <div key={index} className="experience-card">
                  <div className="timeline-marker"></div>
                  <div className="experience-content">
                    <div className="experience-period">{exp.period}</div>
                    <h3 className="experience-title">{exp.title}</h3>
                    <div className="experience-company">{exp.company}</div>
                    <p className="experience-description">{exp.description}</p>
                    <ul className="experience-achievements">
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="experience-summary">
              <h3>🎯 핵심 역량</h3>
              <div className="competency-grid">
                <div className="competency-item">
                  <span className="competency-icon">🚀</span>
                  <span>프로젝트 리딩</span>
                </div>
                <div className="competency-item">
                  <span className="competency-icon">💡</span>
                  <span>문제 해결</span>
                </div>
                <div className="competency-item">
                  <span className="competency-icon">👥</span>
                  <span>팀 협업</span>
                </div>
                <div className="competency-item">
                  <span className="competency-icon">📈</span>
                  <span>성능 최적화</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Contact Page Component
  const ContactPage = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: ''
    });

    const handleInputChange = useCallback((e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }, []);

    const handleSubmit = useCallback((e) => {
      e.preventDefault();
      console.log('Form submitted:', formData);
    }, [formData]);

    const contactMethods = [
      {
        icon: '📧',
        title: '이메일',
        value: 'your.email@example.com',
        link: 'mailto:your.email@example.com'
      },
      {
        icon: '💼',
        title: '링크드인',
        value: '/in/yourprofile',
        link: 'https://linkedin.com/in/yourprofile'
      },
      {
        icon: '🔗',
        title: '깃허브',
        value: '/yourusername',
        link: 'https://github.com/yourusername'
      },
      {
        icon: '📱',
        title: '전화번호',
        value: '+82 10-1234-5678',
        link: 'tel:+821234567890'
      }
    ];

    return (
      <div className="page-container">
        <div className="page-content">
          <div className="page-header">
            <h1>연락하기</h1>
            <div className="page-header-decoration"></div>
          </div>
          
          <div className="content-section">
            <div className="contact-intro">
              <h2>함께 멋진 프로젝트를 만들어요! 🚀</h2>
              <p>새로운 기회나 협업에 대해 이야기하고 싶으시다면 언제든 연락주세요.</p>
            </div>
            
            <div className="contact-layout">
              <div className="contact-methods">
                <h3>연락 방법</h3>
                <div className="contact-grid">
                  {contactMethods.map((method, index) => (
                    <a
                      key={index}
                      href={method.link}
                      className="contact-method-card"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="contact-method-icon">{method.icon}</div>
                      <div className="contact-method-info">
                        <h4>{method.title}</h4>
                        <p>{method.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="contact-form-section">
                <h3>메시지 보내기</h3>
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">이름</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">이메일</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">메시지</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="submit-button">
                    메시지 보내기
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 페이지 렌더링 함수
  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'skills':
        return <SkillsPage />;
      case 'experience':
        return <ExperiencePage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app">
      {/* 커스텀 커서 */}
      <Suspense fallback={null}>
        <BlobCursor {...BLOB_CURSOR_CONFIG} />
      </Suspense>

      {/* 헤더 */}
      <header className="header">
        <div 
          className="name-logo"
          onClick={() => handlePageChange('home')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handlePageChange('home')}
        >
          Your Name
        </div>
        
        <nav className="nav" role="navigation" aria-label="메인 네비게이션">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(item.page)}
              className={`nav-item ${activePage === item.page ? 'nav-item-active' : ''}`}
              aria-label={`${item.label} (${item.key}키)`}
              aria-current={activePage === item.page ? 'page' : undefined}
              title={`${item.label} - ${item.key}키로 이동 가능`}
            >
              {item.icon}
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="header-decoration"></div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className={`main-content ${activePage === 'home' ? 'home-fullscreen' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: ANIMATION_CONFIG.PAGE_TRANSITION_DURATION }}
            style={{ width: '100%', height: '100%' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;