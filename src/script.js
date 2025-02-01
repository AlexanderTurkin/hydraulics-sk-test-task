document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("registrationForm");
    const messageDiv = document.getElementById("message");

    let usersArray = [
        { name: "Александр", age: 19, city: "Воронеж" },
        { name: "Мария", age: 22, city: "Санкт-Петербург" },
        { name: "Иван", age: 35, city: "Казань" }
    ];
    console.log("Исходный массив пользователей:", usersArray);

    function addUser(user) {
        console.log("Добавление пользователя:", user);
        usersArray.push(user);
        console.log("Массив после добавления:", usersArray);
    }

    function removeUserByName(userName) {
        console.log("Удаление пользователя с именем:", userName);
        usersArray = usersArray.filter(user => user.name !== userName);
        console.log("Массив после удаления:", usersArray);
    }

    function findUsersByCity(city) {
        const foundUsers = usersArray.filter(user => user.city.toLowerCase() === city.toLowerCase());
        console.log(`Пользователи из города "${city}":`, foundUsers);
        return foundUsers;
    }

    function sortUsersByAge() {
        console.log("Сортировка пользователей по возрасту (по возрастанию)");
        usersArray.sort((a, b) => a.age - b.age);
        console.log("Массив после сортировки:", usersArray);
    }

    addUser({ name: "Светлана", age: 30, city: "Новосибирск" });
    removeUserByName("Мария");
    findUsersByCity("Воронеж");
    sortUsersByAge();

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const formData = new FormData(form);

        const name = formData.get("name").trim();
        const email = formData.get("email").trim();
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");
        const country = formData.get("country");
        const terms = formData.get("terms");

        if (!name || !email || !password || !confirmPassword || !country || !terms) {
            showMessage("Пожалуйста, заполните все обязательные поля и подтвердите условия.", "error");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage("Некорректный формат email.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("Пароли не совпадают.", "error");
            return;
        }

        fetch("process_registration.php", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage(data.message, "success");
                    form.reset();
                } else {
                    showMessage(data.errors.join("<br>"), "error");
                }
            })
            .catch(error => {
                console.error("Ошибка при отправке данных:", error);
                showMessage("Произошла ошибка при отправке данных.", "error");
            });
    });

    function showMessage(message, type) {
        messageDiv.innerHTML = `<div class="${type}">${message}</div>`;
    }
});
