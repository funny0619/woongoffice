const url = 'https://eunjibackend-feg2fwcahycuf3hj.westus-01.azurewebsites.net/calendar/';
// const url = 'http://localhost:8000/calendar/';

app.component('calendar', {
    template:
        /*html*/
        `
        <div class="calendar-container">
            <div class="countdown-grid mb-4">
                <h2 class="title is-5 has-text-centered mb-3">
                중요한 날들
                <button @click="showAddDateModal = true" class="button ml-2 addDateButton">추억 추가 😎</button>
                </h2>
                <div v-if="showAddDateModal" class="modal is-active">
                    <div class="modal-background" @click="showAddDateModal = false"></div>
                    <div class="modal-content">
                        <div class="box">
                            <h3 class="title is-5 mb-3">중요한 날 추가</h3>
                            <div class="field">
                                <label class="label">날짜 시작</label>
                                <div class="control">
                                    <input type="date" v-model="newDate.date" class="input" id="startDate">
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">날짜 끝</label>
                                <div class="control">
                                    <input type="date" v-model="newDate.endDate" class="input">
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">이벤트</label>
                                <div class="control">
                                    <input type="text" v-model="newDate.name" class="input" placeholder="이벤트 이름">
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">카테고리</label>
                                <div class="control">
                                    <select v-model="newDate.category" class="select is-small">
                                        <option value="Birthday">Birthday</option>
                                        <option value="Anniversary">Anniversary</option>
                                        <option value="Special">Special</option>
                                        <option value="Trip">Trip</option>
                                    </select>
                                </div>
                            </div>
                            <div class="field">
                                <label class="checkbox">
                                    <input type="checkbox" v-model="newDate.isLunar">
                                    음력
                                </label>
                                <br>
                                <label class="checkbox">
                                    <input type="checkbox" v-model="newDate.isRecurring">
                                    반복
                                </label>
                            </div>
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <button @click="showAddDateModal = false" class="button is-light">Cancel</button>
                                </div>
                                <div class="control">
                                    <button @click="addNewDate" class="button addDateButton">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="modal-close is-large" aria-label="close" @click="showAddDateModal = false"></button>
                </div>
                <div v-if="isLoading" class="has-text-centered">
                    <span class="icon is-small">
                        <i class="fas fa-spinner fa-spin"></i>
                    </span>
                </div>
                <div v-else-if="error" class="notification is-danger">
                    {{ error }}
                </div>
                <div v-else class="columns is-mobile is-multiline">
                    <div v-for="(event, index) in sortedSpecialDates" :key="index" class="column is-full-mobile is-half-tablet">
                        <div class="card special-date" :data-id="event.id" style="box-shadow: 0 1px 2px rgba(0,0,0,0.1); cursor: pointer;" @click="jumpToDate(event)">
                            <div class="card-content p-2">
                                <div class="is-flex is-justify-content-space-between is-align-items-center">
                                    <span class="title is-6 mb-0">{{ event.name }}</span>
                                    <span class="subtitle is-7 has-text-primary">{{ event.daysRemaining }}</span>
                                </div>
                                <div class="is-flex is-justify-content-space-between is-align-items-center">
                                    <p class="has-text-grey is-size-7 mt-1">{{ formatDate(event) }}</p>
                                    <button @click.stop="deleteDate(event)" class="button is-small is-danger is-light">
                                        <span class="icon is-small">
                                        <img src="./assets/images/trash.png" alt="delete" style="width: 16px; height: 16px;">
                                        </span>
                                    </button>
                                </div>
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
                            <div v-for="(event, index) in getEvents(day.date)" :key="index" class="tooltip-item">
                                {{ event.name }}
                                <button @click.stop="deleteDate(event)" class="button is-small is-transparent ml-2 mr-0" id="delete-event-button">
                                <span class="icon is-small">
                                <img src="./assets/images/remove.png" alt="delete" style="width: 10px; height: 10px;">
                                </span>
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            currentViewingDate: new Date(),
            currentDate: new Date(),
            selectedDate: null,
            weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            lunarCalendar: new KoreanLunarCalendar(),
            showAddDateModal: false,
            newDate: {
                date: '',
                endDate: '',
                name: '',
                category: 'Special',
                isLunar: false,
                isRecurring: false,
            },
            specialDates: [
            ],
            isLoading: false,
            error: null
        }
    },
    watch: {
        'newDate.date': function (newVal) {
            if (newVal) {
                // Only update end date if it's empty or if start date is greater than end date
                if (!this.newDate.endDate || new Date(newVal) > new Date(this.newDate.endDate)) {
                    this.newDate.endDate = newVal;
                }
            }
        },
        'newDate.endDate': function (newVal) {
            if (newVal && this.newDate.date) {
                // If end date is before start date, reset it to start date
                if (new Date(newVal) < new Date(this.newDate.date)) {
                    this.newDate.endDate = this.newDate.date;
                }
            }
        }
    },
    created() {
        this.fetchSpecialDates();
    },
    computed: {
        processedSpecialDates() {
            const year = this.currentViewingDate.getFullYear();
            // console.log(this.specialDates);
            return this.specialDates.map(event => {



                const { id, name: eventName, category, isRecurring, isLunar, isAnniversary, month, day } = event;
                const eventYear = isRecurring ? year : event.year;
                // if isGRoup is false or undefined, then it is a single event
                const isGroup = event.isGroup || false;
                const dateParams = { year: eventYear, month, day };

                // Determine the date string based on lunar/solar calendar
                const date = isLunar
                    ? this.getSolarFromLunar(dateParams)
                    : this.toStringDate(dateParams);

                // Calculate anniversary name if needed
                const name = isAnniversary && !isLunar
                    ? `Our ${year - 2024 + 1}${this.getOrdinalSuffix(year - 2024 + 1)} Anniversary`
                    : eventName;

                if (isGroup) {
                    const groupId = event.groupId;
                    return {
                        id,
                        name,
                        date,
                        category,
                        isRecurring,
                        isGroup,
                        groupId
                    };
                } else {
                    return {
                        id,
                        name,
                        date,
                        category,
                        isRecurring,
                        isGroup,
                    };
                }
            });
        },
        sortedSpecialDates() {
            const lunarCalendarHelper = new KoreanLunarCalendar();
            function getSolarFromLunar({ year, month, day }) {
                lunarCalendarHelper.setLunarDate(year, month, day, true);
                const solar = lunarCalendarHelper.getSolarCalendar();
                return solar;
            }
            const now = new Date();

            // First, process all events to calculate days remaining
            const processedEvents = this.specialDates
                .map(event => {
                    let year = event.isRecurring ? now.getFullYear() : event.year;
                    let month = event.month;
                    let day = event.day;

                    let eventDate;

                    if (event.isLunar) {
                        const lunarDate = getSolarFromLunar({ year, month, day })
                        eventDate = new Date(lunarDate.year, lunarDate.month - 1, lunarDate.day);
                    } else {
                        eventDate = new Date(year, month - 1, day);
                    }

                    const diffTime = eventDate.getTime() - now.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const isSameDay = eventDate.getTime() === now.getTime();
                    return {
                        ...event,
                        daysRemaining: isSameDay ? 0 : diffDays
                    };
                })
                .filter(event => event.daysRemaining >= 0);

            // Group events by groupId and select the one with minimum days remaining
            const groupedEvents = processedEvents.reduce((acc, event) => {
                if (event.isGroup && event.groupId) {
                    if (!acc[event.groupId] || event.daysRemaining < acc[event.groupId].daysRemaining) {
                        acc[event.groupId] = event;
                    }
                } else {
                    // For non-grouped events, use a unique key
                    acc[`single_${event.id}`] = event;
                }
                return acc;
            }, {});

            // Convert grouped events back to array and sort
            const sortedDates = Object.values(groupedEvents)
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
            // console.log(sortedDates);
            return sortedDates;
        },
        currentMonthName() {
            return this.currentViewingDate.toLocaleString('default', { month: 'short' });
        },
        currentYear() {
            return this.currentViewingDate.getFullYear();
        },
        calendarDays() {
            const year = this.currentViewingDate.getFullYear();
            const month = this.currentViewingDate.getMonth();
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
        async fetchSpecialDates() {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await fetch(url + 'listDates');
                if (!response.ok) {
                    throw new Error('Failed to fetch  dates');
                }
                const data = await response.json();
                // append data to specialDates
                this.specialDates.push(...data['dates']);
            } catch (err) {
                this.error = 'Failed to load special dates. Please try again later.';
                console.error('Error fetching special dates:', err);
            } finally {
                this.isLoading = false;
            }
        },
        async addNewDate() {
            if (!this.newDate.date || !this.newDate.name) {
                alert('Please fill in all required fields');
                return;
            }

            const date = new Date(this.newDate.date);
            const endDate = new Date(this.newDate.endDate);

            // check if theyre not the same date
            if (endDate > date) {
                // send a list of dates between the start and end date
                // console.log(date, endDate);
                const dates = []
                let currentDate = new Date(date);
                while (currentDate <= endDate) {
                    if (this.newDate.isRecurring) {
                        dates.push({ month: currentDate.getMonth() + 1, day: currentDate.getDate() });
                    } else {
                        dates.push({ year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() });
                    }
                    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
                }

                const newSpecialDates = {
                    name: this.newDate.name,
                    isLunar: this.newDate.isLunar,
                    isRecurring: this.newDate.isRecurring,
                    isAnniversary: false, // Anniverary will not change
                    category: this.newDate.category,
                    dates: dates,
                    isGroup: true
                }

                // console.log(newSpecialDates);
                try {
                    const response = await fetch(url + 'createDate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newSpecialDates)
                    });
                    const data = await response.json();
                    const groupId = data['groupId'];
                    const createdDates = data['created_dates'];
                    for (const date of createdDates) {
                        this.specialDates.push({
                            ...date,
                            groupId: groupId
                        });
                    }

                    if (!response.ok) {
                        throw new Error('Failed to add date');
                    }
                    this.showAddDateModal = false;
                    this.newDate = {
                        date: '',
                        endDate: '',
                        name: '',
                        category: 'Special',
                        isLunar: false,
                        isRecurring: false,
                    };
                } catch (err) {
                    console.error('Error adding date:', err);
                    alert('Failed to add date. Please try again.');
                }
            } else {

                const newSpecialDate = {
                    name: this.newDate.name,
                    month: date.getMonth() + 1,
                    day: date.getDate(),
                    isLunar: this.newDate.isLunar,
                    isRecurring: this.newDate.isRecurring,
                    isAnniversary: false, // Anniverary will not change
                    category: this.newDate.category
                };

                if (!this.newDate.isRecurring) {
                    newSpecialDate['year'] = date.getFullYear();
                }
                try {
                    const response = await fetch(url + 'createDate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newSpecialDate)
                    });

                    if (!response.ok) {
                        throw new Error('Failed to add date');
                    }
                    const data = await response.json();

                    this.specialDates.push(data['new_item']);
                    this.showAddDateModal = false;
                    this.newDate = {
                        date: '',
                        name: '',
                        category: 'Special',
                        isLunar: false
                    };
                } catch (err) {
                    console.error('Error adding date:', err);
                    alert('Failed to add date. Please try again.');
                }
            }

        },
        toStringDate(date) {
            return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
        },
        getSolarFromLunar({ year, month, day }) {
            this.lunarCalendar.setLunarDate(year, month, day, true);
            const solar = this.lunarCalendar.getSolarCalendar();
            return this.toStringDate(solar);
        },
        formatDate(event) {
            let year;
            if (event.isRecurring) {
                year = new Date().getFullYear();
            } else {
                year = event.year;
            }
            const date = new Date(year, event.month - 1, event.day);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        previousMonth() {
            this.currentViewingDate = new Date(this.currentViewingDate.getFullYear(), this.currentViewingDate.getMonth() - 1, 1);
        },
        nextMonth() {
            this.currentViewingDate = new Date(this.currentViewingDate.getFullYear(), this.currentViewingDate.getMonth() + 1, 1);
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
            // console.log(this.processedSpecialDates);
            return this.processedSpecialDates.filter(event => {
                const eventDate = new Date(event.date);
                return date.getDate() === eventDate.getDate() &&
                    date.getMonth() === eventDate.getMonth() &&
                    date.getFullYear() === eventDate.getFullYear();
            });
        },
        getEvents(date) {
            const events = this.getEventsForDate(date);
            // console.log(events);
            return events;
        },
        jumpToDate(event) {
            let year;
            if (event.isRecurring) {
                year = new Date().getFullYear();
            } else {
                year = event.year;
            }
            const date = new Date(year, event.month - 1, event.day);
            this.currentViewingDate = new Date(date.getFullYear(), date.getMonth(), 1);
            this.selectedDate = date;
        },
        jumpToToday() {
            const today = new Date();
            this.currentViewingDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.selectedDate = today;
        },
        getOrdinalSuffix(number) {
            const suffixes = ['th', 'st', 'nd', 'rd'];
            const v = number % 100;
            return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
        },
        async deleteDate(event) {
            // Todo add event name
            if (!confirm(`"${event.name}" 진짜 지우꼬양~?`)) {
                return;
            }

            try {
                // console.log(event.id);
                if (event.isGroup) {
                    const response = await fetch(url + 'deleteDate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ isGroup: true, groupId: event.groupId })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete date');
                    }
                    // Remove the date from the specialDates array using the groupId
                    this.specialDates = this.specialDates.filter(date => date.groupId !== event.groupId);
                }
                else {
                    const response = await fetch(url + 'deleteDate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ isGroup: false, id: event.id, category: event.category })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete date');
                    }
                    // Remove the date from the specialDates array using the ID
                    this.specialDates = this.specialDates.filter(date => date.id !== event.id);
                }


                // console.log(event);
            } catch (err) {
                console.error('Error deleting date:', err);
                alert('Failed to delete date. Please try again.');
            }
        }
    }
})
