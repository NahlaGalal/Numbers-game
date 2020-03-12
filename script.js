const box = document.querySelector(".game");
const buttons = document.querySelectorAll(".game button");
const checkButtons = document.querySelector("button.check");
const hintButton = document.querySelector("button.hint");
const restartButton = document.querySelector("button.restart");
const undoButton = document.querySelector("button.undo");
let prevNumber = null,
  prevButton = null,
  buttonsStatus = [],
  undo = {
    button1: null,
    button2: null
  };

const initializationButtons = `
    <button data-key="1" class="one-nine">1</button>
    <button data-key="2" class="two-eight">2</button>
    <button data-key="3" class="three-seven">3</button>
    <button data-key="4" class="four-six">4</button>
    <button data-key="5" class="five-five">5</button>
    <button data-key="6" class="four-six">6</button>
    <button data-key="7" class="three-seven">7</button>
    <button data-key="8" class="two-eight">8</button>
    <button data-key="9" class="one-nine">9</button>
    <button data-key="10" class="one-nine">1</button>
    <button data-key="11" class="one-nine">1</button>
    <button data-key="12" class="one-nine">1</button>
    <button data-key="13" class="two-eight">2</button>
    <button data-key="14" class="one-nine">1</button>
    <button data-key="15" class="three-seven">3</button>
    <button data-key="16" class="one-nine">1</button>
    <button data-key="17" class="four-six">4</button>
    <button data-key="18" class="one-nine">1</button>
    <button data-key="19" class="five-five">5</button>
    <button data-key="20" class="one-nine">1</button>
    <button data-key="21" class="four-six">6</button>
    <button data-key="22" class="one-nine">1</button>
    <button data-key="23" class="three-seven">7</button>
    <button data-key="24" class="one-nine">1</button>
    <button data-key="25" class="two-eight">8</button>`;

// Check if two numbers are neighbours
const checkNeighbours = (prev, current) => {
  // Declare smaller number and bigger number
  const keySmaller =
      +prev.dataset.key < +current.dataset.key
        ? +prev.dataset.key
        : +current.dataset.key,
    keyBigger =
      +prev.dataset.key > +current.dataset.key
        ? +prev.dataset.key
        : +current.dataset.key;
  // If two numbers are the same number
  if (keyBigger === keySmaller) return false;
  // If they are neigbours
  if (keySmaller + 1 === keyBigger) {
    if (
      buttonsStatus[Math.floor((keySmaller - 1) / 9)][(keySmaller - 1) % 9]
        .status ||
      buttonsStatus[Math.floor((keyBigger - 1) / 9)][(keyBigger - 1) % 9].status
    )
      return false;
    return true;
  }
  // If they aren't direct neighbours but all numbers among them are having {status: true}
  let flag = true;
  for (let i = keySmaller + 1; i < keyBigger; i++) {
    if (!buttonsStatus[Math.floor((i - 1) / 9)][(i - 1) % 9].status) {
      flag = false;
      break;
    }
  }
  if (flag) return true;
  // If they aren't direct neigbours but all numbers among them -- vertically -- are having {status: true}
  flag = true;
  if (!((keyBigger - keySmaller) % 9)) {
    for (let i = keySmaller + 9; i < keyBigger; i += 9) {
      if (!buttonsStatus[Math.floor((i - 1) / 9)][(i - 1) % 9].status) {
        flag = false;
        break;
      }
    }
    if (flag) return true;
  }
  return false;
};

