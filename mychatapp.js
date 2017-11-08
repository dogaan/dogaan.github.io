var ChatEngineInitParams = [
  {
    publishKey: 'pub-c-31365c8b-8128-4c58-8fc8-ca26b3b6a138',
    subscribeKey: 'sub-c-6be8075c-c413-11e7-ba65-4295fab41076'
  }, {
    // debug: true,
      globalChannel: 'global-tester2',
      endpoint: 'https://pubsub.pubnub.com/v1/blocks/sub-key/sub-c-73eb70de-c3f4-11e7-b375-767e250a4e65/server'
  }
];

var app = {
    messageToSend: '',
    ChatEngine: false,
    me: false,
    chat: false,
    users: {},
    messages: [],
    init: function() {
        // Make sure to import ChatEngine first!
        this.ChatEngine = ChatEngineCore.create({
            publishKey: 'pub-c-31365c8b-8128-4c58-8fc8-ca26b3b6a138',
            subscribeKey: 'sub-c-6be8075c-c413-11e7-ba65-4295fab41076'
        });

        // Let's remember our random generated users :)
        var myChatUser = JSON.parse(localStorage.getItem("myChatUser"));
        if (!myChatUser) {
            myChatUser = generatePerson(true);
            localStorage.setItem('myChatUser', JSON.stringify(myChatUser));
        }
        
        this.ChatEngine.connect(myChatUser.uuid, myChatUser, 'auth-key');

        this.ChatEngine.on('$.ready', function(data) {

            app.me = data.me;
            app.chat = new app.ChatEngine.Chat('chat-engine-demo2');
            
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
                console.log(message)
                app.renderMessage(message);
            });

            let searchy = app.chat.search({
              reverse: true,
              event: 'message',
              limit: 50
            });

            searchy.on('message', (data) => {
              app.renderMessage(data);
            });

        });

    },

    sendMessage: function() {
        this.messageToSend = this.$textarea.val()
        if (this.messageToSend.trim() !== '') {
            this.$textarea.val('');
            this.chat.emit('message', {
                text: this.messageToSend
            });
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
        debugger;
        if (message.sender.uuid == app.me.uuid) {
            template = meTemp;
        }

        console.log(message)

        var context = {
            messageOutput: message.data.text,
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
};
app.cacheDOM();
app.bindEvents();
app.init();