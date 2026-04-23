import { BASE_URL } from './config.js';
import { API_KEY } from './config.js';

// 取得當日天氣資料
export async function fetchWeatherData(city) {
    try {
    // 1. 組URL
    const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=zh_tw`;
    // 2. 發送請求
    const response = await fetch(url);
    // 2.1 檢查回應是否成功
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    // 3. 轉換成JSON並回傳資料
    const data = await response.json();
    return data;

    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error; // 可以選擇拋出錯誤讓呼叫者處理
    }
}

// 取得天氣預報資料
export async function fetchForecast(city) {
    // 1. 組URL
    try {
        const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=zh_tw`;
        // 2. 發送請求
        const response = await fetch(url);
        // 2.1 檢查回應是否成功
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // 3. 轉換成JSON並只取每天中午12點的預報資料
        const data = await response.json();
        const filteredData = data.list.filter(item => item.dt_txt.includes('12:00:00')); // 只保留每天中午12點的預報資料
        return filteredData;
    } catch (error) {
        console.error("Error fetching forecast data:", error);
        throw error; // 可以選擇拋出錯誤讓呼叫者處理
    }
}

// 只取現在之後的資料，最多8筆（24小時）
export async function fetchHourly(city) {
    try {
        const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=zh_tw`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const now = new Date();
        const hourlyData = data.list.filter(item => new Date(item.dt_txt) > now).slice(0, 8);
        return hourlyData;
    } catch (error) {
        console.error("Error fetching hourly forecast data:", error);
        throw error; // 可以選擇拋出錯誤讓呼叫者處理
    }
}