import{n as e,r as t,t as n}from"./index-B2t_yTe2.js";import{n as r}from"./user-D4qYjWtK.js";import{c as i,f as a}from"./store-BWhEhl29.js";function o(e,t){let n=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,`value`)?.set;n?n.call(e,t):e.value=t,e.dispatchEvent(new Event(`input`,{bubbles:!0}))}function s(e){let t=a[e],n=0,r=()=>{let e=document.querySelector(`input[type="password"]`),i=Array.from(document.querySelectorAll(`input`)).find(t=>t!==e&&t.type!==`password`&&!t.readOnly);if(!i||!e){++n<10&&window.setTimeout(r,120);return}o(i,t.username),o(e,t.password)};window.setTimeout(r,180)}async function c(){try{let n=await r();n?.data&&e(t).setProfile(n.data)}catch{}}function l(r){let i=e(t);r===`user`?(i.setUserSession({token:`demo-token-user`,userId:1,username:a.user.username}),n.push(`/`),c()):(i.setAdminSession({token:`demo-token-admin`,adminId:1,adminUsername:a.admin.username}),n.push(`/admin/dashboard`)),d()}var u=null;function d(){if(!u||u.classList.contains(`is-collapsed`))return;u.classList.add(`is-collapsed`);let e=u.querySelector(`[data-arrow]`);e&&(e.textContent=`展开`)}function f(){i(),e(t).logout(),n.push(`/`),window.setTimeout(()=>window.location.reload(),120)}var p=`
.zs-demo-bar{
  position:fixed;right:16px;bottom:16px;z-index:9999;
  font-family:var(--font-sans, system-ui, sans-serif);
  font-size:13px;line-height:1.5;
  background:rgba(255,255,255,.94);
  -webkit-backdrop-filter:blur(12px) saturate(1.5);
  backdrop-filter:blur(12px) saturate(1.5);
  border:1px solid var(--color-border-soft,#f2ddc6);
  border-radius:14px;
  box-shadow:0 10px 30px rgba(28,20,14,.18);
  width:236px;overflow:hidden;
  transition:width .18s ease;
}
.zs-demo-bar.is-collapsed{width:auto}
.zs-demo-head{
  display:flex;align-items:center;gap:8px;
  padding:10px 12px;cursor:pointer;user-select:none;
  background:linear-gradient(100deg, rgba(249,199,155,.34), rgba(239,169,201,.24));
  border-bottom:1px solid var(--color-border-soft,#f2ddc6);
}
.zs-demo-head b{font-size:12.5px;color:var(--brand-800,#7c2d12);letter-spacing:.01em}
.zs-demo-dot{width:7px;height:7px;border-radius:50%;background:var(--color-warning,#a16207);flex-shrink:0}
.zs-demo-bar.is-collapsed .zs-demo-head{border-bottom:0}
.zs-demo-bar.is-collapsed .zs-demo-body{display:none}
.zs-demo-body{padding:10px}
.zs-demo-note{
  font-size:11.5px;color:var(--color-text-sub,#6b5a4c);
  padding:0 2px 9px;border-bottom:1px dashed var(--color-border-soft,#f2ddc6);margin-bottom:9px;
}
.zs-demo-actions{display:flex;flex-direction:column;gap:6px}
.zs-demo-btn{
  display:block;width:100%;text-align:left;
  padding:8px 11px;border-radius:9px;cursor:pointer;
  font-size:12.5px;font-weight:600;font-family:inherit;
  background:#fff;color:var(--color-text,#1c1410);
  border:1px solid rgba(28,20,14,.14);
  transition:background .15s,border-color .15s,color .15s;
}
.zs-demo-btn:hover{background:var(--brand-50,#fff8f1);border-color:var(--brand-300,#fdba74);color:var(--brand-700,#9a3412)}
.zs-demo-btn.is-primary{background:rgba(28,25,23,.94);color:#fff;border-color:rgba(255,255,255,.28)}
.zs-demo-btn.is-primary:hover{background:#1c1917;color:#fff}
.zs-demo-btn.is-danger{color:var(--color-danger,#dc2626)}
.zs-demo-btn.is-danger:hover{background:#fef2f2;border-color:#fca5a5;color:#b91c1c}
.zs-demo-hint{font-size:10.5px;color:var(--color-text-muted,#9c8877);padding:8px 2px 0}
@media (max-width:620px){
  .zs-demo-bar{right:10px;bottom:10px;width:210px}
}
`;function m(){if(typeof document>`u`||!document.body)return;let e=document.createElement(`style`);e.textContent=p,document.head.appendChild(e);let t=document.createElement(`div`);t.className=`zs-demo-bar`,t.innerHTML=`
    <div class="zs-demo-head" data-toggle>
      <span class="zs-demo-dot"></span>
      <b>演示模式</b>
      <span style="margin-left:auto;font-size:11px;color:var(--color-text-sub,#6b5a4c)" data-arrow>收起</span>
    </div>
    <div class="zs-demo-body">
      <div class="zs-demo-note">
        数据由前端模拟生成，后端服务未部署，所有操作不会产生真实交易。
      </div>
      <div class="zs-demo-actions">
        <button class="zs-demo-btn is-primary" data-act="user">一键以「用户」进入</button>
        <button class="zs-demo-btn" data-act="admin">一键以「管理员」进入</button>
        <button class="zs-demo-btn" data-act="login-user">打开用户登录页（已预填）</button>
        <button class="zs-demo-btn is-danger" data-act="reset">重置演示数据</button>
      </div>
      <div class="zs-demo-hint">账号：user / 123456 ｜ admin / 123456</div>
    </div>
  `,document.body.appendChild(t),u=t,t.addEventListener(`click`,e=>{let r=e.target;if(r.closest(`[data-toggle]`)){t.classList.toggle(`is-collapsed`);let e=t.querySelector(`[data-arrow]`);e&&(e.textContent=t.classList.contains(`is-collapsed`)?`展开`:`收起`);return}let i=r.closest(`[data-act]`)?.getAttribute(`data-act`);i&&(i===`user`?l(`user`):i===`admin`?l(`admin`):i===`login-user`?n.push(`/login`):i===`reset`&&f())}),n.afterEach(e=>{e.path===`/login`?s(`user`):e.path===`/admin/login`&&s(`admin`)}),n.currentRoute.value.path===`/login`&&s(`user`),n.currentRoute.value.path===`/admin/login`&&s(`admin`)}export{m as installDemoToolbar};