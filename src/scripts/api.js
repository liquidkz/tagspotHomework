const config = {
    baseUrl: 'https://practicetasks.kz/tagspot',
    headers: {
        authorization: '9ef66074ad2d42108f9506518499e17907Wb5Gy76p',
        'Content-Type': 'application/json'
    }
};

export const getUserData = () => {
    return fetch(`${config.baseUrl}/users/me`, {
        headers: config.headers
    })
        .then(res => {
            if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
            return res.json();
        });
};

export const getInitialCards = () => {
    return fetch(`${config.baseUrl}/cards`, {
        headers: config.headers
    })
        .then(res => {
            if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
            return res.json();
        });
};

export const addCard = (name, link) => {
    return fetch(`${config.baseUrl}/cards`, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({ name, link })
    })
        .then(res => {
            if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
            return res.json();
        });
};

export const editProfile = (name, about) => {
    return fetch(`${config.baseUrl}/users/me`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({ name, about })
    })
        .then(res => {
            if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
            return res.json();
        });
};

export const deleteCard = (cardId) => {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: config.headers
    })
        .then(res => {
            if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
            return res.json();
        });
};

export const setLike = (cardId) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        method: 'PUT',
        headers: config.headers
    })
        .then(res => {
            if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
            return res.json();
        });
};

export const deleteLike = (cardId) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        method: 'DELETE',
        headers: config.headers
    })
        .then(res => {
            if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
            return res.json();
        });
};

export const updateAvatar = (avatarUrl) => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({ avatar: avatarUrl })
    })
        .then(res => {
            if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
            return res.json();
        });
};
