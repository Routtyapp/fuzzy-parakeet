import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// React 18의 새로운 createRoot API 사용
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 웹 바이탈 성능 측정 (선택사항)
// 앱의 성능을 측정하고 분석하고 싶다면 아래 함수에 로그 함수를 전달하세요
// 예: reportWebVitals(console.log)
// 또는 analytics endpoint로 결과를 전송하세요. 더 자세한 정보: https://bit.ly/CRA-vitals
// reportWebVitals();