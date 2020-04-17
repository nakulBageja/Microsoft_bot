class UserProfile {
    constructor(gender, name, age, number, email, address, class_10, class_12,grad, interest, w_exp) {
        this.gender = gender
        this.name = name;
        this.age = age;
        this.number = number;
        this.email = email;
        this.address = address
        this.class_10 = class_10;
        this.class_12 = class_12;
        this.interest = interest;
        this.grad = grad
        this.w_exp = w_exp
    }
}

module.exports.UserProfile = UserProfile;
