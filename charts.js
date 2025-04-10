/*****************************************************
 * charts.js
 * - Глобальные переменные: radarChart, barChart, dailyDataMap
 * - Глобальные функции: getDailyMetricArrayGlobal, getMetricLabelGlobal
 * - Функция updateAnalytics(filteredSessions):
 *      строит радар + бар-диаграмму.
 *****************************************************/

// Глобальные переменные для диаграмм:
window.radarChart = null;
window.barChart = null;
// Глобальный объект с данными по дням:
window.dailyDataMap = {};

function getDailyMetricArrayGlobal(metricKey) {
    const allDates = Object.keys(window.dailyDataMap).sort();
    return allDates.map(date => {
        const d = window.dailyDataMap[date];
        if (!d) return 0;

        switch (metricKey) {
            case 'distance':
                return d.distance;
            case 'duration':
                return d.duration;
            case 'pace':
                return (d.paceCount > 0) ? (d.paceSum / d.paceCount) : 0;
            case 'heartRate':
                return (d.heartRateCount > 0) ? (d.heartRateSum / d.heartRateCount) : 0;
            case 'calories':
                return d.calories;
            case 'elevation':
                return d.elevation;
            default:
                return 0;
        }
    });
}

/**
 * Возвращает человекочитаемую подпись для метрики (для label).
 */
function getMetricLabelGlobal(key) {
    switch (key) {
        case 'distance':  return 'Distance (km)';
        case 'duration':  return 'Duration (min)';
        case 'pace':      return 'Pace (min/km)';
        case 'heartRate': return 'Heart Rate (bpm)';
        case 'calories':  return 'Calories';
        case 'elevation': return 'Elevation (m)';
        default:          return 'Metric';
    }
}

/**
 * Основная функция: отрисовывает таблицу сессий, радарную диаграмму и бар-диаграмму.
 * @param {Array} filteredSessions Массив сессий, который нужно отобразить
 */
