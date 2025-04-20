// 角度探索者 - JavaScript交互逻辑

// DOM元素
const dragPoint = document.getElementById('drag-point');
const endRay = document.getElementById('end-ray');
const angleArc = document.getElementById('angle-arc');
const negativeAngleArc = document.getElementById('negative-angle-arc');
const angleLabel = document.getElementById('angle-label');
const degreesValue = document.getElementById('degrees-value');
const radiansValue = document.getElementById('radians-value');
const angleType = document.getElementById('angle-type');
const toggleNegativeBtn = document.getElementById('toggle-negative');
const resetAngleBtn = document.getElementById('reset-angle');
const snap90Btn = document.getElementById('snap-90');
const challengeBtn = document.getElementById('challenge-btn');
const challengeDisplay = document.getElementById('challenge-display');
const targetAngle = document.getElementById('target-angle');
const feedback = document.getElementById('feedback');

// SVG坐标系中心点
const centerX = 0;
const centerY = 0;
const radius = 80; // 圆的半径

// 状态变量
let currentAngleDegrees = 0;
let showNegativeAngle = false;
let isDragging = false;
let inChallenge = false;
let challengeTargetDegrees = 0;
let snapping = false; // 控制是否启用吸附到90度刻度

// 角度计算和转换函数
function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// 格式化角度显示，保留2位小数
function formatDegrees(degrees) {
    return degrees.toFixed(0) + '°';
}

function formatRadians(radians) {
    // 尝试用分数表示特殊角度的弧度值
    const specialRadians = {
        0: '0',
        30: 'π/6',
        45: 'π/4',
        60: 'π/3',
        90: 'π/2',
        120: '2π/3',
        135: '3π/4',
        150: '5π/6',
        180: 'π',
        210: '7π/6',
        225: '5π/4',
        240: '4π/3',
        270: '3π/2',
        300: '5π/3',
        315: '7π/4',
        330: '11π/6',
        360: '2π'
    };
    
    const absDegrees = Math.abs(Math.round(toDegrees(radians)) % 360);
    
    if (specialRadians[absDegrees]) {
        return (radians < 0 ? '-' : '') + specialRadians[absDegrees] + ' rad';
    } else {
        return radians.toFixed(2) + ' rad';
    }
}

// 根据度数计算圆上的点坐标
function getPointOnCircle(degrees) {
    const radians = toRadians(degrees);
    const x = centerX + radius * Math.cos(radians);
    const y = centerY - radius * Math.sin(radians); // SVG坐标系y轴向下
    return { x, y };
}

// 根据鼠标位置计算角度
function calculateAngle(x, y) {
    // 将SVG坐标系转换为标准坐标系（y轴向上）
    const dx = x - centerX;
    const dy = -(y - centerY); // 反转y值
    
    // 计算弧度并转换为度数
    let angle = Math.atan2(dy, dx);
    if (angle < 0) {
        angle += 2 * Math.PI; // 将负角转换为0-2π范围
    }
    
    return toDegrees(angle);
}

// 更新角度显示和图形
function updateAngleDisplay(degrees) {
    // 存储当前角度
    currentAngleDegrees = degrees;
    
    // 标准化到0-360度范围
    let standardDegrees = degrees % 360;
    if (standardDegrees < 0) {
        standardDegrees += 360;
    }
    
    // 计算终边的点
    const point = getPointOnCircle(degrees);
    
    // 更新终边
    endRay.setAttribute('x2', point.x);
    endRay.setAttribute('y2', point.y);
    
    // 更新拖动点
    dragPoint.setAttribute('cx', point.x);
    dragPoint.setAttribute('cy', point.y);
    
    // 计算要显示的角度弧度
    const startPoint = { x: radius, y: 0 }; // 始边上的点
    
    // 根据正角或负角决定弧的绘制方向
    if (showNegativeAngle && degrees > 0) {
        // 显示负角 (顺时针，等效于360-度数)
        const negDegrees = degrees - 360;
        updateAnglePath(negativeAngleArc, 0, negDegrees, false);
        negativeAngleArc.style.display = 'block';
        angleArc.style.display = 'none';
        
        // 更新角度值显示
        degreesValue.textContent = formatDegrees(negDegrees);
        radiansValue.textContent = formatRadians(toRadians(negDegrees));
        angleType.textContent = '负角';
        
        // 更新角度标签
        angleLabel.textContent = formatDegrees(negDegrees);
        updateAngleLabelPosition(negDegrees);
    } else {
        // 显示正角 (逆时针)
        updateAnglePath(angleArc, 0, degrees, true);
        angleArc.style.display = 'block';
        negativeAngleArc.style.display = 'none';
        
        // 更新角度值显示
        degreesValue.textContent = formatDegrees(degrees);
        radiansValue.textContent = formatRadians(toRadians(degrees));
        angleType.textContent = '正角';
        
        // 更新角度标签
        angleLabel.textContent = formatDegrees(degrees);
        updateAngleLabelPosition(degrees);
    }
    
    // 如果在挑战模式，检查是否达成目标
    if (inChallenge) {
        checkChallengeCompletion();
    }
}

