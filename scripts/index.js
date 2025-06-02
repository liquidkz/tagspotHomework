// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
const cardsList = document.querySelector('.places__list');

function createCard(cardData) {
    const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);

    cardElement.querySelector('.card__image').src = cardData.link;
    cardElement.querySelector('.card__image').alt = cardData.name;
    cardElement.querySelector('.card__title').textContent = cardData.name;

    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', () => {
        deleteCard(cardElement);
    });

    return cardElement;
}

function deleteCard(cardElement) {
    cardElement.remove();
}

initialCards.forEach(cardData => {
    const cardElement = createCard(cardData);
    cardsList.append(cardElement);
});

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу
