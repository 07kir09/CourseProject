////////////////////////////////////////////////////
// Импорт сторонних библиотек
////////////////////////////////////////////////////
import { Buffer } from 'buffer';
window.Buffer = Buffer; // Чтобы в браузере был доступен Buffer

import process from 'process';
window.process = process; // Чтобы в браузере был доступен process

import { ethers } from 'ethers';
import { upload, download } from 'thirdweb/storage';
import CryptoJS from 'crypto-js';
import * as sigUtil from '@metamask/eth-sig-util';

// Забираем переменные из process.env, проброшенные через webpack DefinePlugin
const THIRDWEB_CLIENT_ID = process.env.THIRDWEB_CLIENT_ID;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const CONTRACT_ABI = [{"type":"constructor","stateMutability":"undefined","payable":false,"inputs":[]},{"type":"error","name":"ERC721IncorrectOwner","inputs":[{"type":"address","name":"sender"},{"type":"uint256","name":"tokenId"},{"type":"address","name":"owner"}]},{"type":"error","name":"ERC721InsufficientApproval","inputs":[{"type":"address","name":"operator"},{"type":"uint256","name":"tokenId"}]},{"type":"error","name":"ERC721InvalidApprover","inputs":[{"type":"address","name":"approver"}]},{"type":"error","name":"ERC721InvalidOperator","inputs":[{"type":"address","name":"operator"}]},{"type":"error","name":"ERC721InvalidOwner","inputs":[{"type":"address","name":"owner"}]},{"type":"error","name":"ERC721InvalidReceiver","inputs":[{"type":"address","name":"receiver"}]},{"type":"error","name":"ERC721InvalidSender","inputs":[{"type":"address","name":"sender"}]},{"type":"error","name":"ERC721NonexistentToken","inputs":[{"type":"uint256","name":"tokenId"}]},{"type":"error","name":"OwnableInvalidOwner","inputs":[{"type":"address","name":"owner"}]},{"type":"error","name":"OwnableUnauthorizedAccount","inputs":[{"type":"address","name":"account"}]},{"type":"event","anonymous":false,"name":"Approval","inputs":[{"type":"address","name":"owner","indexed":true},{"type":"address","name":"approved","indexed":true},{"type":"uint256","name":"tokenId","indexed":true}]},{"type":"event","anonymous":false,"name":"ApprovalForAll","inputs":[{"type":"address","name":"owner","indexed":true},{"type":"address","name":"operator","indexed":true},{"type":"bool","name":"approved","indexed":false}]},{"type":"event","anonymous":false,"name":"BatchMetadataUpdate","inputs":[{"type":"uint256","name":"_fromTokenId","indexed":false},{"type":"uint256","name":"_toTokenId","indexed":false}]},{"type":"event","anonymous":false,"name":"DataAdded","inputs":[{"type":"string","name":"userId","indexed":false},{"type":"string","name":"ipfsHash","indexed":false},{"type":"string","name":"encryptedAESKey","indexed":false},{"type":"uint256","name":"timestamp","indexed":false}]},{"type":"event","anonymous":false,"name":"DataDeleted","inputs":[{"type":"string","name":"userId","indexed":false},{"type":"uint256","name":"index","indexed":false}]},{"type":"event","anonymous":false,"name":"DataUpdated","inputs":[{"type":"string","name":"userId","indexed":false},{"type":"uint256","name":"index","indexed":false},{"type":"string","name":"newIpfsHash","indexed":false},{"type":"string","name":"newEncryptedAESKey","indexed":false}]},{"type":"event","anonymous":false,"name":"MetadataUpdate","inputs":[{"type":"uint256","name":"_tokenId","indexed":false}]},{"type":"event","anonymous":false,"name":"OwnershipTransferred","inputs":[{"type":"address","name":"previousOwner","indexed":true},{"type":"address","name":"newOwner","indexed":true}]},{"type":"event","anonymous":false,"name":"Transfer","inputs":[{"type":"address","name":"from","indexed":true},{"type":"address","name":"to","indexed":true},{"type":"uint256","name":"tokenId","indexed":true}]},{"type":"function","name":"approve","constant":false,"payable":false,"inputs":[{"type":"address","name":"to"},{"type":"uint256","name":"tokenId"}],"outputs":[]},{"type":"function","name":"balanceOf","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"address","name":"owner"}],"outputs":[{"type":"uint256","name":""}]},{"type":"function","name":"checkUserExists","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"string","name":"userId"}],"outputs":[{"type":"bool","name":""}]},{"type":"function","name":"clearUserFitnessData","constant":false,"payable":false,"inputs":[{"type":"string","name":"userId"}],"outputs":[]},{"type":"function","name":"deleteUserFitnessData","constant":false,"payable":false,"inputs":[{"type":"string","name":"userId"},{"type":"uint256","name":"index"}],"outputs":[]},{"type":"function","name":"getApproved","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"uint256","name":"tokenId"}],"outputs":[{"type":"address","name":""}]},{"type":"function","name":"getUserFitnessData","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"string","name":"userId"}],"outputs":[{"type":"tuple[]","name":"","components":[{"type":"string","name":"ipfsHash"},{"type":"string","name":"encryptedAESKey"},{"type":"uint256","name":"timestamp"}]}]},{"type":"function","name":"isApprovedForAll","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"address","name":"owner"},{"type":"address","name":"operator"}],"outputs":[{"type":"bool","name":""}]},{"type":"function","name":"listAllUsers","constant":true,"stateMutability":"view","payable":false,"inputs":[],"outputs":[{"type":"string[]","name":""}]},{"type":"function","name":"name","constant":true,"stateMutability":"view","payable":false,"inputs":[],"outputs":[{"type":"string","name":""}]},{"type":"function","name":"owner","constant":true,"stateMutability":"view","payable":false,"inputs":[],"outputs":[{"type":"address","name":""}]},{"type":"function","name":"ownerOf","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"uint256","name":"tokenId"}],"outputs":[{"type":"address","name":""}]},{"type":"function","name":"renounceOwnership","constant":false,"payable":false,"inputs":[],"outputs":[]},{"type":"function","name":"safeTransferFrom","constant":false,"payable":false,"inputs":[{"type":"address","name":"from"},{"type":"address","name":"to"},{"type":"uint256","name":"tokenId"}],"outputs":[]},{"type":"function","name":"safeTransferFrom","constant":false,"payable":false,"inputs":[{"type":"address","name":"from"},{"type":"address","name":"to"},{"type":"uint256","name":"tokenId"},{"type":"bytes","name":"data"}],"outputs":[]},{"type":"function","name":"setApprovalForAll","constant":false,"payable":false,"inputs":[{"type":"address","name":"operator"},{"type":"bool","name":"approved"}],"outputs":[]},{"type":"function","name":"storeFitnessData","constant":false,"payable":false,"inputs":[{"type":"string","name":"userId"},{"type":"string","name":"ipfsHash"},{"type":"string","name":"encryptedAESKey"}],"outputs":[]},{"type":"function","name":"supportsInterface","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"bytes4","name":"interfaceId"}],"outputs":[{"type":"bool","name":""}]},{"type":"function","name":"symbol","constant":true,"stateMutability":"view","payable":false,"inputs":[],"outputs":[{"type":"string","name":""}]},{"type":"function","name":"tokenURI","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"uint256","name":"tokenId"}],"outputs":[{"type":"string","name":""}]},{"type":"function","name":"transferFrom","constant":false,"payable":false,"inputs":[{"type":"address","name":"from"},{"type":"address","name":"to"},{"type":"uint256","name":"tokenId"}],"outputs":[]},{"type":"function","name":"transferOwnership","constant":false,"payable":false,"inputs":[{"type":"address","name":"newOwner"}],"outputs":[]},{"type":"function","name":"updateUserFitnessData","constant":false,"payable":false,"inputs":[{"type":"string","name":"userId"},{"type":"uint256","name":"index"},{"type":"string","name":"newIpfsHash"},{"type":"string","name":"newEncryptedAESKey"}],"outputs":[]}];
const WALLET_PRIVATE_KEY = process.env.LOCAL_PRIVATE_KEY;

