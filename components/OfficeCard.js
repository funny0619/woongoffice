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
        <div class="card office-card" style="cursor: pointer; height: 100%; box-shadow: 0 2px 3px rgba(0,0,0,0.1);">
            <div class="office-card-image-container">
                <img :src="image" :alt="name" class="office-card-image">
            </div>
            <div class="office-card-text-container">
                <div class="content has-text-centered">
                    <h2 class="title is-5">{{ name }}</h2>
                </div>
            </div>
        </div>
        `
})
