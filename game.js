let isGameActive = false; // 控制游戏状态的标志
let countdownInterval; // 保存倒计时的定时器

// 开始游戏，生成数字并计算结果
function startGame() {
    if (isGameActive) {
        alert("游戏已在进行中，请等待 2 分钟后再继续！");
        return;
    }

    // 标志游戏开始
    isGameActive = true;

    // 生成游戏数字
    let numbers = generateUniqueNumbers(20, 1, 99);
    numbers.sort((a, b) => a - b);

    document.getElementById("randomNumbers").textContent = "生成的数字: " + numbers.join(", ");

    // 选择部分
    let part1 = getPart(numbers, [1, 4, 7, 10, 13, 16]);
    let part2 = getPart(numbers, [2, 5, 8, 11, 14, 17]);
    let part3 = getPart(numbers, [3, 6, 9, 12, 15, 18]);

    let sum1 = getSumLastDigit(part1);
    let sum2 = getSumLastDigit(part2);
    let sum3 = getSumLastDigit(part3);

    let finalResult = sum1 + sum2 + sum3;
    let category = classifyResult(finalResult);

    // 显示结果
    document.getElementById("gameResult").innerHTML = `
        <h3>开奖结果</h3>
        <ul>
            <li><strong>第一区 (第2/5/8/11/14/17 位):</strong> ${part1.join(", ")} 
            <br> 和的末位数: ${sum1}</li>
            <li><strong>第二区 (第3/6/9/12/15/18 位):</strong> ${part2.join(", ")} 
            <br> 和的末位数: ${sum2}</li>
            <li><strong>第三区 (第4/7/10/13/16/19 位):</strong> ${part3.join(", ")} 
            <br> 和的末位数: ${sum3}</li>
        </ul>
        <h4>最终结果: ${finalResult} <br>分类: ${category}</h4>
    `;

    // 保存历史并更新
    saveGameResult(finalResult, category); // 只保存结果和分类
    displayHistory();

    // 启动两分钟倒计时
    startCountdown(120);
}

// 启动倒计时
function startCountdown(seconds) {
    let countdownElement = document.getElementById("countdown");
    let remainingTime = seconds;

    // 更新按钮状态并显示倒计时
    document.querySelector("button").disabled = true;
    countdownElement.textContent = `请等待 ${remainingTime} 秒后再开始游戏`;

    countdownInterval = setInterval(function() {
        remainingTime--;
        countdownElement.textContent = `请等待 ${remainingTime} 秒后再开始游戏`;

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            countdownElement.textContent = ''; // 清空倒计时信息
            document.querySelector("button").disabled = false;
            isGameActive = false; // 游戏状态重置为可继续
        }
    }, 1000);
}

// 生成不重复的随机数字
function generateUniqueNumbers(count, min, max) {
    let numbers = [];
    while (numbers.length < count) {
        let num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    return numbers;
}

// 获取指定位置的部分
function getPart(numbers, positions) {
    return positions.map(pos => numbers[pos]);
}

// 计算和的末位数
function getSumLastDigit(part) {
    return part.reduce((a, b) => a + b, 0) % 10;
}

// 分类函数
function classifyResult(result) {
    if ([1, 3, 5, 7, 9, 11, 13].includes(result)) return "小单";
    if ([0, 2, 4, 6, 8, 10, 12].includes(result)) return "小双";
    if ([15, 17, 19, 21, 23, 25, 27].includes(result)) return "大单";
    if ([14, 16, 18, 20, 22, 24, 26].includes(result)) return "大双";
    return "未知分类";
}

// 简化历史记录：只保存时间、结果和分类
function saveGameResult(result, category) {
    let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
    gameHistory.push({
        result: result,      // 游戏结果
        category: category,  // 分类
        date: new Date().toLocaleString()  // 记录日期
    });
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
}

// 显示历史记录：仅显示时间、结果和分类
function displayHistory() {
    let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
    let historyList = document.getElementById("historyList");
    historyList.innerHTML = ''; // 清空历史记录列表

    gameHistory.slice(-5).forEach(entry => {  // 仅显示最近5次游戏记录
        let listItem = document.createElement("li");
        listItem.textContent = `${entry.date} - 结果: ${entry.result} (${entry.category})`;
        historyList.appendChild(listItem);
    });
}

// 页面加载时显示历史记录
window.onload = function() {
    displayHistory();
};
