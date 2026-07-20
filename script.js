/* ==========================================================================
   A1 Group Health-Check (Zoo/Jungle Theme) - Logic
   ========================================================================== */

// Google Sheets API Web App URL (Paste your URL here after deploying Apps Script)
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycby2TqH6Jmqagxgp_xT-U4Oqhcag9XSr6729pGRqT2tpp76h7j9QwAaDQwvS3YZnlRUd/exec";

// Keep track of application state
const state = {
  currentStep: 1,
  nickname: "",
  customizer: {
    hat: "none",
    outfit: "none",
    acc: "none"
  },
  score: 50,
  selectedMood: "ok",
  soundEnabled: true,
  history: []
};

// ==========================================================================
// PIG AVATAR DYNAMIC BUILDER SYSTEM (Pixel-Art SVGs)
// ==========================================================================

const PIG_BASE = `
  <!-- Ears -->
  <path d="M2,1 h2 v1 h-2 z M1,2 h1 v2 h-1 z M4,2 h1 v2 h-1 z M2,4 h2 v1 h-2 z" fill="#3C2F2F" />
  <path d="M2,2 h2 v2 h-2 z" fill="#FFD2DC" />
  <path d="M2,2 h1 v2 h-1 z" fill="#FF8FA3" />
  <path d="M12,1 h2 v1 h-2 z M11,2 h1 v2 h-1 z M14,2 h1 v2 h-1 z M12,4 h2 v1 h-2 z" fill="#3C2F2F" />
  <path d="M12,2 h2 v2 h-2 z" fill="#FFD2DC" />
  <path d="M13,2 h1 v2 h-1 z" fill="#FF8FA3" />
  <!-- Head Base -->
  <path d="M4,3 h8 v1 h-8 z M3,4 h10 v1 h-10 z M2,5 h12 v7 h-12 z M3,12 h10 v1 h-10 z M4,13 h8 v1 h-8 z" fill="#3C2F2F" />
  <path d="M4,4 h8 v1 h-8 z M3,5 h10 v7 h-10 z M4,12 h8 v1 h-8 z" fill="#FFD2DC" />
  <!-- Eyes -->
  <rect x="4" y="7" width="2" height="2" fill="#3C2F2F" />
  <rect x="10" y="7" width="2" height="2" fill="#3C2F2F" />
  <!-- Blush -->
  <rect x="3" y="9" width="2" height="1" fill="#FF7B97" />
  <rect x="11" y="9" width="2" height="1" fill="#FF7B97" />
  <!-- Snout -->
  <path d="M6,8 h4 v1 h-4 z M5,9 h1 v2 h-1 z M10,9 h1 v2 h-1 z M6,11 h4 v1 h-4 z" fill="#3C2F2F" />
  <path d="M6,9 h4 v2 h-4 z" fill="#FF8FA3" />
  <path d="M6,10 h1 v1 h-1 z M9,10 h1 v1 h-1 z" fill="#3C2F2F" />
`;

