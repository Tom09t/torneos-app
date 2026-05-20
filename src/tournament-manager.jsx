import { useState, useEffect, useCallback } from "react";

/* ─── Google Fonts ─────────────────────────────────────── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap";
document.head.appendChild(fontLink);

/* ─── CSS ───────────────────────────────────────────────── */
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .tm-root {
    --bg:       #0f1014;
    --bg2:      #16181d;
    --bg3:      #1e2028;
    --border:   #2a2d35;
    --border2:  #363a45;
    --text:     #e8eaf0;
    --muted:    #7a7f90;
    --accent:   #d4a843;
    --accent2:  #b8902e;
    --green:    #2e7d4f;
    --greenBg:  #0d2a1a;
    --red:      #9b2335;
    --redBg:    #2a0d14;
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    padding: 28px 20px 80px;
  }

  .tm-root * { font-family: inherit; }

  .display { font-family: 'Barlow Condensed', sans-serif; }

  /* Layout */
  .page { max-width: 760px; margin: 0 auto; }

  /* Header */
  .top-bar {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 32px;
  }
  .app-wordmark {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 26px; font-weight: 800; letter-spacing: 1px;
    color: var(--text); flex: 1;
  }
  .app-wordmark span { color: var(--accent); }

  /* Buttons */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    border: none; border-radius: 6px; cursor: pointer;
    font-size: 13px; font-weight: 500; transition: opacity .15s, transform .1s;
  }
  .btn:active { transform: scale(.97); }
  .btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }

  .btn-primary {
    background: var(--accent); color: #0f1014;
    padding: 9px 18px; font-weight: 600;
  }
  .btn-primary:hover:not(:disabled) { background: #e0b555; }

  .btn-ghost {
    background: transparent; color: var(--muted);
    border: 1px solid var(--border2); padding: 8px 14px;
  }
  .btn-ghost:hover { color: var(--text); border-color: var(--accent); }

  .btn-danger {
    background: var(--redBg); color: #e07070;
    border: 1px solid var(--red); padding: 7px 14px;
  }
  .btn-danger:hover { background: #3a1020; }

  .btn-icon {
    background: transparent; color: var(--muted);
    border: 1px solid var(--border); padding: 7px 10px; border-radius: 6px;
    font-size: 15px; line-height: 1;
  }
  .btn-icon:hover { color: var(--red); border-color: var(--red); }

  .btn-sm {
    padding: 5px 12px; font-size: 12px;
    background: var(--accent); color: #0f1014;
    font-weight: 600;
  }
  .btn-sm:hover:not(:disabled) { background: #e0b555; }
  .btn-sm:disabled { background: var(--bg3); color: var(--muted); }

  /* Cards */
  .card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 22px 24px;
    margin-bottom: 14px;
  }
  .card-accent {
    border-left: 3px solid var(--accent);
    padding-left: 21px;
  }

  /* Tournament list item */
  .t-item {
    background: var(--bg2); border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    border-radius: 10px; padding: 18px 20px;
    display: flex; align-items: center; gap: 14px;
    cursor: pointer; transition: border-color .15s, background .15s;
    margin-bottom: 10px;
  }
  .t-item:hover { background: var(--bg3); border-color: var(--accent2); }
  .t-item-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 20px; font-weight: 700; letter-spacing: .3px;
  }
  .t-item-meta { font-size: 12px; color: var(--muted); margin-top: 3px; }

  /* Status badge */
  .badge {
    font-size: 11px; font-weight: 600; letter-spacing: .5px;
    padding: 3px 10px; border-radius: 20px; white-space: nowrap;
    text-transform: uppercase;
  }
  .badge-pending  { background: #1e2028; color: var(--muted); border: 1px solid var(--border2); }
  .badge-groups   { background: #0d2a1a; color: #4caf7d; border: 1px solid var(--green); }
  .badge-playoffs { background: #1e1628; color: #9b7fe8; border: 1px solid #4a3580; }
  .badge-finished { background: #1e1800; color: var(--accent); border: 1px solid var(--accent2); }

  /* Section title */
  .section-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 18px; font-weight: 700; letter-spacing: .5px;
    color: var(--text); margin-bottom: 14px;
  }
  .section-title span { color: var(--accent); }

  /* Form */
  .form-label {
    display: block; font-size: 11px; font-weight: 600;
    letter-spacing: .8px; text-transform: uppercase;
    color: var(--muted); margin-bottom: 7px;
  }
  .form-input {
    width: 100%; background: var(--bg3);
    border: 1px solid var(--border2); border-radius: 7px;
    padding: 10px 13px; font-size: 14px; color: var(--text);
    margin-bottom: 18px; outline: none; transition: border-color .15s;
  }
  .form-input:focus { border-color: var(--accent); }
  .form-input::placeholder { color: var(--muted); }

  /* Pill toggle buttons */
  .pill-group { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
  .pill {
    padding: 8px 16px; border-radius: 6px; cursor: pointer;
    font-size: 13px; font-weight: 500; transition: all .15s;
    background: var(--bg3); border: 1px solid var(--border2);
    color: var(--muted);
  }
  .pill:hover { border-color: var(--accent); color: var(--text); }
  .pill.active {
    background: var(--accent); color: #0f1014;
    border-color: var(--accent); font-weight: 700;
  }

  /* Team grid */
  .team-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 8px; margin-bottom: 8px;
  }
  .team-input {
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: 6px; padding: 8px 10px;
    font-size: 13px; color: var(--text); width: 100%;
    outline: none; transition: border-color .15s;
  }
  .team-input:focus { border-color: var(--accent); }
  .team-input::placeholder { color: #3a3e4a; }
  .team-input.dup { border-color: var(--red); background: var(--redBg); color: #f0a0a0; }
  .team-input.dup:focus { border-color: #e07070; }
  .dup-warning {
    font-size: 11px; font-weight: 600; color: #e07070;
    letter-spacing: .3px; margin: -4px 0 10px;
    display: flex; align-items: center; gap: 4px;
  }

  /* Tabs */
  .tab-bar {
    display: flex; border-bottom: 1px solid var(--border);
    margin-bottom: 18px; gap: 0;
  }
  .tab-btn {
    padding: 10px 20px; background: none; border: none;
    cursor: pointer; font-size: 13px; font-weight: 500;
    color: var(--muted); border-bottom: 2px solid transparent;
    margin-bottom: -1px; transition: color .15s, border-color .15s;
  }
  .tab-btn:hover { color: var(--text); }
  .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 600; }

  /* Standings table */
  .standings-table {
    width: 100%; border-collapse: collapse;
    font-size: 13px; margin-bottom: 4px;
  }
  .standings-table th {
    text-align: center; padding: 5px 8px;
    color: var(--muted); font-size: 11px; font-weight: 600;
    letter-spacing: .6px; text-transform: uppercase;
    border-bottom: 1px solid var(--border);
  }
  .standings-table th:first-child { text-align: left; padding-left: 0; }
  .standings-table td {
    padding: 7px 8px; text-align: center;
    border-bottom: 1px solid var(--border);
    font-variant-numeric: tabular-nums;
  }
  .standings-table td:first-child { text-align: left; padding-left: 0; }
  .standings-table tr.qualifier td { color: var(--text); }
  .standings-table tr.qualifier td:first-child { font-weight: 600; }
  .standings-table tr:not(.qualifier) td { color: var(--muted); }
  .pts-cell { font-family: 'Barlow Condensed', sans-serif; font-size: 16px; font-weight: 700; color: var(--accent) !important; }

  .qualifier-dot {
    display: inline-block; width: 6px; height: 6px;
    border-radius: 50%; background: var(--accent);
    margin-right: 7px; vertical-align: middle;
  }

  /* Match row (playoffs) */
  .match-row {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 0; border-bottom: 1px solid var(--border);
  }
  .match-row:last-child { border-bottom: none; }
  .match-team {
    flex: 1; font-size: 13px; font-weight: 500;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    min-width: 60px;
  }
  .match-team.winner {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 15px; font-weight: 700; color: var(--accent);
  }
  .match-team.right { text-align: right; }
  .match-sep { color: var(--border2); font-size: 12px; flex-shrink: 0; }
  .goal-input {
    width: 42px; padding: 5px 6px; text-align: center;
    background: var(--bg3); border: 1px solid var(--border2);
    border-radius: 5px; font-size: 14px; color: var(--text);
    outline: none; transition: border-color .15s;
    font-variant-numeric: tabular-nums;
  }
  .goal-input:focus { border-color: var(--accent); }
  .goal-input:disabled { opacity: .4; }
  .done-badge {
    padding: 3px 10px; background: var(--greenBg); color: #4caf7d;
    border: 1px solid var(--green); border-radius: 20px;
    font-size: 11px; font-weight: 700; letter-spacing: .5px;
    flex-shrink: 0;
  }

  /* Match card (groups fixture) */
  .match-card-item {
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: 8px; padding: 14px 16px; margin-bottom: 8px;
    display: flex; align-items: center; gap: 12px;
    transition: border-color .15s;
  }
  .match-card-item:last-child { margin-bottom: 0; }
  .match-card-item.done { border-color: var(--border2); }
  .match-card-name {
    flex: 1; font-size: 14px; font-weight: 500;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .match-card-name.right { text-align: right; }
  .match-card-name.winner {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 16px; font-weight: 700; color: var(--accent);
  }
  .match-card-name.loser { color: var(--muted); }
  .match-card-scores {
    display: flex; align-items: center; gap: 8px; flex-shrink: 0;
  }
  .match-card-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 26px; font-weight: 700; min-width: 28px; text-align: center;
    line-height: 1;
  }
  .match-card-num.winner { color: var(--accent); }
  .match-card-num.loser { color: var(--muted); }
  .match-card-num.draw { color: var(--text); }
  .match-card-sep { color: var(--border2); font-size: 16px; }
  .match-card-input {
    width: 48px; padding: 6px 8px; text-align: center;
    background: var(--bg2); border: 1px solid var(--border2);
    border-radius: 6px; font-size: 20px; font-weight: 700;
    font-family: 'Barlow Condensed', sans-serif;
    color: var(--text); outline: none; transition: border-color .15s;
    font-variant-numeric: tabular-nums;
  }
  .match-card-input:focus { border-color: var(--accent); background: var(--bg); }
  .match-card-input::placeholder { color: var(--border2); font-size: 16px; }
  .match-card-item.selected {
    border-color: var(--accent); background: #1e1a0a;
    box-shadow: 0 0 0 1px var(--accent2);
  }
  .random-btn {
    width: 100%; margin-top: 14px; padding: 11px;
    background: var(--bg3); border: 1px dashed var(--border2);
    border-radius: 8px; color: var(--muted); font-size: 13px;
    font-weight: 500; cursor: pointer; transition: all .15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .random-btn:hover { border-color: var(--accent); color: var(--accent); background: #1e1a0a; }
  .random-btn:disabled { opacity: .35; cursor: not-allowed; }

  /* Champion banner */
  .champion-banner {
    background: linear-gradient(90deg, #1e1800 0%, #2a2000 100%);
    border: 1px solid var(--accent2); border-radius: 10px;
    padding: 16px 24px; margin-bottom: 16px;
    display: flex; align-items: center; gap: 12px;
  }
  .champion-trophy { font-size: 28px; }
  .champion-label { font-size: 11px; color: var(--muted); font-weight: 600; letter-spacing: .8px; text-transform: uppercase; }
  .champion-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 26px; font-weight: 800; color: var(--accent); letter-spacing: .5px;
  }

  /* Info rows */
  .info-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 0; border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .info-row:last-child { border-bottom: none; }
  .info-key { color: var(--muted); font-size: 11px; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; }
  .info-val { font-weight: 500; }

  /* Team pills in info */
  .team-pill {
    display: inline-block; background: var(--bg3);
    border: 1px solid var(--border); border-radius: 4px;
    padding: 3px 9px; font-size: 12px; margin: 3px 4px 3px 0;
    color: var(--text);
  }

  /* Confirm overlay */
  .confirm-box {
    background: var(--redBg); border: 1px solid var(--red);
    border-radius: 10px; padding: 14px 18px; margin-bottom: 14px;
    font-size: 13px; color: #f0a0a0;
    display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  }
  .confirm-actions { display: flex; gap: 8px; margin-left: auto; }

  /* Group header */
  .group-header {
    display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  }
  .group-letter {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 28px; font-weight: 800; color: var(--accent);
    line-height: 1; width: 28px;
  }
  .group-label { font-size: 11px; color: var(--muted); letter-spacing: .6px; text-transform: uppercase; font-weight: 600; }
  .matches-count { font-size: 12px; color: var(--muted); margin-left: auto; }

  .divider { height: 1px; background: var(--border); margin: 18px 0; }

  .empty-state { text-align: center; padding: 60px 20px; color: var(--muted); }
  .empty-icon { font-size: 40px; margin-bottom: 10px; }
  .empty-text { font-size: 14px; }

  /* Playoff round header */
  .round-header {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 15px; font-weight: 700; letter-spacing: 1px;
    text-transform: uppercase; color: var(--muted);
    margin-bottom: 12px; padding-bottom: 6px;
    border-bottom: 1px solid var(--border);
  }

  /* Bracket */
  .bracket-wrap {
    width: 100%; overflow-x: auto;
    margin-bottom: 20px;
    padding-bottom: 8px;
  }
  .bracket-inner {
    display: flex; gap: 0; align-items: stretch;
    min-width: max-content;
  }
  .bracket-col {
    display: flex; flex-direction: column;
    justify-content: space-around;
    min-width: 160px;
  }
  .bracket-col-header {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; font-weight: 700; letter-spacing: 1px;
    text-transform: uppercase; color: var(--muted);
    text-align: center; padding: 0 8px 10px;
    border-bottom: 1px solid var(--border); margin-bottom: 0;
  }
  .bracket-col-body {
    display: flex; flex-direction: column;
    justify-content: space-around; flex: 1;
    padding: 8px 0;
  }
  .bracket-match-wrap {
    display: flex; align-items: center; position: relative;
  }
  .bracket-match {
    background: var(--bg3); border: 1px solid var(--border2);
    border-radius: 7px; overflow: hidden;
    width: 148px; flex-shrink: 0; margin: 0 6px;
  }
  .bracket-match.active { border-color: var(--accent2); }
  .bracket-team {
    display: flex; align-items: center; justify-content: space-between;
    padding: 6px 9px; font-size: 12px; font-weight: 500;
    border-bottom: 1px solid var(--border);
    min-height: 30px; gap: 6px;
  }
  .bracket-team:last-child { border-bottom: none; }
  .bracket-team.winner {
    background: #1e1800;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; font-weight: 700; color: var(--accent);
  }
  .bracket-team.loser { color: var(--muted); }
  .bracket-team-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .bracket-score {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 15px; font-weight: 700; min-width: 16px; text-align: right;
    flex-shrink: 0;
  }
  .bracket-score.winner { color: var(--accent); }
  .bracket-pending { color: #3a3e4a; font-size: 11px; }

  /* SVG connectors column */
  .bracket-connectors {
    flex-shrink: 0; align-self: stretch;
    display: flex; align-items: stretch;
  }

  /* Back button row */
  .back-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
  .t-page-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 28px; font-weight: 800; letter-spacing: .5px;
  }
  .header-row {
    display: flex; align-items: flex-start; gap: 10px; margin-bottom: 22px;
  }
  .header-row-inner { flex: 1; }
`;

function injectCSS() {
  if (document.getElementById("tm-styles")) return;
  const el = document.createElement("style");
  el.id = "tm-styles";
  el.textContent = css;
  document.head.appendChild(el);
}
injectCSS();

/* ─── Helpers ───────────────────────────────────────────── */
const STORAGE_KEY = "torneos_v2";
const VALID_COUNTS = [4, 8, 12, 16, 20, 24, 32];

function genId() { return Math.random().toString(36).slice(2, 10); }

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function roundName(n) {
  if (n >= 16) return "Octavos de final";
  if (n === 8) return "Cuartos de final";
  if (n === 4) return "Semifinal";
  return "Final";
}

function buildGroupMatches(teams) {
  const matches = [];
  for (let i = 0; i < teams.length; i++)
    for (let j = i + 1; j < teams.length; j++)
      matches.push({ id: genId(), home: teams[i], away: teams[j], homeGoals: null, awayGoals: null, status: "pending" });
  return shuffle(matches);
}

function buildGroups(teams) {
  const s = shuffle(teams);
  const size = s.length % 4 !== 0 && s.length % 3 === 0 ? 3 : 4;
  const groups = [];
  for (let i = 0; i < s.length; i += size) {
    const chunk = s.slice(i, i + size);
    groups.push({ name: String.fromCharCode(65 + groups.length), teams: chunk, matches: buildGroupMatches(chunk) });
  }
  return groups;
}

function computeStandings(teams, matches) {
  const t = {};
  teams.forEach((n) => { t[n] = { team: n, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 }; });
  matches.forEach((m) => {
    if (m.status !== "finished") return;
    const h = t[m.home], a = t[m.away];
    h.pj++; a.pj++;
    h.gf += m.homeGoals; h.gc += m.awayGoals;
    a.gf += m.awayGoals; a.gc += m.homeGoals;
    h.dg = h.gf - h.gc; a.dg = a.gf - a.gc;
    if (m.homeGoals > m.awayGoals) { h.pg++; h.pts += 3; a.pp++; }
    else if (m.homeGoals < m.awayGoals) { a.pg++; a.pts += 3; h.pp++; }
    else { h.pe++; h.pts++; a.pe++; a.pts++; }
  });
  return Object.values(t).sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);
}

function generatePlayoff(groups, advancers) {
  const firsts = [], seconds = [];
  groups.forEach((g) => {
    const s = computeStandings(g.teams, g.matches);
    if (s[0]) firsts.push({ team: s[0].team, group: g.name });
    if (advancers >= 2 && s[1]) seconds.push({ team: s[1].team, group: g.name });
    if (advancers >= 3 && s[2]) seconds.push({ team: s[2].team, group: g.name });
  });
  const matches = firsts.map((f, i) => ({
    id: genId(),
    teamA: f.team,
    teamB: (seconds[(i + 1) % seconds.length] || { team: "BYE" }).team,
    goalsA: null, goalsB: null, status: "pending",
  }));
  return [{ name: roundName(matches.length), matches }];
}

function advanceRounds(rounds) {
  const last = rounds[rounds.length - 1];
  const allDone = last.matches.every((m) => m.status === "finished");
  if (!allDone || last.matches.length === 1) return rounds;
  const winners = last.matches.map((m) => (m.goalsA > m.goalsB ? m.teamA : m.teamB));
  const next = [];
  for (let i = 0; i < winners.length; i += 2)
    next.push({ id: genId(), teamA: winners[i], teamB: winners[i + 1] || "BYE", goalsA: null, goalsB: null, status: "pending" });
  return [...rounds, { name: roundName(next.length), matches: next }];
}

/* ─── Status helpers ────────────────────────────────────── */
const STATUS_LABEL = { pending: "Pendiente", groups: "Fase de grupos", playoffs: "Playoffs", finished: "Finalizado" };
function StatusBadge({ s }) {
  return <span className={`badge badge-${s}`}>{STATUS_LABEL[s]}</span>;
}

/* ─── App ───────────────────────────────────────────────── */
export default function App() {
  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { tournaments: [] }; }
    catch { return { tournaments: [] }; }
  });

  const save = useCallback((next) => {
    setData(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const [view, setView] = useState("home");
  const [activeTid, setActiveTid] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "", mode: "groups", teamCount: 8, advancers: 2,
    teams: Array.from({ length: 8 }, (_, i) => `Equipo ${i + 1}`),
  });

  const tournament = activeTid ? data.tournaments.find((t) => t.id === activeTid) : null;

  function updateTeamCount(n) {
    setForm((p) => ({
      ...p, teamCount: n,
      teams: Array.from({ length: n }, (_, i) => p.teams[i] || `Equipo ${i + 1}`),
    }));
  }

  function createTournament() {
    if (!form.name.trim()) return;
    const normalized = form.teams.map((t) => t.trim().toLowerCase());
    const hasDups = normalized.some((n, i) => normalized.indexOf(n) !== i);
    if (hasDups) return;
    const t = {
      id: genId(), name: form.name.trim(), mode: form.mode,
      teamCount: form.teamCount, advancers: form.advancers,
      teams: form.teams, status: "pending", groups: [], playoff: [],
      champion: null, createdAt: Date.now(),
    };
    const next = { ...data, tournaments: [t, ...data.tournaments] };
    save(next);
    setActiveTid(t.id); setView("tournament"); setCreating(false);
  }

  function startTournament(tid) {
    const t = data.tournaments.find((x) => x.id === tid);
    let updated;
    if (t.mode === "groups") {
      updated = { ...t, groups: buildGroups(t.teams), status: "groups" };
    } else {
      const shuffled = shuffle(t.teams);
      const matches = [];
      for (let i = 0; i < shuffled.length; i += 2)
        matches.push({ id: genId(), teamA: shuffled[i], teamB: shuffled[i + 1] || "BYE", goalsA: null, goalsB: null, status: "pending" });
      updated = { ...t, playoff: [{ name: roundName(matches.length), matches }], status: "playoffs" };
    }
    save({ ...data, tournaments: data.tournaments.map((x) => x.id === tid ? updated : x) });
  }

  function saveGroupMatch(tid, gi, mid, h, a) {
    const t = data.tournaments.find((x) => x.id === tid);
    const groups = t.groups.map((g, idx) =>
      idx !== gi ? g : {
        ...g, matches: g.matches.map((m) =>
          m.id !== mid ? m : { ...m, homeGoals: +h, awayGoals: +a, status: "finished" }
        )
      }
    );
    const allDone = groups.every((g) => g.matches.every((m) => m.status === "finished"));
    const updated = allDone
      ? { ...t, groups, playoff: generatePlayoff(groups, t.advancers), status: "playoffs" }
      : { ...t, groups };
    save({ ...data, tournaments: data.tournaments.map((x) => x.id === tid ? updated : x) });
  }

  function savePlayoffMatch(tid, ri, mid, a, b) {
    if (+a === +b) return;
    const t = data.tournaments.find((x) => x.id === tid);
    let rounds = t.playoff.map((r, idx) =>
      idx !== ri ? r : {
        ...r, matches: r.matches.map((m) =>
          m.id !== mid ? m : { ...m, goalsA: +a, goalsB: +b, status: "finished" }
        )
      }
    );
    rounds = advanceRounds(rounds);
    const last = rounds[rounds.length - 1];
    const champion =
      last.matches.length === 1 && last.matches[0].status === "finished"
        ? last.matches[0].goalsA > last.matches[0].goalsB ? last.matches[0].teamA : last.matches[0].teamB
        : null;
    const updated = { ...t, playoff: rounds, status: champion ? "finished" : t.status, champion };
    save({ ...data, tournaments: data.tournaments.map((x) => x.id === tid ? updated : x) });
  }

  function deleteTournament(tid) {
    save({ ...data, tournaments: data.tournaments.filter((x) => x.id !== tid) });
    setActiveTid(null); setView("home");
  }

  if (creating) {
    return (
      <div className="tm-root">
        <div className="page">
          <div className="top-bar">
            <button className="btn btn-ghost" onClick={() => setCreating(false)}>← Volver</button>
            <h1 className="app-wordmark">NUEVO <span>TORNEO</span></h1>
          </div>
          <div className="card card-accent">
            <label className="form-label">Nombre del torneo</label>
            <input className="form-input" value={form.name} autoFocus
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Copa Apertura 2025" />

            <label className="form-label">Modalidad</label>
            <div className="pill-group">
              {[{ v: "groups", l: "Grupos + Playoffs" }, { v: "bracket", l: "Eliminación directa" }].map((o) => (
                <button key={o.v} className={`pill${form.mode === o.v ? " active" : ""}`}
                  onClick={() => setForm((p) => ({ ...p, mode: o.v }))}>{o.l}</button>
              ))}
            </div>

            <label className="form-label">Cantidad de equipos</label>
            <div className="pill-group">
              {VALID_COUNTS.map((n) => (
                <button key={n} className={`pill${form.teamCount === n ? " active" : ""}`}
                  onClick={() => updateTeamCount(n)}>{n}</button>
              ))}
            </div>

            {form.mode === "groups" && (
              <>
                <label className="form-label">Clasificados por grupo</label>
                <div className="pill-group">
                  {[1, 2, 3].map((n) => (
                    <button key={n} className={`pill${form.advancers === n ? " active" : ""}`}
                      onClick={() => setForm((p) => ({ ...p, advancers: n }))}>{n}</button>
                  ))}
                </div>
              </>
            )}

            <label className="form-label">Nombres de equipos</label>
            {(() => {
              const normalized = form.teams.map((t) => t.trim().toLowerCase());
              const dupIndices = new Set(
                normalized.flatMap((n, i) =>
                  normalized.some((m, j) => j !== i && m === n) ? [i] : []
                )
              );
              const hasDups = dupIndices.size > 0;
              return (
                <>
                  {hasDups && (
                    <div className="dup-warning">
                      ⚠ Hay nombres repetidos — cada equipo debe tener un nombre único
                    </div>
                  )}
                  <div className="team-grid">
                    {form.teams.map((t, i) => (
                      <input key={i}
                        className={`team-input${dupIndices.has(i) ? " dup" : ""}`}
                        value={t}
                        placeholder={`Equipo ${i + 1}`}
                        onChange={(e) => {
                          const teams = [...form.teams];
                          teams[i] = e.target.value;
                          setForm((p) => ({ ...p, teams }));
                        }} />
                    ))}
                  </div>
                  <div style={{ marginTop: 24 }}>
                    <button
                      className="btn btn-primary"
                      style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 15, opacity: hasDups ? .4 : 1, cursor: hasDups ? "not-allowed" : "pointer" }}
                      onClick={createTournament}
                      disabled={hasDups}
                    >
                      Crear torneo →
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    );
  }

  if (view === "tournament" && tournament) {
    return (
      <TournamentView
        t={tournament}
        onBack={() => { setView("home"); setActiveTid(null); }}
        onStart={() => startTournament(tournament.id)}
        onSaveGroup={(gi, mid, h, a) => saveGroupMatch(tournament.id, gi, mid, h, a)}
        onSavePlayoff={(ri, mid, a, b) => savePlayoffMatch(tournament.id, ri, mid, a, b)}
        onDelete={() => deleteTournament(tournament.id)}
      />
    );
  }

  return (
    <div className="tm-root">
      <div className="page">
        <div className="top-bar">
          <h1 className="app-wordmark">TORNEO<span>S</span></h1>
          <button className="btn btn-primary" onClick={() => {
            setForm({ name: "", mode: "groups", teamCount: 8, advancers: 2, teams: Array.from({ length: 8 }, (_, i) => `Equipo ${i + 1}`) });
            setCreating(true);
          }}>
            + Nuevo torneo
          </button>
        </div>

        {data.tournaments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏆</div>
            <div className="empty-text">No hay torneos todavía. ¡Creá el primero!</div>
          </div>
        ) : (
          data.tournaments.map((t) => (
            <div key={t.id} className="t-item"
              onClick={() => { setActiveTid(t.id); setView("tournament"); }}>
              <div style={{ flex: 1 }}>
                <div className="t-item-name">{t.name}</div>
                <div className="t-item-meta">
                  {t.teamCount} equipos · {t.mode === "groups" ? "Grupos + Playoffs" : "Eliminación directa"}
                </div>
              </div>
              <StatusBadge s={t.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Bracket Visual ────────────────────────────────────── */
function BracketView({ rounds }) {
  if (!rounds || rounds.length === 0) return null;
  const MATCH_H = 62;
  const COL_W = 160;
  const CONN_W = 36;
  const HEADER_H = 31;

  const firstCount = rounds[0].matches.length;
  const totalH = Math.max(firstCount * (MATCH_H + 16), 120);

  function centers(roundIdx) {
    const count = rounds[roundIdx].matches.length;
    const spacing = totalH / count;
    return Array.from({ length: count }, (_, i) => spacing * i + spacing / 2);
  }

  return (
    <div className="bracket-wrap">
      <div style={{ display: "flex", alignItems: "flex-start", minWidth: "max-content" }}>
        {rounds.map((round, ri) => {
          const cc = centers(ri);
          return (
            <div key={ri} style={{ display: "flex", alignItems: "flex-start" }}>
              <div style={{ width: COL_W }}>
                <div className="bracket-col-header">{round.name}</div>
                <div style={{ position: "relative", height: totalH }}>
                  {round.matches.map((m, mi) => {
                    const done = m.status === "finished";
                    const winA = done && m.goalsA > m.goalsB;
                    const winB = done && m.goalsB > m.goalsA;
                    return (
                      <div key={m.id} style={{ position: "absolute", left: 6, right: 6, top: cc[mi] - MATCH_H / 2 }}>
                        <div className={`bracket-match${!done ? " active" : ""}`}>
                          <div className={`bracket-team${winA ? " winner" : done ? " loser" : ""}`}>
                            <span className="bracket-team-name">{m.teamA}</span>
                            {done ? <span className={`bracket-score${winA ? " winner" : ""}`}>{m.goalsA}</span>
                                  : <span className="bracket-pending">—</span>}
                          </div>
                          <div className={`bracket-team${winB ? " winner" : done ? " loser" : ""}`}>
                            <span className="bracket-team-name">{m.teamB}</span>
                            {done ? <span className={`bracket-score${winB ? " winner" : ""}`}>{m.goalsB}</span>
                                  : <span className="bracket-pending">—</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {ri < rounds.length - 1 && (() => {
                const nc = centers(ri + 1);
                return (
                  <svg width={CONN_W} height={totalH + HEADER_H} style={{ flexShrink: 0 }}>
                    {round.matches.map((_, mi) => {
                      const fromY = HEADER_H + cc[mi];
                      const toY   = HEADER_H + nc[Math.floor(mi / 2)];
                      const midX  = CONN_W / 2;
                      const isTop = mi % 2 === 0;
                      return (
                        <g key={mi}>
                          <line x1={0} y1={fromY} x2={midX} y2={fromY} stroke="#363a45" strokeWidth="1.5" />
                          {isTop && <line x1={midX} y1={fromY} x2={midX} y2={toY} stroke="#363a45" strokeWidth="1.5" />}
                          {isTop && <line x1={midX} y1={toY} x2={CONN_W} y2={toY} stroke="#363a45" strokeWidth="1.5" />}
                        </g>
                      );
                    })}
                  </svg>
                );
              })()}
            </div>
          );
        })}

        {(() => {
          const last = rounds[rounds.length - 1];
          if (last.matches.length !== 1 || last.matches[0].status !== "finished") return null;
          const winner = last.matches[0].goalsA > last.matches[0].goalsB
            ? last.matches[0].teamA : last.matches[0].teamB;
          return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 56, paddingTop: HEADER_H, height: totalH + HEADER_H }}>
              <div style={{ fontSize: 26 }}>🏆</div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 700, color: "#d4a843", letterSpacing: ".5px", textAlign: "center", marginTop: 4, maxWidth: 54, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{winner}</div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

/* ─── Tournament View ───────────────────────────────────── */
function TournamentView({ t, onBack, onStart, onSaveGroup, onSavePlayoff, onDelete }) {
  const defaultTab = t.status === "groups" ? "partidos" : "playoffs";
  const [tab, setTab] = useState(defaultTab);
  const [groupTab, setGroupTab] = useState(t.groups?.[0]?.name || "A");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [inputs, setInputs] = useState({});
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (t.status !== "pending") setTab(t.status === "groups" ? "partidos" : "playoffs");
  }, [t.status]);

  useEffect(() => {
    if (t.groups?.length > 0 && !t.groups.find((g) => g.name === groupTab)) {
      setGroupTab(t.groups[0].name);
    }
    setSelectedMatch(null);
  }, [t.groups, groupTab]);

  function inp(key, val) { setInputs((p) => ({ ...p, [key]: val })); }
  function get(key, fallback) { return inputs[key] !== undefined ? inputs[key] : fallback; }

  const tabs = [];
  if (t.groups?.length > 0) {
    tabs.push({ k: "partidos", l: "Partidos" });
    tabs.push({ k: "standings", l: "Tabla de posiciones" });
  }
  if (t.playoff?.length > 0 || t.status === "playoffs" || t.status === "finished") {
    tabs.push({ k: "playoffs", l: "Playoffs" });
  }

  const activeGroupIdx = t.groups?.findIndex((g) => g.name === groupTab) ?? 0;
  const activeGroup = t.groups?.[activeGroupIdx];

  return (
    <div className="tm-root">
      <div className="page">
        <div className="back-row">
          <button className="btn btn-ghost" onClick={onBack}>← Torneos</button>
        </div>
        <div className="header-row">
          <div className="header-row-inner">
            <h1 className="t-page-title">{t.name}</h1>
            <div style={{ marginTop: 6 }}><StatusBadge s={t.status} /></div>
          </div>
          <button className="btn btn-icon" onClick={() => setConfirm(true)}>🗑</button>
        </div>

        {confirm && (
          <div className="confirm-box">
            <span>¿Eliminar <strong>{t.name}</strong>?</span>
            <div className="confirm-actions">
              <button className="btn btn-danger" onClick={onDelete}>Eliminar</button>
              <button className="btn btn-ghost" onClick={() => setConfirm(false)}>Cancelar</button>
            </div>
          </div>
        )}

        {t.champion && (
          <div className="champion-banner">
            <div className="champion-trophy">🏆</div>
            <div>
              <div className="champion-label">Campeón</div>
              <div className="champion-name">{t.champion}</div>
            </div>
          </div>
        )}

        {t.status === "pending" && (
          <div className="card card-accent">
            <div className="info-row"><span className="info-key">Equipos</span><span className="info-val">{t.teamCount}</span></div>
            <div className="info-row"><span className="info-key">Modalidad</span><span className="info-val">{t.mode === "groups" ? "Grupos + Playoffs" : "Eliminación directa"}</span></div>
            {t.mode === "groups" && <div className="info-row"><span className="info-key">Clasificados/grupo</span><span className="info-val">{t.advancers}</span></div>}
            <div className="info-row" style={{ borderBottom: "none" }}>
              <span className="info-key">Participantes</span>
            </div>
            <div style={{ marginTop: 6, marginBottom: 18 }}>
              {t.teams.map((team, i) => <span key={i} className="team-pill">{team}</span>)}
            </div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 15 }} onClick={onStart}>
              Iniciar torneo →
            </button>
          </div>
        )}

        {tabs.length > 0 && (
          <div className="tab-bar">
            {tabs.map((tb) => (
              <button key={tb.k} className={`tab-btn${tab === tb.k ? " active" : ""}`} onClick={() => setTab(tb.k)}>
                {tb.l}
              </button>
            ))}
          </div>
        )}

        {/* ── PARTIDOS TAB ── */}
        {tab === "partidos" && (
          <div>
            {t.groups?.length > 1 && (
              <div className="pill-group" style={{ marginBottom: 16 }}>
                {t.groups.map((g) => (
                  <button
                    key={g.name}
                    className={`pill${groupTab === g.name ? " active" : ""}`}
                    onClick={() => setGroupTab(g.name)}
                  >
                    Grupo {g.name}
                  </button>
                ))}
              </div>
            )}

            {activeGroup && (
              <div className="card">
                <div className="group-header">
                  <div>
                    <div className="group-letter">{activeGroup.name}</div>
                    <div className="group-label">Grupo</div>
                  </div>
                  <div className="matches-count">
                    {activeGroup.matches.filter((m) => m.status === "finished").length}/{activeGroup.matches.length} partidos
                  </div>
                </div>
                {activeGroup.matches.map((m) => {
                  const hk = `${activeGroupIdx}-${m.id}-h`, ak = `${activeGroupIdx}-${m.id}-a`;
                  const hv = get(hk, m.homeGoals !== null ? String(m.homeGoals) : "");
                  const av = get(ak, m.awayGoals !== null ? String(m.awayGoals) : "");
                  const done = m.status === "finished";
                  const winA = done && m.homeGoals > m.awayGoals;
                  const winB = done && m.awayGoals > m.homeGoals;
                  const draw = done && m.homeGoals === m.awayGoals;
                  function tryAutoSave(newHv, newAv) {
                    if (newHv !== "" && newAv !== "") onSaveGroup(activeGroupIdx, m.id, newHv, newAv);
                  }
                  return (
                    <div key={m.id} className={`match-card-item${done ? " done" : ""}${selectedMatch === m.id ? " selected" : ""}`}>
                      <span className={`match-card-name${winA ? " winner" : winB ? " loser" : ""}`}>{m.home}</span>
                      <div className="match-card-scores">
                        {done ? (
                          <>
                            <span className={`match-card-num ${winA ? "winner" : draw ? "draw" : "loser"}`}>{m.homeGoals}</span>
                            <span className="match-card-sep">—</span>
                            <span className={`match-card-num ${winB ? "winner" : draw ? "draw" : "loser"}`}>{m.awayGoals}</span>
                          </>
                        ) : (
                          <>
                            <input
                              className="match-card-input" type="number" min="0" placeholder="—" value={hv}
                              onChange={(e) => inp(hk, e.target.value)}
                              onBlur={(e) => tryAutoSave(e.target.value, av)}
                            />
                            <span className="match-card-sep">—</span>
                            <input
                              className="match-card-input" type="number" min="0" placeholder="—" value={av}
                              onChange={(e) => inp(ak, e.target.value)}
                              onBlur={(e) => tryAutoSave(hv, e.target.value)}
                            />
                          </>
                        )}
                      </div>
                      <span className={`match-card-name right${winB ? " winner" : winA ? " loser" : ""}`}>{m.away}</span>
                    </div>
                  );
                })}
                {(() => {
                  const pending = activeGroup.matches.filter((m) => m.status !== "finished");
                  return (
                    <button
                      className="random-btn"
                      disabled={pending.length === 0}
                      onClick={() => {
                        const pick = pending[Math.floor(Math.random() * pending.length)];
                        setSelectedMatch(pick.id);
                      }}
                    >
                      🎲 Elegí partido aleatorio
                    </button>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ── STANDINGS TAB ── */}
        {tab === "standings" && (
          <>
            {t.groups?.map((g, gi) => {
              const standings = computeStandings(g.teams, g.matches);
              return (
                <div key={gi} className="card" style={{ marginBottom: 14 }}>
                  <div className="group-header">
                    <div>
                      <div className="group-letter">{g.name}</div>
                      <div className="group-label">Grupo</div>
                    </div>
                  </div>
                  <table className="standings-table">
                    <thead>
                      <tr>
                        <th style={{ width: "35%" }}>Equipo</th>
                        {["PJ","PG","PE","PP","GF","GC","DG","PTS"].map((h) => <th key={h}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((row, ri) => (
                        <tr key={row.team} className={ri < (t.advancers || 2) ? "qualifier" : ""}>
                          <td>
                            {ri < (t.advancers || 2) && <span className="qualifier-dot" />}
                            {row.team}
                          </td>
                          <td>{row.pj}</td><td>{row.pg}</td><td>{row.pe}</td><td>{row.pp}</td>
                          <td>{row.gf}</td><td>{row.gc}</td>
                          <td style={{ color: row.dg > 0 ? "#4caf7d" : row.dg < 0 ? "#e07070" : undefined }}>{row.dg > 0 ? `+${row.dg}` : row.dg}</td>
                          <td className="pts-cell">{row.pts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </>
        )}

        {/* ── PLAYOFFS TAB ── */}
        {tab === "playoffs" && (
          <>
            {(!t.playoff || t.playoff.length === 0) && (
              <div className="empty-state">
                <div className="empty-text">Los playoffs se generan al terminar la fase de grupos.</div>
              </div>
            )}
            {t.playoff?.length > 0 && (
              <div className="card" style={{ marginBottom: 14, padding: "16px 12px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".8px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
                  Bracket
                </div>
                <BracketView rounds={t.playoff} />
              </div>
            )}
            {t.playoff?.map((round, ri) => (
              <div key={ri} className="card" style={{ marginBottom: 14 }}>
                <div className="round-header">{round.name}</div>
                {round.matches.map((m) => {
                  const ak = `po-${ri}-${m.id}-a`, bk = `po-${ri}-${m.id}-b`;
                  const av = get(ak, m.goalsA !== null ? String(m.goalsA) : "");
                  const bv = get(bk, m.goalsB !== null ? String(m.goalsB) : "");
                  const done = m.status === "finished";
                  const winA = done && m.goalsA > m.goalsB;
                  const winB = done && m.goalsB > m.goalsA;
                  return (
                    <div key={m.id} className="match-row">
                      <span className={`match-team${winA ? " winner" : ""}`}>{m.teamA}</span>
                      <input className="goal-input" type="number" min="0" value={av} disabled={done}
                        onChange={(e) => inp(ak, e.target.value)} />
                      <span className="match-sep">—</span>
                      <input className="goal-input" type="number" min="0" value={bv} disabled={done}
                        onChange={(e) => inp(bk, e.target.value)} />
                      <span className={`match-team right${winB ? " winner" : ""}`}>{m.teamB}</span>
                      {done
                        ? <span className="done-badge">FIN</span>
                        : <button className="btn btn-sm"
                            disabled={av === "" || bv === "" || av === bv}
                            onClick={() => onSavePlayoff(ri, m.id, av, bv)}>Guardar</button>}
                    </div>
                  );
                })}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
