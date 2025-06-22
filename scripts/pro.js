class GlobalManager {
	constructor() {
		this.mode = 0;
		this.shomei = document.getElementById("Shomei");
		this.hashira = document.getElementById("Hashira");
		this.jinmei = document.getElementById("Jinmei");
		this.zakki = document.getElementById("Zakki");
		this.textEntry = document.getElementById("TextEntry");
		this.textEntry.addEventListener("focus", () => {this.textEntry.select();});
		this.indexSearch = document.getElementById("IndexSearch");
		this.indexSearch.addEventListener("click", searchIndex);
		this.eraseEntry = document.getElementById("EraseEntry");
		this.eraseEntry.addEventListener("click", eraseTextEntry);
		this.joukan = document.getElementById("Joukan");
		this.chuukan = document.getElementById("Chuukan");
		this.gekan = document.getElementById("Gekan");
		this.seigo = document.getElementById("Seigo");
		this.seigo.addEventListener("click", openErrata);
		this.pageEntry = document.getElementById("PageEntry");
		this.pageEntry.addEventListener("focus", () => {this.pageEntry.select();});
		this.openPage = document.getElementById("OpenPage");
		this.openPage.addEventListener("click", openDirect);
		this.erasePage = document.getElementById("ErasePage");
		this.erasePage.addEventListener("click", erasePageEntry);
		document.addEventListener("keyup", (evt) => {
			if (evt.key == "Enter") {
				if (isElementFocused(this.pageEntry)) {
					openDirect();
					this.pageEntry.focus();
				} else if (evt.shiftKey) {
					searchIndex();
					this.textEntry.focus();
				}
			} else if (evt.key == "Escape") {
				if (isElementFocused(this.pageEntry)) {
					erasePageEntry();
				} else if (isElementFocused(this.textEntry)) {
					eraseTextEntry();
				}
			}
		});
		//
		this.idxURL = "https://dl.ndl.go.jp/pid/12450340/1/";
		this.urls = [
			"https://dl.ndl.go.jp/pid/12450337/1/",
			"https://dl.ndl.go.jp/pid/12450338/1/",
			"https://dl.ndl.go.jp/pid/12450339/1/",
		];
		this.pageOffsets = [13, 10, 9];
	}
}
const G = new GlobalManager();
const R = new Regulator();

function setMode() {
	if (G.shomei.classList.contains("selected")) G.mode = 0;
	else if (G.hashira.classList.contains("selected")) G.mode = 1;
	else if (G.jinmei.classList.contains("selected")) G.mode = 2;
	else G.mode = 3;
}

function searchIndex() {
	setMode();
	let target = G.textEntry.value;
	target = target.replace(/[ァ-ン]/g, (s) => {
		return String.fromCharCode(s.charCodeAt(0) - 0x60);
	});
	let rTarget = R.regulate(target);
	if (rTarget.length == 0)  return;
	let idx = bigIndex[G.mode].length - 1;
	while ((idx >= 0) && (bigIndex[G.mode][idx] > rTarget)) {
		idx--;
	}
	const page = bigIndex[G.mode][0] + idx;
	windowOpen(G.idxURL + page, "索引検索結果");
}

function openDirect() {
	const vPage = G.pageEntry.value;
	if (!vPage.match(/^[0-9０-９]+$/))  return;
	let vol = 0;
	if (G.joukan.classList.contains("selected")) vol = 0;
	else if (G.chuukan.classList.contains("selected")) vol = 1;
	else vol = 2;
	const rPage = Math.trunc(Number(vPage) / 2) + G.pageOffsets[vol];
	windowOpen(G.urls[vol] + rPage, "検索結果");
}


document.addEventListener('DOMContentLoaded', function() {
	const toggleButtons = document.querySelectorAll('.toggle-button');
	if (toggleButtons.length > 0) {
		toggleButtons[G.mode].classList.add('selected');
	}

	toggleButtons.forEach(button => {
		button.addEventListener('click', function() {
			toggleButtons.forEach(btn => {
				btn.classList.remove('selected');
			});
			this.classList.add('selected');
			G.textEntry.focus();
		});
	});
	//////////
	const toggleButtons2 = document.querySelectorAll('.toggle-button2');
	if (toggleButtons2.length > 0) {
		toggleButtons2[0].classList.add('selected');
	}

	toggleButtons2.forEach(button => {
		button.addEventListener('click', function() {
			toggleButtons2.forEach(btn => {
				btn.classList.remove('selected');
			});
			this.classList.add('selected');
			G.pageEntry.focus();
		});
	});
});

function eraseTextEntry() {
	G.textEntry.value = "";
	G.textEntry.focus();
}

function erasePageEntry() {
	G.pageEntry.value = "";
	G.pageEntry.focus();
}

function openErrata() {
	const page = G.pageEntry.value;
	if (!page.match(/^[0-9０-９]+$/))  return;
	let vol = 0;
	if (G.joukan.classList.contains("selected")) vol = 0;
	else if (G.chuukan.classList.contains("selected")) vol = 1;
	else vol = 2;
	let idx = errataIndex[vol][1].length - 1;
	while ((idx >= 0) && (errataIndex[vol][1][idx] > Number(page))) {
		idx--;
	}
	const ePage = errataIndex[vol][0] + idx;
	windowOpen(G.idxURL + ePage, "正誤・追補画面");
}

function windowOpen(url, title) {
	window.open(url, title);
	G.textEntry.focus();
}

function isElementFocused(elem) {
	return document.activeElement === elem && document.hasFocus();
}
