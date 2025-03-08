// document.addEventListener('DOMContentLoaded', () => {
//     // Кнопка «Вернуться»
//     const goBackButton = document.getElementById('goBackButton');
//     goBackButton.addEventListener('click', () => {
//         window.location.href = 'index.html';
//     });
//
//     // Считываем данные из localStorage
//     const storedData = localStorage.getItem('exSparkData');
//     if (!storedData) {
//         alert('Нет данных для аналитики. Загрузите данные на главной странице.');
//         window.location.href = 'index.html';
//         return;
//     }
//
//     let parsed;
//     try {
//         parsed = JSON.parse(storedData);
//     } catch (err) {
//         alert('Ошибка: невозможно прочитать данные!');
//         return;
//     }
//
//     // Превращаем в массив, если это одиночная сессия
//     const sessions = Array.isArray(parsed) ? parsed : [parsed];
//     if (!sessions.length) {
//         alert('Данные пусты!');
//         window.location.href = 'index.html';
//         return;
//     }
//
//     // Заполняем Session Info
//     const sessionInfoTable = document.getElementById('sessionInfoTable');
//     if (sessions.length === 1) {
//         // Одиночная сессия
//         const one = sessions[0];
//         const sessionId = one.session_id || 'N/A';
//         const userId = one.user_id || 'N/A';
//         const startTime = one.start_time || 'N/A';
//         const endTime = one.end_time || 'N/A';
//         sessionInfoTable.innerHTML = `
//       <tr><td><strong>Session ID</strong></td><td>${sessionId}</td></tr>
//       <tr><td><strong>User ID</strong></td><td>${userId}</td></tr>
//       <tr><td><strong>Start Time</strong></td><td>${startTime}</td></tr>
//       <tr><td><strong>End Time</strong></td><td>${endTime}</td></tr>
//     `;
//     } else {
//         // Несколько сессий
//         let html = `
//       <tr>
//         <th>Session ID</th>
//         <th>User ID</th>
//         <th>Start</th>
//         <th>End</th>
//       </tr>
//     `;
//         sessions.forEach(item => {
//             html += `
//         <tr>
//           <td>${item.session_id || 'N/A'}</td>
//           <td>${item.user_id || 'N/A'}</td>
//           <td>${item.start_time || 'N/A'}</td>
//           <td>${item.end_time || 'N/A'}</td>
//         </tr>
//       `;
//         });
//         sessionInfoTable.innerHTML = html;
//     }
//
//     // Готовим данные для радарной диаграммы
//     const labels = [
//         'Distance (m)',
//         'Duration (s)',
//         'Pace (min/km)',
//         'Heart Rate (bpm)',
//         'Calories',
//         'Elevation (m)'
//     ];
//
//     // Генерируем датасеты (каждая сессия = отдельная линия)
//     const allDataSets = sessions.map((item, idx) => {
//         const s = item.summary || {};
//         const dataValues = [
//             s.total_distance || 0,
//             s.duration_seconds || 0,
//             s.average_pace || 0,
//             s.average_heart_rate || 0,
//             s.total_calories || 0,
//             s.elevation_gain || 0
//         ];
//         // Цвета на основе hue
//         const hue = 360 * (idx / sessions.length);
//         const border = `hsl(${hue}, 100%, 40%)`;
//         const fill = `hsla(${hue}, 100%, 40%, 0.4)`;
//
//         return {
//             label: item.session_id || `Session ${idx + 1}`,
//             data: dataValues,
//             fill: true,
//             backgroundColor: fill,
//             borderColor: border,
//             borderWidth: 2,
//             pointBackgroundColor: border,
//             tension: 0.3
//         };
//     });
//
//     // Определяем максимум для шкалы
//     const allValues = [];
//     allDataSets.forEach(ds => ds.data.forEach(val => allValues.push(val)));
//     const maxVal = allValues.length ? Math.max(...allValues) : 10;
//
//     // Инициализируем Chart.js
//     const ctx = document.getElementById('dataChart').getContext('2d');
//     new Chart(ctx, {
//         type: 'radar',
//         data: {
//             labels: labels,
//             datasets: allDataSets
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             scales: {
//                 r: {
//                     angleLines: { color: '#ccc' },
//                     grid: { color: '#ccc' },
//                     suggestedMin: 0,
//                     suggestedMax: maxVal * 1.2 || 10
//                 }
//             },
//             plugins: {
//                 legend: {
//                     display: true,
//                     position: 'right'
//                 },
//                 tooltip: {
//                     usePointStyle: true
//                 }
//             },
//             animation: {
//                 duration: 1500,
//                 easing: 'easeInOutQuad'
//             }
//         }
//     });
// });


document.addEventListener('DOMContentLoaded', () => {
    // Кнопка «Вернуться»
    const goBackButton = document.getElementById('goBackButton');
    goBackButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Считываем данные из localStorage
    const storedData = localStorage.getItem('exSparkData');
    if (!storedData) {
        alert('Нет данных для аналитики. Загрузите данные на главной странице.');
        window.location.href = 'index.html';
        return;
    }

    let parsed;
    try {
        parsed = JSON.parse(storedData);
    } catch (err) {
        alert('Ошибка: невозможно прочитать данные!');
        return;
    }

    // Превращаем в массив, если одиночная сессия
    const sessions = Array.isArray(parsed) ? parsed : [parsed];
    if (!sessions.length) {
        alert('Данные пусты!');
        window.location.href = 'index.html';
        return;
    }

    // Заполняем Session Info
    const sessionInfoTable = document.getElementById('sessionInfoTable');
    if (sessions.length === 1) {
        // Одиночная сессия
        const one = sessions[0];
        const sessionId = one.session_id || 'N/A';
        const userId = one.user_id || 'N/A';
        const startTime = one.start_time || 'N/A';
        const endTime = one.end_time || 'N/A';
        sessionInfoTable.innerHTML = `
          <tr><td><strong>Session ID</strong></td><td>${sessionId}</td></tr>
          <tr><td><strong>User ID</strong></td><td>${userId}</td></tr>
          <tr><td><strong>Start Time</strong></td><td>${startTime}</td></tr>
          <tr><td><strong>End Time</strong></td><td>${endTime}</td></tr>
        `;
    } else {
        // Несколько сессий
        let html = `
          <tr>
            <th>Session ID</th>
            <th>User ID</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        `;
        sessions.forEach(item => {
            html += `
              <tr>
                <td>${item.session_id || 'N/A'}</td>
                <td>${item.user_id || 'N/A'}</td>
                <td>${item.start_time || 'N/A'}</td>
                <td>${item.end_time || 'N/A'}</td>
              </tr>
            `;
        });
        sessionInfoTable.innerHTML = html;
    }

    // Данные для радарной диаграммы
    const labels = [
        'Distance (m)',
        'Duration (s)',
        'Pace (min/km)',
        'Heart Rate (bpm)',
        'Calories',
        'Elevation (m)'
    ];

    // Генерируем датасеты (каждая сессия — отдельная «линия»)
    const allDataSets = sessions.map((item, idx) => {
        const s = item.summary || {};
        const dataValues = [
            s.total_distance || 0,
            s.duration_seconds || 0,
            s.average_pace || 0,
            s.average_heart_rate || 0,
            s.total_calories || 0,
            s.elevation_gain || 0
        ];
        // Цвета на основе hue
        const hue = 360 * (idx / sessions.length);
        const border = `hsl(${hue}, 100%, 40%)`;
        const fill = `hsla(${hue}, 100%, 40%, 0.4)`;

        return {
            label: item.session_id || `Session ${idx + 1}`,
            data: dataValues,
            fill: true,
            backgroundColor: fill,
            borderColor: border,
            borderWidth: 2,
            pointBackgroundColor: border,
            tension: 0.3
        };
    });

    // Определяем максимум для шкалы
    const allValues = [];
    allDataSets.forEach(ds => ds.data.forEach(val => allValues.push(val)));
    const maxVal = allValues.length ? Math.max(...allValues) : 10;

    // Инициализируем Chart.js
    const ctx = document.getElementById('dataChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: allDataSets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: '#ccc' },
                    grid: { color: '#ccc' },
                    suggestedMin: 0,
                    suggestedMax: maxVal * 1.2 || 10
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'right'
                },
                tooltip: {
                    usePointStyle: true
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuad'
            }
        }
    });
});
