var mobiles = [];
var inputs = document.getElementsByClassName('inputData');
var table = document.getElementById('table');
var thead = table.children[0];
var trhead = thead.children[0];
var tbody = table.children[1];
var trEdit;
var trSave;
var pageService = new PageService();
var sels = ['selBrand', 'selModel', 'selProcessor', 'selDiagonal', 'selROM', 'selRAM'];
var currentSelValue;

document.getElementById('btnLoad').addEventListener('click', function() {
    var xhttp;
    var txtDoc;

    xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (xhttp.status == 200 && xhttp.readyState == 4) {
            txtDoc = xhttp.responseText;

            var mobile = JSON.parse(txtDoc);

            for (var i = 0; i < mobile.length; i++) {
                var objMobile = new Mobile(mobile[i].BRAND, mobile[i].Model, mobile[i].PROCESSOR, mobile[i].Diagonal, mobile[i].ROM, mobile[i].RAM);

                objMobile.addTable();
                mobiles.push(objMobile);
                objMobile.setSelection('yellow');
                objMobile.btnDel();
                // objMobile.setSel();
                objMobile.setDblClick();

                document.getElementById('btnClear').disabled = false;
            }
        }
    }
    xhttp.open('GET', 'http://localhost:8080/lesson17.sortArrayObjects/ajax/mobile.json', true);
    xhttp.send();
});

function SortTheTable(type, sort, index) {
    this.type = type;
    this.sort = sort;
    this.index = index;
    // this.setAttrSort = function() {
    //     trhead.addEventListener('click', function(e) {
    //         var currentCellIndex = e.target.cellIndex;
    //         var dataType = e.target.getAttribute('data-type');
    //         var typeSort = e.target.getAttribute('type-sort');
    //
    //         if (typeSort == '0') {
    //             e.target.setAttribute('type-sort', '1');
    //             typeSort = '1';
    //         } else if (typeSort == '1') {
    //             e.target.setAttribute('type-sort', '-1');
    //             typeSort = '-1';
    //         } else {
    //             e.target.setAttribute('type-sort', '1');
    //             typeSort = '1';
    //         }
    //
    //         var cells = this.children;
    //
    //         for (var i = 0; i < cells.length; i++) {
    //             if (i != currentCellIndex) {
    //                 cells[i].setAttribute('type-sort', '0')
    //             }
    //         }
    //         console.log(currentCellIndex + ' - текущая ячейка ' + dataType + ' - тип данных ячейки ' + typeSort + ' - сортировка')
    //     });
    // }
    // this.tableSort = function() {
    //     var rowsArray = Array.from(tbody.rows);
    //
    //     var compare;
    //
    //     switch (type) {
    //         case 'string':
    //         // var a = rowA.cells[index].innerHTML;
    //         // var b = rowB.cells[index].innerHTML;
    //             compare = function(rowA, rowB) {
    //                 if (rowA.cells[index].innerHTML > rowB.cells[index].innerHTML) {
    //                     return 1 * sort;
    //                 } else if (rowA.cells[index].innerHTML == rowB.cells[index].innerHTML) {
    //                     return 0 * sort;
    //                 } else {
    //                     return -1 * sort;
    //                 }
    //             }
    //             break;
    //         case 'number':
    //             compare = function(rowA, rowB) {
    //                 return (parseFloat(rowA.cells[index].innerHTML) - parseFloat(rowB.cells[index].innerHTML)) * sort;
    //             }
    //             break;
    //     }
    //     rowsArray.sort(compare);
    //
    //     table.removeChild(tbody);
    //
    //     for (var i = 0; i < rowsArray.length; i++) {
    //         tbody.appendChild(rowsArray[i]);
    //     }
    //     // table.appendChild(tbody);
    // }
}

