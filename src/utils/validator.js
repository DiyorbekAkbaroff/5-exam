let emailRegex =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const userRegisterValidator = (user) => {
    let {username, email, password} = user;
    if(!username) throw new Error("Username is required !");
    if(!email) throw new Error("Email is required !");
    if(!emailRegex.test(email)) throw new Error("Email is not valid !");
    if(!password) throw new Error("Password is required !");
    if(!(password.length > 5 && password.length < 15)) throw new Error("Password is not valid !");
    return true
};
export const userLoginValidator = (user) => {
    let {email, password} = user;
    if(!email) throw new Error("Email is required !");
    if(!emailRegex.test(email)) throw new Error("Email is not valid !");
    if(!password) throw new Error("Password is required !");
    if(!(password.length > 5 && password.length < 15)) throw new Error("Password is not valid !");
    return true
};