const buttonClick = button => {
  button.addEventListener("click", e => {
    const currentNumber = e.target.textContent;
    if (
      buttonsStatus[Math.floor((e.target.dataset.key - 1) / 9)][
        (e.target.dataset.key - 1) % 9
      ].status
    )
      return;
    // Check there are two numbers
    if (prevNumber) {
      prevButton.classList.remove("hover");
      // Check they are neighbours
      if (checkNeighbours(prevButton, e.target)) {
        // Check they are equal or their sum are equal to 10
        if (
          +prevNumber + +currentNumber === 10 ||
          +prevNumber === +currentNumber
        ) {
          // Make status of two numbers equals true
          buttonsStatus[Math.floor((prevButton.dataset.key - 1) / 9)][
            (prevButton.dataset.key - 1) % 9
          ].status = true;
          buttonsStatus[Math.floor((e.target.dataset.key - 1) / 9)][
            (e.target.dataset.key - 1) % 9
          ].status = true;
          e.target.classList.add("active");
          prevButton.classList.add("active");
          undo = {
            button1: e.target,
            button2: prevButton
          };
        }
      }
      prevNumber = null;
      prevButton = null;
    } else {
      e.target.classList.add("hover");
      prevNumber = currentNumber;
      prevButton = e.target;
    }
  });
};

const InitializeButtons = (buttons, numLength = 0) => {
  buttons.forEach((button, i) => {
    // Initialize array of buttons and thier status to false
    if (!((i + numLength) % 9)) buttonsStatus.push([]);
    buttonsStatus[buttonsStatus.length - 1].push({
      key: button.dataset ? button.dataset.key : 0,
      value: +button.textContent || 0,
      status: false
    });
    buttonClick(button);
  });
};

const buttonClass = value =>
  value == 1 || value == 9
    ? "one-nine"
    : value == 2 || value == 8
    ? "two-eight"
    : value == 3 || value == 7
    ? "three-seven"
    : value == 4 || value == 6
    ? "four-six"
    : "five-five";

InitializeButtons(buttons);

checkButtons.addEventListener("click", () => {
  const notVisitedButtons = [].concat(
    ...buttonsStatus.map(row =>
      row.filter(button => !button.status).map(button => button.value)
    )
  );
  const buttonsAdded = [];
  notVisitedButtons.forEach((value, i) => {
    const newButton = document.createElement("button");
    newButton.textContent = value;
    newButton.classList.add(buttonClass(value));
    newButton.dataset.key = [].concat(...buttonsStatus).length + i + 1;
    box.appendChild(newButton);
    buttonsAdded.push(newButton);
  });
  InitializeButtons(
    buttonsAdded,
    buttonsStatus[buttonsStatus.length - 1].length
  );
});

hintButton.addEventListener("click", () => {
  let prev = null,
    flag = false;
  for (let rowIndex in buttonsStatus) {
    for (let numIndex in buttonsStatus[rowIndex]) {
      const num = buttonsStatus[rowIndex][numIndex];
      if (!num.status) {
        if (!prev) prev = num;
        else {
          if (prev.value === num.value || prev.value + num.value === 10) {
            buttonsStatus[rowIndex][numIndex].status = true;
            buttonsStatus[Math.floor((prev.key - 1) / 9)][
              (prev.key - 1) % 9
            ].status = true;
            buttons[+numIndex + +rowIndex * 9].classList.add("active");
            buttons[prev.key - 1].classList.add("active");
            flag = true;
            break;
          } else prev = null;
        }
      }
    }
    if (flag) break;
  }
  if (!flag) console.log("No combinations");
});

restartButton.addEventListener("click", () => {
  const newBox = document.createElement("div");
  newBox.classList.add("game");
  newBox.innerHTML = initializationButtons;
  document.body.replaceChild(newBox, box);
  buttonsStatus = [];
  InitializeButtons(Array.from(newBox.children));
});

undoButton.addEventListener("click", () => {
  if (undo.button1 && undo.button2) {
    undo.button1.classList.remove("active");
    undo.button2.classList.remove("active");
    buttonsStatus[Math.floor((undo.button2.dataset.key - 1) / 9)][
      (undo.button2.dataset.key - 1) % 9
    ].status = false;
    buttonsStatus[Math.floor((undo.button1.dataset.key - 1) / 9)][
      (undo.button1.dataset.key - 1) % 9
    ].status = false;
    undo = {
      button1: null,
      button2: null
    };
  }
});
