const Recognizers = require('@microsoft/recognizers-text-suite');

class Validate {
    static validateName(input) {
        const name = input && input.trim();
        return name !== undefined
            ? { success: true, name: name }
            : { success: false, message: 'Please enter a name that contains at least one character.' };
    };
    static validateAge(input) {
        try {
            const results = Recognizers.recognizeNumber(input, Recognizers.Culture.English);
            let output;
            results.forEach(result => {
                const value = result.resolution.value;
                if (value) {
                    const age = parseInt(value);
                    if (!isNaN(age) && age >= 18 && age <= 120) {
                        output = { success: true, age: age };
                        return;
                    }
                }
            });
            return output || { success: false, message: 'Please enter an age between 18 and 120.' };
        } catch (error) {
            return {
                success: false,
                message: "I'm sorry, I could not interpret that as an age. Please enter an age between 18 and 120."
            };
        }
    }

    // Validates email input.
    static ValidateEmail(input){
        const email = input && input.trim();
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
         if(emailPattern.test(email)){
            return { success: true, email: email}
           }
           return {
                success: false,
                message: "Please enter a valid emailID"
            }
    }
    static validateProfession(input) {
        const profession = input && input.trim();
        return profession !== undefined
            ? { success: true, profession: profession }
            : { success: false, message: 'Please enter a name that contains at least one character.' };
    };
    
    
}

module.exports = Validate