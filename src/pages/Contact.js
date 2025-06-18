import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 폼 제출 로직 구현
    console.log('Form submitted:', formData);
  };

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

export default Contact;