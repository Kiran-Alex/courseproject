import {atom} from "recoil"


export const adminsignupstate =  atom({
    key : "adminsignupstate",
    default : {
        username : undefined,
        password : undefined
    }
})