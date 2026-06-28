
const songs=[
{id:1,nome:"Numb",artista:"Linkin Park",genero:"Rock"},
{id:2,nome:"Blinding Lights",artista:"The Weeknd",genero:"Pop"},
{id:3,nome:"Máquina do Tempo",artista:"Matuê",genero:"Trap"},
{id:4,nome:"Lose Yourself",artista:"Eminem",genero:"Rap"},
{id:5,nome:"Yellow",artista:"Coldplay",genero:"Rock"},
{id:6,nome:"Flowers",artista:"Miley Cyrus",genero:"Pop"},
{id:7,nome:"Vida Chique",artista:"Veigh",genero:"Trap"},
{id:8,nome:"Céu Azul",artista:"Charlie Brown Jr.",genero:"Rock"}
];
let state=JSON.parse(localStorage.getItem("sm_state")||'{"ratings":{},"theme":"dark"}');
const $=id=>document.getElementById(id);
const grid=$("songs-grid"),detail=$("song-detail"),noselect=$("no-selection");
let selected=null,genre="Todos",sort="nome";
function save(){localStorage.setItem("sm_state",JSON.stringify(state))}
function renderGenres(){
 const gs=["Todos",...new Set(songs.map(s=>s.genero))];
 $("genre-pills").innerHTML=gs.map(g=>`<button ${g===genre?"class='active'":""}>${g}</button>`).join("");
 [...$("genre-pills").children].forEach((b,i)=>b.onclick=()=>{genre=gs[i];renderSongs();renderGenres();});
}
function filtered(){
 let q=$("search-input").value.toLowerCase();
 let arr=songs.filter(s=>(genre=="Todos"||s.genero==genre)&&`${s.nome} ${s.artista} ${s.genero}`.toLowerCase().includes(q));
 arr.sort((a,b)=>a[sort].localeCompare(b[sort]));
 return arr;
}
function renderSongs(){
 let arr=filtered();
 $("catalog-count").textContent=`${arr.length} música(s)`;
 grid.innerHTML=arr.map(s=>`<div class="song-card" data-id="${s.id}">
<h3>${s.nome}</h3><p>${s.artista}</p><span class="genre">${s.genero}</span>
</div>`).join("");
 document.querySelectorAll(".song-card").forEach(c=>c.onclick=()=>select(+c.dataset.id));
}
function select(id){
 selected=songs.find(s=>s.id===id);
 noselect.classList.add("is-hidden");detail.classList.remove("is-hidden");
 $("detail-name").textContent=selected.nome;
 $("detail-artist").textContent=selected.artista;
 $("detail-genre").textContent=selected.genero;
 paintStars();
 updateRecs();
}
function paintStars(){
 let r=state.ratings[selected.id]||0;
 document.querySelectorAll(".star").forEach(st=>{
 st.classList.toggle("active",+st.dataset.v<=r);
 st.onclick=()=>{state.ratings[selected.id]=+st.dataset.v;save();paintStars();stats();bars();updateRecs();}
 });
}
function stats(){
 let vals=Object.values(state.ratings);
 $("st-rated").textContent=vals.length;
 $("st-total").textContent=vals.reduce((a,b)=>a+b,0);
 $("st-avg").textContent=vals.length?(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1):"—";
}
function bars(){
 let g={};
 songs.forEach(s=>{if(state.ratings[s.id])g[s.genero]=(g[s.genero]||0)+state.ratings[s.id]});
 let max=Math.max(1,...Object.values(g));
 $("genre-bars").innerHTML=Object.entries(g).map(([k,v])=>`<div class="bar">${k}<div class="progress"><span style="width:${v/max*100}%"></span></div></div>`).join("")||"";
 let fav=Object.entries(g).sort((a,b)=>b[1]-a[1])[0];
 $("st-fav").textContent=fav?fav[0]:"—";
}
function updateRecs(){
 if(!selected)return;
 $("recs-wrap").classList.remove("is-hidden");
 let rec=songs.filter(s=>s.genero===selected.genero&&s.id!==selected.id);
 $("recs-grid").innerHTML=rec.map(s=>`<div class="song-card"><h3>${s.nome}</h3><p>${s.artista}</p></div>`).join("");
}
$("search-input").oninput=renderSongs;
document.querySelectorAll(".sort-btn").forEach(b=>b.onclick=()=>{sort=b.dataset.sort;document.querySelectorAll(".sort-btn").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderSongs();});
$("btn-theme").onclick=()=>{let t=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",t);state.theme=t;save();};
$("btn-clear-hist").onclick=()=>{state.ratings={};save();stats();bars();if(selected)paintStars();};
document.documentElement.setAttribute("data-theme",state.theme||"dark");
renderGenres();renderSongs();stats();bars();
