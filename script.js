// 1. khai báo biến và hằng số
let soBiMat; 
let maxNum; 
let guessesLeft;
let gameActive = false; // Trạng thái trò chơi đã bắt đầu hay chưa

// Định nghĩa các mức độ trò chơi
const LEVELS = {
    easy: { max: 20, guesses: 5, activeClass: 'active-easy'},
    medium: { max: 100, guesses: 7, activeClass: 'active-medium'},
    hard: { max: 500, guesses: 10, activeClass: 'active-hard'}
};

// Lấy các phần tử DOM
const checkBtn = document.getElementById(`check-btn`);
const guessInput = document.getElementById(`guessInput`);
const message = document.getElementById(`message`);
const maxNumSpan = document.getElementById(`max-num`);
const guessesLeftSpan = document.getElementById(`guesses-left`);
const levelBtns = document.querySelectorAll(`.level-btn`);
const overlay = document.getElementById(`overlay`);
const modalMessage = document.getElementById(`modal-message`);
const playAgainBtn = document.getElementById(`play-again-btn`);
const container = document.querySelector(`.container`);

// 2. Chức năng khởi tạo và lựa chọn cấp độ
function initGame(levelKey) {
    const level = LEVELS[levelKey];
    if (!level) return;


    // Thiết lập các thông số dựa trên mức độ
    maxNum = level.max;
    guessesLeft = level.guesses;

    // Tạo số bí mật ngẫu nhiên trong phạm vi [1, maxNum]
    soBiMat = Math.floor(Math.random() * maxNum) + 1;
    gameActive = true;

    // Cập nhật giao diện
    maxNumSpan.textContent = maxNum;
    guessesLeftSpan.textContent = guessesLeft;
    guessInput.value = '';
    guessInput.min = 1;
    guessInput.max = maxNum;
    guessInput.placeholder = `Nhập số từ 1 đến ${maxNum}`;
    checkBtn.textContent = "Kiểm tra";

    message.textContent = `Hãy đoán số trong khoảng từ 1 đến ${maxNum}.`;
    message.classList.remove(`shake`);

    levelBtns.forEach(btn => {
        btn.classList.remove(LEVELS.easy.activeClass, LEVELS.medium.activeClass, LEVELS.hard.activeClass);
    });

    document.querySelector(`.level-btn[data-level="${levelKey}"]`).classList.add(level.activeClass);
}

// 3. XỬ LÝ LƯỢT ĐOÁN
function checkGuess() {
    if (!gameActive) {
        message.textContent = 'Vui lòng chọn mức độ để bắt đầu trò chơi!';
        container.classList.add('shake');
        setTimeout(() => container.classList.remove('shake'), 500);
        return;
    }

    const guess = parseInt(guessInput.value);

    if (isNaN(guess) || guess < 1 || guess > maxNum) {
        message.textContent = `⚠ Vui lòng nhập số hợp lệ từ 1 đến ${maxNum}.`;
        guessInput.classList.add('shake');
        setTimeout(() => guessInput.classList.remove('shake'), 500);
        return;
    }

    guessesLeft--;
    guessesLeftSpan.textContent = guessesLeft;

    if (guess === soBiMat) {
        handleGameOver(true);
    } else if (guessesLeft === 0) {
        handleGameOver(false);
    } else { 
        const hint = (guess < soBiMat) ? 'NHỎ hơn' : 'LỚN hơn';
        message.textContent = `Số của bạn ${hint} số bí mật! Bạn còn lại ${guessesLeft} lượt.`;

        container.classList.add('shake');
        setTimeout(() => container.classList.remove('shake'), 500);
    }
}

// 4. KẾT THÚC TRÒ CHƠI
function handleGameOver(win) {
    gameActive = false;
    checkBtn.textContent = win ? "HOÀN HẢO!" : "HẾT LƯỢT!";

    if (win) {
        modalMessage.innerHTML = `🥳 CHÚC MỪNG <br>Bạn đã đoán đúng số bí mật là ${soBiMat}. <br>Bạn thắng và còn ${guessesLeft} lượt.`;
        playAgainBtn.style.backgroundColor = '#27ae60';
    } else {
        modalMessage.innerHTML = `😭 THUA CUỘC <br>Bạn đã dùng hết lượt đoán.<br>Số bí mật là ${soBiMat}. Chúc bạn may mắn lần sau!`;
        playAgainBtn.style.backgroundColor = '#e74c3c';
    }
    overlay.classList.remove('hidden');
}

// 5. GẮN SỰ KIỆN
// 5.1 Gắn sự kiện cho các nút chọn cấp độ
levelBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const levelKey = this.getAttribute('data-level');
        initGame(levelKey);
    });
});

// 5.2 Gắn sự kiện cho nút "Kiểm Tra"
checkBtn.addEventListener('click', checkGuess);

// 5.3 Gắn sự kiện cho phím Enter trong ô input
guessInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        checkGuess();
    }
});

// 5.4 Gắn sự kiện cho nút "Chơi Lại" trong Modal
playAgainBtn.addEventListener('click', function() {
    overlay.classList.add('hidden');
    
    const activeBtn = document.querySelector('.level-btn.active-easy, .level-btn.active-medium, .level-btn.active-hard');
    const levelKey = activeBtn ? activeBtn.getAttribute('data-level') : 'easy';
    initGame(levelKey);
});

// 6. KHỞI CHẠY LẦN ĐẦU
maxNumSpan.textContent = '...';
guessesLeftSpan.textContent = '...';
message.textContent = 'Chào bạn! Vui lòng chọn mức độ để bắt đầu trò chơi.';