// thirdweb client (если используете thirdweb)
import { createThirdwebClient } from 'thirdweb';
const client = createThirdwebClient({ clientId: "3f7ea9dbfcdc8079c39087ed3a4ebfd0" });

// Глобальная переменная для контракта
let fitnessContract;


////////////////////////////////////////////////////
// Инициализация контракта
////////////////////////////////////////////////////
async function initContract() {
  try {
    const provider = new ethers.JsonRpcProvider();
    // Или укажите конкретный RPC, например:
    // const provider = new ethers.JsonRpcProvider("https://goerli.infura.io/v3/XXXXXX");

    const signer = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
    fitnessContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    console.log('Contract initialized at:', fitnessContract.address);
  } catch (error) {
    console.error('Error initializing contract:', error);
  }
}


////////////////////////////////////////////////////
// MetaMask: подключение и получение публичного ключа
////////////////////////////////////////////////////
// Функция для установки состояния блокчейн-кнопок (работает для элементов, которые являются <div>)
// Мы будем добавлять класс .disabled, который определен в CSS
function setBlockchainButtonsEnabled(enabled) {
  const ids = [
    'btnUploadToChain',
    'btnRetrieveFromChain',
    'btnUpdateDataChain',
    'btnListUsers',
    'btnClearUserData'
  ];
  ids.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      if (enabled) {
        btn.classList.remove('disabled');
      } else {
        btn.classList.add('disabled');
      }
    }
  });
}