const CUSTOMIZER_LAYERS = {
  hat: {
    none: ``,
    safari_hat: `
      <!-- Safari Hat -->
      <path d="M1,5 h14 v1 h-14 z M2,4 h12 v1 h-12 z M3,3 h10 v1 h-10 z M4,2 h8 v1 h-8 z M5,1 h6 v1 h-6 z" fill="#3C2F2F" />
      <path d="M2,5 h12 v1 h-12 z M3,4 h10 v1 h-10 z M4,3 h8 v1 h-8 z M5,2 h6 v1 h-6 z" fill="#8D6E63" />
      <path d="M3,4 h10 v1 h-10 z" fill="#5D4037" />
      <path d="M7,3 h2 v1 h-2 z" fill="#FFEB3B" />
    `,
    curly_yellow: `
      <!-- Curly Yellow Hair -->
      <path d="M4,1 h2 v1 h-2 z M7,1 h2 v1 h-2 z M10,1 h2 v1 h-2 z M3,1 h1 v1 h-1 z M6,1 h1 v1 h-1 z M9,1 h1 v1 h-1 z M12,1 h1 v1 h-1 z M2,2 h1 v2 h-1 z M13,2 h1 v2 h-1 z M3,4 h10 v1 h-10 z" fill="#3C2F2F" />
      <path d="M4,1 h2 v1 h-2 z M7,1 h2 v1 h-2 z M10,1 h2 v1 h-2 z M3,2 h9 v2 h-9 z" fill="#F4B251" />
      <path d="M4,1 h1 v1 h-1 z M7,1 h1 v1 h-1 z M10,1 h1 v1 h-1 z M3,2 h1 v1 h-1 z M6,2 h1 v1 h-1 z M9,2 h1 v1 h-1 z" fill="#FAD074" />
    `,
    gold_hair: `
      <!-- Gold Hair -->
      <path d="M4,1 h3 v1 h-3 z M9,1 h3 v1 h-3 z M3,2 h1 v2 h-1 z M12,2 h1 v2 h-1 z M1,4 h2 v1 h-2 z M13,4 h2 v1 h-2 z M0,5 h2 v8 h-2 z M14,5 h2 v8 h-2 z M2,13 h2 v1 h-2 z M12,13 h2 v1 h-2 z" fill="#3C2F2F"/>
      <path d="M4,2 h3 v2 h-3 z M9,2 h3 v2 h-3 z M2,4 h1 v9 h-1 z M13,4 h1 v9 h-1 z M1,5 h1 v8 h-1 z M14,5 h1 v8 h-1 z" fill="#F4B251"/>
      <path d="M4,2 h3 v1 h-3 z M9,2 h3 v1 h-3 z M2,4 h1 v1 h-1 z M13,4 h1 v1 h-1 z" fill="#FAD074"/>
    `,
    sunglasses: `
      <!-- Cool Sunglasses -->
      <path d="M3,5 h10 v2 h-10 z M4,7 h3 v1 h-3 z M9,7 h3 v1 h-3 z" fill="#3C2F2F" />
      <rect x="4" y="5" width="1" height="1" fill="#FFFFFF" />
      <rect x="9" y="5" width="1" height="1" fill="#FFFFFF" />
      <path d="M3,7 h1 v1 h-1 z M12,7 h1 v1 h-1 z" fill="#3C2F2F" />
    `,
    cookie_hat: `
      <!-- Cookie Hat -->
      <path d="M5,1 h6 v1 h-6 z M4,2 h8 v1 h-8 z M3,3 h10 v1 h-10 z M3,4 h10 v1 h-10 z M4,5 h8 v1 h-8 z" fill="#3C2F2F" />
      <path d="M5,2 h6 v1 h-6 z M4,3 h8 v1 h-8 z M4,4 h8 v1 h-8 z M5,5 h6 v1 h-6 z" fill="#DEB887" />
      <!-- Chocolate Chips -->
      <rect x="6" y="2" width="1" height="1" fill="#5D4037" />
      <rect x="8" y="2" width="1" height="1" fill="#5D4037" />
      <rect x="5" y="3" width="1" height="1" fill="#5D4037" />
      <rect x="9" y="3" width="1" height="1" fill="#5D4037" />
      <rect x="7" y="4" width="1" height="1" fill="#5D4037" />
      <rect x="6" y="5" width="1" height="1" fill="#5D4037" />
      <rect x="8" y="4" width="1" height="1" fill="#5D4037" />
    `
  },
  outfit: {
    none: ``,
    safari_uniform: `
      <!-- Safari Uniform -->
      <path d="M3,12 h10 v4 h-10 z" fill="#3C2F2F" />
      <path d="M4,13 h8 v3 h-8 z" fill="#8D6E63" />
      <path d="M7,13 h2 v3 h-2 z" fill="#5D4037" />
      <path d="M5,14 h2 v1 h-2 z M9,14 h2 v1 h-2 z" fill="#A1887F" />
      <rect x="7" y="14" width="2" height="1" fill="#FFEB3B" />
    `,
    red_hoodie: `
      <!-- Red Hoodie -->
      <path d="M3,12 h10 v4 h-10 z" fill="#3C2F2F" />
      <path d="M4,13 h8 v3 h-8 z" fill="#D32F2F" />
      <path d="M6,13 h4 v2 h-4 z" fill="#FF5252" />
      <circle cx="8" cy="14" r="1" fill="#FFFFFF" />
    `,
    cute_overalls: `
      <!-- Cute Overalls -->
      <path d="M3,12 h10 v4 h-10 z" fill="#3C2F2F" />
      <path d="M4,13 h8 v3 h-8 z" fill="#42A5F5" />
      <path d="M5,13 h6 v1 h-6 z" fill="#FFF8E1" />
      <rect x="5" y="14" width="1" height="1" fill="#FFEB3B" />
      <rect x="10" y="14" width="1" height="1" fill="#FFEB3B" />
    `,
    vine_scarf: `
      <!-- Vine Scarf -->
      <path d="M3,12 h10 v3 h-10 z" fill="#3C2F2F" />
      <path d="M4,13 h8 v2 h-8 z" fill="#4CAF50" />
      <path d="M4,14 h2 v2 h-2 z M10,14 h2 v2 h-2 z" fill="#2E7D32" />
      <rect x="7" y="13" width="2" height="1" fill="#FFEB3B" />
    `,
    cookie_outfit: `
      <!-- Cookie Outfit -->
      <path d="M3,12 h10 v4 h-10 z" fill="#3C2F2F" />
      <path d="M4,13 h8 v3 h-8 z" fill="#DEB887" />
      <!-- Choco chip details on clothing -->
      <rect x="5" y="14" width="1" height="1" fill="#5D4037" />
      <rect x="7" y="13" width="1" height="1" fill="#5D4037" />
      <rect x="9" y="14" width="1" height="1" fill="#5D4037" />
      <rect x="10" y="15" width="1" height="1" fill="#5D4037" />
      <rect x="6" y="15" width="1" height="1" fill="#5D4037" />
    `
  },
  acc: {
    none: ``,
    parrot: `
      <!-- Parrot companion sitting on the right side of the head -->
      <path d="M12,7 h3 v6 h-3 z" fill="#3C2F2F" />
      <path d="M13,8 h2 v4 h-2 z" fill="#D32F2F" />
      <rect x="12" y="8" width="1" height="1" fill="#FFEB3B" />
      <rect x="13" y="7" width="1" height="1" fill="#3C2F2F" />
      <rect x="14" y="9" width="1" height="2" fill="#4CAF50" />
      <rect x="14" y="12" width="1" height="2" fill="#29B6F6" />
    `,
    banana: `
      <!-- Banana companion next to the snout -->
      <path d="M1,9 h2 v3 h-2 z" fill="#3C2F2F" />
      <path d="M1,10 h1 v2 h-1 z" fill="#FFEB3B" />
      <rect x="2" y="9" width="1" height="1" fill="#8D6E63" />
      <rect x="0" y="11" width="1" height="1" fill="#FBC02D" />
    `,
    bee: `
      <!-- Cute Bee flying next to the pig -->
      <path d="M0,4 h3 v2 h-3 z" fill="#3C2F2F" />
      <rect x="1" y="4" width="2" height="1" fill="#FFEB3B" />
      <rect x="2" y="5" width="1" height="1" fill="#FFFFFF" />
      <rect x="1" y="5" width="1" height="1" fill="#3C2F2F" />
      <rect x="0" y="4" width="1" height="1" fill="#3C2F2F" />
    `
  }
};

function generateAvatarSVG(customizer) {
  const hatSVG = CUSTOMIZER_LAYERS.hat[customizer.hat] || "";
  const outfitSVG = CUSTOMIZER_LAYERS.outfit[customizer.outfit] || "";
  const accSVG = CUSTOMIZER_LAYERS.acc[customizer.acc] || "";

  return `<svg class="avatar-svg" viewBox="0 0 16 16" width="64" height="64">
    ${PIG_BASE}
    ${outfitSVG}
    ${hatSVG}
    ${accSVG}
  </svg>`;
}

function getAvatarDescriptionText(customizer) {
  const hatNames = {
    none: "ไม่มีหมวก",
    safari_hat: "หมวกสวนสัตว์",
    curly_yellow: "ผมหยิก",
    gold_hair: "ผมทอง",
    sunglasses: "แว่นกันแดด",
    cookie_hat: "หมวกคุกกี้"
  };
  const outfitNames = {
    none: "ไม่มีชุด",
    safari_uniform: "ชุดสวนสัตว์",
    red_hoodie: "เสื้อแดง",
    cute_overalls: "เอี๊ยมฟ้า",
    vine_scarf: "เถาวัลย์",
    cookie_outfit: "ชุดคุกกี้"
  };
  const accNames = {
    none: "ไม่มีของแต่ง",
    parrot: "นกแก้วป่า",
    banana: "กล้วย",
    bee: "ผึ้ง"
  };
  return `หมวก:[${hatNames[customizer.hat]}] ชุด:[${outfitNames[customizer.outfit]}] สัตว์เลี้ยง:[${accNames[customizer.acc]}]`;
}

