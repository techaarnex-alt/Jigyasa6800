import React, { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@400;500;600;700&display=swap');
  .jit-root{
    --ink:#10231C; --pine:#16302B; --pine-2:#1F4438; --paper:#F5F6F0; --paper-2:#ECEEE4;
    --gold:#D9A404; --gold-deep:#A97800; --clay:#8B5E34; --line:#DAD6C8; --line-dark:rgba(245,246,240,0.14);
    --muted:#5B6B62;
    font-family:'Inter',sans-serif; background:var(--paper); color:var(--ink); line-height:1.55;
  }
  .jit-root *{box-sizing:border-box;}
  .jit-root h1,.jit-root h2,.jit-root h3,.jit-root h4{font-family:'Fraunces',serif;color:var(--pine);margin:0;font-weight:500;letter-spacing:-0.01em;}
  .jit-root p{margin:0;} .jit-root a{color:inherit;text-decoration:none;}
  .jit-wrap{max-width:1180px;margin:0 auto;padding:0 32px;}
  @media(max-width:640px){.jit-wrap{padding:0 20px;}}
  @keyframes riseIn{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
  .jit-rise{animation:riseIn .7s cubic-bezier(.2,.7,.3,1) both;}

  nav.jit-nav{background:var(--paper);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:50;}
  .jit-adminbar{background:#EAF1F7;border-bottom:1px solid #C9D8E3;}
  .jit-adminbar-inner{display:flex;overflow-x:auto;scrollbar-width:none;}
  .jit-adminbar-inner::-webkit-scrollbar{display:none;}
  .jit-adminbar a{
    flex:none;font-size:12.5px;font-weight:600;color:#1F4E73;
    padding:9px 14px;border-right:1px solid #C9D8E3;white-space:nowrap;
  }
  .jit-adminbar a:hover{background:#DCE9F3;color:var(--pine);}
  .jit-adminbar a:last-child{border-right:none;}
   .jit-navrow{display:flex;align-items:center;justify-content:space-between;min-height:72px;padding-top:12px;padding-bottom:12px;gap:16px;}
   .jit-brand{display:flex;align-items:center;gap:10px;flex:none;}
   .jit-brand-logo{width:44px;height:44px;object-fit:contain;flex:none;}
  .jit-brand-text .name{font-family:'Fraunces',serif;font-size:18px;font-weight:600;color:var(--pine);}
  .jit-brand-text .tag{font-size:12px;line-height:1.35;color:var(--muted);}
  .jit-navlinks{display:flex;align-items:center;gap:24px;flex:none;}
  .jit-navlinks a{font-size:14px;color:var(--ink);position:relative;padding:4px 0;white-space:nowrap;}
  .jit-navlinks a:hover{color:var(--pine);}
  .jit-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 20px;font-size:14px;font-weight:600;line-height:1;border-radius:3px;border:1px solid transparent;cursor:pointer;font-family:'Inter',sans-serif;transition:background .18s ease, box-shadow .18s ease, transform .18s ease;}
  .jit-btn-gold{background:var(--gold);color:var(--ink);box-shadow:0 1px 0 rgba(0,0,0,0.08);}
  .jit-btn-gold:hover{background:var(--gold-deep);box-shadow:0 6px 16px rgba(169,120,0,0.35);transform:translateY(-1px);}
  .jit-btn-outline{border-color:var(--pine);color:var(--pine);background:transparent;}
  .jit-btn-ghost-light{border-color:var(--line-dark);color:var(--paper);background:transparent;}
  .jit-navcta{display:flex;align-items:center;gap:10px;flex:none;}
  .jit-navphone{font-size:14px;font-weight:600;color:var(--pine);display:flex;align-items:center;gap:6px;white-space:nowrap;}
  .jit-menu-toggle{display:none;background:none;border:none;cursor:pointer;}
  @media(max-width:1140px){.jit-navlinks{gap:18px;}.jit-navphone span{display:none;}}
  @media(max-width:1040px){.jit-navlinks{display:none;}.jit-menu-toggle{display:block;}}
  .jit-mobile-menu{display:none;flex-direction:column;position:absolute;top:100%;left:0;right:0;z-index:51;border-top:1px solid var(--line);background:var(--paper);box-shadow:0 12px 20px rgba(16,35,28,0.12);}
  .jit-mobile-menu.open{display:flex;}
  .jit-mobile-menu a{padding:13px 0;border-bottom:1px solid var(--line);font-size:14px;font-weight:500;}
  @media(max-width:640px){
    .jit-navrow{min-height:64px;gap:12px;}
    .jit-brand{flex:1;min-width:0;}
    .jit-brand-logo{width:38px;height:38px;}
    .jit-brand-text .name{font-size:15.5px;line-height:1.15;}
    .jit-brand-text .tag{font-size:11px;}
    .jit-navcta{gap:8px;}
    .jit-navcta .jit-btn{padding:9px 12px;font-size:13px;}
    .jit-navcta .jit-btn-gold{display:none;}
    .jit-hero-stats{justify-content:space-between;flex-wrap:nowrap;}
    .jit-hero-stat{flex:1 1 0;margin-right:0;padding:0 8px;border-right:1px solid var(--line-dark);}
    .jit-hero-stat:first-child{padding-left:0;}
    .jit-hero-stat:last-child{padding-right:0;}
  }

  .jit-hero{background:
      radial-gradient(720px 420px at 82% 8%, rgba(217,164,4,0.16), transparent 60%),
      radial-gradient(900px 600px at -10% 90%, rgba(31,68,56,0.9), transparent 60%),
      var(--pine);
    color:var(--paper);overflow:hidden;position:relative;}
  .jit-hero::before{
    content:"";position:absolute;inset:0;pointer-events:none;opacity:.5;
    background-image:radial-gradient(rgba(245,246,240,0.09) 1px, transparent 1px);
    background-size:22px 22px;
    -webkit-mask-image:linear-gradient(to bottom, black, transparent 85%);
    mask-image:linear-gradient(to bottom, black, transparent 85%);
  }
  .jit-hero-grid{position:relative;display:grid;grid-template-columns:1.05fr .95fr;gap:44px;align-items:center;padding-top:64px;padding-bottom:52px;}
  @media(max-width:940px){.jit-hero-grid{grid-template-columns:1fr;padding-top:44px;padding-bottom:32px;}}
  .jit-hero-kicker{font-size:13px;color:var(--gold);font-weight:600;margin-bottom:16px;}
  .jit-hero h1{font-size:clamp(1.9rem,4vw,3rem);color:var(--paper);line-height:1.1;max-width:12ch;}
  .jit-hero h1 em{font-style:italic;color:var(--gold);font-weight:400;}
  .jit-hero-sub{margin-top:18px;font-size:15.5px;color:#D7DED8;max-width:46ch;}
  .jit-hero-actions{display:flex;gap:12px;margin-top:26px;flex-wrap:wrap;}
  .jit-hero-stats{display:flex;gap:0;margin-top:38px;border-top:1px solid var(--line-dark);padding-top:20px;flex-wrap:wrap;}
  .jit-hero-stat{padding-right:30px;margin-right:30px;border-right:1px solid var(--line-dark);}
  .jit-hero-stat:last-child{border-right:none;margin-right:0;padding-right:0;}
  .jit-hero-stat .num{font-family:'Fraunces',serif;font-size:24px;color:var(--paper);}
  .jit-hero-stat .lbl{font-size:11.5px;color:#AEBBB1;margin-top:3px;}
  .jit-construction-hero{min-height:360px;overflow:hidden;border:1px solid rgba(245,246,240,0.18);border-radius:7px;background:#10231C;box-shadow:0 24px 60px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.04);}
  .jit-construction-hero img{display:block;width:100%;height:100%;min-height:360px;object-fit:cover;object-position:center;}
  @media(max-width:940px){.jit-construction-hero,.jit-construction-hero img{min-height:300px;}}

  .jit-section{padding:64px 0;}
  @media(max-width:640px){.jit-section{padding:44px 0;}}
  .jit-section-head{max-width:620px;margin-bottom:38px;}
  .jit-section-head .kicker{font-size:13px;color:var(--gold-deep);font-weight:600;margin-bottom:10px;}
  .jit-section-head h2{font-size:clamp(1.5rem,2.6vw,2.1rem);}
  .jit-section-head p{margin-top:12px;color:var(--muted);font-size:14.5px;max-width:56ch;}

  .jit-about{background:var(--paper-2);}
  .jit-about-grid{display:grid;grid-template-columns:.85fr 1.15fr;gap:48px;align-items:center;}
  @media(max-width:900px){.jit-about-grid{grid-template-columns:1fr;gap:28px;}}
  .jit-about-badge{border:1px solid var(--line);background:var(--paper);padding:22px;display:flex;flex-direction:column;gap:14px;box-shadow:0 20px 40px rgba(16,35,28,0.06);}
  .jit-about-badge .row{display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:1px solid var(--line);}
  .jit-about-badge .row:last-child{border-bottom:none;padding-bottom:0;}
  .jit-about-badge .k{font-size:12.5px;color:var(--muted);}
  .jit-about-badge .v{font-family:'Fraunces',serif;font-size:14px;color:var(--pine);}
  .jit-about-copy p{font-size:14.5px;margin-bottom:14px;}

  .jit-projects-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line);}
  @media(max-width:900px){.jit-projects-grid{grid-template-columns:1fr;}}
  .jit-proj-card{background:var(--paper);padding:24px 24px 26px;display:flex;flex-direction:column;gap:10px;transition:transform .2s ease, box-shadow .2s ease;position:relative;z-index:1;}
  .jit-proj-card:hover{transform:translateY(-4px);box-shadow:0 18px 36px rgba(16,35,28,0.14);}
  .jit-proj-card .accent{width:32px;height:3px;}
  .jit-swatch{display:flex;gap:2px;margin-bottom:2px;}
  .jit-swatch i{display:block;width:9px;height:14px;border-radius:1px;}
  .jit-proj-card .status{font-size:11px;font-weight:600;color:var(--muted);}
  .jit-proj-card h3{font-size:18px;}
  .jit-proj-card .loc{font-size:13px;color:var(--muted);}
  .jit-proj-card .specs{display:flex;gap:16px;margin-top:6px;padding-top:12px;border-top:1px solid var(--line);font-size:12.5px;}
  .jit-proj-card .specs span{display:block;color:var(--muted);font-size:11px;margin-bottom:2px;}
  .jit-proj-card .specs b{font-family:'Fraunces',serif;font-weight:500;color:var(--pine);font-size:14px;}
  .jit-proj-card a.plink{font-size:13px;font-weight:600;color:var(--pine);margin-top:4px;}

  .jit-process{background:var(--pine);color:var(--paper);}
  .jit-process .jit-section-head h2{color:var(--paper);}
  .jit-process .jit-section-head p{color:#AEBBB1;}
  .jit-process .kicker{color:var(--gold);}
  .jit-steps{display:grid;grid-template-columns:repeat(5,1fr);}
  @media(max-width:940px){.jit-steps{grid-template-columns:1fr 1fr;gap:26px 20px;}}
  @media(max-width:560px){.jit-steps{grid-template-columns:1fr;}}
  .jit-step{padding-right:20px;border-right:1px solid var(--line-dark);}
  .jit-steps>.jit-step:last-child{border-right:none;}
  @media(max-width:940px){.jit-step{border-right:none;padding-right:0;}}
  .jit-step .idx{font-family:'Fraunces',serif;font-size:28px;color:var(--gold);}
  .jit-step h4{color:var(--paper);font-size:15.5px;margin-top:12px;}
  .jit-step p{color:#AEBBB1;font-size:13px;margin-top:6px;}

  .jit-why-grid{display:grid;grid-template-columns:.7fr 1.3fr;gap:48px;}
  @media(max-width:900px){.jit-why-grid{grid-template-columns:1fr;gap:24px;}}
  .jit-why-list{border-top:1px solid var(--line);}
  .jit-why-row{display:grid;grid-template-columns:44px 1fr;gap:18px;padding:22px 0;border-bottom:1px solid var(--line);}
  .jit-why-row .ico{width:38px;height:38px;border:1px solid var(--pine);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--pine);}
  .jit-why-row h4{font-size:15.5px;}
  .jit-why-row p{font-size:13.5px;color:var(--muted);margin-top:5px;max-width:60ch;}

  .jit-partner{background:var(--clay);color:var(--paper);}
  .jit-partner-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:32px;align-items:center;}
  @media(max-width:900px){.jit-partner-grid{grid-template-columns:1fr;}}
  .jit-partner h2{color:var(--paper);font-size:clamp(1.4rem,2.5vw,1.9rem);max-width:16ch;}
  .jit-partner p{color:#F1E6D8;margin-top:14px;font-size:14.5px;max-width:52ch;}
  .jit-partner-role{display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(245,246,240,.25);font-size:13.5px;}
  .jit-partner-role:first-child{border-top:1px solid rgba(245,246,240,.25);}
  .jit-partner-role b{font-family:'Fraunces',serif;font-weight:500;}

  .jit-wave{display:block;width:100%;height:56px;margin-top:-1px;}

  .jit-amenities{background:var(--paper);}
  .jit-amen-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px 32px;}
  @media(max-width:800px){.jit-amen-grid{grid-template-columns:repeat(2,1fr);}}
  @media(max-width:520px){.jit-amen-grid{grid-template-columns:1fr;}}
  .jit-amen{display:flex;gap:16px;align-items:flex-start;}
  .jit-amen-badge{
    width:58px;height:58px;flex:none;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    background:radial-gradient(circle at 30% 30%, rgba(217,164,4,0.18), rgba(22,48,43,0.06));
    border:1px solid var(--line);color:var(--pine);
  }
  .jit-amen h4{font-size:15px;}
  .jit-amen p{font-size:13px;color:var(--muted);margin-top:4px;}

  .jit-testi-quote{margin-bottom:10px;}
  .jit-testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;}
  @media(max-width:900px){.jit-testi-grid{grid-template-columns:1fr;}}
  .jit-testi{border-top:2px solid var(--gold);padding-top:16px;}
  .jit-testi .quote{font-family:'Fraunces',serif;font-style:italic;font-size:15.5px;color:var(--pine);}
  .jit-testi .who{margin-top:14px;font-size:12.5px;color:var(--muted);}

  .jit-contact{background:var(--paper-2);}
  .jit-contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;}
  @media(max-width:900px){.jit-contact-grid{grid-template-columns:1fr;gap:28px;}}
  .jit-info-row{display:flex;gap:16px;padding:18px 0;border-bottom:1px solid var(--line);}
  .jit-info-row:first-child{border-top:1px solid var(--line);}
  .jit-info-row .ico{color:var(--pine);flex:none;margin-top:2px;}
  .jit-info-row .k{font-size:12px;color:var(--muted);margin-bottom:2px;}
  .jit-info-row .v{font-size:14px;font-weight:500;}
  .jit-form{background:var(--paper);border:1px solid var(--line);padding:26px;box-shadow:0 20px 40px rgba(16,35,28,0.06);}
  .jit-map-frame{margin-top:22px;border:1px solid var(--line);border-radius:3px;overflow:hidden;filter:grayscale(0.15) contrast(1.02);}
  .jit-map-frame iframe{display:block;width:100%;height:220px;border:0;}
  .jit-form h3{font-size:17px;margin-bottom:4px;}
  .jit-form .hint{font-size:13px;color:var(--muted);margin-bottom:18px;}
  .jit-field{margin-bottom:14px;}
  .jit-field label{display:block;font-size:12px;color:var(--muted);margin-bottom:5px;}
  .jit-field input,.jit-field select{width:100%;padding:10px 11px;border:1px solid var(--line);background:var(--paper);font-size:14px;color:var(--ink);border-radius:2px;font-family:'Inter',sans-serif;}
  .jit-form .jit-btn{width:100%;justify-content:center;margin-top:4px;}
  .jit-form-note{font-size:11.5px;color:var(--muted);margin-top:10px;text-align:center;}

  footer.jit-footer{background:var(--ink);color:#C9D2CB;}
  .jit-foot-grid{display:grid;grid-template-columns:1.4fr repeat(3,1fr);gap:32px;padding-top:48px;padding-bottom:32px;}
  @media(max-width:800px){.jit-foot-grid{grid-template-columns:1fr 1fr;}}
  @media(max-width:520px){.jit-foot-grid{grid-template-columns:1fr;}}
   .jit-footer h5{color:var(--paper);font-size:12.5px;margin-bottom:14px;font-weight:600;}
   .jit-footer-brand{display:flex;align-items:flex-start;gap:12px;}
   .jit-footer-logo{width:62px;height:62px;object-fit:contain;flex:none;}
   .jit-footer .fname{font-family:'Fraunces',serif;color:var(--paper);font-size:17px;margin-bottom:8px;}
  .jit-footer p.desc{font-size:13px;color:#9AA69E;max-width:34ch;}
  .jit-footer ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:9px;}
  .jit-footer ul a{font-size:13px;color:#C9D2CB;}
  .jit-foot-bottom{border-top:1px solid rgba(245,246,240,.1);padding:18px 32px;font-size:12px;color:#7E8B83;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;max-width:1180px;margin:0 auto;}
  .jit-i{width:18px;height:18px;stroke:currentColor;fill:none;strokeWidth:1.6;}
  .jit-root [id]{scroll-margin-top:130px;}
  @media(max-width:900px){.jit-root [id]{scroll-margin-top:60px;}}
`;

function scrollToId(e, id){
  e?.preventDefault();
  const targetId = id.replace('#','');
  const el = document.getElementById(targetId);
  if(window.location.hash !== `#${targetId}`){
    window.history.pushState(null, "", `#${targetId}`);
  }
  if(el && el.scrollIntoView){
    el.scrollIntoView({behavior:'smooth', block:'start'});
  }
}

function scrollToCurrentHash(){
  const targetId = window.location.hash.replace('#','');
  if(!targetId) return;
  const el = document.getElementById(targetId);
  if(el && el.scrollIntoView) el.scrollIntoView({behavior:'smooth', block:'start'});
}

window.addEventListener('hashchange', scrollToCurrentHash);
window.addEventListener('popstate', scrollToCurrentHash);
requestAnimationFrame(scrollToCurrentHash);

const SUBPAGE_STYLE = `
  :root{--ink:#10231C;--pine:#16302B;--paper:#F5F6F0;--paper-2:#ECEEE4;--gold:#D9A404;--gold-deep:#A97800;--line:#DAD6C8;--muted:#5B6B62;}
  *{box-sizing:border-box;} body{margin:0;font-family:'Inter',sans-serif;color:var(--ink);background:var(--paper);line-height:1.6;}
  h1,h2,h3{font-family:'Fraunces',serif;color:var(--pine);margin:0;font-weight:500;}
  a{color:inherit;text-decoration:none;}
  .wrap{max-width:900px;margin:0 auto;padding:0 28px;}
  header.top{background:var(--paper);border-bottom:1px solid var(--line);}
  .toprow{display:flex;align-items:center;justify-content:space-between;padding:16px 0;}
  .brand{display:flex;align-items:center;gap:10px;font-family:'Fraunces',serif;font-size:17px;color:var(--pine);font-weight:600;}
  .back{font-size:13.5px;font-weight:600;color:var(--pine);border:1px solid var(--line);padding:8px 14px;border-radius:3px;}
  .hero{background:var(--pine);color:var(--paper);padding:56px 0 44px;}
  .kicker{font-size:12.5px;color:var(--gold);font-weight:600;letter-spacing:.02em;margin-bottom:10px;}
  .hero h1{color:var(--paper);font-size:clamp(1.7rem,3.4vw,2.4rem);max-width:22ch;}
  .hero p{color:#D7DED8;margin-top:14px;font-size:15.5px;max-width:60ch;}
  main{padding:48px 0 64px;}
  .section-note{background:var(--paper-2);border-left:3px solid var(--gold);padding:16px 20px;font-size:13.5px;color:var(--muted);margin-bottom:32px;}
  .internal-note{background:#FFF6E0;border:1px solid #E8CE7A;padding:18px 20px;font-size:13.5px;color:#5B4A12;margin-bottom:28px;}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:8px;}
  @media(max-width:640px){.grid{grid-template-columns:1fr;}}
  .card{border:1px solid var(--line);padding:20px;background:var(--paper);}
  .card h3{font-size:15.5px;margin-bottom:8px;} .card p{font-size:13.5px;color:var(--muted);margin:0;}
  .cta{margin-top:40px;padding:28px;background:var(--paper-2);border:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;}
  .cta p{margin:0;font-size:14.5px;} .btnx{display:inline-flex;padding:11px 22px;background:var(--gold);color:var(--ink);font-weight:600;font-size:13.5px;border-radius:3px;}
  footer{border-top:1px solid var(--line);padding:22px 0;font-size:12px;color:var(--muted);}
`;

const SUBPAGES = {
  "follow-up": {kicker:"ENQUIRY & FOLLOW-UP", title:"We follow up on every enquiry — on record",
    intro:"Once you enquire about a plot, your query goes into a tracked follow-up queue, not a notebook that gets lost.",
    cards:[["Logged the same day","Every walk-in, call, or website enquiry is logged against a plot and a coordinator on the same day."],
      ["A fixed follow-up owner","One coordinator owns your enquiry end-to-end, so you're not repeating your story each time."],
      ["Scheduled site visits","Follow-ups include a proposed site visit slot, not just a check-in call."],
      ["Status you can ask for","Call or email us anytime and we can tell you exactly where your enquiry stands."]]},
  "crm": {kicker:"CUSTOMER RELATIONSHIP MANAGEMENT", title:"One record, from first call to possession",
    intro:"Your booking, payments, cheque clearance, registry and possession status all live under one buyer record internally.",
    cards:[["Single buyer file","Booking, payment history and documents are tied to your name and plot number."],
      ["No repeated paperwork","Because your details are on file, follow-up documentation doesn't start from zero."],
      ["Partner mapping","If you were referred by an partner or promoter, that's recorded too."],
      ["Access to your status","Ask your coordinator or call our office for a summary of your file anytime."]]},
  "calls": {kicker:"CALL TRACKING", title:"A dedicated desk for buyer & enquiry calls",
    intro:"Calls related to bookings, payments, and site queries are logged and routed to the right person.",
    cards:[["Direct line","+91 93360 81002 — reach our office directly."],
      ["Logged calls","Every inbound call about an existing booking is noted against that buyer's file."],
      ["Escalation path","Unresolved queries are escalated to a senior coordinator."],
      ["Office hours","Monday–Saturday. Outside these hours, leave your number via the contact form."]]},
  "buyers": {kicker:"FOR OUR BUYERS", title:"What to expect as a Jigyasa Group Of Companies buyer",
    intro:"A short, honest look at what the buying process involves, from the first site visit to holding your registry papers.",
    cards:[["Before you book","Visit the site, verify plot boundaries on ground, and get the layout plan explained."],
      ["Documents you'll need","ID proof, address proof and PAN are typically required; your coordinator confirms the exact list."],
      ["Payment options","Lump sum or EMI plans; PLC and any interest are disclosed at booking, not after."],
      ["After possession","You receive registry documents and a possession handover, on file for your reference."]]},
  "registration": {kicker:"PLOT REGISTRATION", title:"How plot registration works",
    intro:"Registration is initiated once your payment plan for a plot is complete, and is tracked plot-by-plot.",
    note:"Exact registration timelines and charges vary by site and are confirmed at booking — this is a general overview.",
    cards:[["Trigger point","Registration is taken up once your agreed payment schedule for the plot is complete."],
      ["Stamp duty & charges","Applicable charges are disclosed before the registry date, not added as a surprise."],
      ["Your presence","You (or an authorised representative with a power of attorney) attend the registry office."],
      ["What you get","Registered sale deed copies and an update to your buyer file marking registry complete."]]},
  "project-status": {kicker:"PROJECT & SITE STATUS", title:"Where each site currently stands",
    intro:"Here's the kind of status update we track per site internally, and can share with you on request.",
    cards:[["Layout & approval stage","Whether the site's layout plan is approved and by which authority."],
      ["Infrastructure status","Roads, drainage, boundary wall and lighting — completed vs. planned."],
      ["Booking status","How many plots are booked, reserved, or still available in a given block."],
      ["Possession readiness","Whether a block is possession-ready or pending infrastructure completion."]]},
  "admin": {kicker:"ADMINISTRATION", title:"Administration & internal oversight",
    intro:"This area covers internal administrative controls for our team.",
    internal:true,
    note:"This is an internal, staff-only area used for day-to-day site and account administration. If you're a customer or partner, please use Contact Us below and our team will help directly.",
    cards:[["Internal access only","Site creation, plot record management and internal approvals are handled here by authorised staff."],
      ["Not a customer portal","There's no customer login here — buyer and partner status is shared directly by your coordinator."]]},
  "report": {kicker:"REPORTS & TRANSPARENCY", title:"The kind of reporting we keep on every site",
    intro:"Internally, we track detailed reports on sales, payments, registry and possession for every site.",
    cards:[["Sales & business reports","Project-wise sales summaries and business totals, tracked per site."],
      ["Registry & possession reports","Which plots have registry done, which are pending, and possession-due lists."],
      ["Payment & pendency reports","Cheque clearance status, due instalments, and partner-wise pendency."],
      ["Ask for your extract","You can request a summary relevant to your own plot anytime."]]},
  "promoter": {kicker:"PROMOTER NETWORK", title:"Our promoter & partner network",
    intro:"Promoters and partners represent specific sites on our behalf, and are mapped in our system.",
    cards:[["Site-mapped promoters","Each promoter is assigned to specific sites, not our whole portfolio."],
      ["Verifiable identity","If someone claims to represent us, call our office to confirm before proceeding."],
      ["Payout tracking","Promoter commissions are tracked against actual closed bookings."],
      ["Want to become one?","See Partner With Us on our homepage, or contact us directly."]]},
  "daybook": {kicker:"DAILY TRANSACTION LOG", title:"Payments are logged the day they're received",
    intro:"Every payment — cash, cheque, or online — is entered into our daybook the day it comes in.",
    cards:[["Same-day entry","Payments are recorded the day they're received, not batched later."],
      ["Cheque status tracking","Cheques are tracked through clearance; a bounced cheque is flagged immediately."],
      ["Plot-linked, not generic","Every entry is tied to a specific plot and buyer account."]]},
  "investor": {kicker:"FOR INVESTORS", title:"Investing in land through Jigyasa Group Of Companies",
    intro:"For those looking at land as a longer-term investment, here's what our process offers.",
    note:"This is general information, not financial advice. Please make your own assessment or consult an advisor before investing.",
    cards:[["Documented ownership","Your plot is registered in your name, with a file tracking payment and registry history."],
      ["Site selection support","We can walk you through layouts, road access and development stage before you decide."],
      ["Transparent charges","PLC, interest (if any) and registry costs are disclosed upfront."],
      ["Long-term relationship","Ask us about our partner/investor terms for holding multiple plots over time."]]},
  "registry": {kicker:"REGISTRY PROCESS", title:"Getting your registry done, step by step",
    intro:"Registry is the legal transfer of the plot into your name — tracked as its own stage in your file.",
    cards:[["When it happens","Once your payment plan is complete, your file moves into the registry queue."],
      ["Documents needed","Valid ID, address proof and PAN; your coordinator confirms specifics."],
      ["At the registry office","You, or your authorised representative, attend on the scheduled date."],
      ["After registry","You receive certified copies of your registered sale deed."]]},
  "possession": {kicker:"POSSESSION PROCESS", title:"What happens at possession",
    intro:"Possession is physically handing your plot over to you, with documentation — the final step after registry.",
    cards:[["Possession-ready blocks","A block is marked possession-ready once its infrastructure is complete."],
      ["Joint site walk","We walk the plot boundaries with you, matching them against the approved layout map."],
      ["Handover documentation","You receive a possession letter alongside your registry papers."],
      ["Building on your plot","Once possession is complete, you're free to begin construction as per local norms."]]},
  "hr": {kicker:"CAREERS", title:"Work with Jigyasa Group Of Companies",
    intro:"We're a growing team across sales, site operations, and back-office roles in Lucknow.",
    cards:[["Sales & CRM roles","For people who enjoy meeting buyers and following through on commitments."],
      ["Site operations","On-ground coordination — site visits, boundary verification, vendor coordination."],
      ["Back office & accounts","Payment tracking, daybook maintenance, documentation support."],
      ["How to apply","Send your resume via Contact Us below and mention the role you're interested in."]]},
  "attendance": {kicker:"STAFF ATTENDANCE", title:"Staff attendance & scheduling",
    intro:"This area tracks day-to-day attendance for our internal team.",
    internal:true,
    note:"This is an internal, staff-only module for tracking employee attendance. It isn't something customers or partners need to access.",
    cards:[["Internal use only","Monthly and yearly attendance records for staff are maintained here by HR."],
      ["Not customer-facing","There's nothing here relevant to buyers, investors, or partners."]]},
  "logout": {kicker:"ACCOUNT", title:"You're not logged in",
    intro:"This is our public website — there's no login required to browse it, book a site visit, or get in touch.",
    internal:true,
    note:"If you were expecting a staff or partner login area, that lives on a separate internal system, not on this public site.",
    cards:[["Browsing is open to everyone","Projects, pricing, process and contact details are all public on this site."],
      ["Staff & partner logins","Handled through a separate internal system, not through this website."]]},
};

function buildSubpageHtml(slug){
  const d = SUBPAGES[slug];
  if(!d) return null;
  const noteHtml = d.note ? `<div class="${d.internal?'internal-note':'section-note'}">${d.note}</div>` : "";
  const cardsHtml = d.cards.map(([t,p]) => `<div class="card"><h3>${t}</h3><p>${p}</p></div>`).join("");
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${d.title} — Jigyasa Group Of Companies</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;0,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>${SUBPAGE_STYLE}</style></head>
<body>
<header class="top"><div class="wrap toprow">
  <div class="brand">Jigyasa Group Of Companies</div>
  <a class="back" href="#" onclick="window.close();return false;">&larr; Close tab</a>
</div></header>
<section class="hero"><div class="wrap">
  <div class="kicker">${d.kicker}</div><h1>${d.title}</h1><p>${d.intro}</p>
</div></section>
<main class="wrap">
  ${noteHtml}
  <div class="grid">${cardsHtml}</div>
  <div class="cta"><p>Have a question about this? Our team can walk you through it directly.</p>
    <a class="btnx" href="tel:+919336081002">Call +91 93360 81002</a>
  </div>
</main>
<footer class="wrap">© 2026 Jigyasa Group Of Companies — Sector 14/105, Vrindavan Yojan, Telibagh, Lucknow.</footer>
</body></html>`;
}

function openSubpage(slug){
  const html = buildSubpageHtml(slug);
  if(!html) return;
  try{
    const blob = new Blob([html], {type: "text/html"});
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if(!win){
      alert("Your browser blocked the new tab. Please allow pop-ups for this site and try again.");
    }
  }catch(err){
    alert("Could not open this page in a new tab in this preview. It will work once you open the downloaded HTML file directly in your browser.");
  }
}

const IconMail = () => (<svg className="jit-i" viewBox="0 0 24 24" strokeWidth="1.6"><path d="M3 6h18v12H3z"/><path d="M3 7l9 6 9-6"/></svg>);
const IconPhone = () => (<svg className="jit-i" viewBox="0 0 24 24" strokeWidth="1.6"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>);
const IconPin = () => (<svg className="jit-i" viewBox="0 0 24 24" strokeWidth="1.6"><path d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.4"/></svg>);
const IconShield = () => (<svg className="jit-i" viewBox="0 0 24 24" strokeWidth="1.6"><path d="M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>);
const IconDoc = () => (<svg className="jit-i" viewBox="0 0 24 24" strokeWidth="1.6"><path d="M6 2h9l3 3v17H6z"/><path d="M14 2v4h4"/><path d="M9 12h6M9 16h6M9 9h3"/></svg>);
const IconCoins = () => (<svg className="jit-i" viewBox="0 0 24 24" strokeWidth="1.6"><ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v6c0 1.7 2.7 3 6 3s6-1.3 6-3V7"/><path d="M3 13v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4"/><ellipse cx="17" cy="12" rx="4.5" ry="2.2"/></svg>);
const IconUsers = () => (<svg className="jit-i" viewBox="0 0 24 24" strokeWidth="1.6"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14a5 5 0 0 1 5 5"/></svg>);
const IconHeadset = () => (<svg className="jit-i" viewBox="0 0 24 24" strokeWidth="1.6"><path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="13" width="4" height="6" rx="1"/><rect x="17" y="13" width="4" height="6" rx="1"/><path d="M20 19v1a3 3 0 0 1-3 3h-3"/></svg>);
const IconMenu = () => (<svg className="jit-i" viewBox="0 0 24 24" strokeWidth="1.6"><path d="M4 7h16M4 12h16M4 17h16"/></svg>);
const IconClose = () => (<svg className="jit-i" viewBox="0 0 24 24" strokeWidth="1.6"><path d="M6 6l12 12M18 6L6 18"/></svg>);
const IconTree = () => (<svg viewBox="0 0 24 24" strokeWidth="1.6" fill="none" width="26" height="26"><path d="M12 3l4.5 6h-2.7l3.7 5.2h-3l3 4.3H8l3-4.3h-3l3.7-5.2H8.5z"/><path d="M12 18.5V21"/></svg>);
const IconRoad = () => (<svg viewBox="0 0 24 24" strokeWidth="1.6" fill="none" width="26" height="26"><path d="M8 21L10 3h4l2 18"/><path d="M12 5v3M12 11v3M12 17v2"/></svg>);
const IconWall = () => (<svg viewBox="0 0 24 24" strokeWidth="1.6" fill="none" width="26" height="26"><rect x="3" y="10" width="7" height="5"/><rect x="10" y="10" width="7" height="5"/><rect x="6.5" y="5" width="7" height="5"/><path d="M17 15v-9l4 2v9"/></svg>);
const IconDrop = () => (<svg viewBox="0 0 24 24" strokeWidth="1.6" fill="none" width="26" height="26"><path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z"/></svg>);
const IconLamp = () => (<svg viewBox="0 0 24 24" strokeWidth="1.6" fill="none" width="26" height="26"><path d="M12 3v3"/><path d="M8 6h8l-1.5 5h-5z"/><path d="M12 11v10"/><path d="M8 21h8"/></svg>);
const IconGate = () => (<svg viewBox="0 0 24 24" strokeWidth="1.6" fill="none" width="26" height="26"><path d="M4 20V6l8-3 8 3v14"/><path d="M4 20h16"/><path d="M9 20v-6h6v6"/></svg>);
const IconQuote = () => (<svg viewBox="0 0 32 24" width="34" height="26" fill="none"><path d="M9 2C4.6 4.4 2 8.2 2 12.6 2 16.5 4.6 19 8 19c2.8 0 5-2.1 5-4.9 0-2.6-1.9-4.5-4.4-4.5-.4 0-.8.1-1.1.2C8 7 10.2 4.6 13 3.1L9 2z" fill="#D9A404" opacity="0.9"/><path d="M24 2c-4.4 2.4-7 6.2-7 10.6 0 3.9 2.6 6.4 6 6.4 2.8 0 5-2.1 5-4.9 0-2.6-1.9-4.5-4.4-4.5-.4 0-.8.1-1.1.2-.5-2.8 1.7-5.2 4.5-6.7L24 2z" fill="#D9A404" opacity="0.9"/></svg>);

function ConstructionHeroImage(){
  return <div className="jit-construction-hero jit-rise" style={{animationDelay:'.15s'}}><img src="./assets/hero-construction-building.png" alt="Modern residential building under construction with scaffolding and a tower crane"/></div>;
}

function WaveDivider({from, to}){
  return (
    <svg className="jit-wave" viewBox="0 0 1200 56" preserveAspectRatio="none">
      <path d="M0,28 C150,56 300,0 450,20 C600,40 750,4 900,24 C1050,44 1150,10 1200,26 L1200,56 L0,56 Z" fill={to}/>
      <rect width="1200" height="28" fill={from}/>
    </svg>
  );
}

function Amenities(){
  const items=[
    {icon:<IconRoad/>, t:"Wide, paved roads", d:"30–40 ft internal roads laid out before plots are sold, not after."},
    {icon:<IconTree/>, t:"Parks & green belts", d:"Dedicated green pockets in every site layout, not an afterthought."},
    {icon:<IconGate/>, t:"Boundary wall & gate", d:"Every site is fenced and gated as part of the base development."},
    {icon:<IconDrop/>, t:"Underground drainage", d:"Piped drainage laid before roads, avoiding waterlogging later."},
    {icon:<IconLamp/>, t:"Street lighting", d:"Lit internal roads across every developed block."},
    {icon:<IconWall/>, t:"Individual plot demarcation", d:"Each plot is pillar-marked on ground, matching the approved map."},
  ];
  return (
    <section className="jit-section jit-amenities">
      <div className="jit-wrap">
        <div className="jit-section-head">
          <div className="kicker">MASTER PLAN</div>
          <h2>What's built before a plot is ever sold</h2>
          <p>These aren't add-ons promised for later — they're part of the layout every site is approved with.</p>
        </div>
        <div className="jit-amen-grid">
          {items.map((it,i)=>(
            <div className="jit-amen" key={i}>
              <div className="jit-amen-badge">{it.icon}</div>
              <div><h4>{it.t}</h4><p>{it.d}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Nav(){
  const [open,setOpen]=useState(false);
  const links=[["#projects","Projects"],["#process","How It Works"],["#why","Why Us"],["#partner","Partner With Us"],["#contact","Contact"]];
  return (
    <>
    <nav className="jit-nav">
      <div className="jit-wrap jit-navrow">
        <a href="#top" className="jit-brand" onClick={(e)=>scrollToId(e,'#top')}>
          <img className="jit-brand-logo" src="/assets/jigyasa-logo-mark.png" alt="Jigyasa Group logo"/>
          <span className="jit-brand-text">
            <span className="name">Jigyasa Group Of Companies</span><br/>
            <span className="tag">Jigyasa Infra Pvt Ltd</span>
          </span>
        </a>
        <div className="jit-navlinks">{links.map(([href,label])=><a key={href} href={href} onClick={(e)=>scrollToId(e,href)}>{label}</a>)}</div>
        <div className="jit-navcta">
          <a className="jit-navphone" href="tel:+919336081002"><IconPhone/><span>+91 93360 81002</span></a>
          <a className="jit-btn jit-btn-gold" href="#contact" onClick={(e)=>scrollToId(e,'#contact')}>Book a Site Visit</a>
          <a className="jit-btn jit-btn-outline" href="/software">Login</a>
          <button className="jit-menu-toggle" aria-label="Toggle menu" onClick={()=>setOpen(!open)}>{open?<IconClose/>:<IconMenu/>}</button>
        </div>
      </div>
      <div className={`jit-mobile-menu jit-wrap ${open?'open':''}`}>
        <a href="#contact" onClick={(e)=>{setOpen(false);scrollToId(e,'#contact');}}>Book a Site Visit</a>
        {links.map(([href,label])=><a key={href} href={href} onClick={(e)=>{setOpen(false);scrollToId(e,href);}}>{label}</a>)}
        <a href="/software">Login</a>
      </div>
    </nav>
    </>
  );
}

function Hero(){
  return (
    <header className="jit-hero" id="top">
      <div className="jit-wrap jit-hero-grid">
        <div>
          <div className="jit-hero-kicker jit-rise">A LUCKNOW-BASED REAL ESTATE DEVELOPER</div>
          <h1 className="jit-rise" style={{animationDelay:'.05s'}}>Land, planned <em>properly.</em></h1>
          <p className="jit-hero-sub jit-rise" style={{animationDelay:'.1s'}}>
            Jigyasa Group Of Companies develops fully-documented residential plots across Lucknow —
            every site surveyed, every payment tracked, every registry followed through to possession.
          </p>
          <div className="jit-hero-actions jit-rise" style={{animationDelay:'.18s'}}>
            <a className="jit-btn jit-btn-gold" href="#contact" onClick={(e)=>scrollToId(e,'#contact')}>Book a Site Visit</a>
            <a className="jit-btn jit-btn-ghost-light" href="#projects" onClick={(e)=>scrollToId(e,'#projects')}>View Current Sites</a>
          </div>
          <div className="jit-hero-stats jit-rise" style={{animationDelay:'.25s'}}>
            <div className="jit-hero-stat"><div className="num">9+</div><div className="lbl">Sites developed</div></div>
            <div className="jit-hero-stat"><div className="num">500+</div><div className="lbl">Families settled</div></div>
            <div className="jit-hero-stat"><div className="num">2015</div><div className="lbl">ISO 9001 certified</div></div>
          </div>
        </div>
        <ConstructionHeroImage/>
      </div>
      <WaveDivider from="#16302B" to="#ECEEE4"/>
    </header>
  );
}

function About(){
  return (
    <section className="jit-section jit-about">
      <div className="jit-wrap jit-about-grid">
        <div className="jit-about-badge jit-rise">
          <div className="row"><span className="k">Entity</span><span className="v">Jigyasa Group Of Companies</span></div>
          <div className="row"><span className="k">Certification</span><span className="v">ISO 9001:2015</span></div>
          <div className="row"><span className="k">Head Office</span><span className="v">Telibagh, Lucknow</span></div>
          <div className="row"><span className="k">Focus</span><span className="v">Residential Plot Development</span></div>
        </div>
        <div className="jit-about-copy">
          <div className="jit-section-head" style={{marginBottom:'18px'}}>
            <div className="kicker">ABOUT US</div>
            <h2>A developer, not just a seller of land</h2>
          </div>
          <p>We plan sites the way a township should be planned first: surveyed layouts, marked plot boundaries,
          and infrastructure that's committed to on paper before a single plot is sold.</p>
          <p>Every buyer's file is tracked from booking to possession — payments, cheque clearance, PLC charges
          and registry status are all logged against the plot, not lost in a filing cabinet.</p>
        </div>
      </div>
    </section>
  );
}

function Swatch({pattern, color}){
  const cols=5, w=100, h=46, gap=3;
  const cw=(w-gap*(cols-1))/cols;
  const rowsPattern=[pattern.slice(0,5), pattern.slice(5,10)];
  return (
    <svg width="100" height="52" viewBox={`0 0 ${w} ${h+6}`} style={{marginBottom:'2px'}}>
      <rect x="0" y="0" width={w} height={h} rx="3" fill="var(--paper-2)"/>
      {rowsPattern.map((row,ri)=>row.map((filled,ci)=>(
        <rect key={`${ri}-${ci}`}
          x={ci*(cw+gap)+2} y={ri*20+3} width={cw} height="16" rx="1"
          fill={filled ? color : "var(--paper)"} stroke="var(--line)" strokeWidth="0.6"/>
      )))}
      <line x1={0} y1={h/2+1} x2={w} y2={h/2+1} stroke="var(--paper)" strokeWidth="2"/>
    </svg>
  );
}

function Projects(){
  const data=[
    {name:"Vrindavan Yojna", loc:"Telibagh, Lucknow", status:"Booking Open", color:"var(--gold)", swatchColor:"#D9A404", pattern:[1,1,0,1,0,1,1,0,1,0], size:"1000–2400 sq ft", price:"₹11.5L onwards", plots:"180 plots"},
    {name:"Krishna Vihar Extension", loc:"Sultanpur Road, Lucknow", status:"Registry in Progress", color:"var(--pine)", swatchColor:"#16302B", pattern:[1,0,1,1,0,0,1,1,0,1], size:"1200–3000 sq ft", price:"₹14L onwards", plots:"110 plots"},
    {name:"Ganga Residency", loc:"Amausi, Lucknow", status:"Possession Ready", color:"var(--clay)", swatchColor:"#8B5E34", pattern:[1,1,1,0,1,0,1,0,1,1], size:"1500 sq ft (fixed)", price:"₹18L onwards", plots:"64 plots"},
  ];
  return (
    <section className="jit-section" id="projects">
      <div className="jit-wrap">
        <div className="jit-section-head">
          <div className="kicker">CURRENT SITES</div>
          <h2>Where we're developing right now</h2>
          <p>Every site below is under an active layout plan. Site visits are free — bring your questions.</p>
        </div>
        <div className="jit-projects-grid">
          {data.map((p,i)=>(
            <div className="jit-proj-card" key={i}>
              <Swatch pattern={p.pattern} color={p.swatchColor}/>
              <div className="status">{p.status.toUpperCase()}</div>
              <h3>{p.name}</h3>
              <div className="loc">{p.loc}</div>
              <div className="specs"><div><span>Plot size</span><b>{p.size}</b></div><div><span>Starting</span><b>{p.price}</b></div></div>
              <div className="specs" style={{borderTop:'none',paddingTop:0,marginTop:0}}><div><span>Inventory</span><b>{p.plots}</b></div></div>
              <a className="plink" href="#contact" onClick={(e)=>scrollToId(e,'#contact')}>Enquire about this site &#8594;</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process(){
  const steps=[
    {t:"Site Visit", d:"Walk the actual plot — see boundaries, road access and neighbouring development."},
    {t:"Booking", d:"Reserve your plot with a booking amount; your file opens under your name from day one."},
    {t:"Payment Plan", d:"Choose lump sum or EMI. PLC and any interest is disclosed upfront."},
    {t:"Registry", d:"Once your plan is fully paid, we initiate registry and keep you updated."},
    {t:"Possession", d:"Get physical possession of your plot with all documentation handed over."},
  ];
  return (
    <section className="jit-section jit-process" id="process">
      <div className="jit-wrap">
        <div className="jit-section-head">
          <div className="kicker">HOW IT WORKS</div>
          <h2>From site visit to possession, in five steps</h2>
          <p>The same sequence our team tracks internally for every buyer — nothing skipped, nothing informal.</p>
        </div>
        <div className="jit-steps">
          {steps.map((s,i)=>(
            <div className="jit-step" key={i}>
              <div className="idx">{String(i+1).padStart(2,'0')}</div>
              <h4>{s.t}</h4>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs(){
  const items=[
    {icon:<IconDoc/>, t:"A file for every plot", d:"Booking, payments, cheque clearance and registry status are logged against your plot."},
    {icon:<IconCoins/>, t:"Transparent EMI & charges", d:"Interest, PLC and deductions are disclosed at booking — not discovered later."},
    {icon:<IconShield/>, t:"ISO 9001:2015 certified process", d:"Site creation, plot allotment and payment workflows follow a documented, audited standard."},
    {icon:<IconHeadset/>, t:"A follow-up team, not a hotline", d:"A dedicated coordinator reaches out proactively — registry due, possession due, and beyond."},
    {icon:<IconUsers/>, t:"An partner & promoter network", d:"Verified brokers mapped to specific sites, so you always know who represents us."},
  ];
  return (
    <section className="jit-section" id="why">
      <div className="jit-wrap jit-why-grid">
        <div>
          <div className="jit-section-head" style={{marginBottom:0}}>
            <div className="kicker">WHY BUYERS CHOOSE US</div>
            <h2>Process, kept honest</h2>
            <p>Most complaints against plot developers come down to one thing: no record of what was promised.</p>
          </div>
        </div>
        <div className="jit-why-list">
          {items.map((it,i)=>(
            <div className="jit-why-row" key={i}>
              <div className="ico">{it.icon}</div>
              <div><h4>{it.t}</h4><p>{it.d}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Partner(){
  const roles=[["Partner / Broker","Bring buyers to our sites, earn on every closed booking."],["Promoter","Represent a site full-time with mapped territory."],["Franchise Partner","Run a Jigyasa Group Of Companies office in your city."]];
  return (
    <section className="jit-section jit-partner" id="partner">
      <div className="jit-wrap jit-partner-grid">
        <div>
          <div className="jit-hero-kicker" style={{color:'#F1E6D8'}}>PARTNER WITH US</div>
          <h2>Grow with a developer that pays on record</h2>
          <p>Every partner, promoter and franchise is mapped to specific sites — your payouts are tracked on file.</p>
          <a className="jit-btn jit-btn-gold" href="#contact" onClick={(e)=>scrollToId(e,'#contact')} style={{marginTop:'22px',display:'inline-flex'}}>Apply to Partner</a>
        </div>
        <div>
          {roles.map(([t,d],i)=>(
            <div className="jit-partner-role" key={i}><b>{t}</b><span style={{maxWidth:'22ch',textAlign:'right',color:'#F1E6D8'}}>{d}</span></div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials(){
  const quotes=[
    {q:"I could see my payment and registry status update every time I paid.", who:"Buyer, Vrindavan Yojna"},
    {q:"The site visit matched exactly what was on paper.", who:"Buyer, Krishna Vihar Extension"},
    {q:"Possession came through faster than I expected.", who:"Buyer, Ganga Residency"},
  ];
  return (
    <section className="jit-section">
      <div className="jit-wrap">
        <div className="jit-section-head"><div className="kicker">FROM OUR BUYERS</div><h2>What settling in looks like</h2></div>
        <div className="jit-testi-grid">
          {quotes.map((t,i)=>(
            <div className="jit-testi" key={i}>
              <div className="jit-testi-quote"><IconQuote/></div>
              <p className="quote">&ldquo;{t.q}&rdquo;</p>
              <div className="who"><b>{t.who}</b></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact(){
  const [submitted,setSubmitted]=useState(false);
  return (
    <section className="jit-section jit-contact" id="contact">
      <div className="jit-wrap jit-contact-grid">
        <div>
          <div className="jit-section-head" style={{marginBottom:'22px'}}>
            <div className="kicker">GET IN TOUCH</div>
            <h2>Plan a site visit this week</h2>
            <p>Open Monday to Saturday. Walk in, or leave your details for a call back.</p>
          </div>
          <div className="jit-info-row"><div className="ico"><IconPin/></div><div><div className="k">Office Address</div><div className="v">Sector 14/105, Vrindavan Yojan, Telibagh, Lucknow – 226029</div></div></div>
          <div className="jit-info-row"><div className="ico"><IconPhone/></div><div><div className="k">Call Us</div><div className="v">+91 93360 81002</div></div></div>
          <div className="jit-map-frame">
            <iframe
              title="Jigyasa Group Of Companies office location"
              src="https://maps.google.com/maps?q=Sector%2014%2F105%20Vrindavan%20Yojan%20Telibagh%20Lucknow%20226029&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
        <div className="jit-form">
          {submitted ? (
            <div><h3>Request received</h3><p className="hint">A coordinator will call you shortly.</p></div>
          ) : (
            <form onSubmit={(e)=>{e.preventDefault();setSubmitted(true);}}>
              <h3>Request a call back</h3>
              <p className="hint">Takes under a minute — no obligation.</p>
              <div className="jit-field"><label>Full name</label><input type="text" required placeholder="Your name"/></div>
              <div className="jit-field"><label>Phone number</label><input type="tel" required placeholder="10-digit mobile number"/></div>
              <div className="jit-field"><label>Which site are you interested in?</label>
                <select><option>Vrindavan Yojna</option><option>Krishna Vihar Extension</option><option>Ganga Residency</option><option>Not sure yet</option></select>
              </div>
              <button className="jit-btn jit-btn-gold" type="submit">Request Call Back</button>
              <div className="jit-form-note">By submitting, you agree to be contacted regarding this enquiry.</div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer(){
  return (
    <footer className="jit-footer">
      <div className="jit-wrap jit-foot-grid">
        <div className="jit-footer-brand"><img className="jit-footer-logo" src="/assets/jigyasa-logo-mark.png" alt="Jigyasa Group logo"/><div><div className="fname">Jigyasa Group Of Companies</div><p className="desc">ISO 9001:2015 certified plot development, from site layout to registry and possession, based in Lucknow.</p></div></div>
        <div><h5>Company</h5><ul>
          <li><a href="#projects" onClick={(e)=>scrollToId(e,'#projects')}>Current Sites</a></li>
          <li><a href="#process" onClick={(e)=>scrollToId(e,'#process')}>How It Works</a></li>
          <li><a href="#why" onClick={(e)=>scrollToId(e,'#why')}>Why Us</a></li>
        </ul></div>
        <div><h5>Work With Us</h5><ul>
          <li><a href="#partner" onClick={(e)=>scrollToId(e,'#partner')}>Become an Partner</a></li>
          <li><a href="#partner" onClick={(e)=>scrollToId(e,'#partner')}>Franchise Enquiry</a></li>
          <li><a href="#contact" onClick={(e)=>scrollToId(e,'#contact')}>Careers</a></li>
        </ul></div>
        <div><h5>Contact</h5><ul><li>Sector 14/105, Vrindavan Yojan,<br/>Telibagh, Lucknow – 226029</li><li>+91 93360 81002</li></ul></div>
      </div>
      <div className="jit-foot-bottom"><span>© {new Date().getFullYear()} Jigyasa Group Of Companies. All rights reserved.</span><span>Plots shown are illustrative.</span></div>
    </footer>
  );
}

export default function App(){
  return (
    <div className="jit-root">
      <style>{styles}</style>
      <Nav/>
      <Hero/>
      <About/>
      <Amenities/>
      <Projects/>
      <Process/>
      <WhyUs/>
      <Partner/>
      <Testimonials/>
      <Contact/>
      <Footer/>
    </div>
  );
}
