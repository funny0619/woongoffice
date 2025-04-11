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
                "은댕앙!💖 아가는 모든지 할 수 있어! 😄",
                "아강~ 웅이는 항상 은댕이 편이양!😘 아가눈 하고 싶은거 다해!",
                "가끔 힘들고 지쳐도 아가눈 보면 잘 견뎠어 너무 대단해 🤗💪",
                "은댕앙! 사랑행❤️! 영원히✨! ",
                "나랑 같아 있어줘서 너무 고마웡~ 🤗",
                "아가 없이는 나 너무 힘들었을거양~ 🥰 나두 아가한테 그런 존재가 되길 노력하껭! 🙏",
                "가끔은 쉬어도 돼😴! 아가 체력 챙기는거는 시간 낭비가 아니니까 조금만 쉬엉~🌸",
                "아가 오늘도 너무 멋있고 예쁘고 귀여워🥳~ 오늘도 너무 너무 사랑해❤️!",
            ],
            idleBearImage: './assets/images/bear-idle-min.png',
            talkingBearImage: './assets/images/bear-talking-min.png',
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
