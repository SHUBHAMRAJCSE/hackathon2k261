// ── HELPERS ──────────────────────────────────
const APP_ORIGIN = window.location.protocol === 'file:' ? '' : window.location.origin;

function buildApiUrl(url) {
  if (/^https?:\/\//i.test(url)) return url;
  return `${APP_ORIGIN}${url}`;
}

async function apiCall(url, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(buildApiUrl(url), options);
    const raw = await res.text();
    let data = {};

    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch (err) {
        data = { message: raw };
      }
    }

    return { ok: res.ok, data, status: res.status };
  } catch (err) {
    return { ok: false, data: { message: 'Network error' } };
  }
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
}

function openCaptionModal(e) {
  if(e) e.preventDefault();
  openModal('captionModal');
  closeSidebar();
}

function openInsightsModal(e) {
  if(e) e.preventDefault();
  openModal('insightsModal');
  closeSidebar();
}

function openPostModal(e) {
  if(e) e.preventDefault();
  openModal('postModal');
  closeSidebar();
}

function openInboxModal(e) {
  if(e) e.preventDefault();
  openModal('inboxModal');
  closeSidebar();
}

function openAnalyticsModal(e) {
  if(e) e.preventDefault();
  openModal('analyticsModal');
  closeSidebar();
}

function openConnectionsModal(e) {
  if(e) e.preventDefault();
  openModal('connectionsModal');
  closeSidebar();
}

function openSettingsModal(e) {
  if(e) e.preventDefault();
  openModal('settingsModal');
  closeSidebar();
}

function openScheduleModal(e) {
  if(e) e.preventDefault();
  openModal('scheduleModal');
  if (typeof renderCalendar === 'function') renderCalendar();
  closeSidebar();
}

function openProfileModal(e) {
  if(e) e.preventDefault();
  openModal('profileModal');
  closeSidebar();
}

function openActivityModal(e) {
  if(e) e.preventDefault();
  openModal('activityModal');
  closeSidebar();
}

function openDashboard(e) {
  if(e) e.preventDefault();
  const headerTitle = document.querySelector('.header-title');
  if (headerTitle) headerTitle.textContent = 'Dashboard';
  closeModal('inboxModal');
  closeModal('analyticsModal');
  closeModal('settingsModal');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (e.currentTarget) e.currentTarget.classList.add('active');
  closeSidebar();
}

function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const menuToggle = document.getElementById('menuToggleBtn');
  const main = document.querySelector('.main');
  
  if (sidebar) sidebar.classList.add('open');
  if (overlay) overlay.classList.add('open');
  if (menuToggle) menuToggle.classList.add('active');
  if (main) main.classList.add('sidebar-open');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const menuToggle = document.getElementById('menuToggleBtn');
  const main = document.querySelector('.main');
  
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  if (menuToggle) menuToggle.classList.remove('active');
  if (main) main.classList.remove('sidebar-open');
}

function toggleSidebar() {
  const s = document.getElementById('sidebar');
  if (s) {
    s.classList.contains('open') ? closeSidebar() : openSidebar();
  }
}

// Modal close on overlay click
document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('open');
  });
});

function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  const m = document.getElementById('toastMsg');
  const i = t ? t.querySelector('i') : null;
  if (!t || !m) return;
  m.textContent = msg;
  if (i) {
    i.className = isError ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-check';
    i.style.color = isError ? '#f97316' : '#22c55e';
  }
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── SETTINGS FUNCTIONS ───────────────────────
function switchSettingsTab(element, sectionId) {
  if (!element) return;
  
  document.querySelectorAll('.settings-sidebar .nav-item').forEach(item => {
    item.classList.remove('active');
  });
  element.classList.add('active');
  
  document.querySelectorAll('.settings-section').forEach(section => {
    section.classList.remove('active');
  });
  
  const targetSection = document.getElementById(sectionId + '-section');
  if (targetSection) targetSection.classList.add('active');
}

function toggleNotification(element, type) {
  if (!element) return;
  element.classList.toggle('active');
  const isActive = element.classList.contains('active');
  showToast(`${type} notifications ${isActive ? 'enabled' : 'disabled'}`);
}

function toggleDarkMode(element) {
  if (!element) return;
  element.classList.toggle('active');
  const isDark = element.classList.contains('active');
  
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    showToast('Dark mode enabled');
  } else {
    document.documentElement.removeAttribute('data-theme');
    showToast('Light mode enabled');
  }
}

function changeAccentColor(color) {
  document.documentElement.style.setProperty('--primary', color);
  document.documentElement.style.setProperty('--primary-dark', color + 'dd');
  document.documentElement.style.setProperty('--primary-light', color + '20');
  showToast('Accent color updated');
}

function changeFontSize(size) {
  document.documentElement.style.setProperty('--font-size-base', size);
  showToast(`Font size changed to ${size}`);
}

function copyLink(url) {
  navigator.clipboard.writeText(url).then(() => {
    showToast('Link copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy link', true);
  });
}

function addNewLink() {
  showToast('Add new link feature coming soon!');
}

function openHelpArticle(article) {
  closeModal('settingsModal');
  showToast(`Opening ${article.replace('-', ' ')} guide...`);
}

async function logoutUser() {
  closeModal('settingsModal');
  closeAllPanels();
  showToast('Logged out successfully!');
  setTimeout(() => {
    window.location.href = '1_login.html';
  }, 1200);
}

// ── CONNECTIONS PLATFORM FUNCTION ─────────────────────
function connectPlatform(btn, platform) {
  if (!btn) return;
  if (btn.classList.contains('connected')) return;

  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Connecting...';

  setTimeout(() => {
    btn.classList.add('connected');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Connected';
    btn.disabled = false;
    showToast(`${platform} connected successfully! (Demo mode)`);
  }, 1500);
}

let likesPieChart, commentsPieChart;

