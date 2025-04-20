document.addEventListener('DOMContentLoaded', function() {
    // 获取SVG元素
    const svgCanvas = document.getElementById('unit-circle-canvas');
    
    // 定义常量和变量
    const SVG_NS = "http://www.w3.org/2000/svg";
    const CENTER_X = 0;
    const CENTER_Y = 0;
    const RADIUS = 180;
    let dragPoint = { x: RADIUS, y: 0 };
    let angle = 0;
    let showXProjection = true;
    let showYProjection = true;
    let quizMode = false;
    
    // 初始化SVG元素
    function initializeSVG() {
        // 创建坐标轴
        createAxes();
        
        // 创建网格线
        createGridLines();
        
        // 创建单位圆
        createUnitCircle();
        
        // 创建拖动点及相关元素
        createDragPoint();
        
        // 创建特殊角度标记
        createSpecialAngleMarkers();
        
        // 初始化显示信息
        updateInfo();
    }
    
    // 创建坐标轴
    function createAxes() {
        // X轴
        createSVGElement('line', {
            x1: -240, y1: 0, 
            x2: 240, y2: 0, 
            class: 'x-axis'
        });
        
        // Y轴
        createSVGElement('line', {
            x1: 0, y1: -240, 
            x2: 0, y2: 240, 
            class: 'y-axis'
        });
        
        // 坐标轴标签
        createSVGElement('text', {
            x: 235, y: -10, 
            class: 'axis-label',
            textContent: 'x'
        });
        
        createSVGElement('text', {
            x: 10, y: -235, 
            class: 'axis-label',
            textContent: 'y'
        });
    }
    
    // 创建网格线
    function createGridLines() {
        // 主要刻度
        for (let i = -2; i <= 2; i++) {
            if (i === 0) continue; // 跳过原点
            
            // X轴刻度
            createSVGElement('line', {
                x1: i * 90, y1: -5, 
                x2: i * 90, y2: 5, 
                class: 'grid-line major'
            });
            
            createSVGElement('text', {
                x: i * 90, 
                y: 20, 
                class: 'coordinate-label',
                textContent: i
            });
            
            // Y轴刻度
            createSVGElement('line', {
                x1: -5, y1: i * 90, 
                x2: 5, y2: i * 90, 
                class: 'grid-line major'
            });
            
            createSVGElement('text', {
                x: -20, 
                y: i * 90 + 5, 
                class: 'coordinate-label',
                textContent: -i
            });
        }
        
        // 次要刻度
        for (let i = -4; i <= 4; i++) {
            if (i % 2 === 0) continue; // 跳过主要刻度
            
            // X轴刻度
            createSVGElement('line', {
                x1: i * 45, y1: -3, 
                x2: i * 45, y2: 3, 
                class: 'grid-line minor'
            });
            
            // Y轴刻度
            createSVGElement('line', {
                x1: -3, y1: i * 45, 
                x2: 3, y2: i * 45, 
                class: 'grid-line minor'
            });
        }
    }
    
    // 创建单位圆
    function createUnitCircle() {
        createSVGElement('circle', {
            cx: CENTER_X, 
            cy: CENTER_Y, 
            r: RADIUS, 
            class: 'unit-circle'
        });
    }
    
    // 创建拖动点及相关元素
    function createDragPoint() {
        // X轴投影线
        window.xProjectionLine = createSVGElement('line', {
            x1: dragPoint.x, 
            y1: dragPoint.y, 
            x2: dragPoint.x, 
            y2: 0, 
            class: 'projection-line x-projection'
        });
        
        // Y轴投影线
        window.yProjectionLine = createSVGElement('line', {
            x1: dragPoint.x, 
            y1: dragPoint.y, 
            x2: 0, 
            y2: dragPoint.y, 
            class: 'projection-line y-projection'
        });
        
        // 径向线段
        window.radiusLine = createSVGElement('line', {
            x1: CENTER_X, 
            y1: CENTER_Y, 
            x2: dragPoint.x, 
            y2: dragPoint.y, 
            class: 'radius-line'
        });
        
        // 角度弧
        window.angleArc = createSVGElement('path', {
            d: describeArc(CENTER_X, CENTER_Y, 40, 0, angle),
            class: 'angle-arc'
        });
        
        // 拖动点
        window.dragPointElement = createSVGElement('circle', {
            cx: dragPoint.x, 
            cy: dragPoint.y, 
            r: 8, 
            class: 'drag-point'
        });
        
        // 添加拖动点的事件处理
        setupDragEvents(window.dragPointElement);
    }
    
    // 创建特殊角度标记
    function createSpecialAngleMarkers() {
        const specialAngles = [
            { angle: 0, label: "0°" },
            { angle: 30, label: "30°" },
            { angle: 45, label: "45°" },
            { angle: 60, label: "60°" },
            { angle: 90, label: "90°" },
            { angle: 120, label: "120°" },
            { angle: 135, label: "135°" },
            { angle: 150, label: "150°" },
            { angle: 180, label: "180°" },
            { angle: 210, label: "210°" },
            { angle: 225, label: "225°" },
            { angle: 240, label: "240°" },
            { angle: 270, label: "270°" },
            { angle: 300, label: "300°" },
            { angle: 315, label: "315°" },
            { angle: 330, label: "330°" }
        ];
        
        specialAngles.forEach(item => {
            const radians = item.angle * (Math.PI / 180);
            const x = CENTER_X + Math.cos(radians) * (RADIUS + 20);
            const y = CENTER_Y - Math.sin(radians) * (RADIUS + 20);
            
            createSVGElement('text', {
                x: x,
                y: y,
                class: 'special-angle-marker',
                'data-angle': item.angle,
                textContent: item.label
            });
            
            // 为特殊角度标记添加点击事件
            let marker = svgCanvas.lastElementChild;
            marker.addEventListener('click', function() {
                if (quizMode) return; // 在quiz模式下禁用点击
                const clickedAngle = parseInt(this.getAttribute('data-angle'));
                setAngle(clickedAngle);
            });
        });
    }
    
    // 设置拖动事件
    function setupDragEvents(element) {
        let isDragging = false;
        
        element.addEventListener('mousedown', startDrag);
        element.addEventListener('touchstart', startDrag);
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag);
        
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
        
        function startDrag(e) {
            if (quizMode) return; // 在quiz模式下禁用拖动
            isDragging = true;
            e.preventDefault();
        }
        
        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            // 获取鼠标相对于SVG的坐标
            const svgRect = svgCanvas.getBoundingClientRect();
            const svgWidth = svgRect.width;
            const svgHeight = svgRect.height;
            
            let clientX, clientY;
            if (e.type === 'touchmove') {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            
            // 将视口坐标转换为SVG坐标系
            const viewportX = clientX - svgRect.left;
            const viewportY = clientY - svgRect.top;
            
            // 将视口坐标转换为SVG坐标系（考虑viewBox）
            const svgX = (viewportX / svgWidth * 500) - 250;
            const svgY = (viewportY / svgHeight * 500) - 250;
            
            // 计算点到原点的距离
            const distance = Math.sqrt(svgX * svgX + svgY * svgY);
            
            // 将点约束到圆上
            const scale = RADIUS / distance;
            dragPoint.x = svgX * scale;
            dragPoint.y = svgY * scale;
            
            // 更新界面
            updatePointPosition();
        }
        
        function endDrag() {
            isDragging = false;
        }
    }
    
    // 更新点的位置及相关元素
    function updatePointPosition() {
        // 更新角度
        const dx = dragPoint.x - CENTER_X;
        const dy = CENTER_Y - dragPoint.y; // 注意SVG的Y轴是向下的，所以需要取反
        angle = Math.atan2(dy, dx) * 180 / Math.PI;
        if (angle < 0) angle += 360;
        
        // 更新拖动点位置
        window.dragPointElement.setAttribute('cx', dragPoint.x);
        window.dragPointElement.setAttribute('cy', dragPoint.y);
        
        // 更新径向线段
        window.radiusLine.setAttribute('x2', dragPoint.x);
        window.radiusLine.setAttribute('y2', dragPoint.y);
        
        // 更新X轴投影线
        window.xProjectionLine.setAttribute('x1', dragPoint.x);
        window.xProjectionLine.setAttribute('y1', dragPoint.y);
        window.xProjectionLine.setAttribute('x2', dragPoint.x);
        window.xProjectionLine.setAttribute('visibility', showXProjection ? 'visible' : 'hidden');
        
        // 更新Y轴投影线
        window.yProjectionLine.setAttribute('x1', dragPoint.x);
        window.yProjectionLine.setAttribute('y1', dragPoint.y);
        window.yProjectionLine.setAttribute('y2', dragPoint.y);
        window.yProjectionLine.setAttribute('visibility', showYProjection ? 'visible' : 'hidden');
        
        // 更新角度弧
        window.angleArc.setAttribute('d', describeArc(CENTER_X, CENTER_Y, 40, 0, angle));
        
        // 更新信息显示
        updateInfo();
    }
    
    // 更新信息面板
    function updateInfo() {
        // 计算单位圆上的实际坐标（-1到1之间）
        const unitX = dragPoint.x / RADIUS;
        const unitY = -dragPoint.y / RADIUS; // 注意SVG的Y轴是向下的，所以取反
        
        // 计算三角函数值
        const sinValue = Math.sin(angle * Math.PI / 180);
        const cosValue = Math.cos(angle * Math.PI / 180);
        const tanValue = Math.tan(angle * Math.PI / 180);
        
        // 更新显示
        document.getElementById('coordinate-info').textContent = 
            `(${unitX.toFixed(2)}, ${unitY.toFixed(2)})`;
        document.getElementById('angle-info').textContent = 
            `${Math.round(angle)}°`;
        document.getElementById('radian-info').textContent = 
            `${(angle * Math.PI / 180).toFixed(2)} rad`;
        document.getElementById('sin-info').textContent = 
            `${sinValue.toFixed(2)}`;
        document.getElementById('cos-info').textContent = 
            `${cosValue.toFixed(2)}`;
        document.getElementById('tan-info').textContent = 
            Math.abs(cosValue) < 0.001 ? '无穷大' : `${tanValue.toFixed(2)}`;
    }
    
    // 设置点到特定角度
    function setAngle(degrees) {
        // 计算弧度
        const radians = degrees * Math.PI / 180;
        
        // 计算新的坐标
        dragPoint.x = CENTER_X + Math.cos(radians) * RADIUS;
        dragPoint.y = CENTER_Y - Math.sin(radians) * RADIUS; // 注意SVG的Y轴是向下的
        
        // 更新界面
        updatePointPosition();
    }
    
    // 生成角度弧的SVG路径
    function describeArc(x, y, radius, startAngle, endAngle) {
        startAngle = startAngle * Math.PI / 180;
        endAngle = endAngle * Math.PI / 180;
        
        const start = {
            x: x + radius * Math.cos(startAngle),
            y: y - radius * Math.sin(startAngle) // 注意SVG的Y轴是向下的
        };
        
        const end = {
            x: x + radius * Math.cos(endAngle),
            y: y - radius * Math.sin(endAngle)
        };
        
        const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;
        
        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
    }
    
    // 创建并添加SVG元素的辅助函数
    function createSVGElement(type, attributes) {
        const element = document.createElementNS(SVG_NS, type);
        
        for (const key in attributes) {
            if (key === 'textContent') {
                element.textContent = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        }
        
        svgCanvas.appendChild(element);
        return element;
    }
    
    // 初始化按钮事件
    function initializeButtonEvents() {
        // 切换X轴投影
        document.getElementById('toggle-x-projection').addEventListener('click', function() {
            showXProjection = !showXProjection;
            updatePointPosition();
        });
        
        // 切换Y轴投影
        document.getElementById('toggle-y-projection').addEventListener('click', function() {
            showYProjection = !showYProjection;
            updatePointPosition();
        });
        
        // 重置位置
        document.getElementById('reset-point').addEventListener('click', function() {
            if (quizMode) return; // 在quiz模式下禁用
            setAngle(0);
        });
        
        // 特殊角度按钮
        document.getElementById('special-angles').addEventListener('click', function() {
            if (quizMode) return; // 在quiz模式下禁用
            
            // 创建特殊角度弹出菜单
            const specialAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
            let menu = document.getElementById('special-angles-menu');
            
            if (menu) {
                menu.remove();
                return;
            }
            
            menu = document.createElement('div');
            menu.id = 'special-angles-menu';
            menu.className = 'special-angles-menu';
            
            specialAngles.forEach(angle => {
                const button = document.createElement('button');
                button.textContent = `${angle}°`;
                button.addEventListener('click', function() {
                    setAngle(angle);
                    menu.remove();
                });
                menu.appendChild(button);
            });
            
            document.querySelector('.controls').appendChild(menu);
            
            // 点击外部关闭菜单
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && e.target.id !== 'special-angles') {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        });
        
        // 开始挑战按钮
        document.getElementById('start-challenge').addEventListener('click', function() {
            toggleQuizMode();
        });
        
        // 下一题按钮
        document.getElementById('next-question').addEventListener('click', function() {
            if (quizMode) {
                generateQuestion();
            }
        });
    }
    
    // 切换测验模式
    function toggleQuizMode() {
        quizMode = !quizMode;
        
        const quizContainer = document.getElementById('quiz-container');
        const startButton = document.getElementById('start-challenge');
        
        if (quizMode) {
            quizContainer.style.display = 'block';
            startButton.textContent = '结束挑战';
            generateQuestion();
        } else {
            quizContainer.style.display = 'none';
            startButton.textContent = '开始挑战';
            document.getElementById('quiz-feedback').textContent = '';
            setAngle(0); // 重置点位置
        }
    }
    
    // 生成测验问题
    function generateQuestion() {
        const questionTypes = [
            'findAngle',
            'findCoordinate',
            'findSin',
            'findCos',
            'findTan'
        ];
        
        const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        const specialAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
        const randomAngle = specialAngles[Math.floor(Math.random() * specialAngles.length)];
        
        // 设置点到随机角度
        setAngle(randomAngle);
        
        const questionElement = document.getElementById('quiz-question');
        const optionsElement = document.getElementById('quiz-options');
        const feedbackElement = document.getElementById('quiz-feedback');
        
        // 清空之前内容
        optionsElement.innerHTML = '';
        feedbackElement.textContent = '';
        
        // 准备问题
        switch (questionType) {
            case 'findAngle':
                questionElement.textContent = '单位圆上红点当前的角度θ是多少？';
                createOptions(randomAngle, 'angle');
                break;
                
            case 'findCoordinate':
                questionElement.textContent = '单位圆上红点当前的坐标(x,y)是什么？';
                createOptions(randomAngle, 'coordinate');
                break;
                
            case 'findSin':
                questionElement.textContent = '当前角度θ的sin(θ)值是多少？';
                createOptions(randomAngle, 'sin');
                break;
                
            case 'findCos':
                questionElement.textContent = '当前角度θ的cos(θ)值是多少？';
                createOptions(randomAngle, 'cos');
                break;
                
            case 'findTan':
                questionElement.textContent = '当前角度θ的tan(θ)值是多少？';
                createOptions(randomAngle, 'tan');
                break;
        }
    }
    
    // 创建选项
    function createOptions(correctAngle, questionType) {
        const radians = correctAngle * Math.PI / 180;
        let correctAnswer, options = [];
        
        const sinValue = Math.sin(radians);
        const cosValue = Math.cos(radians);
        const tanValue = Math.tan(radians);
        
        switch (questionType) {
            case 'angle':
                correctAnswer = `${correctAngle}°`;
                options = [
                    `${correctAngle}°`,
                    `${(correctAngle + 45) % 360}°`,
                    `${(correctAngle + 90) % 360}°`,
                    `${(correctAngle + 180) % 360}°`
                ];
                break;
                
            case 'coordinate':
                correctAnswer = `(${cosValue.toFixed(2)}, ${sinValue.toFixed(2)})`;
                options = [
                    `(${cosValue.toFixed(2)}, ${sinValue.toFixed(2)})`,
                    `(${sinValue.toFixed(2)}, ${cosValue.toFixed(2)})`,
                    `(${(-cosValue).toFixed(2)}, ${sinValue.toFixed(2)})`,
                    `(${cosValue.toFixed(2)}, ${(-sinValue).toFixed(2)})`
                ];
                break;
                
            case 'sin':
                correctAnswer = `${sinValue.toFixed(2)}`;
                options = [
                    `${sinValue.toFixed(2)}`,
                    `${cosValue.toFixed(2)}`,
                    `${(-sinValue).toFixed(2)}`,
                    `${(sinValue/2).toFixed(2)}`
                ];
                break;
                
            case 'cos':
                correctAnswer = `${cosValue.toFixed(2)}`;
                options = [
                    `${cosValue.toFixed(2)}`,
                    `${sinValue.toFixed(2)}`,
                    `${(-cosValue).toFixed(2)}`,
                    `${(cosValue/2).toFixed(2)}`
                ];
                break;
                
            case 'tan':
                if (Math.abs(cosValue) < 0.001) {
                    correctAnswer = '无穷大';
                    options = ['无穷大', '0', '1', '-1'];
                } else {
                    correctAnswer = `${tanValue.toFixed(2)}`;
                    options = [
                        `${tanValue.toFixed(2)}`,
                        `${(1/tanValue).toFixed(2)}`,
                        `${(-tanValue).toFixed(2)}`,
                        `${(tanValue*2).toFixed(2)}`
                    ];
                }
                break;
        }
        
        // 打乱选项顺序
        options = shuffleArray(options);
        
        const optionsElement = document.getElementById('quiz-options');
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.textContent = option;
            
            button.addEventListener('click', function() {
                const allButtons = document.querySelectorAll('.quiz-option');
                allButtons.forEach(btn => {
                    btn.disabled = true;
                    if (btn.textContent === correctAnswer) {
                        btn.classList.add('correct');
                    } else {
                        btn.classList.add('incorrect');
                    }
                });
                
                const feedbackElement = document.getElementById('quiz-feedback');
                if (option === correctAnswer) {
                    feedbackElement.textContent = '回答正确！';
                    feedbackElement.className = 'feedback correct';
                } else {
                    feedbackElement.textContent = `回答错误！正确答案是：${correctAnswer}`;
                    feedbackElement.className = 'feedback incorrect';
                }
            });
            
            optionsElement.appendChild(button);
        });
    }
    
    // 数组打乱顺序
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // 初始化
    initializeSVG();
    initializeButtonEvents();
    
    // 隐藏测验容器
    document.getElementById('quiz-container').style.display = 'none';
});