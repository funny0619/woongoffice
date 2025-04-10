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
                <p class="compliment-text">{{ displayedText }}</p>
            </div>
        </div>
    `,
    data() {
        return {
            isTalking: false,
            currentCompliment: '',
            displayedText: '',
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
            timer: null,
            typingInterval: null,
            animationInterval: null,
            typingSpeed: 100, // milliseconds per word
            animationSpeed: 150 // milliseconds per image switch
        }
    },
    methods: {
        generateCompliment() {
            // Get a random compliment
            const randomIndex = Math.floor(Math.random() * this.compliments.length);
            this.currentCompliment = this.compliments[randomIndex];
            this.displayedText = '';

            // Start typing effect
            this.startTyping();
        },
        startTyping() {
            // Clear any existing intervals
            if (this.typingInterval) {
                clearInterval(this.typingInterval);
            }
            if (this.animationInterval) {
                clearInterval(this.animationInterval);
            }

            // Start talking animation
            this.isTalking = true;
            this.animationInterval = setInterval(() => {
                this.isTalking = !this.isTalking;
            }, this.animationSpeed);

            const words = this.currentCompliment.split(' ');
            let currentIndex = 0;

            this.typingInterval = setInterval(() => {
                if (currentIndex < words.length) {
                    this.displayedText += (currentIndex === 0 ? '' : ' ') + words[currentIndex];
                    currentIndex++;
                } else {
                    // Ensure bear is in talking state before stopping
                    this.isTalking = true;
                    clearInterval(this.animationInterval);

                    // Add a small delay before returning to idle
                    setTimeout(() => {
                        this.isTalking = false;
                    }, 500);

                    clearInterval(this.typingInterval);
                }
            }, this.typingSpeed);
        }
    },
    mounted() {
        // Generate first compliment immediately
        this.generateCompliment();

        // Set up interval to generate new compliments
        this.timer = setInterval(() => {
            this.generateCompliment();
        }, 8000); // Increased interval to account for typing animation
    },
    beforeUnmount() {
        // Clean up intervals when component is destroyed
        if (this.timer) {
            clearInterval(this.timer);
        }
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
        }
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
    }
})
