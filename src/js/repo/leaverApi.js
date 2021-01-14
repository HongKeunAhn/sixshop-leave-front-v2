import axios from 'axios';

export function findAll() {
    const url = 'http://localhost:3001/member';

    // fetch(url, {
    //     method: 'GET'
    // })
    // .then(response => response.json())
    // .then(body => body);
    axios.get(url).then(response => response.data);
}

export function findOne(id) {
    const url = 'http://localhost:3001/member' + id;

    fetch(url, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(body => body);
}

export function create(id, params) {
    const url = 'http://localhost:3001/member' + id;

    fetch(url, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: params
    })
    .then(response => response.json())
    .then(body => body);
}

export function remove(id) {
    const url = 'http://localhost:3001/member' + id;

    fetch(url, {
        method: 'DELETE'
    })
    .then(response => response.json());
}