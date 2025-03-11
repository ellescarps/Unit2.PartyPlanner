const COHORT = "2502-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
    events: [],
};

async function getEvents() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        console.log(json.data);
        state.events = json.data;
    } catch (error) {
        console.error(error);
    }
}


async function addEvent(event) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(event),
        });
        const json = await response.json();
        console.log(json);

        if(json.error) {
            throw new Error(json.error.message);
        }

        await getEvents();
       renderEvents();
    } catch (error) {
        console.error(error);
    }
}



async function updateEvent(id,name,date,location,description) {
    try {
        const response = await fetch (`${API_URL}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name, date, location, description}),
        });
        const json = await response.json();
if (json.error) {
    throw new Error(json.error.message);
} await getEvents();
renderEvents();
    } catch (error) {
        console.error(error);
    }
}




async function deleteEvent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        await getEvents();
        renderEvents();
    } catch (error) {
        console.error(error);
    }
}



function renderEvents () {
    const eventList= document.querySelector("#parties");

    if (!state.events.length) {
        eventList.innerHTML = 
        "<li> No events. </li>";
        return;
    }

const eventCards = state.events.map((event) => {
    const card = document.createElement("li"); 
    card.innerHTML = `
    <h2> ${event.name} </h2>
    <p> ${event.date ? new Date(event.date).toLocaleString() : "" } </p>
    <p> ${event.location} </p>
    <p> ${event.description} </p>
    `;

const deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";
deleteButton.addEventListener("click", async () => {
    await deleteEvent(event.id);
});

card.append(deleteButton);

return card;
});
eventList.replaceChildren(...eventCards);
}

async function render() {
    await getEvents();
    renderEvents();
}

render();

const form = document.querySelector("#addParty");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

// const dateTimeValue = new Date(form.date.value);

const newEvent = {
  name: form.name.value,
//   dateTime: form.dateTime.value ? new Date(form.dateTime.value).toISOString() : "",
//   date: dateTimeValue.toISOString(),
  date: form.date.value ? new Date(form.date.value).toISOString() : "",
  location: form.location.value,
  description: form.description.value,

};
console.log(newEvent);

await addEvent(newEvent);
await render();
form.reset();
});