function initAnalyticsCharts() {
  const likesCanvas = document.getElementById('likesPieChart');
  const commentsCanvas = document.getElementById('commentsPieChart');
  
  if (!likesCanvas || !commentsCanvas) return;
  
  try {
    // Likes Pie Chart
    const likesCtx = likesCanvas.getContext('2d');
    if (likesPieChart) likesPieChart.destroy();
    likesPieChart = new Chart(likesCtx, {
      type: 'doughnut',
      data: {
        labels: ['Instagram', 'YouTube', 'Twitter', 'Facebook'],
        datasets: [{
          data: [58200, 42100, 28100, 12400],
          backgroundColor: ['#e1306c', '#ff0000', '#1da1f2', '#1877f2'],
          borderWidth: 3,
          borderColor: '#fff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#111827',
            bodyColor: '#4b5563',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: (ctx) => `  ${ctx.label}: ${(ctx.parsed / 1000).toFixed(1)}K`
            }
          }
        }
      }
    });

    // Comments Pie Chart
    const commentsCtx = commentsCanvas.getContext('2d');
    if (commentsPieChart) commentsPieChart.destroy();
    commentsPieChart = new Chart(commentsCtx, {
      type: 'doughnut',
      data: {
        labels: ['Instagram', 'YouTube', 'Twitter', 'Facebook'],
        datasets: [{
          data: [14200, 11800, 6800, 3200],
          backgroundColor: ['#e1306c', '#ff0000', '#1da1f2', '#1877f2'],
          borderWidth: 3,
          borderColor: '#fff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#111827',
            bodyColor: '#4b5563',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: (ctx) => `  ${ctx.label}: ${(ctx.parsed / 1000).toFixed(1)}K`
            }
          }
        }
      }
    });
  } catch (e) {
    console.log('Chart init error:', e);
  }
}

function updateAnalytics() {
  const startDate = document.getElementById('startDate');
  const endDate = document.getElementById('endDate');
  
  if (startDate && endDate) {
    showToast(`Analytics updated for ${startDate.value} to ${endDate.value}`);
  }
  
  if (likesPieChart) {
    likesPieChart.data.datasets[0].data = [
      Math.floor(50000 + Math.random() * 20000),
      Math.floor(35000 + Math.random() * 15000),
      Math.floor(20000 + Math.random() * 10000),
      Math.floor(10000 + Math.random() * 5000)
    ];
    likesPieChart.update();
  }
  
  if (commentsPieChart) {
    commentsPieChart.data.datasets[0].data = [
      Math.floor(12000 + Math.random() * 5000),
      Math.floor(9000 + Math.random() * 4000),
      Math.floor(5000 + Math.random() * 3000),
      Math.floor(2000 + Math.random() * 2000)
    ];
    commentsPieChart.update();
  }
}

function switchAnalyticsTab(tab, type) {
  document.querySelectorAll('.analytics-tab').forEach(t => t.classList.remove('active'));
  if (tab) tab.classList.add('active');
  showToast(`Switched to ${type} view`);
}

// ── PLATFORM PILLS ────────────────────────────
function togglePill(el) {
  if (!el) return;
  const p = el.dataset.p ? el.dataset.p.toLowerCase() : '';
  const cls = 's' + (p === 'instagram' ? 'ig' : p === 'youtube' ? 'yt' : p === 'twitter' ? 'tw' : 'fb');
  el.classList.toggle(cls);
}

function getSelectedPlatforms(containerId = 'platPills') {
  const container = document.getElementById(containerId);
  if (!container) return ['Instagram'];
  
  const pills = container.querySelectorAll('.ppill');
  const sel = [];
  pills.forEach(p => {
    if (p.className && /\bs(ig|yt|tw|fb)\b/.test(p.className)) {
      if (p.dataset.p) sel.push(p.dataset.p);
    }
  });
  return sel.length ? sel : ['Instagram'];
}

// ── FILE UPLOAD ────────────────────────────────
let uploadedFiles = [];

function handleDragOver(e) {
  e.preventDefault();
  const box = document.getElementById('uploadBox');
  if (box) box.classList.add('drag-over');
}

function handleDragLeave(e) {
  e.preventDefault();
  const box = document.getElementById('uploadBox');
  if (box) box.classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  const box = document.getElementById('uploadBox');
  if (box) box.classList.remove('drag-over');
  
  if (e.dataTransfer && e.dataTransfer.files) {
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }
}

function handleFileSelect(e) {
  if (e.target && e.target.files) {
    const files = Array.from(e.target.files);
    processFiles(files);
  }
}

function processFiles(files) {
  files.forEach(file => {
    if (uploadedFiles.length >= 10) return;
    uploadedFiles.push(file);
    addPreviewItem(file);
  });
  if (files.length) showToast(`${files.length} file(s) added ✓`);
}

function addPreviewItem(file) {
  const preview = document.getElementById('uploadPreview');
  if (!preview) return;
  
  preview.classList.add('show');
  const item = document.createElement('div');
  item.className = 'preview-item';
  item.dataset.name = file.name;
  
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = e => {
      item.innerHTML = `<img src="${e.target.result}" alt=""/><button class="preview-remove" onclick="removePreview(this,'${file.name}')"><i class="fa-solid fa-xmark"></i></button>`;
    };
    reader.readAsDataURL(file);
  } else if (file.type.startsWith('video/')) {
    const reader = new FileReader();
    reader.onload = e => {
      item.innerHTML = `<video src="${e.target.result}"></video><button class="preview-remove" onclick="removePreview(this,'${file.name}')"><i class="fa-solid fa-xmark"></i></button>`;
    };
    reader.readAsDataURL(file);
  } else {
    item.innerHTML = `<div class="file-icon"><i class="fa-solid fa-file"></i><span class="file-name">${file.name}</span></div><button class="preview-remove" onclick="removePreview(this,'${file.name}')"><i class="fa-solid fa-xmark"></i></button>`;
  }
  preview.appendChild(item);
}

function removePreview(btn, name) {
  if (!btn) return;
  const item = btn.closest('.preview-item');
  if (item) item.remove();
  
  uploadedFiles = uploadedFiles.filter(f => f.name !== name);
  
  const preview = document.getElementById('uploadPreview');
  if (preview && !uploadedFiles.length) {
    preview.classList.remove('show');
  }
}

function addMediaFromUrl() {
  const urlInput = document.getElementById('mediaUrlInput');
  if (!urlInput) return;
  
  const url = urlInput.value.trim();
  if (!url) {
    showToast('Please enter a valid URL');
    return;
  }
  
  const preview = document.getElementById('uploadPreview');
  if (!preview) return;
  
  preview.classList.add('show');
  const item = document.createElement('div');
  item.className = 'preview-item';
  
  const ext = url.split('.').pop().toLowerCase();
  const isVideo = ['mp4', 'mov', 'webm', 'avi', 'mkv'].includes(ext);
  
  if (isVideo) {
    item.innerHTML = `<video src="${url}" controls></video><button class="preview-remove" onclick="this.closest('.preview-item').remove()"><i class="fa-solid fa-xmark"></i></button>`;
  } else {
    item.innerHTML = `<img src="${url}" onerror="this.parentElement.innerHTML='<div class=\'file-icon\'><i class=\'fa-solid fa-file\'></i><span class=\'file-name\'>Invalid URL</span></div>'" alt=""/><button class="preview-remove" onclick="this.closest('.preview-item').remove()"><i class="fa-solid fa-xmark"></i></button>`;
  }
  preview.appendChild(item);
  urlInput.value = '';
  showToast('Media URL added ✓');
}

