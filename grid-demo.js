const BLACK_COUNT = 14;

const charImgs = ['1','2','3','4','5','6','7','8','9','10','11','12','13','15'];

const charMessages = {
  '1':  "Georgia is here!",
  '2':  "Every designer loves flower!",
  '3':  "Product Designer & Design Engineer.",
  '4':  "Tennis!",
  '5':  "Hope I can have my own cat one day :)",
  '6':  "I have wonderful design power!",
  '7':  "Help! I can't swim...",
  '8':  "Chinese food is always the best!",
  '9':  "Geese kind of scare me :(",
  '10': "Work out everyday!",
  '11': "I'd love to work at startups!",
  '12': "Painting gives new ideas!",
  '13': '"I wonder" is the best song ever...',
  '15': "Let's connect!",
};

function getLayout() {
  return window.innerWidth <= 600
    ? { cols: 5, rows: 7 }
    : { cols: 9, rows: 5 };
}

function buildGrid() {
  const { cols, rows } = getLayout();
  const total = cols * rows;
  const center = Math.floor(rows / 2) * cols + Math.floor(cols / 2);

  // Pick black cells
  const blackSet = new Set([center]);
  while (blackSet.size < BLACK_COUNT) {
    blackSet.add(Math.floor(Math.random() * total));
  }

  // Assign images
  const remainingImgs = charImgs.filter(k => k !== '1').sort(() => Math.random() - 0.5);
  const imgMap = new Map([[center, '1']]);
  let imgIdx = 0;
  for (const idx of blackSet) {
    if (idx !== center) imgMap.set(idx, remainingImgs[imgIdx++]);
  }

  // Clear and rebuild
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  for (let i = 0; i < total; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell'
      + (blackSet.has(i) ? ' black' : '')
      + (i === center ? ' open' : '');

    const num = document.createElement('span');
    num.className = 'cell-num';
    num.textContent = i + 1;
    cell.appendChild(num);

    if (blackSet.has(i)) {
      const charKey = imgMap.get(i);

      const fill = document.createElement('div');
      fill.className = 'cell-fill';
      cell.appendChild(fill);

      const imgWrap = document.createElement('div');
      imgWrap.className = 'cell-img';
      const imgEl = document.createElement('img');
      imgEl.src = `public/characters/${charKey}.jpg`;
      imgEl.alt = '';
      imgWrap.appendChild(imgEl);
      cell.appendChild(imgWrap);

      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.textContent = charMessages[charKey];
      cell.appendChild(bubble);

      cell.addEventListener('click', () => {
        if (cell.classList.contains('open')) {
          cell.classList.remove('open');
          cell.classList.add('closing');
          setTimeout(() => cell.classList.remove('closing'), 500);
        } else {
          cell.classList.remove('closing');
          cell.classList.add('open');
          setTimeout(() => {
            bubble.style.opacity = '0';
            bubble.style.transform = 'scale(0.88) translateY(3px)';
          }, 3000);
        }
      });
    }

    grid.appendChild(cell);
  }
}

// Rebuild on resize only when layout changes breakpoint
let currentLayout = getLayout().cols;
buildGrid();

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const newCols = getLayout().cols;
    if (newCols !== currentLayout) {
      currentLayout = newCols;
      buildGrid();
    }
  }, 150);
});
