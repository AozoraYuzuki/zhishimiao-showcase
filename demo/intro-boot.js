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
 * ⚠️ 这里刻意不用 ES module 语法（import/export）也不做任何转译：
 *    它要在最早时刻同步执行，越简单越稳。走的是普通 <script>，不是 type=module。
 * ========================================================================== */
(function () {
  var html = document.documentElement;
  var KEY = 'zhishimiao:intro-seen';

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

  var seen = false;
  try {
    seen = sessionStorage.getItem(KEY) === '1';
  } catch (e) {
    /* 隐私模式等场景读不到，按"没看过"处理 */
  }

  /*
    强制开关：必须**优先于** seen / isHome 判断。
    ⚠️ 这里踩过一次：最初把 intro=1 写成"覆盖 seen"，但 play 的表达式里仍然带着
       !seen —— 于是第一次播完后 sessionStorage 变成 1，intro=1 就再也强制不出来，
       调试与截图自查全线失效。强制就该是强制：命中就直接 play=true。
  */
  var q = new URLSearchParams(location.search).get('intro');

  var play;
  if (q === '1') {
    play = true; // 强制重播（仅供自查）
  } else if (q === '0') {
    play = false; // 强制跳过
  } else {
    play = !reduced && isHome && !seen;
  }

  // 交给 useIntro.ts 读取，保证两侧判断同源
  window.__DSH_INTRO__ = {
    play: play,
    isHome: isHome,
    reduced: reduced,
    seen: seen,
  };

  if (play) {
    html.setAttribute('data-intro', 'pending');
    // 抑制浏览器恢复上次滚动位置：画面期间若页面已滚到中段，
    // 退场后会"落在页面中间"，看起来像跳了一下
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  } else {
    // 明确不播：打上 skip，让 index.html 内联 CSS 里的暗底规则整体让路。
    // 非首页 / 已看过 / 减少动态效果 三条路径都走这里，避免闪一下黑。
    html.setAttribute('data-intro-skip', '');
  }
})();
