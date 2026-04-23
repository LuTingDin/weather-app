export function updateUI(weatherData, convertTemp, unit) {
    // 把 data 裡的值塞進 HTML 對應的元素
    document.getElementById('city-name').textContent = weatherData.name;
    document.getElementById('temprature').textContent = `${convertTemp(weatherData.main.temp)}${unit}`;
    document.getElementById('humidity').innerHTML = `${weatherData.main.humidity}<span class="stat-unit">%</span>`;
    document.getElementById('wind-speed').innerHTML = `${weatherData.wind.speed}<span class="stat-unit">m/s</span>`;
    document.getElementById('weather-description').textContent = `${weatherData.weather[0].description}`;
    // 顯示天氣圖示
    const iconCode = weatherData.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById('weather-icon').src = iconUrl;
    // 顯示天氣資訊區塊
    document.querySelector('.current-weather-card').classList.remove('hidden');
}

// 更新天氣預報UI
export function updateForecastUI(dailyForecasts, convertTemp, unit) {
    const container = document.getElementById('forecast-container');
    container.innerHTML = dailyForecasts.map(item => {
        return `<div class="forecast-card">
            <h3>${item.dt_txt.split(' ')[0]}</h3>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
            <ul>
                <li>天氣描述：${item.weather[0].description}</li>
                <li>溫度：${convertTemp(item.main.temp)}<span class="stat-unit">${unit}</span></li>
            </ul>
        </div>`;
    }).join(''); // 把陣列轉成字串
    // 顯示預報區塊
    document.querySelector('.forecast-section').classList.remove('hidden');
}

// 更新小時預報UI
export function updateHourlyUI(hourlyForecasts, convertTemp, unit) {
    const container = document.getElementById('hourly-forecast-container');
    container.innerHTML = hourlyForecasts.map(item => {
        const time = item.dt_txt.split(' ')[1].slice(0, 5); // 取出時間部分並格式化成 HH:mm
        return `<div class="hourly-forecast-card">
            <h3>${time}</h3>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
            <ul>
                <li>天氣描述：${item.weather[0].description}</li>
                <li>溫度：${convertTemp(item.main.temp)}<span class="stat-unit">${unit}</span></li>
            </ul>
        </div>`;
    }).join(''); // 把陣列轉成字串
    // 顯示小時預報區塊
    document.querySelector('.hourly-forecast-section').classList.remove('hidden');
}

// 顯示最近搜尋的城市按鈕
export function displayRecentSearches(searches) {
    const container = document.getElementById('recent-searches');
    container.innerHTML = searches.map(city => {
        return `<button class="recent-search-btn">${city}</button>`;
    }).join('');
}

// loading 狀態的顯示與隱藏
export function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}
export function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

// 錯誤訊息的顯示與隱藏
export function showError(message) {
    const container = document.getElementById('error-message');
    container.textContent = message;
    container.classList.remove('hidden');
}
export function hideError() {
    const container = document.getElementById('error-message');
    container.classList.add('hidden');
}