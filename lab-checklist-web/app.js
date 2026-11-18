const STORAGE_KEY = "lab_checklist_webapp_v1";

const CHECKLIST_SECTIONS = [
  {
    id: "wet_lab",
    mode: "study_day",
    group: "all",
    title: "1. עבודה רטובה והכנות",
    items: [
      { id: "wl_1", text: "הכנת מדבקות למבחנות, כלי למים טרום ימי המחקר" },
      { id: "wl_2", text: "הכנת כוסות השתן - מספר נחקר + זמנים" },
      { id: "wl_3", text: "סידור עמדת הדמים בחוץ - 2 מבחנות מכל סוג, רצועת גומי, פדים אלכוהולים, פלסטרים, גאזות ו-3 מכל סוג מחט, פח מחטים" },
      { id: "wl_4", text: "צידנית עם קרח" },
      { id: "wl_5", text: "כיול יומיזן" },
      { id: "wl_6", text: "הכנת המים המסומנים + מים רגילים" },
      { id: "wl_7", text: "טיימרים לדגימות דם ושתן" }
    ]
  },
  {
    id: "rmr_cart",
    mode: "study_day",
    group: "all",
    title: "2. כיול עגלה מטבולית וביצוע RMR",
    items: [
      { id: "rmr_1", text: "כיול גזים ראשון בבוקר (3 דק׳)" },
      { id: "rmr_2", text: "כיול פלואומטר" },
      { id: "rmr_3", text: "הזנת פרטי הנחקר + חיבור הקנופי והפילטר" },
      { id: "rmr_4", text: "הזזת המיטה" },
      { id: "rmr_5", text: "כיול גזים לפני המבדק" },
      { id: "rmr_6", text: "סגירת בלון גז + העברת הסמפלינג ליין + הדלקת כפתור ירוק" },
      { id: "rmr_7", text: "עמידה ליד העגלה לאורך הבדיקה לווידוא מדדים ונוחות הנחקר" },
      { id: "rmr_8", text: "סיום המבדק - שמירה, כיבוי הכפתור הירוק, חיטוי המיטה והקנופי והחזרת המיטה למקום" }
    ]
  },
  {
    id: "mri_scan",
    mode: "study_day",
    group: "all",
    critical: true,
    badge: { text: "⚠️ ריכוז שיא", type: "critical" },
    title: "3. פיקוח על סריקת MRI",
    items: [
      { id: "mri_1", text: "וידוא שאין מתכות" },
      { id: "mri_2", text: "הסבר על הפסקות נשימה" },
      { id: "mri_3", text: "פיקוח על המיקומים של הטכנאים" }
    ]
  },
  {
    id: "strength_app",
    mode: "study_day",
    group: "strength",
    badge: { text: "קבוצת הכוח בלבד", type: "strength" },
    title: "4. פתיחת מייל ואפליקציה",
    items: [
      { id: "str_1", text: "מייל חדש בוואלה, על קוד הנחקר ומספר הטלפון שלהם" },
      { id: "str_2", text: "הורדת טכנוג׳ים ושיוך למייל החדש" },
      { id: "str_3", text: "עליה למכון כושר ושיוך למכון (סריקת ברקוד שעל המכונה)" }
    ]
  },
  {
    id: "food_logs",
    mode: "study_day",
    group: "all",
    badge: { text: "לכלל הנחקרים", type: "all" },
    title: "5. רישומי אכילה",
    items: [
      { id: "food_1", text: "הסבר מלא על רישומי אכילה (לכולם)" }
    ]
  },
  {
    id: "scheduling",
    mode: "routine",
    group: "all",
    title: "1. תיאום ימי מחקר ותזכורות לנחקרים",
    items: [
      { id: "sch_1", text: "תיאום תאריכי שיחות גיוס" },
      { id: "sch_2", text: "תיאום ימי מחקר" },
      { id: "sch_3", text: "שליחת הודעות תזכורת על ימי מפגש, רישומי אכילה והיענות להתערבות" }
    ]
  },
  {
    id: "file_management",
    mode: "routine",
    group: "all",
    title: "2. שמירה על סידור הקבצים",
    items: [
      { id: "file_1", text: "הזנת דגימות בקובץ דגימות + שליחה בקבוצה" },
      { id: "file_2", text: "קובץ משתתפי מחקר - קוד נחקר + ראשי תיבות אמיתיים באנגלית + שיוך לקבוצה + תאריכי מפגשים וסריקות MRI" }
    ]
  }
];