// Update character builder real-time preview
function updateAvatarPreview() {
  const previewBox = document.getElementById('custom-avatar-preview-box');
  if (previewBox) {
    previewBox.innerHTML = generateAvatarSVG(state.customizer);
  }
}

// Setup customizer tab clicks
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    const tabId = `tab-${btn.dataset.tab}`;
    document.getElementById(tabId).classList.add('active');
    sounds.click();
  });
});

// Setup customizer option clicks
document.querySelectorAll('.option-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;
    const value = btn.dataset.value;

    // Deselect other options in this category
    document.querySelectorAll(`.option-btn[data-category="${category}"]`).forEach(b => {
      b.classList.remove('selected');
    });

    btn.classList.add('selected');
    state.customizer[category] = value;
    updateAvatarPreview();
    sounds.click();
  });
});

// ==========================================================================
// CORE TRANSLATIONS & TEXT MAPPINGS
// ==========================================================================

const MOOD_TEXTS = {
  cry: "ไม่ไหวแล้ว (X_X)",
  tired: "เหนื่อยล้า (i_i)",
  ok: "โอเคอยู่ (^-^)",
  good: "สบายดี (o^^o)",
  strong: "ไหวสบายมาก! (*v*)"
};

function getScoreDescription(score) {
  if (score <= 20) {
    return "พลังชีวิตต่ำเตี้ยเรี่ยดินป่า! มีไรก็บอกกันน้าาา";
  } else if (score <= 40) {
    return "เหนื่อยล้าเหมือนเดินป่าหลงทาง พักผ่อนบ้างนะ";
  } else if (score <= 60) {
    return "อยู่ในเกณฑ์ปานกลาง ป่ากว้างใหญ่แต่แกสู้ไหวแน่นอน! [v]";
  } else if (score <= 80) {
    return "เก่งมากกก มีไรก็บอก สู้ๆ ไอพวกหมูป่า A1 !! (*^-^*)";
  } else {
    return "ให้เยอะ";
  }
}

const STATUS_PIXEL_SVGS = {
  level1: `<svg viewBox="0 0 16 16" width="24" height="24" class="status-svg"><path d="M3,2 h3 v1 h-3 z M10,2 h3 v1 h-3 z M2,3 h1 v2 h-1 z M6,3 h1 v2 h-1 z M9,3 h1 v2 h-1 z M13,3 h1 v2 h-1 z M1,5 h1 v3 h-1 z M14,5 h1 v3 h-1 z M2,8 h1 v1 h-1 z M13,8 h1 v1 h-1 z M3,9 h2 v1 h-2 z M11,9 h2 v1 h-2 z M5,10 h2 v1 h-2 z M9,10 h2 v1 h-2 z M7,11 h2 v2 h-2 z" fill="#3C2F2F" /><path d="M3,3 h3 v1 h-3 z M10,3 h3 v1 h-3 z M2,5 h12 v3 h-12 z M3,8 h10 v1 h-10 z M5,9 h6 v1 h-6 z M7,10 h2 v1 h-2 z" fill="#FF8FA3" /><path d="M5,6 h2 v2 h-2 z M7,7 h2 v2 h-2 z" fill="#FFFFFF" /><path d="M6,7 h1 v1 h-1 z" fill="#FAF6EE" /></svg>`,
  level2: `<svg viewBox="0 0 16 16" width="24" height="24" class="status-svg"><path d="M7,1 h2 v1 h-2 z M6,2 h1 v2 h-1 z M9,2 h1 v2 h-1 z M5,4 h1 v2 h-1 z M10,4 h1 v2 h-1 z M4,6 h1 v4 h-1 z M11,6 h1 v4 h-1 z M5,10 h1 v2 h-1 z M10,10 h1 v2 h-1 z M6,12 h4 v1 h-4 z" fill="#3C2F2F" /><path d="M7,2 h2 v2 h-2 z M6,4 h4 v2 h-4 z M5,6 h6 v4 h-6 z M6,10 h4 v2 h-4 z" fill="#4FC3F7" /><path d="M7,5 h1 v5 h-1 z M6,6 h1 v2 h-1 z" fill="#FFFFFF" /></svg>`,
  level3: `<svg viewBox="0 0 16 16" width="24" height="24" class="status-svg"><path d="M5,4 h2 v1 h-2 z M7,2 h2 v2 h-2 z M9,1 h2 v1 h-2 z M11,2 h1 v2 h-1 z M10,4 h1 v2 h-1 z M8,6 h2 v1 h-2 z M7,7 h1 v5 h-1 z M4,7 h3 v1 h-3 z M3,8 h1 v2 h-1 z M4,10 h2 v1 h-2 z M6,12 h3 v1 h-3 z" fill="#3C2F2F" /><path d="M7,8 h1 v4 h-1 z" fill="#8B5A2B" /><path d="M4,8 h3 v1 h-3 z M4,9 h2 v1 h-2 z" fill="#9BD6A3" /><path d="M5,8 h1 v1 h-1 z" fill="#68A873" /><path d="M8,3 h2 v1 h-2 z M9,4 h2 v1 h-2 z M8,5 h2 v1 h-2 z" fill="#9BD6A3" /><path d="M9,3 h1 v2 h-1 z" fill="#68A873" /></svg>`,
  level4: `<svg viewBox="0 0 16 16" width="24" height="24" class="status-svg"><path d="M6,1 h4 v1 h-4 z M5,2 h1 v1 h-1 z M10,2 h1 v1 h-1 z M3,3 h2 v1 h-2 z M11,3 h2 v1 h-2 z M2,4 h1 v2 h-1 z M13,4 h1 v2 h-1 z M1,6 h1 v4 h-1 z M14,6 h1 v4 h-1 z M2,10 h1 v2 h-1 z M13,10 h1 v2 h-1 z M3,12 h2 v1 h-2 z M11,12 h2 v1 h-2 z M5,13 h1 v1 h-1 z M10,13 h1 v1 h-1 z M6,14 h4 v1 h-4 z" fill="#3C2F2F" /><path d="M6,2 h4 v1 h-4 z M5,3 h6 v1 h-6 z M3,4 h10 v2 h-10 z M2,6 h12 v4 h-12 z M3,10 h10 v2 h-10 z M5,12 h6 v1 h-6 z M6,13 h4 v1 h-4 z" fill="#FFB7C5" /><rect x="7" y="7" width="2" height="2" fill="#FAD074" /><path d="M6,3 h4 v1 h-4 z M3,5 h2 v1 h-2 z M11,5 h2 v1 h-2 z M2,7 h2 v1 h-2 z M12,7 h2 v1 h-2 z M3,11 h2 v1 h-2 z M11,11 h2 v1 h-2 z M6,12 h4 v1 h-4 z" fill="#FF8FA3" /></svg>`,
  level5: `<svg viewBox="0 0 16 16" width="24" height="24" class="status-svg"><path d="M7,1 h2 v2 h-2 z M6,3 h1 v1 h-1 z M9,3 h1 v1 h-1 z M5,4 h1 v2 h-1 z M10,4 h1 v2 h-1 z M2,6 h3 v1 h-3 z M11,6 h3 v1 h-3 z M1,7 h1 v2 h-1 z M14,7 h1 v2 h-1 z M2,9 h3 v1 h-3 z M11,9 h3 v1 h-3 z M5,10 h1 v2 h-1 z M10,10 h1 v2 h-1 z M6,12 h1 v1 h-1 z M9,12 h1 v1 h-1 z M7,13 h2 v2 h-2 z" fill="#3C2F2F" /><path d="M7,3 h2 v1 h-2 z M6,4 h4 v2 h-4 z M5,6 h6 v4 h-6 z M6,10 h4 v2 h-4 z M7,12 h2 v1 h-2 z" fill="#FFD54F" /><path d="M8,4 h1 v8 h-1 z M7,5 h1 v6 h-1 z" fill="#FFF" /><path d="M6,7 h1 v2 h-1 z M9,7 h1 v2 h-1 z" fill="#F5B041" /></svg>`
};

