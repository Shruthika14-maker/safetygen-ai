import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../translations';

export interface TTSVoiceStatus {
  textAvailable: boolean;
  voiceAvailable: boolean;
  matchedVoiceName?: string;
  matchedLangCode?: string;
  deviceVoicesTotal: number;
}

class SpeechManager {
  private voices: SpeechSynthesisVoice[] = [];
  private voicesLoaded = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voiceChangeCallbacks: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
        this.voiceChangeCallbacks.forEach((cb) => cb());
      };
    }
  }

  private loadVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
      if (this.voices.length > 0) {
        this.voicesLoaded = true;
      }
    }
  }

  public onVoicesChanged(callback: () => void) {
    this.voiceChangeCallbacks.push(callback);
    return () => {
      this.voiceChangeCallbacks = this.voiceChangeCallbacks.filter((c) => c !== callback);
    };
  }

  public getVoiceStatus(langCode: LanguageCode): TTSVoiceStatus {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return {
        textAvailable: true,
        voiceAvailable: false,
        deviceVoicesTotal: 0,
      };
    }

    this.loadVoices();
    const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    const targetBcp47 = langInfo ? langInfo.bcp47.toLowerCase() : 'en-in';
    const prefix = targetBcp47.split('-')[0];

    // Look for exact match first (e.g., ta-IN)
    let matched = this.voices.find(
      (v) => v.lang.toLowerCase() === targetBcp47 || v.lang.toLowerCase().replace('_', '-') === targetBcp47
    );

    // Look for prefix match (e.g. 'ta', 'hi', 'te')
    if (!matched) {
      matched = this.voices.find(
        (v) => v.lang.toLowerCase().startsWith(prefix) || v.name.toLowerCase().includes(langInfo?.name.toLowerCase() || '')
      );
    }

    return {
      textAvailable: true,
      voiceAvailable: !!matched,
      matchedVoiceName: matched?.name,
      matchedLangCode: matched?.lang,
      deviceVoicesTotal: this.voices.length,
    };
  }

  public speak(
    text: string,
    langCode: LanguageCode,
    options?: {
      rate?: number;
      pitch?: number;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ): { started: boolean; error?: string } {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return { started: false, error: 'Speech synthesis is not supported on this browser.' };
    }

    this.stop(); // Always cancel previous speech

    const status = this.getVoiceStatus(langCode);
    const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    const targetBcp47 = langInfo ? langInfo.bcp47 : 'en-IN';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetBcp47;
    utterance.rate = options?.rate ?? 0.95; // slightly slower for emergency clarity
    utterance.pitch = options?.pitch ?? 1.0;

    if (status.matchedVoiceName) {
      const voice = this.voices.find((v) => v.name === status.matchedVoiceName);
      if (voice) {
        utterance.voice = voice;
      }
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      options?.onError?.(e);
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return { started: true };
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.speaking;
    }
    return false;
  }
}

export const speechManager = new SpeechManager();

// Multilingual Speech Recognition wrapper
export interface SpeechRecognitionResultState {
  isListening: boolean;
  transcript: string;
  error?: string;
  isSupported: boolean;
}

export function createSpeechRecognizer(
  langCode: LanguageCode,
  onResult: (transcript: string) => void,
  onError: (errorMsg: string) => void,
  onEnd: () => void
) {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    recognition.lang = langInfo ? langInfo.bcp47 : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript;
      }
      if (finalTranscript) {
        onResult(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      const err = event.error || 'Speech recognition error';
      if (err === 'not-allowed') {
        onError('Microphone permission was denied. Please allow microphone access or type instead.');
      } else if (err === 'no-speech') {
        onError('No speech was detected. Please try speaking again.');
      } else {
        onError(`Voice input error: ${err}`);
      }
    };

    recognition.onend = () => {
      onEnd();
    };

    return recognition;
  } catch (e) {
    return null;
  }
}
