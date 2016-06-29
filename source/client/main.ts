import * as $ from 'jquery';

$.ajax({url:'/api?'+location.hash.substring(1)}).then(
    data => console.log(data),
    error => console.log(error)
);