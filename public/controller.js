function showCreate(){
    document.getElementById('create-section').classList.remove('hide');
    document.getElementById('read-section').classList.add('hide');
    document.getElementById('update-section').classList.add('hide');
    document.getElementById('delete-section').classList.add('hide');
}

function showRead(){
    document.getElementById("create-section").classList.add('hide');
    document.getElementById("read-section").classList.remove('hide');
    document.getElementById("update-section").classList.add('hide');
    document.getElementById("delete-section").classList.add('hide');

    const url = '/graphql?query={monsters{name,color}}';
    fetch(url)
    .then(data=>{return data.json()})
    .then(res=>{
        document.getElementById('monsters').innerHTML = JSON.stringify(res.data, undefined, 2);
    });
}

function showUpdate(){
    document.getElementById('create-section').classList.add('hide');
    document.getElementById('read-section').classList.add('hide');
    document.getElementById('update-section').classList.remove('hide');
    document.getElementById('delete-section').classList.add('hide');
}

function showDelete(){
    document.getElementById('create-section').classList.add('hide');
    document.getElementById('read-section').classList.add('hide');
    document.getElementById('update-section').classList.add('hide');
    document.getElementById('delete-section').classList.remove('hide');
}

function createMonster(){
    let name = document.getElementById('add-name').value;
    let color = document.getElementById('add-color').value;

    const variables = {
        monster:{
            name: name,
            color: color
        }
    };
    const query = `mutation AddMonster($monster: MonsterInput){
        addMonster(monster: $monster)
    }`;
    sendGraphPostRequest(query, variables, function(res){
        let history = document.getElementById('add-res').innerHTML;
        document.getElementById('add-res').innerHTML = history + '\n' + res.data.addMonster;
    }); 
}

function updateMonster(){
    let oldName = document.getElementById('update-old-name').value;
    let newName = document.getElementById('update-name').value;    
    let color = document.getElementById('update-color').value; 

    const variables = {
        nameOfMonsterToUpdate: oldName,
        monster:{
            name: newName ? newName : undefined,
            color: color ? color : undefined 
        }
    };
    const query = `mutation UpdateMonster($nameOfMonsterToUpdate: String, $monster: MonsterInput){
        updateMonster(nameOfMonsterToUpdate: $nameOfMonsterToUpdate, monster: $monster)
    }`;
    sendGraphPostRequest(query, variables, function(res){
        let history = document.getElementById('update-res').innerHTML;
        document.getElementById('update-res').innerHTML = history + '\n' + res.data.updateMonster;
    }); 
}

function deleteMonster(){
    let name = document.getElementById('delete-name').value;

    const variables = {
        name: name
    };
    const query = `mutation DeleteMonster($name: String){
        deleteMonster(name: $name)
    }`;
    sendGraphPostRequest(query, variables, function(res){
        let history = document.getElementById('delete-res').innerHTML;
        document.getElementById('delete-res').innerHTML = history + '\n' + res.data.deleteMonster;
    });
}

function sendGraphPostRequest(query, variables, callback){
    const url = '/graphql';
    const data = {
        query: query,
        variables: variables
    }
    const otherParam = {
        headers:{
            'content-type': 'application/json; charset=UTF-8'
        },
        body:JSON.stringify(data),
        method: 'POST'
    };
    fetch(url, otherParam)
    .then(data=>{return data.json()})
    .then(res=>{callback(res)})
    .then(error=>console.log(error));       
}