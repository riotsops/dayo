let calendarDate = new Date();

const vibes = {
  morning: ["a calm beginning", "a gentle start", "a quiet dawn"],
  afternoon: ["a steady afternoon", "keep moving gently", "halfway through"],
  evening: ["a peaceful evening", "the day winds down", "time to breathe"],
  night: ["a quiet night", "rest is coming", "the world grows still"]
};

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// REGISTER SERVICE WORKER
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(reg) {
        console.log('SW registered');
      })
      .catch(function(err) {
        console.log('SW error:', err);
      });
  });
}

// REQUEST NOTIFICATIONS
function requestNotifications() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    scheduleNotifications();
    return;
  }
  if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(function(permission) {
      if (permission === 'granted') {
        scheduleNotifications();
      }
    });
  }
}

function scheduleNotifications() {
  const mood = localStorage.getItem('dayo_mood') || 'peaceful';
  const list = messages[mood] || messages['peaceful'];
  const msg = list[Math.floor(Math.random() * list.length)];

  // morning notification at 8 AM
  const now = new Date();
  const morning = new Date();
  morning.setHours(8, 0, 0, 0);
  if (morning <= now) morning.setDate(morning.getDate() + 1);
  const morningDelay = morning - now;

  setTimeout(function() {
    if (Notification.permission === 'granted') {
      new Notification('Dayo — good morning', {
        body: msg,
        icon: '/icon.png'
      });
    }
  }, morningDelay);

  // evening notification at 8 PM
  const evening = new Date();
  evening.setHours(20, 0, 0, 0);
  if (evening <= now) evening.setDate(evening.getDate() + 1);
  const eveningDelay = evening - now;

  setTimeout(function() {
    if (Notification.permission === 'granted') {
      new Notification('Dayo — evening reflection', {
        body: 'how did today feel? take a moment to reflect.',
        icon: '/icon.png'
      });
    }
  }, eveningDelay);
}

window.onload = function() {
  document.getElementById('btn-start').onclick = function() {
    const name = document.getElementById('user-name').value.trim();
    const age = document.getElementById('user-age').value.trim();
    if (!name) { alert('tell us your name first'); return; }
    if (!age) { alert('tell us your age'); return; }
    localStorage.setItem('dayo_user', name);
    localStorage.setItem('dayo_age', age);
    localStorage.setItem('dayo_mood', 'peaceful');
    localStorage.setItem('dayo_setup_done', 'yes');
    startApp();
  };

  if (localStorage.getItem('dayo_user')) {
    startApp();
  }
};

function startApp() {
  const name = localStorage.getItem('dayo_user');
  const mood = localStorage.getItem('dayo_mood') || 'peaceful';
  const tod = getTimeOfDay();

  const greetings = {
    morning: ['good morning, ' + name + '.', 'rise gently, ' + name + '.', 'morning, ' + name + '.'],
    afternoon: ['afternoon, ' + name + '.', 'hope today is kind, ' + name + '.', 'hey ' + name + '.'],
    evening: ['evening, ' + name + '.', 'welcome back, ' + name + '.', 'good evening, ' + name + '.'],
    night: ['quiet night, ' + name + '.', 'hope today was enough, ' + name + '.', 'hey ' + name + '.']
  };

  document.getElementById('greeting-text').textContent = getRandom(greetings[tod]);
  const now = new Date();
  document.getElementById('home-date').textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  document.getElementById('home-vibe').textContent = getRandom(vibes[tod]);

  loadMessage(mood);

  document.querySelectorAll('.mood-pill').forEach(function(p) {
    p.classList.toggle('active', p.dataset.mood === mood);
  });

  updateStreak();
  loadTodayCheck();
  requestNotifications();

  showScreen('screen-home');
  document.getElementById('bottom-nav').classList.add('visible');
}