// При загрузке страницы блокируем кнопки
document.addEventListener('DOMContentLoaded', () => {
  const goBackButton = document.getElementById('goBackButton');
  if (goBackButton) {
    goBackButton.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  } else {
    console.error('Элемент goBackButton не найден');
  }
  setBlockchainButtonsEnabled(false);
});

// В функции connectWallet, после успешного подключения:
async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      const connectText = document.getElementById('connectText');
      if (connectText) {
        connectText.textContent = `${account.slice(0, 6)}...${account.slice(-4)}`;
      }
      console.log('Connected account:', account);
      // Разблокировка блокчейн-кнопок
      setBlockchainButtonsEnabled(true);
    } catch (error) {
      alert('Ошибка при подключении MetaMask');
      console.error(error);
    }
  } else {
    alert('MetaMask не обнаружена. Установите расширение.');
  }
}


// Ассиметричное шифрование
function encryptMessage(publicKey, message) {
  const buf = Buffer.from(
      JSON.stringify(
          sigUtil.encrypt({
            publicKey,
            data: message,
            version: 'x25519-xsalsa20-poly1305'
          })
      ),
      'utf8'
  );
  return '0x' + buf.toString('hex');
}

// Ассиметричное расшифрование через MetaMask
async function decryptMessage(encryptedMessage) {
  try {
    const provider = window.ethereum;
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    const decrypted = await provider.request({
      method: 'eth_decrypt',
      params: [encryptedMessage, account],
    });
    console.log("Decrypted Message:", decrypted);
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw error;
  }
}


// Получить публичный ключ MetaMask
async function getMetaMaskEncryptionPublicKey() {
  const provider = window.ethereum;
  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];
  const publicKey = await provider.request({
    method: 'eth_getEncryptionPublicKey',
    params: [account],
  });
  return publicKey;
}


////////////////////////////////////////////////////
// AES-шифрование IPFS-хэша (симметричное)
////////////////////////////////////////////////////
function encryptIPFSHash(hash) {
  const key = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
  const encryptedHash = CryptoJS.AES.encrypt(hash, key).toString();
  return { encryptedHash, encryptionKey: key };
}


////////////////////////////////////////////////////
// IPFS (thirdweb) — upload & download
////////////////////////////////////////////////////
async function uploadToIPFS(file) {
  const ipfsHash = await upload({ client, files: [file] });
  console.log("Uploaded IPFS Hash:", ipfsHash);
  return ipfsHash;
}

async function retrieveFromIPFS(ipfsHash) {
  // Скачиваем файл
  const file = await download({ client, uri: ipfsHash });
  const text = await file.text();
  console.log("Retrieved JSON Content: ", text);
  return JSON.parse(text);
}


////////////////////////////////////////////////////
// Логика загрузки и чтения данных (из первого проекта)
// но адаптированная под UI второго проекта
////////////////////////////////////////////////////

// Пример: Загрузить содержимое dataInput на IPFS, шифровать, сохранить в контракт
async function uploadToChain() {
  const dataInput = document.getElementById('dataInput');
  if (!dataInput.value) {
    alert('Нет JSON-данных в поле!');
    return;
  }

  // Парсим
  const fileContent = JSON.parse(dataInput.value);

  // Показать "loading"
  showLoading(true, 'Uploading data...');

  try {
    // 1) Загрузить в IPFS
    console.log("Отправляемые данные в IPFS:", fileContent);
    const ipfsHash = await uploadToIPFS(fileContent);
    // 2) Сгенерировать AES-ключ, зашифровать IPFS-hash
    const { encryptedHash, encryptionKey } = encryptIPFSHash(ipfsHash);
    console.log("Initial AES Key:", encryptionKey);
    // 3) Получить pubkey MetaMask, зашифровать AES-ключ
    const publicKey = await getMetaMaskEncryptionPublicKey();
    const encryptedAESKey = encryptMessage(publicKey, encryptionKey);
    // 4) Записать всё это в контракт
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];

    const tx = await fitnessContract.storeFitnessData(account, encryptedHash, encryptedAESKey);
    const receipt = await tx.wait();

    console.log("storeFitnessData transaction hash:", receipt.transactionHash);

    alert('Uploaded to chain successfully!');
    console.log("Encrypted IPFS Hash:", encryptedHash);
    console.log("Encrypted AES Key:", encryptedAESKey);
  } catch (error) {
    console.error(error);
    alert('Ошибка при загрузке на блокчейн');
  } finally {
    // Скрыть "loading"
    showLoading(false);
  }
}