// ============================================
// 🔥 COHERE AI INTEGRATION - VIRAL CAPTION GENERATOR
// ============================================
const COHERE_API_KEY = 'dkrFJ6phRiiF6wDAaxEpOhhz2m8EQTia1TV2Z1';

async function generateCaption() {
  const topicInput = document.getElementById('topicInput');
  const topic = topicInput ? topicInput.value.trim() : '';
  const toneSelect = document.getElementById('toneSelect');
  const lengthSelect = document.getElementById('lengthSelect');
  const btn = document.getElementById('genBtn');
  const loadingEl = document.getElementById('capLoading');
  const resultEl = document.getElementById('capResult');
  const capText = document.getElementById('capText');
  const postCaption = document.getElementById('postCaption');
  
  if (!topicInput || !btn || !loadingEl || !resultEl || !capText) {
    console.error('Required elements not found');
    return;
  }
  
  const tone = toneSelect ? toneSelect.value : 'engaging';
  const len = lengthSelect ? lengthSelect.value : 'medium';
  
  // Selected platforms
  const selectedPlatforms = getSelectedPlatforms('platPills');
  
  if (!topic) {
    showToast('Bhai pehle topic to daal! 😅', 'error');
    return;
  }
  
  // Loading state
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> AI Soch rha hai...';
  loadingEl.classList.add('show');
  resultEl.classList.remove('show');
  
  try {
    // Try API first
    const success = await tryApiGeneration(topic, tone, len, selectedPlatforms, capText, postCaption);
    
    if (success) {
      resultEl.classList.add('show');
      showToast('🔥 Viral caption ready!');
    } else {
      throw new Error('API failed');
    }
    
  } catch (error) {
    console.log('Using premium caption generator');
    
    // Get random premium caption
    const allCaptions = getAllPremiumCaptions(topic);
    const randomIndex = Math.floor(Math.random() * allCaptions.length);
    const randomCaption = allCaptions[randomIndex];
    
    if (capText) capText.textContent = randomCaption;
    if (postCaption) postCaption.value = randomCaption;
    resultEl.classList.add('show');
    
    showToast('✨ Premium caption ready!', 'success');
  } finally {
    loadingEl.classList.remove('show');
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Viral Caption';
  }
}

async function tryApiGeneration(topic, tone, len, selectedPlatforms, capText, postCaption) {
  try {
    // Platform style
    const platformStyles = {
      instagram: [
        'Instagram Reel style - hook in first 3 seconds',
        'Carousel post style - each slide has a revelation',
        'Story style - casual, behind-the-scenes',
        'Aesthetic feed style - minimal, poetic'
      ],
      youtube: [
        'YouTube Shorts style - fast-paced, loopable',
        'Tutorial style - step-by-step, valuable',
        'Vlog style - personal, story-driven'
      ],
      twitter: [
        'Twitter/X thread style - hook tweet then 🧵',
        'Viral tweet style - relatable, funny',
        'Hot take style - opinionated'
      ],
      facebook: [
        'Facebook community style - personal stories',
        'Group post style - discussion starter'
      ]
    };
    
    // Random selections
    let platformStyle = '';
    if (selectedPlatforms.length > 0) {
      const randomPlatform = selectedPlatforms[Math.floor(Math.random() * selectedPlatforms.length)];
      const platformKey = randomPlatform.toLowerCase();
      const styles = platformStyles[platformKey] || platformStyles.instagram;
      platformStyle = styles[Math.floor(Math.random() * styles.length)];
    }
    
    // Viral hooks
    const viralHooks = [
      'Stop scrolling if...',
      'POV: You finally...',
      'Nobody: ... Me: ...',
      'This is your sign to...',
      'Unpopular opinion: ...',
      '3 things I wish I knew...'
    ];
    
    const viralHook = viralHooks[Math.floor(Math.random() * viralHooks.length)];
    
    // Hashtags
    const hashtagSets = [
      '#viral #trending #fyp #explore',
      '#motivation #success #hustle',
      '#relatable #funny #memes',
      '#education #learning #tips'
    ];
    const selectedHashtags = hashtagSets[Math.floor(Math.random() * hashtagSets.length)] + 
                             ' #' + topic.replace(/\s+/g, '');
    
    // API Call
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'command',
        prompt: `Write a ${tone} social media caption about "${topic}".

Style: ${platformStyle}
Hook: Start with "${viralHook}"

Make it:
- Relatable and authentic
- Use emojis naturally
- Include a question
- End with these hashtags: ${selectedHashtags}

Return ONLY the caption.`,
        max_tokens: 300,
        temperature: 0.9
      })
    });
    
    if (!response.ok) return false;
    
    const data = await response.json();
    let caption = data.generations?.[0]?.text?.trim() || '';
    
    if (caption && caption.length > 10) {
      caption = caption.replace(/^["'\s]+|["'\s]+$/g, '');
      if (capText) capText.textContent = caption;
      if (postCaption) postCaption.value = caption;
      return true;
    }
    
    return false;
  } catch (e) {
    return false;
  }
}

