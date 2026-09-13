const STORAGE_KEY = 'kickstart-coach-pwa-v2';
const uid = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

const drillBank = [
  ['Dynamic Ball Warm-Up','Warm-Up','Low',8,'One ball per player','Toe taps, foundations, sole rolls, and free dribbling in a grid.',['Light feet','Both feet','Look up often']],
  ['Soccer Tag','Warm-Up','Medium',8,'Cones, optional balls','Tag inside a grid. Add a ball for each player after the first round.',['Change direction','Stay aware','Keep moving']],
  ['Body Part Dribble','Warm-Up','Low',7,'One ball per player','Players dribble freely while the coach calls a body part to stop the ball with.',['Small touches','Head up','React fast']],
  ['Dynamic Stretch Circuit','Warm-Up','Low',7,'Cones','Skips, lunges, heel flicks, and side shuffles between two lines.',['Move through full range','Stay tall','Control the landing']],
  ['Red Light, Green Light','Dribbling','Low',10,'One ball per player, cones','Players dribble on green, slow on yellow, and stop the ball on red.',['Close touches','Use both feet','Head up']],
  ['Gate Dribbling Challenge','Dribbling','Medium',12,'Cones, one ball per player','Players score by dribbling through as many cone gates as possible.',['Accelerate away','Change direction','Avoid traffic']],
  ['Sharks and Minnows','Dribbling','High',12,'Balls, cones, pinnies','Minnows cross the field while sharks try to knock balls away.',['Shield the ball','Change speed','Recover quickly']],
  ['Cone Slalom Relay','Dribbling','Medium',10,'Cones, one ball per player','Players dribble through a slalom and race back to tag the next teammate.',['Touch every step','Use outside of foot','Accelerate past the last cone']],
  ['Shrinking Island','Dribbling','High',12,'Cones, balls','Players dribble inside a grid that gets smaller every round without losing control.',['Shield with your body','Change direction early','Keep the ball close']],
  ['Partner Passing Gates','Passing','Low',12,'One ball per pair, cones','Pairs pass through gates and move to a new gate after each success.',['Plant foot beside ball','Inside of foot','Receive across body']],
  ['Passing Square','Passing','Medium',15,'Cones, balls','Players pass around a square and follow their pass.',['Check shoulder','First touch forward','Call names']],
  ['3v1 Keep Away','Passing','High',15,'Cones, pinnies, ball','Three attackers keep possession from one defender. Rotate frequently.',['Create angles','Move after passing','Decide quickly']],
  ['Long and Short Relay','Passing','Medium',12,'Cones, balls','Pairs alternate a short pass and a longer driven pass between marked zones.',['Plant foot beside ball','Weight the pass','Follow through to target']],
  ['Wall Pass Gates','Passing','Medium',12,'Cones, pinnies, balls','An attacker plays a give-and-go off a neutral player to get through a gate.',['Pass and move','Call for the return','First touch forward']],
  ['Turn and Escape','Ball Control','Medium',12,'Balls, cones','Dribble to a cone, turn, then accelerate away.',['Low body position','Protect ball','Explode away']],
  ['First Touch Circle','Ball Control','Low',10,'Balls, cones','Players receive a served ball and take one clean touch into space before returning it.',['Cushion the ball','Touch into space','Get side-on early']],
  ['Trap and Turn Relay','Ball Control','Medium',12,'Cones, balls','Receive a pass at a cone, control it, turn, and dribble back to the line.',['Kill the ball first','Turn away from pressure','Look before you receive']],
  ['Juggling Challenge','Ball Control','Low',8,'One ball per player','Players count juggles, restart on a drop, and try to beat their own record.',['Toes up','Small soft touches','Stay balanced']],
  ['Throw, Trap, Pass','Ball Control','Medium',12,'One ball per pair','One partner throws to chest, thigh, or foot and the other settles it down and passes back.',['Pick the surface early','Relax on contact','Settle it in one touch']],
  ['Dribble and Finish','Shooting','Medium',12,'Goal, cones, balls','Dribble through a short pattern and finish on goal.',['Final touch out','Plant foot at target','Accuracy first']],
  ['Numbers Shooting Game','Shooting','High',15,'Goal, balls, pinnies','Coach calls a number and matching players race to win the ball and shoot.',['Shoot when open','Follow rebounds','Compete safely']],
  ['Shooting Ladder','Shooting','Medium',12,'Goal, balls, cones','Players shoot from three marked distances and track how many they hit.',['Head steady','Strike through the middle','Follow your shot in']],
  ['Cross and Finish','Shooting','High',15,'Goal, balls, cones','A wide player delivers across the box for a runner to finish first time.',['Attack the near post','Get across your defender','Redirect, do not blast']],
  ['Turn and Shoot','Shooting','Medium',12,'Goal, balls, cones','Receive with back to goal, turn quickly, and shoot before a count of three.',['Check your shoulder','Turn on the first touch','Shoot low and early']],
  ['Defending the Castle','Defending','Medium',12,'Cones, balls','One player protects a cone while another tries to knock it down.',['Close under control','Side-on stance','Do not stab']],
  ['1v1 to Two Goals','Defending','High',15,'Cones, pinnies, balls','Attacker can score in either small goal, forcing balanced defending.',['Stay goal side','Slow attacker','Change direction']],
  ['Shadow Defending','Defending','Low',10,'Cones, pinnies','A defender mirrors an attacker moving side to side without tackling.',['Side-on stance','Small quick steps','Stay an arm away']],
  ['Recovery Race','Defending','High',12,'Cones, balls, goal','The defender starts a step behind and must get goal side before the attacker shoots.',['Sprint the first three steps','Run the shortest line','Force them wide']],
  ['2v2 Defend the Zone','Defending','High',15,'Cones, pinnies, balls','Two defenders protect a zone against two attackers, rotating first and second defender roles.',['One pressures, one covers','Talk to each other','Delay and squeeze']],
  ['End-Zone Soccer','Game','Medium',15,'Cones, pinnies, ball','Score by passing to a teammate who controls the ball in an end zone.',['Find space','Pass with pace','Defend together']],
  ['4v4 Small-Sided Game','Game','High',20,'Cones, pinnies, small goals','Play short 4v4 rounds with simple conditions tied to the theme.',['Spread out','Transition quickly','Be creative']],
  ['3v3 Four Goals','Game','High',15,'Cones, pinnies, balls','Small teams can attack either of two goals, which forces them to switch play.',['Look for the open goal','Switch when blocked','Spread wide']],
  ['Possession Scrimmage','Game','Medium',15,'Cones, pinnies, ball','Teams earn a point for six passes in a row as well as for goals.',['Find the open player','Move after passing','Keep it simple']]
].map(([name,category,intensity,minutes,equipment,description,points]) => ({id:uid(),name,category,intensity,minutes,equipment,description,points}));

