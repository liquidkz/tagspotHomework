import "../pages/index.css";
import "./validate.js";
import { clearValidation, enableValidation } from './validate.js';
import {
    getUserData,
    getInitialCards,
    addCard,
    editProfile,
    deleteCard as apiDeleteCard,
    setLike,
    deleteLike,
    updateAvatar
} from './api.js';

const cardTemplate = document.querySelector("#card-template").content;
const cardsList = document.querySelector(".places__list");
const addButton = document.querySelector(".profile__add-button");
const editButton = document.querySelector(".profile__edit-button");
const editAvatar = document.querySelector(".profile__image-wrapper");
const closeButtons = document.querySelectorAll(".popup__close");

export const inputElementName = document.querySelector(".popup__input_type_name");
export const inputElementDescription = document.querySelector(".popup__input_type_description");
export const inputElementCardName = document.querySelector(".popup__input_type_card-name");
export const inputElementCardUrl = document.querySelector(".popup__input_type_url");

const profileDescription = document.querySelector(".profile__description");
const profileTitle = document.querySelector(".profile__title");
const newPlaceModal = document.querySelector(".popup_type_new-card");
const editProfileModal = document.querySelector(".popup_type_edit");
const editAvatarModal = document.querySelector(".popup_type_edit-avatar");
const imageModal = document.querySelector(".popup_type_image");
const avatarLinkInput = document.querySelector(".popup__input_type_avatar-link");
const profileImage = document.querySelector(".profile__image");

const settings = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible'
};

export const newCardForm = document.querySelector('.popup__form[name="new-place"]');
export const editProfileForm = document.querySelector('.popup__form[name="edit-profile"]');
export const editAvatarForm = document.querySelector('.popup__form[name="avatar-link"]');

let userId = null;

function setValues() {
    if (inputElementName && inputElementDescription) {
        inputElementName.value = profileTitle.textContent;
        inputElementDescription.value = profileDescription.textContent;
    }
}

function openModal(modal) {
    modal.classList.add("popup_is-opened");
    document.addEventListener("keydown", closeModalByEscape);

    if (modal === editProfileModal) {
        setValues();
    }

    const form = modal.querySelector(settings.formSelector);
    if (form) {
        const submitButton = form.querySelector(settings.submitButtonSelector);
        if (submitButton && !submitButton.dataset.originalText) {
            submitButton.dataset.originalText = submitButton.textContent;
        }

        form.reset();
        clearValidation(form, settings);
    }
}

function closeModal(modal) {
    modal.classList.remove("popup_is-opened");
    document.removeEventListener("keydown", closeModalByEscape);
}

function closeModalByEscape(evt) {
    if (evt.key === "Escape") {
        const openedModal = document.querySelector(".popup_is-opened");
        if (openedModal) {
            closeModal(openedModal);
        }
    }
}

function closeModalByOverlay(evt) {
    if (evt.target.classList.contains("popup")) {
        closeModal(evt.target);
    }
}

function createCard(cardData) {
    const cardElement = cardTemplate.querySelector(".places__item").cloneNode(true);

    const cardImage = cardElement.querySelector(".card__image");
    const cardCounter = cardElement.querySelector(".card__like-counter");
    cardElement.dataset.id = cardData.id;
    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardElement.querySelector(".card__title").textContent = cardData.name;
    cardCounter.textContent = cardData.likes.length;

    const deleteButton = cardElement.querySelector(".card__delete-button");
    if (cardData.owner && cardData.owner.id !== userId) {
        deleteButton.style.display = 'none';
    }
    deleteButton.addEventListener("click", () => {
        apiDeleteCard(cardElement.dataset.id)
            .then(() => {
                cardElement.remove();
            })
            .catch(err => {
                console.error('Ошибка при удалении карточки: ', err);
            });
    });

    const likeButton = cardElement.querySelector(".card__like-button");
    const isLikedByUser = cardData.likes.some(like => like.id === userId);
    if (isLikedByUser) {
        likeButton.classList.add("card__like-button_is-active");
    }

    likeButton.addEventListener("click", (evt) => {
        const isLiked = evt.target.classList.contains("card__like-button_is-active");

        if (isLiked) {
            deleteLike(cardElement.dataset.id)
                .then(data => {
                    likeButton.classList.remove("card__like-button_is-active");
                    cardCounter.textContent = data.likes.length;
                })
                .catch(err => console.error(err));
        } else {
            setLike(cardElement.dataset.id)
                .then(data => {
                    likeButton.classList.add("card__like-button_is-active");
                    cardCounter.textContent = data.likes.length;
                })
                .catch(err => console.error(err));
        }
    });

    return cardElement;
}