// ============================================
// 💎 MEGA PREMIUM CAPTION LIBRARY - 50+ Unique Captions
// ============================================
function getAllPremiumCaptions(topic) {
  const topicClean = topic.replace(/\s+/g, '');
  const topicUpper = topic.toUpperCase();
  
  return [
    // INSTAGRAM AESTHETIC
    `✨ ${topicUpper} ERA ✨\n\nNot gatekeeping this anymore — here's how I stay consistent:\n\n1️⃣ Do it for the plot\n2️⃣ Document, don't create\n3️⃣ Trust the process\n\nSave this for later bestie! 📌\n\n#${topicClean} #thatgirl #aesthetic #viral #fyp`,
    
    `POV: You finally stopped waiting for the "perfect time" to start your ${topic} journey.\n\nSpoiler: The perfect time was always NOW. 💫\n\nWho else needed to hear this? 👇\n\n#${topicClean} #maincharacterenergy #lockedin #fypシ`,
    
    `Nobody:\nAbsolutely nobody:\nNot a single soul:\n\nMe: *obsessed with ${topic}*\n\nThis is my villain era and I'm owning it. 😈\n\n#${topicClean} #relatable #memes #fyp`,
    
    // MOTIVATIONAL
    `🚀 YOUR ${topicUpper} GLOW UP 🚀\n\nDay 1 vs One day. You decide.\n\nStart before you're ready. Grow before you're comfortable.\n\nTag your accountability partner! 👯‍♀️\n\n#${topicClean} #glowup #transformation #motivation`,
    
    `The grind doesn't stop. 📈\n\n3 months ago I knew nothing about ${topic}.\nNow? It's changing my life.\n\nConsistency > Talent\nPersistence > Perfection\n\nKeep going. Your time is coming. 🔥\n\n#${topicClean} #hustle #grind #success`,
    
    `Main character energy: Activated. ✨\n\nYour ${topic} era is NOT a dress rehearsal. It's the main event.\n\nShow up. Lock in. Level up. 🎯\n\n#${topicClean} #maincharacterenergy #lockedin #foryou`,
    
    // FUNNY / RELATABLE
    `Me trying to explain ${topic} to my family:\n\n"Them: What do you actually DO?"\n"Me: *shows phone* I post stuff"\n"Them: And that's a job?"\n"Me: *cries in creator*\n\nAnyone else? 😭💀\n\n#${topicClean} #creatorstruggles #relatable #fyp`,
    
    `The ${topic} struggle is real when:\n\n- Algorithm hates you 📉\n- Engagement is dead 💀\n- You still post anyway 🫠\n\nWho else feels attacked? 🙋‍♀️\n\n#${topicClean} #algorythm #creatorlife`,
    
    `POV: You're 3 months into your ${topic} journey and already an expert (according to your bio)\n\n"Digital creator | Helping you grow | 47 followers"\n\nWe've all been there 🤡\n\n#${topicClean} #fakeittillyoumakeit #creatorhumor`,
    
    // PROFESSIONAL / VALUE
    `3 years of ${topic} experience condensed into 3 tips:\n\n1️⃣ Start before you're ready\n2️⃣ Be consistently YOU\n3️⃣ Value ALWAYS wins\n\nSave this for later! 📌\n\n#${topicClean} #tips #advice #growth`,
    
    `${topicUpper} 101: What I wish I knew earlier 🧵\n\n1/ It's not about the tools, it's about the strategy\n2/ Your audience wants YOU, not a filtered version\n3/ Trends change, but VALUE doesn't\n\nWhich one surprised you? 👇\n\n#${topicClean} #education #wisdom`,
    
    `Stop overcomplicating ${topic}. Here's the simple framework:\n\n1️⃣ Create content YOU would want to see\n2️⃣ Engage like a human, not a bot\n3️⃣ Repeat for 90 days\n4️⃣ Profit\n\nThat's it. That's the secret. 🤫\n\n#${topicClean} #simplicity #strategy`,
    
    // EDUCATIONAL
    `${topicUpper} MASTERCLASS 🎓\n\nThe 80/20 rule:\n\n20% of your efforts → 80% of your results\n\nStop doing everything. Focus on what works.\n\nWhat's your 20%? Comment below 👇\n\n#${topicClean} #masterclass #efficiency`,
    
    `Save this ${topic} checklist for later! 📝\n\n✅ Define your goal\n✅ Know your audience\n✅ Create a content bank\n✅ Engage daily\n✅ Track your metrics\n✅ Adjust and improve\n\nSimple system for real results. 💯\n\n#${topicClean} #checklist #system`,
    
    `5 ${topic} tools I can't live without:\n\n1️⃣ Canva - for graphics\n2️⃣ CapCut - for video\n3️⃣ ChatGPT - for ideas\n4️⃣ Later - for scheduling\n5️⃣ Google Analytics - for data\n\nWhat would you add? 👇\n\n#${topicClean} #tools #resources`,
    
    // ADD MORE VARIETY
    `The secret to ${topic} that no one tells you:\n\nIt's not about going viral.\nIt's about building a community that STAYS.\n\nValue > Views\nConnection > Clout\n\nAgree? 💯\n\n#${topicClean} #community #growth #authentic`,
    
    `⚠️ UNPOPULAR OPINION ⚠️\n\nYou don't need more ${topic} tips.\nYou need to START.\n\nThat's it. That's the post. 🎯\n\n#${topicClean} #nobullshit #realtalk #fyp`,
    
    `Me: I should focus on ${topic}\n\nAlso me: *watches 47 reels, orders food, reorganizes closet*\n\nWhy are we like this? 🤡💀\n\n#${topicClean} #adhdlife #procrastination #relatable`,
    
    `Your daily dose of ${topic} inspiration 🌟\n\nRemember: You're not behind. You're on your own timeline.\n\nSave & share with someone who needs this! 💫\n\n#${topicClean} #motivation #inspiration #thatgirl`,
    
    `Drop a 🫶 if you agree:\n\n"Your ${topic} journey doesn't have to be perfect, it just has to be yours."\n\nTag someone who needs this reminder! 👯‍♀️\n\n#${topicClean} #selflove #growthmindset #foryou`,
    
    `Things I wish I knew about ${topic} sooner:\n\n⬇️ 3 things that changed everything ⬇️\n\n1️⃣ Consistency > Intensity\n2️⃣ Your vibe attracts your tribe\n3️⃣ Done is better than perfect\n\nWhich one hits different? 💭\n\n#${topicClean} #lifelessons #wisdom #fyp`,
    
    `Current situation: Trying to master ${topic}\n\nReality: 3 days in, already on a "mental health break"\n\nBreak length: undefined\n\nSend help (and snacks) 📦😭\n\n#${topicClean} #messylife #relatablecontent`,
    
    `This is your sign to stop waiting and start your ${topic} journey. 🛑\n\nThe "perfect time" is a myth. There's only NOW.\n\nWhat's stopping you? Comment below 👇\n\n#${topicClean} #noregrets #justdoit #fyp`,
    
    `From struggling with ${topic} to loving it. Here's what changed:\n\n1️⃣ I stopped comparing\n2️⃣ I started enjoying the process\n3️⃣ I showed up even when it was hard\n\nYou got this! 💪\n\n#${topicClean} #progress #growthmindset`,
    
    `The comeback is always stronger than the setback. 💫\n\nI failed at ${topic} 3 times before it clicked.\n\nNow? I'm helping others do the same.\n\nYour story isn't over yet. Keep writing. 📖\n\n#${topicClean} #comeback #resilience #fyp`,
    
    `You're closer than you think. 🌟\n\nMost people quit when they're just 1 step away from breaking through.\n\nDon't be most people. Keep going.\n\nSave this for motivation! 📌\n\n#${topicClean} #nevergiveup #motivation #foryoupage`,
    
    `The only person you need to be better than is the person you were yesterday. 🎯\n\nFocus on ${topic} progress, not perfection.\n\nSmall steps > No steps\n\nDrop a 🔥 if you agree!\n\n#${topicClean} #progress #betterthanyesterday`,
    
    `Building a ${topic} empire, one day at a time. 🏗️\n\nNot here for the quick wins. Here for the long game.\n\nWho's on this journey with me? 👇\n\n#${topicClean} #longgame #empirebuilding #fyp`,
    
    `Your ${topic} breakthrough is coming. Just keep showing up.\n\nFlowers don't grow overnight. Neither do you.\n\nBe patient. Be consistent. Be relentless. 🌱\n\n#${topicClean} #patience #growth #motivation`,
    
    `The anatomy of a perfect ${topic} post:\n\n1️⃣ Hook (first 3 words)\n2️⃣ Relatable story\n3️⃣ Value/insight\n4️⃣ Question/CTA\n5️⃣ Hashtags\n\nSteal this framework. Save it. Use it. 📌\n\n#${topicClean} #framework #contentcreation`,
    
    `How to master ${topic} in 30 days:\n\nWeek 1: Consume & learn\nWeek 2: Create & experiment\nWeek 3: Analyze & optimize\nWeek 4: Scale & systematize\n\n30 days from now, you'll thank yourself.\n\nWho's in? 👇\n\n#${topicClean} #30daychallenge #growth`,
    
    `Stop making these ${topic} mistakes:\n\n❌ Posting and ghosting\n❌ Ignoring your audience\n❌ Copying others blindly\n❌ Quitting too early\n❌ Not tracking results\n\nFix these → results will follow. 📈\n\n#${topicClean} #mistakes #lessons`,
    
    `${topic} success decoded:\n\n20% Strategy\n30% Consistency\n50% Mindset\n\nYour skills matter. Your mindset matters MORE.\n\nBelieve you can. Start today. 🎯\n\n#${topicClean} #success #mindset`
  ];
}

