const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const creationInfo = (Schema) => {
    Schema.add({
        createdOn: {
            type: Date,
            default: Date.now()
        },

        modifiedOn: {
            type: Date,
            default: Date.now()
        }
    })
};

module.exports = creationInfo;