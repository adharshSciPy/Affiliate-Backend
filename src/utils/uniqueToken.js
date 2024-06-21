const generateToken = (name) => {

    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const firstLetter = name.charAt(0);
    const lastLetter = name.charAt(name.length - 1);

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