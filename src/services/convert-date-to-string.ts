import { format } from "date-fns";

export function newDate(){
    const date = new Date();
    const formattedDate = format(date, "yyyy-MM-dd")
    return formattedDate
}