// 更新角度标签位置
function updateAngleLabelPosition(degrees) {
    // 将标签放在角度弧的中间
    const labelAngle = degrees / 2;
    const labelRadius = radius / 2; // 放在半径的一半位置
    const labelPoint = getPointOnCircle(labelAngle);
    
    // 将标签位置缩放到标签半径
    const labelX = centerX + (labelPoint.x - centerX) * (labelRadius / radius);
    const labelY = centerY + (labelPoint.y - centerY) * (labelRadius / radius);
    
    angleLabel.setAttribute('x', labelX);
    angleLabel.setAttribute('y', labelY);
}

// 更新角度弧路径
function updateAnglePath(pathElement, startDegrees, endDegrees, isPositive) {
    // 标准化角度
    startDegrees = startDegrees % 360;
    endDegrees = endDegrees % 360;
    
    if (startDegrees < 0) startDegrees += 360;
    if (endDegrees < 0) endDegrees += 360;
    
    // 如果角度相等，不绘制任何弧
    if (startDegrees === endDegrees) {
        pathElement.setAttribute('d', '');
        return;
    }
    
    const startPoint = getPointOnCircle(startDegrees);
    const endPoint = getPointOnCircle(endDegrees);
    
    // 确定是大弧还是小弧
    const angleDiff = Math.abs(endDegrees - startDegrees);
    const largeArcFlag = (angleDiff > 180) ? 1 : 0;
    
    // 确定弧的方向
    const sweepFlag = isPositive ? 1 : 0;
    
    // 构建SVG路径
    const pathData = `
        M ${centerX} ${centerY}
        L ${startPoint.x} ${startPoint.y}
        A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endPoint.x} ${endPoint.y}
        Z
    `;
    
    pathElement.setAttribute('d', pathData);
}

// 检查挑战完成情况
function checkChallengeCompletion() {
    // 计算当前角度和目标角度的差
    const displayedDegrees = showNegativeAngle && currentAngleDegrees > 0 ? 
                          currentAngleDegrees - 360 : currentAngleDegrees;
    
    const diff = Math.abs(displayedDegrees - challengeTargetDegrees);
    
    // 如果差值小于5度，认为挑战成功
    if (diff < 5) {
        feedback.textContent = '恭喜！你成功达到了目标角度！';
        feedback.className = 'feedback success';
        feedback.style.display = 'block';
        
        // 3秒后隐藏反馈
        setTimeout(() => {
            feedback.style.display = 'none';
            // 生成新的挑战
            startNewChallenge();
        }, 3000);
    } else {
        feedback.style.display = 'none';
    }
}

// 开始新的挑战
function startNewChallenge() {
    // 生成随机目标角度，可能包括负角度
    const useNegativeAngle = Math.random() > 0.5;
    
    // 生成特殊角度（如30°, 45°, 60°, 90°等）的概率更高
    const specialAngles = [30, 45, 60, 90, 120, 135, 150, 180, 270];
    const useSpecialAngle = Math.random() > 0.3;
    
    let targetDegrees;
    if (useSpecialAngle) {
        const randomIndex = Math.floor(Math.random() * specialAngles.length);
        targetDegrees = specialAngles[randomIndex];
    } else {
        // 生成1-359之间的随机角度
        targetDegrees = Math.floor(Math.random() * 359) + 1;
    }
    
    // 如果是负角度，转换为负值
    if (useNegativeAngle) {
        targetDegrees = -targetDegrees;
    }
    
    // 更新目标角度显示
    challengeTargetDegrees = targetDegrees;
    targetAngle.textContent = formatDegrees(targetDegrees);
    
    // 确保显示对应的正负角模式
    showNegativeAngle = targetDegrees < 0;
    
    // 重置当前角度为0
    updateAngleDisplay(0);
}

