# 三角函数动画学习项目

这是一个通过互动动画和游戏学习三角函数的系列项目。该项目旨在将抽象的三角函数概念转化为可视化的、可交互的图形，帮助学习者更直观地理解三角函数的基本原理和应用。

## 项目特点

- **可视化学习**: 将抽象的数学概念转化为可见、可操作的图形元素
- **互动体验**: 通过拖拽、点击等操作，亲身体验函数关系的变化
- **游戏化设计**: 设置简单的目标、反馈和挑战，增加学习的趣味性
- **循序渐进**: 从基础概念入门到复杂应用，逐步深入
- **深入浅出**: 用直观的动画解释原理，而不仅仅是公式

## 已实现的游戏

1. **角度探索者 (Angle Explorer)**
   - 理解角度（度数与弧度）、正负角、标准位置角
   - 拖动角度观察度数和弧度的关系
   - 挑战模式：拖动到指定角度

2. **单位圆之旅 (Unit Circle Adventure)**
   - 熟悉单位圆，理解圆上点的坐标与角度的关系
   - 观察 cos(θ) 和 sin(θ) 如何对应单位圆上的 x 和 y 坐标
   - 两种挑战模式：坐标寻踪和角度猜测

3. **Sine的秘密 (The Secret of Sine)**
   - 直观理解正弦 (Sine) 函数的定义及其与角度的关系
   - 联动单位圆和正弦函数图像
   - 可视化正弦值与单位圆上y坐标的关系

4. **Cosine的轨迹 (Cosine's Path)**
   - 直观理解余弦 (Cosine) 函数的定义及其与角度的关系
   - 联动单位圆和余弦函数图像
   - 可视化余弦值与单位圆上x坐标的关系
   - 动态波形展示和挑战模式

5. **Tangent的斜率 (Tangent's Slope)**
   - 理解正切 (Tangent) 函数的定义及其与角度的关系
   - 观察正切函数的两种几何意义：斜率和切线
   - 探索渐近线和函数不连续性
   - 提供两种可视化模式和挑战模式

6. **三角恒等式游乐场 (Trig Identities Playground)**
   - 可视化理解基础三角恒等式，特别是 `sin²(θ) + cos²(θ) = 1`

7. **波形塑造师 (Wave Shaper)**
   - 理解三角函数图像的振幅、周期、相位移动和垂直位移
   
8. **解三角形助手 (Triangle Solver)**
   - 应用三角函数解决直角三角形问题
   - 多种解题模式：角度和一条边、两条边、应用题
   - 可视化三角形和详细的解题步骤
   - 随机例题和挑战练习

## 计划实现的游戏

更多游戏正在开发中...

## 如何运行

本项目是纯前端实现，无需后端服务器，按照以下步骤即可运行：

1. 直接下载项目所有文件到本地文件夹
2. 使用浏览器打开 `index.html` 文件
3. 点击主页上的游戏卡片，进入对应的游戏页面

或者，您也可以使用简单的 HTTP 服务器来运行项目：

```bash
# 如果安装了 Python 3
python -m http.server

# 如果安装了 Node.js
npx http-server
```

然后在浏览器中访问 `http://localhost:8000`（或服务器显示的其他端口）。

## 技术实现

- **HTML5**: 页面结构
- **CSS3**: 样式和布局
- **JavaScript**: 交互逻辑
- **SVG**: 图形绘制和动画
- 没有使用任何外部库，全部使用原生技术实现

## 浏览器兼容性

推荐使用最新版的现代浏览器，如 Chrome、Firefox、Edge 或 Safari。

## 未来计划

- 完成剩余游戏的开发
- 添加更多的挑战和测验
- 优化移动设备体验
- 添加可选的深入解释和更多例子

## 参与贡献

欢迎提出建议、报告问题或提交改进代码。

## 许可

本项目采用 MIT 许可证。