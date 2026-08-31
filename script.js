/* =========================================================
   برنامج مؤتمر 2026 — script.js
   Vanilla JS · no build · no dependencies
   Sections: CONFIG · DATA · DOM · STATE · TIME · NAV ·
             SCHEDULE · MODAL · MENU · REVEAL · INIT
   ========================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     CONFIG
  ------------------------------------------------------------------ */
  var CONFIG = {
    tickMs: 45000, // إعادة حساب النشاط الحالي كل ~45 ثانية
    revealStaggerMs: 50,
    revealStaggerMax: 400
  };

  var CATEGORY_LABELS = {
    travel: "تحرّك",
    arrival: "وصول",
    food: "طعام",
    rest: "راحة",
    worship: "تسبيح",
    lecture: "محاضرة",
    workshop: "ورشة عمل",
    activity: "نشاط",
    prayer: "صلاة",
    entertainment: "ترفيه",
    meeting: "اجتماع",
    liturgy: "قداس"
  };

  /* ------------------------------------------------------------------
     DATA — كل بيانات المؤتمر static هنا. لا تُخترع أي معلومة.
     ملاحظة: تاريخ اليوم الأول مؤكد (الأربعاء 2/9/2026).
     تاريخا اليوم الثاني والثالث مُستنتجان من التسلسل فقط
     (2026-09-03 / 2026-09-04) ويُستخدمان داخليًا لتحديد "اليوم الحالي"
     ولا يُعرضان كتاريخ كامل لأنهما غير مؤكدين من المنظم.
  ------------------------------------------------------------------ */
  var conferenceData = {
    name: "برنامج مؤتمر 2026",
    year: "2026",

    teams: [
      { id: 1, no: "1", title: "اكتشاف الجوع", day: "اليوم الأول",
        members: ["ت جيرمين مكرم", "ت نهى", "ت مريم جورج"] },
      { id: 2, no: "2", title: "المعوقات", day: "اليوم الثاني",
        members: ["ت ايرينى نبيل", "ا رامى رجائى", "ت ماريان اشرف", "ت كارولين نبيل", "ت ايمان صالح"] },
      { id: 3, no: "3", title: "الشبع فى القداس", day: "اليوم الثاني",
        members: ["ت ماريان نصر", "ت رشا", "ت ايفا", "ا جرجس تامر"] },
      { id: 4, no: "4", title: "الشبع من خلال كلمة الله", day: "اليوم الثالث",
        members: ["ت عفاف نعيم", "ت مها", "ت عفاف عدلى"] },
      { id: 5, no: "5", title: "الشبع فى الصلاة", day: "اليوم الثالث",
        members: [] }, // أسماء الخدام غير متوفرة في الملف — لا تُعرض قائمة
      { id: "retreat", no: "خلوة", title: "خلوة كتابية", day: "اليوم الثالث",
        members: ["ت مارى", "ت سيلقيا", "أ نوفير"] }
    ],

    topics: [
      { no: "01", title: "اكتشاف الجوع", teamId: 1 },
      { no: "02", title: "المعوقات", teamId: 2 },
      { no: "03", title: "الشبع فى القداس", teamId: 3 },
      { no: "04", title: "الشبع من خلال كلمة الله", teamId: 4 },
      { no: "05", title: "الشبع فى الصلاة", teamId: 5 },
      { no: "06", title: "خلوة كتابية", teamId: "retreat" }
    ],

    venues: ["القاعة الكبيرة", "القاعات", "الجنينة", "قاعات اللعب"],

    days: [
      {
        id: "day1", no: "01", label: "اليوم الأول", weekday: "الأربعاء",
        displayDate: "2 سبتمبر 2026", isoDate: "2026-09-02", dateConfirmed: true,
        sessions: [
          { start: "01:30", end: null, title: "Go Go Go", desc: "التحرّك", category: "travel" },
          { start: "05:00", end: null, title: "بنيوت أفا أنطونيوس", desc: "الوصول لدير الأنبا أنطونيوس", category: "arrival" },
          { start: "05:00", end: "07:00", title: "بينشتى", desc: "القداس أو المغارة", category: "liturgy" },
          { start: "08:00", end: null, title: "Go On", desc: "التحرّك من الدير", category: "travel" },
          { start: "12:00", end: "13:00", title: "Welcome", desc: "الوصول للبيت والتسكين", category: "arrival" },
          { start: "13:00", end: "14:00", title: "هما فى البحر.. احنا فى الجيم", desc: "بحر بنات + لعب أولاد", location: "قاعات اللعب", category: "activity" },
          { start: "14:00", end: "15:00", title: "احنا بقى فى البحر", desc: "بحر أولاد", category: "activity" },
          { start: "15:00", end: "16:00", title: "يلا قبل ما يبرد", desc: "الغذاء", category: "food" },
          { start: "16:00", end: "18:00", title: "Zzzz", desc: "راحة", category: "rest" },
          { start: "18:00", end: "19:30", title: "شارك تانك جامعة", desc: "غروب + شعار + افتتاحية", location: "القاعة الكبيرة", category: "worship" },
          { start: "19:30", end: "21:00", title: "Discovery", desc: "محاضرة 1 (الاكتشاف)", location: "القاعة الكبيرة", teamId: 1, category: "lecture" },
          { start: "21:00", end: "23:30", title: "Activities", desc: "ورشة عمل فنية وعشاء", location: "الجنينة", category: "workshop" },
          { start: "23:30", end: "24:00", title: "تطلق عبدك بسلام", desc: "صلاة النوم", location: "الجنينة", category: "prayer" }
        ]
      },
      {
        id: "day2", no: "02", label: "اليوم الثاني", weekday: "الخميس",
        displayDate: null, isoDate: "2026-09-03", dateConfirmed: false,
        sessions: [
          { start: "08:00", end: "09:00", title: "«فى البدء»", desc: "استيقاظ + باكر", category: "prayer" },
          { start: "09:00", end: "10:00", title: "Fast Food", desc: "فطار", category: "food" },
          { start: "10:00", end: "10:30", title: "شعار وترانيم", desc: null, location: "القاعة الكبيرة", category: "worship" },
          { start: "10:30", end: "13:00", title: "اصل الدنيا دى", desc: "محاضرة 2 (المعوقات) + مجموعة العمل", location: "القاعة الكبيرة والقاعات", teamId: 2, category: "lecture" },
          { start: "13:00", end: "14:00", title: "هما فى البحر.. احنا فى الجيم", desc: "بحر بنات + لعب أولاد", location: "قاعات اللعب", category: "activity" },
          { start: "14:00", end: "15:00", title: "احنا بقى فى البحر", desc: "بحر أولاد", category: "activity" },
          { start: "15:00", end: "16:00", title: "مشوى ولا محمر", desc: "الغذاء", category: "food" },
          { start: "16:00", end: "18:00", title: "Zzzz", desc: "راحة", category: "rest" },
          { start: "18:00", end: "18:30", title: "وعند غروب الشمس", desc: "غروب + شعار", category: "worship" },
          { start: "18:30", end: "19:30", title: "بجسد ودم حقيقى", desc: "محاضرة 3 (القداس)", location: "القاعة الكبيرة", category: "lecture" },
          { start: "19:30", end: "20:00", title: "بريك", desc: null, category: "rest" },
          { start: "20:00", end: "21:00", title: "هافضل ثابت معاك", desc: "مجموعة عمل 3 (القداس)", location: "القاعات", teamId: 3, category: "workshop" },
          { start: "21:00", end: "23:00", title: "Champions", desc: "ألعاب مجموعات الشباب وعشاء", location: "الجنينة", category: "entertainment" },
          { start: "23:00", end: "24:00", title: "قوموا يا بنى النور", desc: "تسبحة", location: "القاعة الكبيرة", category: "worship" }
        ]
      },
      {
        id: "day3", no: "03", label: "اليوم الثالث", weekday: "الجمعة",
        displayDate: null, isoDate: "2026-09-04", dateConfirmed: false,
        sessions: [
          { start: "06:00", end: "08:00", title: "الاقى الروح جواه سماك", desc: "قداس", location: "القاعة الكبيرة", category: "liturgy" },
          { start: "08:00", end: "09:00", title: "Sandwich", desc: "فطار", category: "food" },
          { start: "09:00", end: "09:30", title: "ترانيم وشعار", desc: null, location: "القاعة الكبيرة", category: "worship" },
          { start: "09:30", end: "10:30", title: "كلامك نور لطريقى", desc: "مجموعة ومحاضرة 4 (الكتاب المقدس)", location: "القاعة الكبيرة والقاعات", teamId: 4, category: "lecture" },
          { start: "10:30", end: "11:00", title: "بريك", desc: null, category: "rest" },
          { start: "11:00", end: "12:00", title: "جوة صلاتى", desc: "محاضرة 5 (الصلاة)", location: "القاعات", teamId: 5, category: "lecture" },
          { start: "12:00", end: "14:30", title: "شمر واجرى", desc: "ألعاب على البحر", category: "activity" },
          { start: "14:30", end: "16:00", title: "المرة دى هيبرد", desc: "الغذاء", category: "food" },
          { start: "16:00", end: "18:00", title: "Zzzz", desc: "راحة أو تقسيم بحر بنات ثم أولاد", location: "قاعات اللعب", category: "rest" },
          { start: "18:00", end: "18:30", title: "غروب - ترانيم - شعار", desc: null, location: "القاعة الكبيرة", category: "worship" },
          { start: "18:30", end: "19:30", title: "وهايرشدنى كتابك", desc: "خلوة", location: "القاعة الكبيرة", teamId: "retreat", category: "prayer" },
          { start: "19:30", end: "20:00", title: "All In One", desc: "conclusion", location: "القاعة الكبيرة", category: "meeting" },
          { start: "20:00", end: "20:30", title: "تفتح قلبى", desc: "اجتماع صلاة", location: "القاعة الكبيرة", category: "prayer" },
          { start: "20:30", end: "22:00", title: "جاهز؟", desc: "عشاء وتحضير سمر", location: "الجنينة", category: "food" },
          { start: "22:00", end: "24:00", title: "يلا نبدأ", desc: "سمر", location: "الجنينة", category: "entertainment" }
        ]
      }
    ]
  };

  /* ------------------------------------------------------------------
     DOM REFERENCES
  ------------------------------------------------------------------ */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var dom = {
    heroDay: $("#hero-day"),
    currentCard: $("#current-card"),
    todayNote: $("#today-note"),
    todayList: $("#today-list"),
    dayTabs: $("#day-tabs"),
    programList: $("#program-list"),
    topicsGrid: $("#topics-grid"),
    teamsGrid: $("#teams-grid"),
    venueGrid: $("#venue-grid"),
    nav: $(".nav"),
    navToggle: $(".nav-toggle"),
    navMenu: $("#nav-menu"),
    navLinks: [].slice.call(document.querySelectorAll(".nav-menu a")),
    modal: $("#modal"),
    modalPanel: $(".modal-panel"),
    modalBody: $("#modal-body")
  };

  /* ------------------------------------------------------------------
     STATE
  ------------------------------------------------------------------ */
  var state = {
    activeDay: null,
    menuOpen: false,
    modalOpen: false,
    lastFocused: null
  };

  /* ------------------------------------------------------------------
     DATE / TIME FUNCTIONS
  ------------------------------------------------------------------ */
  function toMinutes(hhmm) {
    if (!hhmm) return null;
    var p = hhmm.split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); // "24:00" -> 1440
  }

  function pad2(n) { return n < 10 ? "0" + n : "" + n; }

  // "HH:MM" (24h, يدعم 24:00) -> "7:30 م"
  function formatTime(hhmm) {
    var mins = toMinutes(hhmm);
    var h24 = Math.floor(mins / 60);
    var m = mins % 60;
    var period = (h24 >= 12 && h24 < 24) ? "م" : "ص"; // 12ظهرًا = م ، 24 (منتصف الليل) = ص
    var h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    return h12 + ":" + pad2(m) + " " + period;
  }

  function formatRange(start, end) {
    if (!end) return formatTime(start);
    return formatTime(start) + " – " + formatTime(end);
  }

  function todayISO(d) {
    d = d || new Date();
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }

  function nowMinutes(d) {
    d = d || new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  // أين نحن من المؤتمر: قبل / أثناء / بعد
  function getPhase() {
    var iso = todayISO();
    var days = conferenceData.days;
    for (var i = 0; i < days.length; i++) {
      if (days[i].isoDate === iso) return { phase: "during", day: days[i] };
    }
    if (iso < days[0].isoDate) return { phase: "before", day: days[0] };
    return { phase: "after", day: days[days.length - 1] };
  }

  // تحليل حالة يوم مقابل وقت معيّن
  function analyzeDay(day, mins) {
    var s = day.sessions;
    for (var i = 0; i < s.length; i++) {
      var st = toMinutes(s[i].start);
      var en = s[i].end ? toMinutes(s[i].end) : st;
      if (mins >= st && mins < en) return { mode: "now", session: s[i] };
    }
    var anyStarted = false, next = null;
    for (var j = 0; j < s.length; j++) {
      var start = toMinutes(s[j].start);
      if (mins >= start) anyStarted = true;
      if (start > mins && !next) next = s[j];
    }
    if (next) return { mode: anyStarted ? "next" : "upcoming", session: next };
    return { mode: "done" };
  }

  // حالة نشاط مفرد (للشارات في القوائم)
  function sessionStatus(session, mins) {
    var st = toMinutes(session.start);
    var en = session.end ? toMinutes(session.end) : st + 1;
    if (mins >= en) return "done";
    if (mins >= st && mins < en) return "now";
    return "upcoming";
  }

  /* ------------------------------------------------------------------
     HELPERS
  ------------------------------------------------------------------ */
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function teamById(id) {
    if (id == null) return null;
    for (var i = 0; i < conferenceData.teams.length; i++) {
      if (conferenceData.teams[i].id === id) return conferenceData.teams[i];
    }
    return null;
  }

  function catLabel(cat) { return CATEGORY_LABELS[cat] || cat || ""; }

  /* ------------------------------------------------------------------
     HERO + CURRENT SESSION CARD
  ------------------------------------------------------------------ */
  function renderHero(info) {
    var d = info.day;
    var text;
    if (info.phase === "during") {
      text = d.label + " • " + d.weekday + (d.dateConfirmed ? " • " + d.displayDate : "");
    } else if (info.phase === "before") {
      text = "يبدأ المؤتمر " + d.weekday + (d.dateConfirmed ? " " + d.displayDate : "") + " — " + d.label;
    } else {
      text = "انتهى المؤتمر بنعمة الله";
    }
    dom.heroDay.textContent = text;
  }

  function ccBlock(label, isLive, title, desc, session) {
    var html = '<p class="cc-status' + (isLive ? " is-live" : "") + '">' +
      (isLive ? '<span class="dot"></span>' : "") + esc(label) + "</p>";
    html += '<p class="cc-title">' + esc(title) + "</p>";
    if (desc) html += '<p class="cc-desc">' + esc(desc) + "</p>";
    if (session) {
      html += '<p class="cc-meta"><span class="cc-time">' + esc(formatRange(session.start, session.end)) + "</span></p>";
      if (session.location) html += '<p class="cc-meta">📍 ' + esc(session.location) + "</p>";
    }
    return html;
  }

  function renderCurrentCard(info) {
    var el = dom.currentCard;
    if (info.phase === "before") {
      var first = info.day.sessions[0];
      el.innerHTML = ccBlock("قبل البداية", false, "أول نشاط في " + info.day.label,
        first.title + (first.desc ? " — " + first.desc : ""), first);
      return;
    }
    if (info.phase === "after") {
      el.innerHTML = ccBlock("تم بنعمة الله", false, "انتهى برنامج المؤتمر", "شكرًا لوجودكم معنا", null);
      return;
    }
    var res = analyzeDay(info.day, nowMinutes());
    if (res.mode === "now") {
      el.innerHTML = ccBlock("يحدث الآن", true, res.session.title, res.session.desc, res.session);
    } else if (res.mode === "upcoming") {
      el.innerHTML = ccBlock("أول نشاط اليوم", false, res.session.title, res.session.desc, res.session);
    } else if (res.mode === "next") {
      el.innerHTML = ccBlock("التالي", false, res.session.title, res.session.desc, res.session);
    } else {
      el.innerHTML = ccBlock("انتهى برنامج اليوم", false, "نشوفكم بكرة", null, null);
    }
  }

  /* ------------------------------------------------------------------
     SCHEDULE RENDERING
  ------------------------------------------------------------------ */
  function sessionCardHTML(session, dayId, idx, liveMins) {
    var team = teamById(session.teamId);
    var tags = "";
    if (session.location) tags += '<span class="tag tag-loc">📍 ' + esc(session.location) + "</span>";
    if (team) tags += '<span class="tag tag-team">' + esc(team.title) + "</span>";
    tags += '<span class="tag tag-cat">' + esc(catLabel(session.category)) + "</span>";

    var stateClass = "", badge = "";
    if (liveMins != null) {
      var st = sessionStatus(session, liveMins);
      if (st === "now") {
        stateClass = " is-now";
        badge = '<span class="session-status is-now"><span class="dot"></span>يحدث الآن</span>';
      } else if (st === "done") {
        stateClass = " is-done";
        badge = '<span class="session-status is-done">انتهى</span>';
      }
    }

    return '<li class="session reveal' + stateClass + '" data-day="' + dayId + '" data-idx="' + idx + '">' +
      '<button class="session-btn" type="button">' +
        '<span class="session-time">' + esc(formatRange(session.start, session.end)) + "</span>" +
        '<span class="session-main">' +
          '<span class="session-title">' + esc(session.title) + "</span>" +
          (session.desc ? '<span class="session-desc">' + esc(session.desc) + "</span>" : "") +
          '<span class="session-tags">' + tags + "</span>" +
        "</span>" +
        badge +
      "</button>" +
    "</li>";
  }

  function renderList(container, day, liveMins) {
    var html = "";
    for (var i = 0; i < day.sessions.length; i++) {
      html += sessionCardHTML(day.sessions[i], day.id, i, liveMins);
    }
    container.innerHTML = html;
    applyStagger(container);
    observeReveals(container);
  }

  function renderTodayList(info) {
    var day = info.day;
    var liveMins = info.phase === "during" ? nowMinutes() : null;
    renderList(dom.todayList, day, liveMins);

    if (info.phase === "before") {
      dom.todayNote.textContent = "المؤتمر لم يبدأ بعد — هذا برنامج " + day.label + ".";
    } else if (info.phase === "after") {
      dom.todayNote.textContent = "انتهى المؤتمر — هذا برنامج " + day.label + ".";
    } else {
      dom.todayNote.textContent = day.label + " • " + day.weekday;
    }
  }

  function renderDayTabs() {
    var html = "";
    conferenceData.days.forEach(function (d, i) {
      html += '<button class="tab" type="button" role="tab" id="tab-' + d.id +
        '" aria-controls="program-list" aria-selected="false" data-day="' + d.id +
        '" tabindex="' + (i === 0 ? "0" : "-1") + '">' + esc(d.label) + "</button>";
    });
    dom.dayTabs.innerHTML = html;
  }

  function setActiveDay(dayId) {
    var day = conferenceData.days.filter(function (d) { return d.id === dayId; })[0];
    if (!day) return;
    state.activeDay = dayId;

    [].slice.call(dom.dayTabs.children).forEach(function (btn) {
      var on = btn.dataset.day === dayId;
      btn.setAttribute("aria-selected", on ? "true" : "false");
      btn.tabIndex = on ? 0 : -1;
    });
    dom.programList.setAttribute("aria-labelledby", "tab-" + dayId);

    var info = getPhase();
    var liveMins = (info.phase === "during" && info.day.id === dayId) ? nowMinutes() : null;
    renderList(dom.programList, day, liveMins);
  }

  /* ------------------------------------------------------------------
     TOPICS / TEAMS / VENUES
  ------------------------------------------------------------------ */
  function renderTopics() {
    var html = "";
    conferenceData.topics.forEach(function (t) {
      html += '<li><button class="topic-card reveal" type="button" data-topic="' + esc(t.no) + '">' +
        '<span class="topic-num">' + esc(t.no) + "</span>" +
        '<span class="topic-title">' + esc(t.title) + "</span>" +
      "</button></li>";
    });
    dom.topicsGrid.innerHTML = html;
    observeReveals(dom.topicsGrid);
  }

  function renderTeams() {
    var html = "";
    conferenceData.teams.forEach(function (team) {
      var body;
      if (team.members.length) {
        body = '<ul class="team-members">' + team.members.map(function (m) {
          return "<li>" + esc(m) + "</li>";
        }).join("") + "</ul>";
      } else {
        body = '<p class="team-empty">لم تُحدَّد أسماء الخدام لهذه المجموعة.</p>';
      }
      var head = (team.no === "خلوة") ? "خلوة" : "مجموعة " + esc(team.no);
      html += '<li><article class="team-card reveal">' +
        '<p class="team-kicker">' + head + " • " + esc(team.day) + "</p>" +
        '<h3 class="team-title">' + esc(team.title) + "</h3>" +
        body +
      "</article></li>";
    });
    dom.teamsGrid.innerHTML = html;
    observeReveals(dom.teamsGrid);
  }

  function renderVenues() {
    dom.venueGrid.innerHTML = conferenceData.venues.map(function (v) {
      return '<li class="venue-item reveal">' + esc(v) + "</li>";
    }).join("");
    observeReveals(dom.venueGrid);
  }

  /* ------------------------------------------------------------------
     MODAL — واحد قابل لإعادة الاستخدام
  ------------------------------------------------------------------ */
  function openModal(html) {
    dom.modalBody.innerHTML = html;
    dom.modal.hidden = false;
    document.body.classList.add("modal-open");
    state.modalOpen = true;
    state.lastFocused = document.activeElement;
    dom.modalPanel.focus();
  }

  function closeModal() {
    if (!state.modalOpen) return;
    dom.modal.hidden = true;
    document.body.classList.remove("modal-open");
    state.modalOpen = false;
    if (state.lastFocused && state.lastFocused.focus) state.lastFocused.focus();
  }

  function trapFocus(e) {
    if (!state.modalOpen || e.key !== "Tab") return;
    var focusable = dom.modalPanel.querySelectorAll(
      'button, a[href], input, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function sessionModalHTML(session) {
    var team = teamById(session.teamId);
    var html = '<span class="modal-kicker">نشاط</span>';
    html += '<h3 id="modal-title">' + esc(session.title) + "</h3>";
    html += '<p class="modal-time">' + esc(formatRange(session.start, session.end)) + "</p>";
    if (session.desc) html += '<p class="modal-desc">' + esc(session.desc) + "</p>";
    if (session.location) html += '<p class="modal-row">📍 <span>' + esc(session.location) + "</span></p>";
    if (team) {
      html += '<p class="modal-row">👥 <span>' + esc(team.no === "خلوة" ? "خلوة" : "مجموعة " + team.no) + " — " + esc(team.title) + "</span></p>";
      if (team.members.length) {
        html += '<ul class="modal-members">' + team.members.map(function (m) {
          return "<li>" + esc(m) + "</li>";
        }).join("") + "</ul>";
      }
    }
    html += '<span class="modal-tag">' + esc(catLabel(session.category)) + "</span>";
    return html;
  }

  function topicModalHTML(topic) {
    var team = teamById(topic.teamId);
    var html = '<span class="modal-kicker">موضوع ' + esc(topic.no) + "</span>";
    html += '<h3 id="modal-title">' + esc(topic.title) + "</h3>";
    if (team) {
      html += '<p class="modal-row">📅 <span>' + esc(team.day) + "</span></p>";
      if (team.members.length) {
        html += '<p class="modal-desc">خدام ' + esc(team.no === "خلوة" ? "الخلوة" : "المجموعة") + ":</p>";
        html += '<ul class="modal-members">' + team.members.map(function (m) {
          return "<li>" + esc(m) + "</li>";
        }).join("") + "</ul>";
      } else {
        html += '<p class="modal-desc">لم تُحدَّد أسماء الخدام لهذه المجموعة.</p>';
      }
    }
    return html;
  }

  function findSession(dayId, idx) {
    var day = conferenceData.days.filter(function (d) { return d.id === dayId; })[0];
    return day ? day.sessions[idx] : null;
  }

  /* ------------------------------------------------------------------
     NAVIGATION — active section via IntersectionObserver
  ------------------------------------------------------------------ */
  function initSectionSpy() {
    var sections = ["home", "program", "topics", "servants", "venue"]
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    if (!("IntersectionObserver" in window) || !sections.length) return;

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        dom.navLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------------------------------
     MOBILE MENU
  ------------------------------------------------------------------ */
  function setMenu(open) {
    state.menuOpen = open;
    dom.nav.classList.toggle("is-open", open);
    dom.navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("modal-open", open || state.modalOpen);
  }

  function initMenu() {
    dom.navToggle.addEventListener("click", function () { setMenu(!state.menuOpen); });
    dom.navMenu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("click", function (e) {
      if (state.menuOpen && !e.target.closest(".nav")) setMenu(false);
    });
  }

  /* ------------------------------------------------------------------
     SCROLL REVEAL
  ------------------------------------------------------------------ */
  var revealObserver = null;
  function initRevealObserver() {
    if (!("IntersectionObserver" in window)) return;
    revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  }

  function observeReveals(ctx) {
    var nodes = (ctx || document).querySelectorAll(".reveal:not(.is-visible)");
    if (!revealObserver) {
      [].forEach.call(nodes, function (n) { n.classList.add("is-visible"); });
      return;
    }
    [].forEach.call(nodes, function (n) { revealObserver.observe(n); });
  }

  function applyStagger(container) {
    [].forEach.call(container.children, function (child, i) {
      var delay = Math.min(i * CONFIG.revealStaggerMs, CONFIG.revealStaggerMax);
      child.style.transitionDelay = delay + "ms";
    });
  }

  /* ------------------------------------------------------------------
     TICK — recompute time-based UI
  ------------------------------------------------------------------ */
  function tick() {
    var info = getPhase();
    renderHero(info);
    renderCurrentCard(info);
    renderTodayList(info);
    // حدّث شارات البرنامج الكامل إن كان اليوم المعروض هو اليوم الحالي
    if (state.activeDay) setActiveDay(state.activeDay);
  }

  /* ------------------------------------------------------------------
     INIT
  ------------------------------------------------------------------ */
  function bindEvents() {
    // فتح مودال النشاط من قائمتَي اليوم/البرنامج الكامل
    [dom.todayList, dom.programList].forEach(function (list) {
      list.addEventListener("click", function (e) {
        var li = e.target.closest(".session");
        if (!li) return;
        var s = findSession(li.dataset.day, parseInt(li.dataset.idx, 10));
        if (s) openModal(sessionModalHTML(s));
      });
    });

    // مودال الموضوعات
    dom.topicsGrid.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-topic]");
      if (!btn) return;
      var topic = conferenceData.topics.filter(function (t) { return t.no === btn.dataset.topic; })[0];
      if (topic) openModal(topicModalHTML(topic));
    });

    // تبويبات الأيام
    dom.dayTabs.addEventListener("click", function (e) {
      var btn = e.target.closest(".tab");
      if (btn) setActiveDay(btn.dataset.day);
    });
    dom.dayTabs.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var tabs = [].slice.call(dom.dayTabs.children);
      var idx = tabs.indexOf(document.activeElement);
      if (idx < 0) return;
      // RTL: السهم الأيسر = التالي
      var dir = e.key === "ArrowLeft" ? 1 : -1;
      var next = tabs[(idx + dir + tabs.length) % tabs.length];
      next.focus();
      setActiveDay(next.dataset.day);
    });

    // إغلاق المودال
    dom.modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (state.modalOpen) closeModal();
        else if (state.menuOpen) setMenu(false);
      }
      trapFocus(e);
    });

    // إعادة حساب النشاط عند العودة للصفحة
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) tick();
    });
    window.addEventListener("focus", tick);
    setInterval(tick, CONFIG.tickMs);
  }

  function init() {
    initRevealObserver();

    var info = getPhase();
    renderHero(info);
    renderCurrentCard(info);

    renderDayTabs();
    renderTodayList(info);
    setActiveDay(info.day.id);

    renderTopics();
    renderTeams();
    renderVenues();

    observeReveals(document);

    initMenu();
    initSectionSpy();
    bindEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
