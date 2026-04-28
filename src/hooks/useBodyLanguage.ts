import React from 'react';
import { useState, useRef, useCallback, useEffect } from 'react';

// For MVP, we mock the real TFJS to avoid blocking the render thread without a worker, 
// but we structure it exactly as requested so we can drop in TFJS later if needed.
// The prompt mentioned "Generate simulated scores based on ... Add small random variation".
// We will generate assistive signals.

export interface BodyLanguageSnapshot {
  timestamp: number;
  eyeContact: number;
  posture: number;
  expression: number;
  compositeScore: number;
  note?: string;
}

export const useBodyLanguage = (videoRef: React.RefObject<HTMLVideoElement>, enabled: boolean) => {
  const [faceDetected, setFaceDetected] = useState(false);
  const [positioningWarning, setPositioningWarning] = useState<string | null>('Initializing camera...');
  const [eyeContact, setEyeContact] = useState(0);
  const [posture, setPosture] = useState(0);
  const [expression, setExpression] = useState(0);
  const [focus, setFocus] = useState(0);
  const [compositeScore, setCompositeScore] = useState(0);

  const [snapshots, setSnapshots] = useState<BodyLanguageSnapshot[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAnalysis = useCallback(() => {
    if (!enabled || !videoRef.current) return;

    intervalRef.current = setInterval(() => {
        // Simulated analysis based on presence of video
        if (videoRef.current && videoRef.current.readyState === 4) {
            setFaceDetected(true);
            setPositioningWarning(null);

            // Generate "live" looking data
            const newEye = 75 + Math.floor(Math.random() * 20); // 75-95
            const newPosture = 70 + Math.floor(Math.random() * 25); // 70-95
            const newExpr = 65 + Math.floor(Math.random() * 30); // 65-95
            const newFocus = 80 + Math.floor(Math.random() * 15); // 80-95

            setEyeContact(newEye);
            setPosture(newPosture);
            setExpression(newExpr);
            setFocus(newFocus);
            
            const comp = Math.floor((newEye + newPosture + newExpr + newFocus) / 4);
            setCompositeScore(comp);

            // Save snapshot every 30 seconds approx (here every 10 ticks = 20s)
            if (Math.random() > 0.8) {
                setSnapshots(prev => [...prev, {
                    timestamp: Math.floor(Date.now() / 1000),
                    eyeContact: newEye,
                    posture: newPosture,
                    expression: newExpr,
                    compositeScore: comp
                }]);
            }
        } else {
            setFaceDetected(false);
            setPositioningWarning('Camera not feed active');
        }
    }, 2000);
  }, [enabled, videoRef]);

  const stopAnalysis = useCallback(() => {
     if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
      if (enabled) {
          startAnalysis();
      } else {
          stopAnalysis();
      }
      return stopAnalysis;
  }, [enabled, startAnalysis, stopAnalysis]);

  return {
      faceDetected,
      positioningWarning,
      eyeContact,
      posture,
      expression,
      focus,
      compositeScore,
      snapshots
  };
};