function loadMessage(mood) {
  const list = messages[mood] || messages['peaceful'];
  const start = new Date('2024-01-01');
  const today = new Date();
  const dayNumber = Math.floor((today - start) / 86400000);
  const idx = dayNumber % list.length;
  const msg = list[idx];
  document.getElementById('message-text').textContent = msg;
  document.getElementById('message-mood-tag').textContent = mood;

  const saved = getSaved();
  const isSaved = saved.find(function(s) { return s.text === msg; });
  const btn = document.getElementById('save-btn');
  btn.classList.toggle('active', !!isSaved);
  btn.querySelector('span').textContent = isSaved ? '♥' : '♡';
}

function switchMood(mood) {
  localStorage.setItem('dayo_mood', mood);
  document.querySelectorAll('.mood-pill').forEach(function(p) {
    p.classList.toggle('active', p.dataset.mood === mood);
  });
  loadMessage(mood);
}

function newMessage() {
  const mood = localStorage.getItem('dayo_mood') || 'peaceful';
  const list = messages[mood] || messages['peaceful'];
  const idx = Math.floor(Math.random() * list.length);
  const el = document.getElementById('message-text');
  el.style.transition = 'opacity 0.3s';
  el.style.opacity = '0';
  setTimeout(function() {
    const msg = list[idx];
    el.textContent = msg;
    el.style.opacity = '1';
    const saved = getSaved();
    const isSaved = saved.find(function(s) { return s.text === msg; });
    const btn = document.getElementById('save-btn');
    btn.classList.toggle('active', !!isSaved);
    btn.querySelector('span').textContent = isSaved ? '♥' : '♡';
  }, 300);
}

function saveMessage() {
  const text = document.getElementById('message-text').textContent;
  const mood = localStorage.getItem('dayo_mood') || 'peaceful';
  const saved = getSaved();
  const already = saved.find(function(s) { return s.text === text; });
  if (already) return;
  saved.push({ text: text, mood: mood, date: new Date().toDateString() });
  localStorage.setItem('dayo_saved', JSON.stringify(saved));
  const btn = document.getElementById('save-btn');
  btn.classList.add('active');
  btn.querySelector('span').textContent = '♥';
}

function shareMessage() {
  const text = document.getElementById('message-text').textContent;
  if (navigator.share) {
    navigator.share({ text: '"' + text + '" — Dayo' });
  } else {
    navigator.clipboard.writeText('"' + text + '" — Dayo');
    alert('copied to clipboard');
  }
}

function getSaved() {
  return JSON.parse(localStorage.getItem('dayo_saved') || '[]');
}

function updateStreak() {
  const today = getTodayKey();
  const yesterday = getKeyFromDate(new Date(Date.now() - 86400000));
  let streak = parseInt(localStorage.getItem('dayo_streak') || '0');
  const lastOpen = localStorage.getItem('dayo_last_open');
  if (lastOpen === today) {
  } else if (lastOpen === yesterday) {
    streak += 1;
    localStorage.setItem('dayo_streak', streak);
  } else {
    streak = 1;
    localStorage.setItem('dayo_streak', streak);
  }
  localStorage.setItem('dayo_last_open', today);
  document.getElementById('streak-number').textContent = streak;
  const msgs = ['quiet days reflected', 'mornings opened', 'days shown up for', 'gentle check-ins'];
  document.getElementById('streak-text').textContent = getRandom(msgs);
}

function markDay(type) {
  const today = getTodayKey();
  const data = getDayData(today);
  data.mood = type;
  saveDayData(today, data);
  document.getElementById('btn-good').classList.toggle('active', type === 'good');
  document.getElementById('btn-bad').classList.toggle('active', type === 'bad');
  document.getElementById('journal-box').classList.add('visible');
}