function getScoreLevelKey(score) {
  if (score <= 20) return 'level1';
  if (score <= 40) return 'level2';
  if (score <= 60) return 'level3';
  if (score <= 80) return 'level4';
  return 'level5';
}

const HEART_SVG = `
<svg viewBox="0 0 16 16">
  <path class="heart-border" d="M3,2 h3 v1 h-3 z M10,2 h3 v1 h-3 z M2,3 h1 v2 h-1 z M6,3 h1 v2 h-1 z M9,3 h1 v2 h-1 z M13,3 h1 v2 h-1 z M1,5 h1 v3 h-1 z M14,5 h1 v3 h-1 z M2,8 h1 v1 h-1 z M13,8 h1 v1 h-1 z M3,9 h2 v1 h-2 z M11,9 h2 v1 h-2 z M5,10 h2 v1 h-2 z M9,10 h2 v1 h-2 z M7,11 h2 v2 h-2 z" fill="#3C2F2F" />
  <path class="heart-fill" d="M3,3 h3 v1 h-3 z M10,3 h3 v1 h-3 z M2,5 h12 v3 h-12 z M3,8 h10 v1 h-10 z M5,9 h6 v1 h-6 z M7,10 h2 v1 h-2 z" fill="currentColor" />
</svg>`;

// ==========================================================================
// 1. Audio System (Chiptune Synthesizer)
// ==========================================================================
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

