(function(){
  var $=function(i){ return document.getElementById(i); };
  var VIEW=!!window.__VIEW;
  var KEY='arena-cartas-v2';
  var seed=[
    {id:1,name:'PlayerDPS',sub:'“Uma honra jogar ao seu lado, PlayerDPS.” (o adversário)',ab:'Jogada Impossível',abd:'Uma vez por partida, tenta a jogada mais ousada do time. Se der certo, vira lenda. Se der errado, ele jura que deu certo.',desc:'“Na minha cabeça ia dar certo essa jogada.”',type:'Carta de momento',rar:'Lendária',photo:'',full:false,stats:[['Mira',92],['MOV',90],['Gamesense',87],['Persona',80],['INT',88],['Carisma',81]]},
    {id:2,name:'Sombra Escarlate',sub:'Um tiro. Uma chance. Nenhuma testemunha.',ab:'Tiro Silencioso',abd:'Fica imóvel por um turno. No seguinte, o primeiro tiro nunca erra.',desc:'Espera em silêncio no alto até você entrar na mira.',type:'Atiradora de elite',rar:'Mítica',photo:'',full:false,stats:[['Mira',98],['MOV',68],['Gamesense',90],['Persona',85],['Inteligência',82],['Frieza',97]]}
  ];
  var deck=seed, D=null, editId=null, openId=null;
  var hadCards=false, SEED=window.__SEED||null;
  try{ var s=JSON.parse(localStorage.getItem(KEY)||'null'); if(Array.isArray(s)&&s.length){ deck=s; hadCards=true; } }catch(e){}
  if(!hadCards&&SEED&&Array.isArray(SEED.cards)) deck=JSON.parse(JSON.stringify(SEED.cards));
  if(VIEW&&window.__DATA&&Array.isArray(window.__DATA.cards)) deck=window.__DATA.cards;
  function persist(){ if(VIEW) return; try{ localStorage.setItem(KEY,JSON.stringify(deck)); }catch(e){} }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function cl(v){ v=parseInt(v,10); return isNaN(v)?0:Math.max(0,Math.min(100,v)); }
  function total(d){ return d.stats.reduce(function(a,s){ return a+cl(s[1]); },0); }
  function hx(c){ return [1,3,5].map(function(i){ return parseInt(c.substr(i,2),16); }); }
  function lt(c){ return 'rgb('+hx(c).map(function(n){ return Math.round(n+(255-n)*.45); })+')'; }
  function ra(c,a){ return 'rgba('+hx(c)+','+a+')'; }
  function avg(d){ return d.stats.length?Math.round(total(d)/d.stats.length):0; }
  var DIA='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.6L14.4 8L8 14.4L1.6 8Z"/></svg>';
  function hand(l,r,d){ return '<svg class="hand" style="left:'+l+'%;--r:'+r+'deg;animation-delay:'+d+'s" viewBox="-4 -8 52 98" aria-hidden="true"><path d="M17 90L18 52H27L28 90Z" fill="#242a21"/><path d="M12 54L14 40H31L33 54Z" fill="#2a3126"/><path d="M19 86L21 72L18 60M26 88L24 74" stroke="#4a1414" stroke-width="1.3" fill="none"/><g stroke="#303829" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M16 41L12 29L8 20L9 9"/><path d="M20 40L18 26L16 14L18 3"/><path d="M25 40L26 25L29 13L28 2"/><path d="M30 42L35 30L38 21L41 11"/><path d="M13 50L5 46L1 38"/></g><g stroke="#c9bf94" stroke-width="1.5" stroke-linecap="round" fill="none"><path d="M9 9L10 2M18 3L19 -4M28 2L27 -5M41 11L43 4M1 38L-1 32"/></g><g fill="#8c8f7a"><circle cx="12" cy="29" r="1.5"/><circle cx="8" cy="20" r="1.3"/><circle cx="18" cy="26" r="1.5"/><circle cx="16" cy="14" r="1.3"/><circle cx="26" cy="25" r="1.5"/><circle cx="29" cy="13" r="1.3"/><circle cx="35" cy="30" r="1.5"/><circle cx="38" cy="21" r="1.3"/><circle cx="22" cy="46" r="2"/></g></svg>'; }
  var NECRO='<div class="fx"><svg class="bolts" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline class="bolt" points="10,0 14,10 8,18 15,28 9,38"/><polyline class="bolt" points="100,22 90,30 96,40 86,50 92,62"/><polyline class="bolt" points="60,0 56,8 63,14 58,22"/></svg>'+hand(5,-8,0)+hand(24,6,.6)+hand(50,-4,1.2)+hand(72,8,.3)+hand(90,-10,.9)+'</div>';
  var HEART='<div class="fx hfx"><svg class="bolts" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline class="bolt" points="92,0 86,10 94,19 85,30"/><polyline class="bolt" points="0,60 9,66 3,75 12,84"/><polyline class="bolt" points="40,0 44,8 38,15 43,24"/></svg><svg class="heart" viewBox="0 0 100 100" aria-hidden="true"><path class="hl" d="M50 30C48 22 40 18 30 18C14 18 8 32 12 46C18 64 38 78 48 90L52 74L44 64L53 52L45 42Z"/><path class="hr" d="M50 30C52 22 60 18 70 18C86 18 92 32 88 46C82 64 62 78 52 90L55 74L47 64L56 52L48 42Z"/></svg></div>';
  function vein(st){ return '<svg class="vein" style="'+st+'" viewBox="0 0 20 20" aria-hidden="true"><path d="M2 8Q8 8 8 2M12 2Q12 8 18 8M18 12Q12 12 12 18M8 18Q8 12 2 12"/></svg>'; }
  var RB=['18,8 14,5 18,3 15,0','50,8 54,5 49,3 53,0','82,8 78,5 83,3 80,0','22,92 26,95 21,97 25,100','58,92 54,95 59,97 55,100','88,92 92,95 87,97 91,100','3,30 1,27 3,24 0,21','3,70 1,73 3,76 0,79','97,32 99,29 97,26 100,23','97,68 99,71 97,74 100,77'].map(function(p,i){ return '<polyline class="rb" style="animation-delay:'+((i*.53)%2.4).toFixed(2)+'s" points="'+p+'"/>'; }).join('');
  var RAYS='<svg class="rays" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">'+RB+'</svg>';
  var RAGE='<div class="fx rfx">'+vein('right:9%;top:8%')+vein('left:4%;top:46%')+vein('right:5%;bottom:30%')+'</div>';
  function pl(a){ return a.map(function(p,i){ return '<polyline class="bolt" style="animation-delay:'+(i*1.1).toFixed(1)+'s;animation-duration:'+(3.4+i*.6).toFixed(1)+'s" points="'+p+'"/>'; }).join(''); }
  function stud(st){ return '<i class="stud" style="'+st+'"></i>'; }
  var SV=' viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"';
  var LEND='<div class="fx lfx"><div class="rays-l"></div><svg class="edge"'+SV+'><polygon points="0,6 5,0 26,0 29,1 38,1 41,0 60,0 64,2.4 95,2.4 100,5 100,94 94,100 64,100 61,99 52,99 49,100 36,100 32,97.6 6,97.6 0,94"/></svg><svg class="bolts"'+SV+'>'+pl(['1,12 2.6,16 1,20 2.6,25 1,30','99,58 97.4,63 99,68 97.4,74 99,80','12,1 16,.4 20,1.4 25,.5 30,1.1','60,99 64,98.6 68,99.4 73,98.7'])+'</svg>'+stud('left:1px;top:50%')+stud('right:1px;top:42%')+stud('left:49%;top:1px')+stud('left:75%;bottom:1px')+'</div>';
  var MIT='<div class="fx mfx"><svg class="edge"'+SV+'><polygon points="0,9 8,0 50,0 54,2.6 100,2.6 100,40 98.6,43 100,46 100,91 92,100 46,100 42,97.4 0,97.4 0,60 1.4,57 0,54"/></svg><svg class="bolts"'+SV+'>'+pl(['1,8 2.4,12 .8,17 2.4,22 1,28 2.6,33','2.4,22 7,24 10,23','99,52 97.6,57 99.2,62 97.6,68 99,74 97.4,80','97.6,68 93,70 90,69','12,1 16,.4 20,1.4 25,.5 30,1.2','58,99 62,98.6 66,99.5 71,98.7 76,99.3'])+'</svg></div>';
  var WAVE='M0 10Q12.5 0 25 10T50 10T75 10T100 10T125 10T150 10T175 10T200 10V20H0Z';
  function wv(c){ return '<svg class="wv '+c+'" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="'+WAVE+'"/></svg>'; }
  var CFC=['#ffd23f','#ffffff','#2aa9e0','#ffe98a','#7fd0f5'], CF='';
  for(var ci=0;ci<14;ci++){ CF+='<i class="cf" style="left:'+((ci*37+11)%96)+'%;background:'+CFC[ci%5]+';animation-delay:-'+((ci*1.7)%9).toFixed(1)+'s;animation-duration:'+(8+(ci%4)*1.5)+'s"></i>'; }
  var VIDA='<div class="fx vfx"><div class="sun"></div><svg class="edge"'+SV+'><polygon points="0,5 5,0 95,0 100,5 100,98.6 92,99.6 84,100 76,99.6 68,98.8 60,98.4 52,98.8 44,99.6 36,100 28,99.6 20,98.8 12,98.4 6,98.8 0,99.4"/></svg>'+CF+wv('w1')+wv('w2')+'</div>';
  var BASE='<div class="fx bfx"><div class="scan"></div><div class="ringwrap"><i class="ringb"></i><i class="ringb r2"></i></div><svg class="edge"'+SV+'><polygon points="0,8 6,1.1 36,1.1 40,0 60,0 64,1.1 94,1.1 100,8 100,92 94,98.9 64,98.9 60,100 40,100 36,98.9 6,98.9 0,92"/></svg><i class="core t"></i><i class="core b"></i></div>';
  var CNT='<div class="fx cnt"><svg class="edge"'+SV+'><polygon points="0,5 5,0 7.0,0 8.65,0.86 10.31,0 11.96,0.95 13.62,0 15.27,1.24 16.92,0 18.58,0.87 20.23,0 21.88,0.91 23.54,0 25.19,0.97 26.85,0 28.5,0.65 30.15,0 31.81,0.91 33.46,0 35.12,1.0 36.77,0 38.42,1.13 40.08,0 41.73,0.58 43.38,0 45.04,0.74 46.69,0 48.35,0.57 50.0,0 51.65,1.15 53.31,0 54.96,1.05 56.62,0 58.27,0.53 59.92,0 61.58,1.29 63.23,0 64.88,1.27 66.54,0 68.19,1.02 69.85,0 71.5,0.99 73.15,0 74.81,0.63 76.46,0 78.12,0.51 79.77,0 81.42,0.92 83.08,0 84.73,0.55 86.38,0 88.04,0.65 89.69,0 91.35,0.69 95,0 100,5 100,7.0 99.16,8.13 100,9.26 98.64,10.39 100,11.53 98.67,12.66 100,13.79 98.19,14.92 100,16.05 98.58,17.18 100,18.32 98.43,19.45 100,20.58 98.6,21.71 100,22.84 98.41,23.97 100,25.11 98.65,26.24 100,27.37 98.87,28.5 100,29.63 98.0,30.76 100,31.89 98.01,33.03 100,34.16 98.19,35.29 100,36.42 98.35,37.55 100,38.68 98.82,39.82 100,40.95 98.92,42.08 100,43.21 98.85,44.34 100,45.47 99.12,46.61 100,47.74 98.28,48.87 100,50.0 98.72,51.13 100,52.26 98.18,53.39 100,54.53 98.74,55.66 100,56.79 98.05,57.92 100,59.05 98.18,60.18 100,61.32 99.2,62.45 100,63.58 98.95,64.71 100,65.84 98.11,66.97 100,68.11 98.64,69.24 100,70.37 98.02,71.5 100,72.63 98.72,73.76 100,74.89 99.11,76.03 100,77.16 98.44,78.29 100,79.42 98.27,80.55 100,81.68 98.88,82.82 100,83.95 99.1,85.08 100,86.21 98.8,87.34 100,88.47 98.04,89.61 100,90.74 98.29,91.87 100,95 95,100 93.0,100 91.35,99.41 89.69,100 88.04,99.3 86.38,100 84.73,99.42 83.08,100 81.42,99.45 79.77,100 78.12,98.86 76.46,100 74.81,99.36 73.15,100 71.5,99.05 69.85,100 68.19,99.14 66.54,100 64.88,99.35 63.23,100 61.58,98.91 59.92,100 58.27,99.4 56.62,100 54.96,98.99 53.31,100 51.65,99.41 50.0,100 48.35,99.16 46.69,100 45.04,99.33 43.38,100 41.73,99.28 40.08,100 38.42,98.72 36.77,100 35.12,98.86 33.46,100 31.81,99.26 30.15,100 28.5,98.79 26.85,100 25.19,99.33 23.54,100 21.88,99.18 20.23,100 18.58,98.82 16.92,100 15.27,98.99 13.62,100 11.96,99.42 10.31,100 8.65,98.71 5,100 0,95 0,93.0 1.06,91.87 0,90.74 1.11,89.61 0,88.47 1.73,87.34 0,86.21 1.19,85.08 0,83.95 1.16,82.82 0,81.68 0.89,80.55 0,79.42 0.91,78.29 0,77.16 1.5,76.03 0,74.89 1.09,73.76 0,72.63 1.52,71.5 0,70.37 1.25,69.24 0,68.11 1.34,66.97 0,65.84 1.95,64.71 0,63.58 1.38,62.45 0,61.32 1.49,60.18 0,59.05 1.84,57.92 0,56.79 1.02,55.66 0,54.53 0.98,53.39 0,52.26 1.89,51.13 0,50.0 1.78,48.87 0,47.74 1.1,46.61 0,45.47 1.03,44.34 0,43.21 1.69,42.08 0,40.95 1.93,39.82 0,38.68 1.04,37.55 0,36.42 1.94,35.29 0,34.16 1.86,33.03 0,31.89 1.52,30.76 0,29.63 1.31,28.5 0,27.37 0.92,26.24 0,25.11 0.85,23.97 0,22.84 1.96,21.71 0,20.58 1.09,19.45 0,18.32 1.65,17.18 0,16.05 1.11,14.92 0,13.79 1.79,12.66 0,11.53 1.52,10.39 0,9.26 1.15,8.13"/></svg><svg class="crk" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon points="74,24 60,21 52,14 66,8 80,17"/><polygon points="74,24 88,28 95,36 82,42 70,34"/><polygon points="22,78 30,72 44,70 38,84 24,90"/><polygon points="22,78 15,84 9,97 20,95"/><polyline points="74,24 66,19 60,21 52,14 44,16 38,8"/><polyline points="74,24 82,30 88,28 95,36"/><polyline points="74,24 70,34 74,42 68,52 70,60"/><polyline points="74,24 80,17 79,10 86,4"/><polyline points="60,21 57,28 51,30"/><polyline points="68,52 61,55 55,63"/><polyline points="88,28 90,20 96,16"/><polyline points="22,78 30,72 34,76 44,70 50,74 60,68"/><polyline points="22,78 15,84 17,92 9,97"/><polyline points="22,78 26,87 22,94 28,100"/><polyline points="22,78 14,70 16,62 8,58"/><polyline points="44,70 46,63 52,60"/><polyline points="17,92 24,90 28,95"/></svg><svg class="bolts cbo"'+SV+'>'+pl(['1,14 2.4,19 .8,25 2.4,31','99,56 97.5,62 99.2,68 97.5,74','18,1 22,.4 26,1.4 31,.5','66,99 70,98.6 74,99.5 79,98.7','74,24 70,18 72,10 66,4','22,78 26,86 20,92'])+'</svg><div class="fogc"></div></div>';
  var SILM='<img class="msil" alt="" src="images/img-3be0cf021365.png">';
  var MFX='<svg class="bolts mbo"'+SV+'>'+pl(['1,10 2.6,15 .8,21 2.6,27 1,33','2.6,27 8,29 11,28','99,48 97.4,54 99.2,60 97.4,66 99,72','97.4,66 92,68 89,67','14,1 18,.4 22,1.4 27,.5 32,1.2','62,99 66,98.6 70,99.5 75,98.7 80,99.3','90,0 86,7 91,13 83,22 88,30 80,40','8,100 12,92 6,85 14,76 9,68'])+'</svg><div class="fogm"></div>';
  function bfx(d){ var b=d.over?BASE.replace('<div class="scan">','<div class="trace"></div><div class="scan">'):BASE; return d.rar==='Moments'?b.slice(0,-6)+MFX+(d.sil!==false?SILM:'')+'</div>':b; }
  function card(d){
    var li=d.stats.map(function(s){ var v=cl(s[1]); return '<li><span>'+esc(s[0])+'</span><span class="bar"><i style="width:'+v+'%"></i></span><b>'+v+'</b></li>'; }).join('');
    var ph=d.photo?'<img alt="Foto de '+esc(d.name)+'" src="'+d.photo+'"">':'<span>Sem foto</span>';
    var r=esc(d.rar), cs='', tc=((d.rar==='Coração Partido'||d.rar==='Counter')&&d.attr===false)?' noattr':'', pb=((d.cut||+d.vig>0)&&d.photo)?' blend':'';
    if((d.rar==='Forma Base'||d.rar==='Moments')&&/^#[0-9a-f]{6}$/i.test(d.color||'')){ cs=' style="--a:'+d.color+';--b:'+lt(d.color)+';--bc:'+d.color+';--g:'+ra(d.color,.55)+'"'; tc=' tint'; }
    return '<div class="frame" data-r="'+r+'"'+cs+'><article class="card'+tc+'" data-r="'+r+'"><div class="inner'+(d.full?' full':'')+'">'
      +'<div class="ban"><h2 class="n">'+esc(d.name||'Sem nome')+'</h2></div>'
      +(d.sub?'<p class="sub">'+esc(d.sub)+'</p>':'')
      +(d.rar==='Rage'?'<div class="pwrap"><div class="photo'+pb+'"><div class="pic">'+ph+'</div></div>'+RAYS+'</div>':'<div class="photo'+pb+'"><div class="pic">'+ph+'</div></div>')
      +'<div class="low"><div class="type"><span>'+esc(d.type)+'</span><span>'+r+'</span></div>'
      +(d.ab?'<div class="ab"><span class="tag">Habilidade</span><span class="abn">'+esc(d.ab)+'</span>'+(d.abd?'<p class="abd">'+esc(d.abd)+'</p>':'')+'</div>':'')
      +'<ul class="stats">'+li+'</ul>'+(d.desc?'<p class="desc">'+esc(d.desc)+'</p>':'')
      +'</div></div><div class="gem" title="Média dos atributos"><small>LUZ</small><span class="gv">'+DIA+'<b>'+avg(d)+'</b></span></div><div class="holo"></div><div class="glit"></div>'+(d.rar==='Necromante'?NECRO:d.rar==='Coração Partido'?HEART:d.rar==='Rage'?RAGE:d.rar==='Lendária'?LEND:d.rar==='Mítica'?MIT:d.rar==='Vida Boa'?VIDA:(d.rar==='Forma Base'||d.rar==='Moments')?bfx(d):d.rar==='Counter'?CNT:'')+'</article></div>';
  }
  function gallery(){
    var q=$('q').value.trim().toLowerCase(), r=$('fr').value, o=$('so').value;
    var l=deck.filter(function(d){ return (!r||d.rar===r)&&(!q||(d.name+' '+d.sub+' '+(d.ab||'')+' '+d.desc).toLowerCase().indexOf(q)>-1); });
    l.sort(function(a,b){ return o==='p'?total(b)-total(a):o==='n'?a.name.localeCompare(b.name):b.id-a.id; });
    $('grid').innerHTML=l.map(function(d){ return '<div class="tile" tabindex="0" role="button" aria-label="Abrir '+esc(d.name)+'" data-id="'+d.id+'">'+card(d)+'</div>'; }).join('');
    $('none').hidden=l.length>0;
  }
  function show(sec){
    $('dks').hidden=sec!=='d'; $('gal').hidden=sec!=='g'; $('mk').hidden=sec!=='m';
    $('td').setAttribute('aria-pressed',sec==='d'); $('tg').setAttribute('aria-pressed',sec==='g'); $('tm').setAttribute('aria-pressed',sec==='m');
    if(sec==='g') gallery(); if(sec==='d') drawDecks();
  }
  function blank(){ return {id:0,name:'',sub:'',ab:'',abd:'',desc:'',type:'Carta de momento',rar:'Rara',photo:'',orig:'',cut:false,tol:45,vig:0,full:false,stats:[['Mira',50],['MOV',50],['Gamesense',50],['Persona',50],['INT',50],['Carisma',50]]}; }
  function openEditor(d,id){
    D=JSON.parse(JSON.stringify(d)); editId=id;
    $('name').value=D.name; $('sub').value=D.sub; $('ab').value=D.ab||''; $('abd').value=D.abd||''; $('desc').value=D.desc;
    $('type').value=D.type; $('rar').value=D.rar; $('full').checked=!!D.full; $('over').checked=!!D.over; $('bcolor').value=D.color||'#8fd8ff'; $('bopts').hidden=D.rar!=='Forma Base'&&D.rar!=='Moments'; $('hopts').hidden=D.rar!=='Coração Partido'&&D.rar!=='Counter'; $('st').hidden=D.rar==='Moments'; if(!D.orig&&D.photo) D.orig=D.photo; fillDeckSel(); $('cdk').value=D.deck||''; $('cut').checked=!!D.cut; $('hattr').checked=D.attr!==false; $('sil').checked=D.sil!==false; $('tol').value=D.tol||45; $('vig').value=D.vig||0; $('photo').value='';
    var b=$('st'); b.innerHTML='<legend>Atributos (nome e nota de 0 a 100)</legend>';
    D.stats.forEach(function(s,i){ var r=document.createElement('div'); r.className='row';
      r.innerHTML='<input data-i="'+i+'" data-k="0" aria-label="Nome do atributo '+(i+1)+'" value="'+esc(s[0])+'"><input data-i="'+i+'" data-k="1" type="number" min="0" max="100" aria-label="Nota do atributo '+(i+1)+'" value="'+cl(s[1])+'">';
      b.appendChild(r); });
    $('pv').innerHTML=card(D); show('m');
  }
  function read(){
    D.name=$('name').value; D.sub=$('sub').value; D.ab=$('ab').value; D.abd=$('abd').value; D.desc=$('desc').value;
    D.type=$('type').value; D.rar=$('rar').value; $('bopts').hidden=D.rar!=='Forma Base'&&D.rar!=='Moments'; $('hopts').hidden=D.rar!=='Coração Partido'&&D.rar!=='Counter'; $('st').hidden=D.rar==='Moments'; D.full=$('full').checked; D.over=$('over').checked; D.cut=$('cut').checked; D.attr=$('hattr').checked; D.deck=$('cdk').value; D.sil=$('sil').checked; D.tol=+$('tol').value; D.vig=+$('vig').value;
    $('st').querySelectorAll('input').forEach(function(e){ D.stats[+e.dataset.i][+e.dataset.k]=e.value; });
  }
  $('f').addEventListener('input',function(){ read(); $('pv').innerHTML=card(D); });
  function blur(a,w,h,r){ var t=new Float32Array(a.length), o=new Float32Array(a.length), x, y, s, j, c=2*r+1;
    for(y=0;y<h;y++) for(x=0;x<w;x++){ s=0; for(j=-r;j<=r;j++) s+=a[y*w+Math.min(w-1,Math.max(0,x+j))]; t[y*w+x]=s/c; }
    for(y=0;y<h;y++) for(x=0;x<w;x++){ s=0; for(j=-r;j<=r;j++) s+=t[Math.min(h-1,Math.max(0,y+j))*w+x]; o[y*w+x]=s/c; }
    return o; }
  function fx(im,cut,tol,vig){
    var M=420, k=Math.min(1,M/Math.max(im.width,im.height)), w=Math.round(im.width*k), h=Math.round(im.height*k), n=w*h, i, q, xx, yy;
    var cv=document.createElement('canvas'); cv.width=w; cv.height=h; var g=cv.getContext('2d'); g.drawImage(im,0,0,w,h);
    var id=g.getImageData(0,0,w,h), d=id.data, a=new Float32Array(n), st=new Int32Array(n), sp=0;
    for(i=0;i<n;i++) a[i]=1;
    function border(fn){ for(var u=0;u<w;u++){ fn(u); fn((h-1)*w+u); } for(var v=0;v<h;v++){ fn(v*w); fn(v*w+w-1); } }
    if(cut){
      var cnt={};
      border(function(r){ var p=r*4, kk=(d[p]>>4)*256+(d[p+1]>>4)*16+(d[p+2]>>4); cnt[kk]=(cnt[kk]||0)+1; });
      var pal=Object.keys(cnt).sort(function(u,v){ return cnt[v]-cnt[u]; }).slice(0,1).map(function(kk){ kk=+kk; return [((kk>>8)&15)*16+8,((kk>>4)&15)*16+8,(kk&15)*16+8]; });
      var T2=tol*tol, seen=new Uint8Array(n);
      var isbg=function(r){ var p=r*4; for(var j=0;j<pal.length;j++){ var dr=d[p]-pal[j][0], dg=d[p+1]-pal[j][1], db=d[p+2]-pal[j][2]; if(dr*dr+dg*dg+db*db<T2) return true; } return false; };
      var push=function(r){ if(!seen[r]&&isbg(r)){ seen[r]=1; st[sp++]=r; } };
      border(push);
      while(sp){ q=st[--sp]; xx=q%w; yy=(q/w)|0; if(xx>0) push(q-1); if(xx<w-1) push(q+1); if(yy>0) push(q-w); if(yy<h-1) push(q+w); }
      for(i=0;i<n;i++) a[i]=seen[i]?0:1;
      a=blur(blur(a,w,h,2),w,h,1);
      for(i=0;i<n;i++) a[i]=Math.max(0,Math.min(1,(a[i]-.5)*2.2+.5));
      var lab=new Int32Array(n), best=0, bs=0, L=0, sz;
      var nb=function(r){ if(a[r]>.5&&!lab[r]){ lab[r]=L; st[sp++]=r; } };
      for(i=0;i<n;i++){ if(a[i]>.5&&!lab[i]){ L++; sz=0; lab[i]=L; st[sp++]=i;
        while(sp){ q=st[--sp]; sz++; xx=q%w; yy=(q/w)|0; if(xx>0) nb(q-1); if(xx<w-1) nb(q+1); if(yy>0) nb(q-w); if(yy<h-1) nb(q+w); }
        if(sz>bs){ bs=sz; best=L; } } }
      for(i=0;i<n;i++) if(lab[i]!==best) a[i]=0;
    }
    if(vig>0){
      var cx=w/2, cy=h/2, rx=w/2, ry=h/2;
      if(cut){ var x0=w, x1=0, y0=h, y1=0;
        for(yy=0;yy<h;yy++) for(xx=0;xx<w;xx++) if(a[yy*w+xx]>.5){ if(xx<x0)x0=xx; if(xx>x1)x1=xx; if(yy<y0)y0=yy; if(yy>y1)y1=yy; }
        if(x1>x0&&y1>y0){ cx=(x0+x1)/2; cy=(y0+y1)/2; rx=(x1-x0)/2*1.12+4; ry=(y1-y0)/2*1.12+4; } }
      var s0=.95-vig/100*.8;
      for(yy=0;yy<h;yy++) for(xx=0;xx<w;xx++){ var dx=(xx-cx)/rx, dy=(yy-cy)/ry, t=(Math.sqrt(dx*dx+dy*dy)-s0)/(1-s0); t=Math.max(0,Math.min(1,t)); a[yy*w+xx]*=1-t*t*(3-2*t); }
    }
    for(i=0;i<n;i++) d[i*4+3]=Math.round(a[i]*255);
    g.putImageData(id,0,0);
    return cv.toDataURL('image/webp',.85);
  }
  function proc(){
    if(!D||!D.orig) return;
    if(!D.cut&&!(D.vig>0)){ D.photo=D.orig; $('pv').innerHTML=card(D); return; }
    var im=new Image(); im.onload=function(){ D.photo=fx(im,D.cut,D.tol||45,D.vig||0); $('pv').innerHTML=card(D); }; im.src=D.orig;
  }
  $('photo').addEventListener('change',function(e){
    var f=e.target.files&&e.target.files[0]; if(!f) return;
    var fr=new FileReader();
    fr.onload=function(){ var im=new Image(); im.onload=function(){
      var m=520, k=Math.min(1,m/Math.max(im.width,im.height)), c=document.createElement('canvas');
      c.width=Math.round(im.width*k); c.height=Math.round(im.height*k); c.getContext('2d').drawImage(im,0,0,c.width,c.height);
      D.orig=c.toDataURL('image/jpeg',.82); proc(); };
      im.src=fr.result; };
    fr.readAsDataURL(f);
  });
  var pt; ['cut','tol','vig'].forEach(function(i){ $(i).addEventListener('input',function(){ read(); clearTimeout(pt); pt=setTimeout(proc,70); }); });
  $('save').addEventListener('click',function(){
    read(); if(!D.name.trim()){ $('name').focus(); return; }
    if(editId){ D.id=editId; deck=deck.map(function(d){ return d.id===editId?D:d; }); }
    else { D.id=Date.now(); deck.push(D); }
    persist(); show('d');
  });
  $('bcolor').addEventListener('input',function(){ D.color=this.value; });
  $('bclr').onclick=function(){ D.color=''; $('bcolor').value='#8fd8ff'; $('pv').innerHTML=card(D); };
  /* ===== Decks ===== */
  var CIMG='images/img-c5dcc2d9149c.webp';
  var LOGOIC='images/img-7c3dcada3fbe.jpg';
  function drawLogo(){ $('logot').textContent=DK.logo; var src=DK.logoIcon||LOGOIC; $('logoic').src=src; document.title=DK.logo;
    var l=document.getElementById('favl'); if(!l){ l=document.createElement('link'); l.id='favl'; l.rel='icon'; document.head.appendChild(l); } l.href=src; }
  var DKEY='arena-decks-v1', DK=null;
  try{ DK=JSON.parse(localStorage.getItem(DKEY)||'null'); }catch(e){}
  if(VIEW&&window.__DATA&&window.__DATA.dk) DK=window.__DATA.dk;
  if(!DK||!DK.decks){
    if(SEED&&SEED.dk&&SEED.dk.decks){ DK=JSON.parse(JSON.stringify(SEED.dk)); persist(); saveDK(); } else {
    DK={logo:'iGuina',title:'Decks',sub:'Passe o mouse sobre os decks para parar a roda e toque em um para abrir as cartas.',decks:[
      {id:'d1',name:'PlayerDPS',group:'Amigos',icon:{t:'e',v:'🎮'}},{id:'d2',name:'Sombra Escarlate',group:'Originais',icon:{t:'e',v:'🌙'}}]};
    deck.forEach(function(c){ if(!c.deck){ var m=DK.decks.filter(function(x){ return x.name.toLowerCase()===String(c.name).toLowerCase(); })[0]; if(m) c.deck=m.id; } });
    persist(); try{ localStorage.setItem(DKEY,JSON.stringify(DK)); }catch(e){}
    }
  }
  function saveDK(){ if(VIEW) return; try{ localStorage.setItem(DKEY,JSON.stringify(DK)); }catch(e){} }
  if(DK.logo==='Arena de Cartas'){ DK.logo='iGuina'; saveDK(); }
  /* dados embutidos: quando a versão muda, só ACRESCENTA decks e cartas que faltam (nunca apaga nem sobrescreve o que já existe) */
  (function(){ if(!SEED) return; var vk='arena-seed-ver', v=String(SEED.ver||'1'), old=null; try{ old=localStorage.getItem(vk); }catch(e){} if(old===v) return;
    var ch=false;
    if(SEED.dk&&SEED.dk.decks) SEED.dk.decks.forEach(function(d){ if(!DK.decks.some(function(x){ return x.id===d.id; })){ DK.decks.push(JSON.parse(JSON.stringify(d))); ch=true; } });
    if(Array.isArray(SEED.cards)) SEED.cards.forEach(function(c){ if(!deck.some(function(x){ return x.id===c.id; })){ deck.push(JSON.parse(JSON.stringify(c))); ch=true; } });
    if(ch){ persist(); saveDK(); } try{ localStorage.setItem(vk,v); }catch(e){} })();
  /* renomeia os atributos: IQ -> INT e Movimentação -> MOV (uma vez por aparelho) */
  (function(){ var fk='arena-rename-v1', done=null; try{ done=localStorage.getItem(fk); }catch(e){} if(done&&!VIEW) return;
    var ch=false; deck.forEach(function(c){ (c.stats||[]).forEach(function(s){ var l=String(s[0]).trim().toLowerCase(); if(l==='iq'){ s[0]='INT'; ch=true; } else if(l==='movimentação'||l==='movimentacao'){ s[0]='MOV'; ch=true; } }); });
    if(ch) persist(); try{ localStorage.setItem(fk,'1'); }catch(e){} })();
  var dOpen={}, dEdit=false, dSort='p', dBig=true, dGrp='', dArm=null, icId=null, icImg=null, dSel='', obSig='', dExp=false;
  function fillDeckSel(){ $('cdk').innerHTML='<option value="">Sem deck</option>'+DK.decks.map(function(d){ return '<option value="'+esc(d.id)+'">'+esc(d.name)+'</option>'; }).join(''); }
  function dAvg(cs){ return cs.length?Math.round(cs.reduce(function(a,c){ return a+avg(c); },0)/cs.length):null; }
  function dring(v){ var n=v==null?0:Math.round(v/100*12), h='', i; for(i=0;i<12;i++){ var a=i/12*2*Math.PI-Math.PI/2; h+='<circle cx="'+(28+22*Math.cos(a)).toFixed(1)+'" cy="'+(28+22*Math.sin(a)).toFixed(1)+'" r="2.4" class="'+(i<n?'on':'off')+'"/>'; } return '<svg class="ring" viewBox="0 0 56 56" aria-hidden="true">'+h+'</svg>'; }
  function dinner(ic){ return ic&&ic.t==='i'?'<img alt="" src="'+ic.v+'">':esc((ic&&ic.v)||'🃏'); }
  function dicon(ic,edit,id){ var inner=dinner(ic); return edit?'<button type="button" class="dic" data-a="icon" data-id="'+esc(id)+'" title="Mudar o ícone" aria-label="Mudar o ícone">'+inner+'</button>':'<span class="dic">'+inner+'</span>'; }
  /* ordem das cartas: Forma Base primeiro, depois da maior para a menor LUZ */
  function sortCards(cs){ return cs.slice().sort(function(a,b){ var fa=a.rar==='Forma Base'?1:0, fb=b.rar==='Forma Base'?1:0; return (fb-fa)||(avg(b)-avg(a)); }); }
  function rowHTML(x,ed,open,stk){
    var d=x.d, n=x.cards.length, cs=sortCards(x.cards), body='';
    var tile=function(c,st){ return '<div class="tile" tabindex="0" role="button" aria-label="Abrir '+esc(c.name)+'" data-id="'+c.id+'"'+(st?' style="'+st+'"':'')+'>'+card(c)+'</div>'; };
    if(open){
      if(stk&&n>1){
        var zf=dBig?1:.62, av=($('dpanel').clientWidth||Math.min(window.innerWidth,1100)-40)-40, g=Math.round(Math.min(325,Math.max(40,(av/zf-330)/(n-1))));
        body='<div class="stkbar"><button type="button" class="ghost" data-a="stk">'+(dExp?'Recolher cartas':'Expandir cartas')+'</button><span>Passe o mouse sobre as cartas para abrir o leque</span></div>'
          +'<div class="dbody stack'+(dExp?' ex':'')+(dBig?'':' sm')+'" style="--g:'+g+'px;--zf:'+zf+'">'+cs.map(function(c,i){ return tile(c,'--i:'+i+';z-index:'+(n-i)); }).join('')+'</div>';
      } else body='<div class="dbody'+(dBig?'':' sm')+'">'+cs.map(function(c){ return tile(c); }).join('')+(n?'':'<p class="none">Nenhuma carta neste deck ainda. Edite uma carta e escolha este deck.</p>')+'</div>';
    }
    return '<div class="drow'+(open?' open':'')+'"><div class="dhead" data-a="toggle" data-id="'+esc(d.id)+'"'+(ed?'':' role="button" tabindex="0"')+'>'
      +dicon(d.icon,ed,d.id)
      +'<div class="dmeta"><div class="dn">'+(ed?'<input class="dnm" data-f="name" data-id="'+esc(d.id)+'" value="'+esc(d.name)+'" aria-label="Nome do deck">':esc(d.name))
      +'<span class="dbadge"><b>'+(x.v==null?'—':x.v)+'</b><i>LUZ</i></span></div>'
      +'<div class="dsubl">'+(ed?'<input class="dgr" data-f="group" data-id="'+esc(d.id)+'" value="'+esc(d.group||'')+'" placeholder="Grupo" aria-label="Grupo do deck">':esc(d.group||'Sem grupo'))+' · '+n+(n===1?' carta':' cartas')+'</div></div>'
      +(ed?'<button type="button" class="ghost" data-a="del" data-id="'+esc(d.id)+'">'+(dArm===d.id?'Confirmar?':'Remover')+'</button>':'')
      +dring(x.v)+'<span class="chev"></span></div>'+body+'</div>';
  }
  function drawOrbit(list){
    var N=list.length, f=Math.min(.16,(2*Math.PI*.36/Math.max(N,1))*.82);
    if(!N){ $('orbit').innerHTML='<p class="none">Nenhum deck neste grupo.</p>'; return; }
    $('orbit').innerHTML='<div class="ob" style="--f:'+f.toFixed(3)+'"><img class="ob-img" alt="" src="'+(DK.centerImg||CIMG)+'"><div class="ob-ring">'+list.map(function(x,i){
      return '<div class="ob-item" style="--a:'+(i/N*360).toFixed(2)+'deg"><div class="ob-in"><button type="button" class="ob-btn" data-id="'+esc(x.d.id)+'" aria-label="Abrir o deck '+esc(x.d.name)+'">'+dinner(x.d.icon)+'</button><span class="ob-lb">'+esc(x.d.name)+'</span></div></div>';
    }).join('')+'</div><div class="ob-c"><b id="obt">'+esc(DK.title)+'</b><span id="obs">Passe o mouse e escolha um deck</span></div></div>';
  }
  function drawDecks(){
    $('dtitle').textContent=DK.title; $('dsub').textContent=DK.sub; drawLogo();
    $('dsort').textContent='Ordem: '+({p:'maior LUZ',n:'nome',r:'mais recentes'}[dSort]);
    var allOpen=DK.decks.length>0&&DK.decks.every(function(d){ return dOpen[d.id]; });
    $('dexp').hidden=!dEdit; $('dexp').textContent=allOpen?'Recolher todos':'Exibir todos'; $('dsize').textContent=dBig?'Cartas grandes':'Cartas pequenas'; $('dedit').textContent=dEdit?'Concluir edição':'Editar página';
    $('dkedit').hidden=!dEdit;
    var gs=[]; DK.decks.forEach(function(d){ if(d.group&&gs.indexOf(d.group)<0) gs.push(d.group); });
    $('dchips').innerHTML='<button type="button" class="chip'+(dGrp===''?' on':'')+'" data-g="">Todos ('+DK.decks.length+')</button>'+gs.map(function(g){ return '<button type="button" class="chip'+(dGrp===g?' on':'')+'" data-g="'+esc(g)+'">'+esc(g)+' ('+DK.decks.filter(function(d){ return d.group===g; }).length+')</button>'; }).join('');
    var list=DK.decks.filter(function(d){ return !dGrp||d.group===dGrp; }).map(function(d,i){ var cs=deck.filter(function(c){ return c.deck===d.id; }); return {d:d,cards:cs,v:dAvg(cs),i:i}; });
    list.sort(function(a,b){ return dSort==='p'?(b.v==null?-1:b.v)-(a.v==null?-1:a.v):dSort==='n'?a.d.name.localeCompare(b.d.name):b.i-a.i; });
    if(!dGrp){ var loose=deck.filter(function(c){ return !c.deck||!DK.decks.some(function(d){ return d.id===c.deck; }); }); if(loose.length) list.push({d:{id:'_',name:'Sem deck',group:'',icon:{t:'e',v:'🃏'},fixed:true},cards:loose,v:dAvg(loose)}); }
    if(dSel&&!list.some(function(x){ return x.d.id===dSel; })) dSel='';
    $('dlist').hidden=!dEdit; $('orbit').hidden=dEdit; $('dpanel').hidden=dEdit;
    if(dEdit){ $('dlist').innerHTML=list.map(function(x){ return rowHTML(x,!x.d.fixed,!!dOpen[x.d.id]); }).join('')||'<p class="none">Nenhum deck neste grupo.</p>'; obSig=''; return; }
    var sig=JSON.stringify(list.map(function(x){ return [x.d.id,x.d.name,x.d.icon&&String(x.d.icon.v).slice(-14)]; }))+dGrp+dSort+DK.title+(DK.centerImg?DK.centerImg.length:0);
    if(sig!==obSig){ obSig=sig; drawOrbit(list); }
    $('orbit').querySelectorAll('.ob-item').forEach(function(it){ it.classList.toggle('sel',it.querySelector('.ob-btn').dataset.id===dSel); });
    var sel=list.filter(function(x){ return x.d.id===dSel; })[0];
    $('dpanel').innerHTML=sel?rowHTML(sel,false,true,true):'';
  }
  function dclick(e,panel){
    var t=e.target.closest('.tile'); if(t){ openTile(t); return; }
    var b=e.target.closest('[data-a]'); if(!b) return; var id=b.dataset.id, a=b.dataset.a;
    if(a==='stk'){ dExp=!dExp; drawDecks(); return; }
    if(a==='toggle'){ if(e.target.closest('input,button')) return; if(panel) dSel=''; else dOpen[id]=!dOpen[id]; drawDecks(); }
    else if(a==='icon'){ icId=id; icImg=null; var d=DK.decks.filter(function(x){ return x.id===id; })[0]; $('icem').value=d.icon&&d.icon.t==='e'?d.icon.v:''; $('icf').value=''; $('icprev').innerHTML=dicon(d.icon,false); $('icdlg').showModal(); }
    else if(a==='del'){ if(dArm===id){ DK.decks=DK.decks.filter(function(x){ return x.id!==id; }); deck.forEach(function(c){ if(c.deck===id) c.deck=''; }); dArm=null; persist(); saveDK(); } else { dArm=id; setTimeout(function(){ if(dArm===id){ dArm=null; drawDecks(); } },3000); } drawDecks(); }
  }
  function dkey(e,panel){ if(e.key!=='Enter'&&e.key!==' ') return; if(e.target.closest('input,button')) return; var t=e.target.closest('.tile'); if(t){ e.preventDefault(); openTile(t); return; } var h=e.target.closest('.dhead'); if(h&&!dEdit){ e.preventDefault(); if(panel) dSel=''; else dOpen[h.dataset.id]=!dOpen[h.dataset.id]; drawDecks(); } }
  $('dlist').addEventListener('click',function(e){ dclick(e,false); });
  $('dpanel').addEventListener('click',function(e){ dclick(e,true); });
  $('dlist').addEventListener('keydown',function(e){ dkey(e,false); });
  $('dpanel').addEventListener('keydown',function(e){ dkey(e,true); });
  $('orbit').addEventListener('click',function(e){ var b=e.target.closest('.ob-btn'); if(!b) return; dSel=b.dataset.id; drawDecks(); $('dpanel').scrollIntoView({behavior:'smooth',block:'nearest'}); });
  $('orbit').addEventListener('mouseover',function(e){ var b=e.target.closest('.ob-btn'); if(!b) return; var d=DK.decks.filter(function(x){ return x.id===b.dataset.id; })[0]; $('obt').textContent=d?d.name:'Sem deck'; $('obs').textContent='Toque para abrir o deck'; });
  $('orbit').addEventListener('mouseout',function(e){ if(e.relatedTarget&&e.relatedTarget.closest&&e.relatedTarget.closest('.ob-btn')) return; var t=$('obt'); if(t){ t.textContent=DK.title; $('obs').textContent='Passe o mouse e escolha um deck'; } });
  $('dlist').addEventListener('change',function(e){ var f=e.target.dataset.f; if(!f) return; var d=DK.decks.filter(function(x){ return x.id===e.target.dataset.id; })[0]; if(!d) return; d[f]=e.target.value.trim()||(f==='name'?'Deck':''); saveDK(); drawDecks(); });
  $('dchips').addEventListener('click',function(e){ var b=e.target.closest('.chip'); if(!b) return; dGrp=b.dataset.g; drawDecks(); });
  $('dsort').onclick=function(){ dSort=dSort==='p'?'n':dSort==='n'?'r':'p'; drawDecks(); };
  $('dexp').onclick=function(){ var all=DK.decks.length>0&&DK.decks.every(function(d){ return dOpen[d.id]; }); DK.decks.forEach(function(d){ dOpen[d.id]=!all; }); drawDecks(); };
  $('dsize').onclick=function(){ dBig=!dBig; drawDecks(); };
  $('dedit').onclick=function(){ dEdit=!dEdit; if(dEdit){ $('elogo').value=DK.logo; $('etitle').value=DK.title; $('esub').value=DK.sub; } dArm=null; drawDecks(); };
  [['elogo','logo'],['etitle','title'],['esub','sub']].forEach(function(p){ $(p[0]).addEventListener('input',function(){ DK[p[1]]=this.value; saveDK(); $('dtitle').textContent=DK.title; $('dsub').textContent=DK.sub; drawLogo(); }); });
  $('elogoic').addEventListener('change',function(e){ var f=e.target.files&&e.target.files[0]; if(!f) return; var fr=new FileReader();
    fr.onload=function(){ var im=new Image(); im.onload=function(){ var c=document.createElement('canvas'); c.width=c.height=112; var k=Math.max(112/im.width,112/im.height), w=im.width*k, h=im.height*k;
      c.getContext('2d').drawImage(im,(112-w)/2,(112-h)/2,w,h); DK.logoIcon=c.toDataURL('image/jpeg',.86); saveDK(); drawLogo(); }; im.src=fr.result; };
    fr.readAsDataURL(f); });
  $('ecim').addEventListener('change',function(e){ var f=e.target.files&&e.target.files[0]; if(!f) return; var fr=new FileReader();
    fr.onload=function(){ var im=new Image(); im.onload=function(){ var k=Math.min(1,600/Math.max(im.width,im.height)), c=document.createElement('canvas'); c.width=Math.round(im.width*k); c.height=Math.round(im.height*k);
      c.getContext('2d').drawImage(im,0,0,c.width,c.height); DK.centerImg=c.toDataURL('image/webp',.86); saveDK(); obSig=''; drawDecks(); }; im.src=fr.result; };
    fr.readAsDataURL(f); });
  $('ecrm').onclick=function(){ DK.centerImg=''; $('ecim').value=''; saveDK(); obSig=''; drawDecks(); };
  $('dexport').onclick=function(){ var st=$('expst'); st.textContent='';
    if(!(window.claude&&claude.use)){ st.textContent='Exportação indisponível aqui.'; return; }
    var cards=deck.map(function(c){ var o=Object.assign({},c); delete o.orig; return o; });
    claude.use('downloads').then(function(dl){ if(!dl){ st.textContent='Exportação indisponível neste navegador.'; return; }
      return dl.save({filename:'iguina-dados.json',data:new Blob([JSON.stringify({v:1,dk:DK,cards:cards})],{type:'application/json'})}).then(function(){ st.textContent='Arquivo gerado. Envie-o aqui no chat para eu atualizar a versão de visualização.'; }); })
    .catch(function(e){ st.textContent=(e&&e.code==='declined')?'Salvamento cancelado.':'Não foi possível exportar.'; }); };
  $('dnew').onclick=function(){ var id='d'+Date.now(); DK.decks.push({id:id,name:'Novo deck',group:'',icon:{t:'e',v:'🃏'}}); dOpen[id]=true; saveDK(); drawDecks(); };
  $('icf').addEventListener('change',function(e){ var f=e.target.files&&e.target.files[0]; if(!f) return; var fr=new FileReader();
    fr.onload=function(){ var im=new Image(); im.onload=function(){ var c=document.createElement('canvas'); c.width=c.height=96; var k=Math.max(96/im.width,96/im.height), w=im.width*k, h=im.height*k;
      c.getContext('2d').drawImage(im,(96-w)/2,(96-h)/2,w,h); icImg=c.toDataURL('image/png'); $('icprev').innerHTML=dicon({t:'i',v:icImg},false); }; im.src=fr.result; };
    fr.readAsDataURL(f); });
  $('icno').onclick=function(){ $('icdlg').close(); };
  $('icok').onclick=function(){ var d=DK.decks.filter(function(x){ return x.id===icId; })[0]; var em=$('icem').value.trim();
    if(d){ if(icImg) d.icon={t:'i',v:icImg}; else if(em) d.icon={t:'e',v:em}; saveDK(); } $('icdlg').close(); obSig=''; drawDecks(); };
  $('td').onclick=function(){ show('d'); };
  $('tg').onclick=function(){ show('g'); };
  $('tm').onclick=function(){ openEditor(blank(),null); };
  ['q','fr','so'].forEach(function(i){ $(i).addEventListener('input',gallery); });
  function openTile(t){ if(!t) return; openId=+t.dataset.id; var d=deck.filter(function(x){ return x.id===openId; })[0]; $('big').innerHTML=card(d); $('dlg').showModal(); }
  $('grid').addEventListener('click',function(e){ openTile(e.target.closest('.tile')); });
  $('grid').addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openTile(e.target.closest('.tile')); } });
  $('cl').onclick=function(){ $('dlg').close(); };
  $('dlg').addEventListener('click',function(e){ if(e.target===$('dlg')) $('dlg').close(); });
  $('ed').onclick=function(){ var d=deck.filter(function(x){ return x.id===openId; })[0]; $('dlg').close(); openEditor(d,openId); };
  $('rm').onclick=function(){ deck=deck.filter(function(x){ return x.id!==openId; }); persist(); $('dlg').close(); gallery(); drawDecks(); };
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.addEventListener('pointermove',function(e){
      var f=e.target.closest&&e.target.closest('.frame'); if(!f) return;
      var r=f.getBoundingClientRect(), x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
      f.style.setProperty('--mx',x*100); f.style.setProperty('--my',y*100);
      f.style.setProperty('--rx',((.5-y)*14)+'deg'); f.style.setProperty('--ry',((x-.5)*14)+'deg');
    });
    document.addEventListener('pointerout',function(e){
      var f=e.target.closest&&e.target.closest('.frame');
      if(f&&!f.contains(e.relatedTarget)){ ['--rx','--ry','--mx','--my'].forEach(function(p){ f.style.removeProperty(p); }); }
    });
  }
  var real=false; try{ real=localStorage.getItem('arena-visual')==='real'; }catch(e){}
  function applyReal(){ document.body.classList.toggle('real',real); $('ts').setAttribute('aria-pressed',real); try{ localStorage.setItem('arena-visual',real?'real':'arcade'); }catch(e){} }
  $('ts').onclick=function(){ real=!real; applyReal(); };
  applyReal();
  if(VIEW) document.body.classList.add('viewonly');
  /* ===== música de fundo (volume 20%, com botão de mutar) ===== */
  (function(){
    var a=new Audio('audio/musica.mp3');
    a.loop=true; a.volume=.2; a.preload='auto';
    var muted=false, started=false, btn=$('mus');
    try{ muted=localStorage.getItem('arena-mudo')==='1'; }catch(e){}
    a.muted=muted;
    var ON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
    var OFF='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 6 6M22 9l-6 6"/></svg>';
    function icon(){ btn.innerHTML=muted?OFF:ON; btn.setAttribute('aria-pressed',muted); var t=muted?'Ativar a música':'Silenciar a música'; btn.setAttribute('aria-label',t); btn.title=t; }
    function play(){ var pr=a.play(); if(pr&&pr.catch) pr.catch(function(){}); }
    a.addEventListener('playing',function(){ started=true; });
    play();
    ['pointerdown','keydown','touchstart'].forEach(function(ev){ document.addEventListener(ev,function(){ if(!started) play(); },true); });
    document.addEventListener('visibilitychange',function(){ if(document.hidden) a.pause(); else if(started) play(); });
    btn.addEventListener('click',function(){ muted=!muted; a.muted=muted; try{ localStorage.setItem('arena-mudo',muted?'1':'0'); }catch(e){} icon(); if(!muted&&a.paused) play(); });
    icon();
  })();
  show('d');
})();
