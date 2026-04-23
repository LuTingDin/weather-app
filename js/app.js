import { fetchWeatherData, fetchForecast, fetchHourly } from './api.js';
import { updateForecastUI, updateHourlyUI, updateUI } from './ui.js';
import { displayRecentSearches } from './ui.js';
import { showLoading, hideLoading } from './ui.js';
import { showError, hideError } from './ui.js';

async function displayWeather(city) {
    try {
        // 顯示 loading
        showLoading();
        // 隱藏錯誤訊息（如果之前有顯示的話）
        hideError();
        // 1. 同時拿到當日天氣資料和天氣預報資料
        const [weatherData, forecastData, hourlyData] = await Promise.all([fetchWeatherData(city), fetchForecast(city), fetchHourly(city)]);
        // 1.1 把搜尋的城市存到 localStorage
        const updated = saveRecentSearch(city);
        // 1.2 更新最近搜尋的按鈕
        displayRecentSearches(updated);
        
        // 2. 丟給ui顯示之前，先存起來
        currentWeatherData = weatherData;
        currentForecastData = forecastData;
        currentHourlyData = hourlyData;
        // 2.1 丟給ui顯示
        updateUI(weatherData, convertTemp, getUnit());
        updateForecastUI(forecastData, convertTemp, getUnit());
        updateHourlyUI(hourlyData, convertTemp, getUnit());
    } catch (error) {
        console.log(error);
        // 在UI上顯示錯誤訊息
        if (error.message.includes('404')) {
            showError("找不到這個城市，請確認名稱是否正確");
        } else {
            showError("發生錯誤，請稍後再試");
        }
    } finally {
        // 不管成功或失敗都要隱藏 loading
        hideLoading();
    }
}

function saveRecentSearch(city) {
    let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    // 存的時候統一小寫比較（用來去重複）
    city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
     // 1. 處理重複
    searches = searches.filter(item => item.toLowerCase() !== city.toLowerCase());
    
    // 2. 加入新城市
    searches.push(city);

    // 3. 超過3筆就移除最舊的
    if (searches.length > 3) {
        searches.shift();
    }

    // 4. 存回 localStorage
    localStorage.setItem('recentSearches', JSON.stringify(searches));
    
    return searches;
}

// 監聽表單提交事件
document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (!city) return; // 如果輸入為空，則不執行
    displayWeather(city);
});

// 最近搜尋按鈕（事件委派）
document.getElementById('recent-searches').addEventListener('click', (e) => {
    if (e.target.classList.contains('recent-search-btn')) {
        const city = e.target.textContent;
        displayWeather(city);
    }
});

// 載入時顯示最近搜尋的城市按鈕
function init() {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    displayRecentSearches(recentSearches);
}
init(); // 頁面初次載入時執行

// 監聽 Enter 鍵事件
document.getElementById('city-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('search-btn').click(); // 觸發搜尋按鈕的點擊事件
    }
});

// 攝氏華氏切換
let isCelsius = true; // 預設為攝氏
let currentWeatherData = null; // 用來存當前的天氣資料
let currentHourlyData = null; // 用來存當前的小時預報資料
let currentForecastData = null; // 用來存當前的天氣預報資料

// 溫度換算 function
function convertTemp(temp) {
    if (isCelsius) return Math.round(temp); // 攝氏直接回傳
    return Math.round(temp * 1.8 + 32); // 華氏換算
}
function getUnit() {
    return isCelsius ? '°C' : '°F';
}
// 監聽溫度切換按鈕
document.getElementById('unit-toggle').addEventListener('click', () => {
    isCelsius = !isCelsius; // 切換單位
    if (currentWeatherData) {
        updateUI(currentWeatherData, convertTemp, getUnit());
        updateForecastUI(currentForecastData, convertTemp, getUnit());
        updateHourlyUI(currentHourlyData, convertTemp, getUnit()); 
    }
document.getElementById('unit-toggle').classList.toggle('active');
});