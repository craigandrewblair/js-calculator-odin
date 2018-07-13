window.onload = function onload() {
  // Globals
  let line1 = ' ';
  let lastNum = '';
  let numArr = [];
  let histArr = [];
  let line1Arr = [];

  // Make green cursor visible & hide line1 content
  const displayCursor = () => {
    document.querySelector('#cursor-div').style.display = 'block';
    document.querySelector('#dsp-line-1').style.display = 'none';
  };
  // Hide green cursor & display line1 content
  const displayLine1 = () => {
    document.querySelector('#cursor-div').style.display = 'none';
    document.querySelector('#dsp-line-1').style.display = 'block';
  };

  // Update GUI elements to reflect model
  const update = () => {
    document.querySelector('#dsp-line-1').textContent = line1;
    document.querySelector('#dsp-line-2').textContent = histArr[histArr.length - 1];
    document.querySelector('#dsp-line-3').textContent = histArr[histArr.length - 2];
    return line1 === ' ' || line1 === '' ? displayCursor() : displayLine1();
  };

  // Allows user to delete latest entered character with each click (orange backspace icon)
  const backspace = () => {
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
  };

  // Filters number array of unwanted elements and returns it
  const getNumArr = () => {
    const arr = line1.split(' ');
    numArr = arr.filter(elem => elem.match(/\d/g));
    return numArr;
  };

  // Resets globals to defaults and updates view to reflect this (C)
  const cancel = () => {
    line1 = ' ';
    lastNum = '';
    numArr = [];
    histArr = [];
    line1Arr = [];
    return update();
  };

  // Sets globals relating to current calculation and updates view to reflect this (CE)
  const cancelEntry = () => {
    line1 = ' ';
    lastNum = '';
    numArr = [];
    return update();
  };

  // Retrieves the last calculation performed by the user from history array and displays ready for using again
  const undo = () => {
    if (histArr.length > 0) {
      let str = histArr[histArr.length - 1];
      let arr = str.split(' ');
      arr = arr.slice(0, arr.length - 2);
      str = arr.join(' ');
      line1 = str;
      histArr.pop();
      update();
    }
  };

  // Calculations with single +, -, *, / operations
  const calcSingleOp = (array, str, opFunc) => {
    let before;
    let after;
    let arr = [].concat(array);
    let i = 0;
    while (i <= arr.length) {
      if (arr[i] === str) {
        let result = 0;
        before = parseFloat(arr[i - 1]);
        after = parseFloat(arr[i + 1]);
        result = opFunc(before, after);
        arr[i] = result;
        arr[i - 1] = '';
        arr[i + 1] = '';
        arr = arr.filter(elem => elem !== '');
        i = 0;
      }
      i += 1;
    }
    return arr;
  };

  // Calculations with /- and *- operations
  const calcMultipleOpLong = (array, str1, str2, opFunc) => {
    let before;
    let after;
    let arr = [].concat(array);
    let i = 0;
    while (i <= arr.length) {
      if (arr[i] === str1 && arr[i + 1] === str2) {
        let result = 0;
        before = parseFloat(arr[i - 1]);
        after = parseFloat(arr[i + 2]);
        result = opFunc(before, after);
        arr[i] = result;
        arr[i - 1] = '';
        arr[i + 1] = '';
        arr[i + 2] = '';
        arr = arr.filter(elem => elem !== '');
        i = 0;
      }
      i += 1;
    }
    return arr;
  };

  // Calculations with +- and -- operations
  const calcMultipleOpShort = (array, str1, str2, str3) => {
    let arr = [].concat(array);
    let i = 0;
    while (i <= arr.length) {
      if (arr[i] === str1 && arr[i + 1] === str2) {
        arr[i] = str3;
        arr[i + 1] = '';
        arr = arr.filter(elem => elem !== '');
      }
      i += 1;
    }
    return arr;
  };

  // Takes array (calculation string converted to array) and calculates answer using BODMAS (calcuator doesn't feature manual bracket function, instead this function works out precidence)
  // Calculates decimals, negative numbers, including /, *, +, -, /-, *-, --, +-.
  const calculate = (inputArr) => {
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
    let arr = [].concat(inputArr);
    if (arr[0] === '-') {
      arr.unshift('0');
    }
    arr = calcMultipleOpLong(arr, '/', '-', funcOperatorArr[4]);
    arr = calcSingleOp(arr, '/', funcOperatorArr[0]);
    arr = calcMultipleOpLong(arr, '*', '-', funcOperatorArr[5]);
    arr = calcSingleOp(arr, '*', funcOperatorArr[1]);
    arr = calcMultipleOpShort(arr, '+', '-', '-');
    arr = calcMultipleOpShort(arr, '-', '-', '+');
    arr = calcSingleOp(arr, '-', funcOperatorArr[2]);
    arr = calcSingleOp(arr, '+', funcOperatorArr[3]);
    return arr;
  };

  const equals = () => {
    const line1Str = line1.trim();
    line1Arr = line1Str.split(' ');
    if (line1.charAt(line1.length - 1).match(/[0-9]/g)) {
      line1 += ` = ${calculate(line1Arr)}`;
      histArr.push(line1);
      line1 = ' ';
      return update();
    }
    return update();
  };

  // Prevents multiple invalid consecutive operator inputs
  const validateNumAndAppend = (str) => {
    if (line1.charAt(line1.length - 1).match(/[^0-9]/g) || line1 === '') {
      return update();
    }
    line1 += str;
    return update();
  };

  // Soft event listeners
  const buttons = document.querySelectorAll('.btn-circle');
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      // Handles multiple scenarios of a minus input
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

  // Hard event listeners
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
  // Updates view to reflect model
  update();
};