function useCaption() {
  const capText = document.getElementById('capText');
  const postCaption = document.getElementById('postCaption');
  
  if (capText && postCaption) {
    postCaption.value = capText.textContent;
    showToast('Caption added to your post!');
  }
}

function schedulePost() {
  closeModal('captionModal');
  showToast('Post scheduled successfully! ✨');
}

function submitCaptionPost() {
  closeModal('captionModal');
  showToast('Post published successfully! 🎉');
}

function submitPost() {
  closeModal('postModal');
  uploadedFiles = [];
  showToast('Post published successfully! 🎉');
}

function schedulePostNow() {
  closeModal('postModal');
  uploadedFiles = [];
  showToast('Post scheduled successfully! 📅');
}

// ── AI ANALYTICS INSIGHTS ─────────────────
async function generateInsights() {
  const insightQ = document.getElementById('insightQ');
  const insightPeriod = document.getElementById('insightPeriod');
  const insLoading = document.getElementById('insLoading');
  const insResult = document.getElementById('insResult');
  const insText = document.getElementById('insText');
  
  if (!insightQ || !insightPeriod || !insLoading || !insResult || !insText) return;
  
  const q = insightQ.value.trim() || 'Analyze my performance';
  const period = insightPeriod.value;
  
  insLoading.classList.add('show');
  insResult.style.display = 'none';
  
  try {
    const stats = `Instagram: 124.3K followers (+8.5%), YouTube: 89.7K subscribers (+12%), Twitter: 47.1K (+5.2%), Avg engagement: 9.7%. Period: ${period}.`;
    
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${COHERE_API_KEY}`
      },
      body: JSON.stringify({
        model: 'command',
        prompt: `Analyze this creator's stats: ${stats}\nQuestion: ${q}\nGive 3-4 actionable bullet-point insights with emojis. Be specific and data-driven. Max 200 words.`,
        max_tokens: 300,
        temperature: 0.8
      })
    });
    
    if (!response.ok) throw new Error('API Error');
    
    const data = await response.json();
    const text = data.generations?.[0]?.text?.trim() || 'Unable to generate insights.';
    
    insText.innerHTML = text.replace(/\n/g, '<br>');
    insResult.style.display = 'block';
  } catch (e) {
    insText.innerHTML = '📊 Based on your data:<br>• Instagram Reels performing best<br>• YouTube Shorts growing fast<br>• Post more consistently for better reach';
    insResult.style.display = 'block';
  }
  
  insLoading.classList.remove('show');
}

// ── AI REPLY SUGGESTIONS ──────────────────
let replyCtx = { name: '', comment: '', platform: '' };

