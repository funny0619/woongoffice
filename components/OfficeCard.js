app.component('office-card', {
    props: {
        name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        }
    },
    template:
        /* html */
        `
        <div class="office-card">
            <img :src="image" class="office-card-image" />
            <h2 class="office-card-name">{{ name }}</h2>
        </div>
        `
})
