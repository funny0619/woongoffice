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
                                    <span class="subtitle is-7 has-text-primary">{{ event.daysRemaining }} days</span>
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
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            specialDates: [
                { name: "Our 2nd Anniversary", date: "2025-04-13" },
                { name: "Eunji's Birthday", date: "2025-09-21" },
                { name: "Sunny's Birthday", date: "2025-06-19" },
                { name: "World Ice Cream Day", date: "2025-07-21" },
            ],
            weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            currentDate: new Date(),
            selectedDate: null
        }
    },
    computed: {
        currentMonthName() {
            return this.currentDate.toLocaleString('default', { month: 'short' });
        },
        currentYear() {
            return this.currentDate.getFullYear();
        },
        sortedSpecialDates() {
            return this.specialDates
                .map(event => ({
                    ...event,
                    daysRemaining: this.calculateDaysRemaining(event.date)
                }))
                .sort((a, b) => a.daysRemaining - b.daysRemaining)
                .slice(0, 3);
        },
        calendarDays() {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();

            // Get first day of the month
            const firstDay = new Date(year, month, 1);
            const startingDay = firstDay.getDay();

            // Get last day of the month
            const lastDay = new Date(year, month + 1, 0);
            const totalDays = lastDay.getDate();

            // Get days from previous month
            const prevMonth = new Date(year, month, 0);
            const prevMonthDays = prevMonth.getDate();

            const days = [];

            // Add days from previous month
            for (let i = startingDay - 1; i >= 0; i--) {
                days.push({
                    day: prevMonthDays - i,
                    date: new Date(year, month - 1, prevMonthDays - i),
                    isCurrentMonth: false
                });
            }

            // Add days from current month
            for (let i = 1; i <= totalDays; i++) {
                days.push({
                    day: i,
                    date: new Date(year, month, i),
                    isCurrentMonth: true
                });
            }

            // Add days from next month
            const remainingDays = 42 - days.length; // 6 rows * 7 days
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
        calculateDaysRemaining(eventDate) {
            const today = new Date();
            const event = new Date(eventDate);
            const diffTime = event - today;
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        previousMonth() {
            this.currentDate = new Date(
                this.currentDate.getFullYear(),
                this.currentDate.getMonth() - 1,
                1
            );
        },
        nextMonth() {
            this.currentDate = new Date(
                this.currentDate.getFullYear(),
                this.currentDate.getMonth() + 1,
                1
            );
        },
        isToday(date) {
            const today = new Date();
            return date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();
        },
        isSelected(date) {
            if (!this.selectedDate) return false;
            return date.getDate() === this.selectedDate.getDate() &&
                date.getMonth() === this.selectedDate.getMonth() &&
                date.getFullYear() === this.selectedDate.getFullYear();
        },
        selectDate(date) {
            this.selectedDate = date;
        },
        hasEvent(date) {
            return this.specialDates.some(event => {
                const eventDate = new Date(event.date);
                return date.getDate() === eventDate.getDate() &&
                    date.getMonth() === eventDate.getMonth() &&
                    date.getFullYear() === eventDate.getFullYear();
            });
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
        }
    }
})
