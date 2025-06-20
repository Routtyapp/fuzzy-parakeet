import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import './BlackHole.css';

const BlackHole = ({ 
  isActive = true,
  deviceType = 'desktop' 
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const blackHoleRef = useRef(null);
  const accretionDiskRef = useRef(null);
  const photonRingRef = useRef(null);
  const starsRef = useRef([]);
  const animationIdRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isClickingRef = useRef(false);
  const rotationSpeedRef = useRef(1);

  // 🎯 디바이스별 설정
  const config = useMemo(() => ({
    starCount: deviceType === 'mobile' ? 3000 : deviceType === 'tablet' ? 5000 : 8000,
    blackHoleRadius: 8,
    innerDiskRadius: 12,
    outerDiskRadius: 45,
    photonRingRadius: 25
  }), [deviceType]);

  // 🌌 씬 초기화
  const initScene = useCallback(() => {
    if (!mountRef.current) return;

    // 씬, 카메라, 렌더러 설정
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // 🕳️ 블랙홀 이벤트 호라이즌 (완전한 검은색)
    const blackHoleGeometry = new THREE.SphereGeometry(config.blackHoleRadius, 64, 64);
    const blackHoleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x000000,
      transparent: false
    });
    const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    scene.add(blackHole);

    // 🌟 광환 (Photon Ring) - 블랙홀 주변의 빛 고리
    const photonRingGeometry = new THREE.RingGeometry(
      config.photonRingRadius * 0.98, 
      config.photonRingRadius * 1.02, 
      128
    );
    const photonRingMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const photonRing = new THREE.Mesh(photonRingGeometry, photonRingMaterial);
    photonRing.rotation.x = Math.PI / 2;
    scene.add(photonRing);

    // 🌀 강착원반 (Accretion Disk) - 복잡한 구조
    const diskSegments = 10;
    const accretionDisks = [];
    
    for (let i = 0; i < diskSegments; i++) {
      const innerRadius = config.innerDiskRadius + (i * 3);
      const outerRadius = config.innerDiskRadius + ((i + 1) * 3);
      
      const diskGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);
      
      // 온도에 따른 색상 그라디언트 (안쪽이 더 뜨거움)
      const temperature = 1 - (i / diskSegments);
      const hue = temperature * 0.1; // 빨강-주황-노랑
      const saturation = 0.8 + temperature * 0.2;
      const lightness = 0.3 + temperature * 0.4;
      
      const diskMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(hue, saturation, lightness),
        transparent: true,
        opacity: 0.4 + temperature * 0.4,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      
      const disk = new THREE.Mesh(diskGeometry, diskMaterial);
      disk.rotation.x = Math.PI / 2;
      disk.userData = { 
        rotationSpeed: 0.02 - (i * 0.002), // 안쪽이 더 빠름
        originalOpacity: diskMaterial.opacity
      };
      
      accretionDisks.push(disk);
      scene.add(disk);
    }

    // ✨ 수많은 별들 (궤도 운동)
    const stars = [];
    const starGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    
    for (let i = 0; i < config.starCount; i++) {
      // 별의 밝기와 색상 다양화
      const brightness = 0.3 + Math.random() * 0.7;
      const temperature = Math.random();
      const hue = temperature * 0.15; // 파랑-흰-노랑-빨강
      
      const starMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(hue, 0.6, brightness),
        transparent: true,
        opacity: brightness
      });
      
      const star = new THREE.Mesh(starGeometry, starMaterial);
      
      // 궤도 매개변수
      const orbitRadius = config.outerDiskRadius + Math.random() * 150;
      const orbitInclination = (Math.random() - 0.5) * Math.PI * 0.3; // 궤도 경사
      const orbitPhase = Math.random() * Math.PI * 2; // 시작 위치
      const orbitSpeed = Math.sqrt(100 / orbitRadius) * 0.01; // 케플러 법칙
      
      star.userData = {
        orbitRadius,
        orbitInclination,
        orbitPhase,
        orbitSpeed,
        brightness: brightness
      };
      
      // 초기 위치 설정
      const x = Math.cos(orbitPhase) * orbitRadius;
      const z = Math.sin(orbitPhase) * orbitRadius;
      const y = Math.sin(orbitInclination) * orbitRadius * 0.1;
      
      star.position.set(x, y, z);
      stars.push(star);
      scene.add(star);
    }

    // 🔥 블랙홀 발광 효과
    const glowGeometry = new THREE.SphereGeometry(config.blackHoleRadius * 1.5, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // 카메라 위치 (옆에서 보는 각도)
    camera.position.set(100, 30, 150);
    camera.lookAt(0, 0, 0);

    // refs 저장
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    blackHoleRef.current = blackHole;
    accretionDiskRef.current = accretionDisks;
    photonRingRef.current = photonRing;
    starsRef.current = stars;

  }, [config]);

  // 🎮 애니메이션 루프
  const animate = useCallback(() => {
    if (!isActive || !sceneRef.current || !rendererRef.current || !cameraRef.current) {
      return;
    }

    const time = Date.now() * 0.001;
    
    // 클릭 시 회전 속도 증가
    if (isClickingRef.current) {
      rotationSpeedRef.current = Math.min(rotationSpeedRef.current + 0.1, 5);
    } else {
      rotationSpeedRef.current = Math.max(rotationSpeedRef.current - 0.05, 1);
    }

    // 🌀 강착원반 회전
    if (accretionDiskRef.current) {
      accretionDiskRef.current.forEach((disk, index) => {
        disk.rotation.z += disk.userData.rotationSpeed * rotationSpeedRef.current;
        
        // 회전 속도에 따른 밝기 변화
        const intensity = 1 + (rotationSpeedRef.current - 1) * 0.5;
        disk.material.opacity = disk.userData.originalOpacity * intensity;
      });
    }

    // 🌟 광환 효과
    if (photonRingRef.current) {
      photonRingRef.current.material.opacity = 0.6 + Math.sin(time * 2) * 0.2;
      photonRingRef.current.rotation.z += 0.005 * rotationSpeedRef.current;
    }

    // ✨ 별들의 궤도 운동
    starsRef.current.forEach(star => {
      const userData = star.userData;
      userData.orbitPhase += userData.orbitSpeed * rotationSpeedRef.current;
      
      // 타원 궤도 계산
      const x = Math.cos(userData.orbitPhase) * userData.orbitRadius;
      const z = Math.sin(userData.orbitPhase) * userData.orbitRadius;
      const y = Math.sin(userData.orbitInclination) * userData.orbitRadius * 0.1;
      
      star.position.set(x, y, z);
      
      // 거리에 따른 밝기 조절 (중력 렌즈 효과 시뮬레이션)
      const distanceToBlackHole = star.position.length();
      const lensing = Math.max(0.3, 1 - (config.photonRingRadius / distanceToBlackHole) * 0.5);
      star.material.opacity = userData.brightness * lensing;
      
      // 별 반짝임 효과
      star.material.opacity *= (0.8 + Math.sin(time * 5 + star.id) * 0.2);
    });

    // 🎥 카메라 움직임 (마우스 따라가기)
    if (cameraRef.current) {
      const targetX = 100 + mouseRef.current.x * 50;
      const targetY = 30 + mouseRef.current.y * 30;
      const targetZ = 150 + mouseRef.current.x * 20;
      
      cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.02;
      cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.02;
      cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.02;
      cameraRef.current.lookAt(0, 0, 0);
    }

    // 렌더링
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationIdRef.current = requestAnimationFrame(animate);
  }, [isActive, config.photonRingRadius]);

  // 🖱️ 마우스 이벤트
  const handleMouseMove = useCallback((event) => {
    const rect = mountRef.current?.getBoundingClientRect();
    if (!rect) return;

    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }, []);

  const handleMouseDown = useCallback(() => {
    isClickingRef.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    isClickingRef.current = false;
  }, []);

  // 📱 리사이즈
  const handleResize = useCallback(() => {
    if (!cameraRef.current || !rendererRef.current) return;

    cameraRef.current.aspect = window.innerWidth / window.innerHeight;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
  }, []);

  // 🎬 초기화
  useEffect(() => {
    const currentMount = mountRef.current;
    
    initScene();
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', handleResize);

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (currentMount && rendererRef.current?.domElement) {
        currentMount.removeChild(rendererRef.current.domElement);
      }
      
      // Three.js 객체 정리
      starsRef.current.forEach(star => {
        if (star.geometry) star.geometry.dispose();
        if (star.material) star.material.dispose();
      });
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [initScene, animate, handleMouseMove, handleMouseDown, handleMouseUp, handleResize]);

  return (
    <div className="blackhole-container gargantua">
      <div ref={mountRef} className="blackhole-mount" />
      <div className="blackhole-ui">
        <div className="blackhole-instructions gargantua-ui">
          <p>🌌 <strong>GARGANTUA</strong></p>
          <p>🖱️ 마우스를 눌러 시간을 가속하세요</p>
          <p>⭐ {config.starCount.toLocaleString()}개의 별이 궤도를 그립니다</p>
        </div>
      </div>
    </div>
  );
};

export default BlackHole;