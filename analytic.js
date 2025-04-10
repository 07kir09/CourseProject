/*****************************************************
 * analytics.js
 * Объединённый файл аналитической страницы.
 * Содержит:
 *  - Глобальные переменные для диаграмм: radarChart, barChart, dailyDataMap.
 *  - Функции построения диаграмм: getDailyMetricArrayGlobal, getMetricLabelGlobal, updateAnalytics.
 *  - Функции фильтрации и сортировки: getFilteredSessions, getMaxSessionDate, sortSessions.
 *  - Привязку событий аналитической страницы.
 *****************************************************/

document.addEventListener('DOMContentLoaded', () => {
    /********** Глобальные переменные **********/
    window.radarChart = null;
    window.barChart = null;
    window.dailyDataMap = {};
    window.activeFilters = {};
    window.selectedPeriodDays = null;

    /********** Функции построения диаграмм **********/
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

    /********** Функции фильтрации и сортировки **********/
    function getMaxSessionDate(sessions) {
        return sessions.reduce((acc, session) => {
            const d = new Date(session.start_time);
            return d > acc ? d : acc;
        }, new Date(0));
    }

    function getFilteredSessions(sessions) {
        let thresholdDate = null;
        if (window.selectedPeriodDays !== null) {
            const maxDate = getMaxSessionDate(sessions);
            thresholdDate = new Date(maxDate.getTime() - window.selectedPeriodDays * 24 * 60 * 60 * 1000);
        }
        return sessions.filter(session => {
            const summary = session.summary || {};
            if (thresholdDate !== null) {
                const sessionDate = new Date(session.start_time);
                if (sessionDate < thresholdDate) return false;
            }
            for (const key in window.activeFilters) {
                let value;
                switch (key) {
                    case 'Distance (km)':
                        value = (summary.total_distance || 0) / 1000;
                        break;
                    case 'Duration (min)':
                        value = (summary.duration_seconds || 0) / 60;
                        break;
                    case 'Pace (min/km)':
                        value = summary.average_pace || 0;
                        break;
                    case 'Heart Rate (bpm)':
                        value = summary.average_heart_rate || 0;
                        break;
                    case 'Calories':
                        value = summary.total_calories || 0;
                        break;
                    case 'Elevation (m)':
                        value = summary.elevation_gain || 0;
                        break;
                    default:
                        value = 0;
                }
                const filter = window.activeFilters[key];
                if (filter.min !== undefined && value < filter.min) return false;
                if (filter.max !== undefined && value > filter.max) return false;
            }
            return true;
        });
    }

    function sortSessions(sessions, sortType) {
        let sorted = [...sessions];
        switch (sortType) {
            case 'distanceAsc':
                sorted.sort((a, b) => ((a.summary?.total_distance || 0) - (b.summary?.total_distance || 0)));
                break;
            case 'distanceDesc':
                sorted.sort((a, b) => ((b.summary?.total_distance || 0) - (a.summary?.total_distance || 0)));
                break;
            case 'durationAsc':
                sorted.sort((a, b) => ((a.summary?.duration_seconds || 0) - (b.summary?.duration_seconds || 0)));
                break;
            case 'durationDesc':
                sorted.sort((a, b) => ((b.summary?.duration_seconds || 0) - (a.summary?.duration_seconds || 0)));
                break;
            default:
                break;
        }
        return sorted;
    }
    window.getFilteredSessions = getFilteredSessions;
    window.sortSessions = sortSessions;

    /********** Функция updateAnalytics **********/
    function updateAnalytics(filteredSessions) {
        console.log('updateAnalytics -> получаем сессий:', filteredSessions);

        // 1) Таблица сессий
        const sessionInfoTable = document.getElementById('sessionInfoTable');
        if (!sessionInfoTable) {
            console.error('Нет sessionInfoTable!');
            return;
        }
        let tableHtml = `<tr>
        <th>Session ID</th>
        <th>User ID</th>
        <th>Start</th>
        <th>End</th>
    </tr>`;
        filteredSessions.forEach(item => {
            tableHtml += `<tr>
          <td>${item.session_id || 'N/A'}</td>
          <td>${item.user_id || 'N/A'}</td>
          <td>${item.start_time || 'N/A'}</td>
          <td>${item.end_time || 'N/A'}</td>
      </tr>`;
        });
        sessionInfoTable.innerHTML = tableHtml;

        // 2) Радарная диаграмма
        const radarCtxElem = document.getElementById('dataChart');
        if (!radarCtxElem) {
            console.error('Нет canvas dataChart!');
            return;
        }
        if (window.radarChart) {
            window.radarChart.destroy();
        }
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
                    legend: { display: false }
                }
            },
            plugins: [htmlLegendPlugin]
        });

        // 3) Бар-диаграмма (по умолчанию "distance")
        const barCtxElem = document.getElementById('distanceChart');
        if (!barCtxElem) {
            console.error('Нет canvas distanceChart!');
            return;
        }
        if (window.barChart) {
            window.barChart.destroy();
        }
        const localDailyDataMap = {};
        filteredSessions.forEach(sess => {
            const date = sess.start_time.split('T')[0];
            if (!localDailyDataMap[date]) {
                localDailyDataMap[date] = {
                    distance: 0,
                    duration: 0,
                    paceSum: 0,
                    paceCount: 0,
                    heartRateSum: 0,
                    heartRateCount: 0,
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
        window.dailyDataMap = localDailyDataMap;
        const allDates = Object.keys(window.dailyDataMap).sort();
        const defaultMetric = 'distance';
        const defaultData = getDailyMetricArrayGlobal(defaultMetric);
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
                    legend: false
                }
            }
        });
    }

    /********** Привязка событий аналитической страницы **********/
    // Кнопка "Вернуться"
    document.getElementById('goBackButton').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Загружаем данные из localStorage и сохраняем в window.sessions
    let storedSessions = JSON.parse(localStorage.getItem('exSparkData'));
    if (!Array.isArray(storedSessions)) { storedSessions = [storedSessions]; }
    window.sessions = storedSessions;
    console.log('Загруженные сессии для аналитики:', window.sessions);
    // Первоначальное обновление аналитики
    updateAnalytics(window.sessions);

    // Привязка для выпадающего меню метрики
    const metricButton = document.getElementById('metricButton');
    const metricMenu = document.getElementById('metricMenu');
    metricButton.addEventListener('click', () => {
        metricMenu.classList.toggle('active');
        metricButton.classList.toggle('rotated');
    });
    document.addEventListener('click', e => {
        if (!metricButton.contains(e.target) && !metricMenu.contains(e.target)) {
            metricMenu.classList.remove('active');
            metricButton.classList.remove('rotated');
        }
    });
    document.querySelectorAll('#metricMenu li').forEach(li => {
        li.addEventListener('click', () => {
            document.querySelectorAll('#metricMenu li').forEach(i => i.classList.remove('selected'));
            li.classList.add('selected');
            const chosenKey = li.dataset.value;
            const metricButtonText = metricButton.querySelector('.metric-button-text');
            if (metricButtonText) {
                metricButtonText.textContent = li.innerText.trim();
            }
            metricMenu.classList.remove('active');
            metricButton.classList.remove('rotated');
            window.barChart.data.datasets[0].data = getDailyMetricArrayGlobal(chosenKey);
            window.barChart.data.datasets[0].label = getMetricLabelGlobal(chosenKey);
            window.barChart.update();
        });
    });

    // Привязка для панели фильтров
    const openFilterBtn = document.getElementById('openFilterBtn');
    const closeFilterBtn = document.getElementById('closeFilterBtn');
    const overlay = document.getElementById('overlay');
    const filterDrawer = document.getElementById('filterDrawer');
    openFilterBtn.addEventListener('click', () => {
        filterDrawer.classList.add('active');
        overlay.classList.add('active');
    });
    closeFilterBtn.addEventListener('click', () => {
        filterDrawer.classList.remove('active');
        overlay.classList.remove('active');
    });
    overlay.addEventListener('click', () => {
        filterDrawer.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Привязка для аккордеона в панели фильтров
    document.querySelectorAll('.accordion-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            content.classList.toggle('open');
            if (toggle.textContent.trim().startsWith('+')) {
                toggle.textContent = toggle.textContent.trim().replace('+', '-');
            } else {
                toggle.textContent = toggle.textContent.trim().replace('-', '+');
            }
        });
    });

    // Обработчик кнопки "Apply filter"
    document.getElementById('applyFiltersBtn').addEventListener('click', () => {
        window.activeFilters = {};
        const distanceMin = parseFloat(document.getElementById('distanceMin').value);
        const distanceMax = parseFloat(document.getElementById('distanceMax').value);
        if (!isNaN(distanceMin) || !isNaN(distanceMax)) {
            window.activeFilters['Distance (km)'] = {};
            if (!isNaN(distanceMin)) window.activeFilters['Distance (km)'].min = distanceMin;
            if (!isNaN(distanceMax)) window.activeFilters['Distance (km)'].max = distanceMax;
        }
        // Дополнительные фильтры можно добавить аналогично.
        filterDrawer.classList.remove('active');
        overlay.classList.remove('active');
        const filtered = getFilteredSessions(window.sessions);
        updateAnalytics(filtered);
    });

    // Обработчик кнопки "Reset filter"
    document.getElementById('resetFiltersBtn').addEventListener('click', () => {
        document.querySelectorAll('#filterDrawer input[type="number"]').forEach(input => {
            input.value = '';
        });
        window.activeFilters = {};
        const filtered = getFilteredSessions(window.sessions);
        updateAnalytics(filtered);
    });

    // Привязка для выбора периода (Days menu)
    const periodButton = document.getElementById('daysButton');
    const periodMenu = document.getElementById('daysMenu');
    periodButton.addEventListener('click', () => {
        periodMenu.classList.toggle('active');
    });
    document.querySelectorAll('#daysMenu li').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('#daysMenu li').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            const selectedValue = item.getAttribute('data-value');
            periodButton.querySelector('.days-button-text').textContent = selectedValue;
            periodMenu.classList.remove('active');
            const periodMap = {
                "5 days": 5,
                "10 days": 10,
                "2 weeks": 14,
                "1 month": 30,
                "All dates": null
            };
            window.selectedPeriodDays = periodMap[selectedValue] !== undefined ? periodMap[selectedValue] : null;
            const filtered = getFilteredSessions(window.sessions);
            updateAnalytics(filtered);
        });
    });

    // Обработчик для сортировки сессий
    document.getElementById('sortSelect').addEventListener('change', () => {
        const sortType = document.getElementById('sortSelect').value;
        const filtered = getFilteredSessions(window.sessions);
        const sorted = sortSessions(filtered, sortType);
        updateAnalytics(sorted);
    });
});
