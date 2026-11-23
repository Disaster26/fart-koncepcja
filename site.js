(function(){
var d=document,b=d.body;
// menu mobilne
var bt=d.querySelector('.burger');
if(bt){bt.addEventListener('click',function(){var o=b.classList.toggle('menu-open');bt.setAttribute('aria-expanded',o);bt.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
d.querySelectorAll('.mnav a').forEach(function(a){a.addEventListener('click',function(){b.classList.remove('menu-open');bt.setAttribute('aria-expanded','false')})});}
var yr=d.getElementById('yr');if(yr)yr.textContent=new Date().getFullYear();

// karuzela na stronie głównej
var g=d.getElementById('gal'),moved=false;
if(g){
 var figs=g.querySelectorAll('figure'),c=d.getElementById('galc'),st=0;
 function step(){return st||(st=figs[0].getBoundingClientRect().width+parseFloat(getComputedStyle(g).columnGap||20))}
 window.addEventListener('resize',function(){st=0},{passive:true});
 d.querySelectorAll('[data-g]').forEach(function(x){x.addEventListener('click',function(){g.scrollBy({left:step()*+x.dataset.g,behavior:'smooth'})})});
 function upd(){var i=Math.round(g.scrollLeft/step())+1;c.textContent='Zdjęcie '+Math.min(i,figs.length)+' / '+figs.length+' · przesuń lub kliknij, aby powiększyć'}
 g.addEventListener('scroll',function(){clearTimeout(g._t);g._t=setTimeout(function(){requestAnimationFrame(upd)},80)},{passive:true});
 var down=false,sx=0,sl=0;
 g.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=false;sx=e.clientX;sl=g.scrollLeft});
 window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>5){moved=true;g.classList.add('drag')}g.scrollLeft=sl-dx});
 window.addEventListener('pointerup',function(){if(!down)return;down=false;g.classList.remove('drag');if(moved){var s=step();g.scrollTo({left:Math.round(g.scrollLeft/s)*s,behavior:'smooth'})}});
}

// powiększenie zdjęć
var lb=d.getElementById('lb');
if(lb){
 var lbi=d.getElementById('lbi'),lbc=d.getElementById('lbc'),cur=0,btns=d.querySelectorAll('[data-full]'),last=null;
 function show(i){cur=(i+btns.length)%btns.length;lbi.src=btns[cur].dataset.full;lbi.alt=btns[cur].querySelector('img').alt;lbc.textContent=(cur+1)+' / '+btns.length}
 function close(){lb.classList.remove('on');if(last)last.focus()}
 btns.forEach(function(x,i){x.addEventListener('click',function(e){if(moved){e.preventDefault();moved=false;return}last=x;show(i);lb.classList.add('on');lb.querySelector('.x').focus()})});
 lb.querySelector('.x').onclick=close;
 lb.querySelector('.p').onclick=function(){show(cur-1)};lb.querySelector('.n').onclick=function(){show(cur+1)};
 lb.addEventListener('click',function(e){if(e.target===lb)close()});
 d.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
 var tx=0;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)show(cur+(dx<0?1:-1))});
}

// formularze (wersja testowa: bez wysyłki)
d.querySelectorAll('form.form').forEach(function(f){
 f.addEventListener('submit',function(e){
  e.preventDefault();var ok=true,first=null;
  f.querySelectorAll('.err').forEach(function(x){x.remove()});
  f.querySelectorAll('[required]').forEach(function(el){
   var bad=el.type==='checkbox'?!el.checked:!el.value.trim();
   if(!bad&&el.type==='tel')bad=el.value.replace(/\D/g,'').length<9;
   el.setAttribute('aria-invalid',bad?'true':'false');
   if(bad){ok=false;first=first||el;var m=d.createElement('span');m.className='err';m.textContent=el.type==='checkbox'?'Zaznacz zgodę, abyśmy mogli odpowiedzieć.':(el.type==='tel'?'Podaj numer telefonu.':'To pole jest wymagane.');(el.type==='checkbox'?el.parentNode:el.parentNode).appendChild(m)}
  });
  var em=f.querySelector('input[type=email]');
  if(em&&em.value&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value)){ok=false;first=first||em;em.setAttribute('aria-invalid','true');var m=d.createElement('span');m.className='err';m.textContent='Sprawdź adres e-mail.';em.parentNode.appendChild(m)}
  var msg=f.querySelector('.form-msg');
  if(!ok){first.focus();msg.hidden=true;return}
  msg.hidden=false;msg.textContent='Dziękujemy! To wersja testowa strony - wysyłka formularza zostanie włączona po uruchomieniu na malowanie.net.pl.';
 });
});

// zgody cookies i mapa
var KEY='fart_ck';
function getC(){try{var c=JSON.parse(localStorage.getItem(KEY)||'null');if(c&&Date.now()-c.t<31536e6)return c}catch(e){}return null}
function setC(map){try{localStorage.setItem(KEY,JSON.stringify({map:map,t:Date.now()}))}catch(e){}}
var ck=d.getElementById('ck'),m=d.getElementById('map'),loaded=false;
function mapOn(){
 if(!m||loaded)return;loaded=true;var q=encodeURIComponent(m.dataset.q||'Promienista 4, 64-000 Kościan');
 m.innerHTML='<iframe title="Mapa dojazdu do lakierni FART" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q='+q+'&z=15&output=embed"></iframe>';
}
function mapOff(){
 if(!m)return;loaded=false;var q=encodeURIComponent(m.dataset.q||'Promienista 4, 64-000 Kościan');
 m.innerHTML='<div class="map-ph">ul. Promienista 4, 64-000 Kościan<a href="https://www.google.com/maps/dir/?api=1&destination='+q+'" target="_blank" rel="noopener">Wyznacz trasę</a><button type="button" class="btn btn--ghost" data-map-on>Pokaż mapę Google</button></div>';
 m.querySelector('[data-map-on]').onclick=function(){setC(true);mapOn()};
}
function mapInit(){
 if(!m)return;var c=getC();
 if(c&&c.map===false){mapOff();return}
 if('IntersectionObserver' in window){var io=new IntersectionObserver(function(en){if(en[0].isIntersecting){io.disconnect();var c2=getC();if(c2&&c2.map===false)mapOff();else mapOn()}},{rootMargin:'400px'});io.observe(m)}else mapOn();
}
mapInit();
if(ck){
 var set=d.getElementById('ck-set'),cm=d.getElementById('ck-map');
 ck.addEventListener('click',function(e){
  var t=e.target.closest('[data-ck]');if(!t)return;var a=t.dataset.ck;
  if(a==='set'){if(set.hidden){set.hidden=false;t.textContent='Zapisz wybór';return}a=cm.checked?'all':'min'}
  setC(a==='all');ck.hidden=true;
  if(a==='all'){if(m&&!loaded&&m.querySelector('[data-map-on]'))mapOn()}else if(m){mapOff()}
 });
 d.querySelectorAll('[data-ck-open]').forEach(function(x){x.addEventListener('click',function(){var c=getC();cm.checked=!c||c.map!==false;set.hidden=false;d.getElementById('ck-sb').textContent='Zapisz wybór';ck.hidden=false;ck.querySelector('.btn').focus()})});
}
})();
