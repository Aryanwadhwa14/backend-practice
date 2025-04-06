import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Subsrciption } from "../models/subscriptions.models.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    // TODO: toggle subscription
    try {
        const {subscriptionID,channelId} = req.params
        if(!subscriptionID || !channelId) {new ApiError(400, "Invalid channel and subscription id's")}

        const existingSub = await Subsrciption.findOne({subscriber: subscriptionID, channel : channelId})
        if(existingSubscription){
            await Subscription.deleteOne({_id: existingSubscription._id});
            next(new ApiResponse(200, "Unsubscribed successfully"))
        } else{
            const newSubscription = new Subscription({
                subscriber: subscriberId,
                channel: channelId
            })

            await newSubscription.save();
            next(new ApiResponse(201, "Subscribed successfully"))
        }
    } catch (error) {
        next(new ApiError(500, error.message))
    }


    
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params ;
    try {
        const subscriptions = await Subsrciption.find({channel : channelId}).populate("subscriber").exec(); // new methods populate and exec.
        if(!subscriptions){
            next(new ApiError(404 ,"No subs found"))
        }
        const subscribers = subscriptions.map ( sub => sub.subscriber);
        return new ApiResponse(200, subscribers)
    } catch (error) {
        next(new ApiError(500 , error.message))
        
    }
    
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    try {
        const subscriberslist = await Subscription.find({subscriber : subscriberId}).populate("subscriber").exec();
        if(!subscriberslist){
            next(new ApiError(404 ,"No subs found"))
        }
        const subscribers = subscriberslist.map ( sub => sub.subscriber);
        return new ApiResponse(200, subscribers)
    } catch (error) {
        next(new ApiError(500 , error.message))
        
    }
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
