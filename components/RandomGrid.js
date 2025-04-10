app.component('random-grid', {
    data() {
        return {
            currentSpinResult: null,
            spinning: false,
            currentIndex: -1,
            allFoods: ['피자', '파스타', '순두부', '양꼬치', '백반', '장어', '커피', '두부조림', '아이스크림', '빵'],
            selectedFoods: [],
            highlightedIndex: -1,
            animationSteps: 0,
            currentStep: 0,
            animationInterval: null
        }
    },
    methods: {
        selectRandomFoods() {
            const selectedFoods = [];
            while (selectedFoods.length < 9) {
                const randomIndex = Math.floor(Math.random() * this.allFoods.length);
                const randomFood = this.allFoods[randomIndex];
                if (!selectedFoods.includes(randomFood)) {
                    selectedFoods.push(randomFood);
                }
            }
            this.selectedFoods = selectedFoods;
        },
        startAnimation() {
            if (this.spinning) return;

            // First select random foods if not already selected
            if (this.selectedFoods.length === 0) {
                this.selectRandomFoods();
            }

            this.spinning = true;
            this.currentIndex = -1;
            this.highlightedIndex = -1;
            this.currentStep = 0;
            this.currentSpinResult = null;

            // Generate random number of steps (between 20 and 40)
            this.animationSteps = Math.floor(Math.random() * 20) + 20;

            this.animate();
        },
        animate() {
            const totalSteps = this.animationSteps;
            const startDelay = 50; // Initial delay in ms
            const endDelay = 300; // Final delay in ms

            const animateStep = () => {
                if (this.currentStep >= totalSteps) {
                    clearInterval(this.animationInterval);
                    this.spinning = false;
                    // The final highlighted position determines the selected food
                    this.currentSpinResult = this.selectedFoods[this.highlightedIndex];
                    return;
                }

                // Calculate current delay using easing function
                const progress = this.currentStep / totalSteps;
                const currentDelay = startDelay + (endDelay - startDelay) * Math.pow(progress, 2);

                // Move to next cell
                this.highlightedIndex = (this.highlightedIndex + 1) % 9;
                this.currentStep++;

                // Schedule next step
                this.animationInterval = setTimeout(animateStep, currentDelay);
            };

            // Start animation
            animateStep();
        }
    },
    beforeUnmount() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
    },
    template:
        /* html */
        `
        <div class="random-grid-container">
            <button @click="startAnimation" :disabled="spinning">
                {{ spinning ? '뭐를 먹으깡~?' : '은댕이 음식 골르기!' }}
            </button>

            <div class="grid">
                <grid-cell 
                    v-for="(food, index) in selectedFoods" 
                    :key="food" 
                    :food="food"
                    :is-highlighted="index === highlightedIndex"
                ></grid-cell>
            </div>
            
            <div v-if="currentSpinResult" class="result">
                헤헤헤 오늘은 {{ currentSpinResult }} 먹자!
            </div>
        </div>
    `
})