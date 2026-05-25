'use client';

import React, { useEffect, useRef } from 'react';

// Standard Michael Jackson phrase collection
const PHRASES = ["u" ];

interface Joint {
  x: number;
  y: number;
}

interface Skeleton {
  head: Joint;
  hatBrimL: Joint;
  hatBrimR: Joint;
  hatCrownTopL: Joint;
  hatCrownTopR: Joint;
  neck: Joint;
  leftShoulder: Joint;
  rightShoulder: Joint;
  leftElbow: Joint;
  leftHand: Joint;
  rightElbow: Joint;
  rightHand: Joint;
  pelvis: Joint;
  leftHip: Joint;
  rightHip: Joint;
  leftKnee: Joint;
  leftFoot: Joint;
  rightKnee: Joint;
  rightFoot: Joint;
}

// Defining the 6 iconic poses
const POSES: Skeleton[] = [
  // Pose 0: Standing Cool / Signature Tilt (One hand on hat)
  {
    head: { x: 0, y: -60 },
    hatBrimL: { x: -16, y: -68 },
    hatBrimR: { x: 16, y: -68 },
    hatCrownTopL: { x: -10, y: -82 },
    hatCrownTopR: { x: 10, y: -82 },
    neck: { x: 0, y: -45 },
    leftShoulder: { x: -15, y: -40 },
    rightShoulder: { x: 15, y: -40 },
    leftElbow: { x: -25, y: -55 },
    leftHand: { x: -8, y: -65 }, // holding hat
    rightElbow: { x: 22, y: -20 },
    rightHand: { x: 28, y: 5 },
    pelvis: { x: 3, y: 10 },
    leftHip: { x: -7, y: 15 },
    rightHip: { x: 13, y: 13 },
    leftKnee: { x: -10, y: 48 },
    leftFoot: { x: -12, y: 80 },
    rightKnee: { x: 15, y: 45 },
    rightFoot: { x: 15, y: 80 }
  },
    
  // Pose 1: Crotch Grab (Iconic pelvic thrust)
  {
    head: { x: 5, y: -55 },
    hatBrimL: { x: -11, y: -63 },
    hatBrimR: { x: 21, y: -63 },
    hatCrownTopL: { x: -5, y: -77 },
    hatCrownTopR: { x: 15, y: -77 },
    neck: { x: 2, y: -40 },
    leftShoulder: { x: -13, y: -35 },
    rightShoulder: { x: 17, y: -35 },
    leftElbow: { x: -15, y: -55 },
    leftHand: { x: 2, y: -67 }, // holding hat
    rightElbow: { x: 8, y: -10 },
    rightHand: { x: 2, y: 10 }, // at crotch
    pelvis: { x: -5, y: 10 },
    leftHip: { x: -15, y: 15 },
    rightHip: { x: 5, y: 15 },
    leftKnee: { x: -25, y: 45 },
    leftFoot: { x: -20, y: 80 },
    rightKnee: { x: 8, y: 48 },
    rightFoot: { x: 10, y: 80 }
  },
  // Pose 2: The Toe Stand (High heels popped)
  {
    head: { x: 0, y: -75 },
    hatBrimL: { x: -16, y: -83 },
    hatBrimR: { x: 16, y: -83 },
    hatCrownTopL: { x: -10, y: -97 },
    hatCrownTopR: { x: 10, y: -97 },
    neck: { x: 0, y: -60 },
    leftShoulder: { x: -15, y: -55 },
    rightShoulder: { x: 15, y: -55 },
    leftElbow: { x: -25, y: -35 },
    leftHand: { x: -28, y: -15 }, // extended for balance
    rightElbow: { x: 25, y: -35 },
    rightHand: { x: 28, y: -15 }, // extended
    pelvis: { x: 0, y: -5 },
    leftHip: { x: -10, y: 0 },
    rightHip: { x: 10, y: 0 },
    leftKnee: { x: -20, y: 35 },
    leftFoot: { x: -10, y: 72 }, // toes popped up
    rightKnee: { x: 20, y: 35 },
    rightFoot: { x: 10, y: 72 }  // toes popped up
  },
  // Pose 3: The 45-Degree Lean (Gravity defying)
  {
    head: { x: 35, y: -40 },
    hatBrimL: { x: 19, y: -48 },
    hatBrimR: { x: 51, y: -48 },
    hatCrownTopL: { x: 25, y: -62 },
    hatCrownTopR: { x: 45, y: -62 },
    neck: { x: 30, y: -25 },
    leftShoulder: { x: 10, y: -20 },
    rightShoulder: { x: 40, y: -20 },
    leftElbow: { x: 10, y: 0 },
    leftHand: { x: 0, y: 20 },
    rightElbow: { x: 40, y: 0 },
    rightHand: { x: 30, y: 20 },
    pelvis: { x: 15, y: 20 },
    leftHip: { x: 5, y: 25 },
    rightHip: { x: 25, y: 25 },
    leftKnee: { x: 5, y: 55 },
    leftFoot: { x: 0, y: 80 },
    rightKnee: { x: 20, y: 55 },
    rightFoot: { x: 0, y: 80 }
  },
  // Pose 4: Moonwalk Slide 1 (Left foot sliding back)
  {
    head: { x: -5, y: -60 },
    hatBrimL: { x: -21, y: -68 },
    hatBrimR: { x: 11, y: -68 },
    hatCrownTopL: { x: -15, y: -82 },
    hatCrownTopR: { x: 5, y: -82 },
    neck: { x: -5, y: -45 },
    leftShoulder: { x: -20, y: -40 },
    rightShoulder: { x: 10, y: -40 },
    leftElbow: { x: -28, y: -20 },
    leftHand: { x: -32, y: 0 },
    rightElbow: { x: 18, y: -20 },
    rightHand: { x: 22, y: 0 },
    pelvis: { x: -5, y: 10 },
    leftHip: { x: -15, y: 15 },
    rightHip: { x: 5, y: 15 },
    leftKnee: { x: -10, y: 45 },
    leftFoot: { x: -25, y: 80 }, // slide back flat
    rightKnee: { x: 15, y: 40 },
    rightFoot: { x: 10, y: 80 }  // bent heel up
  },
  // Pose 5: Moonwalk Slide 2 (Right foot sliding back)
  {
    head: { x: -3, y: -60 },
    hatBrimL: { x: -19, y: -68 },
    hatBrimR: { x: 13, y: -68 },
    hatCrownTopL: { x: -13, y: -82 },
    hatCrownTopR: { x: 7, y: -82 },
    neck: { x: -3, y: -45 },
    leftShoulder: { x: -18, y: -40 },
    rightShoulder: { x: 12, y: -40 },
    leftElbow: { x: -26, y: -20 },
    leftHand: { x: -30, y: 0 },
    rightElbow: { x: 20, y: -20 },
    rightHand: { x: 24, y: 0 },
    pelvis: { x: -3, y: 10 },
    leftHip: { x: -13, y: 15 },
    rightHip: { x: 7, y: 15 },
    leftKnee: { x: -5, y: 40 },
    leftFoot: { x: -10, y: 80 }, // bent heel up
    rightKnee: { x: 0, y: 45 },
    rightFoot: { x: 25, y: 80 }  // slide back flat
  }
];