const sounds = {
  click() {
    if (!state.soundEnabled) return;
    initAudio();
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.setValueAtTime(390, now + 0.05);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.start(now);
    osc.stop(now + 0.12);
  },

  hover(index) {
    if (!state.soundEnabled) return;
    initAudio();
    const now = audioCtx.currentTime;

    // Scale frequency from 150Hz to 600Hz
    const freq = 180 + (index * 4);

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.start(now);
    osc.stop(now + 0.06);
  },

  lock() {
    if (!state.soundEnabled) return;
    initAudio();
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = 'square';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.setValueAtTime(550, now + 0.08);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
  },

  victory() {
    if (!state.soundEnabled) return;
    initAudio();
    const now = audioCtx.currentTime;

    // Jungle fanfare victory chords (playful)
    const notes = [
      { f: 392.00, t: 0 },     // G4
      { f: 523.25, t: 0.08 },  // C5
      { f: 659.25, t: 0.16 },  // E5
      { f: 783.99, t: 0.24 },  // G5
      { f: 987.77, t: 0.32 },  // B5
      { f: 1046.50, t: 0.44 }  // C6 (sustained)
    ];

    notes.forEach(note => {
      const startTime = now + note.t;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, startTime);

      const duration = (note.f === 1046.50) ? 0.7 : 0.25;
      gain.gain.setValueAtTime(0.05, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  },

  chestOpen() {
    if (!state.soundEnabled) return;
    initAudio();
    const now = audioCtx.currentTime;

    // Rising fantasy sound effect (arpeggio)
    const notes = [
      { f: 261.63, t: 0 },     // C4
      { f: 329.63, t: 0.05 },  // E4
      { f: 392.00, t: 0.10 },  // G4
      { f: 523.25, t: 0.15 },  // C5
      { f: 659.25, t: 0.20 },  // E5
      { f: 783.99, t: 0.25 },  // G5
      { f: 1046.50, t: 0.30 }, // C6
      { f: 1318.51, t: 0.35 }  // E6
    ];

    notes.forEach(note => {
      const startTime = now + note.t;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, startTime);

      gain.gain.setValueAtTime(0.04, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }
};

// ==========================================================================
// 2. Leaf Canvas Animation (Falling green leaves)
// ==========================================================================
const canvas = document.getElementById('leaf-canvas');
const ctx = canvas.getContext('2d');

let leaves = [];
const maxLeaves = 40;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Initialise leaves
for (let i = 0; i < maxLeaves; i++) {
  leaves.push(createLeaf(true));
}

function createLeaf(randomY = false) {
  const leafColors = [
    '#4CAF50', // Lime green
    '#388E3C', // Leaf green
    '#2E7D32', // Forest green
    '#81C784', // Mint green
    '#FFF59D'  // Pale yellow leaf
  ];
  return {
    x: Math.random() * canvas.width,
    y: randomY ? Math.random() * canvas.height : -10,
    size: Math.random() * 6 + 4,
    speedY: Math.random() * 1.1 + 0.5,
    speedX: Math.random() * 0.7 - 0.2,
    wiggle: Math.random() * 2,
    wiggleSpeed: Math.random() * 0.02 + 0.01,
    color: leafColors[Math.floor(Math.random() * leafColors.length)]
  };
}

function animateLeaves() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < leaves.length; i++) {
    const l = leaves[i];

    // Draw pixelated square leaf
    ctx.fillStyle = l.color;
    ctx.fillRect(Math.floor(l.x), Math.floor(l.y), l.size, l.size);

    // Fall and floating logic
    l.y += l.speedY;
    l.wiggle += l.wiggleSpeed;
    l.x += l.speedX + Math.sin(l.wiggle) * 0.4;

    // Recycle if out of bounds
    if (l.y > canvas.height || l.x > canvas.width || l.x < -10) {
      leaves[i] = createLeaf(false);
    }
  }

  requestAnimationFrame(animateLeaves);
}

// Start animation
animateLeaves();

// ==========================================================================
// 3. Heart Grid (100 Hearts) rating logic
// ==========================================================================
const heartGrid = document.getElementById('heart-grid');
const heartScoreText = document.getElementById('heart-score');
const scoreStatusDesc = document.getElementById('score-status-desc');

let isMouseDown = false;

// Generate 100 hearts
function buildHeartGrid() {
  heartGrid.innerHTML = '';
  for (let i = 1; i <= 100; i++) {
    const heart = document.createElement('div');
    heart.className = 'pixel-heart empty';
    heart.dataset.index = i;
    heart.innerHTML = HEART_SVG;

    // Events
    heart.addEventListener('mouseenter', () => handleHeartHover(i));
    heart.addEventListener('mousedown', (e) => {
      e.preventDefault();
      isMouseDown = true;
      selectScore(i);
    });

    // Support Touch Screens (Mobile)
    heart.addEventListener('touchstart', (e) => {
      e.preventDefault();
      isMouseDown = true;
      selectScore(i);
    });

    heartGrid.appendChild(heart);
  }
  updateHeartsVisual(state.score);
}

// Handle Hover
function handleHeartHover(index) {
  if (isMouseDown) {
    selectScore(index);
  } else {
    updateHeartsVisual(index, true); // temporary highlight
    sounds.hover(index);
  }
}

// Mouse Leave Grid restores locked score visual state
heartGrid.addEventListener('mouseleave', () => {
  if (!isMouseDown) {
    updateHeartsVisual(state.score);
  }
});

// Window-wide mouseup to end drag state
window.addEventListener('mouseup', () => {
  if (isMouseDown) {
    isMouseDown = false;
    sounds.lock();
  }
});
window.addEventListener('touchend', () => {
  if (isMouseDown) {
    isMouseDown = false;
    sounds.lock();
  }
});

// Drag handle for touch screens
heartGrid.addEventListener('touchmove', (e) => {
  if (!isMouseDown) return;
  const touch = e.touches[0];
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  if (element) {
    const heart = element.closest('.pixel-heart');
    if (heart) {
      const index = parseInt(heart.dataset.index);
      if (index && index !== state.score) {
        selectScore(index);
      }
    }
  }
});

// Set score state
function selectScore(index) {
  state.score = index;
  heartScoreText.textContent = index;
  const levelKey = getScoreLevelKey(index);
  const iconSvg = STATUS_PIXEL_SVGS[levelKey];
  scoreStatusDesc.innerHTML = `${iconSvg} <span>${getScoreDescription(index)}</span>`;
  updateHeartsVisual(index);
  if (isMouseDown) {
    sounds.hover(index);
  }
}

// Update DOM elements visual state
function updateHeartsVisual(limit, temp = false) {
  const hearts = heartGrid.querySelectorAll('.pixel-heart');
  hearts.forEach(h => {
    const idx = parseInt(h.dataset.index);
    if (idx <= limit) {
      h.classList.remove('empty');
      h.classList.add('filled');
    } else {
      h.classList.remove('filled');
      h.classList.add('empty');
    }
  });
}

// ==========================================================================
// 4. Form Actions & Step Navigation
// ==========================================================================

// Step controllers
function updateStep(step) {
  state.currentStep = step;

  // Hide all sections
  document.querySelectorAll('.step-section').forEach(s => s.classList.remove('active'));

  // Show target section
  const targetSection = document.getElementById(`step-${step}`);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Update progress bar
  const progressText = document.getElementById('progress-text');
  const progressBarInner = document.getElementById('progress-bar-inner');
  const percentage = step * 25;

  progressText.textContent = `ขั้นตอนที่ ${step}/4`;
  progressBarInner.style.width = `${percentage}%`;

  // Play navigation chime
  sounds.click();
}

// Validate inputs based on current step
function validateAndProceed(nextStep) {
  if (state.currentStep === 1) {
    const nicknameInput = document.getElementById('input-nickname');
    const val = nicknameInput.value.trim();
    if (!val) {
      nicknameInput.focus();
      nicknameInput.style.borderColor = '#ff7b7b';
      setTimeout(() => nicknameInput.style.borderColor = 'var(--color-border)', 500);
      return;
    }
    state.nickname = val;
  }

  if (state.currentStep === 3) {
    const q1 = document.getElementById('textarea-future');
    const q2 = document.getElementById('textarea-needs');

    let valid = true;
    if (!q1.value.trim()) {
      q1.style.borderColor = '#ff7b7b';
      setTimeout(() => q1.style.borderColor = 'var(--color-border)', 500);
      valid = false;
    }
    if (!q2.value.trim()) {
      q2.style.borderColor = '#ff7b7b';
      setTimeout(() => q2.style.borderColor = 'var(--color-border)', 500);
      valid = false;
    }
    if (!valid) return;
  }

  if (nextStep === 4) {
    populateReviewScreen();
  }

  updateStep(nextStep);
}

// Compile reviews inside step 4
function populateReviewScreen() {
  document.getElementById('review-avatar-display').innerHTML = generateAvatarSVG(state.customizer);
  document.getElementById('review-name').textContent = state.nickname;
  document.getElementById('review-score').textContent = `${state.score}/100`;
  document.getElementById('review-mood').textContent = MOOD_TEXTS[state.selectedMood];

  document.getElementById('review-q1').textContent = document.getElementById('textarea-future').value.trim();
  document.getElementById('review-q2').textContent = document.getElementById('textarea-needs').value.trim();

  const detail = document.getElementById('textarea-mood-detail').value.trim();
  document.getElementById('review-q3').textContent = detail || "ไม่มีข้อมูลเพิ่มเติม";
}

// Setup Event Listeners
document.getElementById('btn-go-to-step-2').addEventListener('click', () => validateAndProceed(2));
document.getElementById('btn-go-to-step-3').addEventListener('click', () => validateAndProceed(3));
document.getElementById('btn-go-to-step-4').addEventListener('click', () => validateAndProceed(4));

// Apply back step selectors
document.querySelectorAll('.btn-prev').forEach(btn => {
  btn.addEventListener('click', () => {
    if (state.currentStep > 1) {
      updateStep(state.currentStep - 1);
    }
  });
});

// Mood selection click
document.querySelectorAll('.mood-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.selectedMood = btn.dataset.mood;
    sounds.click();
  });
});