function today() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

const defaultState = {
  mode: "study_day",
  studyGroup: "strength",
  subjectCode: "",
  visitDate: today(),
  checked: {},
  collapsed: {},
  notes: ""
};

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(raw) };
  } catch (e) {
    return { ...defaultState };
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Storage unavailable", e);
  }
}

function loadLocal(k, f) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch (e) { return f; } }
function saveLocal(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

let toastT;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastT);
  toastT = setTimeout(() => (t.hidden = true), 2600);
}

/* ---------- backup (everything lives only on this device) ---------- */
function fmtDate(iso) {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${+d}.${+m}.${y}`;
}

function renderBackup() {
  const lb = loadLocal("lastBackup", null);
  const old = !lb || Date.now() - new Date(lb) > 30 * 864e5;
  document.getElementById("dataCard").classList.toggle("warn", old);
  document.getElementById("backupText").textContent =
    "כל הנתונים נשמרים רק במכשיר הזה. " +
    (lb ? `גיבוי אחרון: ${fmtDate(lb)}. ` : "עדיין לא נשמר גיבוי. ") +
    "כדאי לשמור קובץ גיבוי מדי פעם (ל-Files, iCloud או במייל) כדי לא לאבד נתונים.";
}

async function saveBackup() {
  const data = { app: "lab-checklist", version: 1, exportedAt: new Date().toISOString(), state };
  const name = `lab-checklist-backup-${today()}.json`;
  const file = new File([JSON.stringify(data, null, 1)], name, { type: "application/json" });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: name });
    } else {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    }
    saveLocal("lastBackup", new Date().toISOString());
    renderBackup();
    toast("הגיבוי נשמר");
  } catch (e) {
    if (e && e.name !== "AbortError") toast("לא הצלחנו לשמור את קובץ הגיבוי.");
  }
}

function loadBackup() {
  const fi = document.createElement("input");
  fi.type = "file";
  fi.accept = ".json,application/json";
  fi.onchange = () => {
    const f = fi.files[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const d = JSON.parse(rd.result);
        if (d.app !== "lab-checklist" || !d.state || typeof d.state !== "object") throw 0;
        state = { ...defaultState, ...d.state };
        saveState();
        render();
        toast("הגיבוי שוחזר");
      } catch (e) {
        toast("הקובץ הזה אינו גיבוי של הצ׳ק ליסט.");
      }
    };
    rd.readAsText(f);
  };
  fi.click();
}

function getVisibleSections() {
  return CHECKLIST_SECTIONS.filter((sec) => {
    if (sec.mode !== state.mode) return false;
    if (state.mode === "study_day" && sec.group !== "all" && sec.group !== state.studyGroup) {
      return false;
    }
    return true;
  });
}

function render() {
  // Update primary tabs
  document.querySelectorAll(".primary-tab").forEach((btn) => {
    const isActive = btn.dataset.mode === state.mode;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", String(isActive));
  });

  // Toggle study controls card
  const studyControls = document.getElementById("studyControls");
  studyControls.classList.toggle("hidden", state.mode !== "study_day");

  // Update group buttons
  document.querySelectorAll(".seg-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.group === state.studyGroup);
  });

  // Sync inputs
  document.getElementById("subjectCode").value = state.subjectCode || "";
  document.getElementById("visitDate").value = state.visitDate || "";
  document.getElementById("sessionNotes").value = state.notes || "";

  // Render sections
  const container = document.getElementById("checklistContainer");
  container.innerHTML = "";

  const visibleSections = getVisibleSections();
  let totalItems = 0;
  let completedItems = 0;

  visibleSections.forEach((section) => {
    const sectionTotal = section.items.length;
    const sectionDone = section.items.filter((item) => Boolean(state.checked[item.id])).length;
    totalItems += sectionTotal;
    completedItems += sectionDone;

    const isAllDone = sectionTotal > 0 && sectionDone === sectionTotal;
    const isCollapsed = Boolean(state.collapsed[section.id]);

    const card = document.createElement("article");
    card.className = [
      "section-card",
      isAllDone ? "completed-card" : "",
      section.critical ? "critical-card" : "",
      isCollapsed ? "collapsed" : ""
    ].filter(Boolean).join(" ");

    const header = document.createElement("div");
    header.className = "section-header";
    header.addEventListener("click", () => {
      state.collapsed[section.id] = !state.collapsed[section.id];
      saveState();
      render();
    });

    const titleWrap = document.createElement("div");
    titleWrap.className = "section-title-wrap";

    const h2 = document.createElement("h2");
    h2.className = "section-title";
    h2.textContent = section.title;
    titleWrap.appendChild(h2);

    if (section.badge) {
      const badge = document.createElement("span");
      badge.className = `pill pill-${section.badge.type}`;
      badge.textContent = section.badge.text;
      titleWrap.appendChild(badge);
    }

    const meta = document.createElement("div");
    meta.className = "section-meta";
    meta.innerHTML = `<span>${sectionDone}/${sectionTotal}</span><span class="chevron">▼</span>`;

    header.appendChild(titleWrap);
    header.appendChild(meta);
    card.appendChild(header);

    const ul = document.createElement("ul");
    ul.className = "task-list";

    section.items.forEach((item) => {
      const isChecked = Boolean(state.checked[item.id]);
      const li = document.createElement("li");
      li.className = `task-item ${isChecked ? "checked" : ""}`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-checkbox";
      checkbox.checked = isChecked;
      checkbox.id = `chk_${item.id}`;

      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = item.text;

      li.addEventListener("click", (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
        state.checked[item.id] = checkbox.checked;
        saveState();
        render();
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      ul.appendChild(li);
    });

    card.appendChild(ul);
    container.appendChild(card);
  });

  // Update progress bar
  const pct = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
  document.getElementById("progressLabel").textContent =
    state.mode === "study_day"
      ? `התקדמות יום מחקר (${state.studyGroup === "strength" ? "קבוצת הכוח" : "CR / TRE"})`
      : "התקדמות עבודה שוטפת";
  document.getElementById("progressStats").textContent = `${completedItems} / ${totalItems} הושלמו (${pct}%)`;
  document.getElementById("progressFill").style.width = `${pct}%`;
}

// Event Listeners
document.querySelectorAll(".primary-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.mode = btn.dataset.mode;
    saveState();
    render();
  });
});

document.querySelectorAll(".seg-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.studyGroup = btn.dataset.group;
    saveState();
    render();
  });
});

document.getElementById("subjectCode").addEventListener("input", (e) => {
  state.subjectCode = e.target.value;
  saveState();
});

document.getElementById("visitDate").addEventListener("input", (e) => {
  state.visitDate = e.target.value;
  saveState();
});

document.getElementById("sessionNotes").addEventListener("input", (e) => {
  state.notes = e.target.value;
  saveState();
});

document.getElementById("backupSave").addEventListener("click", saveBackup);
document.getElementById("backupLoad").addEventListener("click", loadBackup);

document.getElementById("printBtn").addEventListener("click", () => {
  window.print();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  const modeLabel = state.mode === "study_day" ? "ימי המחקר" : "העבודה השוטפת";
  if (!confirm(`לאפס את כל הסימונים בלשונית ${modeLabel}?`)) return;
  getVisibleSections().forEach((sec) => {
    sec.items.forEach((item) => {
      delete state.checked[item.id];
    });
  });
  if (state.mode === "study_day") {
    state.subjectCode = "";
  }
  saveState();
  render();
});

render();
renderBackup();

/* ---------- offline support ---------- */
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
