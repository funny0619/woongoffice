app.component('spin-wheel', {
    data() {
        return {
            currentSpinResult: null,
            spinning: false,
            currentRotation: 0,
            foods: ['Pizza', 'Pasta', 'Salad', 'Soda', 'Ice Cream', 'Cake', 'Coffee', 'Tea', 'Water', 'Soda'],
        }
    },
    methods: {
        spin() {
            if (this.spinning) return;

            this.spinning = true;
            this.currentSpinResult = null;

            // Calculate a random spin between 5-10 full rotations plus a random position
            const spinAngle = 1800 + Math.floor(Math.random() * 1800);
            const finalRotation = this.currentRotation + spinAngle;

            // Figure out which food item will be selected
            const degreesPerItem = 360 / this.foods.length;
            const finalAngle = finalRotation % 360;
            const selectedIndex = Math.floor(((360 - finalAngle) % 360) / degreesPerItem);

            // Animate the wheel
            const wheel = this.$refs.wheel;
            wheel.style.transition = 'transform 5s cubic-bezier(0.2, 0.8, 0.2, 1)';
            wheel.style.transform = `rotate(${finalRotation}deg)`;

            // Update the current rotation for next spin
            this.currentRotation = finalRotation;

            // Set the result after animation completes
            setTimeout(() => {
                this.currentSpinResult = this.foods[selectedIndex];
                this.spinning = false;
            }, 5000);
        },
        generateColorSegments() {
            const colors = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#F8B195', '#F67280'];
            let segments = '';

            const degreesPerItem = 360 / this.foods.length;
            this.foods.forEach((food, index) => {
                const colorIndex = index % colors.length;
                const startAngle = index * degreesPerItem;
                const endAngle = (index + 1) * degreesPerItem;
                segments += `${colors[colorIndex]} ${startAngle}deg ${endAngle}deg,`;
            });

            // Remove the trailing comma
            return segments.slice(0, -1);
        }
    },
    computed: {
        wheelStyle() {
            return {
                backgroundImage: 'conic-gradient(' + this.generateColorSegments() + ')'
            };
        }
    },
    template:
        /* html */
        `
    <div class="spin-wheel-container">
        <h1>Spin Wheel</h1>
        <div class="wheel-container">
            <div class="wheel" ref="wheel" :style="wheelStyle">
                <div v-for="(food, index) in foods" :key="index" class="wheel-item" 
                    :style="{ transform: 'rotate(' + (index * (360 / foods.length)) + 'deg) translateY(-50%)' }">
                    {{ food }}
                </div>
            </div>
            <div class="wheel-pointer"></div>
        </div>
        <button @click="spin" :disabled="spinning">{{ spinning ? 'Spinning...' : 'Spin' }}</button>
        <p v-if="currentSpinResult" class="result">Result: {{ currentSpinResult }}</p>
    </div>
    `
})