// Helper to linearly interpolate between two joints
const lerpJoint = (j1: Joint, j2: Joint, t: number): Joint => ({
  x: j1.x + (j2.x - j1.x) * t,
  y: j1.y + (j2.y - j1.y) * t
});

// Helper to LERP a whole skeleton
const lerpSkeleton = (s1: Skeleton, s2: Skeleton, t: number): Skeleton => ({
  head: lerpJoint(s1.head, s2.head, t),
  hatBrimL: lerpJoint(s1.hatBrimL, s2.hatBrimL, t),
  hatBrimR: lerpJoint(s1.hatBrimR, s2.hatBrimR, t),
  hatCrownTopL: lerpJoint(s1.hatCrownTopL, s2.hatCrownTopL, t),
  hatCrownTopR: lerpJoint(s1.hatCrownTopR, s2.hatCrownTopR, t),
  neck: lerpJoint(s1.neck, s2.neck, t),
  leftShoulder: lerpJoint(s1.leftShoulder, s2.leftShoulder, t),
  rightShoulder: lerpJoint(s1.rightShoulder, s2.rightShoulder, t),
  leftElbow: lerpJoint(s1.leftElbow, s2.leftElbow, t),
  leftHand: lerpJoint(s1.leftHand, s2.leftHand, t),
  rightElbow: lerpJoint(s1.rightElbow, s2.rightElbow, t),
  rightHand: lerpJoint(s1.rightHand, s2.rightHand, t),
  pelvis: lerpJoint(s1.pelvis, s2.pelvis, t),
  leftHip: lerpJoint(s1.leftHip, s2.leftHip, t),
  rightHip: lerpJoint(s1.rightHip, s2.rightHip, t),
  leftKnee: lerpJoint(s1.leftKnee, s2.leftKnee, t),
  leftFoot: lerpJoint(s1.leftFoot, s2.leftFoot, t),
  rightKnee: lerpJoint(s1.rightKnee, s2.rightKnee, t),
  rightFoot: lerpJoint(s1.rightFoot, s2.rightFoot, t)
});

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  
  // Skeleton placement properties
  boneKey: string;
  boneT: number; // position along the bone segment (0 to 1) or angle for head
  
  text: string;
  fontSize: number;
}

