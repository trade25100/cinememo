const KEY='cinememo_films_v1';
const $=id=>document.getElementById(id);
let films=load();
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}}
function save(){localStorage.setItem(KEY,JSON.stringify(films));render()}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function safeUrl(s){try{let u=new URL(s);return ['http:','https:'].includes(u.protocol)?u.href:''}catch{return ''}}
function render(){
 const q=$('search').value.toLowerCase(),cat=$('filter').value,sort=$('sort').value;
 const cats=[...new Set(films.map(f=>f.category).filter(Boolean))].sort();
 const prev=$('filter').value;
 $('filter').innerHTML='<option value="">Toutes les catégories</option>'+cats.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
 if(cats.includes(prev))$('filter').value=prev;
 let shown=films.filter(f=>(!cat||f.category===cat)&&[f.title,f.category,f.description,f.quotes].join(' ').toLowerCase().includes(q));
 if(sort==='title')shown.sort((a,b)=>a.title.localeCompare(b.title,'fr'));
 else if(sort==='rating')shown.sort((a,b)=>(b.rating||0)-(a.rating||0));
 else shown.sort((a,b)=>b.updated-a.updated);
 $('stats').textContent=`${films.length} film${films.length!==1?'s':''} dans ton carnet · ${shown.length} affiché${shown.length!==1?'s':''}`;
 $('films').innerHTML=shown.map(f=>{
 const imgs=(f.images||[]).map(safeUrl).filter(Boolean);
 const gallery=imgs.length?imgs.map(u=>`<img src="${esc(u)}" alt="Image de ${esc(f.title)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'">`).join(''):'<div class="placeholder">🎞️</div>';
 const quotes=(f.quotes||'').split('\n').map(s=>s.trim()).filter(Boolean);
 const rating=Number(f.rating)||0;
 return `<article class="film"><div class="gallery">${gallery}</div><div class="filmBody"><div class="filmTop"><h2>${esc(f.title)}</h2>${f.category?`<span class="cat">${esc(f.category)}</span>`:''}</div>${rating?`<div class="stars" aria-label="${rating} sur 5">${'★'.repeat(rating)}${'☆'.repeat(5-rating)} <span style="color:#aaa;font-size:11px">${rating}/5</span></div>`:''}${f.description?`<p class="description">${esc(f.description)}</p>`:''}${quotes.length?`<ul class="quotes">${quotes.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`:''}${safeUrl(f.link)?`<a class="filmLink" href="${esc(safeUrl(f.link))}" target="_blank" rel="noopener noreferrer">Ouvrir le lien ↗</a>`:''}<div class="cardActions"><button data-edit="${f.id}">✎ Modifier</button><button class="delete" data-delete="${f.id}">Supprimer</button></div></div></article>`
 }).join('');
 $('empty').classList.toggle('hidden',films.length!==0);
 $('films').classList.toggle('hidden',films.length===0||shown.length===0);
 if(films.length&&shown.length===0){$('films').innerHTML='<p class="muted">Aucun résultat. Essaie une autre recherche.</p>';$('films').classList.remove('hidden')}
}
function openEditor(f=null){
 $('filmForm').reset();$('filmId').value=f?.id||'';$('formTitle').textContent=f?'Modifier le film':'Ajouter un film';
 if(f){$('title').value=f.title;$('category').value=f.category||'';$('rating').value=f.rating||0;$('description').value=f.description||'';$('quotes').value=f.quotes||'';$('link').value=f.link||'';$('images').value=(f.images||[]).join('\n')}
 $('editor').showModal()
}
function close(){ $('editor').close() }
['addTop','emptyAdd'].forEach(id=>$(id).addEventListener('click',()=>openEditor()));
$('close').addEventListener('click',close);$('cancel').addEventListener('click',close);
$('search').addEventListener('input',render);$('filter').addEventListener('change',render);$('sort').addEventListener('change',render);
$('films').addEventListener('click',e=>{
 const edit=e.target.closest('[data-edit]'),del=e.target.closest('[data-delete]');
 if(edit){let f=films.find(x=>x.id===edit.dataset.edit);if(f)openEditor(f)}
 if(del){let f=films.find(x=>x.id===del.dataset.delete);if(f&&confirm(`Supprimer « ${f.title} » ?`)){films=films.filter(x=>x.id!==f.id);save()}}
});
$('filmForm').addEventListener('submit',e=>{
 e.preventDefault();
 const id=$('filmId').value;
 const data={id:id||crypto.randomUUID(),title:$('title').value.trim(),category:$('category').value.trim(),rating:Number($('rating').value),description:$('description').value.trim(),quotes:$('quotes').value.trim(),link:safeUrl($('link').value.trim()),images:$('images').value.split(/\n+/).map(s=>s.trim()).filter(s=>safeUrl(s)),updated:Date.now()};
 if(!data.title)return;
 if(id)films=films.map(f=>f.id===id?data:f);else films.push(data);
 save();close();
});
$('export').addEventListener('click',()=>{
 const blob=new Blob([JSON.stringify(films,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='cinememo-export.json';a.click();URL.revokeObjectURL(url);
});
$('import').addEventListener('change',async e=>{
 const file=e.target.files[0];if(!file)return;
 try{const data=JSON.parse(await file.text());if(!Array.isArray(data)||!data.every(f=>f&&typeof f.title==='string'))throw Error();
 if(confirm('Importer ces données et remplacer le carnet actuel ?')){films=data.map(f=>({...f,id:String(f.id||crypto.randomUUID()),updated:Number(f.updated)||Date.now(),images:Array.isArray(f.images)?f.images:[]}));save()}
 }catch{alert('Fichier JSON invalide.')}e.target.value='';
});
render();
