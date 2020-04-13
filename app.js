const server = require('./server')
const { BotFrameworkAdapter, MemoryStorage, ConversationState, UserState } = require('botbuilder')
const path = require('path')
const dotenv = require('dotenv')
const {bookdialog} = require('./dialogs/booking_dialog')
const BOOK_DIALOG = 'bookdialog'

const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

const { bot } = require('./bots/Bot');
const { UserProfileDialog } = require('./dialogs/user_details');

const book = new bookdialog(BOOK_DIALOG)
const dialog = new UserProfileDialog(userState,book)
const Bot = new bot(conversationState, userState, dialog)

//importing required bot info
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

//creating an adaptor
const adaptor = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
})

const onTurnErrorHandler = async (context, error) =>{

    console.error(`We caught an ${error} `)

    //sending error message to user
    await context.sendActivity("The bot encountered an error")
}

adaptor.onTurnError = onTurnErrorHandler;

//starting the server
server.post('/api/messages', (req, res) => {
    adaptor.processActivity(req, res, async(context) => {
      //Route to main dialog
      await Bot.run(context)
    })
})

module.exports = adaptor;

