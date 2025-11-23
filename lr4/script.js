// Память о «зарегистрированных» пользователях
const users = {};

// Находим элементы интерфейса
const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');

const registerSection = document.getElementById('register-section');
const loginSection = document.getElementById('login-section');

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const registerSubmitButton = registerForm.querySelector('button[type="submit"]');
const loginSubmitButton = loginForm.querySelector('button[type="submit"]');

const regUsernameInput = document.getElementById('reg-username');
const regPasswordInput = document.getElementById('reg-password');
const regPasswordConfirmInput = document.getElementById('reg-password-confirm');
const regMessage = document.getElementById('reg-message');

const loginUsernameInput = document.getElementById('login-username');
const loginPasswordInput = document.getElementById('login-password');
const loginMessage = document.getElementById('login-message');

// Функция для показа сообщений (ошибка / успех)
function setMessage(element, text, type) {
  element.textContent = text;
  element.classList.remove('error', 'success');

  if (type === 'error') {
    element.classList.add('error');
  } else if (type === 'success') {
    element.classList.add('success');
  }
}

// Переключение между вкладками "Регистрация" и "Вход"
showRegisterBtn.addEventListener('click', () => {
  registerSection.style.display = 'block';
  loginSection.style.display = 'none';
  setMessage(regMessage, '', null);
  setMessage(loginMessage, '', null);

  showRegisterBtn.classList.add('tab-active');
  showLoginBtn.classList.remove('tab-active');
});

showLoginBtn.addEventListener('click', () => {
  registerSection.style.display = 'none';
  loginSection.style.display = 'block';
  setMessage(regMessage, '', null);
  setMessage(loginMessage, '', null);

  showLoginBtn.classList.add('tab-active');
  showRegisterBtn.classList.remove('tab-active');
});

// Имитация асинхронного запроса на сервер
function simulateServerRequest(callbackSuccess, callbackError) {
  // показываем "задержку" 1 секунду
  setTimeout(() => {
    const random = Math.random();

    // с вероятностью 20% считаем, что сервер вернул непредвиденную ошибку
    if (random < 0.2) {
      callbackError('Непредвиденная ошибка сервера. Попробуйте позже.');
    } else {
      callbackSuccess();
    }
  }, 1000);
}

// Обработка отправки формы регистрации
registerForm.addEventListener('submit', (event) => {
  event.preventDefault(); // не даём странице перезагружаться

  // очищаем предыдущее сообщение
  setMessage(regMessage, '', null);

  const username = regUsernameInput.value.trim();
  const password = regPasswordInput.value;
  const passwordConfirm = regPasswordConfirmInput.value;

  // 1) Проверка на пустые поля
  if (!username || !password || !passwordConfirm) {
    setMessage(regMessage, 'Пожалуйста, заполните все поля.', 'error');
    return;
  }

  // 2) Проверка на допустимые символы (только латиница, цифры и _)
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    setMessage(
      regMessage,
      'Имя пользователя может содержать только латинские буквы, цифры и знак подчеркивания (_).',
      'error'
    );
    return;
  }

  // 3) Проверка сложности пароля
  if (password.length < 6) {
    setMessage(regMessage, 'Пароль слишком короткий. Минимум 6 символов.', 'error');
    return;
  }

  const passwordComplexity = /^(?=.*[A-Za-z])(?=.*\d).+$/;
  if (!passwordComplexity.test(password)) {
    setMessage(regMessage, 'Пароль должен содержать хотя бы одну букву и одну цифру.', 'error');
    return;
  }

  // 4) Проверка совпадения паролей
  if (password !== passwordConfirm) {
    setMessage(regMessage, 'Пароли не совпадают.', 'error');
    return;
  }

  // 5) Проверка, что имя пользователя ещё не занято
  if (users[username]) {
    setMessage(regMessage, 'Пользователь с таким именем уже зарегистрирован.', 'error');
    return;
  }

  // 6) Имитируем отправку запроса на сервер
  setMessage(regMessage, 'Отправляем запрос на сервер...', null);
  registerSubmitButton.disabled = true;

  simulateServerRequest(
    () => {
      // успех "на сервере" — регистрируем пользователя
      users[username] = { password };
      setMessage(regMessage, 'Регистрация прошла успешно! Теперь вы можете войти.', 'success');
      registerForm.reset();
      registerSubmitButton.disabled = false;
    },
    (errorMessage) => {
      // непредвиденная ошибка сервера
      setMessage(regMessage, errorMessage, 'error');
      registerSubmitButton.disabled = false;
    }
  );
});

// Обработка отправки формы входа
loginForm.addEventListener('submit', (event) => {
  event.preventDefault(); // не даём странице перезагружаться

  // очищаем предыдущее сообщение
  setMessage(loginMessage, '', null);

  const username = loginUsernameInput.value.trim();
  const password = loginPasswordInput.value;

  // 1) Проверка на пустые поля
  if (!username || !password) {
    setMessage(loginMessage, 'Пожалуйста, заполните оба поля.', 'error');
    return;
  }

  // 2) Проверка на допустимые символы (такие же правила, как при регистрации)
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    setMessage(
      loginMessage,
      'Имя пользователя может содержать только латинские буквы, цифры и знак подчеркивания (_).',
      'error'
    );
    return;
  }

  // 3) Проверка, что пользователь зарегистрирован
  const user = users[username];
  if (!user) {
    setMessage(loginMessage, 'Пользователь с таким именем не зарегистрирован.', 'error');
    return;
  }

  // 4) Проверка пароля
  if (user.password !== password) {
    setMessage(loginMessage, 'Неверный пароль.', 'error');
    return;
  }

  // 5) Имитируем отправку запроса на сервер при входе
  setMessage(loginMessage, 'Отправляем запрос на сервер...', null);
  loginSubmitButton.disabled = true;

  simulateServerRequest(
    () => {
      setMessage(loginMessage, `Вы успешно вошли как ${username}.`, 'success');
      loginForm.reset();
      loginSubmitButton.disabled = false;
    },
    (errorMessage) => {
      setMessage(loginMessage, errorMessage, 'error');
      loginSubmitButton.disabled = false;
    }
  );
});
