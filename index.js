

export default class propValSlider extends HTMLElement {
	constructor() {
		super();
		this.getParameter();
		const sRoot = this.attachShadow({ mode: 'open' })
		this.dlgMax = this.createDlg(sRoot, 'max', () => {
			const el = this.dlgMax.querySelector('#txtInput')
			this.setInfoMax(sRoot, el.value);
			this.dlgMax.close();
		});
		this.dlgMin = this.createDlg(sRoot, 'min', () => {
			const el = this.dlgMax.querySelector('#txtInput')
			this.setInfoMin(sRoot, el.value);
			this.dlgMax.close();
		});
		const slider = this.createSlider();
		const frame = this.createFrame(this.label);
		frame.appendChild(slider)
		if (this.showNr) {
			const info = this.createInfo(slider);
			frame.appendChild(info);
		}
		sRoot.appendChild(frame);
		if (this.startValue) {
			this.setStartValue();
		}
	}

	getParameter() {
		this.destId = this.getAttribute('destId');
		this.showNr = this.getAttribute('showNr') == null ? false : true;
		this.startValue = this.getAttribute('startValue');
		this.min = this.getAttribute('min') == null ? 1 : this.getAttribute('min');
		this.max = this.getAttribute('max') == null ? 1 : this.getAttribute('max');
		this.numberPosition = this.getAttribute('pos') == null ? 'right' : this.getAttribute('pos');
		this.destPropertyName = this.getAttribute('destPropName');
		this.destPropertyUnit = this.getAttribute('destPropUnit') === null ? '' : this.getAttribute('destPropUnit');
		this.sameContent = false;
		if (this.getAttribute('sameContent') === 'true') {
			this.sameContent = true;
		}
		if (this.destPropertyUnit === "contentLength") {
			if (!this.destPropertyName) {
				this.destPropertyName = "textContent";
			}
		}
		let label;
		if (this.getAttribute('label') != null) {
			if (this.destPropertyUnit === "contentLength") {
				label = `${this.destId}.${this.destPropertyName}`;
			} else {
				label = `${this.destId}.${this.destPropertyName} (${this.destPropertyUnit})`;
			}
			this.label = label;
		}
		if (this.startValue === null) {
			this.startValue = this.getCurrentPopertyValue();
		}
	}

	createFrame(labelText) {
		const frame = document.createElement('div');
		frame.style.display = 'grid';
		if (labelText) {
			frame.style.gridTemplateColumns = 'minmax(10em, max-content) 1fr max-content';
			frame.appendChild(this.createLabel(labelText))
		} else {
			frame.style.gridTemplateColumns = '1fr auto';
		}
		frame.style.border = '1px solid black';
		frame.style.paddingLeft = '.3em';
		frame.style.paddingRight = '.6em';
		frame.setAttribute('part', 'frame');
		return frame;
	}

	createLabel(labelText) {
		const elLabel = document.createElement('div');
		elLabel.textContent = labelText;
		elLabel.setAttribute('part', 'label');
		return (elLabel);
	}

	createSlider() {
		const slider = document.createElement('input');
		slider.id = 'slider'
		slider.type = 'range';
		slider.min = this.min;
		slider.max = this.max;
		slider.value = this.startValue;
		slider.gridColumnStart = '1';
		slider.style.display = 'inline';
		slider.addEventListener('change', this.doChange());
		slider.setAttribute('part', 'slider')
		return slider;
	}

	getCurrentPopertyValue() {
		let el = document.getElementById(this.destId);
		const propertyPath = this.destPropertyName
		if (propertyPath.indexOf('.') == -1) {
			if (this.destPropertyUnit === 'contentLength') {
				return el[propertyPath].length
			} else {
				return el[propertyPath];
			}

		}
		let arr = propertyPath.split('.');  // bis auf das letzte abschneiden!
		for (let i = 0; i < arr.length - 1; i++) {
			el = el[arr[i]];
		}
		console.log(el[arr[arr.length - 1]]);
		if (el instanceof CSSStyleDeclaration) {
			const compStyle = window.getComputedStyle(document.getElementById(this.destId));
			return compStyle[arr[arr.length - 1]]
		} else {
			return el[arr[arr.length - 1]];
		}
	}

