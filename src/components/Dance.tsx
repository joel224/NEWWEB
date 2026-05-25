'use client';

import React, { useEffect, useRef } from 'react';

// Standard Michael Jackson phrase collection
const PHRASES = ["0"];

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
    {
        head: { x: -10, y: 55 },         // Head dropped low, touching or near the floor
        hatBrimL: { x: -26, y: 47 },     // (If wearing a cap/hat)
        hatBrimR: { x: 6, y: 47 },
        hatCrownTopL: { x: -20, y: 33 },
        hatCrownTopR: { x: 0, y: 33 },
        neck: { x: -5, y: 40 },
        leftShoulder: { x: -22, y: 30 }, // Torso low to the ground
        rightShoulder: { x: 12, y: 32 },
        leftElbow: { x: -30, y: 52 },   // Left arm bent hard under body supporting weight
        leftHand: { x: -25, y: 72 },    // Planted flat on the floor
        rightElbow: { x: 5, y: 55 },     // Right elbow stabbing into the hip for leverage
        rightHand: { x: 10, y: 72 },    // Planted flat on the floor
        pelvis: { x: 5, y: 20 },        // Hips elevated above the head line
        leftHip: { x: -5, y: 15 },
        rightHip: { x: 15, y: 15 },
        leftKnee: { x: -25, y: -5 },    // Left leg jackknifed up high into the air
        leftFoot: { x: -40, y: -20 },
        rightKnee: { x: 30, y: 5 },     // Right leg bent wide balancing out the weight
        rightFoot: { x: 45, y: -5 }
    },
    {
        head: { x: 0, y: -75 },          // Head perfectly level and isolated
        hatBrimL: { x: -16, y: -83 },
        hatBrimR: { x: 16, y: -83 },
        hatCrownTopL: { x: -10, y: -97 },
        hatCrownTopR: { x: 10, y: -97 },
        neck: { x: 0, y: -60 },
        leftShoulder: { x: -16, y: -55 },
        rightShoulder: { x: 16, y: -55 },
        leftElbow: { x: -35, y: -55 },  // Left arm raised straight out to the side
        leftHand: { x: -55, y: -55 },   // Forearm perfectly horizontal
        rightElbow: { x: 16, y: -30 },   // Right arm dropped straight down, then bent forward
        rightHand: { x: 36, y: -30 },   // Hand projecting forward at a sharp 90-degree angle
        pelvis: { x: -4, y: -5 },        // Hips locked stiff
        leftHip: { x: -12, y: 0 },
        rightHip: { x: 4, y: 0 },
        leftKnee: { x: -12, y: 36 },     // Legs completely locked out, mimicking joints
        leftFoot: { x: -12, y: 72 },
        rightKnee: { x: 4, y: 36 },
        rightFoot: { x: 4, y: 72 }
    },
    {
        head: { x: 0, y: -70 },          // Head framed like a picture
        hatBrimL: { x: -16, y: -78 },
        hatBrimR: { x: 16, y: -78 },
        hatCrownTopL: { x: -10, y: -92 },
        hatCrownTopR: { x: 10, y: -92 },
        neck: { x: 0, y: -55 },
        leftShoulder: { x: -18, y: -50 },
        rightShoulder: { x: 18, y: -50 },
        leftElbow: { x: -28, y: -90 },  // Left arm thrown over the crown of the head
        leftHand: { x: 5, y: -92 },     // Left hand resting over right ear
        rightElbow: { x: 22, y: -35 },   // Right arm tracking close to the face
        rightHand: { x: 0, y: -60 },     // Right hand framing just beneath the chin
        pelvis: { x: -10, y: -2 },       // Hips heavily thrown out to the left side
        leftHip: { x: -20, y: 4 },
        rightHip: { x: 0, y: 4 },
        leftKnee: { x: -28, y: 38 },     // Left leg tracking outward to balance hip pop
        leftFoot: { x: -35, y: 72 },
        rightKnee: { x: 10, y: 38 },     // Right leg tracking straight down inside line
        rightFoot: { x: 12, y: 72 }
    },
    {
        head: { x: -10, y: -78 },        // Head thrown back elegantly
        hatBrimL: { x: -26, y: -86 },
        hatBrimR: { x: 6, y: -86 },
        hatCrownTopL: { x: -20, y: -100 },
        hatCrownTopR: { x: 0, y: -100 },
        neck: { x: -5, y: -62 },
        leftShoulder: { x: -20, y: -55 },
        rightShoulder: { x: 12, y: -58 },// Chest lifted high and arched
        leftElbow: { x: -45, y: -65 },  // Left arm thrown fully wide and high
        leftHand: { x: -68, y: -75 },   // Hand splayed open ("Jazz Hand")
        rightElbow: { x: 35, y: -40 },   // Right arm extended down and back
        rightHand: { x: 58, y: -25 },   // Hand splayed open
        pelvis: { x: -5, y: -5 },        // Hips pulled tightly in
        leftHip: { x: -14, y: 0 },
        rightHip: { x: 4, y: 0 },
        leftKnee: { x: -2, y: 35 },      // Left leg crossing forward gracefully
        leftFoot: { x: 12, y: 72 },      // Tip of the toe pointing down flat
        rightKnee: { x: -12, y: 36 },     // Supporting back leg bent softly
        rightFoot: { x: -15, y: 72 }
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
    {
        head: { x: -5, y: -75 },         // Head slightly back, focused forward
        hatBrimL: { x: -21, y: -83 },
        hatBrimR: { x: 11, y: -83 },
        hatCrownTopL: { x: -15, y: -97 },
        hatCrownTopR: { x: 5, y: -97 },
        neck: { x: -3, y: -60 },
        leftShoulder: { x: -18, y: -55 },
        rightShoulder: { x: 12, y: -55 },
        leftElbow: { x: -30, y: -30 },  // Left arm swung slightly forward for balance
        leftHand: { x: -35, y: -10 },
        rightElbow: { x: 22, y: -35 },  // Right arm pulled tightly back
        rightHand: { x: 25, y: -15 },
        pelvis: { x: -5, y: -5 },        // Hips shifted slightly backward over the sliding leg
        leftHip: { x: -15, y: 0 },
        rightHip: { x: 5, y: 0 },
        leftKnee: { x: -22, y: 35 },     // Left leg locked completely straight (sliding flat)
        leftFoot: { x: -30, y: 72 },     // Planted completely flat on the floor
        rightKnee: { x: 15, y: 32 },     // Right knee pushed sharply forward
        rightFoot: { x: 8, y: 72 }       // Tiptoe/Heel popped high up (bearing the weight)
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
    {
        head: { x: 10, y: -73 },         // Head turned sharply right, chin down
        hatBrimL: { x: -2, y: -81 },
        hatBrimR: { x: 26, y: -79 },
        hatCrownTopL: { x: 2, y: -95 },
        hatCrownTopR: { x: 20, y: -94 },
        neck: { x: 5, y: -58 },
        leftShoulder: { x: -8, y: -53 }, // Compressed X-axis values due to side profile rotation
        rightShoulder: { x: 18, y: -55 },
        leftElbow: { x: 5, y: -38 },     // Arms folded tightly over chest cavity
        leftHand: { x: 15, y: -42 },     // Resting near opposite shoulder
        rightElbow: { x: -2, y: -40 },
        rightHand: { x: -10, y: -44 },
        pelvis: { x: 0, y: -3 },
        leftHip: { x: -8, y: 2 },
        rightHip: { x: 10, y: 2 },
        leftKnee: { x: -12, y: 36 },     // Legs kept close and straight
        leftFoot: { x: -14, y: 72 },     // Flat
        rightKnee: { x: 16, y: 38 },     // Right heel slightly lifted
        rightFoot: { x: 20, y: 72 }      // Pointed down slightly at the heel
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
    {
        head: { x: 0, y: -72 },          // Looking straight down at the floor
        hatBrimL: { x: -16, y: -80 },    // Brim perfectly leveled covering face
        hatBrimR: { x: 16, y: -80 },
        hatCrownTopL: { x: -10, y: -94 },
        hatCrownTopR: { x: 10, y: -94 },
        neck: { x: 0, y: -58 },
        leftShoulder: { x: -16, y: -54 },
        rightShoulder: { x: 16, y: -54 },
        leftElbow: { x: -22, y: -25 },   // Left arm pinned straight down side profile
        leftHand: { x: -24, y: 5 },
        rightElbow: { x: 12, y: -30 },   // Right arm bent inward sharply toward groin
        rightHand: { x: 0, y: -12 },     // Covering the belt center line
        pelvis: { x: 0, y: -4 },
        leftHip: { x: -8, y: 2 },        // Narrow, precise hip stance
        rightHip: { x: 8, y: 2 },
        leftKnee: { x: -8, y: 38 },      // Legs fully extended and locked parallel
        leftFoot: { x: -8, y: 72 },      // Glued flat to floor
        rightKnee: { x: 8, y: 38 },
        rightFoot: { x: 8, y: 72 }       // Glued flat to floor
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
    },
    {
        head: { x: -8, y: -45 },         // Entire body lowered drastically on Y-axis
        hatBrimL: { x: -24, y: -53 },
        hatBrimR: { x: 8, y: -53 },
        hatCrownTopL: { x: -18, y: -67 },
        hatCrownTopR: { x: 2, y: -67 },
        neck: { x: -6, y: -30 },
        leftShoulder: { x: -22, y: -25 },
        rightShoulder: { x: 10, y: -27 },
        leftElbow: { x: -40, y: -40 },  // Left arm flared wide in the air for style
        leftHand: { x: -55, y: -50 },
        rightElbow: { x: 25, y: -10 },   // Right arm reaching down out to balance floor
        rightHand: { x: 35, y: 15 },
        pelvis: { x: -5, y: 25 },        // Pelvis dropped heavily down toward floor
        leftHip: { x: -16, y: 30 },
        rightHip: { x: 6, y: 28 },
        leftKnee: { x: -42, y: 50 },     // Left leg extended far out to the side split
        leftFoot: { x: -65, y: 72 },     // Foot touching far left edge
        rightKnee: { x: -2, y: 68 },     // Right knee dropped down almost touching floor
        rightFoot: { x: 18, y: 72 }      // Foot tucked behind body tracking ground
    },
    {
        head: { x: -12, y: -76 },        // Head shifted back on X-axis, leaning away
        hatBrimL: { x: -28, y: -84 },
        hatBrimR: { x: 4, y: -84 },
        hatCrownTopL: { x: -22, y: -98 },
        hatCrownTopR: { x: -2, y: -98 },
        neck: { x: -8, y: -61 },
        leftShoulder: { x: -22, y: -54 },
        rightShoulder: { x: 8, y: -57 }, // Torso angled back
        leftElbow: { x: -30, y: -30 },   // Left arm loose near side body
        leftHand: { x: -32, y: -5 },
        rightElbow: { x: 30, y: -57 },   // Right arm raised straight forward
        rightHand: { x: 60, y: -57 },    // Pointing finger high and far right
        pelvis: { x: -2, y: -3 },        // Hips popped forward slightly
        leftHip: { x: -12, y: 3 },
        rightHip: { x: 8, y: 3 },
        leftKnee: { x: -18, y: 38 },     // Smooth, soft knee bend
        leftFoot: { x: -12, y: 72 },
        rightKnee: { x: 15, y: 36 },     // Right heel popped softly up
        rightFoot: { x: 22, y: 72 }
    },
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
            let headIdx = 0;
            let leftArmIdx = 0;
            let rightArmIdx = 0;
            let legsIdx = 0;

            let isValid = false;
            let attempts = 0;

            while (!isValid && attempts < 100) {
                attempts++;
                headIdx = Math.floor(Math.random() * POSES.length);
                leftArmIdx = Math.floor(Math.random() * POSES.length);
                rightArmIdx = Math.floor(Math.random() * POSES.length);
                legsIdx = Math.floor(Math.random() * POSES.length);

                const hPose = POSES[headIdx];
                const laPose = POSES[leftArmIdx];
                const raPose = POSES[rightArmIdx];
                const lPose = POSES[legsIdx];

                // 1. Torso/Spine Leaning Direction (neck relative to pelvis)
                const spineShift = hPose.neck.x - lPose.pelvis.x;

                // 2. Shoulders Leaning Direction (center of shoulders relative to pelvis)
                const shouldersCenter = (laPose.leftShoulder.x + raPose.rightShoulder.x) / 2;
                const shouldersShift = shouldersCenter - lPose.pelvis.x;

                // 3. Hands Leaning Direction (center of hands relative to pelvis)
                const handsCenter = (laPose.leftHand.x + raPose.rightHand.x) / 2;
                const handsShift = handsCenter - lPose.pelvis.x;

                // Classify shifts: -1 = Leaning Left, 1 = Leaning Right, 0 = Centered/Aligned
                const getShiftDirection = (val: number) => {
                    if (val > 3) return 1;
                    if (val < -3) return -1;
                    return 0;
                };

                const spineDir = getShiftDirection(spineShift);
                const shouldersDir = getShiftDirection(shouldersShift);
                const handsDir = getShiftDirection(handsShift);

                // Biomechanical Rule: The spine, shoulders, and hands must move/lean in the same general direction
                // If spine leans left (-1) but shoulders/hands shift right (1), or vice versa, this is visually misleading
                const hasShoulderConflict = (spineDir === 1 && shouldersDir === -1) || (spineDir === -1 && shouldersDir === 1);
                const hasHandsConflict = (spineDir === 1 && handsDir === -1) || (spineDir === -1 && handsDir === 1);

                if (!hasShoulderConflict && !hasHandsConflict) {
                    isValid = true;
                }
            }

            // Safeguard: if no valid combination is found, fallback to pure locked Pose 0
            if (!isValid) {
                headIdx = 0;
                leftArmIdx = 0;
                rightArmIdx = 0;
                legsIdx = 0;
            }

            const hPose = POSES[headIdx];
            const laPose = POSES[leftArmIdx];
            const raPose = POSES[rightArmIdx];
            const lPose = POSES[legsIdx];

            return {
                // Head & Fedora Hat Group
                head: hPose.head,
                neck: hPose.neck,
                hatBrimL: hPose.hatBrimL,
                hatBrimR: hPose.hatBrimR,
                hatCrownTopL: hPose.hatCrownTopL,
                hatCrownTopR: hPose.hatCrownTopR,

                // Left Arm Group
                leftShoulder: laPose.leftShoulder,
                leftElbow: laPose.leftElbow,
                leftHand: laPose.leftHand,

                // Right Arm Group
                rightShoulder: raPose.rightShoulder,
                rightElbow: raPose.rightElbow,
                rightHand: raPose.rightHand,

                // Legs & Pelvis Group
                pelvis: lPose.pelvis,
                leftHip: lPose.leftHip,
                rightHip: lPose.rightHip,
                leftKnee: lPose.leftKnee,
                leftFoot: lPose.leftFoot,
                rightKnee: lPose.rightKnee,
                rightFoot: lPose.rightFoot
            };
        };

        // Pose cycling state variables using Hybrid Pose Remixes
        let currentSkeletonState = generateHybridSkeleton();
        let targetSkeletonState = generateHybridSkeleton();
        let poseTransition = 0;
        const transitionSpeed = 0.035; // speed of transitioning to next pose
        let poseTimer = 0;
        const poseInterval = 12; // hold pose for 90 frames (~1.5 seconds)

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
                    maxDev = 3;
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

            // Smooth easing for transition
            const easeT = Math.sin(poseTransition * Math.PI * 1);
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
        <div className="relative w-[10px] h-[10px]  backdrop-blur-md rounded-2xl  h    transition-all duration-300 shadow-xl overflow-hidden cursor-pointer select-none">
            {/* Background neon visual flare */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32   rounded-full blur-[40px] pointer-events-none" />

            <canvas
                ref={canvasRef}
                className="w-1/2 h-1/2 block"
            />

            {/* Card Info Overlay */}

        </div>
    );
}
