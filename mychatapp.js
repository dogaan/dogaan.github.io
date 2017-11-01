var app = {
    messageToSend: '',
    ChatEngine: false,
    me: false,
    chat: false,
    users: {},
    messages: [],
    init: function() {
        // this.ChatEngine = ChatEngineCore.create({
        //     publishKey: 'pub-c-5ae799db-5d49-410c-bf0c-52b442e9dbb9',
        //     subscribeKey: 'sub-c-849d9b56-ddda-11e6-9065-02ee2ddab7fe'
        // }, {
        //     endpoint: 'http://localhost:3000/insecure',
        //     globalChannel: 'chat-engine-demo'
        // });

        // Make sure to import ChatEngine first!
        this.ChatEngine = ChatEngineCore.create({
            publishKey: 'pub-c-f9e706da-5972-4b9a-a833-7549447d11e0',
            subscribeKey: 'sub-c-92efcd4c-be7f-11e7-bf1e-62e28d924c11'
        }, {
            globalChannel: 'global',
            endpoint: 'https://pubsub.pubnub.com/v1/blocks/sub-key/sub-c-92efcd4c-be7f-11e7-bf1e-62e28d924c11/chat-engine-server'
        });

        let newPerson = generatePerson(true);
        this.ChatEngine.connect(newPerson.uuid, newPerson, 'auth-key');

        this.ChatEngine.on('$.ready', function(data) {
            app.me = data.me;
            app.chat = new app.ChatEngine.Chat('chat-engine-demo');
            
            // Listen for users coming online
            // Presence Joins and Herenows
            app.chat.on('$.online.*', function(data) {
                app.users[data.user.uuid] = data.user;
                app.renderUsers();
            });

            // Listen for users going offline
            app.chat.on('$.offline.*', function(data) {
                delete app.users[data.user.uuid];
                app.renderUsers();
            });

            // Listen for messages.
            app.chat.on('message', function(message) {
                app.renderMessage(message);
            });

        });

    },

    sendMessage: function() {
        this.messageToSend = this.$textarea.val()
        if (this.messageToSend.trim() !== '') {
            this.$textarea.val('');
            this.chat.emit('message', this.messageToSend);
        }
    },
    
    cacheDOM: function() {
        this.$chatHistory = $('.chat-history');
        this.$button = $('button');
        this.$textarea = $('#message-to-send');
        this.$chatHistoryList = this.$chatHistory.find('ul');
    },
    bindEvents: function() {
        this.$button.on('click', this.sendMessage.bind(this));
        this.$textarea.on('keyup', this.sendMessageEnter.bind(this));

    },
    renderUsers: function() {

        var peopleTemplate = Handlebars.compile($("#person-template").html());
        var user = false;
        $('#people-list ul').empty();
        for (const [ uuid, user ] of Object.entries(app.users)) {
            $('#people-list ul').append(peopleTemplate(user.state));                
        }
    },

    renderMessage: function(message) {

        var meTemp = Handlebars.compile($("#message-template").html());
        var userTemp = Handlebars.compile($("#message-response-template").html());

        var template = userTemp;

        if (message.sender.uuid == app.me.uuid) {
            template = meTemp;
        }

        var context = {
            messageOutput: message.data,
            time: app.getCurrentTime(),
            user: message.sender.state
        };

        app.$chatHistoryList.append(template(context));

        this.scrollToBottom();

    },

    sendMessageEnter: function(event) {
        // enter was pressed
        if (event.keyCode === 13) {
            this.sendMessage();
        }
    },
    scrollToBottom: function() {
        this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
    },
    getCurrentTime: function() {
        return new Date().toLocaleTimeString().
        replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    },
    getRandomItem: function(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

};
app.cacheDOM();
app.bindEvents();
app.init();