const samplePlayers = [
  {id:uid(),name:'Alex',jersey:'7',position:'Midfielder',notes:''},
  {id:uid(),name:'Jordan',jersey:'10',position:'Forward',notes:''},
  {id:uid(),name:'Sam',jersey:'4',position:'Defender',notes:''}
];
const defaultState = {players:samplePlayers,practicePlan:[],grades:[],attendance:[],lineup:{},games:[],settings:{teamName:'My U9 Team'}};
let state = loadState();
let activeRatings = {};
let deferredInstallPrompt;

function loadState(){try{return {...structuredClone(defaultState),...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}}catch{return structuredClone(defaultState)}}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function esc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function today(){return new Date().toISOString().slice(0,10)}
function avg(scores={}){const vals=Object.values(scores).map(Number).filter(Boolean);return vals.length?(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1):'—'}
function toast(message){const el=document.getElementById('toast');el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200)}
function switchView(view){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===view));document.querySelectorAll('.view').forEach(s=>s.classList.toggle('active',s.id===view));renderAll();window.scrollTo({top:0,behavior:'smooth'})}
window.switchView=switchView;
document.querySelectorAll('.tab').forEach(btn=>btn.onclick=()=>switchView(btn.dataset.view));

function renderDashboard(){
 const minutes=state.practicePlan.reduce((s,d)=>s+d.minutes,0); const latest=state.grades.at(-1); const attendanceToday=state.attendance.find(a=>a.date===today()); const lastGame=state.games.at(-1); const focusRank=rankedFocus();
 document.getElementById('dashboard').innerHTML=`
 <div class="hero"><div><p class="eyebrow">READY FOR THE FIELD</p><h2>${esc(state.settings.teamName)}</h2><p>Your roster, plans, attendance, grades, and rotations work offline after the app is installed.</p></div><button class="primary lime" onclick="switchView('practice')">Build today’s practice</button></div>
 <div class="grid cols-4">
  <article class="card stat"><strong>${state.players.length}</strong><span>Players</span></article>
  <article class="card stat"><strong>${recordLabel()}</strong><span>Record (W-L-D)</span></article>
  <article class="card stat"><strong>${minutes}</strong><span>Practice minutes</span></article>
  <article class="card stat"><strong>${attendanceToday?.present?.length||0}</strong><span>Present today</span></article>
 </div>
 <div class="grid cols-2">
  <article class="card"><div class="section-heading"><h2>Latest game</h2><button class="secondary small" onclick="switchView('gamelog')">Open log</button></div>${lastGame?`<b>${esc(gameTitle(lastGame))}</b><p class="muted">${lastGame.date}</p><p>${esc(lastGame.note||'No note added.')}</p>`:'<div class="empty">Log your first game.</div>'}</article>
  <article class="card"><div class="section-heading"><h2>What to work on</h2>${focusRank.length?'<button class="secondary small" onclick="switchView(\'practice\')">Build practice</button>':''}</div>${focusRank.length?`<div class="chip-row">${focusRank.slice(0,3).map(([t,n])=>`<span class="chip on">${esc(t)} \u00d7${n}</span>`).join('')}</div><p class="muted">Pulled from your last ${recentGames().length} log ${recentGames().length===1?'entry':'entries'}.</p>`:'<div class="empty">Add game notes and focus areas appear here.</div>'}</article>
 </div>
 <div class="quick-grid">
  <button class="quick" onclick="switchView('gamelog')"><span>\u270e</span><b>Log a game</b><small>Result and what needs work</small></button>
  <button class="quick" onclick="switchView('attendance')"><span>✓</span><b>Take attendance</b><small>Tap players in or out</small></button>
  <button class="quick" onclick="switchView('grading')"><span>★</span><b>Grade players</b><small>Fast 1–5 evaluations</small></button>
  <button class="quick" onclick="switchView('gameday')"><span>↻</span><b>Plan rotations</b><small>Set positions and bench</small></button>
 </div>
 <div class="grid cols-2">
  <article class="card"><div class="section-heading"><h2>Current practice</h2><button class="secondary small" onclick="switchView('practice')">Open</button></div>${state.practicePlan.length?state.practicePlan.map(d=>`<div class="mini-row"><b>${esc(d.name)}</b><span>${d.minutes} min</span></div>`).join(''):'<div class="empty">No plan yet.</div>'}</article>
  <article class="card"><div class="section-heading"><h2>Latest evaluation</h2><button class="secondary small" onclick="switchView('grading')">Open</button></div>${latest?`<b>${esc(state.players.find(p=>p.id===latest.playerId)?.name||'Player')}</b><p class="muted">${latest.date} · ${avg(latest.scores)}/5</p><p>${esc(latest.note||'No note added.')}</p>`:'<div class="empty">No evaluations yet.</div>'}</article>
 </div>`;
}

