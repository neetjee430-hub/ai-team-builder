import { useState, useRef, useCallback, useEffect } from 'react';

export const useVoiceEngine = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [micError, setMicError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentTranscriptRef = useRef('');

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      // Warm up voices
      window.speechSynthesis.getVoices();
    };
  }, []);

  const speak = useCallback((text: string, language: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) {
        resolve(); // fallback
        return;
      }
      
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = language === 'hi-IN' || language === 'hi' || language === 'hinglish' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      // Find best Indian voice
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(v => 
        v.lang === utterance.lang || 
        v.lang.startsWith('hi') || 
        v.name.toLowerCase().includes('hindi') || 
        v.name.toLowerCase().includes('india')
      );
      if (indianVoice) utterance.voice = indianVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }, []);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const startListening = useCallback((
     language: string, 
     onInterim: (text: string) => void, 
     onFinal: (text: string) => void
  ) => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      setMicError('Speech recognition not supported. Please type your answer.');
      return () => {};
    }

    if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e){}
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = language === 'hi' || language === 'hinglish' ? 'hi-IN' : language;
    
    setIsListening(true);
    setTranscript('');
    currentTranscriptRef.current = '';
    setMicError(null);

    let hasSpoken = false;
    let wordCount = 0;

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += t + ' ';
          wordCount += t.trim().split(/\s+/).length;
          hasSpoken = true;
        } else {
          interim += t + ' ';
        }
      }

      const displayTranscript = currentTranscriptRef.current + final + interim;
      currentTranscriptRef.current += final;
      
      setTranscript(displayTranscript);
      if (interim || final) {
         onInterim(displayTranscript);
      }

      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      
      // Auto-stop after 2.5s silence IF candidate has spoken
      if (hasSpoken && wordCount > 5) {
        silenceTimeoutRef.current = setTimeout(() => {
            stopListening(true);
        }, 2500);
      }
    };

    recognition.onerror = (e: any) => {
      console.error('Speech recognition error:', e);
      if (e.error === 'not-allowed') {
        setMicError('Microphone access denied. Please allow microphone.');
      }
      stopListening(false);
    };

    recognition.onend = () => {
        // Continuous mode might end unexpectedly. If we are still supposed to be listening, and they haven't spoken much, restart.
        if (isListening && !hasSpoken) {
             try { recognition.start(); } catch(err){}
        } else if (hasSpoken) {
            stopListening(true);
        }
    };

    try {
      recognition.start();
    } catch (e) {}

    // initial timeout if they don't say anything
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    silenceTimeoutRef.current = setTimeout(() => {
        // If 15 seconds pass with no speech, end it to prompt them
        if (!hasSpoken) {
           stopListening(true);
        }
    }, 15000);

    const stopListening = (fireFinal: boolean) => {
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      setIsListening(false);
      try { recognition.stop(); } catch(e){}
      if (fireFinal) {
         onFinal(currentTranscriptRef.current.trim());
      }
    };

    return () => stopListening(false);
  }, [isListening]);

  return {
    speak,
    stopSpeaking,
    isSpeaking,
    startListening,
    isListening,
    transcript,
    micError
  };
};
