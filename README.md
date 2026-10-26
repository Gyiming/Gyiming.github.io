# 个人主页 v2 · 仿 baichen318 排版

一套可直接部署的**静态**个人主页，版式参考 <https://baichen318.github.io/>：
左侧固定菜单、右侧内容区、点击菜单**无刷新**切换、Georgia 衬线字体、蓝色标题配细分隔线。

原来的 Jekyll 站点代码**完全没有改动**。这里是独立的新版本，先放在本地供你检查，
确认合适后再决定怎么合并到 GitHub。

---

## 本地预览

在 `yiming-site-v2/` 目录下执行：

```bash
python3 -m http.server 8000
```

然后打开 <http://localhost:8000>。

> 建议用本地服务器预览，而不是直接双击 `index.html`。直接打开时部分浏览器会
> 限制 `history.pushState`，标签切换仍可工作，但地址栏的 `#publications` 之类
> 的深链接可能不更新。

也可以直接访问某个标签的深链接，例如
<http://localhost:8000/#publications>、`#research`、`#team`、`#students`。

---

## 目录结构

```
yiming-site-v2/
├── index.html                  # 整站内容（5 个 section，每段都有注释）
├── CNAME                       # yiminggan.com（部署到 GitHub Pages 时用）
├── .nojekyll                   # 关闭 GitHub Pages 的 Jekyll 构建
├── robots.txt
├── sitemap.xml
├── README.md
└── assets/
    ├── css/style.css           # 全部样式，含响应式
    ├── js/site.js              # 标签切换、hash 路由、键盘操作
    ├── img/
    │   ├── portrait.jpg        # 头像（旧站 photo.png，358×441）
    │   ├── favicon.png         # 字母标 YG
    │   └── apple-touch-icon.png
    ├── cv/YimingGan-CV-2023.pdf
    └── papers/                 # 旧站 file/ 里的 7 篇 PDF，改为相对路径
```

只有 4 类文件：HTML + CSS + 一个 5 KB 左右的 JS + 图片/PDF。
没有外部字体、CDN 或框架依赖，断网也能打开。

---

## 怎么改内容

### 改某一段文字

打开 `index.html`，每个板块都有注释定位：

```html
<!-- ==================== ABOUT ==================== -->
<section class="section is-active" id="about" ...>
```

文字就是普通 HTML。`<h2>` 是板块大标题，`<h3>` 是小标题。

### 增加 / 删除一个菜单项

菜单和内容是**一一对应**的，两处要同时改：

1. 侧栏导航里加一行（`data-tab` 和 `data-title` 是给 JS 用的）：

```html
<a class="tab" id="tab-teaching" role="tab" href="#teaching"
   data-tab="teaching" data-title="Teaching" aria-controls="teaching"
   aria-selected="false" tabindex="-1">Teaching</a>
```

2. 内容区加一个对应的 section：

```html
<section class="section" id="teaching" role="tabpanel"
         aria-labelledby="tab-teaching" data-section="teaching" hidden>
  <h2>Teaching</h2>
  ...
</section>
```

`id`、`data-tab`、`data-section` 三个名字保持一致即可；顺序随意，JS 会自动处理。

### 增加一篇论文

复制下面这段，放进对应分组的 `<ul class="pub-list">` 里：

```html
<li class="pub">
  <p class="pub-title"><a href="assets/papers/xxx.pdf">论文标题</a></p>
  <p class="pub-authors">作者 A, 作者 B, <b>Yiming Gan</b><sup>†</sup>, 作者 C.</p>
  <p class="pub-venue">会议全称 (<b>MICRO 2026</b>)</p>
</li>
```

- 没有 PDF 就去掉 `<a>`，只留标题文字。
- `†` 表示通讯作者，`*` 表示共同一作，页面顶部已有图例。
- 想加 "Best Paper" 之类的标签：`<span class="badge">Best Paper Nomination</span>`。

### 换头像 / CV / PDF

- 头像：`assets/img/portrait.jpg`，建议 3:4 竖图（如 600×800），替换同名文件即可。
- CV：`assets/cv/YimingGan-CV-2023.pdf`，换成新版后**记得同步改**
  `index.html` 里唯一的 CV 链接（搜索 `YimingGan-CV`）。
- 论文 PDF 放在 `assets/papers/`，文件名随意，改 HTML 里的 `href` 即可。

### 改颜色 / 字号

`assets/css/style.css` 顶部：

```css
:root {
  --accent: #527bbd;      /* 标题蓝，和参考站一致 */
  --link: #224b8d;        /* 正文链接 */
  --sidebar-w: 254px;     /* 左侧栏宽度 */
  --content-max: 810px;   /* 正文最大宽度 */
  --serif: Georgia, ...;  /* 字体栈，中文回退到宋体 */
}
```

---

## 发布到 GitHub Pages

`CNAME` 已经写好 `yiminggan.com`。下面两种方式选一种。

### 方案 A：整站替换（推荐，最终形态）

在旧仓库里开一个新分支操作，`main` 上的旧站不受影响：

