// Load the database first
const firebaseConfig = {
    apiKey: "AIzaSyDaiKFhjVvEnY1w4ZOiWf1uft_rqxuzoYA",
    authDomain: "todoapp-cpoukey.firebaseapp.com",
    databaseURL: "https://todoapp-cpoukey-default-rtdb.firebaseio.com",
    projectId: "todoapp-cpoukey",
    storageBucket: "todoapp-cpoukey.appspot.com",
    messagingSenderId: "856474059117",
    appId: "1:856474059117:web:4e60f633203e7f22b49a64",
    measurementId: "G-LVNQKB2RD8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let database = firebase.database();

Vue.component('task', {
    props: ['title', 'description'],
    template: `
        <div class="task">
            <button id="btn" class="done_button">Done!</button>

            <div class="task_info">
                <h3 class="task_title">{{title}}</h3>
                <p class="task_description">{{description}}</p>
            </div>

            <div class="edit_and_delete_buttons">
                <button id="btn" class="edit_button">Edit</button>
                <button id="btn" class="delete_button">Delete</button>
            </div>
        </div>
    `
});

Vue.component('flex_break', {
    template: `
        <div class="flex_break"/>
    `
});

Vue.component('add_task', {
    template: `
        <div class="add_task">
            <form>
                <div class="add_inputs">
                    <input class="add_title" type="text" v-model="msg">
                    <input class="add_description" type="text" v-model="msg">
                </div>
            </form>

            <button id="btn" class="add_button">Add</button>
        </div>
    `
});

Vue.component('finish_text', {
    template: `
        <div class="finish_text">
            <hr>
            <h2>Finished To-Do List<h2>
        </div>
    `
})

// The Vue instance
const app = new Vue({
    el: '#app',
    data: {
        data_list: [],
    },
    created: function() {
        database.ref('/').once('value').then((snap) => {
            for(let key in snap.val()) {
                this.data_list.push({title:key, data:snap.val()[key]});
            }
        });
    },
});