function renderPlayers(){document.getElementById('players').innerHTML=`
 <div class="section-heading"><div><h2>Team roster</h2><p class="muted">Players and private coaching notes stay on your device.</p></div><button class="primary" onclick="openPlayerDialog()">+ Add</button></div>
 <div class="card player-list">${state.players.length?state.players.map(p=>`<div class="player-row"><div class="avatar">${esc(p.jersey||p.name[0])}</div><div><strong>${esc(p.name)}</strong><div class="muted">${esc(p.position)}${p.notes?` · ${esc(p.notes)}`:''}</div>${(()=>{const m=state.games.filter(g=>(g.mentions||[]).includes(p.id)).reverse();return m.length?`<details class="mentions-details"><summary>${m.length} game ${m.length===1?'note':'notes'}</summary>${m.map(g=>`<div class="mini-row"><span>${esc(g.note)}</span><small>${g.date}</small></div>`).join('')}</details>`:''})()}</div><div class="row-actions"><button class="secondary small" onclick="openPlayerDialog('${p.id}')">Edit</button><button class="danger-button small" onclick="deletePlayer('${p.id}')">Remove</button></div></div>`).join(''):'<div class="empty">Add your first player.</div>'}</div>`}
function openPlayerDialog(id=''){const p=state.players.find(x=>x.id===id);playerDialogTitle.textContent=p?'Edit player':'Add player';playerId.value=p?.id||'';playerName.value=p?.name||'';jerseyNumber.value=p?.jersey||'';position.value=p?.position||'Not assigned';playerNotes.value=p?.notes||'';playerDialog.showModal()}
window.openPlayerDialog=openPlayerDialog;
playerForm.addEventListener('submit',e=>{e.preventDefault();const p={id:playerId.value||uid(),name:playerName.value.trim(),jersey:jerseyNumber.value,position:position.value,notes:playerNotes.value.trim()};if(!p.name)return;const i=state.players.findIndex(x=>x.id===p.id);i>=0?state.players[i]=p:state.players.push(p);saveState();playerDialog.close();renderAll();toast('Player saved')});
function deletePlayer(id){if(!confirm('Remove this player and their saved records?'))return;state.players=state.players.filter(p=>p.id!==id);state.grades=state.grades.filter(g=>g.playerId!==id);state.attendance.forEach(a=>a.present=a.present.filter(x=>x!==id));state.games.forEach(g=>g.mentions=(g.mentions||[]).filter(x=>x!==id));delete state.lineup[id];saveState();renderAll()}
window.deletePlayer=deletePlayer;

