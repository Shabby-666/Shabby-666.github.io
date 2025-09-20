# _Chinese_Player_ 个人网站

这是一个为 _Chinese_Player_ 创建的个人网站模板。网站包含个人简介、社交媒体链接和项目展示等功能。

## 功能特性

- 现代化、响应式设计，适配各种设备尺寸
- 精美的UI界面，包含平滑动画和过渡效果
- 社交媒体链接跳转功能（Modrinth、GitHub、抖音）
- 个人简介编辑区域（留空供用户填写）
- 项目展示区域
- 无障碍支持和键盘导航

## 如何使用

1. 将所有文件下载到您的计算机上
2. 打开 `index.html` 文件即可查看网站效果
3. 要编辑个人简介，请打开 `index.html` 文件，找到 "关于我" 部分的内容进行修改

## 编辑指南

### 修改个人简介

1. 使用文本编辑器（如记事本、VS Code等）打开 `index.html` 文件
2. 找到以下代码段：
   ```html
   <section id="about" class="mb-16 fade-in" style="animation-delay: 0.2s">
       <div class="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
           <h2 class="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
               <i class="fa fa-info-circle"></i>
               关于我
           </h2>
           <div class="prose max-w-none">
               <!-- 个人简介留空，用户可以自己填写 -->
               <p class="text-gray-600 min-h-[100px] border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                   [个人简介内容将在这里显示，您可以稍后编辑此部分]
               </p>
           </div>
       </div>
   </section>
   ```
3. 将 `[个人简介内容将在这里显示，您可以稍后编辑此部分]` 替换为您的个人简介内容
4. 保存文件后刷新浏览器即可看到更新后的效果

### 添加项目

1. 打开 `index.html` 文件
2. 找到 "我的项目" 部分：
   ```html
   <section id="projects" class="fade-in" style="animation-delay: 0.6s">
       <h2 class="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
           <i class="fa fa-code"></i>
           我的项目
       </h2>
       <div class="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
           <div class="flex flex-col items-center justify-center py-12 text-center">
               <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                   <i class="fa fa-folder-open text-3xl text-gray-400"></i>
               </div>
               <h3 class="text-xl font-semibold mb-2">暂无项目展示</h3>
               <p class="text-gray-500 max-w-md">
                   这个区域将展示您的项目，您可以稍后添加项目信息和截图。
               </p>
           </div>
       </div>
   </section>
   ```
3. 替换为您的项目内容。您可以使用卡片布局来展示多个项目

## 文件结构

- `index.html` - 网站主要内容和结构
- `styles.css` - 网站样式和动画效果
- `script.js` - 交互功能和动态效果
- `README.md` - 网站使用说明

## 技术栈

- HTML5
- Tailwind CSS v3（通过CDN引入）
- Font Awesome 图标（通过CDN引入）
- JavaScript

## 部署方法

您可以使用任何静态网站托管服务来部署这个网站，例如：
- GitHub Pages
- Netlify
- Vercel
- 个人服务器

只需将所有文件上传到托管服务，即可在线访问您的个人网站。

## 注意事项
- 请确保您的个人简介内容符合相关法律法规
- 社交媒体链接可能会随着平台政策变化而需要更新
- 如果您有任何问题或需要帮助，请咨询专业的网页开发者