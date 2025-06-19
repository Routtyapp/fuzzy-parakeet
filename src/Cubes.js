import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import "./Cubes.css";

// 🎮 Preset 설정 중앙화
const CUBE_PRESETS = {
  cyberpunk: {
    gridSize: {
      mobile: 7,
      tablet: 8,
      desktop: 8
    },
    cubeSize: {
      mobile: 55,
      tablet: 70,
      desktop: 85
    },
    maxAngle: 180,
    radius: 3,
    borderStyle: "2px dashed #B19EEF",
    faceColor: {
      mobile: "#060010",
      tablet: "rgba(6, 0, 16, 0.9)",
      desktop: "rgba(6, 0, 16, 0.9)"
    },
    rippleColor: "#ff00ff",
    rippleSpeed: {
      mobile: 3,
      tablet: 2,
      desktop: 2
    },
    cellGap: {
      mobile: 6,
      tablet: 10,
      desktop: 10
    },
    duration: { enter: 0.4, leave: 0.9 },
    easing: "power2.out"
  },
  // 추후 확장 가능한 다른 프리셋들
  matrix: {
    gridSize: { mobile: 6, tablet: 8, desktop: 10 },
    cubeSize: { mobile: 40, tablet: 50, desktop: 60 },
    maxAngle: 45,
    radius: 2,
    borderStyle: "1px solid #00ff41",
    faceColor: "#0a0a0a",
    rippleColor: "#00ff41",
    rippleSpeed: { mobile: 2, tablet: 1.5, desktop: 1.5 },
    cellGap: { mobile: 8, tablet: 12, desktop: 15 },
    duration: { enter: 0.3, leave: 0.6 },
    easing: "power3.out"
  }
};

// 🎨 테마별 클래스 매핑
const THEME_CLASSES = {
  cyberpunk: "cubes-cyberpunk-theme",
  matrix: "cubes-matrix-theme",
  default: "cubes-default-theme"
};

// 📱 디바이스 타입 감지 훅 (제거됨 - props로 받음)