	createInfo(slider) {
		// zwei Elemente: current + max
		const elNrMax = this.createInfoFragment(this.max, 3, 'infoMax');
		const elNrCur = this.createInfoFragment(this.startValue, 1, 'infoCur');
		const elCut = this.createInfoFragment('/', 2, 'infoCut');
		elCut.style.textAlign = 'center';
		elNrCur.style.textAlign = 'right';
		const grid = document.createElement('span');
		grid.style.display = 'grid';
		grid.style.gridTemplateColumns = 'max-content max-content max-content';
		grid.style.paddingLeft = '.3em';
		grid.gridColumnStart = '2';
		slider.addEventListener('input', this.refreshNumber(elNrCur));
		elNrCur.addEventListener('click', this.showDlgMin);
		elNrMax.addEventListener('click', this.showDlgMax);
		grid.appendChild(elNrCur);
		grid.appendChild(elCut);
		grid.appendChild(elNrMax);
		return grid;
	}

	showDlgMax = (ev) => {
		this.showDlg(ev, this.dlgMax)
	}

	showDlgMin = (ev) => {
		this.showDlg(ev, this.dlgMin)
	}

	showDlg = (ev, dlg) => {
		dlg.style.visibility = 'hidden';
		dlg.show();
		const rect = dlg.getBoundingClientRect();
		dlg.style.left = `${ev.clientX - rect.width}px`;
		dlg.style.top = `${ev.clientY}px`;
		dlg.style.visibility = 'visible';
	}


	setInfoMax = (sRoot, val) => {
		const elMax = sRoot.querySelector('#infoMax');
		this.max = val;
		const slider = sRoot.querySelector('#slider');
		slider.max = val;
		elMax.textContent = val;
	}

	setInfoMin = (sRoot, val) => {
		const elMin = sRoot.querySelector('#infoMin');
		this.min = val;
		const slider = sRoot.querySelector('#slider');
		slider.min = val;
		elMax.textContent = val;
	}

	createInfoFragment(textContent, gridTempCol, id) {
		const el = document.createElement('div');
		el.id = id;
		if (textContent) {
			el.textContent = textContent;
		}
		el.style.gridColumnStart = gridTempCol.toString();
		el.setAttribute('part', 'info');
		return el;
	}

	refreshNumber(el) {
		return function (ev) {
			el.textContent = ev.target.value;
		}
	}

	contentGenerator = (length) => {
		if (!this.lorem) {
			this.lorem = new Lorem();
		}
		if (this.sameContent) {
			if (!this.content) {
				this.content = this.lorem.getText(this.max);
			}
			if (length > this.content.length) {
				this.content += this.lorem.getText(length - this.content.length);
			}
			return this.content.substring(0, length);
		} else {
			return this.lorem.getText(length);
		}
	}


	doChange = () => {
		const el = document.getElementById(this.destId);
		return (ev) => {
			if (this.destPropertyUnit === 'contentLength')
				this.setPropertyValue(el, this.destPropertyName, this.contentGenerator(ev.target.value));
			else {
				this.setPropertyValue(el, this.destPropertyName, ev.target.value + this.destPropertyUnit)
			}
		}
	}

	setStartValue = () => {
		const el = document.getElementById(this.destId);
		let val;
		if (this.destPropertyUnit === 'contentLength')
			val = this.contentGenerator(this.startValue)
		else {
			val = this.startValue + this.destPropertyUnit;
		}
		this.setPropertyValue(el, this.destPropertyName, val);
	}


	setPropertyValue(el, propertyPath, value) {
		if (propertyPath.indexOf('.') == -1) {
			el[propertyPath] = value;
			return;
		}
		let arr = propertyPath.split('.');  // bis auf das letzte abschneiden!
		for (let i = 0; i < arr.length - 1; i++) {
			el = el[arr[i]];
		}
		el[arr[arr.length - 1]] = value;
		return
	}

