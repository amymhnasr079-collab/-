/**
 * 3D Interactive Athletics Video & Simulation Component
 * Powered by Three.js
 * Implements full 3D athletic field, runway (4m x 30m), arc (8m radius, 7cm board),
 * throwing sector (29 degrees), flags (60cm height, 18x10cm), animated figures
 * (Teacher, Thrower, Judge with White/Red flags, Measuring official, Scorekeeper),
 * realistic projectile flight physics, measuring tape from landing mark to inner arc,
 * and 6 authentic textbook scenarios with full video playback controls.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Play, Pause, RotateCcw, Eye, Flag, 
  Ruler, AlertTriangle, CheckCircle2, XCircle, Volume2, VolumeX,
  Compass, Maximize2, ShieldCheck
} from 'lucide-react';
import { toArabicNumerals } from '../utils/arabicNumerals';
import { sound } from '../utils/soundEffects';

export type SimulationScenario = 
  | 'valid_throw'
  | 'foul_line'
  | 'foul_sector'
  | 'foul_flat'
  | 'foul_early_exit'
  | 'field_specs';

interface Props {
  initialScenario?: SimulationScenario;
  onScenarioChange?: (scenario: SimulationScenario) => void;
}

export const Interactive3DVideo: React.FC<Props> = ({ 
  initialScenario = 'valid_throw',
  onScenarioChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scenario, setScenario] = useState<SimulationScenario>(initialScenario);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [cameraMode, setCameraMode] = useState<'side' | 'arc' | 'top' | 'landing' | 'orbit'>('side');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showMeasurements, setShowMeasurements] = useState<boolean>(true);

  // Status readout during playback
  const [currentStepText, setCurrentStepText] = useState<string>('استعداد المتسابق للجري في طريق الاقتراب (عرض ٤ أمتار)');
  const [judgmentStatus, setJudgmentStatus] = useState<'pending' | 'valid' | 'foul'>('pending');
  const [measuredDistance, setMeasuredDistance] = useState<number | null>(null);

  // Three.js instances ref
  const threeRefs = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    throwerGroup: THREE.Group;
    throwerRightArm: THREE.Group;
    throwerLeftArm: THREE.Group;
    throwerTorso: THREE.Mesh;
    javelin: THREE.Group;
    judgeGroup: THREE.Group;
    whiteFlagGroup: THREE.Group;
    redFlagGroup: THREE.Group;
    measurementOfficerGroup: THREE.Group;
    tapeMeasureLine: THREE.Line;
    tapeMeasureGeo: THREE.BufferGeometry;
    teacherGroup: THREE.Group;
    scorekeeperGroup: THREE.Group;
    specsOverlayGroup: THREE.Group;
    orbitControls?: { isDragging: boolean; prevX: number; prevY: number; theta: number; phi: number; radius: number };
    animTime: number;
    requestID?: number;
  } | null>(null);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 500;

    // 1. Scene & Background (Bright cartoon sunny day)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7dd3fc); // Bright cheerful cartoon sky blue
    scene.fog = new THREE.FogExp2(0xbae6fd, 0.004);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 300);
    camera.position.set(-18, 9, 20);
    camera.lookAt(0, 1.5, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting (Sunny vibrant daytime)
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0xbbf7d0, 0.9);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.6);
    dirLight.position.set(-30, 45, 25);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 150;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // 5. Grounds & Field Geometry (Bright cartoon turf & tartan)
    // Main Turf (Grass)
    const turfGeo = new THREE.PlaneGeometry(160, 120);
    const turfMat = new THREE.MeshStandardMaterial({ 
      color: 0x22c55e, // Bright cartoon grass green
      roughness: 0.85, 
      metalness: 0.05 
    });
    const turf = new THREE.Mesh(turfGeo, turfMat);
    turf.rotation.x = -Math.PI / 2;
    turf.receiveShadow = true;
    scene.add(turf);

    // Athletics Running Track (Red Tartan) surrounding the stadium
    const trackGeo = new THREE.RingGeometry(48, 62, 64);
    const trackMat = new THREE.MeshStandardMaterial({ 
      color: 0xef4444, // Bright cartoon red
      roughness: 0.9 
    });
    const trackRing = new THREE.Mesh(trackGeo, trackMat);
    trackRing.rotation.x = -Math.PI / 2;
    trackRing.position.set(-15, 0.01, 0);
    trackRing.receiveShadow = true;
    scene.add(trackRing);

    // Javelin Runway (طريق الاقتراب):
    // Width = 4m, Length = 30m.
    const runwayGeo = new THREE.PlaneGeometry(30, 4);
    const runwayMat = new THREE.MeshStandardMaterial({ 
      color: 0xdc2626, // Bright red
      roughness: 0.7 
    });
    const runway = new THREE.Mesh(runwayGeo, runwayMat);
    runway.rotation.x = -Math.PI / 2;
    runway.position.set(-15, 0.02, 0);
    runway.receiveShadow = true;
    scene.add(runway);

    // Runway white border lines (5 cm width)
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lineTopGeo = new THREE.PlaneGeometry(30, 0.05);
    const lineTop = new THREE.Mesh(lineTopGeo, lineMat);
    lineTop.rotation.x = -Math.PI / 2;
    lineTop.position.set(-15, 0.03, -2);
    scene.add(lineTop);

    const lineBottom = new THREE.Mesh(lineTopGeo, lineMat);
    lineBottom.rotation.x = -Math.PI / 2;
    lineBottom.position.set(-15, 0.03, 2);
    scene.add(lineBottom);

    // Throwing Arc (قوس الرمي):
    // Radius R = 8 meters. Center is at (-8, 0, 0).
    // Arc extends across the 4m runway opening and has 75cm side wing extensions.
    // Width of arc board = 7 cm (0.07 m), painted white, flush with ground.
    const arcRadius = 8.0;
    const arcCenter = new THREE.Vector3(-8, 0, 0);
    
    // Half angle subtended by 4m width: sin(theta) = 2 / 8 = 0.25 -> theta ≈ 14.5 degrees
    // Plus 0.75m extensions on each side -> total arc span about 35 degrees (-17.5° to +17.5°)
    const arcCurve = new THREE.EllipseCurve(
      -8, 0,
      arcRadius, arcRadius,
      -0.34, 0.34,
      false, 0
    );
    const arcPoints = arcCurve.getPoints(50);
    const arcLineGeo = new THREE.BufferGeometry().setFromPoints(
      arcPoints.map(p => new THREE.Vector3(p.x, 0.035, p.y))
    );
    const arcLineMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 5 });
    const arcLine = new THREE.Line(arcLineGeo, arcLineMat);
    scene.add(arcLine);

    // Physical 3D wooden/metal board for the arc (7cm wide, 0.07m)
    const arcBoardShape = new THREE.Shape();
    // Generate curved ribbon geometry
    const innerPoints: THREE.Vector3[] = [];
    const outerPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 40; i++) {
      const angle = -0.34 + (i / 40) * 0.68;
      const xIn = -8 + (arcRadius - 0.035) * Math.cos(angle);
      const zIn = (arcRadius - 0.035) * Math.sin(angle);
      const xOut = -8 + (arcRadius + 0.035) * Math.cos(angle);
      const zOut = (arcRadius + 0.035) * Math.sin(angle);
      innerPoints.push(new THREE.Vector3(xIn, 0.03, zIn));
      outerPoints.push(new THREE.Vector3(xOut, 0.03, zOut));
    }
    const arcRibbonGeo = new THREE.BufferGeometry();
    const ribbonVerts: number[] = [];
    for (let i = 0; i < innerPoints.length - 1; i++) {
      const p1 = innerPoints[i];
      const p2 = outerPoints[i];
      const p3 = innerPoints[i + 1];
      const p4 = outerPoints[i + 1];
      ribbonVerts.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z);
      ribbonVerts.push(p3.x, p3.y, p3.z, p2.x, p2.y, p2.z, p4.x, p4.y, p4.z);
    }
    arcRibbonGeo.setAttribute('position', new THREE.Float32BufferAttribute(ribbonVerts, 3));
    arcRibbonGeo.computeVertexNormals();
    const arcMesh = new THREE.Mesh(arcRibbonGeo, new THREE.MeshStandardMaterial({ 
      color: 0xffffff, 
      roughness: 0.4 
    }));
    scene.add(arcMesh);

    // 75 cm side lines at the arc ends
    const sideLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(outerPoints[0].x, 0.035, outerPoints[0].z),
      new THREE.Vector3(outerPoints[0].x - 0.75, 0.035, outerPoints[0].z - 0.2)
    ]);
    const sideLine1 = new THREE.Line(sideLineGeo, arcLineMat);
    scene.add(sideLine1);

    const sideLineGeo2 = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(outerPoints[outerPoints.length - 1].x, 0.035, outerPoints[outerPoints.length - 1].z),
      new THREE.Vector3(outerPoints[outerPoints.length - 1].x - 0.75, 0.035, outerPoints[outerPoints.length - 1].z + 0.2)
    ]);
    const sideLine2 = new THREE.Line(sideLineGeo2, arcLineMat);
    scene.add(sideLine2);

    // Throwing Sector (مقطع الرمي):
    // Angle = 29 degrees = 0.506 rad.
    // Lines radiate from the circle center (-8, 0, 0) through the extremities of the arc.
    // Half angle = 14.5 degrees = 0.253 rad.
    const sectorLength = 80; // 80 meters landing field
    const halfSectorAngle = (29 / 2) * (Math.PI / 180); // 14.5 deg

    // Sector Left Boundary Line
    const sectorLeftEnd = new THREE.Vector3(
      -8 + (arcRadius + sectorLength) * Math.cos(halfSectorAngle),
      0.025,
      (arcRadius + sectorLength) * Math.sin(halfSectorAngle)
    );
    const sectorLeftStart = new THREE.Vector3(
      -8 + arcRadius * Math.cos(halfSectorAngle),
      0.025,
      arcRadius * Math.sin(halfSectorAngle)
    );
    const leftLineGeo = new THREE.BufferGeometry().setFromPoints([sectorLeftStart, sectorLeftEnd]);
    const sectorLineMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 3 });
    const sectorLeftLine = new THREE.Line(leftLineGeo, sectorLineMat);
    scene.add(sectorLeftLine);

    // Sector Right Boundary Line
    const sectorRightEnd = new THREE.Vector3(
      -8 + (arcRadius + sectorLength) * Math.cos(-halfSectorAngle),
      0.025,
      (arcRadius + sectorLength) * Math.sin(-halfSectorAngle)
    );
    const sectorRightStart = new THREE.Vector3(
      -8 + arcRadius * Math.cos(-halfSectorAngle),
      0.025,
      arcRadius * Math.sin(-halfSectorAngle)
    );
    const rightLineGeo = new THREE.BufferGeometry().setFromPoints([sectorRightStart, sectorRightEnd]);
    const sectorRightLine = new THREE.Line(rightLineGeo, sectorLineMat);
    scene.add(sectorRightLine);

    // Distance Curved Arcs on the grass (e.g. 20m, 30m, 40m, 50m, 60m from arc)
    const distanceMarkers = [20, 30, 40, 50, 60];
    distanceMarkers.forEach((dist) => {
      const r = arcRadius + dist;
      const arcPts: THREE.Vector3[] = [];
      for (let step = -15; step <= 15; step++) {
        const a = (step / 15) * halfSectorAngle;
        arcPts.push(new THREE.Vector3(-8 + r * Math.cos(a), 0.026, r * Math.sin(a)));
      }
      const distArcGeo = new THREE.BufferGeometry().setFromPoints(arcPts);
      const distArcLine = new THREE.Line(
        distArcGeo, 
        new THREE.LineDashedMaterial({ color: 0xe2e8f0, dashSize: 1, gapSize: 0.5 })
      );
      distArcLine.computeLineDistances();
      scene.add(distArcLine);
    });

    // Boundary Flags (رايات تحديد قطاع الرمي):
    // Height: 60 cm (0.6m) above ground. Dimensions: 18 cm x 10 cm (0.18m x 0.1m).
    const createFlag = (pos: THREE.Vector3, colorHex: number = 0xef4444) => {
      const flagGroup = new THREE.Group();
      // Pole: height 0.6m
      const poleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.6);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.6 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.y = 0.3;
      pole.castShadow = true;
      flagGroup.add(pole);

      // Flag Cloth: 0.18m x 0.10m
      const clothGeo = new THREE.PlaneGeometry(0.18, 0.10);
      const clothMat = new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide });
      const cloth = new THREE.Mesh(clothGeo, clothMat);
      cloth.position.set(0.09, 0.54, 0);
      cloth.rotation.y = Math.PI / 4;
      flagGroup.add(cloth);

      flagGroup.position.copy(pos);
      return flagGroup;
    };

    // Place boundary flags at sector edges
    scene.add(createFlag(sectorLeftStart));
    scene.add(createFlag(sectorRightStart));
    scene.add(createFlag(new THREE.Vector3(-8 + (arcRadius + 30) * Math.cos(halfSectorAngle), 0, (arcRadius + 30) * Math.sin(halfSectorAngle))));
    scene.add(createFlag(new THREE.Vector3(-8 + (arcRadius + 30) * Math.cos(-halfSectorAngle), 0, (arcRadius + 30) * Math.sin(-halfSectorAngle))));
    scene.add(createFlag(new THREE.Vector3(-8 + (arcRadius + 60) * Math.cos(halfSectorAngle), 0, (arcRadius + 60) * Math.sin(halfSectorAngle))));
    scene.add(createFlag(new THREE.Vector3(-8 + (arcRadius + 60) * Math.cos(-halfSectorAngle), 0, (arcRadius + 60) * Math.sin(-halfSectorAngle))));

    // 6. 3D Model: The Javelin (الرمح)
    // Tapered shaft, sharp metal tip, cord grip wrapped around center of gravity
    const javelin = new THREE.Group();
    // Metal Tip (سن الرمح المدبب)
    const tipGeo = new THREE.ConeGeometry(0.02, 0.35, 16);
    const tipMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.95, roughness: 0.2 });
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.rotation.z = -Math.PI / 2;
    tip.position.x = 1.3;
    tip.castShadow = true;
    javelin.add(tip);

    // Front Shaft
    const frontShaftGeo = new THREE.CylinderGeometry(0.015, 0.018, 1.1, 16);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.3 });
    const frontShaft = new THREE.Mesh(frontShaftGeo, shaftMat);
    frontShaft.rotation.z = Math.PI / 2;
    frontShaft.position.x = 0.65;
    frontShaft.castShadow = true;
    javelin.add(frontShaft);

    // Cord Grip (القبضة حول مركز الثقل - ١٦ سم حبل ملفوف)
    const gripGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.22, 16);
    const gripMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.9 });
    const grip = new THREE.Mesh(gripGeo, gripMat);
    grip.rotation.z = Math.PI / 2;
    grip.position.x = 0.0;
    grip.castShadow = true;
    javelin.add(grip);

    // Rear Shaft
    const rearShaftGeo = new THREE.CylinderGeometry(0.018, 0.012, 1.3, 16);
    const rearShaft = new THREE.Mesh(rearShaftGeo, shaftMat);
    rearShaft.rotation.z = Math.PI / 2;
    rearShaft.position.x = -0.75;
    rearShaft.castShadow = true;
    javelin.add(rearShaft);

    javelin.position.set(-10, 1.6, 0);
    scene.add(javelin);

    // 7. Human Figures (Stylized Athletic Characters)
    const createCharacter = (shirtColor: number, pantsColor: number, isTeacher: boolean = false) => {
      const charGroup = new THREE.Group();

      // Head
      const headGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const skinMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 });
      const head = new THREE.Mesh(headGeo, skinMat);
      head.position.y = 1.68;
      head.castShadow = true;
      charGroup.add(head);

      // Torso / Shirt
      const torsoGeo = new THREE.CylinderGeometry(0.22, 0.20, 0.65, 16);
      const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.7 });
      const torso = new THREE.Mesh(torsoGeo, shirtMat);
      torso.position.y = 1.25;
      torso.castShadow = true;
      charGroup.add(torso);

      // Legs / Pants
      const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.8 });
      const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.85, 12);
      const leftLeg = new THREE.Mesh(legGeo, pantsMat);
      leftLeg.position.set(-0.1, 0.45, 0);
      leftLeg.castShadow = true;
      charGroup.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeo, pantsMat);
      rightLeg.position.set(0.1, 0.45, 0);
      rightLeg.castShadow = true;
      charGroup.add(rightLeg);

      // Arms (for throwing & flag raising)
      const armGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.6, 12);
      const rightArmGroup = new THREE.Group();
      const rightArm = new THREE.Mesh(armGeo, shirtMat);
      rightArm.position.y = -0.28;
      rightArm.castShadow = true;
      rightArmGroup.add(rightArm);
      rightArmGroup.position.set(0.26, 1.48, 0);
      charGroup.add(rightArmGroup);

      const leftArmGroup = new THREE.Group();
      const leftArm = new THREE.Mesh(armGeo, shirtMat);
      leftArm.position.y = -0.28;
      leftArm.castShadow = true;
      leftArmGroup.add(leftArm);
      leftArmGroup.position.set(-0.26, 1.48, 0);
      charGroup.add(leftArmGroup);

      return { charGroup, rightArmGroup, leftArmGroup, torso };
    };

    // A. Thrower Student (متسابق بزي مدرسي رياضي محتشم)
    const thrower = createCharacter(0x0284c7, 0x1e293b); // Cyan jersey, slate pants
    const throwerGroup = thrower.charGroup;
    throwerGroup.position.set(-16, 0, 0);
    throwerGroup.rotation.y = Math.PI / 2; // facing forward down runway
    scene.add(throwerGroup);

    // B. Physical Education Teacher (معلم التربية الرياضية المشرف)
    const teacher = createCharacter(0x059669, 0x0f172a, true); // Emerald tracksuit
    const teacherGroup = teacher.charGroup;
    teacherGroup.position.set(-3.5, 0, 3.2); // standing safely beside the arc
    teacherGroup.rotation.y = -Math.PI / 4;
    scene.add(teacherGroup);

    // Teacher Clipboard
    const clipGeo = new THREE.BoxGeometry(0.2, 0.3, 0.02);
    const clipMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const clipboard = new THREE.Mesh(clipGeo, clipMat);
    clipboard.position.set(0.15, 1.25, 0.25);
    teacherGroup.add(clipboard);

    // C. Judge with White & Red Flags (الحكم العام عند قوس الرمي)
    const judge = createCharacter(0x334155, 0x1e293b); // Dark slate official kit
    const judgeGroup = judge.charGroup;
    judgeGroup.position.set(-0.5, 0, -3.2); // seated / standing beside the arc boundary
    judgeGroup.rotation.y = Math.PI / 3;
    scene.add(judgeGroup);

    // White Flag in Judge's Hand
    const whiteFlagGroup = new THREE.Group();
    const flagPoleGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.7);
    const flagPoleMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8 });
    const whitePole = new THREE.Mesh(flagPoleGeo, flagPoleMat);
    whitePole.position.y = 0.35;
    whiteFlagGroup.add(whitePole);
    const whiteCloth = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.2), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    whiteCloth.position.set(0.15, 0.55, 0);
    whiteFlagGroup.add(whiteCloth);
    whiteFlagGroup.position.set(0.28, 1.4, 0);
    whiteFlagGroup.visible = false;
    judgeGroup.add(whiteFlagGroup);

    // Red Flag in Judge's Hand
    const redFlagGroup = new THREE.Group();
    const redPole = new THREE.Mesh(flagPoleGeo, flagPoleMat);
    redPole.position.y = 0.35;
    redFlagGroup.add(redPole);
    const redCloth = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.2), new THREE.MeshBasicMaterial({ color: 0xdc2626, side: THREE.DoubleSide }));
    redCloth.position.set(0.15, 0.55, 0);
    redFlagGroup.add(redCloth);
    redFlagGroup.position.set(-0.28, 1.4, 0);
    redFlagGroup.visible = false;
    judgeGroup.add(redFlagGroup);

    // D. Measurement Official in Field (مسؤول القياس)
    const measurementOfficer = createCharacter(0xd97706, 0x1e293b); // Amber vest
    const measurementOfficerGroup = measurementOfficer.charGroup;
    measurementOfficerGroup.position.set(28, 0, 1.5);
    measurementOfficerGroup.visible = false;
    scene.add(measurementOfficerGroup);

    // E. Measuring Tape Line (شريط القياس المتري)
    // From javelin landing mark to the inner edge of the arc, aimed at the circle center (-8,0,0)
    const tapeMeasureGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(28, 0.05, 0),
      new THREE.Vector3(0, 0.05, 0)
    ]);
    const tapeMeasureMat = new THREE.LineBasicMaterial({ 
      color: 0xfacc15, 
      linewidth: 4 
    });
    const tapeMeasureLine = new THREE.Line(tapeMeasureGeo, tapeMeasureMat);
    tapeMeasureLine.visible = false;
    scene.add(tapeMeasureLine);

    // F. Scorekeeper Student (مسؤول تسجيل النتائج) at desk
    const scorekeeper = createCharacter(0x0f766e, 0x1e293b);
    const scorekeeperGroup = scorekeeper.charGroup;
    scorekeeperGroup.position.set(-5, 0, -4.5);
    scorekeeperGroup.rotation.y = Math.PI / 4;
    scene.add(scorekeeperGroup);

    // Official scoring desk
    const deskGeo = new THREE.BoxGeometry(1.2, 0.8, 0.6);
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(-5, 0.4, -3.8);
    scene.add(desk);

    // G. Safety Observers (طلاب ينتظرون خلف حاجز الأمان)
    for (let i = 0; i < 3; i++) {
      const observer = createCharacter(0x475569, 0x1e293b);
      observer.charGroup.position.set(-20 - i * 1.5, 0, 3.5 + (i % 2) * 0.6);
      observer.charGroup.rotation.y = -Math.PI / 3;
      scene.add(observer.charGroup);
    }

    // Safety Ribbon Barrier (شريط الأمان الأصفر التحذيري)
    const barrierPts = [
      new THREE.Vector3(-32, 0.9, 3.2),
      new THREE.Vector3(-18, 0.9, 3.2),
      new THREE.Vector3(-10, 0.9, 4.0)
    ];
    const barrierGeo = new THREE.BufferGeometry().setFromPoints(barrierPts);
    const barrierLine = new THREE.Line(barrierGeo, new THREE.LineDashedMaterial({ color: 0xfacc15, dashSize: 0.5, gapSize: 0.2 }));
    barrierLine.computeLineDistances();
    scene.add(barrierLine);

    // H. Visual Field Dimensions Overlay Group
    const specsOverlayGroup = new THREE.Group();
    // Runway dimension indicator: 4m wide
    const widthLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-10, 0.1, -2),
      new THREE.Vector3(-10, 0.1, 2)
    ]);
    const widthLine = new THREE.Line(widthLineGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8 }));
    specsOverlayGroup.add(widthLine);

    // Arc radius line: 8m from center (-8,0,0) to arc (0,0,0)
    const radiusLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-8, 0.1, 0),
      new THREE.Vector3(0, 0.1, 0)
    ]);
    const radiusLine = new THREE.Line(radiusLineGeo, new THREE.LineDashedMaterial({ color: 0xa855f7, dashSize: 0.8, gapSize: 0.4 }));
    radiusLine.computeLineDistances();
    specsOverlayGroup.add(radiusLine);

    specsOverlayGroup.visible = false;
    scene.add(specsOverlayGroup);

    // Save refs
    threeRefs.current = {
      scene,
      camera,
      renderer,
      throwerGroup,
      throwerRightArm: thrower.rightArmGroup,
      throwerLeftArm: thrower.leftArmGroup,
      throwerTorso: thrower.torso,
      javelin,
      judgeGroup,
      whiteFlagGroup,
      redFlagGroup,
      measurementOfficerGroup,
      tapeMeasureLine,
      tapeMeasureGeo,
      teacherGroup,
      scorekeeperGroup,
      specsOverlayGroup,
      orbitControls: { isDragging: false, prevX: 0, prevY: 0, theta: 0.8, phi: 0.5, radius: 28 },
      animTime: 0
    };

    // Mouse drag controls for interactive camera rotation
    const onMouseDown = (e: MouseEvent) => {
      if (!threeRefs.current?.orbitControls) return;
      threeRefs.current.orbitControls.isDragging = true;
      threeRefs.current.orbitControls.prevX = e.clientX;
      threeRefs.current.orbitControls.prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!threeRefs.current?.orbitControls || !threeRefs.current.orbitControls.isDragging) return;
      const oc = threeRefs.current.orbitControls;
      const dx = e.clientX - oc.prevX;
      const dy = e.clientY - oc.prevY;
      oc.prevX = e.clientX;
      oc.prevY = e.clientY;

      oc.theta -= dx * 0.008;
      oc.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, oc.phi + dy * 0.008));
    };

    const onMouseUp = () => {
      if (threeRefs.current?.orbitControls) {
        threeRefs.current.orbitControls.isDragging = false;
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize handling
    const onResize = () => {
      if (!containerRef.current || !threeRefs.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 500;
      threeRefs.current.camera.aspect = w / h;
      threeRefs.current.camera.updateProjectionMatrix();
      threeRefs.current.renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      if (threeRefs.current?.requestID) {
        cancelAnimationFrame(threeRefs.current.requestID);
      }
      renderer.dispose();
    };
  }, []);

  // Update simulation loop & animation keyframes based on current scenario
  useEffect(() => {
    let animId: number;
    let localTime = 0;
    const duration = 9.0; // 9 seconds animation loop per scenario

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!threeRefs.current) return;
      const {
        camera, renderer, scene, throwerGroup, throwerRightArm, javelin,
        whiteFlagGroup, redFlagGroup, measurementOfficerGroup, tapeMeasureLine,
        tapeMeasureGeo, specsOverlayGroup, orbitControls
      } = threeRefs.current;

      // Increment animation time if playing
      if (isPlaying) {
        localTime += (0.016 * playbackSpeed);
        if (localTime >= duration) {
          localTime = 0; // loop
        }
        setPlaybackProgress(localTime / duration);
      }

      const t = localTime;

      // Default resets each tick
      whiteFlagGroup.visible = false;
      redFlagGroup.visible = false;
      measurementOfficerGroup.visible = false;
      tapeMeasureLine.visible = false;
      specsOverlayGroup.visible = scenario === 'field_specs';

      // ==========================================
      // Scenario Logic & Animation Sequences
      // ==========================================
      if (scenario === 'valid_throw') {
        // Phase 1: Approach Run (t: 0 to 2.5s)
        if (t < 2.5) {
          const runProg = t / 2.5;
          const posX = -16 + runProg * 14; // from -16 to -2
          throwerGroup.position.set(posX, 0, 0);
          throwerGroup.rotation.y = Math.PI / 2;
          // Running arm swing
          throwerRightArm.rotation.x = Math.sin(t * 12) * 0.4;
          // Javelin carried high near ear
          javelin.position.set(posX + 0.3, 1.8, 0.2);
          javelin.rotation.set(0, 0, 0.25);
          javelin.visible = true;

          setCurrentStepText('الجري في طريق الاقتراب (٤ م) وحمل الرمح للأمام بجانب الرأس');
          setJudgmentStatus('pending');
          setMeasuredDistance(null);
        }
        // Phase 2: Release at Arc (t: 2.5 to 3.0s)
        else if (t < 3.0) {
          throwerGroup.position.set(-1.8, 0, 0);
          throwerRightArm.rotation.x = -1.2; // arm thrown forward
          javelin.position.set(-0.5, 2.1, 0);
          javelin.rotation.set(0, 0, 0.58); // 33 degrees launch angle
          setCurrentStepText('التخلص من الرمح بقوة من خلف قوس الرمي دون لمس الخط الأبيض');
        }
        // Phase 3: Flight in Air (t: 3.0 to 5.2s)
        else if (t < 5.2) {
          const flightT = (t - 3.0) / 2.2; // 0 to 1
          const startX = -0.5, targetX = 28.5;
          const currentX = startX + flightT * (targetX - startX);
          // Parabolic arc: y = peak * 4 * f * (1-f)
          const currentY = 2.1 + 8.5 * Math.sin(flightT * Math.PI);
          // Slight natural rotation
          const pitch = 0.55 - flightT * 1.1; // nose tips down as it falls
          javelin.position.set(currentX, Math.max(0.2, currentY), 0);
          javelin.rotation.set(0, 0, pitch);

          throwerGroup.position.set(-1.8, 0, 0);
          setCurrentStepText('طيران الرمح في مسار انسيابي داخل قطاع الرمي (زاوية ٢٩ درجة)');
        }
        // Phase 4: Tip Impact & Landing (t: 5.2 to 6.2s)
        else if (t < 6.2) {
          javelin.position.set(28.5, 0.25, 0);
          javelin.rotation.set(0, 0, -0.65); // stuck firmly in turf at angle

          // Judge raises WHITE flag
          whiteFlagGroup.visible = true;
          whiteFlagGroup.rotation.z = Math.min(1.4, (t - 5.2) * 2.5);

          setCurrentStepText('سقوط الرمح وإحداث علامة بسنه المدبب داخل القطاع (محاولة صحيحة - راية بيضاء)');
          setJudgmentStatus('valid');
        }
        // Phase 5: Measurement (t: 6.2 to 9.0s)
        else {
          javelin.position.set(28.5, 0.25, 0);
          javelin.rotation.set(0, 0, -0.65);
          whiteFlagGroup.visible = true;

          // Measurement officer at landing mark
          measurementOfficerGroup.visible = true;
          measurementOfficerGroup.position.set(28.5, 0, 1.2);

          // Extend tape measure from javelin tip (28.5, 0.05, 0) to inner edge of arc (0, 0.05, 0)
          const tapeProgress = Math.min(1, (t - 6.2) * 1.5);
          const currentTapeEnd = 28.5 - tapeProgress * 28.5;
          tapeMeasureLine.visible = true;
          const pts = [
            new THREE.Vector3(28.5, 0.05, 0),
            new THREE.Vector3(currentTapeEnd, 0.05, 0)
          ];
          tapeMeasureGeo.setFromPoints(pts);

          setMeasuredDistance(28.5);
          setCurrentStepText('القياس: صفر الشريط عند أثر الرمح، والقراءة عند الحافة الداخلية لقوس الرمي باتجاه المركز');
          setJudgmentStatus('valid');
        }
      } 
      else if (scenario === 'foul_line') {
        // Foul: Touching ground outside the throwing arc
        if (t < 2.8) {
          const runProg = t / 2.8;
          const posX = -14 + runProg * 14.5;
          throwerGroup.position.set(posX, 0, 0);
          javelin.position.set(posX + 0.3, 1.8, 0.2);
          setCurrentStepText('اقتراب المتسابق بسرعة عالية نحو خط الرمي...');
          setJudgmentStatus('pending');
        } else {
          // Foot steps beyond arc (posX > 0)
          throwerGroup.position.set(0.65, 0, 0); // cross the white line!
          javelin.position.set(2.0, 1.5, 0);
          javelin.rotation.set(0, 0, 0.3);

          // Red flag raised immediately!
          redFlagGroup.visible = true;
          redFlagGroup.rotation.z = Math.min(1.4, (t - 2.8) * 3);

          setCurrentStepText('محاولة فاشلة! لمس المتسابق الأرض خارج قوس الرمي (تُرفع الراية الحمراء)');
          setJudgmentStatus('foul');
        }
      }
      else if (scenario === 'foul_sector') {
        // Foul: Landing outside 29-degree throwing sector
        if (t < 2.5) {
          const runProg = t / 2.5;
          const posX = -14 + runProg * 12.5;
          throwerGroup.position.set(posX, 0, 0);
          javelin.position.set(posX + 0.3, 1.8, 0.2);
          setCurrentStepText('المتسابق يؤدي الرمية ولكن انحرفت زاوية الانطلاق...');
          setJudgmentStatus('pending');
        } else if (t < 5.0) {
          const flightT = (t - 2.5) / 2.5;
          // Javelin veers widely into Z axis (exceeding 29 degree angle)
          const posX = -1.5 + flightT * 27;
          const posZ = flightT * 14; // outside boundary line!
          const posY = 2 + 7 * Math.sin(flightT * Math.PI);
          javelin.position.set(posX, Math.max(0.1, posY), posZ);
          javelin.rotation.set(0, -0.4, 0.4 - flightT * 0.9);
          setCurrentStepText('الرمح ينحرف في الهواء باتجاه خارج قطاع الرمي...');
        } else {
          javelin.position.set(25.5, 0.2, 14);
          javelin.rotation.set(0, -0.4, -0.5);

          redFlagGroup.visible = true;
          redFlagGroup.rotation.z = Math.min(1.4, (t - 5.0) * 3);

          setCurrentStepText('محاولة فاشلة! سقوط الرمح خارج مقطع الرمي (خارج زاوية ٢٩ درجة)');
          setJudgmentStatus('foul');
        }
      }
      else if (scenario === 'foul_flat') {
        // Foul: Flat landing without javelin tip marking ground
        if (t < 2.5) {
          const runProg = t / 2.5;
          throwerGroup.position.set(-14 + runProg * 12.5, 0, 0);
          javelin.position.set(-14 + runProg * 12.5 + 0.3, 1.8, 0.2);
          setCurrentStepText('تنفيذ الرمية بزاوية رمي غير مناسبة...');
          setJudgmentStatus('pending');
        } else if (t < 5.0) {
          const flightT = (t - 2.5) / 2.5;
          const posX = -1.5 + flightT * 24;
          const posY = 2 + 6 * Math.sin(flightT * Math.PI);
          javelin.position.set(posX, Math.max(0.1, posY), 0);
          // Remains completely horizontal!
          javelin.rotation.set(0, 0, 0.05);
          setCurrentStepText('طيران الرمح بشكل أفقي مسطح...');
        } else {
          // Lands horizontally on ground without tip hitting first
          javelin.position.set(22.5, 0.05, 0);
          javelin.rotation.set(0, 0, 0);

          redFlagGroup.visible = true;
          redFlagGroup.rotation.z = Math.min(1.4, (t - 5.0) * 3);

          setCurrentStepText('محاولة فاشلة! عدم إحداث علامة في الأرض من مقدمة الرمح (سقط مسطحاً بالكامل)');
          setJudgmentStatus('foul');
        }
      }
      else if (scenario === 'foul_early_exit') {
        // Foul: Leaving throwing zone before javelin touches ground
        if (t < 2.5) {
          const runProg = t / 2.5;
          throwerGroup.position.set(-14 + runProg * 12.5, 0, 0);
          javelin.position.set(-14 + runProg * 12.5 + 0.3, 1.8, 0.2);
          throwerGroup.rotation.y = Math.PI / 2;
          setCurrentStepText('المتسابق يرمي الرمح...');
          setJudgmentStatus('pending');
        } else if (t < 4.2) {
          // Javelin still in flight
          const flightT = (t - 2.5) / 2.5;
          const posX = -1.5 + flightT * 26;
          const posY = 2 + 7 * Math.sin(flightT * Math.PI);
          javelin.position.set(posX, posY, 0);

          // Competitor turns back and walks away immediately!
          throwerGroup.rotation.y = -Math.PI / 2; // turned backwards
          throwerGroup.position.x = -2.0 - (t - 2.5) * 1.5;

          setCurrentStepText('المتسابق يستدير ويغادر منطقة الرمي قبل أن يهبط الرمح على الأرض!');
        } else {
          javelin.position.set(24.5, 0.2, 0);
          javelin.rotation.set(0, 0, -0.6);

          redFlagGroup.visible = true;
          redFlagGroup.rotation.z = Math.min(1.4, (t - 4.2) * 3);

          setCurrentStepText('محاولة فاشلة! ترك منطقة الرمي والتخلص قبل سقوط الرمح على الأرض');
          setJudgmentStatus('foul');
        }
      }
      else if (scenario === 'field_specs') {
        // Orbit and showcase specifications of the field
        specsOverlayGroup.visible = true;
        setCurrentStepText('المواصفات القانونية للملعب: طريق الاقتراب (٤م × ٣٠م)، قوس الرمي (نصف قطر ٨م، عرض ٧ سم)، مقطع الرمي (زاوية ٢٩ درجة)');
        setJudgmentStatus('pending');
      }

      // ==========================================
      // Camera Modes
      // ==========================================
      if (cameraMode === 'side') {
        camera.position.set(-8, 6, 16);
        camera.lookAt(5, 1.5, 0);
      } else if (cameraMode === 'arc') {
        camera.position.set(-4, 3, 4.5);
        camera.lookAt(1, 1.2, 0);
      } else if (cameraMode === 'top') {
        camera.position.set(10, 48, 0.1);
        camera.lookAt(10, 0, 0);
      } else if (cameraMode === 'landing') {
        camera.position.set(26, 4, 7);
        camera.lookAt(28, 0.5, 0);
      } else if (cameraMode === 'orbit' && orbitControls) {
        // Free user orbit
        const r = orbitControls.radius;
        const theta = orbitControls.theta;
        const phi = orbitControls.phi;
        camera.position.x = r * Math.sin(phi) * Math.cos(theta);
        camera.position.y = r * Math.cos(phi);
        camera.position.z = r * Math.sin(phi) * Math.sin(theta);
        camera.lookAt(5, 1, 0);
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [scenario, isPlaying, cameraMode, playbackSpeed]);

  const handleScenarioSelect = (s: SimulationScenario) => {
    setScenario(s);
    setPlaybackProgress(0);
    if (onScenarioChange) onScenarioChange(s);
    if (soundEnabled) {
      if (s === 'valid_throw') {
        sound.playWhistle();
        setTimeout(() => sound.playSuccessChime(), 1500);
      } else if (s === 'field_specs') {
        sound.playWhistle();
      } else {
        sound.playWhistle();
        setTimeout(() => sound.playFoulBuzzer(), 1200);
      }
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
  };

  return (
    <div className="w-full bg-white border-2 border-sky-100 rounded-3xl overflow-hidden shadow-xl shadow-sky-900/5 flex flex-col">
      {/* 3D Simulation Top Bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-gradient-to-r from-sky-50 via-white to-emerald-50 border-b border-sky-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              محاكي الفيديو ثلاثي الأبعاد 3D للمسابقة
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                ملعب كرتوني تفاعلي
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              ملعب ألعاب قوى متكامل، حكام، رايات، وقواعد القياس والمحاولات الصحيحة والفاشلة
            </p>
          </div>
        </div>

        {/* Camera Views Selection */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 text-xs">
          <button
            onClick={() => setCameraMode('side')}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold flex items-center gap-1 ${
              cameraMode === 'side' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            جانبية
          </button>
          <button
            onClick={() => setCameraMode('arc')}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold flex items-center gap-1 ${
              cameraMode === 'arc' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            القوس والحكم
          </button>
          <button
            onClick={() => setCameraMode('landing')}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold flex items-center gap-1 ${
              cameraMode === 'landing' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            منطقة الهبوط
          </button>
          <button
            onClick={() => setCameraMode('top')}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold flex items-center gap-1 ${
              cameraMode === 'top' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            منظر علوي
          </button>
          <button
            onClick={() => setCameraMode('orbit')}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold flex items-center gap-1 ${
              cameraMode === 'orbit' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            تدوير حر
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[660px] bg-sky-200 overflow-hidden">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Real-time State & Status Badge Overlay */}
        <div className="absolute top-4 right-4 max-w-md bg-white/95 backdrop-blur-md border-2 border-sky-100 p-4 rounded-2xl shadow-lg shadow-sky-950/5 z-10">
          <div className="flex items-center gap-2 mb-2">
            {judgmentStatus === 'valid' && (
              <span className="flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                محاولة صحيحة (راية بيضاء)
              </span>
            )}
            {judgmentStatus === 'foul' && (
              <span className="flex items-center gap-1.5 text-xs font-black text-red-700 bg-red-100 border border-red-300 px-3 py-1 rounded-xl shadow-xs">
                <XCircle className="w-4 h-4 text-red-600" />
                محاولة فاشلة (راية حمراء)
              </span>
            )}
            {judgmentStatus === 'pending' && (
              <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-1 rounded-xl">
                المحاولة جارية
              </span>
            )}

            {measuredDistance && (
              <span className="text-xs font-black text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl arabic-num shadow-xs">
                المسافة: {toArabicNumerals(measuredDistance.toFixed(2))} م
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-bold">
            {currentStepText}
          </p>
        </div>

        {/* Safety & Rule Callout in Bottom Left */}
        <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md border border-emerald-200 px-3.5 py-2 rounded-2xl text-xs text-slate-700 font-bold shadow-md">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>إشراف المعلم: قطاع الهبوط خالٍ تماماً والطلاب خلف خط الأمان</span>
        </div>

        {/* Sound toggle button */}
        <button
          onClick={toggleSound}
          className="absolute top-4 left-4 p-2.5 rounded-xl bg-white/90 backdrop-blur-md border border-sky-200 text-slate-700 hover:text-slate-900 transition-colors shadow-sm"
          title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      {/* Video Progress Bar */}
      <div className="w-full bg-sky-100 px-4 py-2 border-t border-sky-100">
        <div className="w-full bg-sky-200 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-100"
            style={{ width: `${playbackProgress * 100}%` }}
          />
        </div>
      </div>

      {/* Video Playback & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-4 bg-white border-t border-sky-100 gap-4">
        {/* Play/Pause & Speed */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-11 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-transform active:scale-95 shadow-md shadow-emerald-600/30"
            title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 mr-0.5" />}
          </button>
          
          <button
            onClick={() => {
              setPlaybackProgress(0);
              setIsPlaying(true);
            }}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="إعادة التشغيل من البداية"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 0.5 : 1)}
            className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors arabic-num"
          >
            سرعة: {toArabicNumerals(playbackSpeed)}x
          </button>
        </div>

        {/* Scenarios Quick Switching Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleScenarioSelect('valid_throw')}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              scenario === 'valid_throw' 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            رمية صحيحة وقياس
          </button>

          <button
            onClick={() => handleScenarioSelect('foul_line')}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              scenario === 'foul_line' 
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-red-300" />
            لمس خارج القوس
          </button>

          <button
            onClick={() => handleScenarioSelect('foul_sector')}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              scenario === 'foul_sector' 
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-red-300" />
            سقوط خارج المقطع
          </button>

          <button
            onClick={() => handleScenarioSelect('foul_flat')}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              scenario === 'foul_flat' 
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-red-300" />
            عدم إحداث علامة بالسن
          </button>

          <button
            onClick={() => handleScenarioSelect('foul_early_exit')}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              scenario === 'foul_early_exit' 
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-red-300" />
            مغادرة قبل السقوط
          </button>

          <button
            onClick={() => handleScenarioSelect('field_specs')}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              scenario === 'field_specs' 
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Ruler className="w-3.5 h-3.5 text-sky-300" />
            أبعاد الملعب والمواصفات
          </button>
        </div>
      </div>
    </div>
  );
};
