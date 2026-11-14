import React, { useRef, useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

const WHATSAPP_NUMBER = '5511926933436';
const DISPLAY_PHONE = '(11) 92693-3436';

function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

let sharedAudioCtx: AudioContext | null = null;

function playClickSound() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === 'suspended') {
      void sharedAudioCtx.resume();
    }

    const now = sharedAudioCtx.currentTime;
    const oscillator = sharedAudioCtx.createOscillator();
    const gainNode = sharedAudioCtx.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(720, now);
    oscillator.frequency.exponentialRampToValueAtTime(260, now + 0.045);

    gainNode.gain.setValueAtTime(0.18, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    oscillator.connect(gainNode);
    gainNode.connect(sharedAudioCtx.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.06);
  } catch {
    // Ignore audio errors if blocked by browser policy
  }
}

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleVideo = () => {
    playClickSound();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    playClickSound();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <main className="min-h-screen w-full bg-[#090B10] text-slate-100 flex flex-col items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-[920px] flex flex-col items-center">
        {/* Player de Vídeo Principal (retângulo superior do layout) */}
        <div className="w-full rounded-2xl border border-slate-800 bg-[#0F131C] overflow-hidden shadow-2xl">
          <div className="relative w-full bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              src="/assets/aistudio/video_catalogo_online_29b6d71e.mp4"
              className="w-full max-h-[64vh] sm:max-h-[500px] object-contain cursor-pointer block"
              playsInline
              loop
              onClick={toggleVideo}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {!isPlaying && (
              <button
                type="button"
                onClick={toggleVideo}
                aria-label="Reproduzir vídeo demonstrativo"
                className="absolute inset-0 bg-black/35 hover:bg-black/25 transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400"
              >
                <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-xl transition-transform hover:scale-105">
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-slate-950 ml-1" />
                </span>
                <span className="text-xs sm:text-sm font-medium text-white bg-black/75 px-4 py-1.5 rounded-lg border border-white/15">
                  Assistir demonstração
                </span>
              </button>
            )}
          </div>

          {/* Barra de controles posicionada abaixo do vídeo (sem sobrepor o conteúdo) */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#0F131C] border-t border-slate-800">
            <button
              type="button"
              onClick={toggleVideo}
              aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
              className="inline-flex items-center gap-2 text-xs font-semibold text-white hover:text-amber-400 transition-colors cursor-pointer px-2 py-1"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Reproduzir</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Ativar som' : 'Silenciar vídeo'}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-rose-400" />
                  <span>Sem som</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Som</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3 Botões abaixo do player (conforme o layout) */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6">
          {/* Botão 1: Criar Cardápio em PDF - R$ 50 */}
          <a
            href={buildWhatsAppUrl(
              'Olá! Quero Criar Cardápio em PDF por R$ 50 para fechamento imediato.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClickSound}
            className="min-h-[68px] px-4 py-3.5 rounded-xl border-2 border-slate-300 bg-transparent hover:bg-slate-900 text-white transition-all flex flex-col items-center justify-center text-center gap-1 focus-visible:outline-2 focus-visible:outline-amber-400 active:scale-[0.98]"
          >
            <span className="font-display text-sm font-bold leading-tight">
              Criar Cardápio em PDF
            </span>
            <span className="text-xs font-semibold text-amber-400 tabular-nums">
              R$ 50 · Chamar no WhatsApp
            </span>
          </a>

          {/* Botão 2: Cardápio Virtual Simples - R$ 50 */}
          <a
            href={buildWhatsAppUrl(
              'Olá! Quero o Cardápio Virtual Simples por R$ 50 para fechamento imediato.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClickSound}
            className="min-h-[68px] px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 transition-all flex flex-col items-center justify-center text-center gap-1 shadow-lg focus-visible:outline-2 focus-visible:outline-amber-400 active:scale-[0.98]"
          >
            <span className="font-display text-sm font-bold leading-tight">
              Cardápio Virtual Simples
            </span>
            <span className="text-xs font-semibold text-slate-700 tabular-nums">
              R$ 50 · Chamar no WhatsApp
            </span>
          </a>

          {/* Botão 3: Cardápio com Painel Próprio - R$ 100 */}
          <a
            href={buildWhatsAppUrl(
              'Olá! Quero o Cardápio com Painel Próprio (para editar fotos e informações) por R$ 100.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClickSound}
            className="min-h-[68px] px-4 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all flex flex-col items-center justify-center text-center gap-1 shadow-lg shadow-amber-500/15 focus-visible:outline-2 focus-visible:outline-white active:scale-[0.98]"
          >
            <span className="font-display text-sm font-bold leading-tight">
              Cardápio com Painel
            </span>
            <span className="text-xs font-bold text-slate-900 tabular-nums">
              R$ 100 · Edite fotos e dados
            </span>
          </a>
        </div>

        {/* Botão Ver Exemplo + Aviso de Suporte Imediato */}
        <div className="w-full mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800/80 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-slate-300">
            Suporte disponível para fechamento imediato:{' '}
            <a
              href={buildWhatsAppUrl(
                'Olá! Preciso de atendimento pelo suporte para fechamento imediato.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              className="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 tabular-nums"
            >
              WhatsApp {DISPLAY_PHONE}
            </a>
          </p>

          <a
            href={buildWhatsAppUrl(
              'Olá! Gostaria de ver um exemplo de cardápio online antes de fechar.'
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playClickSound}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs sm:text-sm font-semibold text-white transition-all whitespace-nowrap shrink-0 active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Ver Exemplo</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>
    </main>
  );
}
