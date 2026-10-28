# 个人主页 v2 · jemdoc 版（仿 baichen318.github.io）

这一版直接以 <https://baichen318.github.io/> 的代码为骨架重做：

- `jemdoc.css`、`middle-layout.css` 原样取自该站；
- 页面结构沿用它的 `#tlayout` 表格布局、左侧 `menu-item` 菜单、右侧 `content-section` 分页；
- 标签切换脚本也沿用它的写法（无刷新、地址栏同步 `#publications`）；
- 内容换成你的，只保留少量必要改动（见下文“与参考站的不同”）。

原来的 Jekyll 站点没有动。这里是独立的新版本，本地预览确认后再决定是否替换到 GitHub。

---

## 本地预览

在 `yiming-site-v2/` 目录下：

```bash
python3 -m http.server 8000
```

打开 <http://localhost:8000>。深链接可以直接访问
`#publications`、`#research`、`#team`、`#students`。

---

## 目录结构

```
yiming-site-v2/
├── index.html              # 整站内容（5 个 content-section）
├── jemdoc.css              # 来自参考站
├── middle-layout.css       # 来自参考站（侧栏、logo、移动端）
├── CNAME                   # yiminggan.com
├── .nojekyll               # 关闭 GitHub Pages 的 Jekyll 构建
├── robots.txt
├── sitemap.xml
├── README.md
└── assets/
    ├── img/
    │   ├── portrait.jpg          # 头像（旧站 photo.png）
    │   ├── ict-logo.png          # 侧栏底部标识（ICT 官方 logo）
    │   ├── google-scholar.png    # 三个社交图标取自参考站
    │   ├── github.png
    │   ├── linkedin.png
    │   ├── favicon.png
    │   └── apple-touch-icon.png
    ├── cv/YimingGan-CV-2023.pdf
    └── papers/                   # 7 篇论文 PDF
```

---

## 怎么改

### 菜单和板块

菜单项：

```html
<div class="menu-item"><a href="#team" data-tab="team">Team</a></div>
```

对应内容块：

```html
<div class="content-section" id="team" data-section="team">
  <h2>Team</h2>
  ...
</div>
```

`href`、`data-tab`、`id`、`data-section` 四处保持一致即可。当前板块会自动加
`current` 类（菜单下划线）和 `is-active` 类（内容显示），脚本会处理。

### 论文

参考站是“一段一篇”的写法，这里也一样：

```html
<li><p>Authors, &ldquo;Paper Title,&rdquo; Venue (<b>MICRO 2026</b>).</p></li>
```

- 标题加链接：把标题文字包进 `<a href="...">`。
- `†` 通讯作者、`*` 共同一作，页面顶部已有说明。
- 获奖用 `<span class="award">Best Paper Nomination</span>`（红色）。

### 头像、CV、PDF

- 头像：`assets/img/portrait.jpg`，页面里 `width: 200px`，可自行调大。
- CV：`assets/cv/YimingGan-CV-2023.pdf`，换新版后改 `index.html` 里
  `YimingGan-CV-2023` 这一处链接。
- 论文 PDF 放 `assets/papers/`。

### 侧栏标识与宽度

- 侧栏底部的 ICT logo 是 `assets/img/ict-logo.png`，在 `#layout-menu` 末尾。
- 侧栏默认 175px；这里在 `<style>` 里改成了 190px，避免 “Prospective Students” 换行。
  想恢复参考站宽度，把 `#layout-menu { width: 190px; }` 一行删掉即可。

### 颜色和字体

直接改 `jemdoc.css`：标题蓝是 `#527bbd`，链接蓝是 `#224b8d`，字体是 Georgia。
这是参考站的原文件，建议只改必要的几处。

---

## 与参考站的不同

1. **Academic Service 不单独占标签**，放在 About 页里（按你的要求）。
2. **Funding 和 Team 是纯文字列表**，没有卡片、头像、边框和动画（按你的要求）。
3. 菜单只有 5 项：About / Publications / Research / Team / Prospective Students。
4. 加了 `<meta name="viewport">`，手机端会走 `middle-layout.css` 自带的响应式规则；
   参考站没有 viewport，手机上实际是缩小的桌面版。
5. 加了无 JS 兜底：脚本被禁用时所有板块依次展开，不会只剩 About。
6. 侧栏底部用 ICT 官方 logo，favicon 也从它生成；社交图标取自参考站。
7. 页脚保留一行版权和更新时间；参考站页脚是空的。

---

## 发布到 GitHub Pages

`CNAME` 已写好 `yiminggan.com`。推荐开新分支替换，确认后再合并：

```bash
cd Gyiming.github.io
git checkout -b site-v2

# 新站文件复制到仓库根目录
cp -R /path/to/yiming-site-v2/. .

# 必须删掉旧 index.md，否则 index.html / index.md 会冲突
git rm index.md
```

不再需要旧 Jekyll 文件时，一并清理：

```
_config.yml  _includes/  _layouts/
publications.md  research.md  group.md  prostu.md  fundings.md  blogs.md
blogs/  backup/  mypaper/  LICENSE
```

`file/`、`images/` 可留可删，新站不再引用。

```bash
git add -A
git commit -m "Redesign personal site (jemdoc layout)"
git push -u origin site-v2
```

确认预览没问题后合并到 `main`。仓库根部有 `.nojekyll`，GitHub Pages 会原样发布，
不再跑 Jekyll。

想先试水也可以把整个文件夹放到仓库的 `v2/`，访问 `https://yiminggan.com/v2/`；
所有路径都是相对的，子目录可用。

---

## 内容说明 / 待确认

- 职称是 **Associate Professor**；旧首页“2025 年招博后”的时效表述已去掉。
- 小米基金名称用了你本地未提交的新版本：
  “AI-supported Domain-Specific Chip and Compiler Co-Design Based on RISC-V ISA”。
- 修正了 `laugnage / envolve / Transcations / Virtulization / SIGMETRIC` 等拼写，
  以及 `Qiang liu`、`Yu Bo` 等姓名大小写。
- Thales 原来和 BRAUM 共用了 ISSRE 的 PDF 链接，现指向 `hpca23.pdf`；
  BLITZCRANK 原来也指向那篇，暂时没有加链接（确认 `dac23.pdf` 是这篇可补）。
- AIRSHIP 原仓库 `github.com/airs-cuhk/airship` 已 404，暂时只保留文字。
- 团队页：Zixuan Wang 补了 `ICML'26`；去掉了 Kai Pan 的 “Now Somewhere.”。
- 座右铭 “The Greater Fool.” 取自旧站 `_config.yml`，不想要删掉 `<q>` 那一行。
- CV 仍是 2023 版；头像沿用旧照片；地址、GitHub 链接请确认。