async function openReplyModal(name, comment, platform) {
  replyCtx = { name, comment, platform };
  
  const commenterName = document.getElementById('commenterName');
  const commentText = document.getElementById('commentText');
  const replyList = document.getElementById('replyList');
  const replyArea = document.getElementById('replyArea');
  const replyLoading = document.getElementById('replyLoading');
  
  if (!commenterName || !commentText || !replyList || !replyArea || !replyLoading) return;
  
  commenterName.textContent = `${name} on ${platform}`;
  commentText.textContent = comment;
  replyList.innerHTML = '';
  replyArea.style.display = 'none';
  replyLoading.classList.add('show');
  openModal('replyModal');
  
  try {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${COHERE_API_KEY}`
      },
      body: JSON.stringify({
        model: 'command-light',
        prompt: `Generate 3 friendly reply options for this ${platform} comment from ${name}: "${comment}"

Format as:
1. [Reply text]
2. [Reply text]
3. [Reply text]`,
        max_tokens: 200,
        temperature: 0.8
      })
    });
    
    if (!response.ok) throw new Error('API Error');
    
    const data = await response.json();
    const replyText = data.generations?.[0]?.text || '';
    
    const replies = replyText
      .split('\n')
      .filter(line => line.match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(r => r.length > 0);
    
    if (replies.length > 0) {
      replyList.innerHTML = replies.map((reply, i) => {
        const tones = ['Warm & Friendly', 'Casual & Cool', 'Professional'];
        return `<div class="reply-opt" onclick="selectReply(this,'${reply.replace(/'/g, "\\'")}')">
          <div class="reply-tone">${tones[i] || 'Friendly'}</div>
          ${reply}
        </div>`;
      }).join('');
    } else {
      throw new Error('No replies generated');
    }
    
  } catch (error) {
    const fallbackReplies = [
      `Thanks so much ${name}! Really appreciate your support! 🙏✨`,
      `Love your feedback! What else would you like to see? 💭`,
      `So glad you enjoyed it! Means a lot! 💫`
    ];
    
    replyList.innerHTML = fallbackReplies.map((reply, i) => {
      const tones = ['Warm & Friendly', 'Casual & Cool', 'Professional'];
      return `<div class="reply-opt" onclick="selectReply(this,'${reply.replace(/'/g, "\\'")}')">
        <div class="reply-tone">${tones[i]}</div>
        ${reply}
      </div>`;
    }).join('');
  }
  
  replyLoading.classList.remove('show');
}

function selectReply(el, text) {
  document.querySelectorAll('.reply-opt').forEach(o => o.classList.remove('selected'));
  if (el) el.classList.add('selected');
  
  const replyText = document.getElementById('replyText');
  if (replyText) {
    replyText.value = text;
  }
  
  const replyArea = document.getElementById('replyArea');
  if (replyArea) {
    replyArea.style.display = 'block';
  }
}

function sendReply() {
  closeModal('replyModal');
  showToast(`Reply sent to ${replyCtx.name}! 🎉`);
}

// ── INBOX FUNCTIONS ────────────────────────────
function switchInboxTab(tab, type) {
  if (!tab) return;
  
  document.querySelectorAll('.inbox-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  filterInboxByType(type);
}

function filterInbox(element, platform) {
  if (!element) return;
  
  document.querySelectorAll('.platform-filter').forEach(f => f.classList.remove('active'));
  element.classList.add('active');
  
  const items = document.querySelectorAll('.inbox-item');
  items.forEach(item => {
    if (platform === 'all' || (item.dataset && item.dataset.platform === platform)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function filterInboxByType(type) {
  const items = document.querySelectorAll('.inbox-item');
  items.forEach(item => {
    if (type === 'all' || 
        (type === 'unread' && item.classList.contains('unread')) ||
        (type === 'mentions' && item.dataset && item.dataset.type === 'mention')) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function searchInbox() {
  const searchInput = document.getElementById('inboxSearch');
  if (!searchInput) return;
  
  const searchTerm = searchInput.value.toLowerCase();
  const items = document.querySelectorAll('.inbox-item');
  
  items.forEach(item => {
    const messageEl = item.querySelector('.inbox-item-message');
    const nameEl = item.querySelector('.inbox-item-name');
    
    const message = messageEl ? messageEl.textContent.toLowerCase() : '';
    const name = nameEl ? nameEl.textContent.toLowerCase() : '';
    
    if (message.includes(searchTerm) || name.includes(searchTerm)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function markAsRead(element) {
  if (!element) return;
  const item = element.closest('.inbox-item');
  if (item) {
    item.classList.remove('unread');
    showToast('Marked as read');
  }
}

function markAllAsRead() {
  document.querySelectorAll('.inbox-item.unread').forEach(item => {
    item.classList.remove('unread');
  });
  showToast('All messages marked as read');
}

function archiveMessage(element) {
  if (!element) return;
  const item = element.closest('.inbox-item');
  if (item) {
    item.remove();
    showToast('Message archived');
  }
}

function likeComment(element) {
  if (!element) return;
  const icon = element.querySelector('i');
  if (icon) {
    icon.classList.toggle('fa-regular');
    icon.classList.toggle('fa-solid');
  }
  showToast('Comment liked');
}

function retweetMessage(element) {
  showToast('Retweeted!');
}

function openMessage(element) {
  if (element) {
    element.classList.remove('unread');
  }
}

function openReplyModalFromInbox(element) {
  if (!element) return;
  
  const item = element.closest('.inbox-item');
  if (!item) return;
  
  const nameEl = item.querySelector('.inbox-item-name');
  const messageEl = item.querySelector('.inbox-item-message');
  
  const name = nameEl ? nameEl.textContent.trim() : 'User';
  const message = messageEl ? messageEl.textContent.trim() : '';
  const platform = item.dataset ? item.dataset.platform : 'social';
  
  openReplyModal(name, message, platform);
}

function exportInbox() {
  showToast('Inbox exported successfully!');
}

// ── CHARTS ───────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  // Initialize charts if elements exist
  setTimeout(function() {
    if (document.getElementById('engagementChart')) {
      initEngagementChart();
    }
    if (document.getElementById('followerDonut')) {
      initFollowerChart();
    }
  }, 500);
});

function initEngagementChart() {
  const canvas = document.getElementById('engagementChart');
  if (!canvas) return;
  
  try {
    const ctx = canvas.getContext('2d');
    
    function mg(ctx, col) {
      const g = ctx.createLinearGradient(0, 0, 0, 220);
      g.addColorStop(0, col + '40');
      g.addColorStop(1, col + '00');
      return g;
    }
    
    const labels14 = ['Apr 1', 'Apr 2', 'Apr 3', 'Apr 4', 'Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12', 'Apr 13', 'Apr 14', 'Apr 15'];
    
    const engData14 = {
      ig: [1800, 2200, 2600, 3000, 2400, 3500, 4200, 3800, 4800, 4200, 5600, 5000, 6200, 5800, 7000],
      yt: [1200, 1500, 1800, 2100, 1700, 2600, 3200, 2900, 3700, 3300, 4400, 3900, 5000, 4600, 5600],
      fb: [600, 800, 900, 1100, 900, 1300, 1700, 1500, 1900, 1700, 2300, 2000, 2600, 2400, 3000],
      tw: [400, 500, 600, 750, 600, 900, 1200, 1000, 1400, 1200, 1700, 1500, 1900, 1700, 2200]
    };
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels14,
        datasets: [{
          label: 'Instagram',
          data: engData14.ig,
          borderColor: '#e1306c',
          backgroundColor: mg(ctx, '#e1306c'),
          fill: true,
          tension: .45,
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5
        }, {
          label: 'YouTube',
          data: engData14.yt,
          borderColor: '#ff0000',
          backgroundColor: mg(ctx, '#ff0000'),
          fill: true,
          tension: .45,
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5
        }, {
          label: 'Facebook',
          data: engData14.fb,
          borderColor: '#1877f2',
          backgroundColor: 'transparent',
          fill: false,
          tension: .45,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          borderDash: [4, 4]
        }, {
          label: 'Twitter',
          data: engData14.tw,
          borderColor: '#1da1f2',
          backgroundColor: 'transparent',
          fill: false,
          tension: .45,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        }
      }
    });
  } catch (e) {
    console.log('Chart error:', e);
  }
}

function initFollowerChart() {
  const canvas = document.getElementById('followerDonut');
  if (!canvas) return;
  
  try {
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Instagram', 'YouTube', 'Twitter'],
        datasets: [{
          data: [124300, 89700, 47100],
          backgroundColor: ['#e1306c', '#ff0000', '#1da1f2'],
          borderWidth: 3,
          borderColor: '#fff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        }
      }
    });
  } catch (e) {
    console.log('Chart error:', e);
  }
}

// Period tabs functionality
document.querySelectorAll('.ptab').forEach(tab => {
  tab.addEventListener('click', function() {
    const container = this.closest('.period-tabs');
    if (container) {
      container.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
    }
    this.classList.add('active');
    showToast(`Switched to ${this.textContent} view`);
  });
});

// Initialize analytics charts when modal opens
const analyticsModal = document.getElementById('analyticsModal');
if (analyticsModal) {
  analyticsModal.addEventListener('click', function(e) {
    if (e.target === this) return;
    if (!likesPieChart && document.getElementById('likesPieChart')) {
      setTimeout(initAnalyticsCharts, 100);
    }
  });
}

// Nav items active state
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function(e) {
    if (!this.hasAttribute('onclick')) e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── HEADER PANELS ────────────────────────────
let activePanel = null;

function closeAllPanels() {
  ['searchPanel', 'notifPanel', 'profileDropdown'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  });
  
  const backdrop = document.getElementById('panelBackdrop');
  if (backdrop) backdrop.classList.remove('open');
  
  activePanel = null;
}

function openPanel(id, e) {
  if (e) e.stopPropagation();
  if (activePanel === id) {
    closeAllPanels();
    return;
  }
  closeAllPanels();
  
  const panel = document.getElementById(id);
  const backdrop = document.getElementById('panelBackdrop');
  
  if (panel) panel.classList.add('open');
  if (backdrop) backdrop.classList.add('open');
  
  activePanel = id;
}

function openSearchPanel(e) {
  openPanel('searchPanel', e);
  setTimeout(() => {
    const inp = document.getElementById('searchPanelInput');
    if (inp) inp.focus();
  }, 150);
}

function toggleNotifPanel(e) {
  openPanel('notifPanel', e);
}

function toggleProfileDropdown(e) {
  openPanel('profileDropdown', e);
}

// ── SEARCH FUNCTIONS ──────────────────────────
let searchTimeout;

function liveSearch(val) {
  const headerSearch = document.getElementById('headerSearchInput');
  const panelSearch = document.getElementById('searchPanelInput');
  
  if (headerSearch) headerSearch.value = val;
  if (panelSearch) panelSearch.value = val;
  
  clearTimeout(searchTimeout);
  
  const searchDefault = document.getElementById('searchDefault');
  const searchLive = document.getElementById('searchLiveResults');
  
  if (!searchDefault || !searchLive) return;
  
  if (!val.trim()) {
    searchDefault.style.display = 'block';
    searchLive.style.display = 'none';
    return;
  }
  
  searchDefault.style.display = 'none';
  
  searchTimeout = setTimeout(() => {
    searchLive.style.display = 'block';
    
    document.querySelectorAll('#searchLiveResults .search-result-label').forEach(el => {
      const text = el.textContent;
      try {
        const re = new RegExp(`(${val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        el.innerHTML = text.replace(re, '<mark style="background:#ede9ff;color:var(--primary);border-radius:3px;padding:0 2px;">$1</mark>');
      } catch (e) {
        // Ignore regex errors
      }
    });
  }, 200);
}

