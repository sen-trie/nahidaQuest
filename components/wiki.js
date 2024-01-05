import { upgradeInfo, InventoryDefault } from "../modules/dictData.js";

let testing = (localStorage.getItem('tester') === 'true') ? true : false;
// if (testing) {
//     const mainEle = document.querySelector('.hide-tester');
//     mainEle.classList.remove('hide-tester');
// }

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

for (let index = 1; index < 16; index++) {
    const buttonElement = document.getElementById(`toggle-button-${index}`)
    buttonElement.addEventListener('click', () => {
        togglePage(index);
    })
}

const charTable = document.getElementById('table-char');
const charProps = ['Name', 'Type', 'Ele', 'Nation'];
createTable(charTable, upgradeInfo, '../assets/tooltips/hero/', 'Name', charProps);

// ITEMS
const itemTable = document.getElementById('item-char');
const itemProps = ['Name', 'Type', 'Star'];
createTable(itemTable, InventoryDefault, '../assets/tooltips/inventory/', 'File', itemProps);