function updateAnalytics(filteredSessions) {
    console.log('updateAnalytics -> получаем сессий:', filteredSessions);

    // 1) Таблица
    const sessionInfoTable = document.getElementById('sessionInfoTable');
    if (!sessionInfoTable) {
        console.error('Нет sessionInfoTable!');
        return;
    }
    let html = `<tr>
        <th>Session ID</th>
        <th>User ID</th>
        <th>Start</th>
        <th>End</th>
    </tr>`;
    filteredSessions.forEach(item => {
        html += `<tr>
            <td>${item.session_id || 'N/A'}</td>
            <td>${item.user_id || 'N/A'}</td>
            <td>${item.start_time || 'N/A'}</td>
            <td>${item.end_time || 'N/A'}</td>
        </tr>`;
    });
    sessionInfoTable.innerHTML = html;

    // 2) Радарная диаграмма
    const radarCtxElem = document.getElementById('dataChart');
    if (!radarCtxElem) {
        console.error('Нет canvas dataChart!');
        return;
    }
    // Уничтожаем, если была
    if (window.radarChart) {
        window.radarChart.destroy();
    }

    // Настройки для радарной диаграммы
    const metricKeys = ["distance", "duration", "pace", "heartRate", "calories", "elevation"];
    const scaleFactors = {
        distance: 1,
        duration: 3,
        pace: 1,
        heartRate: 20,
        calories: 50,
        elevation: 10
    };
    function getScaledValues(summary) {
        const distKm = (summary.total_distance || 0) / 1000;
        const durMin = (summary.duration_seconds || 0) / 60;
        const pace   = summary.average_pace || 0;
        const hr     = summary.average_heart_rate || 0;
        const cals   = summary.total_calories || 0;
        const elev   = summary.elevation_gain || 0;
        return [
            distKm / scaleFactors.distance,
            durMin / scaleFactors.duration,
            pace   / scaleFactors.pace,
            hr     / scaleFactors.heartRate,
            cals   / scaleFactors.calories,
            elev   / scaleFactors.elevation
        ];
    }
    const radarLabels = [
        'Distance (km)',
        'Duration (min)',
        'Pace (min/km)',
        'Heart Rate (bpm)',
        'Calories',
        'Elevation (m)'
    ];

    // Формируем datasets
    const allDataSets = filteredSessions.map((sess, idx) => {
        const s = sess.summary || {};
        return {
            label: sess.session_id || `Session ${idx + 1}`,
            data: getScaledValues(s),
            fill: true,
            backgroundColor: `hsla(${idx * 50}, 100%, 40%, 0.2)`,
            borderColor: `hsl(${idx * 50}, 100%, 40%)`,
            borderWidth: 2
        };
    });

    // Кастомная легенда
    const htmlLegendPlugin = {
        id: 'htmlLegend',
        afterUpdate(chart) {
            const legendContainer = document.getElementById('customLegend');
            if (!legendContainer) return;
            legendContainer.innerHTML = '';

            const items = chart.options.plugins.legend.labels.generateLabels(chart);
            items.forEach((it) => {
                const legendItem = document.createElement('div');
                legendItem.classList.add('legend-item');

                const boxSpan = document.createElement('span');
                boxSpan.classList.add('legend-box');
                boxSpan.style.background = it.fillStyle;

                const text = document.createElement('span');
                text.classList.add('legend-text');
                text.textContent = it.text;

                legendItem.onclick = () => {
                    chart.setDatasetVisibility(it.datasetIndex, !chart.isDatasetVisible(it.datasetIndex));
                    chart.update();
                };

                legendItem.appendChild(boxSpan);
                legendItem.appendChild(text);
                legendContainer.appendChild(legendItem);
            });
        }
    };

    // Создаём радарный график
    const radarCtx = radarCtxElem.getContext('2d');
    window.radarChart = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: radarLabels,
            datasets: allDataSets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    suggestedMax: 12,
                    ticks: { stepSize: 2 }
                }
            },
            plugins: {
                legend: { display: false },
            }
        },
        plugins: [htmlLegendPlugin]
    });

    // 3) Бар-диаграмма (по умолчанию distance)
    const barCtxElem = document.getElementById('distanceChart');
    if (!barCtxElem) {
        console.error('Нет canvas distanceChart!');
        return;
    }
    // Уничтожаем старую
    if (window.barChart) {
        window.barChart.destroy();
    }

    // Собираем локальный dailyDataMap и присваиваем глобально
    const localDailyDataMap = {};
    filteredSessions.forEach(sess => {
        const date = sess.start_time.split('T')[0];
        if (!localDailyDataMap[date]) {
            localDailyDataMap[date] = {
                distance: 0, duration: 0,
                paceSum: 0, paceCount: 0,
                heartRateSum: 0, heartRateCount: 0,
                calories: 0,
                elevation: 0
            };
        }
        const sum = sess.summary || {};
        const dist   = (sum.total_distance || 0) / 1000;
        const durMin = (sum.duration_seconds || 0) / 60;
        const paceVal= sum.average_pace || 0;
        const hrVal  = sum.average_heart_rate || 0;
        const cals   = sum.total_calories || 0;
        const elev   = sum.elevation_gain || 0;

        localDailyDataMap[date].distance += dist;
        localDailyDataMap[date].duration += durMin;

        if (paceVal > 0) {
            localDailyDataMap[date].paceSum += paceVal;
            localDailyDataMap[date].paceCount += 1;
        }
        if (hrVal > 0) {
            localDailyDataMap[date].heartRateSum += hrVal;
            localDailyDataMap[date].heartRateCount += 1;
        }
        localDailyDataMap[date].calories += cals;
        localDailyDataMap[date].elevation += elev;
    });
    // Глобально сохраняем
    window.dailyDataMap = localDailyDataMap;
    const allDates = Object.keys(window.dailyDataMap).sort();

    // Берём "distance" по умолчанию
    const defaultMetric = 'distance';
    const defaultData = getDailyMetricArrayGlobal(defaultMetric); // Используем глоб. функцию

    const barCtx = barCtxElem.getContext('2d');
    window.barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: allDates,
            datasets: [{
                label: getMetricLabelGlobal(defaultMetric),
                data: defaultData,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            },
            plugins: {
                legend: false,
            }
        }
    });

    // Здесь НЕ вешаем обработчики на metricButton/metricMenu – делаем это в main.js
}
