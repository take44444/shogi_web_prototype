/* eslint-disable */

function updateKifuTable(moves, csaData) {
    var move = csaData[moves];
    var tbody = document.getElementById('kifu_tbody');
    var newRow = tbody.insertRow();
    newRow.outerHTML =
    `<tr${moves%2?'':' class="even"'}><th>${moves}</th><td>${move}</td><tr>`;
    var tr = tbody.getElementsByTagName('tr')[moves - 1];
    tbody.scrollTop = tr.offsetTop;
}