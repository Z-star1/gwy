# GWY 公务员考试备考系统

**在职备考** · 每天 **2 小时** · **三个月** · 目标 **160 分**

手机（安卓）和电脑都能用。不做题，重点是：**看素材、记词句、跟计划**。

## 手机怎么用

1. 用 Chrome / 系统浏览器打开网站
2. 菜单里选 **添加到主屏幕**（或页面弹出「安装」）
3. 桌面出现「GWY备考」图标，像 App 一样打开
4. 通勤、午休点进 **素材**：看金句、案例、成语、政策热词
5. 点 **收入积累本**，或自己写一条，随时复制

数据存在手机浏览器本地，不需要登录。

## 五个入口

| 入口 | 作用 |
|------|------|
| 总览 | 2 小时进度、今日任务 |
| 素材 | 素材库 + 我的词句积累本 |
| 行测 / 申论 | 模块方法与目标分（不刷题） |
| 规划 | 12 周在职计划 |
| 模考 | 电脑端记录分数（手机底部导航不放，减少干扰） |

## 素材库里有什么

- **申论金句**：人民至上、实干、绿水青山等，并标明用法
- **典型案例**：千万工程、枫桥经验、塞罕坝等
- **高频成语**：易混辨析，服务言语填空积累
- **政策热词**：新质生产力、中国式现代化、双碳等

## 部署上线（给手机用）

这是静态网站，构建后只有 `dist/` 文件夹。**必须用 HTTPS**，安卓才能「添加到主屏幕」。

线上地址（合并到 `main` 并打开 Pages 之后）：

**https://z-star1.github.io/gwy/**

### 方式一：GitHub Pages（推荐，免费）

仓库里已有自动部署工作流。你需要做两件事：

1. 把代码合并进 `main` 分支  
2. 打开仓库 → **Settings → Pages → Build and deployment**  
   - Source 选 **GitHub Actions**

之后每次推送到 `main`，几分钟后网站就会更新。  
手机用 Chrome 打开上面的地址 → 菜单 → **添加到主屏幕**。

也可在仓库 **Actions** 里手动点 `Deploy GitHub Pages` → `Run workflow`。

### 方式二：Vercel（点几下，也免费）

1. 打开 [https://vercel.com](https://vercel.com)，用 GitHub 登录  
2. Import 仓库 `Z-star1/gwy`  
3. 框架选 Vite，构建命令 `npm run build`，输出目录 `dist`  
4. Deploy。会得到类似 `https://gwy-xxx.vercel.app` 的地址

### 方式三：自己的服务器

```bash
npm install
npm run build
```

把 `dist/` 里的全部文件拷到 Nginx / 对象存储 / 任意静态空间。Nginx 示例：

```nginx
server {
  listen 443 ssl;
  server_name your.domain.com;
  root /var/www/gwy;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### 本地预览构建结果

```bash
npm run build
npm run preview
```

电脑浏览器打开 `http://localhost:4173`。同一 Wi-Fi 下，手机访问终端里显示的 Network 地址（仅测试，不能当正式站）。

### 注意

- 学习进度和积累本存在**当前浏览器**，换设备不会同步  
- 第一次用手机打开正式站后，再「添加到主屏幕」
