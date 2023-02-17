export default class propValSlider extends HTMLElement {
  content = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, quas quidem! Dolorem cum pariatur officia, reiciendis sit dolore quam at odit. Mollitia porro recusandae nulla delectus quidem laborum tenetur adipisci impedit voluptate nesciunt ea vitae, incidunt error, possimus eius debitis placeat doloremque tempore dolore deserunt eligendi? Corporis eaque consequatur, eveniet iure omnis dolore, repudiandae iusto vitae perferendis aliquam dolor perspiciatis facere temporibus. Illo obcaecati et doloribus culpa molestiae voluptatibus praesentium aspernatur asperiores perferendis minus expedita adipisci, nam provident ipsum quibusdam ullam harum sint dolore fuga, explicabo error nostrum? Eveniet, officia. Vitae voluptate porro officiis quo, aperiam, incidunt quis impedit assumenda rem, optio officia hic dolore quasi possimus quod nam nostrum nobis inventore? Quo soluta voluptatem accusantium molestiae perferendis distinctio sunt quisquam ex quae numquam atque odio, ea id libero, placeat nesciunt laboriosam natus iusto neque, repellat eveniet quasi est. Et quae error nihil ipsum corrupti nobis saepe atque fugit quasi, velit fugiat minus dolore ex. Libero placeat unde eaque officia asperiores expedita nemo tenetur in tempore ex dolores sapiente, voluptates nulla omnis numquam fugiat eligendi nihil reiciendis autem sunt vitae. Perferendis quam provident saepe assumenda consectetur numquam eligendi ad ducimus ab nostrum beatae quo aspernatur odio magni eum nobis recusandae, dolor at voluptas placeat velit maxime exercitationem maiores eos. Deleniti debitis dolor ea natus quis culpa fugiat. Ab quod autem quis id expedita, iure velit assumenda provident accusamus similique a cupiditate veniam doloremque accusantium ipsum repellat explicabo vero dignissimos commodi. Voluptatum sequi beatae asperiores omnis, mollitia in modi eligendi suscipit, voluptas, saepe nesciunt perferendis dignissimos quos repudiandae reiciendis ullam quas tempore consequuntur vero ut? Dolore autem sunt doloremque commodi necessitatibus harum? Ex odit reiciendis corrupti dolorum iusto exercitationem ducimus sapiente consectetur nulla nam, pariatur, enim laboriosam velit rem accusamus nobis? Amet placeat voluptatem officiis consequatur necessitatibus dolore aut modi dicta quod error veniam iusto minus tempore quis ducimus qui rerum porro reprehenderit sint, itaque non? Hic assumenda aspernatur vero veritatis magnam? Dolore, cupiditate omnis impedit quod soluta error ad rerum accusamus rem harum odio autem, vero sapiente totam maxime illum eius ipsum voluptatem recusandae aspernatur molestiae amet quos? Nobis repellendus id, reprehenderit dolorem iste vitae sapiente rem quod minima? Delectus distinctio eius unde dignissimos asperiores corrupti aliquam, dolor consectetur ab doloribus natus vitae itaque adipisci quibusdam hic necessitatibus deleniti reiciendis maxime, quis neque nobis voluptas sit ipsam? Officia beatae asperiores totam accusantium sapiente dolores ipsa quos obcaecati rem soluta ex cum accusamus, labore temporibus nesciunt nam incidunt provident? Minima accusantium laboriosam, quam mollitia est vitae vero voluptatem perspiciatis quaerat magni commodi, vel nisi. Qui placeat, harum, ullam dolor numquam architecto alias amet, ad ipsa aspernatur voluptas. Nesciunt quam porro asperiores perspiciatis natus nobis consectetur aut quibusdam facilis similique hic vel in, error laudantium ut. Ratione quo aliquam unde alias mollitia dolores animi, est deserunt architecto ipsam, fuga, optio corporis facere eius perspiciatis consequuntur quibusdam qui quas doloremque culpa officiis beatae error exercitationem iste. Laborum quos optio dolorem ex soluta, quo dolor nesciunt sapiente officia suscipit in tempore modi! Quo, obcaecati?'

  constructor() {
    super();
    this.getParameter();
    const sRoot = this.attachShadow({ mode: 'open' })
    const slider = this.createSlider();
    const frame = this.createFrame();
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
  }

  createFrame() {
    const frame = document.createElement('div');
    frame.style.display = 'grid';
    frame.style.gridTemplateColumns = '3fr  auto';
    frame.style.border = '1px solid black';
    frame.style.paddingLeft = '.3em';
    frame.style.paddingRight = '.6em';
    frame.setAttribute('part', 'frame');
    return frame;
  }

  createSlider() {
    const slider = document.createElement('input');
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

  createInfo(slider) {
    // zwei Elemente: current + max
    const elNrMax = this.createInfoFragment(this.max, 3);
    const elNrCur = this.createInfoFragment(this.startValue, 1);
    const elCut = this.createInfoFragment('/', 2);
    elCut.style.textAlign = 'center';
    elNrCur.style.textAlign = 'right';
    const grid = document.createElement('span');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = '3fr 1fr 3fr';
    grid.style.paddingLeft = '.3em';
    //grid.style.position = 'relative';
    //grid.style.top = "0em"
    grid.gridColumnStart = '2';
    slider.addEventListener('input', this.refreshNumber(elNrCur))
    grid.appendChild(elNrCur);
    grid.appendChild(elCut);
    grid.appendChild(elNrMax);
    return grid;
  }

  createInfoFragment(textContent, gridTempCol) {
    const el = document.createElement('span');
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
    if (this.destPropertyUnit === 'contentLength')
      this.setPropertyValue(el, this.destPropertyName, this.contentGenerator(this.startValue));
    else {
      this.setPropertyValue(el, this.destPropertyName, this.startValue + this.destPropertyUnit)
    }
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
    console.log(arr[arr.length - 1])
    el[arr[arr.length - 1]] = value;
    return
  }
}

customElements.define("prop-val-slider", propValSlider);