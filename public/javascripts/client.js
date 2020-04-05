// Document on ready fire
document.addEventListener('DOMContentLoaded', onReady);
let toggleOptionState = 0;
let option;
let optionText;
let form;
let submitBtn;
let container;
let displayName;
let optionInactiveClass = 'option-inactive';
let hiddenClass = 'hidden';
let registrationFields = '<input type="password" name="confirm-password" placeholder="Confirm Password" required> <input type="text" minlength="6" name="name" placeholder="Name" required> <input type="text" name="contact-number" pattern="[0-9]{10}" placeholder="Contact Number" required>';
let userPath = 'http://localhost:3000/users/';
let registrationPath = userPath + 'create';

// On document ready
function onReady() {
    option = document.getElementById('option');
    optionText = document.getElementById('optionSelected');
    form = document.getElementById('form');
    submitBtn = document.getElementById('submitBtn');
    container = document.getElementById('container');
    displayName = document.getElementById('displayName');
}

// Toggle Login / Register option Btn  
function toggleOption(value) {
    if (value === toggleOptionState) return;
    if (option && option.children.length) {
        toggleOptionState = value;
        if (value) {
            let wrapper = document.createElement('div');
            wrapper.innerHTML = registrationFields;
            wrapper.classList.add('column-flex');
            form.insertBefore(wrapper, form.children[2]);
        } else if (form.childNodes.length > 1) {
            form.removeChild(form.children[2]);
        }
        classAddRemove(option.children[value].classList, optionInactiveClass, false);
        classAddRemove(option.children[value ? 0 : 1].classList, optionInactiveClass, true);
        optionText.innerText = value ? 'Create an account' : 'Account Login';
        submitBtn.value = value ? 'Register' : 'Login';
    }
}

// Login / Registration from submit
function onSubmit() {
    toggleOptionState ? registerUser() : loginUser();
}

// Login user
function loginUser() {
    let formData = new FormData(document.querySelector('form'));
    let data = {
        email: formData.get('email'),
        password: btoa(formData.get('password'))
    }
    httpRequest(data, 'POST', (res) => {
        toggleContainer();
        displayName.innerText = 'Welcome ' + res.name;
    });
}

// Register user
function registerUser() {
    let formData = new FormData(document.querySelector('form'));
    if (formData.get('password') === formData.get('confirm-password')) {
        let data = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: btoa(formData.get('password')),
            contact: formData.get('contact-number')
        }
        httpRequest(data, 'POST', (res) => {
            toggleOption(0);
            alert('Account created successfully');
        });
    } else {
        alert('Password Mismatch!');
    }
}

// Get User List
function getUserList() {
    httpRequest(null, 'GET', (res) => {
        let userList = res;
        if (userList && userList.length) {
            createTable(userList);
        }
    });
}

// Call to create user table
function createTable(userList) {
    let table = document.getElementById('table');
    userList.forEach(user => {
        let tr = document.createElement('tr');
        let i = 5;
        while (i-- > 0) {
            let value;
            switch (i) {
                case 0: let permission = user.user_role.permission;
                    value = (permission.view ? ' View ' : '') + (permission.update ? ', Update ' : '') + (permission.remove ? ', Remove' : '');
                    break;
                case 1: value = user.user_role.role; break;
                case 2: value = user.contact; break;
                case 3: value = user.email; break;
                case 4: value = user.name;
            }
            let td = document.createElement('td');
            let text = document.createTextNode(value);
            td.append(text);
            tr.append(td);
        }
        table.insertBefore(tr, table.children[1]);
    });
    classAddRemove(table.classList, 'hidden', false);
    classAddRemove(document.getElementById('userListBtn').classList, 'hidden', true);
}

// HTTP Request
function httpRequest(data, option, callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                callback(JSON.parse(this.response));
            } else {
                alert(this.response);
            }
        }
    };
    xhttp.open(option, toggleOptionState ? registrationPath : userPath, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    data ? xhttp.send(JSON.stringify(data)) : xhttp.send();
}

// Toggle Container
function toggleContainer() {
    classAddRemove(container.children[0].classList, 'hidden', true);
    classAddRemove(container.children[1].classList, 'hidden', false);
}

// To add / remove class in element class list
function classAddRemove(elementClassList, className, flag) {
    if (flag) {
        if (!elementClassList.contains(className)) {
            elementClassList.add(className);
        }
    } else {
        if (elementClassList.contains(className)) {
            elementClassList.remove(className);
        }
    }
}


