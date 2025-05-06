app.component('random-grid', {
    data() {
        return {
            currentSpinResult: null,
            spinning: false,
            currentIndex: -1,
            allFoods: [
                '순두부',
                '참치 마요',
                '메추리 알',
                '치킨',
                '베트남 국수',
                '떡볶이',
                '만두국',
                '냉면',
                '부대찌개',
                '돈가스',
                '계란찜',
                '고기',
                '칼국수',
                '라멘',
                '중국집',
                '햄버거',
                '피자',
                '파스타',
                '태국 음식',
                '완탕면',
                '김치찌개',
                '감자탕',
                '불고기',
                '순대국',
                '마라탕',
                '중둥 음식',
                '잉글리시 아침',
                '볶으면',
                '제육 볶음',
                '두부 고기',
                '애문상',
                '샌드위치',
                '프렌치 토스트',
                '피넛 버터 토스트',
                '멕시칸',
                '닭도리탕'
            ],
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

            // Always select new random foods when button is clicked
            this.selectRandomFoods();

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