const Cubes = ({
  preset = "cyberpunk",
  theme = "cyberpunk", 
  isActive = true,
  deviceType = "desktop", // props로 받음
  // 개별 설정으로 오버라이드 가능
  gridSize: customGridSize,
  cubeSize: customCubeSize,
  maxAngle: customMaxAngle,
  radius: customRadius,
  easing: customEasing,
  duration: customDuration,
  cellGap: customCellGap,
  borderStyle: customBorderStyle,
  faceColor: customFaceColor,
  shadow = false,
  autoAnimate = true,
  rippleOnClick = true,
  rippleColor: customRippleColor,
  rippleSpeed: customRippleSpeed,
}) => {
  const sceneRef = useRef(null);
  const rafRef = useRef(null);
  const idleTimerRef = useRef(null);
  const userActiveRef = useRef(false);
  const simPosRef = useRef({ x: 0, y: 0 });
  const simTargetRef = useRef({ x: 0, y: 0 });
  const simRAFRef = useRef(null);

  // 🎯 Preset 기반 설정 가져오기
  const presetConfig = CUBE_PRESETS[preset] || CUBE_PRESETS.cyberpunk;
  
  // 📐 디바이스별 값 계산
  const getDeviceValue = (config) => {
    if (typeof config === 'object' && config !== null) {
      return config[deviceType] || config.desktop || config;
    }
    return config;
  };

  // ⚙️ 최종 설정값 계산 (preset + 커스텀)
  const finalConfig = {
    gridSize: customGridSize || getDeviceValue(presetConfig.gridSize),
    cubeSize: customCubeSize || getDeviceValue(presetConfig.cubeSize),
    maxAngle: customMaxAngle || presetConfig.maxAngle,
    radius: customRadius || presetConfig.radius,
    borderStyle: customBorderStyle || presetConfig.borderStyle,
    faceColor: customFaceColor || getDeviceValue(presetConfig.faceColor),
    rippleColor: customRippleColor || presetConfig.rippleColor,
    rippleSpeed: customRippleSpeed || getDeviceValue(presetConfig.rippleSpeed),
    cellGap: customCellGap || getDeviceValue(presetConfig.cellGap),
    duration: customDuration || presetConfig.duration,
    easing: customEasing || presetConfig.easing
  };

  // 🎨 CSS 변수 및 클래스 설정
  const themeClass = THEME_CLASSES[theme] || THEME_CLASSES.default;
  
  const colGap = typeof finalConfig.cellGap === "number" 
    ? `${finalConfig.cellGap}px` 
    : `${finalConfig.cellGap}px`;
  const rowGap = colGap;

  const enterDur = finalConfig.duration.enter;
  const leaveDur = finalConfig.duration.leave;

  // 🎪 애니메이션 로직들 (기존과 동일)
  const tiltAt = useCallback(
    (rowCenter, colCenter) => {
      if (!sceneRef.current) return;
      sceneRef.current
        .querySelectorAll(".cube")
        .forEach((cube) => {
          const r = +cube.dataset.row;
          const c = +cube.dataset.col;
          const dist = Math.hypot(r - rowCenter, c - colCenter);
          if (dist <= finalConfig.radius) {
            const pct = 1 - dist / finalConfig.radius;
            const angle = pct * finalConfig.maxAngle;
            gsap.to(cube, {
              duration: enterDur,
              ease: finalConfig.easing,
              overwrite: true,
              rotateX: -angle,
              rotateY: angle,
            });
          } else {
            gsap.to(cube, {
              duration: leaveDur,
              ease: "power3.out",
              overwrite: true,
              rotateX: 0,
              rotateY: 0,
            });
          }
        });
    },
    [finalConfig.radius, finalConfig.maxAngle, enterDur, leaveDur, finalConfig.easing]
  );

  const onPointerMove = useCallback(
    (e) => {
      userActiveRef.current = true;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      const rect = sceneRef.current.getBoundingClientRect();
      const cellW = rect.width / finalConfig.gridSize;
      const cellH = rect.height / finalConfig.gridSize;
      const colCenter = (e.clientX - rect.left) / cellW;
      const rowCenter = (e.clientY - rect.top) / cellH;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() =>
        tiltAt(rowCenter, colCenter)
      );

      idleTimerRef.current = setTimeout(() => {
        userActiveRef.current = false;
      }, 3000);
    },
    [finalConfig.gridSize, tiltAt]
  );

  const resetAll = useCallback(() => {
    if (!sceneRef.current) return;
    sceneRef.current.querySelectorAll(".cube").forEach((cube) =>
      gsap.to(cube, {
        duration: leaveDur,
        rotateX: 0,
        rotateY: 0,
        ease: "power3.out",
      })
    );
  }, [leaveDur]);

  const onClick = useCallback(
    (e) => {
      if (!rippleOnClick || !sceneRef.current) return;
      const rect = sceneRef.current.getBoundingClientRect();
      const cellW = rect.width / finalConfig.gridSize;
      const cellH = rect.height / finalConfig.gridSize;
      const colHit = Math.floor((e.clientX - rect.left) / cellW);
      const rowHit = Math.floor((e.clientY - rect.top) / cellH);

      const baseRingDelay = 0.15;
      const baseAnimDur = 0.3;
      const baseHold = 0.6;

      const spreadDelay = baseRingDelay / finalConfig.rippleSpeed;
      const animDuration = baseAnimDur / finalConfig.rippleSpeed;
      const holdTime = baseHold / finalConfig.rippleSpeed;

      const rings = {};
      sceneRef.current
        .querySelectorAll(".cube")
        .forEach((cube) => {
            const r = +cube.dataset.row;
            const c = +cube.dataset.col;
            const dist = Math.hypot(r - rowHit, c - colHit);
            const ring = Math.round(dist);
            if (!rings[ring]) rings[ring] = [];
            rings[ring].push(cube);
          });

      Object.keys(rings)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((ring) => {
          const delay = ring * spreadDelay;
          const faces = rings[ring].flatMap((cube) =>
            Array.from(cube.querySelectorAll(".cube-face"))
          );

          gsap.to(faces, {
            backgroundColor: finalConfig.rippleColor,
            duration: animDuration,
            delay,
            ease: "power3.out",
          });
          gsap.to(faces, {
            backgroundColor: finalConfig.faceColor,
            duration: animDuration,
            delay: delay + animDuration + holdTime,
            ease: "power3.out",
          });
        });
    },
    [rippleOnClick, finalConfig.gridSize, finalConfig.faceColor, finalConfig.rippleColor, finalConfig.rippleSpeed]
  );

  // 🤖 자동 애니메이션
  useEffect(() => {
    if (!autoAnimate || !sceneRef.current || !isActive) return;
    simPosRef.current = {
      x: Math.random() * finalConfig.gridSize,
      y: Math.random() * finalConfig.gridSize,
    };
    simTargetRef.current = {
      x: Math.random() * finalConfig.gridSize,
      y: Math.random() * finalConfig.gridSize,
    };
    const speed = 0.02;
    const loop = () => {
      if (!userActiveRef.current) {
        const pos = simPosRef.current;
        const tgt = simTargetRef.current;
        pos.x += (tgt.x - pos.x) * speed;
        pos.y += (tgt.y - pos.y) * speed;
        tiltAt(pos.y, pos.x);
        if (Math.hypot(pos.x - tgt.x, pos.y - tgt.y) < 0.1) {
          simTargetRef.current = {
            x: Math.random() * finalConfig.gridSize,
            y: Math.random() * finalConfig.gridSize,
          };
        }
      }
      simRAFRef.current = requestAnimationFrame(loop);
    };
    simRAFRef.current = requestAnimationFrame(loop);
    return () => {
      if (simRAFRef.current != null) {
        cancelAnimationFrame(simRAFRef.current);
      }
    };
  }, [autoAnimate, finalConfig.gridSize, tiltAt, isActive]);

  // 🎧 이벤트 리스너
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", resetAll);
    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", resetAll);
      el.removeEventListener("click", onClick);
      rafRef.current != null && cancelAnimationFrame(rafRef.current);
      idleTimerRef.current && clearTimeout(idleTimerRef.current);
    };
  }, [onPointerMove, resetAll, onClick]);

  // 🎲 큐브 그리드 생성
  const cells = Array.from({ length: finalConfig.gridSize });
  const sceneStyle = {
    gridTemplateColumns: finalConfig.cubeSize
      ? `repeat(${finalConfig.gridSize}, ${finalConfig.cubeSize}px)`
      : `repeat(${finalConfig.gridSize}, 1fr)`,
    gridTemplateRows: finalConfig.cubeSize
      ? `repeat(${finalConfig.gridSize}, ${finalConfig.cubeSize}px)`
      : `repeat(${finalConfig.gridSize}, 1fr)`,
    columnGap: colGap,
    rowGap: rowGap,
  };
  
  const wrapperStyle = {
    "--cube-face-border": finalConfig.borderStyle,
    "--cube-face-bg": finalConfig.faceColor,
    "--cube-face-shadow":
      shadow === true ? "0 0 6px rgba(0,0,0,.5)" : shadow || "none",
    ...(finalConfig.cubeSize
      ? {
        width: `${finalConfig.gridSize * finalConfig.cubeSize}px`,
        height: `${finalConfig.gridSize * finalConfig.cubeSize}px`,
      }
      : {}),
  };

  return (
    <div 
      className={`cubes-container ${themeClass} ${theme === 'matrix' && preset === 'cyberpunk' ? 'cubes-right-position' : ''}`} 
      style={wrapperStyle}
    >
      <div
        ref={sceneRef}
        className="cubes-scene"
        style={sceneStyle}
      >
        {cells.map((_, r) =>
          cells.map((__, c) => (
            <div key={`${r}-${c}`} className="cube" data-row={r} data-col={c}>
              <div className="cube-face cube-face--top" />
              <div className="cube-face cube-face--bottom" />
              <div className="cube-face cube-face--left" />
              <div className="cube-face cube-face--right" />
              <div className="cube-face cube-face--front" />
              <div className="cube-face cube-face--back" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Cubes;