import React from 'react';

const Experience = () => {
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

export default Experience;