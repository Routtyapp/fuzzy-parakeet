// hooks.js
import { useState, useEffect, useMemo } from 'react';
import { BREAKPOINTS, PRESET_CONFIG } from './constants';

// 디바운스 유틸리티
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 윈도우 크기 훅
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }, 100);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// 디바이스 타입 감지 훅
export const useDeviceType = () => {
  const { width } = useWindowSize();
  
  return useMemo(() => {
    if (width <= BREAKPOINTS.MOBILE) return 'mobile';
    if (width <= BREAKPOINTS.TABLET) return 'tablet';
    return 'desktop';
  }, [width]);
};

// 프리셋 요소 개수 계산 훅
export const usePresetElementCounts = (preset) => {
  const deviceType = useDeviceType();
  
  return useMemo(() => {
    const config = PRESET_CONFIG[preset];
    if (!config?.elementCounts) return {};
    
    return config.elementCounts[deviceType] || config.elementCounts.desktop;
  }, [preset, deviceType]);
};

// WebGL 지원 체크 훅
export const useWebGLSupport = () => {
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        setIsSupported(false);
        setError('WebGL이 지원되지 않는 브라우저입니다.');
        return;
      }

      // 추가 WebGL 기능 체크
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) {
        ext.loseContext(); // 테스트 후 즉시 복원
        ext.restoreContext();
      }

      setIsSupported(true);
    } catch (e) {
      console.warn('WebGL 지원 체크 중 오류:', e);
      setIsSupported(false);
      setError('WebGL 초기화 중 오류가 발생했습니다.');
    }
  }, []);

  return { isSupported, error };
};

// 키보드 네비게이션 훅
export const useKeyboardNavigation = (onPageChange, onPresetChange, activePage) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 숫자 키로 페이지 전환 (1-5)
      if (e.key >= '1' && e.key <= '5') {
        const pages = ['home', 'about', 'skills', 'experience', 'contact'];
        onPageChange(pages[parseInt(e.key) - 1]);
        return;
      }

      // 홈페이지에서 프리셋 변경 (F1-F3)
      if (activePage === 'home') {
        if (e.key === 'F1') {
          e.preventDefault();
          onPresetChange(1);
        } else if (e.key === 'F2') {
          e.preventDefault();
          onPresetChange(2);
        } else if (e.key === 'F3') {
          e.preventDefault();
          onPresetChange(3);
        }
      }

      // ESC로 홈으로 돌아가기
      if (e.key === 'Escape') {
        onPageChange('home');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onPageChange, onPresetChange, activePage]);
};

// 성능 모니터링 훅
export const usePerformanceMonitor = () => {
  const [performanceData, setPerformanceData] = useState({
    fps: 0,
    memory: null,
    isLowPerformance: false
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let rafId;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        setPerformanceData(prev => ({
          ...prev,
          fps,
          isLowPerformance: fps < 30,
          memory: performance.memory ? {
            used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
          } : null
        }));

        frameCount = 0;
        lastTime = currentTime;
      }

      rafId = requestAnimationFrame(measureFPS);
    };

    rafId = requestAnimationFrame(measureFPS);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return performanceData;
};

// 절전 모드 감지 훅
export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isVisible;
};