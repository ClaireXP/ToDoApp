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
    props: ['name', 'title', 'description', 'edit_mode', 'done'],
    template: `
        <div id="task" v-if="!done">
            <button id="btn" class="done_button" v-on:click="toggle_done">Done!</button>

            <div id="task_info" v-if="!edit_mode">
                <h3 class="task_title">{{title}}</h3>
                <p class="task_description">{{description}}</p>
            </div>

            <div class="edit_inputs" v-if="edit_mode">
                <input id="edit_title_txt" class="edit_title" type="text" v-model="title_input"
                    placeholder="Please enter a title for the task.">
                <textarea id="edit_description_txt" style="resize: none;" class="edit_description" v-model="description_input"
                    placeholder="Please enter a description of the task.">
                </textarea>
            </div>

            <div class="edit_and_delete_buttons">
                <button id="btn" class="edit_button" v-on:click="toggle_edit" 
                    v-text="!edit_mode ? 'Edit' : 'Save'"></button>
                <button id="btn" class="delete_button" v-on:click="delete_task">Delete</button>
            </div>
        </div>
    `,
    data: function() {
        return {
            title_input: '',
            description_input: ''
        }
    },
    methods: {
        toggle_edit: function(event) {
            if(this.edit_mode){      
                this.title = this.title_input;
                this.description = this.description_input;          
                database.ref(`/${this.name}`).update({title: this.title});
                database.ref(`/${this.name}`).update({description: this.description});

                this.edit_mode = false;
                this.done = false;
            }else{
                this.title_input = this.title;
                this.description_input = this.description;
                
                this.edit_mode = true;
            }
            
            database.ref(`/${this.name}`).update({edit_mode: this.edit_mode});
            this.$root.update_lists();
        },

        delete_task: function(event) {
            if(confirm('Are you sure you would like to delete this task?\n\nOnce deleted it cannot be recovered.')){
                database.ref(`/${this.name}`).remove();
                this.$root.update_lists();
            }
        },

        toggle_done: function(event) {
            if(this.done){
                this.done = false;
                database.ref(`/${this.name}`).update({done: false});
            }else{
                this.edit_mode = false;
                database.ref(`/${this.name}`).update({edit_mode: this.edit_mode});

                this.done = true;
                database.ref(`/${this.name}`).update({done: true});
            }this.$root.update_lists();
        }
    }
});

Vue.component('task_list', {
    props: ['name', 'data'],
    template: `
        <div>
            <task 
                v-bind:name="this.name"
                v-bind:title="this.data.title"
                v-bind:description="this.data.description"
                v-bind:edit_mode="this.data.edit_mode"
                v-bind:done="this.data.done"
            ></task>
        </div>
    `
});

Vue.component('finished_task', {
    props: ['name', 'title', 'description', 'done'],
    template: `
        <div id="task" v-if="done">
            <button id="btn" class="restore_button" v-on:click="toggle_done">Restore</button>

            <div id="task_info" class="finished_task_info">
                <h3 class="task_title">{{title}}</h3>
                <p class="task_description">{{description}}</p>
            </div>

            <div class="edit_and_delete_buttons">
                <button id="btn" class="delete_button" v-on:click="delete_task">Delete</button>
            </div>
        </div>
    `,
    methods: {
        delete_task: function(event) {
            if(confirm('Are you sure you would like to delete this task?\n\nOnce deleted it cannot be recovered.')){
                database.ref(`/${this.name}`).remove();
                this.$root.update_lists();
            }
        },

        toggle_done: function(event) {
            if(this.done){
                this.done = false;
                database.ref(`/${this.name}`).update({done: false});
            }else{
                this.done = true;
                database.ref(`/${this.name}`).update({done: true});
            }this.$root.update_lists();
        }
    }
})

Vue.component('finished_task_list', {
    props: ['name', 'data'],
    template: `
        <div>
            <finished_task 
                v-bind:name="this.name"
                v-bind:title="this.data.title"
                v-bind:description="this.data.description"
                v-bind:done="this.data.done"
            ></finished_task>
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
                <p class="add_task_text">Add another task below</p>
                <div class="add_inputs">
                    <input id="add_title" class="add_title" type="text" v-model="title_input"
                        placeholder="Please enter a title for the new task.">
                    <textarea id="add_description" class="add_description" v-model="description_input"
                        style="resize: none;"
                        placeholder="Please enter a description of the new task.">
                    </textarea>
                </div>
            </form>

            <button id="btn" class="add_button" v-on:click="create_task">Add</button>
        </div>
    `,
    data: function() {
        return {
            title_input: '',
            description_input: ''
        }
    },
    methods: {
        create_task: function(event) {
            database.ref(`/${this.title_input}`).set({
                title: this.title_input,
                description: this.description_input,
                done: false,
                edit_mode: false,
            });
            this.title_input = '';
            this.description_input = '';
            this.$root.update_lists();
        },
    }
});

Vue.component('finished_text', {
    template: `
        <div class="finish">
            <hr class="finish_breakline">
            <div class="list_header">
                <h2>Finished To-Do List</h2>
            </div>
        </div>
    `
});

Vue.component('theme_decals', {
    props: ['theme'],
    template: `
        <div v-if="theme" == "flowers">
            <img id="flower_decal" class="bottom_flower_decal" src="https://gardenbeast-9fcd.kxcdn.com/wp-content/uploads/2020/07/buy-succulents-top-1.png" alt="">
            <img id="flower_decal" class="left_flower_decal" src="https://cdn.shopify.com/s/files/1/2198/4603/products/4inchsucculent_1200x.png?v=1601367978" alt="">
            <img id="flower_decal" class="right_flower_decal" src="https://www.sublimesucculents.com/wp-content/uploads/2019/05/orange-succulents-echeveria-sanyatwe.png" alt=""></img>
        </div>

        <div v-if="theme" == "technology">
            <img id="flower_decal" class="bottom_flower_decal" src="https://corp.ingrammicro.com/IM.Com/media/Ingrammicro/Home/world_desktop_676x252.png?ext=.png" alt="">
            <img id="flower_decal" class="left_flower_decal" src="https://www.morganstanley.com/pub/content/dam/msdotcom/about-us/technology/investment-tech-innovation.png" alt="">
            <img id="flower_decal" class="right_flower_decal" src="https://www.storm-technologies.com/media/2e5h4nbv/homepage-desktop.png" alt=""></img>
        </div>
    `
});

Vue.component('settings', {
    props: ['theme'],
    template: `
        <div>
            <button class="settings_button">
                <img class="settings_pic" src="https://iconarchive.com/download/i86477/grafikartes/flat-retro-modern/settings.ico" alt="Settings"/>
            </button>
        </div>
    `
});

// The Vue instance
const app = new Vue({
    el: '#app',
    data: {
        task_data_list: [],
        finished_task_data_list: [],
        theme: "flowers"
    },
    methods: {
        update_lists: function() {
            this.task_data_list = [];
            this.finished_task_data_list = [];

            database.ref('/').once('value').then((snap) => {
                for(let key in snap.val()) {
                    if(!snap.val()[key]['done'])
                    {
                        this.task_data_list.push({name:key, data:snap.val()[key]});
                    }else{
                        this.finished_task_data_list.push({name:key, data:snap.val()[key]});
                    }
                }
            });
        },
    },
    created: function() {
        this.update_lists();
    },
});
