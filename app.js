'use strict';
const data = window.ZITIERTRAINING.uebungen;
const types = [...new Set(data.map(e => e.quellenart))];
const titles = ['Monografien','Sammelbände','Aufsätze aus Sammelbänden','Zeitschriftenaufsätze','Presseartikel','Internetquellen'];
const descriptions = ['Ein Buch, ein zusammenhängendes Werk.','Ein gemeinsames Buch mit Herausgebenden.','Ein einzelner Beitrag in einem herausgegebenen Buch.','Wissenschaftliche Beiträge mit Heft- und Seitenangaben.','Gedruckte Zeitungsartikel mit Datum und Druckseite.','Webseiten mit vollständiger URL und Abrufdatum.'];
const symbols = ['Ⅰ','Ⅱ','§','≡','▤','↗'];
const states = new Map();
const main = document.querySelector('main');
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const state = id => {if(!states.has(id)) states.set(id,{draft:'',revealed:false,answer:'',rating:''}); return states.get(id);};
const completed = arr => arr.filter(e=>state(e.id).revealed).length;
const cardData = arr => `<ul class="material-list">${arr.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
function render(){
 const hash = decodeURIComponent(location.hash.slice(1));
 const exercise = data.find(e=>e.id===hash);
 if(exercise) renderExercise(exercise);
 else if(hash.startsWith('art-') && types[Number(hash.slice(4))]) renderCategory(Number(hash.slice(4)));
 else renderHome();
 main.focus({preventScroll:true});
 window.scrollTo(0,0);
}
function renderHome(){
 main.innerHTML=`<section class="hero"><div class="eyebrow">Deine Facharbeit beginnt mit guten Quellen</div><h1>Richtig zitieren.<br>Sicherer schreiben.</h1><p>Übe, wie aus bibliografischen Angaben ein vollständiger Literaturverzeichniseintrag wird. Schritt für Schritt, mit echten Quellen.</p><div class="steps"><span><b>1</b>Quelle auswählen</span><span><b>2</b>Eintrag formulieren</span><span><b>3</b>Lösung vergleichen</span></div></section><section><div class="section-head"><h2>Was möchtest du üben?</h2><span class="muted">${completed(data)} von ${data.length} Übungen verglichen · in diesem Tab</span></div><div class="cards">${types.map((t,i)=>{const arr=data.filter(e=>e.quellenart===t);return `<article class="card"><div class="symbol" aria-hidden="true">${symbols[i]}</div><h3>${titles[i]}</h3><p>${descriptions[i]}</p><span class="progress-label">${completed(arr)} / ${arr.length} verglichen · 2 Grundlagen + 2 Originalaufgaben</span><progress value="${completed(arr)}" max="${arr.length}" aria-label="Fortschritt ${titles[i]}"></progress><a href="#art-${i}">${titles[i]} üben <span aria-hidden="true">→</span></a></article>`}).join('')}</div></section><p class="muted" style="margin-top:26px">Du vergleichst selbst – es gibt keine automatische Bewertung. Dein Lernstand bleibt bis zum Neuladen in diesem Tab erhalten.</p>`;
}
function renderCategory(i){
 const arr=data.filter(e=>e.quellenart===types[i]);
 main.innerHTML=`<a class="back" href="#">← Alle Quellenarten</a><div class="eyebrow">${completed(arr)} von ${arr.length} verglichen</div><h1>${titles[i]}</h1><p class="muted">Beginne mit den Datenkarten oder recherchiere direkt am Original.</p><div class="exercise-list">${arr.map((e,n)=>`<a class="exercise-link" href="#${e.id}"><span class="muted">0${n+1}</span><div><span class="badge">${esc(e.schwierigkeitsstufe)}</span><strong>${esc(e.titel)}</strong></div><span class="muted">${state(e.id).revealed?'✓ Verglichen':'Übung öffnen →'}</span></a>`).join('')}</div>`;
}
function renderExercise(e){
 const s=state(e.id),i=types.indexOf(e.quellenart),arr=data.filter(a=>a.quellenart===e.quellenart),n=arr.indexOf(e);
 main.innerHTML=`<a class="back" href="#art-${i}">← ${titles[i]} · Übersicht</a><div class="eyebrow">Übung ${n+1} von ${arr.length} · ${e.id}</div><span class="badge">${esc(e.schwierigkeitsstufe)}</span><h1 class="exercise-title">${esc(e.titel)}</h1><p>Formuliere den vollständigen Eintrag für das Literaturverzeichnis nach dem Schulkonzept.</p><div class="workspace"><section class="panel"><h2>01 · Dein Quellenmaterial</h2>${e.material.anzeigetyp==='Datenkarte'?`<p>Bringe diese Angaben in die richtige Form und Reihenfolge.</p>${cardData(e.material.angaben_unsortiert)}`:`<p>${esc(e.material.anweisung)}</p>`}<a class="button" href="${esc(e.original_url)}" target="_blank" rel="noopener noreferrer">Originalquelle öffnen ↗</a><p>Öffnet ${e.quelle_ist_pdf?'ein PDF':'die Quelle'} in einem neuen Tab.</p>${e.material.hilfestufe_bei_bedarf?`<details><summary>Tipp anzeigen: bibliografische Angaben</summary>${cardData(e.material.hilfestufe_bei_bedarf)}</details>`:''}</section><section class="panel"><h2>02 · Dein Literaturverzeichniseintrag</h2><label for="draft">${s.revealed?'Dein Entwurf (zum Überarbeiten erneut öffnen)':'Deine Eingabe'}</label><textarea id="draft" spellcheck="false" placeholder="Nachname, Vorname: …" aria-describedby="draft-help" ${s.revealed?'readonly':''}></textarea><p id="draft-help">Schreibe den vollständigen Eintrag. Deine Antwort wird erst beim Anzeigen der Lösung zum Vergleich übernommen.</p><p id="input-error" class="error" role="alert" hidden>Bitte formuliere zuerst einen eigenen Eintrag.</p><div class="actions"><button id="reveal" class="primary">${s.revealed?'Antwort überarbeiten':'Lösung anzeigen'}</button><span class="muted">Keine automatische Benotung</span></div></section></div><section id="comparison" class="compare" ${s.revealed?'':'hidden'} aria-labelledby="compare-heading"></section><nav class="pagination" aria-label="Übungen"><a class="button" href="${n?'#'+arr[n-1].id:'#art-'+i}">${n?'← Vorherige Übung':'← Übersicht'}</a><a class="button" href="${n<arr.length-1?'#'+arr[n+1].id:'#art-'+i}">${n<arr.length-1?'Nächste Übung →':'Zur Quellenart-Übersicht →'}</a></nav>`;
 const input=document.querySelector('#draft');input.value=s.draft;
 input.addEventListener('input',()=>{s.draft=input.value;document.querySelector('#input-error').hidden=true});
 document.querySelector('#reveal').onclick=()=>{
  if(s.revealed){s.revealed=false;s.rating='';renderExercise(e);document.querySelector('#draft').focus();return;}
  if(!s.draft.trim()){document.querySelector('#input-error').hidden=false;input.focus();return;}
  s.answer=s.draft;s.revealed=true;renderExercise(e);document.querySelector('#compare-heading').focus({preventScroll:true});document.querySelector('#comparison').scrollIntoView({behavior:'smooth',block:'start'});
 };
 if(s.revealed) renderComparison(e,s);
}
function renderComparison(e,s){
 const section=document.querySelector('#comparison');
 section.innerHTML=`<h2 id="compare-heading" tabindex="-1">03 · Vergleiche in deinem Tempo</h2><p class="muted">Prüfe Reihenfolge, Vollständigkeit und Zeichensetzung.</p><div class="comparison-grid"><article class="panel"><h3>Deine Eingabe</h3><p class="answer-text" id="own-answer"></p></article><article class="panel model"><h3>Musterlösung</h3><p class="answer-text" id="model-answer"></p></article></div><div class="feedback"><h3>Darauf kommt es an</h3><p>${esc(e.erklaerung)}</p>${e.hinweis?`<p class="notice">${esc(e.hinweis)}</p>`:''}<p>Wie schätzt du deinen Eintrag ein? Kleine typografische Varianten können ebenfalls richtig sein.</p><div class="rating" role="group" aria-label="Deine Selbsteinschätzung">${['Stimmt überein','Kleine Abweichung','Noch üben'].map(r=>`<button aria-pressed="${s.rating===r}">${r}</button>`).join('')}</div><p id="rating-status" role="status" class="muted">${s.rating?'Selbsteinschätzung: '+esc(s.rating):''}</p></div>`;
 document.querySelector('#own-answer').textContent=s.answer;
 document.querySelector('#model-answer').textContent=e.musterloesung;
 section.querySelectorAll('.rating button').forEach(b=>b.onclick=()=>{s.rating=b.textContent;section.querySelectorAll('.rating button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelector('#rating-status').textContent='Selbsteinschätzung: '+s.rating;});
}
window.addEventListener('hashchange',render);
document.querySelector('#reset').onclick=()=>{if(confirm('Alle Antworten und den Lernstand in diesem Tab löschen?')){states.clear();render();}};
render();