function generatePractice(){
 let focus=document.getElementById('focus').value;
 const duration=Number(document.getElementById('duration').value);
 const playerCount=Number(document.getElementById('playerCount').value)||state.players.length||8;
 const pool=[...drillBank];
 const shuffle=a=>a.sort(()=>Math.random()-.5);
 /* Drills from the session still on screen go to the back of every queue, so
    a coach working the same focus week after week does not see repeats. */
 const lastUsed=new Set(state.practicePlan.map(d=>d.name));
 const fresh=a=>shuffle(a).sort((x,y)=>(lastUsed.has(x.name)?1:0)-(lastUsed.has(y.name)?1:0));
 const warm=fresh(pool.filter(d=>d.category==='Warm-Up'))[0];
 const game=fresh(pool.filter(d=>d.category==='Game'))[0];
 let focused,message='Practice generated';
 if(focus===GAME_FOCUS){
  const weights=focusWeights();
  const ranked=rankedFocus();
  if(!ranked.length){focus='Balanced';message='No game notes yet \u2014 built a balanced session';focused=fresh(pool.filter(d=>!['Warm-Up','Game'].includes(d.category)))}
  else{
   /* Rotate through the flagged areas so tied focuses each get a drill, while a
      heavier focus earns extra slots in later rounds. */
   const queues={},order=[];
   ranked.forEach(([cat])=>{queues[cat]=fresh(pool.filter(d=>d.category===cat))});
   for(let round=0;round<ranked[0][1];round++)for(const [cat,w] of ranked)if(round<w)order.push(cat);
   focused=[];
   for(const cat of order){const d=queues[cat].shift();if(d)focused.push(d)}
   ranked.forEach(([cat])=>focused.push(...queues[cat]));
   message=`Practice built around ${ranked.slice(0,2).map(([t])=>t).join(' and ')}`;
  }
 }else focused=fresh(pool.filter(d=>focus==='Balanced'||d.category===focus));
 const others=fresh(pool.filter(d=>!['Warm-Up','Game'].includes(d.category)&&!focused.includes(d)));
 const plan=[warm];let total=warm.minutes;
 for(const d of [...focused,...others]){
  if(total+d.minutes+game.minutes<=duration){plan.push({...d,description:`${d.description} Recommended for about ${playerCount} players.`});total+=d.minutes}
  if(total>=duration-game.minutes-8)break;
 }
 plan.push({...game,minutes:Math.max(10,duration-total)});
 state.practicePlan=plan;saveState();renderPractice();toast(message);
}
window.generatePractice=generatePractice;
function renderPractice(){const total=state.practicePlan.reduce((s,d)=>s+d.minutes,0);document.getElementById('practice').innerHTML=`
 <div class="section-heading"><div><h2>Practice builder</h2><p class="muted">Generate an age-appropriate session, then adjust it.</p></div>${state.practicePlan.length?'<button class="secondary" onclick="window.print()">Print</button>':''}</div>
 ${rankedFocus().length?`<div class="focus-banner"><b>From your last ${recentGames().length} log ${recentGames().length===1?'entry':'entries'}:</b>${rankedFocus().slice(0,3).map(([t,n])=>`<span class="chip on">${esc(t)} \u00d7${n}</span>`).join('')}<button class="secondary small" onclick="switchView('gamelog')">Open log</button></div>`:''}
 <article class="card"><div class="form-grid"><label>Focus<select id="focus">${state.games.length?`<option ${rankedFocus().length?'selected':''}>${GAME_FOCUS}</option>`:''}<option ${state.games.length&&rankedFocus().length?'':'selected'}>Balanced</option><option>Dribbling</option><option>Passing</option><option>Ball Control</option><option>Shooting</option><option>Defending</option></select></label><label>Length<select id="duration"><option value="45">45 minutes</option><option value="60" selected>60 minutes</option><option value="75">75 minutes</option><option value="90">90 minutes</option></select></label><label>Players<input id="playerCount" type="number" min="4" max="24" value="${state.players.length||10}"></label><button class="primary form-button" onclick="generatePractice()">Generate plan</button></div></article>
 ${state.practicePlan.length?`<div class="practice-summary"><span class="summary-pill">${total} minutes</span><span class="summary-pill">${state.practicePlan.length} activities</span></div><div class="drill-list">${state.practicePlan.map((d,i)=>`<article class="drill-card"><div class="drill-top"><div><span class="badge">${esc(d.category)}</span><h3>${i+1}. ${esc(d.name)}</h3></div><span class="duration">${d.minutes} min</span></div><p>${esc(d.description)}</p><p><b>Equipment:</b> ${esc(d.equipment)}</p><ul class="coaching-points">${d.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul><button class="danger-button small" onclick="removeDrill(${i})">Remove</button></article>`).join('')}</div>`:'<div class="empty large">Choose your focus and generate a practice.</div>'}`}
