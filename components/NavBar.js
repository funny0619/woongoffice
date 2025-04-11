app.component('nav-bar', {
    props: {
        title: {
            type: String,
            required: true
        }
    },
    template:
        /*html*/
        `
    <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item home-button" href="./index.html">
                <span class="icon">
                    <img src="./assets/images/home.png" alt="Home">
                </span>
            </a>
            <a class="navbar-item title-item" href="./index.html">
                <h2 class="title is-5">{{ title }}</h2>
            </a>
        </div>
    </nav>
    `
})

