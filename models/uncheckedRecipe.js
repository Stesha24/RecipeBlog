const mongoose = require('mongoose');
const bson = require('bson');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    ingredients: {
      type: String
    },
    fullRecipe: {
      type: String
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    photoPath: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

//нужно добавить еще автора и картинку

schema.set('toJSON', {
  virtuals: true
})

module.exports = mongoose.model('UncheckedRecipe', schema);
