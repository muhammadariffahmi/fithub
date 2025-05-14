document.addEventListener('DOMContentLoaded', () => {
    loadActivities();
});

// function handleSubmit(event) {
//     event.preventDefault();

//     const title = document.getElementById('titleActivity').value;
//     const activityType = document.getElementById('activityType').value;
//     const dateTime = document.getElementById('datetime').value;

//     const hours = parseInt(document.getElementById('hours').value) || 0;
//     const minutes = parseInt(document.getElementById('minutes').value) || 0;
//     const seconds = parseInt(document.getElementById('seconds').value) || 0;
//     const duration = `${hours}h ${minutes}m ${seconds}s`;

//     const notes = document.getElementById('notes').value;

//     const activity = {
//         title,
//         activityType,
//         dateTime,
//         duration,
//         notes
//     };

//     let activities = JSON.parse(localStorage.getItem('activities')) || [];
//     activities.push(activity);
//     localStorage.setItem('activities', JSON.stringify(activities));

//     loadActivities();
//     event.target.reset(); // clear form
// }

function loadActivities() {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';

    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    if (activities.length === 0) {
        activityList.innerHTML = '<p class="text-muted">No activities yet.</p>';
        return;
    }

    activities.reverse().forEach((act, index) => {
        const card = document.createElement('div');
        card.className = 'card bg-secondary text-light mb-3';
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${act.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${new Date(act.dateTime).toLocaleString()}</h6>
                <p class="card-text">Activity Type ID: ${act.activityType}</p>
                <p class="card-text">Duration: ${act.duration}</p>
                <p class="card-text">Notes: ${act.notes}</p>
            </div>
        `;
        activityList.appendChild(card);
    });
}
