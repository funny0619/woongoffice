app.component('grid-cell', {
    props: {
        food: String,
        isHighlighted: {
            type: Boolean,
            default: false
        }
    },
    template:
        /* html */
        `
    <div class="grid-cell" :class="{ 'highlighted': isHighlighted }">
        <span>{{ food }}</span>
    </div>
    `
})