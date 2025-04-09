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
        <div class="card" style="cursor: pointer; height: 100%;">
            <div class="card-image">
                <figure class="image is-4by3">
                    <img :src="image" :alt="name" style="object-fit: cover;">
                </figure>
            </div>
            <div class="card-content">
                <div class="content has-text-centered">
                    <h2 class="title is-4">{{ name }}</h2>
                </div>
            </div>
        </div>
        `
})
