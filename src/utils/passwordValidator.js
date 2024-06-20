const passwordValidator = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+[\]{}|;:',.<>?]).{8,}$/
    return regex.test(password);
};

export { passwordValidator }