// Audio Toggle button
document.getElementById('btn-audio-toggle').addEventListener('click', () => {
  state.soundEnabled = !state.soundEnabled;
  const btn = document.getElementById('btn-audio-toggle');

  if (state.soundEnabled) {
    btn.innerHTML = `<span id="audio-icon">🔊</span> เสียง: เปิด`;
    sounds.click();
  } else {
    btn.innerHTML = `<span id="audio-icon">🔇</span> เสียง: ปิด`;
  }
});

// ==========================================================================
// 5. Submit, Export Certificate and Storage
// ==========================================================================

const modalSuccess = document.getElementById('modal-success');
const btnSubmit = document.getElementById('btn-submit-quest');

btnSubmit.addEventListener('click', submitQuestForm);

function submitQuestForm() {
  sounds.victory();

  // Format dates
  const today = new Date();
  const dateStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

  // Load variables into card template
  document.getElementById('card-date-display').textContent = dateStr;
  document.getElementById('card-name-display').textContent = state.nickname;
  document.getElementById('card-avatar-placeholder').innerHTML = generateAvatarSVG(state.customizer);

  // HP Bar & text
  const hpBar = document.getElementById('card-hp-bar');
  hpBar.style.width = `${state.score}%`;
  document.getElementById('card-hp-value').textContent = `${state.score}/100`;

  // Map score description inside card status
  const levelKey = getScoreLevelKey(state.score);
  const iconSvg = STATUS_PIXEL_SVGS[levelKey];
  document.getElementById('card-status-val').innerHTML = `${iconSvg} <span>${getScoreDescription(state.score)}</span>`;

  // Set Quest textual responses
  const q1Text = document.getElementById('textarea-future').value.trim();
  const q2Text = document.getElementById('textarea-needs').value.trim();
  document.getElementById('card-q1-display').textContent = q1Text;
  document.getElementById('card-q2-display').textContent = q2Text;

  const descAvatar = getAvatarDescriptionText(state.customizer);

  // Save log entry to LocalStorage
  const record = {
    id: Date.now(),
    date: dateStr,
    nickname: state.nickname,
    avatar: descAvatar,
    score: state.score,
    mood: state.selectedMood,
    q1: q1Text,
    q2: q2Text,
    q3: document.getElementById('textarea-mood-detail').value.trim()
  };

  saveRecordToHistory(record);

  // Disable submit button and show loading indicator
  btnSubmit.disabled = true;
  const originalBtnText = btnSubmit.innerHTML;
  btnSubmit.innerHTML = "⌛ กำลังส่งข้อมูล...";

  // Post data to Google Sheets Apps Script API
  if (GOOGLE_SHEET_URL) {
    fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(record)
    })
      .then(() => {
        modalSuccess.classList.add('active');
      })
      .catch(err => {
        console.error("Error sending data to Google Sheet:", err);
        modalSuccess.classList.add('active'); // Still show modal even if fetch failed so UX continues
      })
      .finally(() => {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalBtnText;
      });
  } else {
    // If Web App URL not provided yet, fallback gracefully and show success modal
    console.warn("GOOGLE_SHEET_URL is not set. Data saved locally only.");
    modalSuccess.classList.add('active');
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = originalBtnText;
  }
}

// LocalStorage helpers
function saveRecordToHistory(record) {
  let list = [];
  try {
    const raw = localStorage.getItem('a1_health_history');
    if (raw) list = JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }

  list.unshift(record); // Prepend so newest is first
  localStorage.setItem('a1_health_history', JSON.stringify(list));
}

