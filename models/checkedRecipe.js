const mongoose = require('mongoose');
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

schema.set('toJSON', {
  virtuals: true
})

module.exports = mongoose.model('CheckedRecipe', schema);