function loadTodayCheck() {
  const data = getDayData(getTodayKey());
  if (data.mood) {
    document.getElementById('btn-good').classList.toggle('active', data.mood === 'good');
    document.getElementById('btn-bad').classList.toggle('active', data.mood === 'bad');
    document.getElementById('journal-box').classList.add('visible');
  }
  if (data.journal) {
    document.getElementById('journal-input').value = data.journal;
  }
  const tod = getTimeOfDay();
  const labels = {
    morning: 'how are you feeling this morning?',
    afternoon: 'how is today going?',
    evening: 'how was your day?',
    night: 'how did today feel?'
  };
  document.getElementById('reflection-label').textContent = labels[tod];
}

function saveJournal() {
  const today = getTodayKey();
  const data = getDayData(today);
  data.journal = document.getElementById('journal-input').value;
  saveDayData(today, data);
  document.getElementById('journal-input').blur();
  const btn = document.querySelector('.btn-ghost');
  btn.textContent = 'saved ✓';
  btn.style.color = 'var(--good)';
  btn.style.borderColor = 'var(--good)';
  setTimeout(function() {
    btn.textContent = 'save quietly →';
    btn.style.color = '';
    btn.style.borderColor = '';
  }, 2000);
}

function showCalendar() { renderCalendar(); }

function changeMonth(dir) {
  calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + dir, 1);
  renderCalendar();
}

function renderCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  document.getElementById('cal-month-label').textContent =
    calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';
  ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(function(d) {
    const el = document.createElement('div');
    el.className = 'cal-day-name';
    el.textContent = d;
    grid.appendChild(el);
  });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  for (let i = 0; i < firstDay; i++) {
    const e = document.createElement('div');
    e.className = 'cal-day empty';
    grid.appendChild(e);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const key = getKeyFromDate(dateObj);
    const data = getDayData(key);
    const el = document.createElement('div');
    el.className = 'cal-day';
    if (dateObj.toDateString() === today.toDateString()) el.classList.add('today');
    if (data.mood === 'good') el.classList.add('has-good');
    if (data.mood === 'bad') el.classList.add('has-bad');
    el.innerHTML = '<span>' + d + '</span>';
    if (data.mood) {
      const dot = document.createElement('div');
      dot.className = 'cal-dot ' + data.mood;
      el.appendChild(dot);
    }
    el.addEventListener('click', function() { openDayDetail(key, dateObj); });
    grid.appendChild(el);
  }
}

function openDayDetail(key, dateObj) {
  const data = getDayData(key);
  document.getElementById('detail-date').textContent =
    dateObj.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });
  document.getElementById('detail-mood').textContent =
    data.mood ? (data.mood === 'good' ? '✓ good day' : '✗ hard day') : 'no check-in recorded';
  document.getElementById('detail-journal').value = data.journal || '';
  document.getElementById('detail-journal').dataset.key = key;
  showScreen('screen-day-detail');
}

function saveDetailJournal() {
  const key = document.getElementById('detail-journal').dataset.key;
  const data = getDayData(key);
  data.journal = document.getElementById('detail-journal').value;
  saveDayData(key, data);
  showScreen('screen-calendar');
}

function loadSaved() {
  const saved = getSaved();
  const list = document.getElementById('saved-list');
  list.innerHTML = '';
  if (!saved.length) {
    list.innerHTML = '<div class="saved-empty"><div class="saved-empty-icon">♡</div>nothing saved yet...<br>messages that touch you<br>will find their way here.</div>';
    return;
  }
  saved.slice().reverse().forEach(function(s) {
    const card = document.createElement('div');
    card.className = 'saved-card';
    card.innerHTML = '<p>' + s.text + '</p><small>' + s.mood + ' · ' + s.date + '</small>';
    list.appendChild(card);
  });
}

function openSettings() {
  document.getElementById('settings-name').value = localStorage.getItem('dayo_user') || '';
  document.getElementById('settings-age').value = localStorage.getItem('dayo_age') || '';
}

function saveName() {
  const name = document.getElementById('settings-name').value.trim();
  if (!name) { alert('name cannot be empty'); return; }
  localStorage.setItem('dayo_user', name);
  const btn = document.getElementById('btn-save-name');
  btn.textContent = 'saved ✓';
  btn.style.color = 'var(--good)';
  setTimeout(function() {
    btn.textContent = 'update name';
    btn.style.color = '';
  }, 2000);
}