function removeDrill(i){state.practicePlan.splice(i,1);saveState();renderPractice()} window.removeDrill=removeDrill;

const skills=['Dribbling','Passing','Ball Control','Defending','Effort','Teamwork'];
function renderGrading(){const recent=[...state.grades].reverse().slice(0,20);document.getElementById('grading').innerHTML=`<div class="section-heading"><div><h2>Player grading</h2><p class="muted">1 = developing, 3 = on track, 5 = standout today.</p></div></div><div class="grade-list">${state.players.length?state.players.map(p=>`<article class="grade-card"><div class="grade-header"><div><strong>${esc(p.name)}</strong><div class="muted">#${esc(p.jersey||'—')} · ${esc(p.position)}</div></div><div class="average">${avg(activeRatings[p.id])}/5</div></div><div class="rating-grid">${skills.map(skill=>`<div class="rating-group"><label>${skill}</label><div class="score-buttons">${[1,2,3,4,5].map(n=>`<button class="${activeRatings[p.id]?.[skill]===n?'selected':''}" onclick="setRating('${p.id}','${skill}',${n})">${n}</button>`).join('')}</div></div>`).join('')}</div><label>Session note<textarea id="note-${p.id}" rows="2" placeholder="One win and one next step..."></textarea></label><button class="primary small save-grade" onclick="saveGrade('${p.id}')">Save evaluation</button></article>`).join(''):'<div class="empty">Add players first.</div>'}</div><article class="card history"><h2>Recent evaluations</h2>${recent.length?recent.map(g=>`<div class="history-row"><div><b>${esc(state.players.find(p=>p.id===g.playerId)?.name||'Removed player')}</b><small>${g.date}</small></div><strong>${avg(g.scores)}/5</strong><span>${esc(g.note||'—')}</span></div>`).join(''):'<div class="empty">No evaluations yet.</div>'}</article>`}
function setRating(pid,skill,score){activeRatings[pid]??={};activeRatings[pid][skill]=score;renderGrading()} window.setRating=setRating;
function saveGrade(pid){const scores=activeRatings[pid]||{};if(Object.keys(scores).length<skills.length){toast('Score all six areas');return}state.grades.push({id:uid(),playerId:pid,date:today(),scores:{...scores},note:document.getElementById(`note-${pid}`).value.trim()});delete activeRatings[pid];saveState();renderAll();toast('Evaluation saved')} window.saveGrade=saveGrade;

function getAttendance(date=today()){let a=state.attendance.find(x=>x.date===date);if(!a){a={date,present:[]};state.attendance.push(a)}return a}
function toggleAttendance(id){const a=getAttendance();a.present.includes(id)?a.present=a.present.filter(x=>x!==id):a.present.push(id);saveState();renderAttendance()} window.toggleAttendance=toggleAttendance;
function markAllPresent(){getAttendance().present=state.players.map(p=>p.id);saveState();renderAttendance()} window.markAllPresent=markAllPresent;
function renderAttendance(){const a=getAttendance();document.getElementById('attendance').innerHTML=`<div class="section-heading"><div><h2>Attendance</h2><p class="muted">${today()} · ${a.present.length} of ${state.players.length} present</p></div><button class="secondary" onclick="markAllPresent()">All present</button></div><div class="attendance-grid">${state.players.map(p=>`<button class="attendance-card ${a.present.includes(p.id)?'present':''}" onclick="toggleAttendance('${p.id}')"><span class="avatar">${esc(p.jersey||p.name[0])}</span><b>${esc(p.name)}</b><small>${a.present.includes(p.id)?'Present':'Tap to check in'}</small></button>`).join('')}</div>`}

const positions=['Goalkeeper','Left Defense','Right Defense','Midfield','Left Wing','Right Wing','Striker','Bench'];
function setPosition(id,pos){state.lineup[id]=pos;saveState();renderGameDay()} window.setPosition=setPosition;
function clearLineup(){state.lineup={};saveState();renderGameDay()} window.clearLineup=clearLineup;
function renderGameDay(){const ranked=rankedFocus();const recent=recentGames();document.getElementById('gameday').innerHTML=`<div class="section-heading"><div><h2>Game Day</h2><p class="muted">Assign starting positions and track who begins on the bench.</p></div><button class="secondary" onclick="clearLineup()">Clear</button></div>${ranked.length?`<article class="card intel"><div class="section-heading"><h2>From your last ${recent.length} ${recent.length===1?'entry':'entries'}</h2><button class="secondary small" onclick="switchView('gamelog')">Open log</button></div><ul class="intel-list">${ranked.slice(0,3).map(([t,n])=>`<li><b>${esc(t)}</b> came up in ${n} of ${recent.length} \u2014 ${esc(gamePlanTips[t]||'')}</li>`).join('')}</ul></article>`:''}<div class="field"><div class="field-line center"></div><div class="field-circle"></div>${positions.slice(0,-1).map((pos,i)=>`<div class="position-slot slot-${i}"><small>${pos}</small><strong>${esc(state.players.find(p=>state.lineup[p.id]===pos)?.name||'Open')}</strong></div>`).join('')}</div><article class="card lineup-list"><h2>Player assignments</h2>${state.players.map(p=>`<div class="lineup-row"><b>${esc(p.name)}</b><select onchange="setPosition('${p.id}',this.value)"><option value="">Unassigned</option>${positions.map(pos=>`<option ${state.lineup[p.id]===pos?'selected':''}>${pos}</option>`).join('')}</select></div>`).join('')}</article>`}

function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`kickstart-backup-${today()}.json`;a.click();URL.revokeObjectURL(url);toast('Backup downloaded')} window.exportData=exportData;
importFile.addEventListener('change',async e=>{try{const parsed=JSON.parse(await e.target.files[0].text());if(!Array.isArray(parsed.players))throw Error();state={...structuredClone(defaultState),...parsed};saveState();dataDialog.close();renderAll();toast('Backup restored')}catch{alert('That backup file could not be read.')}});
function resetData(){if(confirm('Delete all players, plans, grades, attendance, and lineup data?')){state={players:[],practicePlan:[],grades:[],attendance:[],lineup:{},games:[],settings:{teamName:'My U9 Team'}};saveState();dataDialog.close();renderAll()}} window.resetData=resetData;
backupBtn.onclick=()=>dataDialog.showModal();

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;installBtn.hidden=false});
installBtn.onclick=async()=>{if(!deferredInstallPrompt)return;deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;installBtn.hidden=true};
window.addEventListener('appinstalled',()=>toast('KickStart installed'));
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));


