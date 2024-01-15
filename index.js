const tableEl = document.querySelector('table');
const tbodyEl = tableEl.querySelector('tbody');

fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const localStorageKey = "exercises";
        const setData = JSON.stringify(data)
        const getData = JSON.parse(localStorage.getItem(localStorageKey));

        if (!getData) {
            localStorage.setItem(localStorageKey, setData);
        }

        const exercisesHtml = getData.map((exercise) => getExercisesHtml(exercise)).join("");

        tbodyEl.innerHTML = exercisesHtml;

        const cancelRegistrationBtnEl = tbodyEl.querySelectorAll('.cancel-registration');
        cancelRegistrationBtnEl.forEach(btn => {
            btn.setAttribute('disabled', 'true');
        });

        riseParticipantsBtn(localStorageKey, getData);
        decreaseParticipantsBtn(localStorageKey, getData);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

function riseParticipantsBtn(localStorageKey, getData) {
    tbodyEl.addEventListener('click', (e) => {
        if (!e.target.classList.contains('registration')) {
            return;
        }
        const currentParticipantsText = e.target.closest('tr').querySelector('.current-participants').textContent;
        const maxParticipantsText = e.target.closest('tr').querySelector('.max-participants').textContent;
        if (currentParticipantsText === maxParticipantsText) {
            e.target.disabled = true;
            alert('Достигнуто максимальное количество участников');
            return;
        }
        const riseCurrentParticipantsText = parseInt(currentParticipantsText) + 1;
        e.target.closest('tr').querySelector('.current-participants').textContent = riseCurrentParticipantsText;
        e.target.disabled = true;
        e.target.nextElementSibling.disabled = false;

        const idToFind = e.target.closest('tr').dataset.id;
        const foundObject = getData.find((obj) => {
            return obj.id === +idToFind;
        });
        if (foundObject) {
            foundObject.currentParticipants = riseCurrentParticipantsText;
            getData.map(item => (item.id === foundObject.id) ? foundObject : item);
            return localStorage.setItem(localStorageKey, JSON.stringify(getData));
        }
    });
};

function decreaseParticipantsBtn(localStorageKey, getData) {
    tbodyEl.addEventListener('click', (e) => {
        if (!e.target.classList.contains('cancel-registration')) {
            return;
        }
        const currentParticipantsText = e.target.closest('tr').querySelector('.current-participants').textContent;
        const decCurrentParticipantsText = parseInt(currentParticipantsText) - 1;
        e.target.closest('tr').querySelector('.current-participants').textContent = decCurrentParticipantsText;
        e.target.disabled = true;
        e.target.previousElementSibling.disabled = false;

        const idToFind = e.target.closest('tr').dataset.id;
        const foundObject = getData.find((obj) => {
            return obj.id === +idToFind;
        });
        if (foundObject) {
            foundObject.currentParticipants = decCurrentParticipantsText;
            getData.map(item => (item.id === foundObject.id) ? foundObject : item);
            return localStorage.setItem(localStorageKey, JSON.stringify(getData));
        }
    });
};

function getExercisesHtml(exercise) {
    return `<tr data-id="${exercise.id}">
                <td class="name">${exercise.name}</td>
                <td class="time">${exercise.time}</td>
                <td class="max-participants participants">${exercise.maxParticipants}</td>
                <td class="current-participants participants">${exercise.currentParticipants}</td>
                <td>
                    <button class="registration">Записаться</button>
                    <button class="cancel-registration">Отменить запись</button>
                </td>
            </tr>`;
};
