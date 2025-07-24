import { useRef, useCallback } from 'react';
import { Howl } from 'howler';

interface SoundEffects {
  move: Howl | null;
  capture: Howl | null;
  check: Howl | null;
  castle: Howl | null;
  gameEnd: Howl | null;
}

export const useSound = (enabled: boolean = true) => {
  const soundsRef = useRef<SoundEffects>({
    move: null,
    capture: null,
    check: null,
    castle: null,
    gameEnd: null
  });

  // Initialize sounds (in real implementation, you'd load actual sound files)
  const initSounds = useCallback(() => {
    if (!enabled) return;

    try {
      // For now, we'll create placeholder sounds
      // In a real implementation, you'd load actual sound files from /public/sounds/
      soundsRef.current = {
        move: new Howl({
          src: ['/sounds/move.mp3'],
          volume: 0.5,
          html5: true
        }),
        capture: new Howl({
          src: ['/sounds/capture.mp3'],
          volume: 0.6,
          html5: true
        }),
        check: new Howl({
          src: ['/sounds/check.mp3'],
          volume: 0.7,
          html5: true
        }),
        castle: new Howl({
          src: ['/sounds/castle.mp3'],
          volume: 0.5,
          html5: true
        }),
        gameEnd: new Howl({
          src: ['/sounds/game-end.mp3'],
          volume: 0.8,
          html5: true
        })
      };
    } catch (error) {
      console.error('Failed to initialize sounds:', error);
    }
  }, [enabled]);

  const playSound = useCallback((soundType: keyof SoundEffects) => {
    if (!enabled || !soundsRef.current[soundType]) return;

    try {
      soundsRef.current[soundType]?.play();
    } catch (error) {
      console.error(`Failed to play ${soundType} sound:`, error);
    }
  }, [enabled]);

  const playMoveSound = useCallback((isCapture: boolean = false, isCheck: boolean = false, isCastle: boolean = false) => {
    if (isCastle) {
      playSound('castle');
    } else if (isCheck) {
      playSound('check');
    } else if (isCapture) {
      playSound('capture');
    } else {
      playSound('move');
    }
  }, [playSound]);

  const playGameEndSound = useCallback(() => {
    playSound('gameEnd');
  }, [playSound]);

  return {
    initSounds,
    playMoveSound,
    playGameEndSound,
    playSound
  };
};