/* ---------- Game log: turns coach notes into practice focus ---------- */
const FOCUS_TAGS=['Dribbling','Passing','Ball Control','Shooting','Defending'];
const GAME_FOCUS='From recent games';
const RECENT_GAMES=5;
const tagKeywords={
 Dribbling:['dribble','dribbles','dribbling','dribbled','1v1','take on','took on','beat a defender','run at','carry the ball','carrying'],
 Passing:['pass','passes','passing','passed','turnover','turnovers','gave the ball away','give the ball away','giving it away','threw it away','throw-in','throw ins','throw-ins','connect','connecting','switch the field','link up','spacing','support'],
 'Ball Control':['first touch','touch','touches','control','controlling','trap','trapping','receive','receiving','received','settle','bobble','heavy touch'],
 Shooting:['shoot','shooting','shot','shots','finish','finishing','finished','missed','scoring','chances','wasteful','strike','in front of goal'],
 Defending:['defend','defending','defense','defence','defender','defenders','back line','backline','mark','marking','tackle','tackles','tackling','counter','counters','counter-attack','counterattack','conceded','concede','gave up','goals against','clearance','clearances','press','pressed','pressing','shape','goal side']
};
const gamePlanTips={
 Dribbling:'Let your wide players attack 1v1 — support from behind, not alongside.',
 Passing:'Keep two players close to the ball so there is always a short outlet.',
 'Ball Control':'Ask for a positive first touch into space before the pass arrives.',
 Shooting:'Get shots off early and crash the far post for rebounds.',
 Defending:'Keep one defender home and delay the first attacker instead of diving in.'
};
const positiveWords=['great','good','strong','excellent','sharp','well','improved','improving','better','solid','nice','clean','crisp','best','proud','love','loved','impressive','dominant','happy','pleased'];
const negativeWords=['bad','poor','terrible','rough','struggled','struggle','struggling','sloppy','missed','miss','weak','slow','lost','losing','gave up','giving up','need','needs','work on','improve','problem','problems','issue','issues','trouble','beat','beaten','soft','lazy','panic','panicked','rushed','careless','awful','disappointing','too many','couldn’t',"couldn't",'never','failed'];

