import "../pages/index.css";
import { initialCards } from "./cards.js";
import "./validate.js";
import {clearValidation, enableValidation} from './validate.js';

const cardTemplate = document.querySelector("#card-template").content;
const cardsList = document.querySelector(".places__list");
const addButton = document.querySelector(".profile__add-button");
const editButton = document.querySelector(".profile__edit-button");
const closeButtons = document.querySelectorAll(".popup__close");
export const inputElementName = document.querySelector(".popup__input_type_name");
export const inputElementDescription = document.querySelector(
  ".popup__input_type_description"
);
export const inputElementCardName = document.querySelector(
  ".popup__input_type_card-name"
);
export const inputElementCardUrl = document.querySelector(".popup__input_type_url");
const profileDescription = document.querySelector(".profile__description");
const profileTitle = document.querySelector(".profile__title");
const newPlaceModal = document.querySelector(".popup_type_new-card");
const editProfileModal = document.querySelector(".popup_type_edit");
const imageModal = document.querySelector(".popup_type_image");
const settings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

export const newCardForm = document.querySelector('.popup__form[name="new-place"]');
export const editProfileForm = document.querySelector(
  '.popup__form[name="edit-profile"]'
);

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

function addPlaceSubmit(evt) {
  evt.preventDefault();

  const name = inputElementCardName.value;
  const link = inputElementCardUrl.value;

  const newCard = {
    name: name,
    link: link,
  };

  const cardElement = createCard(newCard);
  cardsList.prepend(cardElement);

  newCardForm.reset();
  closeModal(newPlaceModal);
}

function editProfileSubmit(evt) {
  evt.preventDefault();

  profileTitle.textContent = inputElementName.value;
  profileDescription.textContent = inputElementDescription.value;

  closeModal(editProfileModal);
}

addButton.addEventListener("click", () => openModal(newPlaceModal));
editButton.addEventListener("click", () => openModal(editProfileModal));

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

function createCard(cardData) {
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardElement.querySelector(".card__title").textContent = cardData.name;

  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", () => {
    deleteCard(cardElement);
  });

  const likeButton = cardElement.querySelector(".card__like-button");
  likeButton.addEventListener("click", (evt) => {
    evt.target.classList.toggle("card__like-button_is-active");
  });

  return cardElement;
}

function deleteCard(cardElement) {
  cardElement.remove();
}

initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData);
  cardsList.append(cardElement);
});

enableValidation(settings)

