import React from 'react';

/* ============================================================================
   FurShield Icon system — single-source stroke icon set (24px grid).
   lucide-style, consistent stroke weight, renders with currentColor.
   Usage: <Icon name="search" size={18} />
   ============================================================================ */

const S = {
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  fill: 'none',
};

const ICONS = {
  home: [
    <path key="a" d="M3 9.5 12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" {...S} />,
    <path key="b" d="M9 22v-8h6v8" {...S} />,
  ],
  shield: [<path key="a" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" {...S} />],
  'shield-check': [
    <path key="a" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" {...S} />,
    <path key="b" d="m9 12 2 2 4-4" {...S} />,
  ],
  'shield-heart': [
    <path key="a" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" {...S} />,
    <path key="b" d="M12 15.5s3-2 3-4A1.9 1.9 0 0 0 12 10a1.9 1.9 0 0 0-3 1.5c0 2 3 4 3 4Z" {...S} />,
  ],
  heart: [
    <path
      key="a"
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      {...S}
    />,
  ],
  'heart-filled': [
    <path
      key="a"
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      fill="currentColor"
      stroke="none"
    />,
  ],
  search: [
    <circle key="a" cx="11" cy="11" r="8" {...S} />,
    <path key="b" d="m21 21-4.3-4.3" {...S} />,
  ],
  cart: [
    <circle key="a" cx="8" cy="21" r="1" {...S} />,
    <circle key="b" cx="19" cy="21" r="1" {...S} />,
    <path key="c" d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" {...S} />,
  ],
  bell: [
    <path key="a" d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" {...S} />,
    <path key="b" d="M10.3 21a1.94 1.94 0 0 0 3.4 0" {...S} />,
  ],
  user: [
    <path key="a" d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" {...S} />,
    <circle key="b" cx="12" cy="7" r="4" {...S} />,
  ],
  menu: [
    <line key="a" x1="4" x2="20" y1="6" y2="6" {...S} />,
    <line key="b" x1="4" x2="20" y1="12" y2="12" {...S} />,
    <line key="c" x1="4" x2="20" y1="18" y2="18" {...S} />,
  ],
  x: [
    <path key="a" d="M18 6 6 18" {...S} />,
    <path key="b" d="m6 6 12 12" {...S} />,
  ],
  'chevron-down': [<path key="a" d="m6 9 6 6 6-6" {...S} />],
  'chevron-up': [<path key="a" d="m18 15-6-6-6 6" {...S} />],
  'chevron-right': [<path key="a" d="m9 18 6-6-6-6" {...S} />],
  'chevron-left': [<path key="a" d="m15 18-6-6 6-6" {...S} />],
  'arrow-right': [
    <path key="a" d="M5 12h14" {...S} />,
    <path key="b" d="m12 5 7 7-7 7" {...S} />,
  ],
  'arrow-left': [
    <path key="a" d="M19 12H5" {...S} />,
    <path key="b" d="m12 19-7-7 7-7" {...S} />,
  ],
  'arrow-up-right': [
    <path key="a" d="M7 7h10v10" {...S} />,
    <path key="b" d="M7 17 17 7" {...S} />,
  ],
  'map-pin': [
    <path key="a" d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" {...S} />,
    <circle key="b" cx="12" cy="10" r="3" {...S} />,
  ],
  calendar: [
    <path key="a" d="M8 2v4" {...S} />,
    <path key="b" d="M16 2v4" {...S} />,
    <rect key="c" width="18" height="18" x="3" y="4" rx="2" {...S} />,
    <path key="d" d="M3 10h18" {...S} />,
  ],
  clock: [
    <circle key="a" cx="12" cy="12" r="10" {...S} />,
    <polyline key="b" points="12 6 12 12 16 14" {...S} />,
  ],
  star: [
    <polygon
      key="a"
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      {...S}
    />,
  ],
  'star-filled': [
    <polygon
      key="a"
      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      fill="currentColor"
      stroke="none"
    />,
  ],
  check: [<path key="a" d="M20 6 9 17l-5-5" {...S} />],
  'check-circle': [
    <path key="a" d="M22 11.08V12a10 10 0 1 1-5.93-9.14" {...S} />,
    <path key="b" d="m9 11 3 3L22 4" {...S} />,
  ],
  'alert-circle': [
    <circle key="a" cx="12" cy="12" r="10" {...S} />,
    <line key="b" x1="12" x2="12" y1="8" y2="12" {...S} />,
    <line key="c" x1="12" x2="12.01" y1="16" y2="16" {...S} />,
  ],
  'alert-triangle': [
    <path key="a" d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" {...S} />,
    <path key="b" d="M12 9v4" {...S} />,
    <path key="c" d="M12 17h.01" {...S} />,
  ],
  info: [
    <circle key="a" cx="12" cy="12" r="10" {...S} />,
    <path key="b" d="M12 16v-4" {...S} />,
    <path key="c" d="M12 8h.01" {...S} />,
  ],
  'log-out': [
    <path key="a" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" {...S} />,
    <polyline key="b" points="16 17 21 12 16 7" {...S} />,
    <line key="c" x1="21" x2="9" y1="12" y2="12" {...S} />,
  ],
  dashboard: [
    <rect key="a" width="7" height="9" x="3" y="3" rx="1.5" {...S} />,
    <rect key="b" width="7" height="5" x="14" y="3" rx="1.5" {...S} />,
    <rect key="c" width="7" height="9" x="14" y="12" rx="1.5" {...S} />,
    <rect key="d" width="7" height="5" x="3" y="16" rx="1.5" {...S} />,
  ],
  box: [
    <path key="a" d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" {...S} />,
    <path key="b" d="m3.3 7 8.7 5 8.7-5" {...S} />,
    <path key="c" d="M12 22V12" {...S} />,
  ],
  'file-text': [
    <path key="a" d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" {...S} />,
    <path key="b" d="M14 2v4a2 2 0 0 0 2 2h4" {...S} />,
    <path key="c" d="M10 9H8" {...S} />,
    <path key="d" d="M16 13H8" {...S} />,
    <path key="e" d="M16 17H8" {...S} />,
  ],
  building: [
    <rect key="a" width="16" height="20" x="4" y="2" rx="2" {...S} />,
    <path key="b" d="M9 22v-4h6v4" {...S} />,
    <path key="c" d="M8 6h.01" {...S} />,
    <path key="d" d="M16 6h.01" {...S} />,
    <path key="e" d="M12 6h.01" {...S} />,
    <path key="f" d="M8 10h.01" {...S} />,
    <path key="g" d="M16 10h.01" {...S} />,
    <path key="h" d="M8 14h.01" {...S} />,
    <path key="i" d="M16 14h.01" {...S} />,
  ],
  message: [
    <path key="a" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...S} />,
  ],
  users: [
    <path key="a" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" {...S} />,
    <circle key="b" cx="9" cy="7" r="4" {...S} />,
    <path key="c" d="M22 21v-2a4 4 0 0 0-3-3.87" {...S} />,
    <path key="d" d="M16 3.13a4 4 0 0 1 0 7.75" {...S} />,
  ],
  tag: [
    <path key="a" d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.42 0l8.58-8.58a1 1 0 0 0 0-1.42Z" {...S} />,
    <path key="b" d="M7 7h.01" {...S} />,
  ],
  play: [<polygon key="a" points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none" />],
  video: [
    <path key="a" d="m22 8-6 4 6 4V8Z" {...S} />,
    <rect key="b" width="14" height="12" x="2" y="6" rx="2" {...S} />,
  ],
  'question-circle': [
    <circle key="a" cx="12" cy="12" r="10" {...S} />,
    <path key="b" d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" {...S} />,
    <path key="c" d="M12 17h.01" {...S} />,
  ],
  plus: [
    <path key="a" d="M5 12h14" {...S} />,
    <path key="b" d="M12 5v14" {...S} />,
  ],
  minus: [<path key="a" d="M5 12h14" {...S} />],
  'plus-circle': [
    <circle key="a" cx="12" cy="12" r="10" {...S} />,
    <path key="b" d="M8 12h8" {...S} />,
    <path key="c" d="M12 8v8" {...S} />,
  ],
  trash: [
    <path key="a" d="M3 6h18" {...S} />,
    <path key="b" d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" {...S} />,
    <path key="c" d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" {...S} />,
    <line key="d" x1="10" x2="10" y1="11" y2="17" {...S} />,
    <line key="e" x1="14" x2="14" y1="11" y2="17" {...S} />,
  ],
  edit: [
    <path key="a" d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" {...S} />,
    <path key="b" d="m15 5 4 4" {...S} />,
  ],
  eye: [
    <path key="a" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" {...S} />,
    <circle key="b" cx="12" cy="12" r="3" {...S} />,
  ],
  'external-link': [
    <path key="a" d="M15 3h6v6" {...S} />,
    <path key="b" d="M10 14 21 3" {...S} />,
    <path key="c" d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" {...S} />,
  ],
  phone: [
    <path
      key="a"
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      {...S}
    />,
  ],
  mail: [
    <rect key="a" width="20" height="16" x="2" y="4" rx="2" {...S} />,
    <path key="b" d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" {...S} />,
  ],
  settings: [
    <path
      key="a"
      d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      {...S}
    />,
    <circle key="b" cx="12" cy="12" r="3" {...S} />,
  ],
  filter: [<polygon key="a" points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" {...S} />],
  sliders: [
    <line key="a" x1="21" x2="14" y1="4" y2="4" {...S} />,
    <line key="b" x1="10" x2="3" y1="4" y2="4" {...S} />,
    <line key="c" x1="21" x2="12" y1="12" y2="12" {...S} />,
    <line key="d" x1="8" x2="3" y1="12" y2="12" {...S} />,
    <line key="e" x1="21" x2="16" y1="20" y2="20" {...S} />,
    <line key="f" x1="12" x2="3" y1="20" y2="20" {...S} />,
    <line key="g" x1="14" x2="14" y1="2" y2="6" {...S} />,
    <line key="h" x1="8" x2="8" y1="10" y2="14" {...S} />,
    <line key="i" x1="16" x2="16" y1="18" y2="22" {...S} />,
  ],
  download: [
    <path key="a" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...S} />,
    <polyline key="b" points="7 10 12 15 17 10" {...S} />,
    <line key="c" x1="12" x2="12" y1="15" y2="3" {...S} />,
  ],
  upload: [
    <path key="a" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...S} />,
    <polyline key="b" points="17 8 12 3 7 8" {...S} />,
    <line key="c" x1="12" x2="12" y1="3" y2="15" {...S} />,
  ],
  clipboard: [
    <rect key="a" width="8" height="4" x="8" y="2" rx="1" {...S} />,
    <path key="b" d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" {...S} />,
  ],
  pulse: [<path key="a" d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" {...S} />],
  sparkles: [
    <path key="a" d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" {...S} />,
  ],
  bookmark: [<path key="a" d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" {...S} />],
  award: [
    <circle key="a" cx="12" cy="8" r="6" {...S} />,
    <path key="b" d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" {...S} />,
  ],
  stethoscope: [
    <path key="a" d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" {...S} />,
    <path key="b" d="M8 15v1a6 6 0 0 0 6 6a6 6 0 0 0 6-6v-4" {...S} />,
    <circle key="c" cx="20" cy="10" r="2" {...S} />,
  ],
  bone: [
    <path
      key="a"
      d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 1 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z"
      {...S}
    />,
  ],
  'credit-card': [
    <rect key="a" width="20" height="14" x="2" y="5" rx="2" {...S} />,
    <line key="b" x1="2" x2="22" y1="10" y2="10" {...S} />,
  ],
  refresh: [
    <path key="a" d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" {...S} />,
    <path key="b" d="M21 3v5h-5" {...S} />,
    <path key="c" d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" {...S} />,
    <path key="d" d="M8 16H3v5" {...S} />,
  ],
  bag: [
    <path key="a" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" {...S} />,
    <path key="b" d="M3 6h18" {...S} />,
    <path key="c" d="M16 10a4 4 0 0 1-8 0" {...S} />,
  ],
  paw: [
    <circle key="a" cx="6" cy="13" r="2" {...S} />,
    <circle key="b" cx="18" cy="13" r="2" {...S} />,
    <circle key="c" cx="8.5" cy="7" r="2" {...S} />,
    <circle key="d" cx="15.5" cy="7" r="2" {...S} />,
    <path
      key="e"
      d="M12 10c1.5-1.5 3-2 4.5-2 1.8 0 3.5 1.4 3.5 3.5 0 1.6-.6 2.9-1.1 4-.5 1.1-1.6 2-2.9 2h-8c-1.3 0-2.4-.9-2.9-2-.5-1.1-1.1-2.4-1.1-4 0-2.1 1.7-3.5 3.5-3.5 1.5 0 3 .5 4.5 2Z"
      {...S}
    />,
  ],
  inbox: [
    <polyline key="a" points="22 12 16 12 14 15 10 15 8 12 2 12" {...S} />,
    <path key="b" d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" {...S} />,
  ],
  'medical-cross': [
    <path key="a" d="M8 3h8v5h5v8h-5v5H8v-5H3V8h5V3Z" {...S} />,
  ],
  'user-plus': [
    <path key="a" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" {...S} />,
    <circle key="b" cx="9" cy="7" r="4" {...S} />,
    <line key="c" x1="19" y1="8" x2="19" y2="14" {...S} />,
    <line key="d" x1="22" y1="11" x2="16" y2="11" {...S} />,
  ],
  book: [
    <path key="a" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" {...S} />,
    <path key="b" d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" {...S} />,
  ],
  camera: [
    <path key="a" d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" {...S} />,
    <circle key="b" cx="12" cy="13" r="3" {...S} />,
  ],
  syringe: [
    <path key="a" d="m18 2 4 4" {...S} />,
    <path key="b" d="m17 7 3-3" {...S} />,
    <path key="c" d="M19 9 8.7 19.3a2.4 2.4 0 0 1-3.4 0l-.6-.6a2.4 2.4 0 0 1 0-3.4L15 5" {...S} />,
    <path key="d" d="m9 11 4 4" {...S} />,
    <path key="e" d="m5 19-3 3" {...S} />,
    <path key="f" d="m14 4 6 6" {...S} />,
  ],
  pill: [
    <path key="a" d="M10.5 20.5 3.5 13.5a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7Z" {...S} />,
    <path key="b" d="m8.5 8.5 7 7" {...S} />,
  ],
  flask: [
    <path key="a" d="M9 3h6" {...S} />,
    <path key="b" d="M10 3v6.5L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-8.5V3" {...S} />,
    <path key="c" d="M7 15h10" {...S} />,
  ],
};

export const Icon = ({ name, size = 20, strokeWidth = 2, className = '', style, ...rest }) => {
  const paths = ICONS[name];
  if (!paths) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths.map((p, i) => React.cloneElement(p, { key: p.key || i, strokeWidth }))}
    </svg>
  );
};

export const iconNames = Object.keys(ICONS);
export default Icon;