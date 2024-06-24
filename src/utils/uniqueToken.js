const generateToken = (firstName, lastName) => {

    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const firstLetter = firstName.charAt(0);
    const lastLetter = lastName.charAt(0).toUpperCase();
    console.log("name", firstName + lastName)
    console.log("lastletter", lastLetter)

    // Generate a 6-character random alphanumeric token
    let token = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        token += charset[randomIndex];
    }

    const fullToken = `${firstLetter}${lastLetter}-${token}`;
    return fullToken;
};

export { generateToken }