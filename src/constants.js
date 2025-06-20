// constants.js
export const ANIMATION_CONFIG = {
  FAST_DURATION: 0.05,
  SLOW_DURATION: 0.3,
  FAST_EASE: "power3.out",
  SLOW_EASE: "power1.out",
  PAGE_TRANSITION_DURATION: 0.3
};

export const PRESET_CONFIG = {
  1: {
    title: "안녕하세요",
    subtitle: "창의적이고 혁신적인 개발자입니다",
    colorStops: ["#3A29FF", "#FF94B4", "#FF3232"],
    aurora: {
      blend: 0.5,
      amplitude: 1.0,
      speed: 0.5
    },
    orb: {
      hoverIntensity: 0.3,
      rotateOnHover: true,
      hue: 17,
      forceHoverState: false
    }
  },
  2: {
    title: "Space Explorer",
    subtitle: "우주를 탐험하고 혜성을 만들어보세요 ✨",
    theme: "space"
  },
  3: {
    title: "Stay on top of trends",
    subtitle: "기본에 충실하면서 트렌드를 놓치지 않습니다",
    theme: "cyberpunk",
    elementCounts: {
      desktop: { matrixCols: 100, gridH: 20, gridV: 25 },
      tablet: { matrixCols: 60, gridH: 15, gridV: 18 },
      mobile: { matrixCols: 30, gridH: 10, gridV: 12 }
    }
  },
  4: {
    title: "Black Hole Explorer",
    subtitle: "중력을 조작하여 파티클을 제어하세요 🌌",
    theme: "interstellar",
    blackhole: {
      particleCount: {
        desktop: 1500,
        tablet: 1200,
        mobile: 800
      },
      blackHoleRadius: {
        desktop: 20,
        tablet: 18,
        mobile: 15
      },
      maxDistance: {
        desktop: 100,
        tablet: 90,
        mobile: 80
      },
      gravityStrength: {
        desktop: 0.8,
        tablet: 0.7,
        mobile: 0.5
      },
      colors: {
        eventHorizon: "#000000",
        accretionDisk: "#ff6b35",
        particles: ["#ff6b35", "#ff8c42", "#ffa500", "#ffb347"]
      }
    }
  }
};

export const NAVIGATION_CONFIG = [
  { icon: 'VscHome', label: '홈', page: 'home', key: '1' },
  { icon: 'VscAccount', label: '소개', page: 'about', key: '2' },
  { icon: 'VscTools', label: '기술', page: 'skills', key: '3' },
  { icon: 'VscBriefcase', label: '경험', page: 'experience', key: '4' },
  { icon: 'VscMail', label: '연락처', page: 'contact', key: '5' }
];

export const BLOB_CURSOR_CONFIG = {
  blobType: "circle",
  fillColor: "#4ECDC4",
  trailCount: 3,
  sizes: [50, 100, 70],
  innerSizes: [18, 30, 22],
  innerColor: "rgba(255,255,255,0.9)",
  opacities: [0.8, 0.5, 0.6],
  shadowColor: "rgba(78, 205, 196, 0.4)",
  shadowBlur: 8,
  shadowOffsetX: 2,
  shadowOffsetY: 2,
  filterStdDeviation: 25,
  useFilter: true,
  fastDuration: ANIMATION_CONFIG.FAST_DURATION,
  slowDuration: ANIMATION_CONFIG.SLOW_DURATION,
  fastEase: ANIMATION_CONFIG.FAST_EASE,
  slowEase: ANIMATION_CONFIG.SLOW_EASE,
  zIndex: 9999
};

export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1440
};