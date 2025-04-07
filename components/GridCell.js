app.component('grid-cell', {
    props: ['food'],
    template:
        /* html */
        `
    <div class="grid-cell">
        <span>{{ food }}</span>
    </div>
    `
})