app.component('compliment-generator', {
    template:
        /*html*/
        `
    <div class="compliment-container">
            <div class="bear-container">
                <img 
                    :src="isTalking ? talkingBearImage : idleBearImage" 
                    :alt="isTalking ? 'Talking bear' : 'Idle bear'"
                    class="bear-image"
                />
            </div>
            <div class="speech-bubble" v-show="currentCompliment">
                <p class="compliment-text">{{ currentCompliment }}</p>
            </div>
        </div>
    `,
    data() {
        return {
            isTalking: false,
            currentCompliment: '',
            compliments: [
                "You're doing an amazing job!",
                "Your creativity is inspiring!",
                "You make the office a better place!",
                "Your hard work doesn't go unnoticed!",
                "You're a ray of sunshine!",
                "Your positive attitude is contagious!",
                "You're an incredible team player!",
                "Your dedication is admirable!",
                "You bring out the best in others!",
                "You're making a real difference!"
            ],
            idleBearImage: './assets/images/bear-idle.png',
            talkingBearImage: './assets/images/bear-talking.png',
            timer: null
        }
    },
    methods: {
        generateCompliment() {
            // Get a random compliment
            const randomIndex = Math.floor(Math.random() * this.compliments.length);
            this.currentCompliment = this.compliments[randomIndex];

            // Set talking state
            this.isTalking = true;
        }
    },
    mounted() {
        // Generate first compliment immediately
        this.generateCompliment();

        // Set up interval to generate new compliments
        this.timer = setInterval(() => {
            this.generateCompliment();
        }, 5000);
    },
    beforeUnmount() {
        // Clean up interval when component is destroyed
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
})
