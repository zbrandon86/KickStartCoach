const STORAGE_KEY = 'kickstart-coach-pwa-v2';
const uid = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

const drillBank = [
  ['Dynamic Ball Warm-Up','Warm-Up','Low',8,'One ball per player','Toe taps, foundations, sole rolls, and free dribbling in a grid.',['Light feet','Both feet','Look up often']],
  ['Soccer Tag','Warm-Up','Medium',8,'Cones, optional balls','Tag inside a grid. Add a ball for each player after the first round.',['Change direction','Stay aware','Keep moving']],
  ['Red Light, Green Light','Dribbling','Low',10,'One ball per player, cones','Players dribble on green, slow on yellow, and stop the ball on red.',['Close touches','Use both feet','Head up']],
  ['Gate Dribbling Challenge','Dribbling','Medium',12,'Cones, one ball per player','Players score by dribbling through as many cone gates as possible.',['Accelerate away','Change direction','Avoid traffic']],
  ['Sharks and Minnows','Dribbling','High',12,'Balls, cones, pinnies','Minnows cross the field while sharks try to knock balls away.',['Shield the ball','Change speed','Recover quickly']],
  ['Partner Passing Gates','Passing','Low',12,'One ball per pair, cones','Pairs pass through gates and move to a new gate after each success.',['Plant foot beside ball','Inside of foot','Receive across body']],
  ['Passing Square','Passing','Medium',15,'Cones, balls','Players pass around a square and follow their pass.',['Check shoulder','First touch forward','Call names']],
  ['3v1 Keep Away','Passing','High',15,'Cones, pinnies, ball','Three attackers keep possession from one defender. Rotate frequently.',['Create angles','Move after passing','Decide quickly']],
  ['Turn and Escape','Ball Control','Medium',12,'Balls, cones','Dribble to a cone, turn, then accelerate away.',['Low body position','Protect ball','Explode away']],
  ['Dribble and Finish','Shooting','Medium',12,'Goal, cones, balls','Dribble through a short pattern and finish on goal.',['Final touch out','Plant foot at target','Accuracy first']],
  ['Numbers Shooting Game','Shooting','High',15,'Goal, balls, pinnies','Coach calls a number and matching players race to win the ball and shoot.',['Shoot when open','Follow rebounds','Compete safely']],
  ['Defending the Castle','Defending','Medium',12,'Cones, balls','One player protects a cone while another tries to knock it down.',['Close under control','Side-on stance','Do not stab']],
  ['1v1 to Two Goals','Defending','High',15,'Cones, pinnies, balls','Attacker can score in either small goal, forcing balanced defending.',['Stay goal side','Slow attacker','Change direction']],
  ['End-Zone Soccer','Game','Medium',15,'Cones, pinnies, ball','Score by passing to a teammate who controls the ball in an end zone.',['Find space','Pass with pace','Defend together']],
  ['4v4 Small-Sided Game','Game','High',20,'Cones, pinnies, small goals','Play short 4v4 rounds with simple conditions tied to the theme.',['Spread out','Transition quickly','Be creative']]
].map(([name,category,intensity,minutes,equipment,description,points]) => ({id:uid(),name,category,intensity,minutes,equipment,description,points}));

const samplePlayers = [
  {id:uid(),name:'Alex',jersey:'7',position:'Midfielder',notes:''},
  {id:uid(),name:'Jordan',jersey:'10',position:'Forward',notes:''},
  {id:uid(),name:'Sam',jersey:'4',position:'Defender',notes:''}
];
const defaultState = {players:samplePlayers,practicePlan:[],grades:[],attendance:[],lineup:{},settings:{teamName:'My U9 Team'}};
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
 const minutes=state.practicePlan.reduce((s,d)=>s+d.minutes,0); const latest=state.grades.at(-1); const attendanceToday=state.attendance.find(a=>a.date===today());
 document.getElementById('dashboard').innerHTML=`
 <div class="hero"><div><p class="eyebrow">READY FOR THE FIELD</p><h2>${esc(state.settings.teamName)}</h2><p>Your roster, plans, attendance, grades, and rotations work offline after the app is installed.</p></div><button class="primary lime" onclick="switchView('practice')">Build today’s practice</button></div>
 <div class="grid cols-3">
  <article class="card stat"><strong>${state.players.length}</strong><span>Players</span></article>
  <article class="card stat"><strong>${minutes}</strong><span>Practice minutes</span></article>
  <article class="card stat"><strong>${attendanceToday?.present?.length||0}</strong><span>Present today</span></article>
 </div>
 <div class="quick-grid">
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
 <div class="card player-list">${state.players.length?state.players.map(p=>`<div class="player-row"><div class="avatar">${esc(p.jersey||p.name[0])}</div><div><strong>${esc(p.name)}</strong><div class="muted">${esc(p.position)}${p.notes?` · ${esc(p.notes)}`:''}</div></div><div class="row-actions"><button class="secondary small" onclick="openPlayerDialog('${p.id}')">Edit</button><button class="danger-button small" onclick="deletePlayer('${p.id}')">Remove</button></div></div>`).join(''):'<div class="empty">Add your first player.</div>'}</div>`}
