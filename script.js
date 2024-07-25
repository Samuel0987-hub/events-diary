document.addEventListener('DOMContentLoaded', function() {
    const eventForm = document.getElementById('eventForm');
    const eventList = document.getElementById('eventList');
    const showHistoryButton = document.getElementById('showHistory');
    const alarmSound = document.getElementById('alarmSound');

    let events = JSON.parse(localStorage.getItem('events')) || [];

    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const eventTitle = document.getElementById('eventTitle').value;
        const eventTime = new Date(document.getElementById('eventTime').value);
        const recurring = document.getElementById('recurringEvent').checked;

        if (eventTitle && eventTime) {
            const event = {
                title: eventTitle,
                time: eventTime.toISOString(),
                recurring: recurring
            };
            events.push(event);
            localStorage.setItem('events', JSON.stringify(events));
            addEvent(event);
            document.getElementById('eventTitle').value = '';
            document.getElementById('eventTime').value = '';
            document.getElementById('recurringEvent').checked = false;
        }
    });

    showHistoryButton.addEventListener('click', function() {
        displayHistory();
    });

    function addEvent(event) {
        const li = document.createElement('tr');
        const titleCell = document.createElement('td');
        const dateCell = document.createElement('td');
        const timeCell = document.createElement('td');
        const actionCell = document.createElement('td');
        const button = document.createElement('button');

        const eventTime = new Date(event.time);
        titleCell.textContent = event.title;
        dateCell.textContent = eventTime.toLocaleDateString();
        timeCell.textContent = eventTime.toLocaleTimeString();
        button.textContent = 'Remove';
        button.classList.add('remove');
        button.addEventListener('click', function() {
            eventList.removeChild(li);
            events = events.filter(e => e.time !== event.time);
            localStorage.setItem('events', JSON.stringify(events));
        });

        actionCell.appendChild(button);
        li.appendChild(titleCell);
        li.appendChild(dateCell);
        li.appendChild(timeCell);
        li.appendChild(actionCell);
        eventList.appendChild(li);

        scheduleReminder(event.title, eventTime, event.recurring);
    }

    function displayHistory() {
        eventList.innerHTML = '';
        events.forEach(event => addEvent(event));
    }

    function scheduleReminder(title, time, recurring) {
        const now = new Date();
        let delay = time - now;

        if (delay > 0) {
            setTimeout(function() {
                alarmSound.play();
                alert(`Reminder: ${title}`);

                if (recurring) {
                    const nextWeek = new Date(time);
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    const newEvent = {
                        title: title,
                        time: nextWeek.toISOString(),
                        recurring: true
                    };
                    events.push(newEvent);
                    localStorage.setItem('events', JSON.stringify(events));
                    addEvent(newEvent);
                }
            }, delay);
        }
    }

    // Initial load of events
    displayHistory();
});
