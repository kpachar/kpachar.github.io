document.addEventListener('DOMContentLoaded', () => {
    const scoreEl = document.getElementById('score');
    const imageContainer = document.getElementById('image-container');
    const choicesContainer = document.getElementById('choices-container');
    const feedbackContainer = document.getElementById('feedback-container');
    const winMessage = document.getElementById('win-message');

    let score = 0;
    let forms = [];
    let currentForm;

    async function fetchForms() {
        try {
            const res = await fetch('data/forms.json');
            forms = await res.json();
            startGame();
        } catch (error) {
            console.error('Error fetching forms:', error);
            feedbackContainer.textContent = 'Error loading game data. Please try again later.';
        }
    }

    function startGame() {
        score = 0;
        updateScore();
        winMessage.style.display = 'none';
        nextQuestion();
    }

    function nextQuestion() {
        feedbackContainer.textContent = '';
        currentForm = forms[Math.floor(Math.random() * forms.length)];

        const imageName = currentForm.name.toLowerCase().replace(/\s/g, '-') + '.svg';
        imageContainer.innerHTML = `<img src="images/${imageName}" alt="Line drawing of a Vishnu form">`;

        const choices = generateChoices();
        displayChoices(choices);
    }

    function generateChoices() {
        const choices = [currentForm.name];
        while (choices.length < 4) {
            const randomForm = forms[Math.floor(Math.random() * forms.length)];
            if (!choices.includes(randomForm.name)) {
                choices.push(randomForm.name);
            }
        }
        return choices.sort(() => Math.random() - 0.5);
    }

    function displayChoices(choices) {
        choicesContainer.innerHTML = '';
        choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice;
            button.addEventListener('click', () => handleAnswer(choice));
            choicesContainer.appendChild(button);
        });
    }

    function handleAnswer(choice) {
        if (choice === currentForm.name) {
            score++;
            feedbackContainer.textContent = 'Correct!';
            feedbackContainer.style.color = 'green';
        } else {
            score--;
            feedbackContainer.textContent = `Wrong! It was ${currentForm.name}`;
            feedbackContainer.style.color = 'red';
        }
        updateScore();

        if (score >= 10) {
            winMessage.style.display = 'block';
        } else {
            setTimeout(nextQuestion, 1500);
        }
    }

    function updateScore() {
        scoreEl.textContent = score;
    }

    fetchForms();
});
