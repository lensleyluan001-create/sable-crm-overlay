if(typeof seedStaff==="function") S.users=seedStaff(S.users);
if(navigator.serviceWorker){
  navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister()})}).catch(function(){});
}

function wantDoor(){
  const path=(location.pathname||"/").replace(/\/+$/, "")||"/";
  const q=location.search||"";
  return path==="/login" || /[?&](door|desk|login)=/.test(q) || /(?:^|#)login/.test(location.hash||"");
}
const _draw=draw;
draw=function(){
  const root=document.getElementById("root");
  if(!root) return;
  if(!S.session&&!wantDoor()){
    location.replace("/want");
    return;
  }
  try{
    if(S.session&&typeof houseView==="function"&&houseView()&&typeof deskFilter!=="undefined"){
      if(!window.__sableOpenedFloor){
        window.__sableOpenedFloor=1;
        deskFilter="all";
      }
    }
    _draw();
  }catch(e){
    try{
      if(!S.session){ root.innerHTML=Gate(); hookGate(); }
    }catch(err){}
  }
  if(typeof showRoot==="function") showRoot();
  else {
    root.classList.add("is-on");
    document.body.classList.add("js-on");
    const door=document.getElementById("door");
    if(door) door.hidden=true;
  }
};

if(typeof hookGate==="function"){
  const _hookGate=hookGate;
  hookGate=function(){
    _hookGate();
    const ask=document.getElementById("ask");
    if(!ask) return;
    ask.onsubmit=function(e){
      e.preventDefault();
      const f=Object.fromEntries(new FormData(ask));
      if(typeof isHouse==="function"&&(isHouse(f.email)||isHouse(f.name))){
        toast="House uses Set password on Log in.";
        mode="in";
        draw();
        return;
      }
      const existing=(typeof findStaff==="function"&&(findStaff(f.email)||findStaff(f.name)))||null;
      if(existing){
        const err=setPhonePass(existing.email||String(f.email||"").trim(), String(f.password||""));
        if(err){
          gateEmail=existing.email||String(f.email||"").trim();
          toast=err;
          mode="reset";
          draw();
          return;
        }
        return;
      }
      S.requests=S.requests||[];
      S.requests.push({name:String(f.name||"").trim(),email:String(f.email||"").trim(),password:String(f.password||""),seller:f.seller||"luan",status:"pending",at:Date.now()});
      save();
      toast="Request saved on this phone. Luan still has to put you on the floor before you can enter.";
      mode="in";
      draw();
    };
  };
}

if(typeof viewPerson==="function"){
  const _viewPerson=viewPerson;
  viewPerson=function(){
    return '<button class="ghost desk-back" type="button" data-tab="todo">← Back</button>'+_viewPerson();
  };
}

if(typeof viewInvoice==="function"){
  const _viewInvoice=viewInvoice;
  viewInvoice=function(){
    return String(_viewInvoice()).replace(/\s·\s+helped by [^<]+/g,"");
  };
}

if(typeof firstMsg==="function"){
  const _firstMsg=firstMsg;
  firstMsg=function(l){
    return String(_firstMsg(l)).replace(/\b(Luan|Dylan)\b/gi,"Sable");
  };
}
if(typeof invMsg==="function"){
  const _invMsg=invMsg;
  invMsg=function(l){
    return String(_invMsg(l)).replace(/\b(Luan|Dylan)\b/gi,"Sable");
  };
}
if(typeof payMsg==="function"){
  const _payMsg=payMsg;
  payMsg=function(l){
    return String(_payMsg(l)).replace(/\b(Luan|Dylan)\b/gi,"Sable");
  };
}
if(typeof sizeMsg==="function"){
  const _sizeMsg=sizeMsg;
  sizeMsg=function(l){
    return String(_sizeMsg(l)).replace(/\b(Luan|Dylan)\b/gi,"Sable");
  };
}
if(typeof followMsg==="function"){
  const _followMsg=followMsg;
  followMsg=function(l){
    return String(_followMsg(l)).replace(/\b(Luan|Dylan)\b/gi,"Sable");
  };
}

if(!S.session) draw();
else if(typeof showRoot==="function") showRoot();
else {
  const root=document.getElementById("root");
  if(root) root.classList.add("is-on");
  document.body.classList.add("js-on");
  document.body.classList.add("has-desk");
  const door=document.getElementById("door");
  if(door) door.hidden=true;
}
