// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

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
const profile = require('../Cards/profile.json')
const { JOB } = require('./job.js');
const card = require('../Cards/User_profile.json')
const browse = require('../Cards/Browse_food') 
const quantity = require('../Cards/finalising_food.json')
const bill = require('../Cards/bill')
const { UserProfile } = require('../profile');
const { order } = require('../Food_order/foodorder')
const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const NAME_PROMPT = 'NAME_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const USER_PROFILE = 'USER_PROFILE';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const TEXT_PROMPT = 'TEXT_PROMPT';
let userProfile = {};
let order_details = {};
 let approve = '';
 let flag = 0;
class UserProfileDialog extends ComponentDialog {
    constructor(userState) {
        super('userProfileDialog');

        if (!userState) throw new Error('[MainDialog]: Missing parameter \'Userstate\' is required');

        this.userProfile = userState.createProperty(USER_PROFILE);
        this.order_details = userState.createProperty(order)

        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new JOB());
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.User.bind(this),
            this.Show.bind(this),
            this.browse.bind(this),
            this.quantity.bind(this),
            this.finalisingorder.bind(this)
        ]));
        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        console.log(turnContext.activity.value)
        if(turnContext.activity.value !== undefined && turnContext.activity.value.x !== undefined ){
            userProfile = await this.userProfile.get(turnContext, new UserProfile());

            userProfile.name = turnContext.activity.value.myName;
            userProfile.email = turnContext.activity.value.myEmail;
            userProfile.number = turnContext.activity.value.myTel;
            userProfile.address = turnContext.activity.value.myAddress;
        }else if( turnContext.activity.value !== undefined && turnContext.activity.value.FoodChoice !== undefined){
            order_details = await this.order_details.get(turnContext, new order());

           order_details.N_food = turnContext.activity.value.N_food
           order_details.S_food = turnContext.activity.value.S_food
           order_details.F_food = turnContext.activity.value.F_food

        }else if (turnContext.activity.value !==undefined && turnContext.activity.value.Quantity !== undefined){
            const obj = Object.entries(turnContext.activity.value)
           
            // console.log(order_details.price)
           
            order_details.total_items =  0;
            for(let i = 1; i<obj.length;i++){
                order_details.total_items++;
                order_details.item = obj[i][0]
                let price_item = new order('','','','',`${obj[i][0]}`,'').price
              
                if(obj[i][1] !== ''){
                    let total_amt_item = price_item * obj[i][1];
                    order_details.items[i-1] = [obj[i][0], obj[i][1],total_amt_item]
                }else{

                    order_details.items[i-1] = [obj[i][0], 0,0]
                }
               
            }
            
        }else if (turnContext.activity.value !==undefined && turnContext.activity.value.action !== undefined){
                    console.log("id")
                    approve = 'Bill has been paid'
        }else if (turnContext.activity.value !==undefined && turnContext.activity.value.JOB !== undefined){
            userProfile.class_10 = turnContext.activity.value.class_10;
            userProfile.class_12 = turnContext.activity.value.class_12;
            userProfile.grad = turnContext.activity.value.grad;
            userProfile.interest = turnContext.activity.value.interest;
            userProfile.w_exp = turnContext.activity.value.w_exp;
        }
        console.log("HELL 2 ")

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            console.log("In turn status empty")
            await dialogContext.beginDialog(this.id);
        }
    }

    async User(step) {

        console.log("In step 1")
        if(Object.keys(userProfile).length !== 0){
        //  console.log(userProfile)   
        profile.body[1].columns[0].items[0].text = `Hello ${userProfile.name}`
        profile.body[2].facts[0].value =  `${userProfile.email}`
        profile.body[2].facts[1].value =  `${userProfile.number}`
        profile.body[2].facts[2].value =  `${userProfile.address}`

        await step.context.sendActivity({
            attachments: [CardFactory.adaptiveCard(profile)]
        })
        const options = {
        prompt: 'Would you like to order food or apply for a job? ',
        retryPrompt: 'Please select from the two',
        choices: this.getchoices().one
        }
        return await step.prompt(CHOICE_PROMPT, options) 
    }   else{
            step.context.sendActivity({
                attachments: [CardFactory.adaptiveCard(card)]
            });
            return await step.context.sendActivity('Waiting for input..')
        }
    }
    async Show(step){
        console.log("In step 2")
        if(step.result.value === 'Order food'){
            return await this.bookdialog(step)
        }else{
            console.log("ENTERING JOB.js")  
            flag = 1;
            return await step.beginDialog('JOB',userProfile);
            
       }
    }
    async bookdialog(step){
        await step.context.sendActivity("Welcome to Celebal food delivery")
        await step.context.sendActivity(" With our assistant, you can order food with just few taps!!")
        const options = {
            prompt: "How can we help you",
            repromt: 'Please choose from two options',
            choices: this.getchoices().second
        }
        return await step.prompt('CHOICE_PROMPT',options)
    }

    async browse(step){
        if(flag === 1){
            return await step.endDialog(step)
        }else{
        console.log('In browse')
        if(step.result.value === "Browse menu"){
            await step.context.sendActivity({
                attachments: [CardFactory.adaptiveCard(browse)]
                
            })
            return await step.prompt(TEXT_PROMPT, 'Press okay and type done. When you are finished ordering');
        }else{
            step.context.sendActivity("Please contact us on: +91-9654653056")
            return await step.endDialog(step);
        }
    }
}
    async quantity(step){
        console.log("In quantity")
        let N,S,F;
        if(order_details.S_food !== undefined){
            N = order_details.S_food.split(',')        
        }
        if(order_details.N_food !== undefined){
            S = order_details.N_food.split(',') 
        }
        if(order_details.F_food !== undefined){
            F = order_details.F_food.split(',') 
        }
        let main;

        if(N!== undefined && S!== undefined && F!==undefined){
            main = N.concat(S);
            main = main.concat(F);
        }
        else if(N!== undefined && S!== undefined)
            main = N.concat(S)
        else if (N!== undefined && F!== undefined)
            main = N.concat(F)
        else if (F!== undefined && S!== undefined)
            main = S.concat(F);
        else if (N !== undefined)
            main = N;
        else if (S !== undefined)
            main = S;
        else if (F !== undefined)
            main = F;
        else{
            step.context.sendActivity("It seems like you did'nt order anything. Please scroll up and order something")
        }
        let i = 0;
        console.log(main.length)
        for(i = 0; i<main.length;i++ ){
            quantity.body[1].facts[i] = {
                "title": "1",
                "value": "Value 1"
            } 
            quantity.body[1].facts[i].title = `${i+1}`
            quantity.body[1].facts[i].value = main[i]
            quantity.body[i+3] = { "type": "Input.Number", "placeholder": `Quantity of ${main[i]}` , "min": "0", "id": `${main[i]}`}
        }
        
        quantity.body[i + 3] = {
            "type": "ActionSet",
            "actions": [
                {
                    "type": "Action.Submit",
                    "title": "Submit",
                    "data": {
                        "Quantity": "Submit"
                    }
                }
            ]
        }
        await step.context.sendActivity({
            attachments: [CardFactory.adaptiveCard(quantity)]
        })  
        
        return await step.prompt(TEXT_PROMPT, 'Press Submit and type done. To continue');
    }
    
    async finalisingorder(step){
        console.log('Finalising')
        let total_amt = 0
        let flag = 1;
        if(flag === 1){
            for( let i = 0; i<order_details.total_items;i++){
                if(order_details.items[i][1] === ''){
                    flag = 0;
                    break;
                }
                console.log("in loop")
                bill.body[2 + i] ={
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "horizontalAlignment": "Center",
                                    "text": `${i + 1}`,
                                    "wrap": true
                                }
                            ],
                            "width": "auto"
                        },
                        {
                            "type": "Column",
                            "spacing": "Medium",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": `${order_details.items[i][0]}:${order_details.items[i][1]}`,
                                    "wrap": true
                                }
                            ],
                            "width": "stretch"
                        },
                        {
                            "type": "Column",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": `${order_details.items[i][2]}`,
                                    "wrap": true
                                }
                            ],
                            "width": "auto"
                        }
                    ]
                }
                total_amt += order_details.items[i][2]
            }
            bill.body[2 + order_details.items.length] =  {
                "type": "ColumnSet",
                "spacing": "Large",
                "separator": true,
                "columns": [
                    {
                        "type": "Column",
                        "items": [
                            {
                                "type": "TextBlock",
                                "horizontalAlignment": "Right",
                                "text": "Total Amount \t",
                                "wrap": true
                            }
                        ],
                        "width": "stretch"
                    },
                    {
                        "type": "Column",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": ` ${total_amt}`
                            }
                        ],
                        "width": "auto"
                    }
                ]
            }
            bill.body[2 + order_details.items.length + 1] = {
                        "type": "Container",
                        "items": [
                            {
                                "type": "ActionSet",
                                "actions": [
                                    {
                                        "type": "Action.Submit",
                                        "title": "Approve",
                                        "style": "positive",
                                        "data": {
                                            "action": "approve"
                                        }
                                    }
                                ]
                            }
                        ]
                    } 
           await step.context.sendActivity({
               attachments: [CardFactory.adaptiveCard(bill)]
           })
        }else{
            send.context.sendActivity("You have not specified the quantity of each item. Please scroll up and select.")
            this.quantity(step)
        }   
        return await step.prompt(TEXT_PROMPT, "Press approve and type done")
    }

    async end(step){
        console.log('end')
        if(approve !== ''){
            step.context.sendActivity({
                text: `${approve} +. Thank you!`
            })
        }
       return await step.endDialog(step)
    }
         getchoices() {
        const choice =[
            {
                value: 'Order food',
            },
            {
                value: 'Apply for a job'
            }
        ]
        const arr = [
                {
                    value: "Browse menu",
                },
                {
                    value: "Contact us"
                }
            ]
        return{
            one: choice,
            second: arr
        
        }
    }

 }

module.exports.UserProfileDialog = UserProfileDialog;
module.exports.userProfile = userProfile
