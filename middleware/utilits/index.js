import moment from "moment"

export default {
    ifequal (a, b, options){
        if(a==b){
            return options.fn(this)
        }
        return options.inverse(this)
    },


formatDate (date) {
    return moment(date).format('DD MMM, YYYY')
}
}