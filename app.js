window.onload = function onload() {
  // Global Variables
  let line1 = ' ';
  const line2 = '';
  const line3 = '';
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

  function updateAll() {
    document.querySelector('#dsp-line-1').textContent = line1;
    document.querySelector('#dsp-line-2').textContent = histArr[histArr.length - 1];
    document.querySelector('#dsp-line-3').textContent = histArr[histArr.length - 2];
    if (line1 === ' ' || line1 === '') {
      displayCursor();
    } else {
      displayLine1();
    }
  }

  function backspace() {
    if (line1.length > 0) {
      const arr = line1.split('');
      if (arr[arr.length - 1] === ' ') {
        arr.pop();
        arr.pop();
        updateAll();
      }
      arr.pop();
      line1 = arr.join('');
      updateAll();
    }
  }

  function getNumArr() {
    const arr = line1.split(' ');
    numArr = arr.filter(elem => elem.match(/\d/g));
    return numArr;
  }

  function getLastNum() {
    lastNum = numArr[numArr.length - 1];
    return lastNum;
  }

  function clear() {
    line1 = ' ';
    updateAll();
  }

  function cancel() {
    line1 = ' ';
    lastNum = '';
    numArr = [];
    histArr = [];
    updateAll();
  }

  function cancelEntry() {
    line1 = ' ';
    lastNum = '';
    numArr = [];
    updateAll();
  }

  function undo() {
    if (histArr.length > 0) {
      let str = histArr[histArr.length - 1];
      console.log(`histStr: ${str}`);
      let arr = str.split(' ');
      console.log(`histArr: ${arr}`);
      arr = arr.slice(0, arr.length - 2);
      str = arr.join(' ');
      line1 = str;
      histArr.pop();
      updateAll();
      console.log(`line1 after undo: ${line1}`);
    }
  }

  function convertDoubleMinus(array) {
    let a = [].concat(array);
    for (let i = 0; i <= a.length; i += 1) {
      if (a[i - 1] === '-' && a[i] === '-') {
        a[i] = '+';
        a[i - 1] = '';
        a = a.filter(elem => elem !== '');
        i = 0;
      }
    }
    return a;
  }

  function calculate(inputArr) {
    const operatorArray = ['/', '*', '-', '+'];
    const funcOperatorArr = [
      function divideFunc(before, after) { return before / after; },
      function muliplyFunc(before, after) { return before * after; },
      function minusFunc(before, after) { return before - after; },
      function plusFunc(before, after) { return before + after; },
    ];
    let arr = [].concat(inputArr);
    arr = convertDoubleMinus(arr);
    if (arr[0] === '-') {
      arr.unshift('0');
    }
    for (let j = 0; j < operatorArray.length; j += 1) {
      for (let i = 0; i <= arr.length; i += 1) {
        if (arr[i] === operatorArray[j]) {
          let result = 0;
          const before = parseFloat(arr[i - 1]);
          const after = parseFloat(arr[i + 1]);
          result = funcOperatorArr[j](before, after);
          arr[i] = result;
          console.log(result);
          arr[i - 1] = '';
          arr[i + 1] = '';
          arr = arr.filter(elem => elem !== '');
          i = 0;
        }
      }
    }
    console.log(`arr: ${arr}`);
    return arr;
  }

  function equals() {
    const line1Str = line1.trim();
    line1Arr = line1Str.split(' ');
    if (line1.charAt(line1.length - 1).match(/[0-9]/g)) {
      line1 += ` = ${calculate(line1Arr)}`;
      histArr.push(line1);
      // console.log(`histArr: ${histArr}`);
      // console.log(`line1: ${line1}`);
      // console.log(`lineArr: ${line1Arr}`);
      clear();
    }
  }

  // Checks for number character at end of line1 string, then appends str if one is found.
  function validateNumAndAppend(str) {
    if (line1.charAt(line1.length - 1).match(/[^0-9]/g) || line1 === '') {
      return line1;
    }
    line1 += str;
    return line1;
  }

  // Listener Declarations
  const buttons = document.querySelectorAll('.btn-circle');
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      if (button.textContent.match(/[0-9]/g)) {
        line1 += button.textContent;
      }
      if (button.id === 'btn-plus') {
        validateNumAndAppend(' + ');
      }

      if (button.id === 'btn-minus') {
        if (line1 === ' ') {
          line1 = '- ';
          return updateAll();
        }
        if (line1.charAt(line1.length - 4).match(/[0-9]/g) && line1.charAt(line1.length - 3) === ' ' && line1.charAt(line1.length - 2) === '-' && line1.charAt(line1.length - 1) === ' ') {
          line1 += '- ';
          return updateAll();
        }
        if (line1.charAt(line1.length - 1).match(/[^0-9]/g) || line1 === '') {
          return line1;
        }
        line1 += ' - ';
        updateAll();
        console.log(line1);
        console.log(`line1 length: ${line1.length}`);
        return line1;
      }

      if (button.id === 'btn-divide') {
        validateNumAndAppend(' / ');
      }
      if (button.id === 'btn-multiply') {
        validateNumAndAppend(' * ');
      }
      if (button.id === 'btn-decimal') {
        getLastNum();
        if (lastNum.match(/\./gi)) {
          console.log('muliple points not supported');
          return line1;
        }
        validateNumAndAppend('.');
      }
      if (button.id === 'btn-undo') {
        undo();
      }
      if (button.id === 'btn-backspace') {
        backspace();
      }
      if (button.id === 'btn-cancel') {
        cancel();
      }
      if (button.id === 'btn-ce') {
        cancelEntry();
      }
      if (button.id === 'btn-equals') {
        equals();
        calculate(line1Arr);
      }
      getNumArr();
      return updateAll();
    });
  });

  // Keyboard Buttons
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

  // Function Calls
  updateAll();
};