// функция добавления строки с элементами в таблицу
function Mobile(brand, model, processor, diagonal, rom, ram) {
    this.brand = brand;
    this.model = model;
    this.processor = processor;
    this.diagonal = diagonal;
    this.rom = rom;
    this.ram = ram;
    this.trCurrent = document.createElement('tr');
    this.trCreate = function() {
        var tdBrand = document.createElement('td');
        tdBrand.innerHTML = this.brand;

        var tdModel = document.createElement('td');
        tdModel.innerHTML = this.model;

        var tdProcessor = document.createElement('td');
        tdProcessor.innerHTML = this.processor;

        var tdDiagonal = document.createElement('td');
        tdDiagonal.innerHTML = this.diagonal;

        var tdRom = document.createElement('td');
        tdRom.innerHTML = this.rom;

        var tdRam = document.createElement('td');
        tdRam.innerHTML = this.ram;

        this.trCurrent.appendChild(tdBrand);
        this.trCurrent.appendChild(tdModel);
        this.trCurrent.appendChild(tdProcessor);
        this.trCurrent.appendChild(tdDiagonal);
        this.trCurrent.appendChild(tdRom);
        this.trCurrent.appendChild(tdRam);

    }
    this.addTable = function() { // добавление в таблицу введённых в поля текста
        this.trCreate();
        tbody.appendChild(this.trCurrent);
    }
//-------------------------------------------------------------------------
    this.correctSelect = function() {
        for (var i = 0; i < sels.length; i++) {
            var currentSelect = document.getElementById(sels[i]);
            var currentCell = this.trCurrent.children[i];

            if (currentSelect.innerHTML.indexOf(currentCell.innerHTML) == -1) {
                var option = document.createElement('option');
                option.innerHTML = currentCell.innerHTML;

                currentSelect.appendChild(option);
            }
        }
     }
//----------------------------------------------------------------------------
    this.setSel = function() { // формирование фильтрующих списков на основе ячеек текущей строки
        var cells = this.trCurrent.children;

        for (var i = 0; i < cells.length; i++) {
            var currentSels = document.getElementById(sels[i]);
            if (currentSels.innerHTML.indexOf(cells[i].innerHTML) == -1) { // если в соответствуещем списке Select не встрeчаeтся сожержимое соответсвующей ячейки текущей строки , то добавить в список содержимое данной ячейки ,Как элемент списка
                var option = document.createElement('option');

                option.value = cells[i].innerHTML;
                option.innerHTML = cells[i].innerHTML;

                currentSels.appendChild(option);
            }
        }
    }
    this.setSelection = function(color) { // выделения строк для удаления
        this.trCurrent.addEventListener('click', function() {
            if (this.style.backgroundColor == color) {
                this.style.backgroundColor = 'white';
            } else {
                this.style.backgroundColor = color;
            }
            pageService.setDel();
        });
    }
    this.setDblClick = function() { // при двойном клике в поле для вводатекста попадаеют значения строки покоторойклацнули
        this.trCurrent.addEventListener('dblclick', function() {
            var cells = this.children;

            inputs[0].value = cells[0].innerHTML;
            inputs[1].value = cells[1].innerHTML;
            inputs[2].value = cells[2].innerHTML;
            inputs[3].value = cells[3].innerHTML;
            inputs[4].value = cells[4].innerHTML;
            inputs[5].value = cells[5].innerHTML;

            trSave = this;
            document.getElementById('btnSave').disabled = false;
        });
    }
    this.btnDel = function() { // удаление строки , если она жёлтая
        var btnDel = document.getElementById('btnDel')
        btnDel.addEventListener('click', function() {
            var tr = tbody.children;
            for (var i = tr.length - 1; i >= 0; i--) {
                if (tr[i].style.backgroundColor == 'yellow') {
                    tbody.removeChild(tr[i]);

                    mobiles.splice(i, 1); // splice для удаления из массива , i - номер элемента подлежащего удалению , 1 - количество удаляемых элементов , начиная с указаного номера

                }
            }
            btnDel.disabled = true;
        });
    }
}


function TableService() { // фильтрация таблицы
//     var currentSelValue = []; // массив для хранения текущих значений фильтрующих списков, который меняется из метода clearSelect, до момента фильтрации
    this.clearLists = function() {
        for (var i = 0; i < sels.length; i++) {
            var currentSels = document.getElementById(sels[i]);

            // selIndex считывает номер выбранного значения , currentSelValue - по номеру выбраного значения определяет само значение
            var selIndex = currentSels.selectedIndex;
            currentSelValue[i] = currentSels.options[selIndex].innerHTML;
            // сохранение текущего выбора всех фильтрующих списков
            console.log(selIndex + ' ' + currentSelValue);

            currentSels.innerHTML = '';

            var option = document.createElement('option');

            option.value = 'all';
            option.innerHTML = 'all';

            currentSels.appendChild(option);
        }
    }
    this.filter = function() {
        tbody.innerHTML = '';

        for (var i = 0; i < mobiles.length; i++) {
            var condition = true; // помещаем строку в таблицу , подходит под условие фильтрации
            for (var j = 0; j < sels.length; j++) {
                var selIndex = document.getElementById(sels[j]).selectedIndex;

                 var curSelValue = currentSelValue[j]; // взять значение из ренее полученого 'снимка' фильтрующих списков

                   // document.getElementById(sels[j]).options[selIndex].innerHTML; // получить выбранный элемент из текущего фильтруещего списка
                // console.log( selIndex + ' ' + currentSelValue);
                if (curSelValue != 'all' && curSelValue != mobiles[i].trCurrent.children[j].innerHTML) {
                    condition = false;
                }
            }
            if (condition) {
                tbody.appendChild(mobiles[i].trCurrent);
                mobiles[i].correctSelect(); // корректируем наши списки добавляемой в табицу строкой(строкой подходящей под фильтр)
            }
        }
    }
    this.setSelectedIndex = function() {
        // debugger;
        for (var i = 0; i < sels.length; i++) {
            var selIndex;
            var currentSels = document.getElementById(sels[i]);
            for (var j = 0; j < currentSels.options.length; j++) {
                if (currentSels.options[j].value == currentSelValue[i]) {
                    selIndex = j;
                }
            }
            currentSels.selectedIndex = selIndex;
        }
        console.log(currentSelValue);
    }
}