const rxEscape=s=>String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const hasWord=(text,words)=>words.some(w=>new RegExp(`\\b${rxEscape(w)}\\b`,'i').test(text));

/* Splits a note into clauses so praise in one breath does not become a practice focus. */
function detectTags(text=''){
 const found=new Set();
 for(const clause of String(text).split(/[.!?;,\n]|\bbut\b|\bthough\b|\bhowever\b/i)){
  if(!clause.trim())continue;
  if(hasWord(clause,positiveWords)&&!hasWord(clause,negativeWords))continue;
  for(const [tag,words] of Object.entries(tagKeywords))if(hasWord(clause,words))found.add(tag);
 }
 return FOCUS_TAGS.filter(t=>found.has(t));
}
function detectMentions(text=''){return state.players.filter(p=>p.name&&hasWord(text,[p.name])).map(p=>p.id)}
function recentGames(n=RECENT_GAMES){return state.games.slice(-n)}
function focusWeights(games=recentGames()){const w={};games.forEach(g=>(g.tags||[]).forEach(t=>{w[t]=(w[t]||0)+1}));return w}
function rankedFocus(games=recentGames()){return Object.entries(focusWeights(games)).sort((a,b)=>b[1]-a[1])}
function teamRecord(){const r={W:0,L:0,D:0};state.games.forEach(g=>{if(r[g.result]!==undefined)r[g.result]++});return r}
function recordLabel(){const r=teamRecord();return `${r.W}-${r.L}-${r.D}`}
function gameTitle(g){
 const score=(g.gf!==''&&g.ga!=='')?` ${g.gf}–${g.ga}`:'';
 if(!g.result)return g.opponent?`Note · ${g.opponent}`:'Practice note';
 return `${({W:'Won',L:'Lost',D:'Drew'})[g.result]}${score}${g.opponent?` vs ${g.opponent}`:''}`;
}

let draftGame={result:'',opponent:'',gf:'',ga:'',note:''};
function setDraft(field,value){draftGame[field]=value}
window.setDraft=setDraft;
function setDraftResult(r){draftGame.result=draftGame.result===r?'':r;renderGameLog()}
window.setDraftResult=setDraftResult;
function previewTags(value){
 draftGame.note=value;
 const el=document.getElementById('tagPreview');
 if(!el)return;
 const tags=detectTags(value);
 el.innerHTML=tags.length?`<span class="muted preview-label">Will focus practice on:</span>${tags.map(t=>`<span class="chip on">${esc(t)}</span>`).join('')}`:'<span class="muted preview-label">Mention what needs work and it gets tagged automatically.</span>';
}
window.previewTags=previewTags;

