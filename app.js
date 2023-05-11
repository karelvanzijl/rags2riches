// Toggle sound button
const soundButton = document.getElementById('soundButton');
const svgs = soundButton.getElementsByTagName('svg');
soundButton.addEventListener('click', () => {
	[].forEach.call(svgs, (svg) => {
		svg.classList.toggle('hidden');
	});
});

// Help buttons general
const helplineButtons = document.getElementsByClassName('helplineButton');
let helplineStatus = [false, false, false];
let helpWindowActive = false;
[].forEach.call(helplineButtons, (helplineButton, index) => {
	helplineButton.addEventListener('click', () => {
		if(!helplineStatus[index] && !helpWindowActive) {

			helplineStatus[index] = true;
			helpWindowActive = true;
			helplineButton.classList.add('used');
			helplineButton.classList.add('opacity-50');

			[].forEach.call(helplineButtons, (helplineButton2, index2) => {
				if(index !== index2) {
					helplineButton2.classList.remove('cursor-pointer');
					helplineButton2.classList.add('cursor-not-allowed');
				}
			})

			// Manage window
			helpButtonWindow = document.getElementById(`${helplineButton.id}Window`);
			helpButtonWindow.classList.remove('hidden');
			helpButtonWindow.addEventListener('click', () => {
				helpWindowActive = false;
				helpButtonWindow.classList.toggle('hidden');
				helplineButton.classList.remove('cursor-pointer');
				helplineButton.classList.add('cursor-not-allowed');

				[].forEach.call(helplineButtons, (helplineButton2, index2) => {
					if(index !== index2) {
						if(!helplineButton2.classList.contains('used')) {
							helplineButton2.classList.remove('cursor-not-allowed');
							helplineButton2.classList.add('cursor-pointer');
						}
					}
				})
			});
		}
	});
});


// Timer
const timer = document.getElementById('timer');
const t_org = parseInt(timer.innerText);
let paused = false;
let timerLoop = setInterval(() => {
	if(!paused) {
		let t = parseInt(timer.innerText);
		if(t === 0) {
			t = t_org + 1;
		}
		timer.innerText = t - 1;
	}
}, 1000);

// Manage answer options
const answers = document.getElementsByClassName('answer');
let selected = -1;
let result = false;
[].forEach.call(answers, (answer, index) => {
	answer.addEventListener('click', () => {

		// Stop timer
		clearInterval(timerLoop);

		// Only execute if no answer selected yet
		if(selected < 0) {

			// Set selected answer
			answers[index].classList.add('selected');
			selected = index;
			
			// Add disabled to not selected answers
			[].forEach.call(answers, (answer2, index2) => {
				if(index !== index2) {
					answers[index2].classList.add('disabled');
				}
			});

			// Set timer (for testing)
			setTimeout(fakeResult, 500);
		}
	});
});

// Score board
const scoreItemsSmall = document.getElementsByClassName('scoreItemSmall');
const scoreItemsLarge = document.getElementsByClassName('scoreItemLarge');
let currentScoreItemSmall = 0;
let currentScoreItemLarge = scoreItemsSmall.length - 1;
function setCurrentScoreItem() {
	// Small
	scoreItemsSmall[currentScoreItemSmall].classList.add('currentScoreItem');
	if(currentScoreItemSmall < scoreItemsSmall.length && currentScoreItemSmall > 0) {
		scoreItemsSmall[currentScoreItemSmall - 1].classList.remove('currentScoreItem');
	}
	// Large
	scoreItemsLarge[currentScoreItemLarge].classList.add('currentScoreItem');
	if(currentScoreItemLarge < scoreItemsLarge.length - 1 && currentScoreItemSmall < 15) {
		scoreItemsLarge[currentScoreItemLarge + 1].classList.remove('currentScoreItem');
	}
}
setCurrentScoreItem();

function fakeResult() {
	[].forEach.call(answers, (answer, index) => {
		answers[index].classList.remove('disabled');
		answers[index].classList.add('noselect');
		if(index !== selected && !result) {
			answers[index].classList.add('correct');
			answers[selected].classList.remove('selected');
			answers[selected].classList.add('incorrect');
			result = true;
		}
	});
	setTimeout(() => {
		[].forEach.call(answers, (answer, index) => {
			answer.classList.remove('selected');
			answer.classList.remove('incorrect');
			answer.classList.remove('correct');
			answer.classList.remove('disabled');
			answer.classList.remove('noselect');
		});
		[].forEach.call(document.getElementsByClassName('helplineButton'), (helpButton, index) => {
			helpButton.classList.remove('used');
			helpButton.classList.remove('cursor-not-allowed');
			helpButton.classList.remove('opacity-50');
		});
		helplineStatus = [false, false, false];
		selected = -1;
		result = false;
		currentScoreItemSmall++;
		currentScoreItemLarge--;
		setCurrentScoreItem();
		timer.innerText = t_org;
		timerLoop = setInterval(() => {
			let t = parseInt(timer.innerText);
			if(t === 0) {
				t = t_org + 1;
			}
			timer.innerText = t - 1;
		}, 500);
	}, 500);
}
