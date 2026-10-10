import React from 'react';

/**
 * High-definition SVG Flag icons for guaranteed crisp rendering across
 * all operating systems (especially Windows where Unicode flag emojis
 * do not render and turn into ugly regional indicator letters or broken symbols).
 */
export const FlagIcon = ({ code, className = 'w-4 h-3' }) => {
  const c = code?.toLowerCase();

  // Uzbekistan Flag
  if (c === 'uz' || c === 'uzb') {
    return (
      <svg
        viewBox="0 0 640 400"
        className={`${className} inline-block rounded-xs shadow-xs shrink-0 object-cover`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="640" height="130" fill="#0099b5" />
        <rect y="130" width="640" height="10" fill="#ce1126" />
        <rect y="140" width="640" height="120" fill="#ffffff" />
        <rect y="260" width="640" height="10" fill="#ce1126" />
        <rect y="270" width="640" height="130" fill="#1eb53a" />
        {/* Crescent */}
        <circle cx="65" cy="65" r="28" fill="#ffffff" />
        <circle cx="75" cy="65" r="24" fill="#0099b5" />
        {/* 12 Stars */}
        <g fill="#ffffff">
          <circle cx="115" cy="45" r="3.5" /><circle cx="135" cy="45" r="3.5" /><circle cx="155" cy="45" r="3.5" />
          <circle cx="115" cy="65" r="3.5" /><circle cx="135" cy="65" r="3.5" /><circle cx="155" cy="65" r="3.5" />
          <circle cx="115" cy="85" r="3.5" /><circle cx="135" cy="85" r="3.5" /><circle cx="155" cy="85" r="3.5" />
        </g>
      </svg>
    );
  }

  // Russian Federation Flag
  if (c === 'ru' || c === 'rus') {
    return (
      <svg
        viewBox="0 0 640 400"
        className={`${className} inline-block rounded-xs shadow-xs shrink-0 object-cover`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="640" height="133.3" fill="#ffffff" />
        <rect y="133.3" width="640" height="133.3" fill="#0039a6" />
        <rect y="266.6" width="640" height="133.4" fill="#d52b1e" />
      </svg>
    );
  }

  // English / UK Flag (Union Jack)
  return (
    <svg
      viewBox="0 0 640 400"
      className={`${className} inline-block rounded-xs shadow-xs shrink-0 object-cover`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="640" height="400" fill="#012169" />
      <path d="M0,0 L640,400 M640,0 L0,400" stroke="#ffffff" strokeWidth="60" />
      <path d="M0,0 L640,400 M640,0 L0,400" stroke="#c8102e" strokeWidth="20" />
      <path d="M320,0 L320,400 M0,200 L640,200" stroke="#ffffff" strokeWidth="100" />
      <path d="M320,0 L320,400 M0,200 L640,200" stroke="#c8102e" strokeWidth="60" />
    </svg>
  );
};

export default FlagIcon;
