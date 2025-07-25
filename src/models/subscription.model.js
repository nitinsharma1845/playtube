import monggose , {Schema} from "mongoose"


const subscriptionSchema = new Schema({
    subscriber :{
        type : Schema.Types.ObjectId,  //one who is subscribing
        ref : "User"
    },
    channel :{
        type : Schema.Types.ObjectId, //one whom subscriber subscribing
        ref : "User"
    }
} , {timestamps : true})


export const Subscription = monggose.model("Subscription" , subscriptionSchema)