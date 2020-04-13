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
const card = require('../Cards/profile.json')
const { UserProfile } = require('../profile');

const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const NAME_PROMPT = 'NAME_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const USER_PROFILE = 'USER_PROFILE';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const TEXT_PROMPT = 'TEXT_PROMPT';
let userProfile;
class UserProfileDialog extends ComponentDialog {
    constructor(userState, bookdialog) {
        super('userProfileDialog');

        if (!bookdialog) throw new Error('[MainDialog]: Missing parameter \'bookingDialog\' is required');
        if (!userState) throw new Error('[MainDialog]: Missing parameter \'bookingDialog\' is required');

        this.userProfile = userState.createProperty(USER_PROFILE);

        this.addDialog(new TextPrompt(NAME_PROMPT));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new NumberPrompt(NUMBER_PROMPT, this.agePromptValidator));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new TextPrompt(NAME_PROMPT,this.numberPromptValidator));
        this.addDialog(new TextPrompt(NAME_PROMPT, this.emailPromptValidator));
        this.addDialog(new TextPrompt(TEXT_PROMPT,this.addressPromptValidator))
        this.addDialog(new ChoicePrompt('choiceprompt'));
        this.addDialog(new ChoicePrompt('selectionprompt'))
        this.addDialog(bookdialog)
       // this.addDialog(new AttachmentPrompt(ATTACHMENT_PROMPT, this.picturePromptValidator));
       
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.Gender.bind(this),
            this.nameStep.bind(this),
            this.nameConfirmStep.bind(this),
            this.ageStep.bind(this),
            this.ageConfirmStep.bind(this),
            this.numberstep.bind(this),
            this.numberConfirmStep.bind(this), 
            this.emailstep.bind(this),   
            this.addressstep.bind(this),        
            this.summaryStep.bind(this),
            this.choiceStep.bind(this),
    
                 // this.showCard.bind(this)
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

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async Gender(step) {
        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        // Running a prompt here means the next WaterfallStep will be run when the user's response is received.
        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'Select a gender',
            choices: ChoiceFactory.toChoices(['Male', 'Female', 'Other'])
        });
    }
    async nameStep(step) {
        step.values.gender = step.result.value;
        return await step.prompt(NAME_PROMPT, 'Please enter your name.');
    }

    async nameConfirmStep(step) {
        step.values.name = step.result;

        // We can send messages to the user at any point in the WaterfallStep.
        await step.context.sendActivity(`Thanks ${ step.result }.`);

        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        return await step.prompt(CONFIRM_PROMPT, 'Do you want to give your age?', ['yes', 'no']);
    }

    async ageStep(step) {
        if (step.result) {
            // User said "yes" so we will be prompting for the age.
            // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
            const promptOptions = { prompt: 'Please enter your age.', retryPrompt: 'The value entered must be greater than 0 and less than 150.' };

            return await step.prompt(NUMBER_PROMPT, promptOptions);
        } else {
            // User said "no" so we will skip the next step. Give -1 as the age.
            return await step.next(-1);
        }
    }

    async ageConfirmStep(step) {
        step.values.age = step.result;

        const msg = step.values.age === -1 ? 'No age given.' : `I have your age as ${ step.values.age }.`;

        // We can send messages to the user at any point in the WaterfallStep.
        await step.context.sendActivity(msg);
       
        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        return await step.prompt(CONFIRM_PROMPT, 'Do you want to give your number?', ['yes', 'no']);
    }

    async numberstep(step) {
        if (step.result) {
            // User said "yes" so we will be prompting for the age.
            // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
            const promptOptions = { prompt: 'Please enter your number.', retryPrompt: 'The value entered number must be of 10 digits.' };

            return await step.prompt(NAME_PROMPT, promptOptions);
        } else {
            // User said "no" so we will skip the next step. Give -1 as the age.
            return await step.next(-1);
        }
    }

    async numberConfirmStep(step) {
        step.values.number = step.result;

        const reg_num = /^[0-9]{10}$/;
        let msg = "";
        if(step.values.number === -1){
            msg = "No number given"
        }else if (!reg_num.test(step.values.number)){
            msg = "Invalid number"
        }else{
            msg = `Your number is ${ step.values.number }`
        }

        // We can send messages to the user at any point in the WaterfallStep.
        await step.context.sendActivity(msg);
        const promptOptions = { prompt: 'Please enter your email ID. ', retryPrompt: 'The email ID is invalid, please try again. '};
        return await step.prompt(NAME_PROMPT,promptOptions);
    }
    async emailstep(step) {
        step.values.email = step.result; 
        const promptOptions = { prompt: "Please provide your address", retryPrompt: 'This address is invalid, please try again'}
        return await step.prompt(TEXT_PROMPT,promptOptions);
    }
    async addressstep(step){
        step.values.address = step.result;
        const opt = {
            prompt:'Do you want to view your profile or continue? Please choose',
            retryPrompt: 'Please choose from either of the two options',
            choices: this.choices()   
            }
        return await step.prompt(CHOICE_PROMPT, opt)
    }
    async summaryStep(step) {
            // Get the current profile object from user state.
            userProfile = await this.userProfile.get(step.context, new UserProfile());

            userProfile.gender = step.values.gender;
            userProfile.name = step.values.name;
            userProfile.age = step.values.age;
            userProfile.number = step.values.number;
            userProfile.email = step.values.email;
            userProfile.address = step.values.address;
        if (step.result.value === 'Show') {
            card.body[1].columns[0].items[0].text = userProfile.name;
            var body =  card.body[2];

            for(let i = 0;i < 4; i++){
                var val = body.facts[i].title;
                if(val === 'Age'){
                    body.facts[i].value = userProfile.age
                }
                else if(val === 'Gender')
                   body.facts[i].value = userProfile.gender
                else if(val === 'Number')
                    body.facts[i].value = userProfile.number
                else if(val === 'Email')
                    body.facts[i].value = userProfile.email
                else if(val === 'Address')
                    body.facts[i].value = userProfile.address
            }

            await step.context.sendActivity({
                text: 'Here is your profile',
                attachments:  [CardFactory.adaptiveCard(card)]
            });          
        } 
        const options = {
            prompt: 'Would you like to order food or apply for a job? ',
            retryPrompt: 'Please select from the two',
            choices: this.getchoices()
        }

        return await step.prompt('selectionprompt', options)
    }

    async choiceStep(step){
         if(step.result.value === 'Order food'){
            const bookingdetails={}
            return await step.beginDialog('bookdialog',bookingdetails);
         }else{
             await step.context.sendActivity('Applying for a job')
         }
    
    }



    async agePromptValidator(promptContext) {
        // This condition is our validation rule. You can also change the value at this point.
        console.log(promptContext.recognized.value)
        return promptContext.recognized.succeeded && promptContext.recognized.value > 0 && promptContext.recognized.value < 150;
    }
    async numberPromptValidator(promptContext) {
        const num = promptContext.recognized.value;
        const reg_num = /^[0-9]{10}$/;
        console.log(promptContext.recognized.value)
        console.log(reg_num.test(num)) 
        const bool = reg_num.test(num);  
        // if(reg_num.test(num)){
        //     return  promptContext.recognized.succeeded
        // }
        // return prompt;
        return promptContext.recognized.succeeded && bool
    }

    async emailPromptValidator(promptContext){
        email = promptContext.recognized.value && promptContext.recognized.value.trim();
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
         if(emailPattern.test(email)){
            return promptContext.recognized.succeeded
           }
           return -1;
    }
    async addressPromptValidator(promptContext){
        return promptContext.recognized.succeeded
    }

    getchoices() {
        const choice = [
            {
                value: 'Order food',
            },
            {
                value: 'Apply for a job'
            }
        ]

        return choice
    }

    choices() {
        const arr = [
            {
                value: 'Show'
            },
            {
                value: "Let's continue"
            }
        ]
        return arr
    }


}

module.exports.UserProfileDialog = UserProfileDialog;
