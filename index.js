export default class propValSlider extends HTMLElement {
	content = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, quas quidem! Dolorem cum pariatur officia, reiciendis sit dolore quam at odit. Mollitia porro recusandae nulla delectus quidem laborum tenetur adipisci impedit voluptate nesciunt ea vitae, incidunt error, possimus eius debitis placeat doloremque tempore dolore deserunt eligendi? Corporis eaque consequatur, eveniet iure omnis dolore, repudiandae iusto vitae perferendis aliquam dolor perspiciatis facere temporibus. Illo obcaecati et doloribus culpa molestiae voluptatibus praesentium aspernatur asperiores perferendis minus expedita adipisci, nam provident ipsum quibusdam ullam harum sint dolore fuga, explicabo error nostrum? Eveniet, officia. Vitae voluptate porro officiis quo, aperiam, incidunt quis impedit assumenda rem, optio officia hic dolore quasi possimus quod nam nostrum nobis inventore? Quo soluta voluptatem accusantium molestiae perferendis distinctio sunt quisquam ex quae numquam atque odio, ea id libero, placeat nesciunt laboriosam natus iusto neque, repellat eveniet quasi est. Et quae error nihil ipsum corrupti nobis saepe atque fugit quasi, velit fugiat minus dolore ex. Libero placeat unde eaque officia asperiores expedita nemo tenetur in tempore ex dolores sapiente, voluptates nulla omnis numquam fugiat eligendi nihil reiciendis autem sunt vitae. Perferendis quam provident saepe assumenda consectetur numquam eligendi ad ducimus ab nostrum beatae quo aspernatur odio magni eum nobis recusandae, dolor at voluptas placeat velit maxime exercitationem maiores eos. Deleniti debitis dolor ea natus quis culpa fugiat. Ab quod autem quis id expedita, iure velit assumenda provident accusamus similique a cupiditate veniam doloremque accusantium ipsum repellat explicabo vero dignissimos commodi. Voluptatum sequi beatae asperiores omnis, mollitia in modi eligendi suscipit, voluptas, saepe nesciunt perferendis dignissimos quos repudiandae reiciendis ullam quas tempore consequuntur vero ut? Dolore autem sunt doloremque commodi necessitatibus harum? Ex odit reiciendis corrupti dolorum iusto exercitationem ducimus sapiente consectetur nulla nam, pariatur, enim laboriosam velit rem accusamus nobis? Amet placeat voluptatem officiis consequatur necessitatibus dolore aut modi dicta quod error veniam iusto minus tempore quis ducimus qui rerum porro reprehenderit sint, itaque non? Hic assumenda aspernatur vero veritatis magnam? Dolore, cupiditate omnis impedit quod soluta error ad rerum accusamus rem harum odio autem, vero sapiente totam maxime illum eius ipsum voluptatem recusandae aspernatur molestiae amet quos? Nobis repellendus id, reprehenderit dolorem iste vitae sapiente rem quod minima? Delectus distinctio eius unde dignissimos asperiores corrupti aliquam, dolor consectetur ab doloribus natus vitae itaque adipisci quibusdam hic necessitatibus deleniti reiciendis maxime, quis neque nobis voluptas sit ipsam? Officia beatae asperiores totam accusantium sapiente dolores ipsa quos obcaecati rem soluta ex cum accusamus, labore temporibus nesciunt nam incidunt provident? Minima accusantium laboriosam, quam mollitia est vitae vero voluptatem perspiciatis quaerat magni commodi, vel nisi. Qui placeat, harum, ullam dolor numquam architecto alias amet, ad ipsa aspernatur voluptas. Nesciunt quam porro asperiores perspiciatis natus nobis consectetur aut quibusdam facilis similique hic vel in, error laudantium ut. Ratione quo aliquam unde alias mollitia dolores animi, est deserunt architecto ipsam, fuga, optio corporis facere eius perspiciatis consequuntur quibusdam qui quas doloremque culpa officiis beatae error exercitationem iste. Laborum quos optio dolorem ex soluta, quo dolor nesciunt sapiente officia suscipit in tempore modi! Quo, obcaecati?'

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
		this.min = this.getAttribute('min');
		this.max = this.getAttribute('max');
		this.numberPosition = this.getAttribute('pos') == null ? 'right' : this.getAttribute('pos');
		this.destPropertyName = this.getAttribute('destPropName');
		this.destPropertyUnit = this.getAttribute('destPropUnit') === null ? '' : this.getAttribute('destPropUnit');
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
		return this.content.substring(0, length);
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



customElements.define("prop-val-slider", propValSlider);