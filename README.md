NCalendar
=========

Календарь на заданные месяцы

---

Пример инициализации:

        new NCalendar($('#ny-dropdown-afisha-datepicker'));

---

Пример Шаблона (underscore):


        <span class="ny-pseudo-select ny-pseudo-select_datepicker js-popup-link" tabindex="0" data-popup-type="small" data-popup="ny-dropdown-afisha-datepicker" data-popup-align="left">
            <span class="ny-pseudo-select__content">Календарь</span>
        </span>

        <div class="ny-select-dropdown ny-select-dropdown_datepicker js-popup-sm" id="ny-dropdown-afisha-datepicker" style="display: none;">

            <script type="text/template" id="datepicker-template">

            <div class="ny-datepicker-day">
                <strong class="ny-datepicker-title"><%=currMonthName%> <%=currYear%></strong>
                <table class="ny-datepicker-calendar">
                    <tr>
                        <th class="day">Пн</th>
                        <th class="day">Вт</th>
                        <th class="day">Ср</th>
                        <th class="day">Чт</th>
                        <th class="day">Пт</th>
                        <th class="day">Сб</th>
                        <th class="day">Вс</th>
                    </tr>
                    <tr>
                    <% for (var i = 0; i < numberDays; i++) {
                        if (i == 0) {
                            /*Если первый день месяца не понедельник */
                            if (days[i].dayWeek != 1) {
                                for (var j = 1; j < days[i].dayWeek; j++) { %>
                                <td class="date">&nbsp;</td>
                                <% }
                            }

                        } else {
                                /* Если день равен понедельнику */
                                if (days[i].dayWeek == 1) { %>
                    <tr>
                            <% }
                        } %>

                        <td class="date">
                            <% /* Если День больше или равен текущему дню И Если День меньше чем Последняя Активная дата */
                               if ((days[i].timestamp >= startDateTimestamp) && (days[i].timestamp < stopDateTimestamp)) { %>
                                <a href="?date=<%= days[i].year %>-<%= days[i].monthNumber %>-<%= days[i].dayFormatNumber %>"><%= days[i].dayNumber %></a>
                            <% } else { %>
                                <%= days[i].dayNumber %>
                            <% } %>
                        </td>

                        <% /* Если день воскресенье */
                           if (days[i].dayWeek == 7) { %>
                    </tr>
                        <% } %>

                        <% /* Если день не воскресенье, но он последний в месяце */
                            if ((days[i].dayWeek != 7) && (i == (numberDays - 1))) {
                            for (var j = days[i].dayWeek + 1; j < 8; j++) { %>
                                <td class="date">&nbsp;</td>
                            <% } %>
                    </tr>
                        <% }
                    } %>
                </table>
            </div>

            </script>

        </div>
