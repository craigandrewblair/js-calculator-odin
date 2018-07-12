window.onload = function onload() {
  // Global Variables
  let line1 = ' ';
  let lastNum = '';
  let numArr = [];
  let histArr = [];
  let line1Arr = [];

  function displayCursor() {
    document.querySelector('#cursor-div').style.display = 'block';
    document.querySelector('#dsp-line-1').style.display = 'none';
  }

  function displayLine1() {
    document.querySelector('#cursor-div').style.display = 'none';
    document.querySelector('#dsp-line-1').style.display = 'block';
  }

  function update() {
    document.querySelector('#dsp-line-1').textContent = line1;
    document.querySelector('#dsp-line-2').textContent = histArr[histArr.length - 1];
    document.querySelector('#dsp-line-3').textContent = histArr[histArr.length - 2];
    return line1 === ' ' || line1 === '' ? displayCursor() : displayLine1();
  }

  function backspace() {
    let arr = line1.split('');
    if (arr[0] === '-' && arr[1] === ' ' && arr.length === 2) {
      arr = [' '];
      line1 = arr.join('');
      return update();
    }
    if (arr.length > 1) {
      if (arr[arr.length - 1].match(/[0-9]/g) && arr.length > 1) {
        arr.pop();
        line1 = arr.join('');
        return update();
      }
      while (arr[arr.length - 1].match(/[^0-9]/g) && arr.length > 1) {
        arr.pop();
        line1 = arr.join('');
      }
    }
    return update();
  }

  function getNumArr() {
    const arr = line1.split(' ');
    numArr = arr.filter(elem => elem.match(/\d/g));
    return numArr;
  }

  function clear() {
    line1 = ' ';
    return update();
  }

  function cancel() {
    line1 = ' ';
    lastNum = '';
    numArr = [];
    histArr = [];
    return update();
  }

  function cancelEntry() {
    line1 = ' ';
    lastNum = '';
    numArr = [];
    return update();
  }

  function undo() {
    if (histArr.length > 0) {
      let str = histArr[histArr.length - 1];
      let arr = str.split(' ');
      arr = arr.slice(0, arr.length - 2);
      str = arr.join(' ');
      line1 = str;
      histArr.pop();
      update();
    }
  }

  function calculate(inputArr) {
    const operatorArray = ['/', '*', '-', '+'];
    const funcOperatorArr = [
      function divideFunc(before, after) { return before / after; },
      function muliplyFunc(before, after) { return before * after; },
      function minusFunc(before, after) { return before - after; },
      function plusFunc(before, after) { return before + after; },
      function negDivideFunc(before, after) { return before / -after; },
      function negMuliplyFunc(before, after) { return before * -after; },
      function negMinusFunc(before, after) { return before - -after; },
      function negPlusFunc(before, after) { return before + -after; },
    ];
    let before;
    let after;
    let arr = [].concat(inputArr);
    if (arr[0] === '-') {
      arr.unshift('0');
    }
    for (let i = 0; i <= arr.length; i += 1) {
      if (arr[i] === '/' && arr[i + 1] === '-') {
        let result = 0;
        before = parseFloat(arr[i - 1]);
        after = parseFloat(arr[i + 2]);
        result = before / -after;
        arr[i] = result;
        arr[i - 1] = '';
        arr[i + 1] = '';
        arr[i + 2] = '';
        arr = arr.filter(elem => elem !== '');
        i = 0;
      }
    }
    for (let i = 0; i <= arr.length; i += 1) {
      if (arr[i] === '/') {
        let result = 0;
        before = parseFloat(arr[i - 1]);
        after = parseFloat(arr[i + 1]);
        result = before / after;
        arr[i] = result;
        arr[i - 1] = '';
        arr[i + 1] = '';
        arr = arr.filter(elem => elem !== '');
        i = 0;
      }
    }
    for (let i = 0; i <= arr.length; i += 1) {
      if (arr[i] === '*' && arr[i + 1] === '-') {
        let result = 0;
        before = parseFloat(arr[i - 1]);
        after = parseFloat(arr[i + 2]);
        result = before * -after;
        arr[i] = result;
        arr[i - 1] = '';
        arr[i + 1] = '';
        arr[i + 2] = '';
        arr = arr.filter(elem => elem !== '');
        i = 0;
      }
    }
    for (let i = 0; i <= arr.length; i += 1) {
      if (arr[i] === '*') {
        let result = 0;
        before = parseFloat(arr[i - 1]);
        after = parseFloat(arr[i + 1]);
        result = before * after;
        arr[i] = result;
        arr[i - 1] = '';
        arr[i + 1] = '';
        arr = arr.filter(elem => elem !== '');
        i = 0;
      }
    }
    for (let i = 0; i <= arr.length; i += 1) {
      if (arr[i] === '+' && arr[i + 1] === '-') {
        arr[i] = '-';
        arr[i + 1] = '';
        arr = arr.filter(elem => elem !== '');
      }
    }
    for (let i = 0; i <= arr.length; i += 1) {
      if (arr[i] === '-' && arr[i + 1] === '-') {
        arr[i] = '+';
        arr[i + 1] = '';
        arr = arr.filter(elem => elem !== '');
      }
    }
    for (let i = 0; i <= arr.length; i += 1) {
      if (arr[i] === '-') {
        let result = 0;
        before = parseFloat(arr[i - 1]);
        after = parseFloat(arr[i + 1]);
        result = before - after;
        arr[i] = result;
        arr[i - 1] = '';
        arr[i + 1] = '';
        arr = arr.filter(elem => elem !== '');
        i = 0;
      }
    }
    for (let i = 0; i <= arr.length; i += 1) {
      if (arr[i] === '+') {
        let result = 0;
        before = parseFloat(arr[i - 1]);
        after = parseFloat(arr[i + 1]);
        result = before + after;
        arr[i] = result;
        arr[i - 1] = '';
        arr[i + 1] = '';
        arr = arr.filter(elem => elem !== '');
        i = 0;
      }
    }
    return arr;
  }

  function equals() {
    const line1Str = line1.trim();
    line1Arr = line1Str.split(' ');
    if (line1.charAt(line1.length - 1).match(/[0-9]/g)) {
      line1 += ` = ${calculate(line1Arr)}`;
      histArr.push(line1);
      clear();
    }
  }

  // Prevents multiple invalid consecutive operator inputs
  function validateNumAndAppend(str) {
    if (line1.charAt(line1.length - 1).match(/[^0-9]/g) || line1 === '') {
      return update();
    }
    line1 += str;
    return update();
  }

  // Soft EventListener Declarations
  const buttons = document.querySelectorAll('.btn-circle');
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      if (button.id === 'btn-minus') {
        if (line1.charAt(line1.length - 4).match(/[0-9]/g) && line1.charAt(line1.length - 3) === ' ' && (line1.charAt(line1.length - 2) === '*' || line1.charAt(line1.length - 2) === '/' || line1.charAt(line1.length - 2) === '-' || line1.charAt(line1.length - 2) === '+') && line1.charAt(line1.length - 1) === ' ') {
          line1 += '- ';
          return update();
        }
        if (line1 === ' ') {
          line1 = '- ';
          return update();
        }
        if (line1.charAt(line1.length - 1).match(/[^0-9]/g) || line1 === '') {
          return line1;
        }
        line1 += ' - ';
        return update();
      }
      if (button.textContent.match(/[0-9]/g)) {
        line1 += button.textContent;
      }
      switch (button.id) {
        case 'btn-plus':
          validateNumAndAppend(' + ');
          break;
        case 'btn-divide':
          validateNumAndAppend(' / ');
          break;
        case 'btn-multiply':
          validateNumAndAppend(' * ');
          break;
        case 'btn-decimal':
          lastNum = numArr[numArr.length - 1];
          if (lastNum.match(/\./gi)) {
            return line1;
          }
          validateNumAndAppend('.');
          break;
        case 'btn-undo':
          undo();
          break;
        case 'btn-backspace':
          backspace();
          break;
        case 'btn-cancel':
          cancel();
          break;
        case 'btn-ce':
          cancelEntry();
          break;
        case 'btn-equals':
          equals();
          break;
      // no default
      }
      getNumArr();
      return update();
    });
  });

  // Hard EventListeners
  document.addEventListener('keydown', (e) => {
    switch (e.which) {
      case 13: // enter
        equals();
        break;
      case 8: // backspace
        backspace();
        break;
      case 27: // escape
        cancel();
        break;
      default: return;
    }
    e.preventDefault();
  });

  update();
};
