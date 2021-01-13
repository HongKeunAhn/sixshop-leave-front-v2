import axios from 'axios';

export function findAllMember() {
    const url = 'http://localhost:3001/member';

    // fetch(url, {
    //     method: 'GET'
    // })
    // .then(response => response.json())
    // .then(body => body);
    axios.get(url).then(response => response.data);
}

export function findOne(id) {
    const url = '/' + id;

    fetch(url, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(body => body);
}

export function create(id, params) {
    const url = '/' + id;

    fetch(url, {
        method: 'POST',
        headers: {},
        body: params
    })
    .then(response => response.json())
    .then(body => body);
}

export function remove(id) {
    const url = '/' + id;

    fetch(url, {
        method: 'DELETE'
    })
    .then(response => response.json());
}