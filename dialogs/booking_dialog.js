const fs = require('fs')
const path = require('path')
const { ActivityHandler, ActionTypes, ActivityTypes, CardFactory } = require('botbuilder');
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
const browse = require('../Cards/Browse_food') 
const CHOICE_PROMPT = 'ChoicePrompt'
const CONFIRM_PROMPT = 'confirmPrompt';
const DATE_RESOLVER_DIALOG = 'dateResolverDialog';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class bookdialog extends ComponentDialog {
    constructor(id){
            super(id)
            this.addDialog(new TextPrompt(TEXT_PROMPT));
            this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                    this.begin.bind(this),
                    this.browse.bind(this),
                    this.select.bind(this)
                ]))
            
            this.initialDialogId = WATERFALL_DIALOG;
    }

    async begin(step){
        await step.context.sendActivity("Welcome to Celebal food delivery")
        await step.context.sendActivity(" With our assistant, you can order food with just few taps!!")
        const options = {
            prompt: "How can we help you",
            repromt: 'Please choose from two options',
            choices: this.choose()
        }
        console.log(step.context.activity.value)
        return await step.prompt('CHOICE_PROMPT',options)

    }
    async browse(step){
        if(step.result.value === "Browse menu"){
            await step.context.sendActivity({
                attachments: [CardFactory.adaptiveCard(browse)]
            })
        }else{
            step.context.sendActivity("Please contact us on: +91-9654653056")
        }
        // step.context.activity.text = step.context.activity.value["category"]
        return await step.prompt(TEXT_PROMPT, { prompt: '' });

    }
    async select(step){
        await step.context.sendActivit('get response')

        const result = step.context.activity.value;
        console.log(result)
    }

    async promptValidator(promptContext){
        const activity = promptContext.context.activity;
        return activity.type === 'message' && activity.channelData.postback;
    }


    choose(){
        const arr = [
            {
                value: "Browse menu",
            },
            {
                value: "Contact us"
            }
        ]
        return arr;
    }



}


module.exports.bookdialog = bookdialog