function renderCards(data) {
    data.forEach(card => {
        const cardElement = createCard(card);
        cardsList.appendChild(cardElement);
    });
}

function addPlaceSubmit(evt) {
    evt.preventDefault();
    const saveButton = evt.submitter;
    renderLoading(true, saveButton);
    const name = inputElementCardName.value;
    const link = inputElementCardUrl.value;

    addCard(name, link)
        .then(card => {
            const cardElement = createCard(card);
            cardsList.prepend(cardElement);
            newCardForm.reset();
            closeModal(newPlaceModal);
        })
        .catch(err => console.error("Ошибка при добавлении карточки:", err))
        .finally(() => {
            renderLoading(false, saveButton, saveButton.dataset.originalText);
        });
}

function editProfileSubmit(evt) {
    evt.preventDefault();

    const saveButton = evt.submitter;
    renderLoading(true, saveButton);

    editProfile(inputElementName.value, inputElementDescription.value)
        .then(data => {
            profileTitle.textContent = data.name;
            profileDescription.textContent = data.about;
            closeModal(editProfileModal);
        })
        .catch(err => console.error("Ошибка при обновлении профиля:", err))
        .finally(() => {
            renderLoading(false, saveButton, saveButton.dataset.originalText);
        });
}

function uploadAvatar(evt) {
    evt.preventDefault();
    const saveButton = evt.submitter;
    renderLoading(true, saveButton);

    updateAvatar(avatarLinkInput.value)
        .then(data => {
            profileImage.style.backgroundImage = `url(${data.avatar})`;
            closeModal(editAvatarModal);
        })
        .catch(err => console.error("Ошибка при обновлении аватара:", err))
        .finally(() => {
            renderLoading(false, saveButton, saveButton.dataset.originalText);
        });
}

function renderLoading(isLoading, buttonElement, loadingText = "Сохранение...") {
    if (isLoading) {
        if (!buttonElement.dataset.originalText) {
            buttonElement.dataset.originalText = buttonElement.textContent;
        }
        buttonElement.disabled = true;
        buttonElement.textContent = loadingText;
    } else {
        buttonElement.disabled = false;
        buttonElement.textContent = buttonElement.dataset.originalText;
    }
}

Promise.all([getUserData(), getInitialCards()])
    .then(([userData, cards]) => {
        userId = userData.id;

        profileTitle.textContent = userData.name;
        profileDescription.textContent = userData.about;
        profileImage.style.backgroundImage = `url(${userData.avatar})`;

        renderCards(cards);
        document.querySelector('.profile').style.visibility = 'visible';
    })
    .catch(error => {
        console.error("Ошибка при загрузке данных:", error);
    });


addButton.addEventListener("click", () => openModal(newPlaceModal));
editButton.addEventListener("click", () => openModal(editProfileModal));
editAvatar.addEventListener("click", () => openModal(editAvatarModal));

closeButtons.forEach((closeButton) => {
    closeButton.addEventListener("click", () => {
        const modalContainer = closeButton.closest(".popup");
        if (modalContainer) {
            closeModal(modalContainer);
        }
    });
});

newCardForm.addEventListener("submit", addPlaceSubmit);
editProfileForm.addEventListener("submit", editProfileSubmit);
editAvatarForm.addEventListener("submit", uploadAvatar);

document.querySelector(".places__list").addEventListener("click", (evt) => {
    if (evt.target.classList.contains("card__image")) {
        const image = document.querySelector(".popup__image");

        image.src = evt.target.src;
        image.alt = evt.target.alt;

        openModal(imageModal);
    }
});

document.querySelectorAll(".popup").forEach((modal) => {
    modal.addEventListener("mousedown", closeModalByOverlay);
});

enableValidation(settings);