// Download canvas PNG
document.getElementById('btn-download-card').addEventListener('click', () => {
  const cardElement = document.getElementById('health-card');
  sounds.click();

  const btn = document.getElementById('btn-download-card');
  const origText = btn.textContent;
  btn.textContent = "⌛ กำลังดาวน์โหลด...";
  btn.disabled = true;

  html2canvas(cardElement, {
    scale: 2, // High-res export
    backgroundColor: null,
    logging: false
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = `a1-health-card-${state.nickname}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    btn.textContent = origText;
    btn.disabled = false;
  }).catch(err => {
    console.error("Canvas export failed:", err);
    alert("เกิดข้อผิดพลาดในการดาวน์โหลดภาพ กรุณาลองใหม่อีกครั้ง");
    btn.textContent = origText;
    btn.disabled = false;
  });
});

// Copy formatted summary for Line/Slack messaging
document.getElementById('btn-copy-summary').addEventListener('click', () => {
  sounds.click();
  const q1Text = document.getElementById('textarea-future').value.trim();
  const q2Text = document.getElementById('textarea-needs').value.trim();
  const q3Text = document.getElementById('textarea-mood-detail').value.trim() || "ไม่มีข้อมูลเพิ่มเติม";
  const descAvatar = getAvatarDescriptionText(state.customizer);

  const text = `* A1 HEALTH QUEST SUMMARY *
ผู้กล้า: ${state.nickname} (${descAvatar})
พลังชีวิตใจ (HP): ${state.score}/100 [HP]
สถานะ: ${getScoreDescription(state.score)}
ระดับความไหว: ${MOOD_TEXTS[state.selectedMood]}
---------------------------------
[QUEST 01] เป้าหมาย 1 ปี:
"${q1Text}"

[QUEST 02] สิ่งที่อยากได้รับการสนับสนุน:
"${q2Text}"

[NOTE] รายละเอียดเพิ่มเติม:
"${q3Text}"
---------------------------------
* "สู้ๆ น้า ไอพวก A1 ก้าวเดินไปด้วยกันทีละพิกเซล" *`;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('btn-copy-summary');
    const origText = btn.textContent;
    btn.textContent = "✓ คัดลอกสำเร็จ!";
    setTimeout(() => {
      btn.textContent = origText;
    }, 2000);
  }).catch(err => {
    console.error("Failed to copy text:", err);
    alert("ไม่สามารถคัดลอกได้อัตโนมัติ กรุณาลองคัดลอกด้วยตนเอง");
  });
});

// Close modal success
document.getElementById('btn-close-modal').addEventListener('click', () => {
  modalSuccess.classList.remove('active');
  sounds.click();
  resetForm();
});

function resetForm() {
  document.getElementById('input-nickname').value = '';
  document.getElementById('textarea-future').value = '';
  document.getElementById('textarea-needs').value = '';
  document.getElementById('textarea-mood-detail').value = '';

  // Reset states
  state.score = 50;
  state.selectedMood = 'ok';
  state.customizer = {
    hat: "none",
    outfit: "none",
    acc: "none"
  };

  // Re-sync selector borders and custom preview
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.classList.remove('selected');
    if (btn.dataset.value === 'none') {
      btn.classList.add('selected');
    }
  });
  updateAvatarPreview();

  // Rebuild grid visual
  updateHeartsVisual(50);
  heartScoreText.textContent = '50';
  const initialLevelKey = getScoreLevelKey(50);
  const initialIconSvg = STATUS_PIXEL_SVGS[initialLevelKey];
  scoreStatusDesc.innerHTML = `${initialIconSvg} <span>${getScoreDescription(50)}</span>`;

  // Reset mood buttons
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.mood === 'ok') btn.classList.add('active');
  });

  updateStep(1);
}

// ==========================================================================
// 6. History Logs Dialog Logic
// ==========================================================================
const modalHistory = document.getElementById('modal-history');
const historyList = document.getElementById('history-log-list');

document.getElementById('btn-show-history').addEventListener('click', () => {
  sounds.click();
  renderHistoryList();
  modalHistory.classList.add('active');
});

document.getElementById('btn-close-history').addEventListener('click', () => {
  sounds.click();
  modalHistory.classList.remove('active');
});

document.getElementById('btn-close-history-footer').addEventListener('click', () => {
  sounds.click();
  modalHistory.classList.remove('active');
});

document.getElementById('btn-clear-history').addEventListener('click', () => {
  sounds.click();
  if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบประวัติการประเมินทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้")) {
    localStorage.removeItem('a1_health_history');
    renderHistoryList();
  }
});

function renderHistoryList() {
  let list = [];
  try {
    const raw = localStorage.getItem('a1_health_history');
    if (raw) list = JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }

  if (list.length === 0) {
    historyList.innerHTML = `<div class="no-history-msg">ยังไม่มีการบันทึกประวัติความสุขใจในขณะนี้ ลองทำแบบประเมินครั้งแรกดูสิ!</div>`;
    return;
  }

  historyList.innerHTML = '';
  list.forEach(item => {
    const row = document.createElement('div');
    row.className = 'history-item';

    const moodStr = MOOD_TEXTS[item.mood] || item.mood;

    row.innerHTML = `
      <div class="history-info">
        <span class="history-date">[DATE] ${item.date}</span>
        <span class="history-name">${item.nickname} [${item.avatar || "อวาตาร์กำหนดเอง"}]</span>
        <span class="history-date">ไหวมั้ย: ${moodStr}</span>
      </div>
      <div class="history-details">
        <span class="history-rating">HP ${item.score}/100</span>
      </div>
    `;
    historyList.appendChild(row);
  });
}

// ==========================================================================
// Surprise Chest & Senior Letters Logic
// ==========================================================================
const SENIOR_MESSAGES = [
  {
    name: "พี่ปุน",
    role: "Head of A1 (รุ่นพี่ปีที่แล้ว)",
    image: "poon.png",
    avatar: "👑",
    message: "ดีจ้าเอ1ทุกคนน เป็นไงบ้างสนุกกับการทำกรุ๊ปมั้ยตอนนี้ สู้ๆนะเด็กๆ พี่เชื่อว่ามันคงมีอะไรหลายๆอย่างที่เป็นอุปสรรคในการทำกรุ๊ป แต่พี่ขอให้พวกเราผ่านมันไปได้ทั้งหมด ผ่านมันไปด้วยกันทุกคนกับเพื่อนๆในกรุ๊ป สนุก เศร้า เฮอา ไปพร้อมกัน หวังว่าการทำกรุ๊ปจะเป็นความทรงจำที่ดีในปี2 ของน้องๆนะ🤟"
  },
  {
    name: "พี่พัด",
    role: "Head of A1 (รุ่นพี่ปีที่แล้ว)",
    image: "pat.png",
    avatar: "👑",
    message: "A1โคตรโหด A1โคตรเจ๋ง A1โคตรเฟี๊ยว น้องๆสู้ตาย น้องๆสู้สู้ 😘"
  },
  {
    name: "พี่จรณ์",
    role: "ฝ่ายกีฬา (รุ่นพี่ปีที่แล้ว)",
    image: "jorn_sports.jpg",
    avatar: "⚽",
    message: "สู้ๆนะเด็กๆ ขอให้สนุกกับปี2 มีงานอะไรก็คอยช่วยๆกัน มีปัญหาไม่พอใจอะไรกันก็คุยกันดีๆนะครับ (แต่ถ้าเป็นคนนอกกรุ๊ปก็ซัดเลย55555)"
  },
  {
    name: "พี่ปัน ",
    role: "PR (รุ่นพี่ปีที่แล้ว)",
    image: "pun_pr.png",
    avatar: "❤️",
    message: "เป็นกำลังใจให้น้อง ๆ ทุกคน ขอให้สนุกกับการทำงาน ช่วยกันเต็มที่ และเชื่อมั่นในทีมA1 สุดท้ายทุกความเหนื่อยจะกลายเป็นความภูมิใจ สู้ ๆ ❤️"
  },
  {
    name: "พี่จีโน่",
    role: "Welfare (รุ่นพี่ปีที่แล้ว)",
    image: "geno_welfare.png",
    avatar: "🥤",
    message: "สู้ๆน้องๆพี่จีโน่ welfare ปีที่แล้ว ชื่อว่าพวกน้องจะทำให้A1ของเรายิ่งใหญ่กว่าเดิมได้แน่ในปีนี้อีกไม่กีวันก็วันจริงแล้วสู้ๆพี่เป็นกำลังใจให้"
  },
  {
    name: "พี่อิมเอม",
    role: "Finance (รุ่นพี่ปีที่แล้ว)",
    image: "imem_finance.png",
    avatar: "💵",
    message: "ใกล้จะถึงเปิดฟ้าแล้วน้าเด้กกก ๆ คิดว่าช่วงนี้ทุกคนน่าจะเหนื่อยกันมาก ๆๆ แต่พี่เชื่อว่าพอถึงวันเปิดฟ้า แล้วได้เห็นน้อง ๆ เอนจอยกับสิ่งที่แกจัด แกจะภูมิใจกับมันมาก ๆ แล้วพวกพี่ ๆ ก็ภูมิใจในตัวพวกแกมากมากเหมือนกันน้า🫶🏻 เด้ก ๆ ที่ชั้นเห็นในวันเปิดฟ้า วันนี้เป็นพี่มาจัดให้น้องรุ่นต่อไปแล้วㅜㅜ ยังไงก็อย่าลืมหาเวลาพักผ่อนกันด้วยนะะ เติมเอเนอจี้เยอะ ๆๆ เก้บพลังไปปล่อยให้น้องงงงง เย่ะะ⭐️💘💘"
  },
  {
    name: "พี่ไรเฟิล",
    role: "Acty (รุ่นพี่ปีที่แล้ว)",
    image: "rifle_acty.jpg",
    avatar: "🎮",
    message: "ผมไรเฟิลเอง Acty ปีที่แล้ว เก่งมากไอน้อง สู้ๆนะจะเปิดฟ้าละ เก่งโคดๆเลย สู้ๆน้ามันอาจจะเหนื่อยหน่อยแต่เราเชื่อว่าทุกเกมที่พวกแกได้เล่นพวกแกได้คิดกันมันจะทำให้แกมีความสุขไปกับมันเว้ย เก่งละสู้เว้ย!!!"
  },
];

const modalChestSurprise = document.getElementById('modal-chest-surprise');
const btnSurpriseChest = document.getElementById('btn-surprise-chest');
const btnCloseSurprise = document.getElementById('btn-close-surprise');
const btnCloseSurpriseFooter = document.getElementById('btn-close-surprise-footer');
const chestClickzone = document.getElementById('chest-clickzone');
const surpriseChestStage = document.getElementById('surprise-chest-stage');
const surpriseMessagesStage = document.getElementById('surprise-messages-stage');
const seniorMessagesList = document.getElementById('senior-messages-list');

let isChestOpen = false;

btnSurpriseChest.addEventListener('click', () => {
  sounds.click();
  // Open the surprise modal
  modalChestSurprise.classList.add('active');
  // Reset stages
  isChestOpen = false;
  chestClickzone.classList.remove('open');
  chestClickzone.classList.remove('shaking');
  surpriseChestStage.style.display = 'block';
  surpriseMessagesStage.style.display = 'none';
  btnCloseSurpriseFooter.style.display = 'none';
  seniorMessagesList.innerHTML = '';
});

function closeSurpriseModal() {
  sounds.click();
  modalChestSurprise.classList.remove('active');
}

btnCloseSurprise.addEventListener('click', closeSurpriseModal);
btnCloseSurpriseFooter.addEventListener('click', closeSurpriseModal);

chestClickzone.addEventListener('click', () => {
  if (isChestOpen) return;
  isChestOpen = true;

  // Shake the chest
  chestClickzone.classList.add('shaking');

  // Sparkle pre-effects
  let interval = setInterval(() => {
    if (chestClickzone.classList.contains('shaking')) {
      spawnChestParticles(chestClickzone, 3);
    }
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
    chestClickzone.classList.remove('shaking');
    chestClickzone.classList.add('open');
    sounds.chestOpen();

    // Large sparkle explosion
    spawnChestParticles(chestClickzone, 30);

    // After brief delay, show messages
    setTimeout(() => {
      // Fade out chest stage / swap view
      surpriseChestStage.style.display = 'none';
      surpriseMessagesStage.style.display = 'block';
      btnCloseSurpriseFooter.style.display = 'block';

      // Render senior letters
      renderSeniorMessages();
    }, 1000);

  }, 800);
});

function spawnChestParticles(element, count = 20) {
  const rect = element.getBoundingClientRect();
  const emojis = ['✨', '💖', '⭐', '🍃', '🎉', '🐷'];

  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    spark.className = 'chest-spark';
    spark.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    // Calculate position relative to viewport scroll
    const x = rect.left + rect.width / 2 + window.scrollX;
    const y = rect.top + rect.height / 2 + window.scrollY;

    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;

    // Random destination directions
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 120;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 40; // upward bias
    const dr = 90 + Math.random() * 270; // rotation

    spark.style.setProperty('--dx', `${dx}px`);
    spark.style.setProperty('--dy', `${dy}px`);
    spark.style.setProperty('--dr', `${dr}deg`);

    document.body.appendChild(spark);

    // Remove spark after animation completes
    setTimeout(() => {
      spark.remove();
    }, 800);
  }
}

function renderSeniorMessages() {
  seniorMessagesList.innerHTML = '';

  SENIOR_MESSAGES.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'senior-card';
    if (item.role.includes("Head")) {
      card.className += ' leader-card';
    }
    // Cascading delays
    card.style.animationDelay = `${index * 0.25}s`;

    const avatarHtml = item.image
      ? `<img src="${item.image}" alt="${item.name}" class="senior-avatar-img">`
      : item.avatar;

    card.innerHTML = `
      <div class="senior-avatar-box">${avatarHtml}</div>
      <div class="senior-content">
        <div class="senior-name">${item.name}</div>
        <div class="senior-role">${item.role}</div>
        <div class="senior-message-text">${item.message}</div>
      </div>
    `;

    seniorMessagesList.appendChild(card);
  });
}

// Initialise Application
buildHeartGrid();
selectScore(50);
updateAvatarPreview();
