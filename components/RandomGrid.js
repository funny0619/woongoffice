app.component('random-grid', {
    data() {
        return {
            currentSpinResult: null,
            spinning: false,
            currentRotation: 0,
            allFoods: ['Pizza', 'Pasta', 'Salad', 'Soda', 'Ice Cream', 'Cake', 'Coffee', 'Tea', 'Water', 'Soda'],
            selectedFoods: [],
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
        }
    },
    template:
        /* html */
        `
        <div class="random-grid-container">
            <button @click="selectRandomFoods">Select Random Foods</button>

            <div class="grid">
                <grid-cell v-for="food in selectedFoods" :key="food" :food="food"></grid-cell>
            </div>
        </div>
    `
})