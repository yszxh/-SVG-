document.addEventListener('DOMContentLoaded', function() {
    // 获取SVG和拖动点元素
    const svg = document.getElementById('unit-circle-canvas');
    const dragPoint = document.getElementById('drag-point');
    const angleArc = document.getElementById('angle-arc');
    const hypotenuse = document.getElementById('hypotenuse');
    const xLine = document.getElementById('x-line');
    const yLine = document.getElementById('y-line');
    const xProjection = document.getElementById('x-projection');
    const yProjection = document.getElementById('y-projection');
    const xLabel = document.getElementById('x-label');
    const yLabel = document.getElementById('y-label');
    const angleLabel = document.getElementById('angle-label');
    
    // 获取信息显示元素
    const angleValue = document.getElementById('angle-value');
    const xValue = document.getElementById('x-value');
    const yValue = document.getElementById('y-value');
    
    // 获取控制按钮
    const showProjectionsBtn = document.getElementById('show-projections');
    const resetPointBtn = document.getElementById('reset-point');
    const animatePointBtn = document.getElementById('animate-point');
    const coordsChallengeBtn = document.getElementById('coords-challenge-btn');
    const angleQuizBtn = document.getElementById('angle-quiz-btn');
    
    // 获取挑战和测验容器
    const coordsChallenge = document.getElementById('coords-challenge');
    const angleQuiz = document.getElementById('angle-quiz');
    const targetCoords = document.getElementById('target-coords');
    const targetAngleHint = document.getElementById('target-angle-hint');
    const coordsFeedback = document.getElementById('coords-feedback');
    const quizCoords = document.getElementById('quiz-coords');
    const quizOptions = document.getElementById('quiz-options');
    const quizFeedback = document.getElementById('quiz-feedback');
    
    // 单位圆半径（SVG坐标系下）
    const radius = 100;
    
    // 是否正在拖动
    let isDragging = false;
    
    // 动画ID
    let animationId = null;
    
    // 投影显示状态
    let showProjections = false;
    
    // 当前坐标和角度
    let currentX = 1;
    let currentY = 0;
    let currentAngle = 0;
    
    // 挑战目标
    let targetX = 0;
    let targetY = 0;
    let targetAngleDeg = 0;
    let challengeActive = false;
    
    // 初始化
    updatePoint(radius, 0);
    
    // =====================
    // 事件处理函数
    // =====================
    
    // 开始拖动
    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        svg.addEventListener('mousemove', drag);
        svg.addEventListener('mouseup', endDrag);
        svg.addEventListener('mouseleave', endDrag);
    }
    
    // 触摸开始事件
    function startTouchDrag(e) {
        e.preventDefault();
        isDragging = true;
        svg.addEventListener('touchmove', touchDrag);
        svg.addEventListener('touchend', endTouchDrag);
        svg.addEventListener('touchcancel', endTouchDrag);
    }
    
    // 拖动
    function drag(e) {
        if (!isDragging) return;
        
        const svgRect = svg.getBoundingClientRect();
        const svgWidth = svgRect.width;
        const svgHeight = svgRect.height;
        
        // 鼠标相对于SVG的位置
        const mouseX = e.clientX - svgRect.left;
        const mouseY = e.clientY - svgRect.top;
        
        // 转换为SVG坐标系（中心为原点）
        const svgX = (mouseX / svgWidth) * 220 - 110;
        const svgY = (mouseY / svgHeight) * 220 - 110;
        
        // 计算点到原点的距离
        const distance = Math.sqrt(svgX * svgX + svgY * svgY);
        
        // 计算归一化的坐标（点在单位圆上）
        const normalizedX = svgX / distance;
        const normalizedY = svgY / distance;
        
        // 更新点的位置
        updatePoint(normalizedX * radius, normalizedY * radius);
        
        // 如果有活跃的坐标挑战，检查是否命中目标
        if (challengeActive) {
            checkChallengeSuccess();
        }
    }
    
    // 触摸拖动
    function touchDrag(e) {
        if (!isDragging || !e.touches[0]) return;
        
        const touch = e.touches[0];
        const svgRect = svg.getBoundingClientRect();
        const svgWidth = svgRect.width;
        const svgHeight = svgRect.height;
        
        // 触摸相对于SVG的位置
        const touchX = touch.clientX - svgRect.left;
        const touchY = touch.clientY - svgRect.top;
        
        // 转换为SVG坐标系（中心为原点）
        const svgX = (touchX / svgWidth) * 220 - 110;
        const svgY = (touchY / svgHeight) * 220 - 110;
        
        // 计算点到原点的距离
        const distance = Math.sqrt(svgX * svgX + svgY * svgY);
        
        // 计算归一化的坐标（点在单位圆上）
        const normalizedX = svgX / distance;
        const normalizedY = svgY / distance;
        
        // 更新点的位置
        updatePoint(normalizedX * radius, normalizedY * radius);
        
        // 如果有活跃的坐标挑战，检查是否命中目标
        if (challengeActive) {
            checkChallengeSuccess();
        }
    }
    
    // 结束拖动
    function endDrag() {
        isDragging = false;
        svg.removeEventListener('mousemove', drag);
        svg.removeEventListener('mouseup', endDrag);
        svg.removeEventListener('mouseleave', endDrag);
    }
    
    // 结束触摸拖动
    function endTouchDrag() {
        isDragging = false;
        svg.removeEventListener('touchmove', touchDrag);
        svg.removeEventListener('touchend', endTouchDrag);
        svg.removeEventListener('touchcancel', endTouchDrag);
    }
    
    // =====================
    // 更新函数
    // =====================
    
    // 更新点的位置和相关元素
    function updatePoint(x, y) {
        // 设置拖动点的位置
        dragPoint.setAttribute('cx', x);
        dragPoint.setAttribute('cy', y);
        
        // 更新三角形
        xLine.setAttribute('x2', x);
        yLine.setAttribute('x1', x);
        yLine.setAttribute('y1', 0);
        yLine.setAttribute('x2', x);
        yLine.setAttribute('y2', y);
        hypotenuse.setAttribute('x2', x);
        hypotenuse.setAttribute('y2', y);
        
        // 更新投影线
        xProjection.setAttribute('x1', 0);
        xProjection.setAttribute('y1', y);
        xProjection.setAttribute('x2', x);
        xProjection.setAttribute('y2', y);
        
        yProjection.setAttribute('x1', x);
        yProjection.setAttribute('y1', 0);
        yProjection.setAttribute('x2', x);
        yProjection.setAttribute('y2', y);
        
        // 计算角度（弧度和角度）
        const angle = Math.atan2(y, x);
        const degrees = (angle * 180 / Math.PI + 360) % 360;
        
        // 更新角度弧线
        let largeArcFlag = angle > 0 && angle < Math.PI ? 0 : 1;
        if (angle > Math.PI || angle < 0) {
            largeArcFlag = 0;
        }
        angleArc.setAttribute('d', `M ${radius} 0 A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x} ${y}`);
        
        // 计算归一化坐标（x和y值介于-1和1之间）
        currentX = x / radius;
        currentY = -y / radius; // 注意这里取反，因为SVG的y轴向下是正方向
        currentAngle = degrees;
        
        // 更新标签显示
        xLabel.textContent = `x = cos(θ) = ${currentX.toFixed(2)}`;
        yLabel.textContent = `y = sin(θ) = ${(-currentY).toFixed(2)}`;
        angleLabel.textContent = `θ = ${degrees.toFixed(0)}°`;
        
        // 更新信息框
        angleValue.textContent = `${degrees.toFixed(0)}°`;
        xValue.textContent = currentX.toFixed(2);
        yValue.textContent = (-currentY).toFixed(2);
    }
    
    // =====================
    // 控制按钮功能
    // =====================
    
    // 显示/隐藏投影线
    showProjectionsBtn.addEventListener('click', function() {
        showProjections = !showProjections;
        xProjection.setAttribute('display', showProjections ? 'inline' : 'none');
        yProjection.setAttribute('display', showProjections ? 'inline' : 'none');
        
        this.textContent = showProjections ? '隐藏垂线投影' : '显示垂线投影';
    });
    
    // 重置点到初始位置
    resetPointBtn.addEventListener('click', function() {
        stopAnimation(); // 如果有动画正在进行，先停止
        updatePoint(radius, 0);
        
        // 如果有活跃的挑战，重置状态
        if (challengeActive) {
            coordsFeedback.style.display = 'none';
        }
    });
    
    // 动画演示
    animatePointBtn.addEventListener('click', function() {
        if (animationId !== null) {
            stopAnimation();
            return;
        }
        
        let startTime = null;
        const duration = 10000; // 动画持续时间（毫秒）
        
        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = (elapsed % duration) / duration;
            
            // 计算角度（0到2π）
            const angle = progress * 2 * Math.PI;
            
            // 计算坐标
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            // 更新点的位置
            updatePoint(x, y);
            
            // 继续动画
            animationId = requestAnimationFrame(animate);
        }
        
        this.textContent = '停止动画';
        animationId = requestAnimationFrame(animate);
    });
    
    // 停止动画函数
    function stopAnimation() {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
            animatePointBtn.textContent = '动画演示';
        }
    }
    
    // =====================
    // 挑战和测验功能
    // =====================
    
    // 坐标挑战
    coordsChallengeBtn.addEventListener('click', function() {
        // 先隐藏角度测验
        angleQuiz.style.display = 'none';
        
        // 切换坐标挑战的显示状态
        const isVisible = coordsChallenge.style.display !== 'none';
        coordsChallenge.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            // 随机生成目标坐标
            generateRandomTarget();
            challengeActive = true;
            coordsFeedback.style.display = 'none';
        } else {
            challengeActive = false;
        }
    });
    
    // 角度测验
    angleQuizBtn.addEventListener('click', function() {
        // 先隐藏坐标挑战
        coordsChallenge.style.display = 'none';
        challengeActive = false;
        
        // 切换角度测验的显示状态
        const isVisible = angleQuiz.style.display !== 'none';
        angleQuiz.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            // 生成随机坐标和对应的角度问题
            generateRandomAngleQuiz();
        }
    });
    
    // 生成随机目标
    function generateRandomTarget() {
        // 生成随机角度（0到360度）
        targetAngleDeg = Math.floor(Math.random() * 360);
        const targetAngleRad = targetAngleDeg * Math.PI / 180;
        
        // 计算目标坐标
        targetX = Math.cos(targetAngleRad);
        targetY = Math.sin(targetAngleRad);
        
        // 更新显示
        targetCoords.textContent = `(${targetX.toFixed(2)}, ${targetY.toFixed(2)})`;
        
        // 提供角度提示
        if (targetAngleDeg % 90 === 0) {
            // 主要角度：0, 90, 180, 270
            targetAngleHint.textContent = `${targetAngleDeg}°`;
        } else if (targetAngleDeg % 45 === 0) {
            // 45度的倍数：45, 135, 225, 315
            targetAngleHint.textContent = `${targetAngleDeg}°`;
        } else if (targetAngleDeg % 30 === 0) {
            // 30度的倍数：30, 60, 120, 150, 210, 240, 300, 330
            targetAngleHint.textContent = `${targetAngleDeg}°`;
        } else {
            // 其他角度仅给出大致范围
            const lowerBound = Math.floor(targetAngleDeg / 10) * 10;
            const upperBound = lowerBound + 10;
            targetAngleHint.textContent = `${lowerBound}°-${upperBound}°之间`;
        }
    }
    
    // 检查挑战是否成功
    function checkChallengeSuccess() {
        // 计算当前坐标与目标坐标之间的距离
        const distance = Math.sqrt(
            Math.pow(currentX - targetX, 2) + 
            Math.pow(-currentY - targetY, 2)
        );
        
        // 如果距离小于阈值，则视为成功
        if (distance < 0.1) {
            coordsFeedback.style.display = 'block';
            coordsFeedback.textContent = '做得好！您已成功将点移动到目标坐标。';
            coordsFeedback.style.color = 'var(--success-color)';
            
            // 延迟后生成新的目标
            setTimeout(function() {
                generateRandomTarget();
                coordsFeedback.style.display = 'none';
            }, 2000);
        }
    }
    
    // 生成随机角度测验
    function generateRandomAngleQuiz() {
        // 清除旧的选项
        quizOptions.innerHTML = '';
        quizFeedback.style.display = 'none';
        
        // 特殊角度选择列表
        const specialAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
        
        // 随机选一个特殊角度
        const correctIndex = Math.floor(Math.random() * specialAngles.length);
        const correctAngle = specialAngles[correctIndex];
        const angleRad = correctAngle * Math.PI / 180;
        
        // 计算对应坐标
        const coordX = Math.cos(angleRad).toFixed(3);
        const coordY = Math.sin(angleRad).toFixed(3);
        
        // 更新问题显示
        quizCoords.textContent = `(${coordX}, ${coordY})`;
        
        // 生成4个选项（包括正确答案）
        const options = [correctAngle];
        
        // 添加3个不同的干扰选项
        while (options.length < 4) {
            // 随机选择一个特殊角度
            const randomAngle = specialAngles[Math.floor(Math.random() * specialAngles.length)];
            
            // 确保不重复
            if (!options.includes(randomAngle)) {
                options.push(randomAngle);
            }
        }
        
        // 打乱选项顺序
        options.sort(() => Math.random() - 0.5);
        
        // 创建选项元素
        options.forEach(angle => {
            const option = document.createElement('div');
            option.className = 'quiz-option';
            option.textContent = `${angle}°`;
            option.dataset.angle = angle;
            
            option.addEventListener('click', function() {
                // 移除其他选项上的类
                document.querySelectorAll('.quiz-option').forEach(opt => {
                    opt.classList.remove('correct', 'incorrect');
                });
                
                // 检查答案
                if (parseInt(this.dataset.angle) === correctAngle) {
                    this.classList.add('correct');
                    quizFeedback.style.display = 'block';
                    quizFeedback.textContent = '正确！那确实是正确的角度。';
                    quizFeedback.style.color = 'var(--success-color)';
                    
                    // 延迟后生成新的问题
                    setTimeout(generateRandomAngleQuiz, 2000);
                } else {
                    this.classList.add('incorrect');
                    quizFeedback.style.display = 'block';
                    quizFeedback.textContent = `错误，正确答案是 ${correctAngle}°`;
                    quizFeedback.style.color = 'var(--danger-color)';
                }
            });
            
            quizOptions.appendChild(option);
        });
    }
    
    // =====================
    // 初始化事件监听
    // =====================
    
    // 添加鼠标事件监听
    dragPoint.addEventListener('mousedown', startDrag);
    
    // 添加触摸事件监听（移动设备支持）
    dragPoint.addEventListener('touchstart', startTouchDrag);
});