// 如果启用吸附，获取应该吸附到的角度值
function getSnapDegree(degrees) {
    // 如果不启用吸附，直接返回原始角度
    if (!snapping) return degrees;
    
    // 计算到最近90度刻度的距离
    const mod90 = degrees % 90;
    const distToLower = mod90;
    const distToUpper = 90 - mod90;
    
    // 如果距离小于10度，则吸附到该刻度
    if (distToLower < 10) {
        return degrees - distToLower;
    } else if (distToUpper < 10) {
        return degrees + distToUpper;
    } else {
        return degrees;
    }
}

// 事件处理函数

// 鼠标/触摸事件处理
function handleMouseDown(e) {
    isDragging = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseMove(e) {
    if (!isDragging) return;
    
    // 获取SVG元素的位置和尺寸
    const svg = document.getElementById('angle-canvas');
    const svgRect = svg.getBoundingClientRect();
    
    // 将鼠标坐标转换为SVG坐标系
    const mouseX = ((e.clientX - svgRect.left) / svgRect.width) * 220 - 110;
    const mouseY = ((e.clientY - svgRect.top) / svgRect.height) * 220 - 110;
    
    // 计算角度
    let degrees = calculateAngle(mouseX, mouseY);
    
    // 如果启用吸附，吸附到最近的90度刻度
    if (snapping) {
        degrees = getSnapDegree(degrees);
    }
    
    // 更新角度显示
    updateAngleDisplay(degrees);
}

function handleMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
}

function handleTouchStart(e) {
    isDragging = true;
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
}

function handleTouchMove(e) {
    if (!isDragging) return;
    
    // 防止页面滚动
    e.preventDefault();
    
    // 获取SVG元素的位置和尺寸
    const svg = document.getElementById('angle-canvas');
    const svgRect = svg.getBoundingClientRect();
    
    // 使用第一个触摸点
    const touch = e.touches[0];
    
    // 将触摸坐标转换为SVG坐标系
    const touchX = ((touch.clientX - svgRect.left) / svgRect.width) * 220 - 110;
    const touchY = ((touch.clientY - svgRect.top) / svgRect.height) * 220 - 110;
    
    // 计算角度
    let degrees = calculateAngle(touchX, touchY);
    
    // 如果启用吸附，吸附到最近的90度刻度
    if (snapping) {
        degrees = getSnapDegree(degrees);
    }
    
    // 更新角度显示
    updateAngleDisplay(degrees);
}

function handleTouchEnd() {
    isDragging = false;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
}

// 切换正负角显示
function toggleNegative() {
    showNegativeAngle = !showNegativeAngle;
    updateAngleDisplay(currentAngleDegrees);
}

// 重置角度为0
function resetAngle() {
    updateAngleDisplay(0);
}

// 切换90度刻度吸附
function toggleSnap90() {
    snapping = !snapping;
    
    // 更新按钮样式以指示当前状态
    if (snapping) {
        snap90Btn.textContent = '取消吸附';
        snap90Btn.style.backgroundColor = '#4CAF50';
    } else {
        snap90Btn.textContent = '吸附到90°刻度';
        snap90Btn.style.backgroundColor = '';
    }
    
    // 如果正在拖动，则应用吸附效果
    if (isDragging) {
        updateAngleDisplay(getSnapDegree(currentAngleDegrees));
    }
}

// 切换挑战模式
function toggleChallenge() {
    inChallenge = !inChallenge;
    
    if (inChallenge) {
        // 开始挑战
        challengeBtn.textContent = '结束挑战';
        challengeDisplay.style.display = 'block';
        startNewChallenge();
    } else {
        // 结束挑战
        challengeBtn.textContent = '开始目标挑战';
        challengeDisplay.style.display = 'none';
        feedback.style.display = 'none';
    }
}

// 初始化函数
function init() {
    // 添加事件监听器
    dragPoint.addEventListener('mousedown', handleMouseDown);
    dragPoint.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    toggleNegativeBtn.addEventListener('click', toggleNegative);
    resetAngleBtn.addEventListener('click', resetAngle);
    snap90Btn.addEventListener('click', toggleSnap90);
    challengeBtn.addEventListener('click', toggleChallenge);
    
    // 初始化角度显示
    updateAngleDisplay(0);
}

// 启动应用
init();