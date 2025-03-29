import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; 

const commentSchema = new Schema({
    content : {
        type : String,
        requiered : true,
    },
    video : {
        type : Schema.Types.ObjectId ,
        ref : "Videos"
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "user"
    },

}, {
     timestamps : true
})

commentSchema.plugim(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment", commentSchema)