```bash
cd Gyiming.github.io
git checkout -b site-v2

# 把新站文件复制到仓库根目录（连同 .nojekyll、CNAME）
cp -R /path/to/yiming-site-v2/. .

# 关键：必须删掉旧的 index.md，否则 Jekyll 会和 index.html 冲突
git rm index.md
```

如果确定不再保留旧站点，再清理这些旧文件（可选，但建议）：

```
_config.yml  _includes/  _layouts/
publications.md  research.md  group.md  prostu.md  fundings.md  blogs.md
blogs/  backup/  mypaper/
```

`file/` 和 `images/` 可留可删，新站已经不再引用它们。

```bash
git add -A
git commit -m "Redesign personal site (v2)"
git push -u origin site-v2
```

在 GitHub 上确认新分支的预览没问题后，合并进 `main`（或把 `site-v2` 设为
Pages 的发布分支）。有 `.nojekyll` 在，GitHub Pages 会直接原样发布这些文件，
不再跑 Jekyll。

### 方案 B：先放子目录试水

不想马上动根目录的话，把整个文件夹放进仓库的 `v2/`：

```bash
cp -R /path/to/yiming-site-v2 Gyiming.github.io/v2
git add v2 && git commit -m "Add site v2 preview" && git push
```

访问 `https://yiminggan.com/v2/` 查看。所有路径都是相对的，放在子目录能正常工作。
满意后再按方案 A 挪到根目录。

> 注意：`.nojekyll` 只对仓库根目录生效。方案 B 下 Jekyll 仍在运行，
> 但 `index.html` 没有 front matter，会被原样复制，不影响显示。

---

## 这一版做了什么

### 版式

- 左侧 254px 固定侧栏（浅灰底、细分隔线），下方列研究方向，底部是 ICT / CAS 标识区。
- Academic Service 不再单独占一个标签，内容放在首页 About 里；funding 和团队名单都是纯文字列表。
- 右侧正文最大 810px，Georgia 衬线，标题 `#527bbd` 配 1px 分隔线，方形项目符号。
- 顶部「头像 + 姓名 + 职称 + 单位 + 链接」两栏布局，右下方保留一句座右铭。
- 切换板块只换内容，不刷新页面；地址栏同步 `#publications`，可分享、可前进后退。
- 响应式：窗口 ≤860px 时侧栏变成顶部横向标签条；≤620px 时头像与文字上下排列。
- 无 JS 时自动降级为「所有板块依次铺开」，不会白屏。
- 打印时隐藏侧栏，只打印当前板块。

### 内容（相对旧站）

- 职称改为 **Associate Professor**；删掉旧首页里「2025 年招博后」的时效表述，
  改成常年在招的写法（**这句请你确认**）。
- 拼写修正：`laugnage→language`、`envolve→evolution`、
  `Transcations→Transactions`、`Virtulization→Virtualization`、
  `SIGMETRIC→SIGMETRICS`、`Qiang liu→Qiang Liu`、`Yu Bo→Bo Yu`。
- 通讯作者统一用 `†`、共同一作用 `*`，并在论文页顶部加图例；不再用「(通讯)」。
- 修正错误链接：Thales 原来和 BRAUM 都指向 ISSRE 那篇 PDF，现改为 `hpca23.pdf`；
  BLITZCRANK 原来也指向 ISSRE，暂时不加链接（如果你确认 `dac23.pdf` 是这篇，可以补上）。
- AIRSHIP 的原仓库链接 <https://github.com/airs-cuhk/airship> 现在返回 404，
  暂时取消了超链接，只保留文字，建议补一个有效地址。
- 团队页：Zixuan Wang 补上 `ICML'26`；Kai Pan 去掉了看起来像占位的 "Now Somewhere."。
- 新增「The Greater Fool.」座右铭（取自旧站 `_config.yml` 的 description，
  不想要直接删掉 `<p class="motto">` 那一行）。
- 新增 SEO 元信息、Open Graph、Person 结构化数据、YG 字母 favicon。
- 旧站的 `blogs` 是模板自带内容（文章都指向 caihanlin.com），没有迁移过来。
- 旧站的 Google Analytics / counter.dev 统计脚本没有带过来（新站零第三方请求）。
  如果仍需要访问统计，可以把旧站 `_layouts/default.html` 里的两段脚本加到 `</body>` 前。

### 需要你确认 / 替换的

1. **CV 还是 2023 版**，建议换新版并改名。
2. 头像用的是旧站 `photo.png`，如有新照片可替换。
3. 地址（科学院南路 6 号，100190）是否要保留 / 是否要写办公室房间号。
4. GitHub 链接按仓库名推定为 `github.com/Gyiming`，请确认。
5. 论文列表里部分条目没有链接（Deltoris、UDyr、ScaleGS 等），有 DOI 可以补。
6. 团队名单、招生名额、最新新闻是否更新到 2026 年秋。
7. 座右铭与 "Last updated: October 2026" 去留。

---

## 小提示

- 标签支持键盘操作：Tab 聚焦后可用 `↑/↓/←/→` 切换，`Home/End` 跳到首尾。
- 浏览器缓存了旧 CSS 时，按 `Cmd+Shift+R` 强制刷新。
- 站点不依赖 `index.md`，也不依赖任何 Jekyll 插件；以后加内容直接改 `index.html`。
