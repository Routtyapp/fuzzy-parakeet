import React from 'react';

const About = () => {
  return (
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
};

export default About;