const Monster = require('../mongodb/monsterModel.js');

let root = { 
    monsters: async () => {
        return await Monster.find();
    },
    addMonster: async (data) => {
        let newMonster = new Monster(data.monster);
        let savedMonster = await newMonster.save();
        return `Monster with name ${savedMonster.name} is added`;
    },
    updateMonster: async (data) => {
        let find = { name: data.nameOfMonsterToUpdate };
        let query = await Monster.update(find, data.monster);
        return `${query.n} monster(s) updated`;
    },
    deleteMonster: async (data) => {
        let query = await Monster.remove({name: data.name});
        return `${query.n} monster(s) deleted`;
    }
};

module.exports = root;