function addGameEntry(){
 const note=draftGame.note.trim();
 if(!note&&!draftGame.result){toast('Add a result or a note');return}
 state.games.push({id:uid(),date:today(),result:draftGame.result,opponent:draftGame.opponent.trim(),gf:draftGame.gf,ga:draftGame.ga,note,tags:detectTags(note),mentions:detectMentions(note)});
 draftGame={result:'',opponent:'',gf:'',ga:'',note:''};
 saveState();renderAll();toast('Logged');
}
window.addGameEntry=addGameEntry;
function toggleGameTag(id,tag){const g=state.games.find(x=>x.id===id);if(!g)return;g.tags=g.tags.includes(tag)?g.tags.filter(t=>t!==tag):[...g.tags,tag];saveState();renderAll()}
window.toggleGameTag=toggleGameTag;
function deleteGameEntry(id){if(!confirm('Delete this log entry?'))return;state.games=state.games.filter(g=>g.id!==id);saveState();renderAll()}
window.deleteGameEntry=deleteGameEntry;

function renderGameLog(){
 const feed=[...state.games].reverse();
 const r=teamRecord();
 document.getElementById('gamelog').innerHTML=`
 <div class="section-heading"><div><h2>Game log</h2><p class="muted">Say how it went and what needs work. Your practice plans pick it up automatically.</p></div><div class="record-pills"><span class="summary-pill">${r.W}W</span><span class="summary-pill">${r.L}L</span><span class="summary-pill">${r.D}D</span></div></div>
 <article class="card composer">
  <div class="result-picker">${[['W','Won'],['D','Drew'],['L','Lost']].map(([k,label])=>`<button type="button" class="result-btn ${k.toLowerCase()} ${draftGame.result===k?'selected':''}" onclick="setDraftResult('${k}')">${label}</button>`).join('')}</div>
  <div class="composer-grid">
   <label>Opponent<input id="draftOpponent" value="${esc(draftGame.opponent)}" placeholder="Hawks" oninput="setDraft('opponent',this.value)"></label>
   <label>Our goals<input id="draftGf" type="number" min="0" max="99" value="${esc(draftGame.gf)}" oninput="setDraft('gf',this.value)"></label>
   <label>Their goals<input id="draftGa" type="number" min="0" max="99" value="${esc(draftGame.ga)}" oninput="setDraft('ga',this.value)"></label>
  </div>
  <label>How did it go?<textarea id="draftNote" rows="3" placeholder="Defense got beat on the counter all game, and we kept giving the ball away on throw-ins." oninput="previewTags(this.value)">${esc(draftGame.note)}</textarea></label>
  <div id="tagPreview" class="chip-row"><span class="muted preview-label">Mention what needs work and it gets tagged automatically.</span></div>
  <button class="primary" onclick="addGameEntry()">Add to log</button>
 </article>
 ${feed.length?`<div class="chat-feed">${feed.map(g=>{
  const names=(g.mentions||[]).map(id=>state.players.find(p=>p.id===id)?.name).filter(Boolean);
  return `<article class="chat-entry ${g.result?g.result.toLowerCase():'note'}">
   <div class="chat-meta"><span class="result-pill ${g.result?g.result.toLowerCase():'note'}">${g.result||'·'}</span><b>${esc(gameTitle(g))}</b><small>${g.date}</small><button class="icon-button small-x" aria-label="Delete entry" onclick="deleteGameEntry('${g.id}')">×</button></div>
   ${g.note?`<p>${esc(g.note)}</p>`:''}
   <div class="chip-row">${FOCUS_TAGS.map(t=>`<button class="chip ${g.tags.includes(t)?'on':''}" onclick="toggleGameTag('${g.id}','${t}')">${esc(t)}</button>`).join('')}</div>
   ${names.length?`<div class="chip-row mentions"><span class="muted preview-label">Players:</span>${names.map(n=>`<span class="chip player">${esc(n)}</span>`).join('')}</div>`:''}
  </article>`}).join('')}</div>`:'<div class="empty large">No entries yet. Log your first game above.</div>'}`;
}

function renderAll(){renderDashboard();renderPlayers();renderPractice();renderGrading();renderAttendance();renderGameDay();renderGameLog()}
renderAll();
