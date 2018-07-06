window.onload = function onload() {
  // Global Variables
  let line1 = ' ';
  const line2 = '';
  const line3 = '';
  let lastNum = '';
  let numArr = [];
  let histArr = [];
  const btnUndo = document.querySelector('#btn-undo');
  const btn7 = document.querySelector('#btn-7');
  const btn8 = document.querySelector('#btn-8');
  const btn9 = document.querySelector('#btn-9');
  const btnCancel = document.querySelector('#btn-cancel');
  const btnDivide = document.querySelector('#btn-divide');
  const btn4 = document.querySelector('#btn-4');
  const btn5 = document.querySelector('#btn-5');
  const btn6 = document.querySelector('#btn-6');
  const btnPlus = document.querySelector('#btn-plus');
  const btnMultiply = document.querySelector('#btn-multiply');
  const btn1 = document.querySelector('#btn-1');
  const btn2 = document.querySelector('#btn-2');
  const btn3 = document.querySelector('#btn-3');
  const btnMinus = document.querySelector('#btn-minus');
  const btnBackspace = document.querySelector('#btn-backspace');
  const btnBrackets = document.querySelector('#btn-brackets');
  const btn0 = document.querySelector('#btn-0');
  const btnDecimal = document.querySelector('#btn-decimal');
  const btnEquals = document.querySelector('#btn-equals');


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
  // Checks for number character at end of line1 string, then appends str if one is found.
  function validateNumAndAppend(str) {
    if (line1.charAt(line1.length - 1).match(/[^0-9]/g) || line1 === '') {
      return line1;
    }
    line1 += str;
    return line1;
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
    console.log(`num arr: ${numArr}`);
    return numArr;
  }

  function getLastNum() {
    lastNum = numArr[numArr.length - 1];
    console.log(`lastNum: ${lastNum}`);
    console.log(typeof (lastNum));
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

  function addToHistory() {
    histArr.push(line1);
  }

  function equals() {
    if (line1.charAt(line1.length - 1).match(/[0-9]/g)) {
      line1 += ' = ';
      addToHistory();
      clear();
    }
  }

  function undo() {
    if (histArr.length > 0) {
      line1 = histArr.pop();
      updateAll();
      console.log(histArr);
    }
  }

  // Listener Declarations
  const buttons = document.querySelectorAll('.btn-circle');
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      // console.log(button.id);
      // console.log(button.textContent);
      if (button.textContent.match(/[0-9]/g)) {
        line1 += button.textContent;
      }
      if (button.id === 'btn-plus') {
        validateNumAndAppend(' + ');
      }
      if (button.id === 'btn-minus') {
        validateNumAndAppend(' - ');
      }
      if (button.id === 'btn-divide') {
        validateNumAndAppend(' / ');
      }
      if (button.id === 'btn-multiply') {
        validateNumAndAppend(' * ');
      }
      if (button.id === 'btn-decimal') {
        getLastNum();
        console.log(`lastNum: ${lastNum}`);
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
        console.log('historyArr: ' + histArr);
      }
      getNumArr();
      return updateAll();
    });
  });

  // Function Calls
  updateAll();
};