// Пример: считать последний entry
async function retrieveFromChain() {
  const dataInput = document.getElementById('dataInput');
  showLoading(true, 'Retrieving data...');

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    const userFitnessData = await fitnessContract.getUserFitnessData(account);

    if (!userFitnessData.length) {
      alert('Нет записей в контракте для данного аккаунта');
      return;
    }
    // Берём последнюю запись
    const lastEntry = userFitnessData[userFitnessData.length - 1];
    const { ipfsHash, encryptedAESKey } = lastEntry;

    // Расшифровываем AES-ключ через MetaMask
    const decryptedAESKey = await decryptMessage(encryptedAESKey);
    console.log("Decrypted AES Key:", decryptedAESKey);
    // Расшифровываем IPFS-хэш
    const decryptedIPFSHash = CryptoJS.AES.decrypt(ipfsHash, decryptedAESKey).toString(CryptoJS.enc.Utf8);
    console.log("Decrypted IPFS Hash:", decryptedIPFSHash);

    // Скачиваем JSON
    const fileContent = await retrieveFromIPFS(decryptedIPFSHash);
    console.log("File content retrieved from IPFS:", fileContent);

    // Выведем в dataInput и в таблицу
    dataInput.value = JSON.stringify(fileContent, null, 2);
    renderDataTable(fileContent);

  } catch (error) {
    console.error(error);
    alert('Ошибка при чтении данных');
  } finally {
    showLoading(false);
  }
}

// Пример: обновить конкретный entry (просит номер записи)
async function updateDataEntry() {
  const entryNumber = prompt("Enter the entry number to update:");
  if (entryNumber === null || entryNumber === "") {
    alert("Entry number is required.");
    return;
  }

  const dataInput = document.getElementById('dataInput');
  if (!dataInput.value) {
    alert('Нет JSON-данных!');
    return;
  }

  showLoading(true, 'Updating data...');
  try {
    const fileContent = JSON.parse(dataInput.value);

    // Заливаем в IPFS
    const ipfsHash = await uploadToIPFS(fileContent);
    const { encryptedHash, encryptionKey } = encryptIPFSHash(ipfsHash);

    // Зашифровать AES-ключ
    const publicKey = await getMetaMaskEncryptionPublicKey();
    const encryptedAESKey = encryptMessage(publicKey, encryptionKey);

    // Вызываем updateUserFitnessData
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];
    const tx = await fitnessContract.updateUserFitnessData(account, entryNumber, encryptedHash, encryptedAESKey);
    await tx.wait();

    alert(`Entry #${entryNumber} успешно обновлён!`);

  } catch (error) {
    console.error(error);
    alert('Ошибка при обновлении записи');
  } finally {
    showLoading(false);
  }
}