// функция для коррекции таблицы
function PageService() {
    this.clearFields = function() { // для очистки полей ввода текста
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].value = '';
        }
        document.getElementById('btnAdd').disabled = true;
    }
    this.checkFields = function() { // для активации кнопки btnAdd
        var resultCondition = false;
        for (var i = 0; i <= 2; i++) {
            if (inputs[i].value == '') {
                resultCondition = true;
            }
        }
        for (var i = 3; i < inputs.length; i++) {
            if (isNaN(parseInt(inputs[i].value))) {
                resultCondition = true;
            }
        }
        document.getElementById('btnAdd').disabled = resultCondition;
    }
    this.setDel = function() { // активация кнопки btnDel , если строка жёлтая
        var btnDel = document.getElementById('btnDel');
        var tr = tbody.children;
        for (var i = tr.length - 1; i >= 0; i--) {
            if (tr[i].style.backgroundColor == 'yellow') {
                return btnDel.disabled = false;
            }
        }
        return btnDel.disabled = true;
    }
    this.addEventSel = function() { // изменения списка sel по клику
        for (var i = 0; i < sels.length; i++) {
            document.getElementById(sels[i]).addEventListener('change', function() {
                var tblServ = new TableService();

                tblServ.clearLists();
                tblServ.filter();
                tblServ.setSelectedIndex();
            });
        }
    }
}


// функция вызова событий
function Events() {
    this.btnAdd = function() { // при клике на btnAdd добавляется ведённый в поля текст в таблицу
        document.getElementById('btnAdd').addEventListener('click', function() {
            var mobile = new Mobile(inputs[0].value, inputs[1].value, inputs[2].value, parseFloat(inputs[3].value),  parseFloat(inputs[4].value), parseFloat(inputs[5].value));

            mobile.addTable();
            mobiles.push(mobile);
            pageService.clearFields();
            mobile.setDblClick();
            mobile.setSelection('yellow');
            mobile.btnDel();

            document.getElementById('btnClear').disabled = false;
        });
    }
    this.keyup = function() { // для активации кнопки btnAdd с помощью ввода текста с клавиатуры
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('keyup', function() {
                pageService.checkFields();
            });
        }
    }
    this.btnClear = function() { // очищение всей таблицы
        var btnClear = document.getElementById('btnClear')
        btnClear.addEventListener('click', function() {
            tbody.innerHTML = '';
            mobiles = [];
            btnClear.disabled = true;
        });
    }
    this.btnSave = function() { // сохранение редактируемой строки в полях ввода текста
        var btnSave = document.getElementById('btnSave');
        btnSave.addEventListener('click', function() {
            var cells = trSave.children;

            cells[0].innerHTML = inputs[0].value;
            cells[1].innerHTML = inputs[1].value;
            cells[2].innerHTML = inputs[2].value;
            cells[3].innerHTML = inputs[3].value;
            cells[4].innerHTML = inputs[4].value;
            cells[5].innerHTML = inputs[5].value;

            pageService.clearFields();
            btnSave.disabled = true;
        });
    }
    this.setAttrSort = function() {
        trhead.addEventListener('click', function(e) {
            var currentCellIndex = e.target.cellIndex;
            var dataType = e.target.getAttribute('data-type');
            var typeSort = e.target.getAttribute('type-sort');

            if (typeSort == '0') {
                e.target.setAttribute('type-sort', '1');
                typeSort = '1';
            } else if (typeSort == '1') {
                e.target.setAttribute('type-sort', '-1');
                typeSort = '-1';
            } else {
                e.target.setAttribute('type-sort', '1');
                typeSort = '1';
            }

            var cells = this.children;

            for (var i = 0; i < cells.length; i++) {
                if (i != currentCellIndex) {
                    cells[i].setAttribute('type-sort', '0')
                }
            }
            console.log(currentCellIndex + ' - текущая ячейка ' + dataType + ' - тип данных ячейки ' + typeSort + ' - сортировка')
        });
    }
}

var events = new Events();
events.btnAdd();
events.keyup();
events.btnClear();
events.btnSave();
pageService.addEventSel();
// var sortTheTable = new SortTheTable(dataType, typeSort, currentCellIndex);
events.setAttrSort();
// sortTheTable.tableSort();
