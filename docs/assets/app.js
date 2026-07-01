/* Itemization Overhaul codex - shared chrome + theming + loot demo */
(function(){
  var inWiki = /\/wiki\//.test(location.pathname);
  var home = inWiki ? '../index.html' : 'index.html';
  var wikiHome = inWiki ? 'index.html' : 'wiki/index.html';
  var demo = inWiki ? '../index.html#lab' : '#lab';
  var STEAM = 'https://steamcommunity.com/sharedfiles/filedetails/?id=3741866746';
  var SIGIL = '<svg viewBox="0 0 100 100" aria-hidden="true"><path fill="currentColor" d="M50 4 L60 40 L96 50 L60 60 L50 96 L40 60 L4 50 L40 40 Z"/><circle cx="50" cy="50" r="7" fill="var(--bg)"/></svg>';
  var SUN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7"/></svg>';
  var MOON='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.8 6.8 0 0 0 9.8 9.8z"/></svg>';

  // [group, file, title, isSub]
  var WIKI = [
    ['Overview','index.html','The Suite',0],
    ['Core','core.html','Core Overview',0],
    ['Core','tiers.html','Loot Tiers',1],
    ['Core','drop-rate.html','Affix Drop Rate',1],
    ['Core','affixes.html','Affixes & Ranks',1],
    ['Core','prefix-suffix.html','Prefix & Suffix Table',1],
    ['Core','artwork.html','Item Artwork',1],
    ['Core','auras.html','Auras',1],
    ['Core','special.html','Ethereal & Indestructible',1],
    ['Core','corruption.html','Corruption',1],
    ['Core','relics.html','Relics & Grudges',1],
    ['Core','cleansing.html','The Cleansing',1],
    ['Core','cube.html','The Luminary Cube',1],
    ['Core','crafting.html','Crafting & Config',1],
    ['Stats & Levels','stats-levels.html','Overview',0],
    ['Stats & Levels','requirements.html','Requirement Model',1],
    ['Runes & Socketables','runes.html','Overview',0],
    ['Runes & Socketables','sockets.html','Sockets & Runes',1],
    ['Runes & Socketables','rune-list.html','Rune Compendium',1],
    ['Runes & Socketables','runewords.html','Runewords',1],
    ['Runes & Socketables','facets.html','Facet Jewels',1],
    ['Runes & Socketables','gems.html','Gems',1],
    ['Item Sets','sets.html','Overview',0],
    ['Item Sets','set-bonuses.html','Bonuses & Auras',1],
    ['Item Sets','set-list.html','Set Compendium',1],
    ['Uniques & Mythics','uniques.html','Overview',0],
    ['Uniques & Mythics','unique-list.html','Unique Compendium',1],
    ['Uniques & Mythics','mythics.html','Mythics',1],
    ['Uniques & Mythics','expeditions.html','Expedition Chains',1],
    ['Jewelry & Charms','jewelry.html','Overview',0],
    ['Jewelry & Charms','jewelry-slots.html','Slots & Charms',1],
    ['Jewelry & Charms','sanctification.html','Sanctify & Desecrate',1],
    ['Jewelry & Charms','jewelry-uniques.html','Jewelry Legends',1],
    ['Scrolls & Potions','scrolls-potions.html','Overview',0],
    ['Scrolls & Potions','unidentified.html','Unidentified Items',1],
    ['Scrolls & Potions','consumables.html','Scrolls & Potions',1],
    ['Catacombs','catacombs.html','Overview',0],
    ['Catacombs','delving.html','Delving & Floors',1],
    ['Loot Beams','loot-beams.html','Overview',0]
  ];

  function curTheme(){return document.documentElement.getAttribute('data-theme')==='dark'?'dark':'light';}
  function setTheme(t){
    document.documentElement.setAttribute('data-theme',t);
    try{localStorage.setItem('io-theme',t);}catch(e){}
    var b=document.getElementById('themebtn'); if(b) b.innerHTML=(t==='dark'?SUN:MOON);
  }

  /* top nav */
  var navEl=document.getElementById('site-nav');
  if(navEl){
    navEl.className='top';
    navEl.innerHTML=
      '<a href="'+home+'" class="brand">'+SIGIL+' Itemization Overhaul</a>'+
      '<div class="links">'+
        '<a href="'+home+'">Home</a>'+
        '<a href="'+wikiHome+'"'+(inWiki?' class="active"':'')+'>Wiki</a>'+
        '<a href="'+demo+'" class="cta">Loot Demo</a>'+
        '<a href="'+STEAM+'" target="_blank" rel="noopener">Steam</a>'+
        '<button id="themebtn" class="themebtn themewrap" title="Toggle light / dark" aria-label="Toggle theme"></button>'+
      '</div>';
    var tb=document.getElementById('themebtn');
    tb.innerHTML=(curTheme()==='dark'?SUN:MOON);
    tb.onclick=function(){setTheme(curTheme()==='dark'?'light':'dark');};
  }

  /* footer */
  var footEl=document.getElementById('site-footer');
  if(footEl){footEl.className='site';footEl.innerHTML='Itemization Overhaul Codex &middot; Built for RimWorld 1.6 &middot; A Diablo-style loot suite &middot; <a href="'+wikiHome+'">Wiki</a> &middot; <a href="'+STEAM+'" target="_blank" rel="noopener">Steam Workshop</a>';}

  /* wiki sidebar + prev/next */
  var side=document.getElementById('wikiside');
  if(side){
    var cur=(location.pathname.split('/').pop()||'index.html');
    var html='',lastGrp='';
    WIKI.forEach(function(p){
      if(p[0]!==lastGrp){html+='<div class="grp">'+p[0]+'</div>';lastGrp=p[0];}
      html+='<a href="'+p[1]+'" class="'+(p[3]?'sub':'')+(p[1]===cur?' active':'')+'">'+p[2]+'</a>';
    });
    side.innerHTML=html;
    var pn=document.getElementById('pagenav');
    if(pn){
      var i=WIKI.findIndex(function(p){return p[1]===cur;}),out='';
      if(i>0) out+='<a href="'+WIKI[i-1][1]+'"><div class="k">Previous</div><div class="v">'+WIKI[i-1][2]+'</div></a>';
      if(i>=0&&i<WIKI.length-1) out+='<a class="next" href="'+WIKI[i+1][1]+'"><div class="k">Next</div><div class="v">'+WIKI[i+1][2]+'</div></a>';
      pn.innerHTML=out;
    }
  }

  /* reveal on scroll */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  var $=function(id){return document.getElementById(id);};

  /* ---- loot-roll demo: enchant chance -> enchanted vs plain split ---- */
  var TIERS=[
    {key:'plain', nm:'Plain White', col:'var(--t-white)',     w:0,  aff:'0 affixes'},
    {key:'white', nm:'White',       col:'var(--t-white)',     w:45, aff:'0 affixes, base variance'},
    {key:'magic', nm:'Magic',       col:'var(--t-magic)',     w:35, aff:'1 prefix + 1 suffix'},
    {key:'rare',  nm:'Rare',        col:'var(--t-rare)',      w:15, aff:'up to 2+2, rare-only affixes'},
    {key:'leg',   nm:'Legendary',   col:'var(--t-legendary)', w:4,  aff:'up to 3+3, Greater'},
    {key:'relic', nm:'Relic',       col:'var(--t-relic)',     w:1,  aff:'always 7, Artifact'}
  ];
  function rollEnchantedTier(){
    var pool=TIERS.slice(1), tot=0; pool.forEach(function(t){tot+=t.w;});
    var r=Math.random()*tot;
    for(var i=0;i<pool.length;i++){ r-=pool[i].w; if(r<=0) return pool[i]; }
    return pool[0];
  }
  var er=$('enchRange');
  if(er){
    var grid=$('lootGrid'), N=24;
    function rollAll(){
      var ench=+er.value/100, e=0, p=0;
      grid.innerHTML='';
      for(var i=0;i<N;i++){
        var t = Math.random()<ench ? rollEnchantedTier() : TIERS[0];
        if(t.key==='plain'){p++;} else {e++;}
        var d=document.createElement('div');
        d.title=t.nm+' - '+t.aff;
        d.style.cssText='aspect-ratio:1;border-radius:3px;border:1px solid var(--line);background:'+t.col+';opacity:'+(t.key==='plain'?'.32':'.92')+'';
        grid.appendChild(d);
      }
      $('enchPct').textContent=(+er.value)+'%';
      $('lootSummary').innerHTML='<b style="color:var(--accent)">'+e+'</b> enchanted &middot; <b>'+p+'</b> plain white';
    }
    er.addEventListener('input',function(){$('enchPct').textContent=(+er.value)+'%';});
    er.addEventListener('change',rollAll);
    var rb=$('rollBtn'); if(rb) rb.onclick=rollAll;
    rollAll();
  }
})();