function saveAge() {
  const age = document.getElementById('settings-age').value.trim();
  if (!age) { alert('age cannot be empty'); return; }
  localStorage.setItem('dayo_age', age);
  const btn = document.getElementById('btn-save-age');
  btn.textContent = 'saved ✓';
  btn.style.color = 'var(--good)';
  setTimeout(function() {
    btn.textContent = 'update age';
    btn.style.color = '';
  }, 2000);
}

function clearAllData() {
  if (confirm('this will delete everything. are you sure?')) {
    localStorage.clear();
    location.reload();
  }
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function(s) {
    s.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(function(b) {
    b.classList.remove('active');
  });
  if (id === 'screen-home') document.getElementById('nav-home').classList.add('active');
  if (id === 'screen-calendar') { document.getElementById('nav-calendar').classList.add('active'); showCalendar(); }
  if (id === 'screen-saved') { document.getElementById('nav-saved').classList.add('active'); loadSaved(); }
  if (id === 'screen-settings') { openSettings(); }
}

function getTodayKey() { return getKeyFromDate(new Date()); }
function getKeyFromDate(d) { return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(); }
function getDayData(key) { return JSON.parse(localStorage.getItem('dayo_day_' + key) || '{}'); }
function saveDayData(key, data) { localStorage.setItem('dayo_day_' + key, JSON.stringify(data)); }

// BREATHING
let breathInterval = null;
let breathRunning = false;

function startBreathing() {
  if (breathRunning) {
    stopBreathing();
    return;
  }
  breathRunning = true;
  const btn = document.getElementById('breath-start-btn');
  btn.textContent = 'stop';
  btn.classList.add('running');
  const circle = document.getElementById('breathing-circle');
  const instruction = document.getElementById('breathing-instruction');
  const phase = document.getElementById('breathing-phase');
  const count = document.getElementById('breathing-count');
  const phases = [
    { name: 'breathe in', cls: 'inhale', duration: 4 },
    { name: 'hold', cls: 'hold', duration: 4 },
    { name: 'breathe out', cls: 'exhale', duration: 4 }
  ];
  let phaseIndex = 0;
  let secondsLeft = phases[0].duration;
  function runPhase() {
    const current = phases[phaseIndex];
    circle.className = 'breathing-circle ' + current.cls;
    instruction.textContent = current.name;
    phase.textContent = current.name;
    secondsLeft = current.duration;
    count.textContent = secondsLeft;
    breathInterval = setInterval(function() {
      secondsLeft--;
      count.textContent = secondsLeft;
      if (secondsLeft <= 0) {
        clearInterval(breathInterval);
        phaseIndex = (phaseIndex + 1) % phases.length;
        if (breathRunning) runPhase();
      }
    }, 1000);
  }
  runPhase();
}

function stopBreathing() {
  breathRunning = false;
  clearInterval(breathInterval);
  const circle = document.getElementById('breathing-circle');
  const instruction = document.getElementById('breathing-instruction');
  const phase = document.getElementById('breathing-phase');
  const count = document.getElementById('breathing-count');
  const btn = document.getElementById('breath-start-btn');
  circle.className = 'breathing-circle';
  instruction.textContent = 'tap to begin';
  phase.textContent = '';
  count.textContent = '';
  btn.textContent = 'begin';
  btn.classList.remove('running');
  showScreen('screen-home');
}

/* =====================
   AUTO THEME
   ===================== */
function applyTheme() {
  const h = new Date().getHours();
  const isLight = h >= 6 && h < 18;
  if (isLight) {
    document.body.classList.add('light');
  } else {
    document.body.classList.remove('light');
  }
}

// apply on load and every 30 minutes
applyTheme();
setInterval(applyTheme, 30 * 60 * 1000);
