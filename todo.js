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
            title_input: this.name,
            description_input: this.description
        }
    },
    methods: {
        toggle_edit: function(event) {
            if(this.edit_mode){       
                database.ref(`/${this.name}`).update({title: this.title_input});
                database.ref(`/${this.name}`).update({description: this.description_input});
                database.ref(`/${this.name}`).update({edit_mode: false});
            }else{
                database.ref(`/${this.name}`).update({edit_mode: true});
            }this.$root.update_lists();
        },

        delete_task: function(event) {
            if(confirm('Are you sure you would like to delete this task?\n\nOnce deleted it cannot be recovered.')){
                database.ref(`/${this.name}`).remove();
                this.$root.update_lists();
            }
        },

        toggle_done: function(event) {
            if(this.done){
                database.ref(`/${this.name}`).update({done: false});
            }else{
                database.ref(`/${this.name}`).update({edit_mode: false});
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
                database.ref(`/${this.name}`).update({done: false});
            }else{
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
        <div id="add_task" class="add_task">
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
            if(this.title_input.replace(' ', '') != '') {
                database.ref(`/${this.title_input}`).set({
                    title: this.title_input,
                    description: this.description_input,
                    done: false,
                    edit_mode: false,
                });

                document.getElementById("add_title").value = '';
                document.getElementById("add_description").value = '';
                event.preventDefault()

                this.$root.update_lists();
            }else{
                alert("You must enter a title.")
            }
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
        <div v-if="theme == 'flowers'">
            <img id="decal" class="bottom_decal" src="https://gardenbeast-9fcd.kxcdn.com/wp-content/uploads/2020/07/buy-succulents-top-1.png" alt=""></img>
            <img id="decal" class="left_decal" src="https://cdn.shopify.com/s/files/1/2198/4603/products/4inchsucculent_1200x.png?v=1601367978" alt=""></img>
            <img id="decal" class="right_decal" src="https://www.sublimesucculents.com/wp-content/uploads/2019/05/orange-succulents-echeveria-sanyatwe.png" alt=""></img>
        </div>

        <div v-else-if="theme == 'technology'">
            <img id="decal" class="bottom_technology_decal" src="https://www.hexafair.com/wp-content/uploads/2019/03/Banner-2.png" alt=""></img>
            <img id="decal" class="left_technology_decal" src="https://www.esri.com/content/dam/esrisites/en-us/industries/aec/assets/aec-banner-illustration.png" alt=""></img>
            <img id="decal" class="right_decal" src="https://kinexon.com/uploads/images/Sports/_1200x800_crop_center-center_82_line/customizable_sports_technology.png" alt=""></img>
        </div>

        <div v-else>
            <img id="decal" class="purdue_decal" src="https://se-infra-imageserver2.azureedge.net/clink/images/36b063d1-6c66-44cd-9269-3133d424157dac4e863d-e439-4db2-93ba-2ec6f609e380.png" alt=""></img>
            <img id="decal" class="boiler_decal" src="http://static1.squarespace.com/static/5717ee8e1bbee08525c09f91/t/5a1dfa05e4966b1342847e8e/1516630756250/Purdue-Boilermakers.gif?format=1500w" alt=""></img>
            <img id="decal" class="pete_decal" src="https://lh3.googleusercontent.com/proxy/Ui8XtqQDqVX8O-KogUgBBmJXK85hr-vc6QPf9_qbMY29y6SkfvNuRe94tG_wWOoyrU_RJ9w4ocIV4SGNiFz_1QBeVBDEoH0o11Ip" alt=""></img>
        </div>
    `
});

Vue.component('settings', {
    props: ['theme'],
    data: function() {
        return {
            menu_visible: false
        }
    },
    template: `
        <div>
            <button class="settings_button" v-on:click.exact="toggle_settings">
                <img class="settings_pic" src="https://iconarchive.com/download/i86477/grafikartes/flat-retro-modern/settings.ico" alt="Settings"/>
            </button>

            <div class="dropdown_menu" v-if="menu_visible">
                <h2 class="settings_text">Settings</h2>
                <h3 class="theme_text">Theme</h3>
                <hr class="theme_line" color="black">

                <div class="theme_icons">
                    <button id="icon" class="toggle_flowers" v-on:click="toggle_flowers">
                        <img id="icon_image" class="flowers_icon" src="https://i.pinimg.com/originals/b6/03/35/b60335eed3fd7e7af7f9ffce47b7f9b7.png" alt="Settings"/>
                    </button>

                    <button id="icon" class="toggle_technology" v-on:click="toggle_technology">
                        <img id="icon_image" class="technology_icon" src="https://www.morganstanley.com/pub/content/dam/msdotcom/about-us/technology/investment-tech-innovation.png" alt="Settings"/>
                    </button>

                    <button id="icon" class="toggle_purdue" v-on:click="toggle_purdue">
                        <img id="icon_image" class="purdue_icon" src="https://s.yimg.com/cv/apiv2/default/ncaab/20181214/500x500/purdue_wbg.png" alt="Settings"/>
                    </button>
                </div>
            </div>
        </div>
    `,
    methods: {
        toggle_settings: function(event) {
            this.menu_visible = !this.menu_visible;
        },
        toggle_flowers: function(event) {
            this.$emit('flowers');
        },
        toggle_technology: function(event) {
            this.$emit('technology');
        },
        toggle_purdue: function(event) {
            this.$emit('purdue');
        }
    }
});

Vue.component('settings_and_addons', {
    template: `
        <div>
            <settings v-bind:theme="theme" class="settings" 
                @technology="toggle_technology" 
                @flowers="toggle_flowers"
                @purdue="toggle_purdue">
            </settings>

            <theme_decals v-bind:theme="theme"></theme_decals>
        </div>
    `,
    data: function() {
        return {
            theme: "flowers"
        }
    },
    methods: {
        toggle_flowers: function(event) {
            this.theme = "flowers"
            document.body.style.backgroundColor = "#f2f2f2";
        },
        toggle_technology: function(event) {
            this.theme = "technology";
            document.body.style.backgroundColor = "#C0C0C0";
        },
        toggle_purdue: function(event) {
            this.theme = "purdue"
            document.body.style.backgroundColor = "#9D968D";
        }
    }
});

// The Vue instance
const app = new Vue({
    el: '#app',
    data: function(){
        return {
            task_data_list: [],
            finished_task_data_list: [],
        }
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
