/************************************
 * ИМИТАЦИЯ ЗАГРУЗКИ
 ************************************/
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) loadingScreen.style.display = 'none';
    }, 1000);
});

/************************************
 * META MASK (если нужно)
 ************************************/
const connectButton = document.getElementById('connectButton');
const connectText = document.getElementById('connectText');

if (connectButton) {
    connectButton.addEventListener('click', async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length > 0) {
                    const account = accounts[0];
                    connectText.textContent = `${account.slice(0, 6)}...${account.slice(-4)}`;
                }
            } catch (error) {
                console.error('Ошибка подключения кошелька:', error);
                alert('Ошибка при подключении MetaMask.');
            }
        } else {
            alert('MetaMask не обнаружена. Установите расширение MetaMask.');
        }
    });
}

/************************************
 * ЭЛЕМЕНТЫ UI
 ************************************/
const dataInput = document.getElementById('dataInput');
const dataTable = document.getElementById('dataTable');
const dropzone = document.getElementById('dropzone');

// Кнопки на sidebar
const btnBrowse = document.getElementById('btnBrowse');
const btnUseDefault = document.getElementById('btnUseDefault');
const btnShowData = document.getElementById('btnShowData');
const btnClearData = document.getElementById('btnClearData');
const btnAnalytics = document.getElementById('btnAnalytics');

// Скрытый input для загрузки файла
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

// Кнопка export
const exportButton = document.getElementById('exportButton');

// Тестовые данные (или можно подключить defaultData.json по fetch)
const defaultData = {
    "session_id": "RUN_20240101_001",
    "user_id": "USER_001",
    "start_time": "2024-01-01T18:00:00Z",
    "end_time": "2024-01-01T18:45:00Z",
    "summary": {
        "total_distance": 5920,
        "duration_seconds": 2700,
        "average_pace": 7.36,
        "average_heart_rate": 142,
        "total_calories": 385,
        "elevation_gain": 64
    }
};

/************************************
 * DRAG & DROP
 ************************************/
dropzone.addEventListener('dragenter', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.style.borderColor = '#4dabf7';
    dropzone.textContent = 'Отпустите файл...';
});

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

dropzone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.style.borderColor = '#ccc';
    dropzone.textContent = 'Перетащите сюда файл с данными (JSON)';
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropzone.style.borderColor = '#ccc';

    const files = e.dataTransfer.files;
    if (!files.length) {
        alert('Файл не найден!');
        dropzone.textContent = 'Перетащите сюда файл с данными (JSON)';
        return;
    }
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const jsonData = JSON.parse(ev.target.result);
            dataInput.value = JSON.stringify(jsonData, null, 2);
            dropzone.textContent = 'Файл загружен!';
        } catch (error) {
            alert('Ошибка при парсинге JSON!');
            dropzone.textContent = 'Перетащите сюда файл с данными (JSON)';
        }
    };
    reader.readAsText(file);
});

/************************************
 * ОБРАБОТЧИКИ КНОПОК (SIDEBAR)
 ************************************/
// (1) Загрузить из файла
btnBrowse.addEventListener('click', () => {
    fileInput.click();
});
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const jsonData = JSON.parse(ev.target.result);
            dataInput.value = JSON.stringify(jsonData, null, 2);
            dropzone.textContent = 'Файл загружен!';
        } catch (error) {
            alert('Ошибка при парсинге JSON!');
            dropzone.textContent = 'Перетащите сюда файл с данными (JSON)';
        }
    };
    reader.readAsText(file);
});

// (2) Тестовые данные
btnUseDefault.addEventListener('click', () => {
    dataInput.value = JSON.stringify(defaultData, null, 2);
    dropzone.textContent = 'Файл загружен!';
});

// (3) Показать данные
btnShowData.addEventListener('click', () => {
    try {
        const obj = JSON.parse(dataInput.value);
        renderDataTable(obj);
    } catch (err) {
        alert('Невалидный JSON!');
    }
});

// (4) Очистить данные
btnClearData.addEventListener('click', () => {
    dataInput.value = '';
    dataTable.innerHTML = '';
    dropzone.textContent = 'Перетащите сюда файл с данными (JSON)';
});

// (5) Перейти к аналитике
btnAnalytics.addEventListener('click', () => {
    if (!dataInput.value.trim()) {
        alert('Нет данных. Сначала загрузите или вставьте JSON.');
        return;
    }
    localStorage.setItem('exSparkData', dataInput.value);
    window.location.href = 'analytics.html'; // или любой другой URL
});

/************************************
 * EXPORT
 ************************************/
exportButton.addEventListener('click', () => {
    const rows = dataTable.querySelectorAll('tr');
    const exported = [];
    rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        if (cells.length === 2) {
            exported.push({
                field: cells[0].textContent,
                value: cells[1].textContent
            });
        }
    });

    if (exported.length === 0) {
        alert('Нет данных для экспорта!');
        return;
    }

    const blob = new Blob([JSON.stringify(exported, null, 2)], {
        type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

/************************************
 * РЕНДЕР ТАБЛИЦЫ
 ************************************/
function renderDataTable(data) {
    // Очищаем таблицу
    dataTable.innerHTML = '';

    // Начальная очередь: если data — это массив, кладём каждый элемент с индексом
    let queue = [];
    if (Array.isArray(data)) {
        // Для массива — каждый элемент на верхнем уровне
        data.forEach((item, index) => {
            queue.push({ key: `[${index}]`, value: item });
        });
    } else {
        // Для объекта — кладём единственный узел
        queue.push({ key: '', value: data });
    }

    while (queue.length) {
        const { key, value } = queue.shift();

        // Если внутри очередной value — массив
        if (Array.isArray(value)) {
            value.forEach((element, idx) => {
                queue.push({
                    key: key ? `${key}[${idx}]` : `[${idx}]`,
                    value: element
                });
            });
        }
        // Если внутри — объект
        else if (typeof value === 'object' && value !== null) {
            for (const prop in value) {
                queue.push({
                    key: key ? `${key}.${prop}` : prop,
                    value: value[prop]
                });
            }
        }
        // Иначе (строка, число, булево и т.д.)
        else {
            const tr = document.createElement('tr');
            const tdKey = document.createElement('td');
            const tdVal = document.createElement('td');

            tdKey.textContent = key;
            tdVal.textContent = value;

            tr.appendChild(tdKey);
            tr.appendChild(tdVal);
            dataTable.appendChild(tr);
        }
    }
}

