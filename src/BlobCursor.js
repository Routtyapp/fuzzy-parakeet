import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import "./BlobCursor.css";

export default function BlobCursor({
  blobType = "circle",
  fillColor = "#5227FF",
  trailCount = 3,
  sizes = [60, 125, 75],
  innerSizes = [20, 35, 25],
  innerColor = "rgba(255,255,255,0.8)",
  opacities = [0.6, 0.6, 0.6],
  shadowColor = "rgba(0,0,0,0.75)",
  shadowBlur = 5,
  shadowOffsetX = 10,
  shadowOffsetY = 10,
  filterId = "blob",
  filterStdDeviation = 30,
  filterColorMatrixValues = "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10",
  useFilter = true,
  fastDuration = 0.1,
  slowDuration = 0.5,
  fastEase = "power3.out",
  slowEase = "power1.out",
  zIndex = 100,
}) {
  const containerRef = useRef(null);
  const blobsRef = useRef([]);
  const isActiveRef = useRef(true);
  const lastMoveTimeRef = useRef(0);

  // 성능 최적화를 위한 디바운스된 이동 핸들러
  const handleMove = useCallback(
    (e) => {
      const now = Date.now();
      
      // 너무 빈번한 호출 방지 (60fps 제한)
      if (now - lastMoveTimeRef.current < 16) return;
      lastMoveTimeRef.current = now;

      if (!isActiveRef.current) return;

      let x, y;
      
      if (e.type === 'touchmove' && e.touches && e.touches[0]) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else if (e.clientX !== undefined && e.clientY !== undefined) {
        x = e.clientX;
        y = e.clientY;
      } else {
        return;
      }

      // 성능 최적화: 화면 경계 체크
      if (x < -100 || x > window.innerWidth + 100 || 
          y < -100 || y > window.innerHeight + 100) {
        return;
      }

      blobsRef.current.forEach((el, i) => {
        if (!el) return;
        const isLead = i === 0;
        
        // will-change 속성 최적화
        el.style.willChange = 'transform';
        
        gsap.to(el, {
          x: x,
          y: y,
          duration: isLead ? fastDuration : slowDuration,
          ease: isLead ? fastEase : slowEase,
          onComplete: () => {
            if (el) el.style.willChange = 'auto';
          }
        });
      });
    },
    [fastDuration, slowDuration, fastEase, slowEase]
  );

  // 페이지 가시성 변경 감지
  useEffect(() => {
    const handleVisibilityChange = () => {
      isActiveRef.current = !document.hidden;
      
      if (document.hidden) {
        // 페이지가 숨겨지면 애니메이션 일시정지
        gsap.globalTimeline.pause();
      } else {
        // 페이지가 다시 보이면 애니메이션 재개
        gsap.globalTimeline.resume();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // 성능 모니터링 및 품질 조정
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let rafId;

    const checkPerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // 성능이 낮으면 품질 조정
        if (fps < 30) {
          console.warn('BlobCursor: 낮은 FPS 감지, 최적화 모드 활성화');
          // 애니메이션 품질 조정
          gsap.globalTimeline.timeScale(0.5);
        } else if (fps > 50) {
          gsap.globalTimeline.timeScale(1);
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      rafId = requestAnimationFrame(checkPerformance);
    };

    rafId = requestAnimationFrame(checkPerformance);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useEffect(() => {
    // 초기 위치를 화면 중앙으로 설정
    blobsRef.current.forEach((el) => {
      if (el) {
        gsap.set(el, {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });
      }
    });

    // 이벤트 핸들러들
    const handleMouseMove = (e) => {
      if (!isActiveRef.current) return;
      handleMove(e);
    };
    
    const handleTouchMove = (e) => {
      if (!isActiveRef.current) return;
      e.preventDefault();
      handleMove(e);
    };

    // 마우스가 화면을 벗어났을 때 처리
    const handleMouseLeave = () => {
      blobsRef.current.forEach((el) => {
        if (el) {
          gsap.to(el, {
            opacity: 0.3,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    };

    // 마우스가 화면에 들어왔을 때 처리
    const handleMouseEnter = () => {
      blobsRef.current.forEach((el, i) => {
        if (el) {
          gsap.to(el, {
            opacity: opacities[i] || 0.6,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    };

    // 리사이즈 처리
    const handleResize = () => {
      // 화면 크기가 변경되면 커서 위치 재조정
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      blobsRef.current.forEach((el) => {
        if (el) {
          const currentX = gsap.getProperty(el, "x");
          const currentY = gsap.getProperty(el, "y");
          
          // 화면 밖으로 나간 경우 중앙으로 이동
          if (currentX > window.innerWidth || currentY > window.innerHeight) {
            gsap.set(el, { x: centerX, y: centerY });
          }
        }
      });
    };

    // Passive 이벤트 리스너로 성능 최적화
    const options = { passive: true };
    const touchOptions = { passive: false };

    window.addEventListener('mousemove', handleMouseMove, options);
    window.addEventListener('touchmove', handleTouchMove, touchOptions);
    window.addEventListener('mouseenter', handleMouseEnter, options);
    window.addEventListener('mouseleave', handleMouseLeave, options);
    window.addEventListener('resize', handleResize, options);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleMove, opacities]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    const currentBlobs = blobsRef.current; // cleanup에서 사용할 현재 값 저장
    
    return () => {
      // GSAP 애니메이션 정리
      currentBlobs.forEach((el) => {
        if (el) {
          gsap.killTweensOf(el);
        }
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="blob-container"
      style={{ zIndex }}
      aria-hidden="true"
    >
      {useFilter && (
        <svg className="blob-filter-svg" aria-hidden="true">
          <defs>
            <filter id={filterId}>
              <feGaussianBlur
                in="SourceGraphic"
                result="blur"
                stdDeviation={filterStdDeviation}
              />
              <feColorMatrix 
                in="blur" 
                values={filterColorMatrixValues} 
              />
            </filter>
          </defs>
        </svg>
      )}

      <div
        className="blob-main"
        style={{ 
          filter: useFilter ? `url(#${filterId})` : undefined 
        }}
      >
        {Array.from({ length: trailCount }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (blobsRef.current[i] = el)}
            className="blob"
            style={{
              width: sizes[i],
              height: sizes[i],
              borderRadius: blobType === "circle" ? "50%" : "0",
              backgroundColor: fillColor,
              opacity: opacities[i],
              boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px 0 ${shadowColor}`,
              backfaceVisibility: 'hidden', // 성능 최적화
              perspective: 1000, // 성능 최적화
            }}
          >
            <div
              className="inner-dot"
              style={{
                width: innerSizes[i],
                height: innerSizes[i],
                top: (sizes[i] - innerSizes[i]) / 2,
                left: (sizes[i] - innerSizes[i]) / 2,
                backgroundColor: innerColor,
                borderRadius: blobType === "circle" ? "50%" : "0",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}