export default function Dance() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Setup dimensions
    const width = 240;
    const height = 300;
    canvas.width = width;
    canvas.height = height;

    // Mouse tracking
    const mouse = {
      x: 0,
      y: 0,
      active: false,
      radius: 50
    };

    // Physics parameters
    const springStrength = 0.05;
    const friction = 0.82;

    // Initialize skeleton segments / bones
    // We map particles to trace specific paths on the skeleton
    const boneDefinitions: { key: string; start: keyof Skeleton; end: keyof Skeleton; count: number }[] = [
      { key: 'hat_brim', start: 'hatBrimL', end: 'hatBrimR', count: 12 },
      { key: 'hat_crown_l', start: 'hatBrimL', end: 'hatCrownTopL', count: 4 },
      { key: 'hat_crown_r', start: 'hatBrimR', end: 'hatCrownTopR', count: 4 },
      { key: 'hat_crown_top', start: 'hatCrownTopL', end: 'hatCrownTopR', count: 6 },
      { key: 'spine', start: 'neck', end: 'pelvis', count: 10 },
      { key: 'shoulders', start: 'leftShoulder', end: 'rightShoulder', count: 5 },
      { key: 'hips', start: 'leftHip', end: 'rightHip', count: 4 },
      { key: 'l_arm_u', start: 'leftShoulder', end: 'leftElbow', count: 5 },
      { key: 'l_arm_l', start: 'leftElbow', end: 'leftHand', count: 5 },
      { key: 'r_arm_u', start: 'rightShoulder', end: 'rightElbow', count: 5 },
      { key: 'r_arm_l', start: 'rightElbow', end: 'rightHand', count: 5 },
      { key: 'l_leg_u', start: 'leftHip', end: 'leftKnee', count: 6 },
      { key: 'l_leg_l', start: 'leftKnee', end: 'leftFoot', count: 6 },
      { key: 'r_leg_u', start: 'rightHip', end: 'rightKnee', count: 6 },
      { key: 'r_leg_l', start: 'rightKnee', end: 'rightFoot', count: 6 },
    ];

    // Create particles mapping to bone positions
    let phraseIdx = 0;

    // 1. Add Head circle particles
    const headCount = 10;
    for (let i = 0; i < headCount; i++) {
      const angle = (i / headCount) * Math.PI * 2;
      particles.push({
        x: width / 2 + Math.cos(angle) * 80,
        y: height / 2 + Math.sin(angle) * 80,
        vx: 0,
        vy: 0,
        boneKey: 'head',
        boneT: angle,
        text: PHRASES[phraseIdx % PHRASES.length],
        fontSize: 7 + Math.random() * 2
      });
      phraseIdx++;
    }

    // 2. Add Bone segment particles
    boneDefinitions.forEach(def => {
      for (let i = 0; i < def.count; i++) {
        const boneT = i / Math.max(1, def.count - 1);
        particles.push({
          x: width / 2 + (Math.random() - 0.5) * 100,
          y: height / 2 + (Math.random() - 0.5) * 100,
          vx: 0,
          vy: 0,
          boneKey: def.key,
          boneT: boneT,
          text: PHRASES[phraseIdx % PHRASES.length],
          fontSize: 6 + Math.random() * 2
        });
        phraseIdx++;
      }
    });

    // Helper to generate a hybrid MJ pose by mixing and matching parts from random predefined poses
    const generateHybridSkeleton = (): Skeleton => {
      // 1. Pick a core pose for the entire torso/body frame (Head, Hat, Neck, Shoulders, Spine, Pelvis, Hips)
      // This guarantees that the core chest, shoulders, and spine are always perfectly aligned and in the same direction!
      const coreIdx = Math.floor(Math.random() * POSES.length);
      const corePose = POSES[coreIdx];

      // 2. Pick independent random poses for arms and legs
      const leftArmIdx = Math.floor(Math.random() * POSES.length);
      const rightArmIdx = Math.floor(Math.random() * POSES.length);
      const leftLegIdx = Math.floor(Math.random() * POSES.length);
      const rightLegIdx = Math.floor(Math.random() * POSES.length);

      const laPose = POSES[leftArmIdx];
      const raPose = POSES[rightArmIdx];
      const llPose = POSES[leftLegIdx];
      const rlPose = POSES[rightLegIdx];

      // 3. Mount Left Arm relatively onto corePose.leftShoulder, preserving correct length & angles
      const leftElbow = {
        x: corePose.leftShoulder.x + (laPose.leftElbow.x - laPose.leftShoulder.x),
        y: corePose.leftShoulder.y + (laPose.leftElbow.y - laPose.leftShoulder.y)
      };
      const leftHand = {
        x: leftElbow.x + (laPose.leftHand.x - laPose.leftElbow.x),
        y: leftElbow.y + (laPose.leftHand.y - laPose.leftElbow.y)
      };

      // 4. Mount Right Arm relatively onto corePose.rightShoulder, preserving correct length & angles
      const rightElbow = {
        x: corePose.rightShoulder.x + (raPose.rightElbow.x - raPose.rightShoulder.x),
        y: corePose.rightShoulder.y + (raPose.rightElbow.y - raPose.rightShoulder.y)
      };
      const rightHand = {
        x: rightElbow.x + (raPose.rightHand.x - raPose.rightElbow.x),
        y: rightElbow.y + (raPose.rightHand.y - raPose.rightElbow.y)
      };

      // 5. Mount Left Leg relatively onto corePose.leftHip, preserving correct length & angles
      const leftKnee = {
        x: corePose.leftHip.x + (llPose.leftKnee.x - llPose.leftHip.x),
        y: corePose.leftHip.y + (llPose.leftKnee.y - llPose.leftHip.y)
      };
      const leftFoot = {
        x: leftKnee.x + (llPose.leftFoot.x - llPose.leftKnee.x),
        y: leftKnee.y + (llPose.leftFoot.y - llPose.leftKnee.y)
      };

      // 6. Mount Right Leg relatively onto corePose.rightHip, preserving correct length & angles
      const rightKnee = {
        x: corePose.rightHip.x + (rlPose.rightKnee.x - rlPose.rightHip.x),
        y: corePose.rightHip.y + (rlPose.rightKnee.y - rlPose.rightHip.y)
      };
      const rightFoot = {
        x: rightKnee.x + (rlPose.rightFoot.x - rlPose.rightKnee.x),
        y: rightKnee.y + (rlPose.rightFoot.y - rlPose.rightKnee.y)
      };

      return {
        // Head, hat, spine, neck, shoulders, pelvis, and hips stay perfectly cohesive and proportional
        head: corePose.head,
        neck: corePose.neck,
        hatBrimL: corePose.hatBrimL,
        hatBrimR: corePose.hatBrimR,
        hatCrownTopL: corePose.hatCrownTopL,
        hatCrownTopR: corePose.hatCrownTopR,
        leftShoulder: corePose.leftShoulder,
        rightShoulder: corePose.rightShoulder,
        pelvis: corePose.pelvis,
        leftHip: corePose.leftHip,
        rightHip: corePose.rightHip,

        // Limb joints maintain perfect physical proportions relative to core socket connections
        leftElbow,
        leftHand,
        rightElbow,
        rightHand,
        leftKnee,
        leftFoot,
        rightKnee,
        rightFoot
      };
    };

    // Pose cycling state variables using Hybrid Pose Remixes
    let currentSkeletonState = generateHybridSkeleton();
    let targetSkeletonState = generateHybridSkeleton();
    let poseTransition = 0;
    const transitionSpeed = 0.055; // Drastically faster, high-energy transition speed (takes only ~18 frames!)
    let poseTimer = 0;
    const poseInterval = 24; // Extremely short pose interval (continuous, rapid dancing like a video!)

    // Floating/Bobbing animation variables
    let floatAngle = 0;

    // Joint keys for random offset generation (keeps a tiny secondary jitter to feel alive)
    const jointKeys: (keyof Skeleton)[] = [
      'head', 'hatBrimL', 'hatBrimR', 'hatCrownTopL', 'hatCrownTopR', 'neck',
      'leftShoulder', 'rightShoulder', 'leftElbow', 'leftHand',
      'rightElbow', 'rightHand', 'pelvis', 'leftHip', 'rightHip',
      'leftKnee', 'leftFoot', 'rightKnee', 'rightFoot'
    ];

    // Offsets for the current and target poses to interpolate smoothly
    let currentOffsets: Record<keyof Skeleton, Joint> = {} as any;
    let targetOffsets: Record<keyof Skeleton, Joint> = {} as any;

    const initOffsets = () => {
      jointKeys.forEach(key => {
        currentOffsets[key] = { x: 0, y: 0 };
        targetOffsets[key] = { x: 0, y: 0 };
      });
    };
    initOffsets();

    const generateRandomOffsets = () => {
      jointKeys.forEach(key => {
        let maxDev = 2; // Keep it very small now since the main variation is the joint remixing
        
        if (key === 'leftHand' || key === 'rightHand') {
          maxDev = 6;
        } else if (key === 'leftFoot' || key === 'rightFoot') {
          maxDev = 4;
        } else if (key === 'leftElbow' || key === 'rightElbow' || key === 'leftKnee' || key === 'rightKnee') {
          maxDev = 3;
        }
        
        targetOffsets[key] = {
          x: (Math.random() - 0.5) * maxDev,
          y: (Math.random() - 0.5) * maxDev
        };
      });
    };

    // Initialize first set of target offsets
    generateRandomOffsets();

    // Canvas event listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      // 1. Clear Canvas with Transparent Black
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.clearRect(0, 0, width, height);

      // 2. Advance LERP Pose States
      poseTimer++;
      if (poseTimer >= poseInterval) {
        poseTimer = 0;
        currentSkeletonState = targetSkeletonState;
        targetSkeletonState = generateHybridSkeleton();
        poseTransition = 0;
        
        // Target offsets shift to current, and we generate a fresh set
        currentOffsets = { ...targetOffsets };
        generateRandomOffsets();
      }

      if (poseTransition < 1.0) {
        poseTransition += transitionSpeed;
        if (poseTransition > 1.0) poseTransition = 1.0;
      }

      // Cosine ease-in-ease-out curve (smoothstep) that naturally scales from 0.0 to 1.0 and stays at 1.0
      // This completely eliminates any visual jumps or "state-by-state" snaps!
      const easeT = 0.5 - 0.5 * Math.cos(poseTransition * Math.PI);
      const currentSkeleton = lerpSkeleton(currentSkeletonState, targetSkeletonState, easeT);

      // Smoothly interpolate the random offsets along with the pose!
      const lerpedOffsets: Record<keyof Skeleton, Joint> = {} as any;
      jointKeys.forEach(key => {
        lerpedOffsets[key] = {
          x: currentOffsets[key].x + (targetOffsets[key].x - currentOffsets[key].x) * easeT,
          y: currentOffsets[key].y + (targetOffsets[key].y - currentOffsets[key].y) * easeT
        };
      });

      // Gentle floating motion (bobbing up/down & swaying side-to-side)
      floatAngle += 0.04;
      const bobY = Math.sin(floatAngle) * 8;
      const swayX = Math.cos(floatAngle * 0.5) * 5;

      // Base translation to center the dancer in the card
      const baseCX = width / 2 + swayX;
      const baseCY = height / 2 - 10 + bobY;

      // 3. Update particle targets and apply spring-mouse physics
      particles.forEach(p => {
        let targetX = baseCX;
        let targetY = baseCY;

        if (p.boneKey === 'head') {
          // Circle around head joint with smooth LERPed random offset
          const headJoint = currentSkeleton.head;
          const offset = lerpedOffsets.head;
          const radius = 9; // head size
          targetX += headJoint.x + offset.x + Math.cos(p.boneT) * radius;
          targetY += headJoint.y + offset.y + Math.sin(p.boneT) * radius;
        } else {
          // Find matching bone definition
          const def = boneDefinitions.find(d => d.key === p.boneKey);
          if (def) {
            const startJoint = currentSkeleton[def.start] as Joint;
            const endJoint = currentSkeleton[def.end] as Joint;
            
            const startOffset = lerpedOffsets[def.start];
            const endOffset = lerpedOffsets[def.end];

            // Interpolate position along this bone with smoothly blended random offsets
            const interpX = (startJoint.x + startOffset.x) + ((endJoint.x + endOffset.x) - (startJoint.x + startOffset.x)) * p.boneT;
            const interpY = (startJoint.y + startOffset.y) + ((endJoint.y + endOffset.y) - (startJoint.y + startOffset.y)) * p.boneT;

            targetX += interpX;
            targetY += interpY;
          }
        }

        // Kinetic physics
        const dxHome = targetX - p.x;
        const dyHome = targetY - p.y;
        
        p.vx += dxHome * springStrength;
        p.vy += dyHome * springStrength;

        // Mouse hover repelling scatter physics
        if (mouse.active) {
          const dxMouse = p.x - mouse.x;
          const dyMouse = p.y - mouse.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distMouse < mouse.radius) {
            const force = (mouse.radius - distMouse) / mouse.radius;
            const angle = Math.atan2(dyMouse, dxMouse);
            const push = force * 6.5;
            p.vx += Math.cos(angle) * push;
            p.vy += Math.sin(angle) * push;
          }
        }

        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx;
        p.y += p.vy;

        // Render particle
        ctx.save();
        ctx.font = `900 ${p.fontSize}px "Playwrite AT", -apple-system, sans-serif`;
        // White text with subtle glow for high-end look
        ctx.shadowColor = '#ffffff7f';
        ctx.shadowBlur = 3;
        ctx.fillStyle = '#ffffffd0';
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative w-[240px] h-[300px]  backdrop-blur-md rounded-2xl  h    transition-all duration-300 shadow-xl overflow-hidden cursor-pointer select-none">
      {/* Background neon visual flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32   rounded-full blur-[40px] pointer-events-none" />
      
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
      
      {/* Card Info Overlay */}
       
    </div>
  );
}
