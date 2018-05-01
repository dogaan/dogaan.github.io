ChatEngine = ChatEngineCore.create({
    publishKey: 'pub-c-fab5d74d-8118-444c-b652-4a8ee0beee92',
    subscribeKey: 'sub-c-696d9116-c668-11e7-afd4-56ea5891403c'
});
// To keep things clean we'll put all our code in the app object.
var app = {
    users: {},      // An object to store our users in
    messages: [],   // A list to store our messages in
    init: function() {
        // This is a helper method to generate a random chat profile
        let newPerson = generatePerson(true);
      
        ChatEngine.connect(newPerson.uuid, newPerson);

        ChatEngine.on('$.ready', function(data) {
            app.me = data.me;
            app.myFirstChatRoom = new ChatEngine.Chat('chatengine-demo-room');

            // Listen for messages.
            app.myFirstChatRoom.on('message', function(message) {
                app.renderMessage(message);
            });
            
            // Listen for users coming online
            app.myFirstChatRoom.on('$.online.*', function(data) {
                app.users[data.user.uuid] = data.user;
                app.renderUsers();
            });

            // Listen for users going offline
            app.myFirstChatRoom.on('$.offline.*', function(data) {
                delete app.users[data.user.uuid];
                app.renderUsers();
            });
          
            // Show history of your channel as soon as it's connected
            app.myFirstChatRoom.on('$.connected', function() {
               
                app.myFirstChatRoom.search({
                  reverse: true,
                  event: 'message',
                  limit: 50
                }).on('message', (data) => {
                  app.renderMessage(data);
                });
            });

        });

    },

    sendMessage: function() {
        if ($('#message-to-send').val().trim().length != 0) {

            this.myFirstChatRoom.emit('message', {
                text: $('#message-to-send').val().trim()
            });

            $('#message-to-send').val('');
        }
    },
    
    bindEvents: function() {
        $('button').on('click', this.sendMessage.bind(this));
        $('#message-to-send').on('keyup', (event)=> {
            // enter was pressed
            if (event.keyCode === 13) {
                this.sendMessage();
            }
        });
    },

    renderUsers: function() {
        var peopleTemplate = Handlebars.compile($("#person-template").html());
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
            messageOutput: message.data.text,
            time: app.getCurrentTime(),
            user: message.sender.state
        };

        $('.chat-history').find('ul').append(template(context));

        this.scrollToBottom();

    },

    scrollToBottom: function() {
        $('.chat-history').scrollTop($('.chat-history')[0].scrollHeight);
    },
    getCurrentTime: function() {
        return new Date().toLocaleTimeString().
        replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    },
};

app.bindEvents();
app.init();