function filterSearch(el, category) {
  if (!el) return;
  
  document.querySelectorAll('.search-cat').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  showToast(`Filtering by: ${category}`);
}

function runSearch(term) {
  const panelSearch = document.getElementById('searchPanelInput');
  if (panelSearch) {
    panelSearch.value = term;
    liveSearch(term);
  }
}

function clearSearch() {
  const panelSearch = document.getElementById('searchPanelInput');
  const headerSearch = document.getElementById('headerSearchInput');
  const searchDefault = document.getElementById('searchDefault');
  const searchLive = document.getElementById('searchLiveResults');
  
  if (panelSearch) panelSearch.value = '';
  if (headerSearch) headerSearch.value = '';
  if (searchDefault) searchDefault.style.display = 'block';
  if (searchLive) searchLive.style.display = 'none';
}

function clearRecentSearches() {
  document.querySelectorAll('#searchDefault .search-result-item').forEach(el => el.remove());
  showToast('Recent searches cleared');
}

// ── NOTIFICATION FUNCTIONS ────────────────────
let unreadCount = 5;

function readNotif(el) {
  if (!el) return;
  
  if (el.classList.contains('unread')) {
    el.classList.remove('unread');
    unreadCount = Math.max(0, unreadCount - 1);
    updateNotifBadge();
  }
}

function markAllNotifsRead() {
  document.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
  unreadCount = 0;
  updateNotifBadge();
  showToast('All notifications marked as read');
}

function updateNotifBadge() {
  const badge = document.getElementById('notifBadge');
  const countEl = document.getElementById('notifCount');
  
  if (unreadCount === 0) {
    if (badge) badge.style.display = 'none';
    if (countEl) countEl.style.display = 'none';
  } else {
    if (badge) {
      badge.style.display = 'inline';
      badge.textContent = `${unreadCount} new`;
    }
    if (countEl) {
      countEl.style.display = 'grid';
      countEl.textContent = unreadCount;
    }
  }
}

