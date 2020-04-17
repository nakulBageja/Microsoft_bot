const { CardFactory } = require('botbuilder');
const {
    AttachmentPrompt,
    ChoiceFactory,
    ChoicePrompt,
    ComponentDialog,
    ConfirmPrompt,
    DialogSet,
    DialogTurnStatus,
    NumberPrompt,
    TextPrompt,
    WaterfallDialog
} = require('botbuilder-dialogs');
const info_card = require('../Cards/job_info')
const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const NAME_PROMPT = 'NAME_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const TEXT_PROMPT = 'TEXT_PROMPT';
let user_profile = {}
class JOB extends ComponentDialog {
    constructor(){
        super('JOB')

        this.addDialog(new TextPrompt(TEXT_PROMPT))

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.intro.bind(this),
            this.moreinfo.bind(this),
            this.check.bind(this)
        ]))
        this.initialDialogId = WATERFALL_DIALOG
    }
    
    async intro(step){
        user_profile = step.options;
        console.log("in job")
        await  step.context.sendActivity("Hi, I'm a recruit bot")
        await step.context.sendActivity("I have been assigned to pre-qualify candidates and schedule an interview for Celebal Company")
        return await step.prompt(TEXT_PROMPT, "Type anything to continue")
    }
    async moreinfo(step){
        step.context.sendActivity("I have some information about you, I would love to get some more")
        
        let fact = info_card.body[0].columns[0].items[1].facts;
        
        fact[0].value = user_profile.name;
        fact[1].value = user_profile.number;
        fact[2].value = user_profile.email;
        fact[3].value = user_profile.address;

        await step.context.sendActivity({
            attachments: [CardFactory.adaptiveCard(info_card)]
        }) 
        console.log("POP")
        return step.prompt(TEXT_PROMPT, "Press submit and type done")
    }
    async check(step){
        let msg = '';
        let w_exp = user_profile.w_exp !== undefined ? user_profile.w_exp : 0
        let int = user_profile.interest
        let work =0;
        switch(int){
            case '':
                msg = "Please complete your profile"
                break;
            case 'UI/UX': 
                work = 3;
                break;
            case 'Php developer':
                work = 4;
                break;
            case 'Android developer':
                work = 2;
                break;
            default: 
                msg = "Sorry, we are not looking for candidates in that field right now!"
                break;
        }

        if(msg === ''){
            if(w_exp > work){
                msg = "Great! Your profile seems good to me! I will forward your application to the employer for interview. You will be contacted soon"
            }else{
                msg = "I'm sorry! You don't have much work experience. Please try again in few years"
            }
        }
        await step.context.sendActivity(msg)
       
    }
}

module.exports.JOB = JOB