function openPlayerDialog(id=''){const p=state.players.find(x=>x.id===id);playerDialogTitle.textContent=p?'Edit player':'Add player';playerId.value=p?.id||'';playerName.value=p?.name||'';jerseyNumber.value=p?.jersey||'';position.value=p?.position||'Not assigned';playerNotes.value=p?.notes||'';playerDialog.showModal()}
window.openPlayerDialog=openPlayerDialog;
playerForm.addEventListener('submit',e=>{e.preventDefault();const p={id:playerId.value||uid(),name:playerName.value.trim(),jersey:jerseyNumber.value,position:position.value,notes:playerNotes.value.trim()};if(!p.name)return;const i=state.players.findIndex(x=>x.id===p.id);i>=0?state.players[i]=p:state.players.push(p);saveState();playerDialog.close();renderAll();toast('Player saved')});
function deletePlayer(id){if(!confirm('Remove this player and their saved records?'))return;state.players=state.players.filter(p=>p.id!==id);state.grades=state.grades.filter(g=>g.playerId!==id);state.attendance.forEach(a=>a.present=a.present.filter(x=>x!==id));delete state.lineup[id];saveState();renderAll()}
window.deletePlayer=deletePlayer;

function generatePractice(){const focus=document.getElementById('focus').value;const duration=Number(document.getElementById('duration').value);const playerCount=Number(document.getElementById('playerCount').value)||state.players.length||8;let pool=[...drillBank];const warm=pool.filter(d=>d.category==='Warm-Up').sort(()=>Math.random()-.5)[0];const game=pool.filter(d=>d.category==='Game').sort(()=>Math.random()-.5)[0];const focused=pool.filter(d=>focus==='Balanced'||d.category===focus).sort(()=>Math.random()-.5);const others=pool.filter(d=>!['Warm-Up','Game'].includes(d.category)&&!focused.includes(d)).sort(()=>Math.random()-.5);const plan=[warm];let total=warm.minutes;for(const d of [...focused,...others]){if(total+d.minutes+game.minutes<=duration){plan.push({...d,description:`${d.description} Recommended for about ${playerCount} players.`});total+=d.minutes}if(total>=duration-game.minutes-8)break}plan.push({...game,minutes:Math.max(10,duration-total)});state.practicePlan=plan;saveState();renderPractice();toast('Practice generated')}
window.generatePractice=generatePractice;
function renderPractice(){const total=state.practicePlan.reduce((s,d)=>s+d.minutes,0);document.getElementById('practice').innerHTML=`
 <div class="section-heading"><div><h2>Practice builder</h2><p class="muted">Generate an age-appropriate session, then adjust it.</p></div>${state.practicePlan.length?'<button class="secondary" onclick="window.print()">Print</button>':''}</div>
 <article class="card"><div class="form-grid"><label>Focus<select id="focus"><option>Balanced</option><option>Dribbling</option><option>Passing</option><option>Ball Control</option><option>Shooting</option><option>Defending</option></select></label><label>Length<select id="duration"><option value="45">45 minutes</option><option value="60" selected>60 minutes</option><option value="75">75 minutes</option><option value="90">90 minutes</option></select></label><label>Players<input id="playerCount" type="number" min="4" max="24" value="${state.players.length||10}"></label><button class="primary form-button" onclick="generatePractice()">Generate plan</button></div></article>
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
function renderGameDay(){document.getElementById('gameday').innerHTML=`<div class="section-heading"><div><h2>Game Day</h2><p class="muted">Assign starting positions and track who begins on the bench.</p></div><button class="secondary" onclick="clearLineup()">Clear</button></div><div class="field"><div class="field-line center"></div><div class="field-circle"></div>${positions.slice(0,-1).map((pos,i)=>`<div class="position-slot slot-${i}"><small>${pos}</small><strong>${esc(state.players.find(p=>state.lineup[p.id]===pos)?.name||'Open')}</strong></div>`).join('')}</div><article class="card lineup-list"><h2>Player assignments</h2>${state.players.map(p=>`<div class="lineup-row"><b>${esc(p.name)}</b><select onchange="setPosition('${p.id}',this.value)"><option value="">Unassigned</option>${positions.map(pos=>`<option ${state.lineup[p.id]===pos?'selected':''}>${pos}</option>`).join('')}</select></div>`).join('')}</article>`}

function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`kickstart-backup-${today()}.json`;a.click();URL.revokeObjectURL(url);toast('Backup downloaded')} window.exportData=exportData;
importFile.addEventListener('change',async e=>{try{const parsed=JSON.parse(await e.target.files[0].text());if(!Array.isArray(parsed.players))throw Error();state={...structuredClone(defaultState),...parsed};saveState();dataDialog.close();renderAll();toast('Backup restored')}catch{alert('That backup file could not be read.')}});
function resetData(){if(confirm('Delete all players, plans, grades, attendance, and lineup data?')){state={players:[],practicePlan:[],grades:[],attendance:[],lineup:{},settings:{teamName:'My U9 Team'}};saveState();dataDialog.close();renderAll()}} window.resetData=resetData;
backupBtn.onclick=()=>dataDialog.showModal();

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;installBtn.hidden=false});
installBtn.onclick=async()=>{if(!deferredInstallPrompt)return;deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;installBtn.hidden=true};
window.addEventListener('appinstalled',()=>toast('KickStart installed'));
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));

function renderAll(){renderDashboard();renderPlayers();renderPractice();renderGrading();renderAttendance();renderGameDay()}
renderAll();
