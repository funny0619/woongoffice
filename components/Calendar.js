app.component('calendar', {
    template:
        /*html*/
        `
        <div class="calendar-container">
            <div class="countdown-grid mb-4">
                <h2 class="title is-5 has-text-centered mb-3">중요한 날들</h2>
                <div class="columns is-mobile is-multiline">
                    <div v-for="(event, index) in sortedSpecialDates" :key="index" class="column is-full-mobile is-half-tablet">
                        <div class="card" style="box-shadow: 0 1px 2px rgba(0,0,0,0.1); cursor: pointer;" @click="jumpToDate(event.date)">
                            <div class="card-content p-2">
                                <div class="is-flex is-justify-content-space-between is-align-items-center">
                                    <span class="title is-6 mb-0">{{ event.name }}</span>
                                    <span class="subtitle is-7 has-text-primary">{{ event.daysRemaining }}</span>
                                </div>
                                <p class="has-text-grey is-size-7 mt-1">{{ formatDate(event.date) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="interactive-calendar">
                <div class="calendar-header is-flex is-justify-content-space-between is-align-items-center mb-3">
                    <button @click="previousMonth" class="button is-small is-light">&lt;</button>
                    <div class="is-flex is-align-items-center gap-2">
                        <h2 class="title is-6 mb-0 ml-0 mr-2">{{ currentMonthName }} {{ currentYear }}</h2>
                        <button @click="jumpToToday" class="button is-small is-light">Today</button>
                    </div>
                    <button @click="nextMonth" class="button is-small is-light">&gt;</button>
                </div>
                <div class="calendar-grid">
                    <div class="weekday-header" v-for="day in weekDays" :key="day">{{ day }}</div>
                    <div 
                        v-for="day in calendarDays" 
                        :key="day.date"
                        :class="['calendar-day', 
                            { 'today': isToday(day.date), 
                              'selected': isSelected(day.date),
                              'other-month': !day.isCurrentMonth }]"
                        @click="selectDate(day.date)"
                    >
                        {{ day.day }}
                        <div v-if="hasEvent(day.date)" class="event-dot"></div>
                        <div v-if="isSelected(day.date) && hasEvent(day.date)" class="tooltip">
                            <div v-for="(eventName, index) in getEventName(day.date)" :key="index" class="tooltip-item">
                                {{ eventName }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            currentDate: new Date(),
            selectedDate: null,
            weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            lunarCalendar: new KoreanLunarCalendar(),
            specialDates: [
                { name: "Our Anniversary", month: 4, day: 13, isAnniversary: true },
                { name: "Eunji's Birthday", month: 9, day: 21 },
                { name: "Sunny's Birthday", month: 6, day: 19 },
                { name: "World Ice Cream Day", month: 7, day: 21 },
                { name: "Susan's Birthday", month: 7, day: 26 },
                { name: "Danna's Birthday", month: 12, day: 7 },
                { name: "희주 누나 생일일", month: 11, day: 30 },
                { name: "은댕이 어머님 생신", lunar: { month: 3, day: 4 } },
                { name: "은댕이 아버님 생신", lunar: { month: 3, day: 16 } }
            ]
        }
    },
    computed: {
        processedSpecialDates() {
            const year = this.currentDate.getFullYear();
            return this.specialDates.map(event => {
                if (event.isAnniversary) {
                    const anniversaryYear = 2024; // The year of the first anniversary
                    const anniversaryNumber = year - anniversaryYear + 1;
                    return {
                        name: `Our ${anniversaryNumber}${this.getOrdinalSuffix(anniversaryNumber)} Anniversary`,
                        date: `${year}-${String(event.month).padStart(2, '0')}-${String(event.day).padStart(2, '0')}`
                    };
                }
                return {
                    name: event.name,
                    date: event.lunar ?
                        this.getLunarDate({ year, ...event.lunar }) :
                        `${year}-${String(event.month).padStart(2, '0')}-${String(event.day).padStart(2, '0')}`
                };
            });
        },
        sortedSpecialDates() {
            const now = new Date();
            return this.processedSpecialDates
                .map(event => ({
                    ...event,
                    daysRemaining: Math.ceil((new Date(event.date) - now) / (1000 * 60 * 60 * 24))
                }))
                .filter(event => event.daysRemaining >= 0)
                .map(event => ({
                    ...event,
                    daysRemaining: event.daysRemaining === 0 ? 'Today' : `${event.daysRemaining} days`
                }))
                .sort((a, b) => {
                    if (a.daysRemaining === 'Today') return -1;
                    if (b.daysRemaining === 'Today') return 1;
                    return parseInt(a.daysRemaining) - parseInt(b.daysRemaining);
                })
                .slice(0, 3);
        },
        currentMonthName() {
            return this.currentDate.toLocaleString('default', { month: 'short' });
        },
        currentYear() {
            return this.currentDate.getFullYear();
        },
        calendarDays() {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();
            const firstDay = new Date(year, month, 1).getDay();
            const lastDate = new Date(year, month + 1, 0).getDate();
            const prevMonthLastDate = new Date(year, month, 0).getDate();
            const days = [];

            for (let i = firstDay - 1; i >= 0; i--) {
                days.push({
                    day: prevMonthLastDate - i,
                    date: new Date(year, month - 1, prevMonthLastDate - i),
                    isCurrentMonth: false
                });
            }

            for (let i = 1; i <= lastDate; i++) {
                days.push({
                    day: i,
                    date: new Date(year, month, i),
                    isCurrentMonth: true
                });
            }

            const remainingDays = 42 - days.length;
            for (let i = 1; i <= remainingDays; i++) {
                days.push({
                    day: i,
                    date: new Date(year, month + 1, i),
                    isCurrentMonth: false
                });
            }

            return days;
        }
    },
    methods: {
        getLunarDate({ year, month, day }) {
            this.lunarCalendar.setLunarDate(year, month, day, false);
            const solar = this.lunarCalendar.getSolarCalendar();
            return `${solar.year}-${String(solar.month).padStart(2, '0')}-${String(solar.day).padStart(2, '0')}`;
        },
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        previousMonth() {
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        },
        nextMonth() {
            this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        },
        isToday(date) {
            const today = new Date();
            return date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();
        },
        isSelected(date) {
            return this.selectedDate &&
                date.getDate() === this.selectedDate.getDate() &&
                date.getMonth() === this.selectedDate.getMonth() &&
                date.getFullYear() === this.selectedDate.getFullYear();
        },
        selectDate(date) {
            this.selectedDate = date;
        },
        hasEvent(date) {
            return this.getEventsForDate(date).length > 0;
        },
        getEventsForDate(date) {
            return this.processedSpecialDates.filter(event => {
                const eventDate = new Date(event.date);
                return date.getDate() === eventDate.getDate() &&
                    date.getMonth() === eventDate.getMonth() &&
                    date.getFullYear() === eventDate.getFullYear();
            });
        },
        getEventName(date) {
            const events = this.getEventsForDate(date);
            return events.map(event => event.name);
        },
        jumpToDate(dateString) {
            const date = new Date(dateString);
            this.currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
            this.selectedDate = date;
        },
        jumpToToday() {
            const today = new Date();
            this.currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.selectedDate = today;
        },
        getOrdinalSuffix(number) {
            const suffixes = ['th', 'st', 'nd', 'rd'];
            const v = number % 100;
            return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
        }
    }
})
