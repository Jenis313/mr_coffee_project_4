const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ScheduleSchema = new Schema({
    // DB Modelling
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    start_time: String,
    end_time: String
},
{
    timestamps: true
})

module.exports = mongoose.model('schedule', ScheduleSchema);