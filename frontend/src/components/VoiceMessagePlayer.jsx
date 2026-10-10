import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, FastForward } from 'lucide-react';

const formatTime = (secs) => {
  if (!secs || isNaN(secs) || secs < 0) return '0:00';
  const mins = Math.floor(secs / 60);
  const remainingSecs = Math.floor(secs % 60);
  return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
};

const resolveAudioUrl = (url) => {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  const apiBase = import.meta.env.VITE_API_URL;
  const origin = apiBase
    ? apiBase.replace(/\/api\/?$/, '')
    : (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '5173' ? 'http://localhost:5050' : '');
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Preset waveform heights pattern for realistic Telegram/WhatsApp style audio bars
const WAVE_BARS = [
  30, 60, 45, 90, 75, 40, 85, 100, 55, 70, 95, 60, 40, 80, 65, 90, 45, 75, 50, 85, 60, 40
];

export default function VoiceMessagePlayer({
  audioUrl,
  duration = 0,
  isMe = false,
  compact = false,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loadError, setLoadError] = useState(false);

  const audioRef = useRef(null);
  const finalSrc = resolveAudioUrl(audioUrl);

  useEffect(() => {
    if (duration && duration > 0 && !totalDuration) {
      setTotalDuration(duration);
    }
  }, [duration]);

  const handleLoadedMetadata = () => {
    if (audioRef.current && (!totalDuration || isNaN(totalDuration) || totalDuration === 0)) {
      if (audioRef.current.duration && !isNaN(audioRef.current.duration) && isFinite(audioRef.current.duration)) {
        setTotalDuration(Math.round(audioRef.current.duration));
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (
        (!totalDuration || totalDuration === 0) &&
        audioRef.current.duration &&
        isFinite(audioRef.current.duration)
      ) {
        setTotalDuration(Math.round(audioRef.current.duration));
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('Audio playback failed:', err);
          setLoadError(true);
        });
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.5, 2];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const handleSeek = (fraction) => {
    if (!audioRef.current || !totalDuration) return;
    const target = fraction * totalDuration;
    audioRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const progressFraction = totalDuration > 0 ? Math.min(1, currentTime / totalDuration) : 0;

  return (
    <div
      className={`flex items-center gap-2.5 sm:gap-3 py-1 px-1 rounded-2xl select-none ${
        compact ? 'text-xs' : ''
      }`}
    >
      <audio
        ref={audioRef}
        src={finalSrc}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={() => setLoadError(true)}
      />

      {/* Play / Pause Circular Button */}
      <button
        type="button"
        onClick={togglePlay}
        disabled={loadError}
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-md ${
          isMe
            ? 'bg-slate-950 text-emerald-400 hover:bg-slate-900 border border-emerald-400/30 shadow-black/40'
            : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/30'
        } ${loadError ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isPlaying ? "To'xtatish" : "Eshitish"}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 fill-current" />
        ) : (
          <Play className="w-5 h-5 fill-current ml-0.5" />
        )}
      </button>

      {/* Audio Waveform & Meta Tracker */}
      <div className="flex-1 min-w-[140px] sm:min-w-[180px] max-w-[260px] space-y-1.5">
        {/* Interactive sound waveform bars */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const fraction = Math.max(0, Math.min(1, clickX / rect.width));
            handleSeek(fraction);
          }}
          className="h-7 flex items-center gap-1 cursor-pointer py-1 group"
          title="Ovozli xabarni boshqarish"
        >
          {WAVE_BARS.map((heightPercent, idx) => {
            const barFraction = idx / WAVE_BARS.length;
            const isFilled = barFraction <= progressFraction;

            return (
              <span
                key={idx}
                style={{ height: `${Math.max(20, heightPercent)}%` }}
                className={`flex-1 rounded-full transition-all duration-150 ${
                  isFilled
                    ? isMe
                      ? 'bg-slate-950 shadow-sm'
                      : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                    : isMe
                    ? 'bg-emerald-200/50 group-hover:bg-emerald-200/70'
                    : 'bg-slate-700 group-hover:bg-slate-600'
                } ${isPlaying && isFilled ? 'scale-y-110' : ''}`}
              />
            );
          })}
        </div>

        {/* Duration / Progress & Speed controls */}
        <div className="flex items-center justify-between text-[10px] font-mono leading-none">
          <span
            className={
              isMe ? 'text-emerald-100/90 font-bold' : 'text-slate-400 font-bold'
            }
          >
            {isPlaying || currentTime > 0
              ? `${formatTime(currentTime)} / ${formatTime(totalDuration)}`
              : formatTime(totalDuration)}
          </span>

          <div className="flex items-center gap-1">
            {/* Speed toggle (1x / 1.5x / 2x) */}
            <button
              type="button"
              onClick={cycleSpeed}
              className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase transition-colors ${
                isMe
                  ? 'bg-emerald-700/60 hover:bg-emerald-700 text-emerald-100 border border-emerald-400/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
              title="Tinglash tezligi"
            >
              {playbackRate}x
            </button>
          </div>
        </div>

        {loadError && (
          <p className="text-[10px] text-rose-300 font-sans">
            Audio faylni yuklab bo'lmadi
          </p>
        )}
      </div>
    </div>
  );
}