function switchNotifTab(el, type) {
  if (!el) return;
  
  document.querySelectorAll('.notif-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  
  const items = document.querySelectorAll('.notif-item');
  items.forEach(item => {
    if (type === 'all' || (item.dataset && item.dataset.type === type)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// Calendar functions
let calYear = 2025, calMonth = 3;
const scheduledPosts = {
  '2025-4-16': [{ plat: 'tw', label: 'Thread' }],
  '2025-4-17': [{ plat: 'ig', label: 'Story' }],
  '2025-4-19': [{ plat: 'ig', label: 'Carousel' }, { plat: 'fb', label: 'Photo' }],
  '2025-4-21': [{ plat: 'yt', label: 'Short' }],
  '2025-4-24': [{ plat: 'ig', label: 'Reel' }, { plat: 'yt', label: 'Short' }],
  '2025-4-28': [{ plat: 'tw', label: 'Thread' }],
};

function renderCalendar() {
  const grid = document.getElementById('calGrid');
  const calMonthTitle = document.getElementById('calMonthTitle');
  
  if (!grid || !calMonthTitle) return;
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  calMonthTitle.textContent = `${monthNames[calMonth]} ${calYear}`;
  
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const daysInPrev = new Date(calYear, calMonth, 0).getDate();
  const today = new Date();
  
  grid.innerHTML = '';
  let cells = 0;
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = document.createElement('div');
    d.className = 'cal-day other-month';
    d.innerHTML = `<div class="cal-date">${daysInPrev - i}</div>`;
    grid.appendChild(d);
    cells++;
  }
  
  // Current month
  for (let day = 1; day <= daysInMonth; day++) {
    const d = document.createElement('div');
    const key = `${calYear}-${calMonth + 1}-${day}`;
    const isToday = today.getFullYear() === calYear && today.getMonth() === calMonth && today.getDate() === day;
    const posts = scheduledPosts[key] || [];
    
    d.className = 'cal-day' + (isToday ? ' today' : '') + (posts.length ? ' has-post' : '');
    
    let dots = posts.map(p => {
      const icon = p.plat === 'tw' ? 'x-twitter' : p.plat === 'ig' ? 'instagram' : p.plat === 'yt' ? 'youtube' : 'facebook-f';
      return `<div class="cal-post-dot ${p.plat}"><i class="fa-brands fa-${icon}"></i> ${p.label}</div>`;
    }).join('');
    
    d.innerHTML = `<div class="cal-date">${day}</div>${dots}`;
    d.onclick = () => {
      showToast(posts.length ? `${posts.length} post(s) scheduled on ${monthNames[calMonth]} ${day}` : `Click "New Post" to schedule for ${monthNames[calMonth]} ${day}`);
    };
    grid.appendChild(d);
    cells++;
  }
  
  // Next month days
  const remaining = 42 - cells;
  for (let i = 1; i <= remaining; i++) {
    const d = document.createElement('div');
    d.className = 'cal-day other-month';
    d.innerHTML = `<div class="cal-date">${i}</div>`;
    grid.appendChild(d);
  }
}

function changeMonth(dir) {
  calMonth += dir;
  if (calMonth > 11) {
    calMonth = 0;
    calYear++;
  }
  if (calMonth < 0) {
    calMonth = 11;
    calYear--;
  }
  renderCalendar();
}

let calListViewActive = false;

function toggleCalView() {
  calListViewActive = !calListViewActive;
  
  const calendarView = document.getElementById('calendarView');
  const listView = document.getElementById('listView');
  const btn = document.getElementById('calViewToggle');
  
  if (calendarView) calendarView.style.display = calListViewActive ? 'none' : 'block';
  if (listView) listView.style.display = calListViewActive ? 'block' : 'none';
  
  if (btn) {
    btn.innerHTML = calListViewActive ? '<i class="fa-regular fa-calendar"></i> Calendar View' : '<i class="fa-solid fa-list"></i> List View';
  }
}

function editScheduledPost() {
  showToast('Opening post editor...');
  setTimeout(() => openPostModal(), 400);
}

function deleteScheduledPost(el) {
  if (!el) return;
  const item = el.closest('.sched-item');
  if (item) {
    item.remove();
    showToast('Post removed from schedule');
  }
}

function applyBestTimes() {
  showToast('AI auto-scheduling applied! ✨');
}

// ── PROFILE FUNCTIONS ────────────────────────────
function editProfile() {
  showToast('Profile editor coming soon!');
}

// ── ALL ACTIVITY MODAL FUNCTIONS ─────────────────
let currentActivityFilter = 'all';

function setActivityFilter(el, type) {
  if (!el) return;
  
  currentActivityFilter = type;
  document.querySelectorAll('.activity-filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  
  const items = document.querySelectorAll('#activityFullList .act-full-item');
  items.forEach(item => {
    if (type === 'all' || (item.dataset && item.dataset.type === type)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function filterActivityList(val) {
  const items = document.querySelectorAll('#activityFullList .act-full-item');
  const v = val.toLowerCase();
  
  items.forEach(item => {
    const matchType = currentActivityFilter === 'all' || (item.dataset && item.dataset.type === currentActivityFilter);
    const matchText = !v || (item.dataset && item.dataset.text && item.dataset.text.includes(v));
    
    item.style.display = (matchType && matchText) ? 'flex' : 'none';
  });
}

function exportActivityLog() {
  showToast('Activity log exported successfully! 📥');
}

function loadMoreActivity() {
  showToast('Loading older activity...');
}

// ── LOGIN REDIRECT FIX ─────────────────────────
async function loadUserFromLogin() {
  // For demo purposes, just set default user
  const name = 'Jay Sharma';
  const initials = 'JS';
  
  document.querySelectorAll('.user-name').forEach(el => {
    if (el) el.textContent = name;
  });
  
  const hAvatar = document.getElementById('profileAvatarBtn');
  if (hAvatar && !hAvatar.querySelector('img')) {
    hAvatar.textContent = initials;
  }
  
  const sAvatar = document.querySelector('.sidebar-footer .avatar');
  if (sAvatar && !sAvatar.querySelector('img')) {
    sAvatar.textContent = initials;
  }
  
  const dropName = document.querySelector('.profile-drop-name');
  if (dropName) dropName.textContent = name;
  
  const dropRole = document.querySelector('.profile-drop-role');
  if (dropRole) dropRole.textContent = '@jaysharma';
  
  const pName = document.querySelector('#profileModal .profile-name');
  if (pName) pName.textContent = name;
  
  const pHandle = document.querySelector('#profileModal .profile-handle');
  if (pHandle) pHandle.textContent = '@jaysharma · Creator';
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
  loadUserFromLogin();
  
  // Fix for cancel button
  const cancelBtn = document.querySelector('.res-btn[onclick*="switchSettingsTab"]');
  if (cancelBtn) {
    cancelBtn.setAttribute('onclick', 'closeModal(\'settingsModal\')');
  }
});