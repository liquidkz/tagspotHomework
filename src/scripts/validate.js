function showInputError(formElement, inputElement, errorMessage, settings) {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.add(settings.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(settings.errorClass);
}

function hideInputError(formElement, inputElement, settings) {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.remove(settings.inputErrorClass);
    errorElement.classList.remove(settings.errorClass);
    errorElement.textContent = '';
}

function checkInputValidity(formElement, inputElement, settings) {
    if (!inputElement.validity.valid) {
        const errorMessage = getCustomErrorMessage(inputElement);
        showInputError(formElement, inputElement, errorMessage, settings);
    } else {
        hideInputError(formElement, inputElement, settings);
    }
}

function hasInvalidInput(inputList) {
    return inputList.some(inputElement => !inputElement.validity.valid);
}

function toggleButtonState(inputList, buttonElement, settings) {
    if (hasInvalidInput(inputList)) {
        buttonElement.classList.add(settings.inactiveButtonClass);
        buttonElement.disabled = true;
    } else {
        buttonElement.classList.remove(settings.inactiveButtonClass);
        buttonElement.disabled = false;
    }
}

function setEventListeners(formElement, settings) {
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
    const buttonElement = formElement.querySelector(settings.submitButtonSelector);

    toggleButtonState(inputList, buttonElement, settings);

    inputList.forEach(inputElement => {
        inputElement.addEventListener('input', () => {
            checkInputValidity(formElement, inputElement, settings);
            toggleButtonState(inputList, buttonElement, settings);
        });
    });
}

export function enableValidation(settings) {
    const formList = Array.from(document.querySelectorAll(settings.formSelector));

    formList.forEach(formElement => {
        formElement.addEventListener('submit', evt => {
            evt.preventDefault();
        });

        setEventListeners(formElement, settings);
    });
}

export function clearValidation(formElement, settings) {
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
    const buttonElement = formElement.querySelector(settings.submitButtonSelector);

    inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement, settings);
    });

    toggleButtonState(inputList, buttonElement, settings);
}

function getCustomErrorMessage(inputElement) {
    if (inputElement.validity.patternMismatch) {
        return inputElement.dataset.patternError || "Неверный формат";
    }
    return inputElement.validationMessage;
}
