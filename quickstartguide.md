Quick start Guide
--------------------
PubNub ChatEngine is an object oriented event emitter based framework for building chat applications in Javascript. It reduces the time to build chat applications drastically and provides essential components like typing indicators, online presence monitoring and message history out of the box.

We'll get you started with some existing UI on Codepen and walk you through the key elements of a chat application with ChatEngine. This guide only shows you how to build with ChatEngine using JavaScript but you can easily integrate ChatEngine to your IOS and Android applications using React Native. See the links at the end of this guide to see how.

Below is the final Codepen we will build which is a simple chat app with online presence and message history.

<iframe height='600' width='770' scrolling='no' title='ChatEngine Embed 0.3 - Message History' src='//codepen.io/team/PubNub/embed/pdbXje/?height=265&theme-id=light&default-tab=result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/team/PubNub/pen/pdbXje/'>ChatEngine Embed 0.3 - Message History</a> by PubNub (<a href='https://codepen.io/PubNub'>@PubNub</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
<br>
You don't need to copy/paste anything other than your publish/subscribe keys here. All the functional code will be in the Codepens provided.

Before we start, let's get your account configured for ChatEngine so you can plug your PubNub keys in the Codepen examples and play around.

(WHAT'S BELOW WILL BE A BUTTON THAT WILL SPIN AND SPIT OUT THE KEYS ON THIS PAGE. FOR NOW PLEASE OPEN THE LINK BELOW IN A NEW TAB, CONFIGURE YOUR ACCOUNT AND COME BACK TO THIS PAGE)

Click [here](https://chat-engine-docs.surge.sh/docs/tutorial-pubnub.html) to get your account configured for ChatEngine or click here if you don't have an account.

Now, let's build a chat app with ChatEngine in 5 quick steps!

###ChatEngine Instantiation
The first step to every ChatEngine client is instantiating an instance of ChatEngine. Below is an example of how you would instantiate.

```javascript
ChatEngine = ChatEngineCore.create({
	publishKey: '<YOUR PUBLISH KEY>',
	subscribeKey: '<YOUR SUBSCRIBE KEY>'
});
```

###Connecting your ChatEngine client to PubNub
This step brings the client online in your global channel. You can think of it as being in the lobby. It requires that you provide a unique identifier for the client, an object that will be shared with all other clients to describe the user for this client and a token that will help PubNub determine the access privileges for this user.

Example `connect` call:
```javascript
ChatEngine.connect(String(new Date().getTime()), { nickName: "LoyalPubNubian" }, 'auth-key');
```

The `connect` call is asynchronous and fires a `$.ready` event when it successfully connects. Any code that follows should listen for this event and execute code in its handler.

###Creating/joining a chat room and listen for messages
Now that you're connected to the PubNub network, you can create/join a chat and start chatting! Of course the first step to a successful chat is listening. Example below shows you how to create/join a chat, listen to messages sent to it as well as sending messages to this chat.

```javascript
ChatEngine.on('$.ready', function(data) {
    this.chat = new ChatEngine.Chat('my-first-chat');

    // Listen for messages.
    this.chat.on('message', function(message) {
        console.log(message)
    });

    // Say hi!
    this.chat.emit('message', {
        text: 'Hi everyone!'
    });
}
```
<iframe height='600' width='600' scrolling='no' title='ChatEngine Embed 0.1 - Barebones Chat' src='//codepen.io/team/PubNub/embed/8e380bf717533d36641f4a5a8acfaccb/?height=265&theme-id=light&default-tab=result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/team/PubNub/pen/8e380bf717533d36641f4a5a8acfaccb/'>ChatEngine Embed 0.1 - Barebones Chat</a> by PubNub (<a href='https://codepen.io/PubNub'>@PubNub</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

Above is a Codepen that implements this piece of code with some UI. Click on the top right corner to edit on Codepen so you can plug your publish/subscribe keys in the JS code where it says
``publishKey: 'YOUR PUBLISH KEY',
  subscribeKey: 'YOUR SUBSCRIBE KEY'
  ``
Now you're ready to chat! 

**Pro Tip:** Open it in 2 different tabs (one incognito) and you can chat with yourself!

###Track the online presence of your users
It's fun to see who is online in a chat app and ChatEngine makes it super easy to track that. All you have to do is provide callbacks for `$.online.*` and `$.offline.*`. ChatEngine will fire these when users become online or go offline.

```javascript
// Listen for users coming online
this.chat.on('$.online.*', function(data) {
    this.users[data.user.uuid] = data.user;
    this.renderUsers();
});

// Listen for users going offline
this.chat.on('$.offline.*', function(data) {
    delete app.users[data.user.uuid];
    this.renderUsers();
});
```

Here is another Codepen that implements the code above with some new UI to show when your users come online! Once, again update the JS code with your publish/subscribe keys and you're good to go. It will generate a fake user for you and even display an avatar.

**Pro Tip:** Open it in 2 different tabs (one incognito) and you can see the other fake user come online!
<iframe height='600' width='600' scrolling='no' title='ChatEngine Embed 0.2 - Online Presence Tracking' src='//codepen.io/team/PubNub/embed/9bbda22c4c0ffccfb8877f5f07dac512/?height=265&theme-id=light&default-tab=result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/team/PubNub/pen/9bbda22c4c0ffccfb8877f5f07dac512/'>ChatEngine Embed 0.2 - Online Presence Tracking</a> by PubNub (<a href='https://codepen.io/PubNub'>@PubNub</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe> 

###Provide message history for your channels
Providing a chat history helps retain context and makes chat stickier. Let's add some code to provide a 50 message chat history for your users.

```javascript
// Show history of your channel
this.chat.search({
	reverse: true,
	event: 'message',
	limit: 50
}).on('message', (data) => {
	this.renderMessage(data);
});
```

As usual, just click on the Codepen below, add your publish/subscribe keys and see the message history in action. Try commenting it out and refreshing the page to see how you can turn it on/off.

**Tip:** In order to see message history in action, type a couple messages, reload the page and see your messages magically reappear.

<iframe height='600' width='600' scrolling='no' title='ChatEngine Embed 0.3 - Message History' src='//codepen.io/team/PubNub/embed/YENqdY/?height=265&theme-id=light&default-tab=result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/team/PubNub/pen/YENqdY/'>ChatEngine Embed 0.3 - Message History</a> by PubNub (<a href='https://codepen.io/PubNub'>@PubNub</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


