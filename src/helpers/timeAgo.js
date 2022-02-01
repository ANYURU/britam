const MONTH_NAMES = [
    'Jan', 
    'Feb',
    'Mar', 
    'Apr', 
    'May', 
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov', 
    'Dec'
]

const DAY_NAMES = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun'
]

function getFormattedDate(date, preformattedDate = false, hideYear = false) {
    const day = date.getDate();
    const time = getTime()
    const month = MONTH_NAMES[date.getMonth()]
    const 
}

    //    document.getElementById('display').scrollTop = document.getElementById('display').scrollHeight
