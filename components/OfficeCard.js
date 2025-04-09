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
        <div class="card" style="cursor: pointer; height: 100%; box-shadow: 0 2px 3px rgba(0,0,0,0.1);">
            <div class="card-image">
                <figure class="image is-3by2">
                    <img :src="image" :alt="name" style="object-fit: cover;">
                </figure>
            </div>
            <div class="card-content p-3">
                <div class="content has-text-centered">
                    <h2 class="title is-5">{{ name }}</h2>
                </div>
            </div>
        </div>
        `
})