async function listAllUsers() {
  showLoading(true, 'Fetching all data for the current account...');
  try {
    // Получаем текущий аккаунт из MetaMask
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    // Получаем все записи для текущего аккаунта
    const userFitnessData = await fitnessContract.getUserFitnessData(account);
    if (!userFitnessData || userFitnessData.length === 0) {
      alert("Нет записей для данного аккаунта");
      return;
    }

    // Здесь будем складывать все объекты так, как они были изначально загружены
    const finalRecords = [];

    for (let i = 0; i < userFitnessData.length; i++) {
      const { ipfsHash, encryptedAESKey } = userFitnessData[i];

      // 1. Расшифровываем AES‑ключ
      const decryptedAESKey = await decryptMessage(encryptedAESKey);
      // 2. Расшифровываем IPFS‑хэш (AES)
      const decryptedIPFSHash = CryptoJS.AES.decrypt(ipfsHash, decryptedAESKey).toString(CryptoJS.enc.Utf8);
      // 3. Получаем JSON с IPFS
      let fileContent = await retrieveFromIPFS(decryptedIPFSHash);

      // Если результат пустой, пробуем URI без '/0'
      if (fileContent && Object.keys(fileContent).length === 0) {
        const baseIPFSHash = decryptedIPFSHash.replace(/\/0$/, '');
        fileContent = await retrieveFromIPFS(baseIPFSHash);
      }

      if (Array.isArray(fileContent)) {
        finalRecords.push(...fileContent); // «Разворачиваем» элементы массива
      } else {
        finalRecords.push(fileContent);
      }
    }

    // Выводим итоговый массив в консоль
    console.log("All combined data for account", account, finalRecords);

    // 2) Пишем в #dataInput
    document.getElementById("dataInput").value = JSON.stringify(finalRecords, null, 2);

    // 3) Рендерим таблицу, чтобы отобразить в привычном виде
    renderDataTable(finalRecords);

  } catch (error) {
    console.error("Error listing data for the current account:", error);
    alert("Ошибка при получении данных аккаунта");
  } finally {
    showLoading(false);
  }
}



// Пример: очистить все данные текущего пользователя
async function clearUserData() {
  if (!confirm("Вы уверены, что хотите удалить все свои записи в контракте?")) return;

  showLoading(true, 'Clearing user data...');
  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];
    const tx = await fitnessContract.clearUserFitnessData(account);
    await tx.wait();

    alert('Ваши данные очищены!');
  } catch (error) {
    console.error(error);
    alert('Ошибка при очистке данных');
  } finally {
    showLoading(false);
  }
}


////////////////////////////////////////////////////
// Drag & Drop + Рендер таблицы (из второго проекта)
////////////////////////////////////////////////////
const dataInput = document.getElementById('dataInput');
const dataTable = document.getElementById('dataTable');
const dropzone = document.getElementById('dropzone');

// (1) DRAG & DROP
dropzone.addEventListener('dragenter', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropzone.style.borderColor = '#4dabf7';
  dropzone.textContent = 'Release the file...';
});
dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});
dropzone.addEventListener('dragleave', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropzone.style.borderColor = '#ccc';
  dropzone.textContent = 'Drag and drop the data file (JSON) here';
});
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropzone.style.borderColor = '#ccc';

  const files = e.dataTransfer.files;
  if (!files.length) {
    alert('Файл не найден!');
    dropzone.textContent = 'Drag and drop the data file (JSON) here';
    return;
  }
  const file = files[0];
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const jsonData = JSON.parse(ev.target.result);
      dataInput.value = JSON.stringify(jsonData, null, 2);
      dropzone.textContent = 'The file is uploaded!';
    } catch (error) {
      alert('Error parsing JSON!');
      dropzone.textContent = 'Drag and drop the data file (JSON) here';
    }
  };
  reader.readAsText(file);
});

// (2) Пример тестовых данных
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

// (3) Функция рендера таблицы
function renderDataTable(data) {
  dataTable.innerHTML = ''; // очистить

  if (Array.isArray(data)) {
    data.forEach(session => {
      renderSession(session);
    });
  } else if (typeof data === 'object' && data !== null) {
    renderSession(data);
  } else {
    alert('Невалидные данные для таблицы!');
  }
}

function renderSession(session) {
  const tr = document.createElement('tr');

  // Колонка: session_id + кнопка раскрытия
  const tdSessionId = document.createElement('td');
  const button = document.createElement('button');
  button.textContent = '+';
  button.className = 'expand-button';

  const sessionContainer = document.createElement('div');
  sessionContainer.style.display = 'flex';
  sessionContainer.style.alignItems = 'center';
  sessionContainer.style.gap = '10px';

  sessionContainer.appendChild(button);
  sessionContainer.appendChild(document.createTextNode(session.session_id || 'No ID'));
  tdSessionId.appendChild(sessionContainer);

  // Колонка: подробности
  const tdDetails = document.createElement('td');
  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'details';
  detailsDiv.style.display = 'none';

  // Таблица подробностей
  const detailsTable = document.createElement('table');
  for (const key in session) {
    if (key !== 'session_id') {
      detailsTable.appendChild(renderField(key, session[key]));
    }
  }
  detailsDiv.appendChild(detailsTable);
  tdDetails.appendChild(detailsDiv);

  tr.appendChild(tdSessionId);
  tr.appendChild(tdDetails);
  dataTable.appendChild(tr);

  // Клик по кнопке раскрытия
  button.addEventListener('click', () => {
    if (detailsDiv.style.display === 'none') {
      detailsDiv.style.display = 'block';
      button.textContent = '-';
    } else {
      detailsDiv.style.display = 'none';
      button.textContent = '+';
    }
  });
}

