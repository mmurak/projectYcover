class GlobalManager {
	constructor() {
		this.titleEntry = document.getElementById("TitleEntry");
		this.indicator = document.getElementById("Indicator");
		this.searchButton = document.getElementById("SearchButton");
		this.eraseButton = document.getElementById("EraseButton");
		this.tableArea = document.getElementById("TableArea");
	}
}

const G = new GlobalManager();
window.onload = () => {
	createDB();
	clearTable();
	G.titleEntry.focus();
	G.searchButton.addEventListener("click", (evt) => {
		searchEntry();
	});
	G.eraseButton.addEventListener("click", (evt) => {
		clearEntry();
		clearTable()
	});
	window.addEventListener("keydown", (evt) => {
		if (evt.key == "Enter") searchEntry();
		if (evt.key == "Escape") {
			clearEntry();
			clearTable();
		}
	});
	window.addEventListener("focus", (evt) => {
		G.titleEntry.focus();
	});
}

function searchEntry() {
	clearTable();
	const entry = G.titleEntry.value;
	const regExp = generateRegExp(entry);
	const table = document.getElementById("ResultTable");
	let counter = 0;
	for (const dat of volOne) {
		if (dat[5].match(regExp)) {
			const newRow = table.insertRow(-1);
			const year = newRow.insertCell(0);
			const bName = newRow.insertCell(1);
			year.innerHTML = dat[1] + "年（" + dat[0] + "）";
			bName.innerHTML = "<a href='javascript:openPage(" + dat[2] + ")'>" + dat[3] + "</a>";
			if (dat[4] != "") {
				bName.innerHTML += "（" + dat[4] + "）";
			}
			counter++;
		}
	}
	G.indicator.innerHTML = counter + "件";
}

function clearEntry() {
	G.titleEntry.value = "";
	G.titleEntry.focus();
}

function clearTable() {
	G.tableArea.innerHTML = "";
	const table = document.createElement("table");
	table.id = "ResultTable";
	G.tableArea.appendChild(table);
	G.indicator.innerHTML = "0件";
}

function generateRegExp(text) {
	let strRegExp = "";
	while(text.length > 0) {
		subtext = text.substr(0, 3);
		if (subtext in triTable) {
			strRegExp += triTable[subtext];
			text = text.substring(3);
			continue;
		}
		subtext = text.substr(0, 2);
		if (subtext in diTable) {
			strRegExp += diTable[subtext];
			text = text.substring(2);
			continue;
		}
		subtext = text.substr(0, 1);
		if (subtext in monoTable) {
			strRegExp += monoTable[subtext];
		} else {
			strRegExp += subtext;
		}
		text = text.substring(1);
	}
	console.log(strRegExp);
	return new RegExp(strRegExp);
}

function createDB() {
	for (const entry of volOne) {
		let revisedSound = (entry[5] != "") ? entry[5] : entry[4];
		revisedSound = revisedSound.split("").map((x) => {	// カタカナ→ひらがな変換
			if (x in katakanaToHirakanaTable) {
				return katakanaToHirakanaTable[x];
			} else {
				return x;
			}
		}).join("");
		revisedSound = revisedSound.replaceAll(/[【/]/g, "");	// 角書1
		revisedSound = revisedSound.replaceAll(/[】]/g, " ");	// 角書2（空白送り）
		revisedSound = revisedSound.replaceAll(/(.)ゝ/g, "$1$1");	// 踊り字 ゝ 補正
		revisedSound = revertDakutenOdoriji(revisedSound);
		entry[5] = revisedSound;
	}
}

function revertDakutenOdoriji(str) {
	if (!str.includes("ゞ"))  return str;
	str = str.replaceAll(/(.)ゞ/g, "$1$1D");
	let idx = str.indexOf("D");
	while (idx != -1) {
		const key = str.substring(idx-1, idx+1);
		if (key in dakutenOdorijiTable) {
			str = str.replace(key, dakutenOdorijiTable[key]);
		} else {
			str = str.replace("D", "?");
		}
		idx = str.indexOf("D");
	}
	return str;
}

function openPage(pageInfo) {
	const urls = [
		"https://dl.ndl.go.jp/pid/12450337/1/",
		"https://dl.ndl.go.jp/pid/12450338/1/",
		"https://dl.ndl.go.jp/pid/12450339/1/",
	];
	const vol = String(Math.trunc(pageInfo / 1000));
	const page = String(pageInfo % 1000);
	window.open(urls[vol] + page, "検索結果");
	G.titleEntry.focus();
}
