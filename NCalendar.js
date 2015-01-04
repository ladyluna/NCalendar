if (!window.NCalendar) {

var NCalendar = (function() {

'use strict';

/**
 * NCalendar
 *
 * @version 1.0.0
 * @author Natalia Uvarova
 */

/** 
 * @constructor NCalendar
 *
 * @param {jQuery Object} $container  контейнер для календаря
 * @param {Object} params параметры
 * 
 */
var NCalendar = function ($container, params) {

    this.init($container, params);

};

NCalendar.prototype = {

    _config: {
        // Месяцы видимые в календаре
        months: [
            {
                nameMonth: 'Ноябрь',
                numberMonth: 10,
                year: 2014
            }, 
            {
                nameMonth: 'Декабрь',
                numberMonth: 11, 
                year: 2014
            }, 
            {
                nameMonth: 'Январь',
                numberMonth: 0, 
                year: 2015
            }
        ],
        // Дата до которой ставить ссылки в календаре
        stopDate: new Date(2015, 0, 12)
    },

    /**
     * Инициализация календаря
     *
     * @method init
     *
     * @param {jQuery Object} $container  контейнер для календаря
     * @param {Object} params параметры
     */
    init: function($container, params) {

        var that = this;

        that.$container = $container;

        if (!that.$container.length) {
            return;
        }

        that._config = $.extend({}, that._config, params);
    
        that.createObjectStartDate();

        // Последняя активная дата
        that.stopDateTimestamp = that._config.stopDate.getTime();

        that.months = that._config.months;
        that.numberMonths = that.months.length;

        // шаблон
        that.template = '';

        // Создание календарей на заданные месяцы
        for (var i = 0; i < that.numberMonths; i++) {

            that.createDatepicker(that.months[i]);

        }

        that.$container.append(that.template);
     
    },

    /**
     * Создаем календарь на заданный месяц
     *
     * @method createDatepicker
     *
     * @param {Object} data месяц для которого делаем календарь
     */
    createDatepicker: function(data) {

        var that = this,
            currMonthNumber = data.numberMonth,
            currMonthName = data.nameMonth,
            currYear = data.year,
            firstDate,
            firstDateTime,
            lastDate,
            lastDateTime,
            numberDays,
            days = [],
            tmp,
            templateMonth;

        firstDate = new Date(currYear, currMonthNumber, 1);
        firstDateTime = firstDate.getTime();

        if (currMonthNumber === 11) {
            lastDate = new Date(currYear + 1, 0, 0);
            lastDateTime = lastDate.getTime();
        } else {
            lastDate = new Date(currYear, currMonthNumber + 1, 0);
            lastDateTime = lastDate.getTime();
        }
        
        numberDays = (lastDateTime - firstDateTime)/(24*60*60*1000) + 1;

        for (var i = 0; i < numberDays; i++) {

            if (i == 0) {

                days[0] = {
                    timestamp: firstDateTime,
                    date: firstDate
                };

                days[0].dayWeek = that.getWeekDay(days[0].date)[1];
                days[0].dayNumber = days[0].date.getDate();
                days[0].dayFormatNumber = that.getDayNumber(days[0].date);
                days[0].monthNumber = that.getMonthNumber(days[0].date);
                days[0].year = days[0].date.getFullYear();

            } else {

                days[i] = {};
                days[i].timestamp = days[i - 1].timestamp + 24*60*60*1000;
                days[i].date = new Date(days[i].timestamp);
                days[i].dayWeek = that.getWeekDay(days[i].date)[1];
                days[i].dayNumber = days[i].date.getDate();
                days[i].dayFormatNumber = that.getDayNumber(days[i].date);
                days[i].monthNumber = that.getMonthNumber(days[i].date);
                days[i].year = days[i].date.getFullYear();

            }

        }

        // Шаблонизация

        tmp = _.template($('#datepicker-template').html());

        templateMonth = tmp({
            currMonthName: currMonthName,
            currYear: currYear,
            days: days,
            numberDays: numberDays,
            startDateTimestamp: that.now.timestampNight,
            stopDateTimestamp: that.stopDateTimestamp
        });

        that.template = that.template + templateMonth;

    },

    /**
     * Получить день недели
     *
     * @method getWeekDay
     *
     * @param {Object} date объект даты
     *
     * @return {Object} массив (первый элемент: краткое название дня недели, второй элемент: номер дня недели (от 1 до 7))
     */
    getWeekDay: function (date) {

        var days = [['Вс', 7] ,['Пн', 1], ['Вт', 2], ['Ср', 3] , ['Чт', 4] , ['Пт', 5] , ['Сб', 6]];
         
        return days[date.getDay()];
    },

    /**
     * Получить номер месяца (в формате: 00)
     *
     * @method getMonthNumber
     *
     * @param {Object} date объект даты
     *
     * @return {String} month номер месяца (с нулем впереди)  
     */
    getMonthNumber: function (date) {

        var month = date.getMonth() + 1;

        if (month < 10) {
            month = '0' + month;
        }
         
        return month;
    },

    /**
     * Получить число в месяце (в формате: 00)
     *
     * @method getDayNumber
     *
     * @param {Object} date объект даты
     *
     * @return {String} day число месяца (с нулем впереди)  
     */
    getDayNumber: function (date) {

        var day = date.getDate();

        if (day < 10) {
            day = '0' + day;
        }

        return day;
    },

    /**
     * Создание объекта с Текущей датой
     *
     * @method createObjectStartDate
     * 
     */
    createObjectStartDate: function () {

        var that = this,
            nowDay,
            nowYear,
            nowMonthFormat,
            nowDate,
            today,
            nowTime,
            nowDayWeek;

        nowDay = new Date();

        // Год
        nowYear = nowDay.getFullYear();

        // Месяц
        nowMonthFormat = that.getMonthNumber(nowDay);

        // Число
        nowDate = that.getDayNumber(nowDay);

        // Начало дня (00:00)
        today = new Date(nowYear, nowDay.getMonth(), nowDay.getDate());

        // Миллисекунды
        nowTime = nowDay.getTime();

        // День недели
        nowDayWeek = that.getWeekDay(nowDay);

        that.now = {
            date: nowDay,
            day: nowDate,
            month: nowMonthFormat,
            year: nowYear,
            timestamp: nowTime,
            dayWeek: nowDayWeek,
            timestampNight: today.getTime()
        };
        
    }

};

return NCalendar;

})();

}