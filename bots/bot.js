const { ActivityHandler } = require('botbuilder')

class bot extends ActivityHandler {

    /**
     * 
     * @param {ConversationState} conversationState 
     * @param {UserState} userState
     * @param {Dialog} dialog
     */
    
     constructor(conversationState, userState, dialog ){
         super();
         if(!conversationState) throw new Error('[Dialog bot] conversation state is missing')
         if(!userState) throw new Error('[Dialog bot] userState is missing')
         if(!dialog) throw new Error('[Dialog bot] dialog is missing')

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogstate = this.conversationState.createProperty('DialogState')
    
        const WELCOME_TEXT = 'Type anything to see an fill your profile.';
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; cnt++) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(`Welcome to Bot  ${ membersAdded[cnt].name }. ${ WELCOME_TEXT }`);
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
        this.onMessage(async (context, next) =>{

            console.log("Running bot.js")
            await this.dialog.run(context, this.dialogstate)
            await next()
        })
    }

    //saving state changes

    async run(context){
        await super.run(context)

        await this.conversationState.saveChanges(context,false)
        await this.userState.saveChanges(context, false)
    }
  
}


module.exports.bot = bot;