function renderField(key, value) {
  const tr = document.createElement('tr');
  const tdKey = document.createElement('td');
  tdKey.textContent = key;
  const tdValue = document.createElement('td');

  if (typeof value === 'object' && value !== null) {
    const nestedTable = document.createElement('table');
    for (const nestedKey in value) {
      nestedTable.appendChild(renderField(nestedKey, value[nestedKey]));
    }
    tdValue.appendChild(nestedTable);
  } else {
    tdValue.textContent = value;
  }

  tr.appendChild(tdKey);
  tr.appendChild(tdValue);
  return tr;
}


////////////////////////////////////////////////////
// Кнопки боковой панели (загрузка из файла, тестовые данные и т.п.)
////////////////////////////////////////////////////

// Создаём скрытый input для загрузки файла
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

const btnBrowse = document.getElementById('btnBrowse');
if (btnBrowse) {
  btnBrowse.addEventListener('click', () => {
    fileInput.click();
  });
}
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
      alert('Error parsing JSON!');
      dropzone.textContent = 'Drag and drop the data file (JSON) here';
    }
  };
  reader.readAsText(file);
});

const btnUseDefault = document.getElementById('btnUseDefault');
if (btnUseDefault) {
  btnUseDefault.addEventListener('click', () => {
    dataInput.value = JSON.stringify(defaultData, null, 2);
    dropzone.textContent = 'Файл загружен!';
  });
}

const btnShowData = document.getElementById('btnShowData');
if (btnShowData) {
  btnShowData.addEventListener('click', () => {
    try {
      const parsed = JSON.parse(dataInput.value);
      renderDataTable(parsed);
    } catch (err) {
      alert('Невалидный JSON!');
    }
  });
}

const btnClearData = document.getElementById('btnClearData');
if (btnClearData) {
  btnClearData.addEventListener('click', () => {
    dataInput.value = '';
    dataTable.innerHTML = '';
    dropzone.textContent = 'Drag and drop the data file (JSON) here';
  });
}

const btnAnalytics = document.getElementById('btnAnalytics');
if (btnAnalytics) {
  btnAnalytics.addEventListener('click', () => {
    const dataInput = document.getElementById('dataInput');
    if (!dataInput || !dataInput.value.trim()) {
      alert('Нет данных для аналитики!');
      return;
    }
    // Сохраняем данные (например, JSON, в том же формате, в котором вы их загружали)
    localStorage.setItem('exSparkData', dataInput.value);
    // Перенаправляем на страницу аналитики
    window.location.href = 'analytics.html';
  });
}



////////////////////////////////////////////////////
// Кнопки на смарт-контракт
////////////////////////////////////////////////////
const btnUploadToChain = document.getElementById('btnUploadToChain');
if (btnUploadToChain) {
  btnUploadToChain.addEventListener('click', uploadToChain);
}

const btnRetrieveFromChain = document.getElementById('btnRetrieveFromChain');
if (btnRetrieveFromChain) {
  btnRetrieveFromChain.addEventListener('click', retrieveFromChain);
}

const btnUpdateDataChain = document.getElementById('btnUpdateDataChain');
if (btnUpdateDataChain) {
  btnUpdateDataChain.addEventListener('click', updateDataEntry);
}

const btnListUsers = document.getElementById('btnListUsers');
if (btnListUsers) {
  btnListUsers.addEventListener('click', listAllUsers);
}

const btnClearUserData = document.getElementById('btnClearUserData');
if (btnClearUserData) {
  btnClearUserData.addEventListener('click', clearUserData);
}

// Кнопка Connect
const connectButton = document.getElementById('connectButton');
if (connectButton) {
  connectButton.addEventListener('click', connectWallet);
}


////////////////////////////////////////////////////
// Экран загрузки (optional)
////////////////////////////////////////////////////
function showLoading(show, text) {
  const loadingScreen = document.getElementById('loadingScreen');
  if (!loadingScreen) return;

  if (show) {
    loadingScreen.style.display = 'flex';
    if (text) {
      loadingScreen.querySelector('p').textContent = text;
    }
  } else {
    loadingScreen.style.display = 'none';
  }
}


////////////////////////////////////////////////////
// Инициализация при старте
////////////////////////////////////////////////////
(async () => {
  await initContract();
  console.log('App initialized');
})();
