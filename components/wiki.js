import { upgradeInfo, InventoryDefault, commisionInfo } from "../modules/dictData.js";
import { getHighestKey } from "../modules/functions.js";
import { permUpgrades } from "../modules/defaultData.js";

// let testing = (localStorage.getItem('tester') === 'true') ? true : false;
// if (testing) {
//     const mainEle = document.querySelector('.hide-tester');
//     mainEle.classList.remove('hide-tester');
// }

const openPanelButton = document.getElementById('close-sidebar');
const mobilePanelButton = document.getElementById('mobile-close-sidebar');
const sidePanel = document.getElementById('wiki-side');
const wikiBody = document.getElementById('wiki-body');

const createTable = (parentEle, dict, dir, imageDir, itemProps) => {
    for (let key in dict) {
        const row = document.createElement('tr');
    
        const rowCellOne = document.createElement('td');
        const charImage = new Image();
        charImage.src = `${dir}${dict[key][imageDir]}.webp`;
        rowCellOne.appendChild(charImage);
        row.appendChild(rowCellOne);
        
        itemProps.forEach((itemType) => {
            const rowCellData = document.createElement('td');
            rowCellData.innerText = dict[key][itemType];
            row.appendChild(rowCellData);
        })
    
        const rowId = document.createElement('td');
        rowId.innerText = key;
        row.appendChild(rowId);
        parentEle.append(row);
    }
}

// CHARACTERS
let currentShownEle = `text-block-1`;

const togglePage = (id) => {
    const newId = `text-block-${id}`;
    if (currentShownEle === newId) {
        return;
    } else {
        const pageEle = document.getElementById(`text-block-${id}`);
        const oldEle = document.getElementById(currentShownEle);

        oldEle.style.display = 'none';
        pageEle.style.display = 'block';
        currentShownEle = newId;
    }
}

for (let index = 1; index < 17; index++) {
    const buttonElement = document.getElementById(`toggle-button-${index}`);
    if (!buttonElement) {break}
    buttonElement.addEventListener('click', () => {
        togglePanel(true);
        togglePage(index);
    })
}

const charTable = document.getElementById('table-char');
const charProps = ['Name', 'Type', 'Ele', 'Nation'];
createTable(charTable, upgradeInfo, '../assets/tooltips/hero/', 'Name', charProps);
document.getElementById('charCount').innerText = Object.keys(upgradeInfo).length;
const heroWishCount = getHighestKey(upgradeInfo) - 800 + 1;
document.getElementById('normCount').innerText = Object.keys(upgradeInfo).length - heroWishCount;
document.getElementById('wishCount').innerText = heroWishCount;

// ITEMS
const itemTable = document.getElementById('item-char');
const itemProps = ['Name', 'Type', 'Star'];
createTable(itemTable, InventoryDefault, '../assets/tooltips/inventory/', 'File', itemProps);

const spoilerEle = document.querySelectorAll('.spoiler');
spoilerEle.forEach((ele) => {
    ele.addEventListener('click', () => {
        if (ele.classList.contains('revealed')) {
            ele.classList.remove('revealed');
        } else {
            ele.classList.add('revealed');
        }
    })
});

const openEle = document.querySelectorAll('.open');
openEle.forEach((openDiv) => {
    const textDiv = openDiv.querySelector('div');
    textDiv.style.display = 'none';
    const button = openDiv.querySelector('.open-button');
    button.addEventListener('click', () => {
        if (textDiv.style.display === 'none') {
            button.innerText = '[Hide]';
            textDiv.style.display = 'block';
        } else {
            button.innerText = '[Expand]'
            textDiv.style.display = 'none';
        }
    });
});

const togglePanel = (forceClose = false) => {
    if (sidePanel.style.display === 'flex' || forceClose) {
        openPanelButton.innerText = '>';
        sidePanel.style.display = 'none';
        wikiBody.style.width = "100%";
    } else {
        openPanelButton.innerText = '<';
        sidePanel.style.display = 'flex';
        wikiBody.style.width = "calc(100% - 16rem)";
    }
}

sidePanel.style.display = 'none';
wikiBody.style.width = "100%";
openPanelButton.addEventListener('click', () => {
    togglePanel();
});

mobilePanelButton.addEventListener('click', () => {
    togglePanel();
});

const blessingTableOne = document.getElementById('blessing-1');
const blessingTableTwo = document.getElementById('blessing-2');
for (let i = 1; i < 20; i++) {
    const tableRow = document.createElement('tr');
    const tableName = document.createElement('td');
    const tableDesc = document.createElement('td');
    const tableCap = document.createElement('td');
    
    tableName.innerText = permUpgrades[i].Name;
    tableDesc.innerText = permUpgrades[i].Description;
    tableCap.innerText = permUpgrades[i].Cap ? `Yes (${permUpgrades[i].Max} Lvls)` : "No";
    tableRow.append(tableName, tableDesc, tableCap);

    if (i < 13) {
        blessingTableOne.appendChild(tableRow);
    } else {
        blessingTableTwo.appendChild(tableRow);
    }
}

const commTable = document.getElementById('comm-table');
for (let key in commisionInfo) {
    const tableRow = document.createElement('tr');
    const tableName = document.createElement('td');
    const tableLike = document.createElement('td');
    const tableDislike = document.createElement('td');
    const tableStrLike = document.createElement('td');
    const tableStrDislike = document.createElement('td');
    const tableProf = document.createElement('td');
    
    tableProf.innerText = commisionInfo[key].power.join(', ');
    tableName.innerText = key;
    tableLike.innerText = commisionInfo[key].charLikes.join(', ');
    tableDislike.innerText = commisionInfo[key].charDislikes.join(', ');
    tableStrLike.innerText = commisionInfo[key].charStrongLike.join(', ');
    tableStrDislike.innerText = commisionInfo[key].charStrongDislikes.join(', ');
    tableRow.append(tableName, tableStrLike, tableLike, tableDislike, tableStrDislike, tableProf);

    [tableLike, tableDislike, tableStrLike, tableStrDislike].forEach((ele) => {
        ele.innerText = ele.innerText === '' ? '-' : ele.innerText;
    });

    commTable.append(tableRow);
}
console.log(commisionInfo)