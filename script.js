class FindNumberGame {
    constructor() {
		
		// Инициализация базовых параметров игры
        this.level = 1;
        this.targetNumber = 0;
        this.timeLeft = 60;
        this.score = 0;
        this.bonus = 0;
        this.timer = null;
        this.isGameRunning = false;
        this.isTutorial = true;
		
		// Анимации и цвета для ячеек
        this.animations = ['fade', 'rotate', 'scale'];
        this.cellColors = [
            '#3498db', '#2980b9', '#e67e22',
            '#9b59b6', '#e91e63', '#f1c40f',
            '#2ecc71', '#27ae60', '#95a5a6'
        ];
		
        // Получение DOM-элементов
        this.gameBoard = document.getElementById('gameBoard');
        this.targetElement = document.getElementById('target');
        this.levelElement = document.getElementById('level');
        this.timerElement = document.getElementById('timer');
        this.scoreElement = document.getElementById('score');
        this.bonusCirclesElement = document.getElementById('bonusCircles');
		this.bonusMultiplierElement = document.getElementById('bonusMultiplier');
        this.messageElement = document.getElementById('message');
        this.startBtn = document.getElementById('startBtn');
        this.gameContainer = document.querySelector('.game-container');
        
		// Назначение обработчиков событий
        this.startBtn.addEventListener('click', () => this.startGame());
        this.showTutorial();
    }
    
	 // Показывает обучающий экран с сеткой 2x3
    showTutorial() {
        this.isTutorial = true;
        this.gameBoard.innerHTML = '';
        
        const rows = 2, cols = 3;
        this.gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        this.gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        
        this.targetNumber = 5;
        this.targetElement.textContent = this.targetNumber;
        
        const numbers = [1, 2, 3, 4, 5, 6];
        this.shuffleArray(numbers);
        
        numbers.forEach(num => {
            const cell = document.createElement('div');
            cell.className = 'number-cell tutorial-cell';
            cell.textContent = num;
            
            const color = this.cellColors[Math.floor(Math.random() * this.cellColors.length)];
            cell.style.backgroundColor = color;
            
            if (num === this.targetNumber) {
                cell.classList.remove('tutorial-cell');
                cell.classList.add('tutorial-target');
                cell.addEventListener('click', () => this.startCountdown());
            }
            
            this.gameBoard.appendChild(cell);
        });
        
        const message = document.createElement('div');
        message.className = 'tutorial-message';
        message.innerHTML = 'Нажмите на экран, <br>чтобы продолжить';
        this.gameContainer.appendChild(message);
    }
    
	// Запускает обратный отсчет перед началом игры
    startCountdown() {
		
		const background = document.createElement('div');
		background.className = 'tutorial-countdown-overlay';
		this.gameContainer.appendChild(background);
		
		
		const countdownDiv = document.createElement('div');
		countdownDiv.className = 'tutorial-countdown-cell';
		this.gameContainer.appendChild(countdownDiv);
		
		let count = 3;
		countdownDiv.textContent = count;
		
		const timer = setInterval(() => {
			count--;
			countdownDiv.textContent = count;
			
			if (count <= 0) {
				clearInterval(timer);
				countdownDiv.remove();
				background.remove();
				const tutorialMsg = document.querySelector('.tutorial-message');
				if (tutorialMsg) tutorialMsg.remove();
				this.startBtn.style.display = 'block';
				this.startGame();
			}
		}, 700);
	}
    
	// Основная функция запуска игры
    startGame() {
        this.isTutorial = false;
        this.isGameRunning = true;
        this.gameBoard.style.pointerEvents = 'auto';
        this.level = 1;
        this.timeLeft = 60;
        this.score = 0;
        this.bonus = 0;
        this.startBtn.textContent = 'Перезапустить игру';
        this.messageElement.textContent = '';
        this.updateStats();
        this.startTimer();
        this.setupLevel();
        this.updateAppearance();
    }
    
	// Обновляет визуальный стиль контейнера в зависимости от уровня
    updateAppearance() {
        this.gameContainer.classList.remove('level-1', 'level-2', 'level-3', 
                                         'level-4', 'level-5', 'level-6',
                                         'level-7', 'level-8', 'level-9');
        this.gameContainer.classList.add(`level-${this.level}`);
    }
    
	// Запускает таймер обратного отсчета
    startTimer() {
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateStats();
            
            if (this.timeLeft <= 0) {
                this.endGame(false);
            }
        }, 1000);
    }
    
	 // Обновляет отображение статистики
    updateStats() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        this.levelElement.textContent = this.level + '-9';
        this.scoreElement.textContent = this.score;
        this.updateBonusDisplay();
    }
    
	// Создает игровое поле для текущего уровня
    setupLevel() {
        this.gameBoard.innerHTML = '';
        this.gameBoard.style.pointerEvents = 'auto';
        let rows, cols;
        
        if (this.level < 4) {
            rows = 2, cols = 3;
        } else if (this.level >= 4 && this.level < 6) {
            rows = 3, cols = 4;
        } else if (this.level > 5 && this.level < 8) {
            rows = 4, cols = 4;
        } else if (this.level <= 9) {
            rows = 5, cols = 5;
        }
        
        this.gameBoard.style.gridTemplateColumns = `repeat(${cols}, minmax(70px, 1fr))`;
        this.gameBoard.style.gridTemplateRows = `repeat(${rows}, minmax(70px, 1fr))`;
        
        let minNumber, maxNumber;
        if (this.level < 3) {
            minNumber = 1;
            maxNumber = 99;
        } else if (this.level < 6) {
            minNumber = 100;
            maxNumber = 999;
        } else {
            minNumber = 1000;
            maxNumber = 9999;
        }
        
        this.targetNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
        this.targetElement.textContent = this.targetNumber;
        
        const numbers = [];
        const totalCells = rows * cols;
        
        numbers.push(this.targetNumber);
        
        while (numbers.length < totalCells) {
            const randomNum = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
            if (!numbers.includes(randomNum)) {
                numbers.push(randomNum);
            }
        }
        
        this.shuffleArray(numbers);
        
        numbers.forEach((num, index) => {
            const cell = document.createElement('div');
            cell.className = 'number-cell';
            
            const color = this.cellColors[Math.floor(Math.random() * this.cellColors.length)];
            cell.style.backgroundColor = color;
            
            const numberSpan = document.createElement('span');
            numberSpan.textContent = num;
            numberSpan.classList.add('number-content');
            cell.appendChild(numberSpan);
            
            if (this.level >= 3) {
                const randomAnim = this.animations[Math.floor(Math.random() * this.animations.length)];
                if (randomAnim === 'rotate') {
                    numberSpan.classList.add(randomAnim);
                } else {
                    cell.classList.add(randomAnim);
                }
            }
            
            cell.addEventListener('click', () => this.handleCellClick(num, cell));
            this.gameBoard.appendChild(cell);
        });
    }
    
	 // Обрабатывает клик по ячейке
    handleCellClick(number, cell) {
		if (!this.isGameRunning || this.isTutorial) return;
		
		if (number === this.targetNumber) {
			cell.classList.add('correct');
			this.bonus = Math.min(5, this.bonus + 1);
			
			const points = 10 + (this.bonus * 10);
			this.score += points;
			
			setTimeout(() => {
				if (this.level < 9) {
					this.levelUp();
				} else {
					this.endGame(true);
				}
			}, 100);
		} else {
			cell.classList.add('wrong');
			this.messageElement.textContent = 'Неверно! Попробуйте ещё раз.';
			this.bonus = Math.max(0, this.bonus - 1);
			this.timeLeft = Math.max(0, this.timeLeft - 2);
			
			setTimeout(() => {
				this.levelDown(); 
			}, 100);
		}
		
		this.updateStats();
	}
    
	// Изменяет уровень с анимацией перехода
	changeLevel(direction) {
		this.gameBoard.style.transform = 'translateX(-100%)';
		this.gameBoard.style.opacity = '0';

		setTimeout(() => {
			if (direction === 'up') {
				this.level++;
			} else if (direction === 'down' && this.level > 1) {
				this.level--;
			}

			this.updateAppearance();
			this.setupLevel();

			setTimeout(() => {
				this.gameBoard.style.transform = 'translateX(0)';
				this.gameBoard.style.opacity = '1';
				this.messageElement.textContent = '';
			}, 50);
		}, 300);
	}

	// Повышает уровень
	levelUp() {
		this.changeLevel('up');
	}
	
	// Понижает уровень
	levelDown() {
		this.changeLevel('down');
	}
    
	// Завершает игру
    endGame(isWin) {
        clearInterval(this.timer);
        this.isGameRunning = false;
        
        if (isWin) {
            this.messageElement.textContent = `Поздравляем! Вы прошли все 9 уровней! Очки: ${this.score}`;
        } else {
            this.messageElement.textContent = `Игра окончена! Ваш результат: ${this.score} очков, уровень ${this.level}.`;
        }
    }
    
	// Перемешивает массив
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
	// Вычисляет контрастный цвет
    getContrastColor(hexColor) {
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    }
	
	// Обновляет отображение бонусов
	updateBonusDisplay() {
    this.bonusCirclesElement.innerHTML = '';
    const maxBonus = 5;
    
    for (let i = 0; i < maxBonus; i++) {
        const circle = document.createElement('div');
        circle.className = 'bonus-circle';
        if (i < this.bonus) {
            circle.classList.add('filled');
        }
        this.bonusCirclesElement.appendChild(circle);
    }
    
    this.bonusMultiplierElement.textContent = `${this.bonus}x`;
}
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new FindNumberGame();
});