	createDlg(sRoot, type, callback) {

		let dlg = document.createElement('dialog');
		dlg.style.position = 'absolute';
		dlg.style.height = 'min-content';
		dlg.style.zIndex = 999;
		dlg.style.margin = '0px';
		dlg.style.paddingTop = '0.3em'
		dlg.style.backgroundColor = 'blanchedalmond';


		let grid = document.createElement('div');
		grid.style.display = 'grid'
		grid.style.gridTemplateColumns = 'min-content fit-content(400px)';
		grid.style.gridTemplateRows = 'auto auto auto';
		grid.style.gap = '0.5em';
		grid.style.padding = '0em';
		grid.style.alignItems = 'center';

		const divCaption = document.createElement('div');
		if (type === 'min') {
			divCaption.textContent = 'Set the minimum range';
		} else {
			divCaption.textContent = 'Set the maximum range';
		}
		divCaption.textContent += ' for ' + this.destId;
		divCaption.style.paddingBottom = '0.2em';
		divCaption.style.marginBottom = '0.3em';
		divCaption.style.gridRow = '1';
		divCaption.style.gridColumn = '1/4';
		divCaption.style.textAlign = 'center';
		divCaption.style.borderBottom = '1px black solid';
		grid.appendChild(divCaption);

		const label = document.createElement('label');
		if (this.destPropertyUnit === 'contentLength') {
			label.innerText = 'content length'
		} else {
			label.innerText = `${this.destPropertyName} (${this.destPropertyUnit})`
		}
		label.style.alignSelf = 'start';
		label.style.gridRow = '2/4';
		label.style.gridColumn = '1';
		grid.appendChild(label);

		const divInput = document.createElement('div');
		divInput.style.display = 'flex';
		divInput.style.gridRow = "2";
		divInput.style.gridColumn = "2"
		const textBox = document.createElement('input');
		textBox.type = 'text';
		textBox.value = type === 'min' ? this.min : this.max;
		textBox.id = 'txtInput';
		divInput.appendChild(textBox);

		grid.appendChild(divInput);

		const flexButtons = document.createElement('div');
		flexButtons.style.display = 'flex';
		flexButtons.style.flexFlow = 'nowrap';
		flexButtons.style.gridRow = "3";
		flexButtons.style.gridColumn = "2";
		flexButtons.style.marginTop = "0.3em";
		const btnCancel = document.createElement('input');
		btnCancel.type = 'button';
		btnCancel.value = 'cancel'
		btnCancel.style.width = '50%';
		btnCancel.style.marginRight = '0.3em';
		btnCancel.addEventListener("click", () => { dlg.close() });


		const btnOk = document.createElement('input');
		btnOk.value = 'ok'
		btnOk.type = 'button';
		btnOk.style.width = '50%';
		btnOk.style.autofocus = true;
		btnOk.addEventListener("click", callback);
		// Buttons umgekehrt einfügen, da flex-direction: row-reverse;
		flexButtons.appendChild(btnCancel);
		flexButtons.appendChild(btnOk);

		grid.appendChild(flexButtons);
		dlg.appendChild(grid);
		return sRoot.appendChild(dlg);
	}
}

export class Lorem {
	words = ["ad", "adipisicing", "aliqua", "aliquip", "amet", "anim", "aute", "cillum", "commodo", "consectetur", "consequat", "culpa", "cupidatat", "deserunt", "do", "dolor", "dolore", "duis", "ea", "eiusmod", "elit", "enim", "esse", "est", "et", "eu", "ex", "excepteur", "exercitation", "fugiat", "id", "in", "incididunt", "ipsum", "irure", "labore", "laboris", "laborum", "Lorem", "magna", "minim", "mollit", "nisi", "non", "nostrud", "nulla", "occaecat", "officia", "pariatur", "proident", "qui", "quis", "reprehenderit", "sint", "sit", "sunt", "tempor", "ullamco", "ut", "velit", "veniam", "voluptate"];
	// 6.596774193548387 ist die durchschnittliche Worlänge;
	static magicNumber = 7;
	constructor() {
		this.countWords = this.words.length;
	}

	getText(length) {
		let result = ''
		while (result.length < length) {
			result += this.words[this.generateRandomInteger(0, this.countWords)] + ' ';
		}
		return result;
	}

	generateRandomInteger(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
	}
}

customElements.define("prop-val-slider", propValSlider);