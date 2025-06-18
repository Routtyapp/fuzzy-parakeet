import React from 'react';

const Skills = () => {
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

export default Skills;