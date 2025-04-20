document.addEventListener('DOMContentLoaded', function() {
    // 获取SVG元素和重要组件
    const svg = document.getElementById('unit-circle-canvas');
    const dragPoint = document.getElementById('drag-point');
    const hypotenuse = document.getElementById('hypotenuse');
    const xProjection = document.getElementById('x-projection');
    const yProjection = document.getElementById('y-projection');
    const xLine = document.getElementById('x-line');
    const yLine = document.getElementById('y-line');
    const angleArc = document.getElementById('angle-arc');
    const angleLabel = document.getElementById('angle-label');
    const xLabel = document.getElementById('x-label');
    const yLabel = document.getElementById('y-label');
    const gridLinesGroup = document.getElementById('grid-lines');
    const specialAnglesGroup = document.getElementById('special-angles');
    
    // 获取信息面板的元素
    const coordinatesSpan = document.getElementById('coordinates');
    const angleSpan = document.getElementById('angle');
    const cosValueSpan = document.getElementById('cos-value');
    const sinValueSpan = document.getElementById('sin-value');
    const tanValueSpan = document.getElementById('tan-value');

    // 获取按钮元素
    const toggleProjectionsBtn = document.getElementById('toggle-projections');
    const resetPointBtn = document.getElementById('reset-point');
    const animateCircleBtn = document.getElementById('animate-circle');
    const startChallengeBtn = document.getElementById('start-challenge');
    
    // 设置初始状态变量
    let showProjections = false;
    let isAnimating = false;
    let animationId = null;
    const RADIUS = 100; // 单位圆半径
    
    // 特殊角度数组 (弧度值)
    const specialAngles = [
        { angle: 0, label: "0°" },
        { angle: Math.PI/6, label: "30°" },
        { angle: Math.PI/4, label: "45°" },
        { angle: Math.PI/3, label: "60°" },
        { angle: Math.PI/2, label: "90°" },
        { angle: 2*Math.PI/3, label: "120°" },
        { angle: 3*Math.PI/4, label: "135°" },
        { angle: 5*Math.PI/6, label: "150°" },
        { angle: Math.PI, label: "180°" },
        { angle: 7*Math.PI/6, label: "210°" },
        { angle: 5*Math.PI/4, label: "225°" },
        { angle: 4*Math.PI/3, label: "240°" },
        { angle: 3*Math.PI/2, label: "270°" },
        { angle: 5*Math.PI/3, label: "300°" },
        { angle: 7*Math.PI/4, label: "315°" },
        { angle: 11*Math.PI/6, label: "330°" }
    ];
    
    // 初始化函数
    function init() {
        // 绘制网格线
        drawGridLines();
        
        // 绘制特殊角度标记
        drawSpecialAngles();
        
        // 设置投影线初始状态
        updateProjectionVisibility();
        
        // 设置拖拽功能
        setupDragging();
        
        // 设置按钮事件监听器
        setupEventListeners();
        
        // 初始更新点的位置和所有相关显示
        updatePointPosition(1, 0);
    }
    
    // 绘制网格线
    function drawGridLines() {
        // 清除现有网格线
        gridLinesGroup.innerHTML = '';
        
        // 绘制水平和垂直网格线
        for (let i = -2; i <= 2; i += 0.5) {
            if (i !== 0) { // 跳过坐标轴(已单独绘制)
                // 水平线
                const hLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
                hLine.setAttribute("class", "grid-line");
                hLine.setAttribute("x1", "-200");
                hLine.setAttribute("y1", i * RADIUS);
                hLine.setAttribute("x2", "200");
                hLine.setAttribute("y2", i * RADIUS);
                
                // 垂直线
                const vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
                vLine.setAttribute("class", "grid-line");
                vLine.setAttribute("x1", i * RADIUS);
                vLine.setAttribute("y1", "-200");
                vLine.setAttribute("x2", i * RADIUS);
                vLine.setAttribute("y2", "200");
                
                // 主刻度标记（整数值）
                if (Number.isInteger(i)) {
                    hLine.setAttribute("class", "grid-line major");
                    vLine.setAttribute("class", "grid-line major");
                    
                    // 添加标签（如果不是0）
                    if (i !== 0) {
                        // X轴标签
                        const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
                        xLabel.setAttribute("x", i * RADIUS);
                        xLabel.setAttribute("y", "15");
                        xLabel.setAttribute("text-anchor", "middle");
                        xLabel.setAttribute("font-size", "10");
                        xLabel.textContent = i;
                        
                        // Y轴标签
                        const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
                        yLabel.setAttribute("x", "15");
                        yLabel.setAttribute("y", -i * RADIUS + 5);
                        yLabel.setAttribute("font-size", "10");
                        yLabel.textContent = i;
                        
                        gridLinesGroup.appendChild(xLabel);
                        gridLinesGroup.appendChild(yLabel);
                    }
                }
                
                gridLinesGroup.appendChild(hLine);
                gridLinesGroup.appendChild(vLine);
            }
        }
    }
    
    // 绘制特殊角度标记
    function drawSpecialAngles() {
        specialAnglesGroup.innerHTML = '';
        
        specialAngles.forEach(angleInfo => {
            // 计算角度标记的位置（略微偏移半径）
            const markRadius = RADIUS * 0.9;
            const x = markRadius * Math.cos(angleInfo.angle);
            const y = -markRadius * Math.sin(angleInfo.angle); // 注意SVG的Y轴是向下的
            
            // 创建小标记点
            const marker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            marker.setAttribute("class", "angle-marker");
            marker.setAttribute("cx", x);
            marker.setAttribute("cy", y);
            marker.setAttribute("r", "2");
            
            specialAnglesGroup.appendChild(marker);
        });
    }
    
    // 更新投影线显示或隐藏
    function updateProjectionVisibility() {
        if (showProjections) {
            xProjection.style.display = "block";
            yProjection.style.display = "block";
        } else {
            xProjection.style.display = "none";
            yProjection.style.display = "none";
        }
    }
    
    // 设置点的拖拽功能
    function setupDragging() {
        let isDragging = false;
        
        // 监听点击事件
        dragPoint.addEventListener('mousedown', startDrag);
        dragPoint.addEventListener('touchstart', startDrag);
        
        // 监听移动事件
        svg.addEventListener('mousemove', drag);
        svg.addEventListener('touchmove', drag);
        
        // 监听释放事件
        window.addEventListener('mouseup', endDrag);
        window.addEventListener('touchend', endDrag);
        
        function startDrag(e) {
            isDragging = true;
            e.preventDefault();
        }
        
        function drag(e) {
            if (isDragging && !isAnimating) {
                e.preventDefault();
                
                // 获取鼠标/触摸位置相对于SVG的坐标
                let point;
                if (e.type.includes('mouse')) {
                    const svgRect = svg.getBoundingClientRect();
                    point = {
                        x: e.clientX - svgRect.left - svgRect.width / 2,
                        y: e.clientY - svgRect.top - svgRect.height / 2
                    };
                } else { // 触摸事件
                    const svgRect = svg.getBoundingClientRect();
                    const touch = e.touches[0];
                    point = {
                        x: touch.clientX - svgRect.left - svgRect.width / 2,
                        y: touch.clientY - svgRect.top - svgRect.height / 2
                    };
                }
                
                // 计算角度和投影到单位圆上的位置
                const angle = Math.atan2(-point.y, point.x); // 注意SVG的Y轴是向下的
                
                // 计算单位圆上的位置
                const x = Math.cos(angle);
                const y = Math.sin(angle);
                
                // 更新点的位置和相关显示
                updatePointPosition(x, y);
            }
        }
        
        function endDrag() {
            isDragging = false;
        }
    }
    
    // 设置按钮事件监听器
    function setupEventListeners() {
        // 切换投影线显示/隐藏
        toggleProjectionsBtn.addEventListener('click', function() {
            showProjections = !showProjections;
            updateProjectionVisibility();
            
            // 更新按钮文字
            toggleProjectionsBtn.textContent = showProjections ? "隐藏投影线" : "显示投影线";
        });
        
        // 重置点的位置
        resetPointBtn.addEventListener('click', function() {
            // 停止可能正在进行的动画
            stopAnimation();
            
            // 重置到初始位置 (1, 0)
            updatePointPosition(1, 0);
        });
        
        // 动画演示
        animateCircleBtn.addEventListener('click', function() {
            if (isAnimating) {
                stopAnimation();
                animateCircleBtn.textContent = "动画演示";
            } else {
                startAnimation();
                animateCircleBtn.textContent = "停止动画";
            }
        });
        
        // 开始挑战按钮
        startChallengeBtn.addEventListener('click', function() {
            startChallenge();
        });
    }
    
    // 更新点的位置和所有相关显示
    function updatePointPosition(x, y) {
        // 确保点在单位圆上（归一化）
        const distance = Math.sqrt(x*x + y*y);
        if (distance !== 0) {
            x = x / distance;
            y = y / distance;
        }
        
        // 翻转y坐标，因为SVG的y轴是向下的
        const svgY = -y;
        
        // 缩放到圆的实际大小
        const svgX = x * RADIUS;
        const svgYscaled = svgY * RADIUS;
        
        // 更新可拖动点的位置
        dragPoint.setAttribute("cx", svgX);
        dragPoint.setAttribute("cy", svgYscaled);
        
        // 更新从原点到点的线
        hypotenuse.setAttribute("x2", svgX);
        hypotenuse.setAttribute("y2", svgYscaled);
        
        // 更新投影线
        xProjection.setAttribute("x1", svgX);
        xProjection.setAttribute("y1", 0);
        xProjection.setAttribute("x2", svgX);
        xProjection.setAttribute("y2", svgYscaled);
        
        yProjection.setAttribute("x1", 0);
        yProjection.setAttribute("y1", svgYscaled);
        yProjection.setAttribute("x2", svgX);
        yProjection.setAttribute("y2", svgYscaled);
        
        // 更新坐标线
        xLine.setAttribute("x1", 0);
        xLine.setAttribute("y1", 0);
        xLine.setAttribute("x2", svgX);
        xLine.setAttribute("y2", 0);
        
        yLine.setAttribute("x1", svgX);
        yLine.setAttribute("y1", 0);
        yLine.setAttribute("x2", svgX);
        yLine.setAttribute("y2", svgYscaled);
        
        // 计算角度（弧度和角度）
        let angleRad = Math.atan2(y, x);
        if (angleRad < 0) {
            angleRad += 2 * Math.PI; // 角度范围调整到 [0, 2π)
        }
        const angleDeg = (angleRad * 180 / Math.PI).toFixed(0);
        
        // 更新角度弧
        const arcLargeFlag = angleRad > Math.PI ? 1 : 0;
        const arcPath = `M 0 0 L ${RADIUS * 0.3} 0 A ${RADIUS * 0.3} ${RADIUS * 0.3} 0 ${arcLargeFlag} 0 ${RADIUS * 0.3 * Math.cos(angleRad)} ${-RADIUS * 0.3 * Math.sin(angleRad)} Z`;
        angleArc.setAttribute("d", arcPath);
        
        // 更新角度标签位置
        const labelRadius = RADIUS * 0.4;
        const midAngle = angleRad / 2;
        angleLabel.setAttribute("x", labelRadius * Math.cos(midAngle));
        angleLabel.setAttribute("y", -labelRadius * Math.sin(midAngle));
        angleLabel.textContent = `${angleDeg}°`;
        
        // 更新坐标标签
        xLabel.setAttribute("x", svgX / 2);
        xLabel.setAttribute("y", 20);
        xLabel.textContent = `cos(θ) = ${x.toFixed(2)}`;
        
        yLabel.setAttribute("x", svgX + 5);
        yLabel.setAttribute("y", svgYscaled / 2);
        yLabel.textContent = `sin(θ) = ${y.toFixed(2)}`;
        
        // 更新信息面板
        coordinatesSpan.textContent = `(${x.toFixed(2)}, ${y.toFixed(2)})`;
        angleSpan.textContent = `${angleDeg}° (${(angleRad).toFixed(2)} rad)`;
        cosValueSpan.textContent = x.toFixed(2);
        sinValueSpan.textContent = y.toFixed(2);
        
        // 计算正切值 (处理除以零的情况)
        let tanValue = x !== 0 ? y / x : (y > 0 ? Infinity : -Infinity);
        tanValueSpan.textContent = tanValue === Infinity ? "∞" : 
                                  tanValue === -Infinity ? "-∞" : 
                                  tanValue.toFixed(2);
    }
    
    // 开始动画
    function startAnimation() {
        isAnimating = true;
        let angle = 0;
        
        function animate() {
            // 计算位置
            const x = Math.cos(angle);
            const y = Math.sin(angle);
            
            // 更新点的位置
            updatePointPosition(x, y);
            
            // 增加角度
            angle += 0.02;
            if (angle >= 2 * Math.PI) {
                angle = 0;
            }
            
            // 继续动画
            animationId = requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    // 停止动画
    function stopAnimation() {
        if (isAnimating) {
            isAnimating = false;
            cancelAnimationFrame(animationId);
            animateCircleBtn.textContent = "动画演示";
            animationId = null;
        }
    }
    
    // 挑战模式
    const quizContainer = document.getElementById('quiz-container');
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizFeedback = document.getElementById('quiz-feedback');
    
    let currentQuizQuestion = null;
    let quizScore = 0;
    let quizTotal = 0;
    
    // 题目数据库
    const quizQuestions = [
        {
            question: "单位圆上的点在角度为90°时，其坐标是多少？",
            options: ["(1, 0)", "(0, 1)", "(-1, 0)", "(0, -1)"],
            answer: 1
        },
        {
            question: "sin(60°)等于多少？",
            options: ["0.5", "0.866", "1", "0"],
            answer: 1
        },
        {
            question: "cos(180°)等于多少？",
            options: ["0", "1", "-1", "0.5"],
            answer: 2
        },
        {
            question: "当角度为45°时，sin(θ)和cos(θ)的关系是？",
            options: ["sin(θ) > cos(θ)", "sin(θ) < cos(θ)", "sin(θ) = cos(θ)", "sin(θ) = -cos(θ)"],
            answer: 2
        },
        {
            question: "在第三象限（180°到270°之间），sin(θ)和cos(θ)的符号分别是？",
            options: ["正，正", "正，负", "负，正", "负，负"],
            answer: 3
        },
        {
            question: "tan(θ)在哪些角度下是未定义的？",
            options: ["0°和180°", "90°和270°", "45°和225°", "60°和240°"],
            answer: 1
        }
    ];
    
    // 开始挑战
    function startChallenge() {
        quizContainer.style.display = 'block';
        quizScore = 0;
        quizTotal = 0;
        presentNextQuestion();
        startChallengeBtn.textContent = "重新挑战";
    }
    
    // 呈现下一个问题
    function presentNextQuestion() {
        // 随机选择问题
        const randomIndex = Math.floor(Math.random() * quizQuestions.length);
        currentQuizQuestion = quizQuestions[randomIndex];
        
        // 显示问题
        quizQuestion.textContent = currentQuizQuestion.question;
        
        // 清除上一次的选项和反馈
        quizOptions.innerHTML = '';
        quizFeedback.textContent = '';
        quizFeedback.className = 'feedback';
        
        // 添加选项
        currentQuizQuestion.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.className = 'option-btn';
            optionButton.textContent = option;
            optionButton.dataset.index = index;
            
            optionButton.addEventListener('click', function() {
                checkAnswer(index);
            });
            
            quizOptions.appendChild(optionButton);
        });
    }
    
    // 检查答案
    function checkAnswer(selectedIndex) {
        quizTotal++;
        
        // 禁用所有选项按钮
        const optionButtons = quizOptions.querySelectorAll('.option-btn');
        optionButtons.forEach(button => {
            button.disabled = true;
        });
        
        // 高亮正确答案
        optionButtons[currentQuizQuestion.answer].classList.add('correct');
        
        // 如果选择错误，高亮所选答案
        if (selectedIndex !== currentQuizQuestion.answer) {
            optionButtons[selectedIndex].classList.add('incorrect');
            quizFeedback.textContent = "回答错误！请重试。";
            quizFeedback.className = 'feedback incorrect';
        } else {
            quizScore++;
            quizFeedback.textContent = "回答正确！";
            quizFeedback.className = 'feedback correct';
        }
        
        // 更新评分
        quizFeedback.textContent += ` 当前得分: ${quizScore}/${quizTotal}`;
        
        // 延迟后显示下一个问题
        setTimeout(presentNextQuestion, 2000);
    }
    
    // 初始化应用
    init();
});