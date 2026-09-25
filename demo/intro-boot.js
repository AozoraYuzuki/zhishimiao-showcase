/* =============================================================================
 * 入场引导（首页品牌画面的预置判断）
 * -----------------------------------------------------------------------------
 * ## 为什么是**外部文件**而不是 index.html 里的内联脚本
 * 构建期会注入 CSP：`script-src 'self'`（见 vite.config.ts 的 buildOnlyCsp），
 * 而这条策略**不允许内联脚本**。曾经把它写成 `<script>...</script>`，
 * 结果在构建产物里被 CSP 直接拒执行 —— 实测 `window.__DSH_INTRO__` 为 undefined，
 * 于是 `shouldPlayIntro()` 返回 false，**线上 Demo 永远不会播入场**；
 * 而 dev 环境不注入 CSP，本地怎么看都是好的。
 *
 * ⇒ 必须放在 `public/` 下由 `<script src>` 引入：public 的文件会原样拷到站点根、
 *    不受打包改名影响，因此可以安全地用 `'self'` 放行，不必动 CSP 策略。
 *
 * ## 它做什么
 * 在**首绘之前**决定"本次是否播入场"，并把结果写进 window.__DSH_INTRO__，
 * 由 src/composables/useIntro.ts 读取。判断只在这里做一次，两侧永远同源 ——
 * 否则会出现"HTML 铺了墨暗底、Vue 却不播入场"，整页闪一下黑，比白屏更糟。
 *
 * ## ⚠️ 为什么**不再**用 sessionStorage 记忆"已经看过"
 * 曾经用 sessionStorage 记录"同一次会话只播一次"，结果是：用户刷新首页时
 * 浏览器保留 sessionStorage，幕布就再也不出现了 —— 而刷新页面在用户心里
 * 就是"重新进一次首页"，期望看到入场。
 * 现在改为**每次整页加载都播**：
 *   · 刷新 → 播 ✓
 *   · 直接打开链接 / 换标签页 → 播 ✓
 *   · 站内路由跳转（点导航回首页）→ 不播，因为那是 SPA 内部切换、
 *     Home 组件复用不会重新执行本脚本
 * 这个区分正好符合直觉，而且不需要任何存储。
 *
 * ## ⚠️ 这里不碰 history.scrollRestoration
 * 曾经在这写 `history.scrollRestoration = 'manual'` 来绕开"切页后停在页面底部"，
 * 那是治标：真正的原因是项目缺 vue-router 的 scrollBehavior。
 * 现在由 src/router/index.ts 的 scrollBehavior 统一处理，这里不再插手 ——
 * 同一件事不要有两个地方各管一半。
 * ========================================================================== */
(function () {
  var html = document.documentElement;

  var reduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /*
    路由前缀：Demo 走 hash 路由（/#/），正常构建走 history（/）。
    只有落在首页才播入场 —— 直接进 /recipes 或菜品详情时给用户盖一层品牌画面
    属于打扰，不是仪式感。
  */
  var hash = location.hash;
  var isHome = hash
    ? hash === '#/' || hash === '#'
    : location.pathname === '/' || location.pathname === '';

  /*
    强制开关：优先级最高。
    intro=1 强制播（自查用）、intro=0 强制跳过。
  */
  var q = new URLSearchParams(location.search).get('intro');

  var play;
  if (q === '1') {
    play = true;
  } else if (q === '0') {
    play = false;
  } else {
    play = !reduced && isHome;
  }

  // 交给 useIntro.ts 读取，保证两侧判断同源
  window.__DSH_INTRO__ = {
    play: play,
    isHome: isHome,
    reduced: reduced,
  };

  if (play) {
    html.setAttribute('data-intro', 'pending');
  } else {
    // 明确不播：打上 skip，让 index.html 内联 CSS 里的暗底规则整体让路。
    // 非首页 / 减少动态效果 两条路径都走这里，避免闪一下黑。
    html.setAttribute('data-intro-skip', '');
  }
})();
